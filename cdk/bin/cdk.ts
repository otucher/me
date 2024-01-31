#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import FargateStack from "../lib/fargate-stack";
import RepoStack from "../lib/repo-stack";

const throwError = (msg: string) => { throw new Error(msg) }

const app = new cdk.App();
const repositoryName = "resume";
new RepoStack(app, "resume-repo", { repositoryName });
new FargateStack(app, "resume", {
  repositoryName,
  gitTag: process.env.GIT_TAG ?? throwError("$GIT_TAG must be defined")
});
