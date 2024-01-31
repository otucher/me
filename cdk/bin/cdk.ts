#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import FargateStack from "../lib/fargate-stack";
import RepoStack from "../lib/repo-stack";

const throwError = (msg: string) => { throw new Error(msg) }

const app = new cdk.App();
const repositoryName = process.env.REPOSITORY ?? throwError("$REPOSITORY must be defined");
const repoStack = new RepoStack(app, "resume-repo", { repositoryName });
const fargateStack = new FargateStack(app, "resume", {
  repositoryName,
  gitTag: process.env.GIT_TAG ?? throwError("$GIT_TAG must be defined")
});
fargateStack.addDependency(repoStack)
