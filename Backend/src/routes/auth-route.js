const express = require('express');
const validate = require('../validation/validator');
const { AuthValidator } = require('../validation/index');

function addRoutes(router, middleware, controllers) {
  router.post(
    '/register',
    validate([AuthValidator.registerValidator]),
    controllers.authController.register
  );

  router.post(
    '/login',
    validate([AuthValidator.loginValidator]),
    controllers.authController.login
  );

  router.put(
    '/change-password',
    middleware.authorizer,
    validate([AuthValidator.changePasswordValidator]),
    controllers.authController.changePassword
  );

  router.post(
    '/forgot-password',
    validate([AuthValidator.forgotPasswordValidator]),
    controllers.authController.forgotPassword
  )

  router.put(
    '/reset-password',
    validate([AuthValidator.resetPasswordValidator]),
    controllers.authController.resetPassword
  );

  router.get(
    '/enable-2fa',
    middleware.authorizer,
    controllers.authController.enableQR2FA
  );

  router.put(
    '/disable-2fa',
    middleware.authorizer,
    validate([AuthValidator.verifyTOTPValidator]),
    controllers.authController.disable2FA
  );

  router.post(
    '/verify-totp',
    middleware.authorizer,
    validate([AuthValidator.verifyTOTPValidator]),
    controllers.authController.verifyTOTP
  )
}

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
}

module.exports = (app, middleware, controllers) => {
  app.use('/auth', apiRouter(middleware, controllers));
};
