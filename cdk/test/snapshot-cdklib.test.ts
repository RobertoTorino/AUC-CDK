import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AuCoreCdkLibVersionCheckStack } from '../lib/cdk-lib-check';

const app = new cdk.App();

test('Matches SnapShot', () => {
  const cdkLibStack = new cdk.Stack(app, 'CdkLibTestStack');
  new AuCoreCdkLibVersionCheckStack(cdkLibStack, 'TestFunction', {
    terminationProtection: false,
    analyticsReporting: true,
  });
  const cdkLibTestStackOutput = app.synth().getStackArtifact('CdkLibTestStack').template;
  expect(Template.fromJSON(cdkLibTestStackOutput)).toMatchSnapshot();
});
