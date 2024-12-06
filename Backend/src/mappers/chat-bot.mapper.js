const ChatBotMapper = module.exports;

ChatBotMapper.toResponseReplyChatBot = (response, chatId) => ({
  data: {
    reply: response,
    chat_id: chatId ? chatId : null
  }
});

ChatBotMapper.toResponseListChatBot = (listChatBot) => ({
  items: listChatBot
});

ChatBotMapper.toResponseChatBotDetails = (chatDetails) => ({
  data: chatDetails
});
