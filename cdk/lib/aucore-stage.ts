import {
  Aspects,
  DefaultStackSynthesizer,
  Stage,
  StageProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { env } from '../bin';
import { PathTagger } from './utilities/pathtag';
import {
  addTags,
  Environment,
} from './utilities/variables';
import { AuCoreCdkVersionCheckStack } from './cdk-check';
import { AuCoreCdkLibVersionCheckStack } from './cdk-lib-check';
import { AuCdkCfnDiffVersionCheckStack } from './cdk-cloudformation-diff';

export class AuCoreStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    // AWS-CDK Check Stack
    const auCoreCdkVersionCheckStack = new AuCoreCdkVersionCheckStack(
      this,
      'AuCoreCdkVersionCheckStack',
      {
        synthesizer: new DefaultStackSynthesizer({
          generateBootstrapVersionRule: false,
          // Name of the S3 bucket for file assets
          bucketPrefix: 'auc-aws',
        }),
        stackName: 'AuCoreCdkVersionCheckStack',
        description: 'Stack for AWS-CDK version check app.',
        env,
      },
    );
    Aspects.of(auCoreCdkVersionCheckStack).add(new PathTagger());
    addTags(auCoreCdkVersionCheckStack, Environment.dev);

    // AWS-CDK-LIB Check Stack
    const auCoreCdkLibVersionCheckStack = new AuCoreCdkLibVersionCheckStack(
      this,
      'AuCoreCdkLibVersionCheckStack',
      {
        synthesizer: new DefaultStackSynthesizer({
          generateBootstrapVersionRule: false,
          // Name of the S3 bucket for file assets
          bucketPrefix: 'auc-core',
        }),
        stackName: 'AuCoreCdkLibVersionCheckStack',
        description: 'Stack for aws-cdk-lib version check',
        env,
      },
    );
    Aspects.of(auCoreCdkLibVersionCheckStack).add(new PathTagger());
    addTags(auCoreCdkLibVersionCheckStack, Environment.dev);

    // AWS-CLOUDFORMATION-DIFF Check Stack
    const auCfnDiffStack = new AuCdkCfnDiffVersionCheckStack(
      this,
      'AuCdkCfnDiffVersionCheckStack',
      {
        synthesizer: new DefaultStackSynthesizer({
          generateBootstrapVersionRule: false,
          // Name of the S3 bucket for file assets
          bucketPrefix: 'auc-core',
        }),
        stackName: 'AuCfnDiffStack',
        description: 'Stack for aws-cdk-lib version check',
        env,
      },
    );
    Aspects.of(auCfnDiffStack).add(new PathTagger());
    addTags(auCfnDiffStack, Environment.dev);
  }
}
