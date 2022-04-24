#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { MyPipelineStack } from "../lib/test-pipeline-stack";

const app = new cdk.App();

new MyPipelineStack(app, "RadTestPipelineStack", {
  env: {
    account: "841731033082",
    region: "eu-central-1",
  },
});

app.synth();
