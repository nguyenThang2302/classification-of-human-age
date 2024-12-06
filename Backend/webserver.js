require('dotenv').config();
require('./src/i18n');
const express = require('express');
const winston = require('winston');
const async = require('async');

const app = express();
const DailyRotateFile = require('winston-daily-rotate-file');
const routes = require('./src/routes');
const middleware = require('./src/middlewares');
const errorHandler = require('./src/middlewares/error-handler');
const { AppDataSource } = require('./src/database/ormconfig');

function setupWinston() {
  if (!winston.format) return;

  const formats = [];
  const auditLogFormats = [];
  const timestampFormat = winston.format((info) => {
    const dateString = `${new Date().toISOString()} [${global.process.pid}]`;

    info.level = `${dateString} - ${info.level}`;

    return info;
  });

  formats.push(winston.format.colorize());
  formats.push(timestampFormat());
  formats.push(winston.format.splat());
  formats.push(winston.format.simple());

  auditLogFormats.push(timestampFormat());
  auditLogFormats.push(winston.format.splat());
  auditLogFormats.push(winston.format.simple());

  winston.configure({
    level: process.env.LOG_LEVEL || 'verbose',
    format: winston.format.combine.apply(null, formats),
    transports: [
      new winston.transports.Console({
        handleExceptions: true
      }),
      new DailyRotateFile({
        handleExceptions: true,
        filename: 'logs/%DATE%-access.log',
        datePattern: 'YYYY-MM-DD',
      })
    ]
  });

  winston.loggers.add('auditLog', {
    format: winston.format.combine.apply(null, auditLogFormats),
    transports: [
      new DailyRotateFile({
        handleExceptions: true,
        filename: 'logs/%DATE%-audit.log',
        datePattern: 'YYYY-MM-DD',
      })
    ]
  });
}

function addRoutes(callback) {
  routes(app, middleware);
  app.use(errorHandler);
  callback();
}

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
function start() {
  AppDataSource.initialize()
  .then(() => {
    console.log('Database connection is successfully');
  })
  .catch((err) => {
    console.error('Database connection is failed', err);
  });

  async.waterfall(
    [
      (next) => {
        addRoutes(next);
      }
    ],
    (err) => {
      if (err) {
        winston.error(`Unhandled error: ${err}`);
        // Either way, bad stuff happened. Abort start.
        process.exit();
      }
    }
  );
}

setupWinston();
start();

// Export your express server so you can import it in the lambda function.
module.exports = app;
