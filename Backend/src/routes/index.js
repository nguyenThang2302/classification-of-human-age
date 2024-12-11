const winston = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { CORS_WHITELIST_HOSTS } = process.env;

const controllers = require('../controllers');
const topRoutes = require('./top-route');
const authRoutes = require('./auth-route');
const userRoutes = require('./user-route');
const mediaRoutes = require('./media-route');
const chatRoutes = require('./chat-route');

function addRoutes(app, router, middleware) {
  topRoutes(router, middleware, controllers);
  authRoutes(router, middleware, controllers);
  userRoutes(router, middleware, controllers);
  mediaRoutes(router, middleware, controllers);
  chatRoutes(router, middleware, controllers);
}

module.exports = async (app, middleware) => {
  if (process.env.NODE_ENV !== 'test') app.use(compression());

  const apiRouter = express.Router();

  let corsOptionsDelegate = null;

  if (!_.isEmpty(CORS_WHITELIST_HOSTS)) {
    corsOptionsDelegate = (req, callback) => {
      let corsOptions;

      if (CORS_WHITELIST_HOSTS === '*') {
        corsOptions = { origin: true };
      } else {
        const corsWhitelistHosts = _.split(CORS_WHITELIST_HOSTS, ',');

        if (corsWhitelistHosts.indexOf(req.header('Origin')) !== -1) {
          corsOptions = { origin: true };
        } else {
          corsOptions = { origin: false };
        }
      }
      callback(null, corsOptions);
    };
  }

  apiRouter.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  apiRouter.use(bodyParser.json());
  apiRouter.use(bodyParser.urlencoded({ extended: true }));
  apiRouter.use(cors(corsOptionsDelegate));
  apiRouter.use(cookieParser());

  addRoutes(app, apiRouter, middleware);
  winston.info('Routes added');
  app.use('/api/v1', apiRouter);
};
