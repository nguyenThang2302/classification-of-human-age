const Joi = require('@hapi/joi');
const { VALIDATE_ON } = require('../constants');

const AuthValidator = module.exports;

AuthValidator.registerValidator = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
    .min(5)
    .pattern(new RegExp('(?=.*[A-Z])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one special character.',
    }),
    repeat_password: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Password and repeat password must match.',
    })
  })
};

AuthValidator.loginValidator = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

AuthValidator.forgotPasswordValidator = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

AuthValidator.resetPasswordValidator = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    code: Joi.string().required(),
    password: Joi.string()
    .min(5)
    .pattern(new RegExp('(?=.*[A-Z])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one special character.',
    }),
    repeat_password: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Password and repeat password must match.',
    })
  })
};

AuthValidator.verifyTOTPValidator = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    secret: Joi.string().allow(''),
    token: Joi.string().required()
  })
};

AuthValidator.changePasswordValidator = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    current_password: Joi.string().required(),
    new_password: Joi.string()
    .min(5)
    .pattern(new RegExp('(?=.*[A-Z])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one special character.',
    }),
    new_repeat_password: Joi.string()
    .required()
    .valid(Joi.ref('new_password'))
    .messages({
      'any.only': 'New password and repeat password must match.',
    })
  })
};
