const { ChatBotService } = require('../services');
const Controller = module.exports;

Controller.sendMessageToChatBot = async (req, res, next) => {
  try {
    return await ChatBotService.sendToChatBot(req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.getListChatBot = async (req, res, next) => {
  try {
    return await ChatBotService.getListChatBot(req, res, next);
  } catch (error) {
    next(error);
  }
};

Controller.getChatBotDetails = async (req, res, next) => {
  try {
    return await ChatBotService.getChatBotDetails(req, res, next);
  } catch (error) {
    next(error);
  }
};
