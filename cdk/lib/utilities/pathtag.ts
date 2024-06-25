import { IConstruct } from 'constructs';
import { IAspect, Tag } from 'aws-cdk-lib';

export class PathTagger implements IAspect {
  // eslint-disable-next-line class-methods-use-this
  visit(node: IConstruct) {
    new Tag('aws-cdk-path', node.node.path).visit(node);
  }
}
