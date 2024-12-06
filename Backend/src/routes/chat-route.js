const express = require('express');
const validate = require('../validation/validator');
const { ChatValidator } = require('../validation');

function addRoutes(router, middleware, controllers) {
  router.get(
    '/chat-bots',
    middleware.authorizer,
    controllers.chatBotController.getListChatBot
  );

  router.get(
    '/chat-bots/:chat_id',
    middleware.authorizer,
    controllers.chatBotController.getChatBotDetails
  );

  router.post(
    '/chat-bots',
    middleware.authorizer,
    validate([ChatValidator.prompt]),
    controllers.chatBotController.sendMessageToChatBot
  );
};

function apiRouter(middleware, controllers) {
  const router = new express.Router();

  addRoutes(router, middleware, controllers);

  return router;
};

module.exports = (app, middleware, controllers) => {
  app.use('/', apiRouter(middleware, controllers));
};
