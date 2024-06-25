import { App } from 'aws-cdk-lib';
import { AuCoreCdkVersionCheckStack } from '../lib/cdk-check';
import { AuCoreCdkLibVersionCheckStack } from '../lib/cdk-lib-check';

describe('Synthesize tests', () => {
  const app = new App();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  let aucCdkStack: AuCoreCdkVersionCheckStack;

  test('Creates the stack without exceptions', () => {
    expect(() => {
      aucCdkStack = new AuCoreCdkVersionCheckStack(app, 'TestCdkStack', {
        terminationProtection: false,
      });
    }).not.toThrow();
  });

  test('This app can synthesize completely', () => {
    expect(() => {
      app.synth();
    }).not.toThrow();
  });

  describe('Synthesize tests', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    let aucCdkLibStack: AuCoreCdkLibVersionCheckStack;

    test('Creates the stack without exceptions', () => {
      expect(() => {
        aucCdkLibStack = new AuCoreCdkLibVersionCheckStack(app, 'TestCdkLibStack', {
          terminationProtection: false,
        });
      }).not.toThrow();
    });

    test('This app can synthesize completely', () => {
      expect(() => {
        app.synth();
      }).not.toThrow();
    });
  });
});
