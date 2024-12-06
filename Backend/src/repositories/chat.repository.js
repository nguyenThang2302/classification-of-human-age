const ChatRepository = module.exports;
const { AppDataSource } = require('../database/ormconfig');
const Chat = require('../database/entities/chat.entity');
const ChatContent = require('../database/entities/chat_content.entity');
const UserChat = require('../database/entities/user_chat.entity');

const chatRepository = AppDataSource.getRepository(Chat);
const chatContentRepository = AppDataSource.getRepository(ChatContent);
const userChatRepository = AppDataSource.getRepository(UserChat);

ChatRepository.insert = async (chat) => {
  const chatData = chatRepository.create(chat);
  await chatRepository.save(chatData);
  return chatData;
};

ChatRepository.insertChatContent = async (chatContent) => {
  const chatContentData = chatContentRepository.create(chatContent);
  await chatContentRepository.save(chatContentData);
  return chatContentData;
};

ChatRepository.insertUserChat = async (userChat) => {
  const userChatData = userChatRepository.create(userChat);
  await userChatRepository.save(userChatData);
  return userChatData;
};

ChatRepository.getListChatBot = async (userId) => {
  const data = await chatRepository.createQueryBuilder('chats')
    .innerJoin('chats.user_chats', 'user_chats', 'user_chats.user_id = :user_id', { user_id: userId })
    .select()
    .orderBy('chats.created_at', 'DESC')
    .getMany();
  return data;
};

ChatRepository.getChatBotDetails = async (chatId, userId, limit, offset) => {
  const data = await chatRepository.createQueryBuilder('chats')
    .innerJoin('chats.chat_contents', 'chat_contents', 'chat_contents.chat_id = :chat_id', { chat_id: chatId })
    .innerJoin('chats.user_chats', 'user_chats', 'user_chats.user_id = :user_id', { user_id: userId })
    .select([
      'chats.id',
      'chat_contents.id',
      'chat_contents.user_message',
      'chat_contents.bot_message',
      'chat_contents.created_at',
    ])
    .orderBy('chat_contents.created_at', 'DESC')
    .limit(limit)
    .offset(limit * (offset - 1))
    .getOne();
  return data;
};
