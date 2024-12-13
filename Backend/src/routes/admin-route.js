const express = require('express');
const multer = require('multer');

function addRoutes(router, middleware, controllers) {
  router.get(
    '/images',
    middleware.adminAuthorizer,
    controllers.adminController.getSearchImagesHistory
  );
}

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
}

module.exports = (app, middleware, controllers) => {
  app.use('/admin', apiRouter(middleware, controllers));
};
