#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { getEnvVar } from "../lib/utils";
import FargateStack from "../lib/fargate-stack";
import RepoStack from "../lib/repo-stack";

const repositoryName = getEnvVar("REPOSITORY");
const app = new cdk.App();
const repoStack = new RepoStack(app, "resume-repo", { repositoryName });
const fargateStack = new FargateStack(app, "resume", {
  repositoryName,
  gitTag: getEnvVar("GIT_TAG", "latest"),
  env: {
    account: getEnvVar("AWS_ACCOUNT_ID"),
    region: getEnvVar("AWS_DEFAULT_REGION", "us-east-1"),
  },
});
fargateStack.addDependency(repoStack)
