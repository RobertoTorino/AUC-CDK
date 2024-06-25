
Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line max-len
exports.prefix = exports.data;
exports.print = exports.highlight;
exports.success = exports.warning;
exports.error = exports.debug;
exports.trace = exports.increaseVerbosity;
exports.setCI = exports.setLogLevel;
exports.CI = exports.logLevel;
exports.LogLevel = undefined;
const util = require('util');
const chalk = require('chalk');

const { stdout, stderr } = process;
// eslint-disable-next-line max-len
const logger = (stream: (NodeJS.WriteStream & { fd: 2; }) | (NodeJS.WriteStream & { fd: 1; }), styles: any[] | undefined) => (fmt: any, ...args: any) => {
  let str = util.format(fmt, ...args);
  if (styles && styles.length) {
    str = styles.reduce((a, style) => style(a), str);
  }

  const realStream = typeof stream === 'function' ? stream : stream;
  realStream.write(`${str}\n`);
};

let LogLevel: { DEFAULT: any; TRACE: number; DEBUG: number; };
// eslint-disable-next-line no-unused-vars
(function logLevelValue(p: {}) {
  console.info(p);
  exports.LogLevel.DEFAULT = 'DEFAULT';
  exports.LogLevel.DEBUG = 'DEBUG';
  exports.LogLevel.TRACE = 'TRACE';
}(LogLevel = exports.LogLevel || (exports.LogLevel = {})));
exports.logLevel = LogLevel.DEFAULT;
exports.CI = false;

function setLogLevel(newLogLevel: any) {
  exports.logLevel = newLogLevel;
}

exports.setLogLevel = setLogLevel;

function setCI(newCI: any) {
  exports.CI = newCI;
}

exports.setCI = setCI;

function increaseVerbosity() {
  exports.logLevel += 1;
}

exports.increaseVerbosity = increaseVerbosity;
const stream = () => (exports.CI ? stdout : stderr);
const debug = logger(stream(), [chalk.gray]);
exports.trace = (fmt: any, ...args: any) => exports.logLevel >= LogLevel.TRACE && debug(fmt, ...args);
exports.debug = (fmt: any, ...args: any) => exports.logLevel >= LogLevel.DEBUG && debug(fmt, ...args);
exports.error = logger(stderr, [chalk.red]);
exports.warning = logger(stream(), [chalk.yellow]);
exports.success = logger(stream(), [chalk.green]);
exports.highlight = logger(stream(), [chalk.bold]);
exports.print = logger(stream(), [chalk.white]);
exports.data = logger(stdout, [chalk.white]);

function prefix(prefixString: any, fn: (arg0: string, arg1: any, arg2: any) => any) {
  return (fmt: any, ...args: any) => fn(`%s ${fmt}`, prefixString, args);
}

exports.prefix = prefix;
