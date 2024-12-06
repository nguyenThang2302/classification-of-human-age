const { toResponseReplyChatBot, toResponseListChatBot, toResponseChatBotDetails } = require('../mappers/chat-bot.mapper');
const _ = require('lodash');
const { ok } = require('../helpers/response.helper');
const geminiConfig = require('../config/gemini.config');
const chatRepository = require('../repositories/chat.repository');
const ChatBotService = module.exports;

ChatBotService.sendToChatBot = async (req, res, next) => {
  var chatId = req.body.chat_id;
  const message = req.body.message;
  const user = req.user;
  if (_.isUndefined(chatId)) {
    const chat = {
      title: message
    };
    const chatSaved = await chatRepository.insert(chat);
    const userChat = {
      chat_id: chatSaved.id,
      user_id: user.id
    };
    await chatRepository.insertUserChat(userChat);
    const result = await geminiConfig.model.generateContent(message);
    var response = await result.response;
    const botMessage = await response.text();
    const chatContent = {
      chat_id: chatSaved.id,
      user_message: message,
      bot_message: botMessage
    };
    await chatRepository.insertChatContent(chatContent);
    chatId = chatSaved.id;
  } else {
    const result = await geminiConfig.model.generateContent(message);
    var response = await result.response;
    const botMessage = await response.text();
    const chatContent = {
      chat_id: chatId,
      user_message: message,
      bot_message: botMessage
    };
    await chatRepository.insertChatContent(chatContent);
  }
  const text = response.text();
  return ok(req, res, toResponseReplyChatBot(text, chatId));
};

ChatBotService.getListChatBot = async (req, res, next) => {
  const user = req.user;
  const listChatBot = await chatRepository.getListChatBot(user.id);
  return ok(req, res, toResponseListChatBot(listChatBot));
};

ChatBotService.getChatBotDetails = async (req, res, next) => {
  const { limit = 10, offset = 1 } = req.query;
  const chatId = req.params.chat_id;
  const user = req.user;
  const chatDetails = await chatRepository.getChatBotDetails(chatId, user.id, limit, offset);
  if (_.isNull(chatDetails)) {
    return ok(req, res, toResponseChatBotDetails(null));
  }
  chatDetails.chat_contents.sort((a, b) => a.id - b.id);
  return ok(req, res, toResponseChatBotDetails(chatDetails));
};
