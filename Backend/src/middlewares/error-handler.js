const _ = require('lodash');
const winston = require('winston');
const { error } = require('../helpers/response.helper');
const {errorNotifyService} = require('../services');

// eslint-disable-next-line consistent-return,no-unused-vars
module.exports = async (err, req, res, next) => {
  winston.error(`[ErrorHandler] ${req.url} error: ${err}`);

  // Send 500 error to Slack.
  if (_.get(err.output, 'httpStatusCode', 500) === 500) {
    errorNotifyService.init(req);
    errorNotifyService.sendError(err, req)
      .catch((e) => {
        winston.error(`[ErrorHandler] ${req.url} error: ${e}`);
      });
  }

  return error(req, res, err);
};
