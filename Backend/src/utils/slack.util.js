const _ = require('lodash');
const winston = require('winston');
const { IncomingWebhook } = require('@slack/webhook');

const {
  APP_NAME,
  NODE_ENV
} = process.env;

const SlackUtil = module.exports;

SlackUtil.sendMessage = (slackToken, message) => {
  const slack = new IncomingWebhook(slackToken || '');

  return new Promise((resolve, reject) => {
    try {
      slack.send({
        attachments: [
          {
            text: message,
            color: '#764FA5'
          }
        ]
      }).then((item) => {
        resolve(item);
      });
    } catch (e) {
      winston.error(`[SlackUtil] Error: ${e}`);
      reject(e);
    }
  });
};

SlackUtil.sendError = (slackHook, context) => SlackUtil.sendMessage(
  slackHook,
  `
    :fire: *[${APP_NAME}][${NODE_ENV}]*\n
    *API*: \`${_.get(context, 'api', '')}\`
    *Message:* \`${_.get(context, 'message', '')}\`\n
    *Request:* \`\`\`${JSON.stringify(_.get(context, 'request', {}))}\`\`\`\n
    *Response:* \`\`\`${JSON.stringify(_.get(context, 'response', {}))}\`\`\`\n
    *Error:* \`\`\`${_.get(context, 'error')}\`\`\`
    `
);
