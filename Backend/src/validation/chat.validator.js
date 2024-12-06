const Joi = require('@hapi/joi');
const { VALIDATE_ON } = require('../constants');

const ChatValidator = module.exports;

ChatValidator.prompt = {
  [VALIDATE_ON.BODY]: Joi.object().keys({
    chat_id: Joi.number().optional(),
    message: Joi.string().required()
  })
};
