const Joi = require('@hapi/joi');
const { VALIDATE_ON } = require('../constants');

const MediaValidator = module.exports;

MediaValidator.EditImageDetailsValidator = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    image_id: Joi.number().required(),
    gender: Joi.number().required(),
    age: Joi.number().required(),
  })
};
