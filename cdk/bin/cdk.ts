#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import MeStack from "../lib/me-stack";

const throwError = (msg: string) => { throw new Error(msg) }

const app = new cdk.App();
new MeStack(app, "me", {
  repositoryName: "me-server",
  gitTag: process.env.GIT_TAG ?? throwError("$GIT_TAG must be defined")
});
