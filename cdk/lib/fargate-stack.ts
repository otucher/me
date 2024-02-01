import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as r53Targets from "aws-cdk-lib/aws-route53-targets";

interface Props extends cdk.StackProps {
  repositoryName: string;
  gitTag: string;
}

export default class FargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    console.log(props);

    // create vpc
    const vpc = new ec2.Vpc(this, "vpc", {
      vpcName: id,
    });

    // create cluster
    const cluster = new ecs.Cluster(this, "cluster", {
      clusterName: "resume",
      vpc,
      enableFargateCapacityProviders: true,
    });

    // create task definition
    const executionRole = new iam.Role(this, 'task-def-execution-role', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    const taskDefinition = new ecs.FargateTaskDefinition(this, "task-definition", {
      family: id,
      executionRole,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.X86_64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
    });

    // Get repository and allow pull access from task definition
    const repository = ecr.Repository.fromRepositoryName(this, "repository", id)
    repository.grantPull(executionRole);

    // create log group
    const logGroup = new logs.LogGroup(this, "log-group", { logGroupName: id });

    // add client container to task definition
    const clientContainer = taskDefinition.addContainer("client-container", {
      containerName: `${id}-client`,
      essential: true,
      image: ecs.ContainerImage.fromEcrRepository(repository, `client-${props.gitTag}`),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: `${id}-client`,
        logGroup,
      }),
      portMappings: [{ containerPort: 80, hostPort: 80 }],
      healthCheck: {
        command: ["CMD-SHELL", `curl -f http://localhost:80/ || exit 1`],
      },
    });

    // add server container to task definition
    // TODO: health check
    const serverContainer = taskDefinition.addContainer("server-container", {
      containerName: `${id}-server`,
      essential: true,
      image: ecs.ContainerImage.fromEcrRepository(repository, `server-${props.gitTag}`),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: `${id}-server`,
        logGroup,
      }),
      portMappings: [{ containerPort: 8000, hostPort: 8000 }],
      healthCheck: {
        command: ["CMD-SHELL", `curl -f http://localhost:8000/health || exit 1`],
      },
    });

    // create client fargate service
    const fargateService = new ecs.FargateService(this, "client-fargate-service", {
      serviceName: id,
      cluster,
      desiredCount: 1,
      taskDefinition,
      capacityProviderStrategies: [
        { capacityProvider: "FARGATE_SPOT", weight: 4 },
        { capacityProvider: "FARGATE", weight: 1 },
      ],
    });

    // Create Load Balancer to forward traffic to client
    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, "load-balancer", {
      loadBalancerName: id,
      vpc,
      internetFacing: true,
    });

    // Create custom URL
    const hostedZone = new r53.PublicHostedZone(this, 'hosted-zone', {
      zoneName: `${id}.com`,
    });
    const recordName = 'oliver-tucher';
    new r53.ARecord(this, 'alias-record', {
      recordName,
      target: r53.RecordTarget.fromAlias(new r53Targets.LoadBalancerTarget(loadBalancer)),
      zone: hostedZone,
    });
    new cdk.CfnOutput(this, "URL", { value: `https://${recordName}.${hostedZone.zoneName}` });

    // Add fargate service to load balancer
    const clientTargetGroup = new elbv2.ApplicationTargetGroup(this, "target-group", {
      targetGroupName: `${id}-client`,
      vpc,
      port: 80,
      targets: [fargateService.loadBalancerTarget(clientContainer)],
    });

    // Add HTTPS listener
    const certificate = new acm.Certificate(this, "certificate", {
      domainName: hostedZone.zoneName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
    loadBalancer.addListener("https-listener", {
      port: 443,
      certificates: [certificate],
      defaultAction: elbv2.ListenerAction.forward([clientTargetGroup])
    });

    // Redirect HTTP to HTTPS
    loadBalancer.addRedirect({
      sourceProtocol: elbv2.ApplicationProtocol.HTTP,
      sourcePort: 80,
      targetProtocol: elbv2.ApplicationProtocol.HTTPS,
      targetPort: 443,
    });
  }
}
