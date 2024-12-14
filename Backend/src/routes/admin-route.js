const express = require('express');
const multer = require('multer');

function addRoutes(router, middleware, controllers) {
  router.get(
    '/images',
    middleware.adminAuthorizer,
    controllers.adminController.getSearchImagesHistory
  );

  router.get(
    '/images/:image_id',
    middleware.adminAuthorizer,
    controllers.adminController.adminGetImageDetails
  );

  router.get(
    '/mails',
    middleware.adminAuthorizer,
    controllers.adminController.getListMail
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
