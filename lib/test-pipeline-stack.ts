import { Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import * as pipelines from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class MyPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, "Pipeline1", {
      pipelineName: "RadTestPipeline",
      crossAccountKeys: true,
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.gitHub(
          "akefirad/test-pipeline",
          "main"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    pipeline.addStage(
      new MyPipelineStage(this, "Stage1", {
        env: {
          account: "388531472195",
          region: "eu-central-1",
        },
      })
    );
  }
}

class MyPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new MyLambdaStack(this, "Lambda1", {});
    // new MyLambdaStack(this, "Lambda2", {});
  }
}

export class MyLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Function(this, "LambdaFunction", {
      runtime: Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
    });
  }
}
