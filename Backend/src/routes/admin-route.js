const express = require('express');
const validate = require('../validation/validator');
const { MediaValidator } = require('../validation/index');

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

  router.put(
    '/images/:image_detail_id',
    validate([MediaValidator.EditImageDetailsValidator]),
    middleware.adminAuthorizer,
    controllers.adminController.adminEditImageDetails
  );

  router.get(
    '/age-folders',
    middleware.adminAuthorizer,
    controllers.adminController.getAgeFolders
  );

  router.get(
    '/age-images',
    middleware.adminAuthorizer,
    controllers.adminController.getAgeImages
  );

  router.get(
    '/gender-images',
    middleware.adminAuthorizer,
    controllers.adminController.getGenderImages
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
