#!/usr/bin/env node
import {
  App,
  Aspects,
  DefaultStackSynthesizer,
} from 'aws-cdk-lib';
import {
  addTags,
  Environment,
  stackNameValidation,
} from '../lib/utilities/variables';
import { PathTagger } from '../lib/utilities/pathtag';
import { AuCorePipelineStack } from '../lib/aucore-pipeline-stack';

const app = new App();

export const env = {
  account: process.env.CDK_SYNTH_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_SYNTH_REGION || process.env.CDK_DEFAULT_REGION,
};

export const auCorePipelineStack = new AuCorePipelineStack(app, 'AuCorePipelineStack', {
  terminationProtection: false,
  analyticsReporting: true,
  synthesizer: new DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
    bucketPrefix: 'au-core',
  }),
  stackName: 'AuCorePipelineStack',
  description: 'Pipeline stack for the auto upgrade core CDK construct',
  env,
});
Aspects.of(auCorePipelineStack).add(new PathTagger());
addTags(auCorePipelineStack, Environment.dev);
stackNameValidation('AuCorePipelineStack');

// Show the actual AWS account id and region
console.log(`\x1B[1;34mAWS REGION: ${env.region}`);
console.log(`\x1B[1;34mAWS ACCOUNT-ID: ${env.account}`);

const { exec } = require('child_process');

exec(
  'aws iam list-account-aliases --query AccountAliases --output text || exit',
  (error: { message: any; }, stdout: string, stderr: any) => {
    if (error) {
      console.error(`Error: ${stderr}`);
    }
    const myAccountAlias = stdout.trimEnd();
    console.log(`\x1B[1;34mAWS ACCOUNT-ALIAS: ${myAccountAlias.toUpperCase()}`);

    exec(
      'aws codestar-connections list-connections --query "Connections[].ConnectionArn" --output text',
      (error: { message: any; }, stdout: string, stderr: any) => {
        if (error) {
          console.error(`Error: ${stderr}`);
        }
        const myCodeStarArn = stdout.trimEnd();
        console.log(`\x1B[1;34mAWS CODESTAR-ARN: ${myCodeStarArn}`);
      },
    );
  },
);
