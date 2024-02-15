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
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as sm from "aws-cdk-lib/aws-secretsmanager";

interface Props extends cdk.StackProps {
  repository: ecr.IRepository;
  gitTag: string;
  cognitoSecret: sm.ISecret;
}

export default class FargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    console.log(props);

    // get vpc
    const vpc = new ec2.Vpc(this, "vpc", {
      vpcName: id,
    });

    // create cluster
    const cluster = new ecs.Cluster(this, "cluster", {
      clusterName: id,
      vpc,
      enableFargateCapacityProviders: true,
    });

    // create task definition
    const executionRole = new iam.Role(this, "task-def-execution-role", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
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
    props.repository.grantPull(executionRole);

    // allow access to cognito secret
    props.cognitoSecret.grantRead(taskDefinition.taskRole);

    // create log group
    const logGroup = new logs.LogGroup(this, "log-group", {
      logGroupName: id,
      retention: logs.RetentionDays.SIX_MONTHS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // add client container to task definition
    const clientContainer = taskDefinition.addContainer("client-container", {
      containerName: `${id}-client`,
      essential: true,
      image: ecs.ContainerImage.fromEcrRepository(props.repository, `client-${props.gitTag}`),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: `${id}-client`,
        logGroup,
      }),
      portMappings: [{ hostPort: 80, containerPort: 80 }],
      healthCheck: {
        command: ["CMD-SHELL", `curl -f http://localhost:80/health || exit 1`],
      },
    });

    // add server container to task definition
    const serverContainer = taskDefinition.addContainer("server-container", {
      containerName: `${id}-server`,
      essential: true,
      image: ecs.ContainerImage.fromEcrRepository(props.repository, `server-${props.gitTag}`),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: `${id}-server`,
        logGroup,
      }),
      portMappings: [{ hostPort: 8000, containerPort: 8000 }],
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
    const hostedZone = r53.PublicHostedZone.fromLookup(this, "hosted-zone", {
      domainName: "oliver-tucher.com",
    });
    new r53.ARecord(this, "alias-record", {
      recordName: "resume",
      target: r53.RecordTarget.fromAlias(new r53Targets.LoadBalancerTarget(loadBalancer)),
      zone: hostedZone,
    });
    new cdk.CfnOutput(this, "URL", { value: `https://resume.${hostedZone.zoneName}` });

    // Add HTTPS
    const acmParameter = ssm.StringParameter.fromStringParameterName(
      this,
      "acm-parameter",
      "/acm/oliver.tucher.com/arn",
    );
    const certificate = acm.Certificate.fromCertificateArn(this, "certificate", acmParameter.stringValue);
    loadBalancer.addRedirect({
      sourceProtocol: elbv2.ApplicationProtocol.HTTP,
      sourcePort: 80,
      targetProtocol: elbv2.ApplicationProtocol.HTTPS,
      targetPort: 443,
    });

    // create load balancer path to client
    const clientTargetGroup = new elbv2.ApplicationTargetGroup(this, "client-target-group", {
      targetGroupName: `${id}-client`,
      vpc,
      port: 80,
      targets: [fargateService.loadBalancerTarget(clientContainer)],
      healthCheck: { path: "/health" },
    });
    const listener = loadBalancer.addListener("https-listener", {
      port: 443,
      certificates: [certificate],
      defaultAction: elbv2.ListenerAction.forward([clientTargetGroup]),
    });

    // create load balancer to client
    const serverTargetGroup = new elbv2.ApplicationTargetGroup(this, "server-target-group", {
      targetGroupName: `${id}-server`,
      vpc,
      port: 80,
      targets: [fargateService.loadBalancerTarget(serverContainer)],
      healthCheck: { path: "/health" },
    });
    listener.addAction("server-action", {
      conditions: [elbv2.ListenerCondition.pathPatterns(["/api/*"])],
      priority: 1,
      action: elbv2.ListenerAction.forward([serverTargetGroup]),
    });
  }
}
