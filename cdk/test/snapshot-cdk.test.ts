import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AuCoreCdkVersionCheckStack } from '../lib/cdk-check';

const app = new cdk.App();
test('Matches SnapShot', () => {
  const cdkStack = new cdk.Stack(app, 'CdkTestStack');
  new AuCoreCdkVersionCheckStack(cdkStack, 'TestFunction', {
    terminationProtection: false,
    analyticsReporting: true,
  });
  const cdkTestStackOutput = app.synth().getStackArtifact('CdkTestStack').template;
  expect(Template.fromJSON(cdkTestStackOutput)).toMatchSnapshot();
});
