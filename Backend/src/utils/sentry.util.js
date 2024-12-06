const _ = require('lodash');
const Sentry = require('@sentry/node');
const {
  getCurrentHub
} = require('@sentry/node');

const {
  APP_NAME,
  NODE_ENV,
  SENTRY_DSN
} = process.env;

const SentryUtil = module.exports;

SentryUtil.init = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: NODE_ENV,
  });
};

/**
 * Set tag and context based on request
 *
 * @param {Request} req
 */
SentryUtil.enhanceScopeWithEnvironmentData = (req) => {
  const hub = getCurrentHub();
  const scope = hub.pushScope();

  scope.setTag('service_name', APP_NAME);
  scope.setTag('request_id', _.get(req, 'requestId', '-'));
  scope.setTag('end_point', `${_.get(req, 'path')}`);
  scope.setTag('http_method', `${_.get(req, 'method')}`);

  scope.setContext('runtime', {
    name: 'node',
    version: global.process.version,
  });
};

/**
 * Capture exception
 *
 * @param {Error} error
 * @param {Object} context
 * @param {String} level
 */
SentryUtil.captureException = (error, context, level = 'error') => {
  if (error && _.has(error, 'output.internalMessage')) {
    error.message = _.get(error, 'output.internalMessage');
  }

  Sentry.captureException(error, (scope) => {
    scope.setLevel(level);
    scope.setTag('error_code', `${_.get(error, 'output.id')}`);
    scope.setTag('error_message', `${_.get(error, 'output.internalMessage')}`);
    scope.setExtra('Request', _.get(context, 'request', {}));
    scope.setExtra('Response', _.get(context, 'response', {}));

    return scope;
  });
};

/**
 * Close
 * @param {Int} timeout Maximum time in ms the client should wait.
 */
SentryUtil.flush = (timeout = 2000) => Sentry.flush(timeout);
