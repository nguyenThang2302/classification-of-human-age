const _ = require('lodash');

const {
  SLACK_HOOK,
  SLACK_DEBUG_HOOK,
  DEBUG_MODE,
  ERROR_CHANNEL
} = process.env;
const {
  InternalServerError,
  ValidationError
} = require('../errors');
const {
  logger
} = require('../utils/logger.util');
const SlackUtil = require('../utils/slack.util');
const SentryUtil = require('../utils/sentry.util');

const ErrorNotifyService = module.exports;

ErrorNotifyService.init = (event) => {
  if (ERROR_CHANNEL === 'sentry') {
    SentryUtil.init();
    SentryUtil.enhanceScopeWithEnvironmentData(event);
  }
};

/**
 * Send error
 * @param {Error} error
 * @param {Object} context
 * @return {Promise}
 */
ErrorNotifyService.sendError = (error, context) => {
  if (error.name === InternalServerError.name) {
    context.error = error.stack;
  }

  if (error.name !== ValidationError.name) {
    logger.error({ ...context });
  }

  switch (ERROR_CHANNEL) {
    case 'sentry':
      return this.sendErrorToSentry(error, context);
    case 'slack':
      return this.sendErrorToSlack(error, context);
    default:
      return Promise.resolve(true);
  }
};

/**
 * Send error to slack
 * @param {Error} error
 * @param {Object} context
 * @return {Promise}
 */
ErrorNotifyService.sendErrorToSlack = (error, context) => {
  const promises = [];

  // Notify
  if (error.name === InternalServerError.name) {
    promises.push(SlackUtil.sendError(SLACK_HOOK, context));
  }

  if (error.name !== ValidationError.name) {
    // Debug notify
    if (_.isEqual(_.toString(DEBUG_MODE), 'true')) {
      promises.push(SlackUtil.sendError(SLACK_DEBUG_HOOK, context));
    }
  }

  return Promise.all(promises);
};

/**
 * Send error to sentry
 * @param {Error} error
 * @param {Object} context
 * @return {Promise}
 */
ErrorNotifyService.sendErrorToSentry = (error, context) => {
  const statusCode = _.get(error.output, 'httpStatusCode', 500);
  // Notify
  if (error.name === InternalServerError.name) {
    SentryUtil.captureException(error, context);
  }

  if (statusCode === 500) {
    SentryUtil.captureException(error, context);
  }

  if (error.name !== ValidationError.name) {
    // Debug notify
    if (_.isEqual(_.toString(DEBUG_MODE), 'true')) {
      SentryUtil.captureException(error, context, 'debug');
    }
  }

  return SentryUtil.flush();
};
