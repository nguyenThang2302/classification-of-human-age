const { AuthService } = require('../services/index');
const Controller = module.exports;

Controller.register = async (req, res, next) => {
  try {
    const user = req.body;
    return await AuthService.registerService(user, req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.login = async (req, res, next) => {
  try {
    const user = req.body;
    return await AuthService.loginService(user, req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    return await AuthService.forgotPasswordService(email, req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.resetPassword = async (req, res, next) => {
  try {
    return await AuthService.resetPasswordService(req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.enableQR2FA = async (req, res, next) => {
  try {
    return await AuthService.enableQR2FAService(req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.verifyTOTP = async (req, res, next) => {
  try {
    return await AuthService.verifyTOTPService(req, res, next);
  } catch (error) {
    next(error);
  }
}

Controller.disable2FA = async (req, res, next) => {
  try {
    return await AuthService.disable2FAService(req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.changePassword = async (req, res, next) => {
  try {
    return await AuthService.changePasswordService(req, res, next);
  } catch (error) {
    next(error);
  }
}
