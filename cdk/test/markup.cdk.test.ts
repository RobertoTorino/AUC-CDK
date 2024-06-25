import chalk from 'chalk';
import 'source-map-support/register';

const notificationMarkup = require('../lib/utilities/markup');

test('no markup row if there is no message in the list', () => expect(notificationMarkup.notifyMarkup([])).toEqual([]));

test('standard message produces a default markup row', () => expect(notificationMarkup.notifyMarkup([
  'messages1',
  'messages2',
])).toEqual([
  '=================',
  '=== messages1 ===',
  '=== messages2 ===',
  '=================',
]));

test('notification markup row works with a colored message', () => expect(notificationMarkup.notifyMarkup([
  'hello messages1',
  chalk.yellow('hello messages2'),
  chalk.bold('hello messages3'),
])).toEqual([
  '=======================',
  '=== hello messages1 ===',
  `=== ${chalk.yellow('hello messages2')} ===`,
  `=== ${chalk.bold('hello messages3')} ===`,
  '=======================',
]));
