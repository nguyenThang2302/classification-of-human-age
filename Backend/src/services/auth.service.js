const { isExistingEmail, insertUser, validateUser, getUserByEmail, updatePassword, getUserInfo, update2FA } = require('./user.service');
const { sendCodeForgotPassword } = require('./mail.service');
const {ok} = require('../helpers/response.helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors');
const { AuthMapper } = require('../mappers/index');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { auth } = require('../config/nodemailer.config');
const Constants = require('../constants');

const { JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES_IN} = process.env;

const AuthService = module.exports;

AuthService.registerService = async (user, req, res, next) => {
  try {
    if (!await isExistingEmail(user.email)) {
      throw new BadRequestError(t('RE-001'));
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userData = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role_id: Constants.ROLES.USER,
      secret: '',
    };
    const userInsert = await insertUser(userData);

    return ok(req, res, AuthMapper.toInfoRegister(userInsert));
  } catch (error) {
    next(error);
  }
};

AuthService.loginService = async (user, req, res, next) => {
  try {
    const userData = await validateUser(user);

    const payload = {
      id: userData.id,
      email: userData.email,
      role_id: userData.role_id
    };

    const accessToken = await jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: parseInt(JWT_ACCESS_TOKEN_EXPIRES_IN) });
    return ok(req, res, AuthMapper.toInfoLogin(accessToken, userData.is_2fa_enabled));
  } catch (error) {
    next(error);
  }
};

AuthService.forgotPasswordService = async (email, req, res, next) => {
  try {
    if (await isExistingEmail(email)) {
      throw new BadRequestError(t('FO-001'));
    }

    const codeForgotPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
      email: email,
      code: codeForgotPassword
    };
    const tokenForgot = await jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: parseInt(JWT_ACCESS_TOKEN_EXPIRES_IN) });
    await sendCodeForgotPassword(email, codeForgotPassword);
    return ok(req, res, AuthMapper.toResponseForgotPassword(tokenForgot));
  } catch (error) {
    next(error);
  }
};

AuthService.resetPasswordService = async (req, res, next) => {
  try {
    const { email, token, code, password } = req.body;
    const payload = await jwt.verify(token, JWT_SECRET_KEY);

    if (!payload) {
      throw new BadRequestError(t('FO-002'));
    }

    if (payload.email !== email || payload.code !== code) {
      throw new BadRequestError(t('FO-003'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await getUserByEmail(email);
    await updatePassword(user.id, hashedPassword);
    return ok(req, res, AuthMapper.toInfoRegister(user));
  } catch (error) {
    next(error);
  }
};

AuthService.enableQR2FAService = async (req, res, next) => {
  try {
    const user = req.user;
    const userInfo = await getUserInfo(user.id);
    if (userInfo.is_2fa_enabled && userInfo.secret !== '') {
      throw new BadRequestError(t('2FA-002'));
    }

    if (!userInfo) {
      throw new BadRequestError(t('AU-001'));
    }

    const secret = speakeasy.generateSecret({ length: 20 });
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return ok(req, res, AuthMapper.toResponseQR2FA(secret.base32, qrCodeUrl));
  } catch (error) {
    next(error);
  }
};

AuthService.disable2FAService = async (req, res, next) => {
  try {
    const user = req.user;
    const userInfo = await getUserInfo(user.id);
    const secretSaved = userInfo.secret;
    if (secretSaved === '') {
      throw new BadRequestError(t('2FA-003'));
    }
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
      secret: secretSaved,
      encoding: 'base32',
      token: token
    });
    if (verified) {
      await update2FA(user.id, '', false);
    } else {
      throw new BadRequestError(t('2FA-001'));
    }
    return ok(req, res, { data: { is_disabled: true } });
  } catch (error) {
    next(error);
  }
}

AuthService.verifyTOTPService = async (req, res, next) => {
  try {
    const user = req.user;
    const userInfo = await getUserInfo(user.id);
    const secretSaved = userInfo.secret;
    let secret;
    let payload;
    let accessToken;
    if (secretSaved === '') {
      secret = req.body.secret;
    } else {
      secret = secretSaved;
      payload = {
        id: userInfo.id,
        email: userInfo.email
      };
      accessToken = await jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: parseInt(JWT_ACCESS_TOKEN_EXPIRES_IN) });
    }
    const { token } = req.body;

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      await update2FA(user.id, secret, true);
    }

    return ok(req, res, { data: { is_verified: verified, access_token: accessToken ? accessToken : null } });
  } catch (error) {
    next(error);
  }
};

AuthService.changePasswordService = async (req, res, next) => {
  try {
    const user = req.user;
    const { current_password, new_password } = req.body;
    const userInfo = await getUserInfo(user.id);
    const isMatch = await bcrypt.compare(current_password, userInfo.password);
    if (!isMatch) {
      throw new BadRequestError(t('AU-002'));
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await updatePassword(user.id, hashedPassword);
    return ok(req, res, AuthMapper.toResponseChangePassword(userInfo));
  } catch (error) {
    next(error);
  }
}
