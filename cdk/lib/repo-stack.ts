import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";

interface Props extends cdk.StackProps {
  repositoryName: string;
}

export default class EcrStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    new ecr.Repository(this, "repository", { repositoryName: props.repositoryName });
  }
}
