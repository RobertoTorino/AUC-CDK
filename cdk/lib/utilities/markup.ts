Object.defineProperty(exports, '__esModule', { value: true });

exports.notifyMarkup = undefined;

// eslint-disable-next-line import/no-extraneous-dependencies
const stripAnsi = require('strip-ansi');

export function markup(messages: any[]) {
  const printMessagesLength = (string: string) => stripAnsi(string).length;
  if (messages.length === 0) {
    return [];
  }
  const notifyMarkupLeft = '=== ';
  const notifyMarkupRight = ' ===';
  const notifyMarkupMessageLength = printMessagesLength(notifyMarkupLeft) + printMessagesLength(notifyMarkupRight)
      + messages.reduce((accumulator, message) => Math.max(accumulator, printMessagesLength(message)), 0);
  const notifyMarkupRows = [];
  notifyMarkupRows.push('='.repeat(notifyMarkupMessageLength));
  // wrap too long message
  messages.forEach((msg) => {
    const filling = ' '.repeat(notifyMarkupMessageLength - (printMessagesLength(msg) + printMessagesLength(notifyMarkupLeft) + printMessagesLength(notifyMarkupRight)));
    notifyMarkupRows.push(''.concat(notifyMarkupLeft, msg, filling, notifyMarkupRight));
  });
  notifyMarkupRows.push('='.repeat(notifyMarkupMessageLength));
  return notifyMarkupRows;
}

exports.notifyMarkup = markup;
