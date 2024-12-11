const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const config = require('../config/config');
const { Blob } = require('blob-polyfill');

function addRoutes(router, middleware, controllers) {
  router.post(
    '/uploads/image',
    middleware.authorizer,
    upload.single('image'),
    async (req, res, next) => {
      const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
      const formData = new FormData();
      formData.append('image', fileBlob, req.file.originalname);
      try {
        const response = await fetch(`${config.base_url_model}/predict`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        req['res_load_model'] = data;
      } catch (error) {
        return next(error);
      }
      next();
    },
    controllers.mediaController.uploadImages
  );

  router.get(
    '/images',
    middleware.authorizer,
    controllers.mediaController.imagesHistory
  );

  router.get(
    '/images/:image_id',
    middleware.authorizer,
    controllers.mediaController.getImageDetail
  );
}

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
}

module.exports = (app, middleware, controllers) => {
  app.use('/media', apiRouter(middleware, controllers));
};
