const express = require('express');
const validate = require('../validation/validator');
const { statusValidator } = require('../validation');

function addRoutes(router, middleware, controllers) {
  // Get api status
  router.get(
    '/status',
    validate([statusValidator.schema]),
    controllers.top.status
  );
}

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
}

module.exports = (app, middleware, controllers) => {
  app.use('/', apiRouter(middleware, controllers));
};
