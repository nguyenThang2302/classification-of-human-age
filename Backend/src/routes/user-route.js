const express = require('express');

function addRoutes(router, middleware, controllers) {
  router.get(
    '/me',
    middleware.authorizer,
    controllers.userController.me
  );
}

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
}

module.exports = (app, middleware, controllers) => {
  app.use('/users', apiRouter(middleware, controllers));
};
