import {
  aws_cloudformation, Stack, Tags,
} from 'aws-cdk-lib';

export enum Environment {
  prod = 'prod',
  dev = 'dev'
}

export const construct = 'au-core-cdk';

export const addTags = (stack: Stack, environment: Environment) => {
  Tags.of(stack).add('construct', construct, {
    applyToLaunchedInstances: true,
    priority: 100,
    includeResourceTypes: [],
  });
  Tags.of(stack).add('environment', environment, {
    applyToLaunchedInstances: true,
    priority: 100,
    includeResourceTypes: [],
  });
  Tags.of(stack).add('stackname', stack.stackName, {
    applyToLaunchedInstances: true,
    priority: 100,
    includeResourceTypes: [],
  });
};

export const stackNameValidation = (thisStackName: typeof aws_cloudformation.CfnStack.name) => {
  if (thisStackName.length > 20) {
    throw new Error(`Validate: stackname must be <= 16 characters. Stack name: '${thisStackName}'`);
  }
  const nameSyntaxValidation = /^.*$/;
  if (!nameSyntaxValidation.test((thisStackName))) {
    throw new Error(`Validate: stackname must match the regular expression: ${nameSyntaxValidation.toString()}, got '${thisStackName}'`);
  }
};

