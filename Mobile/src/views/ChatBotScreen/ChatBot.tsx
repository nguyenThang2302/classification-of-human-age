import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { getHistoryChatBotDetail } from 'src/services/chat/getHistoryChatBotDetail';
import { RouteProp, useRoute } from '@react-navigation/native';
import { postMessageToChatBot } from 'src/services/chat/postMessageToChatBot';
import * as _ from 'lodash';

type RootStackParamList = {
  ChatBot: { chatId: string };
};

type ChatBotRouteProp = RouteProp<RootStackParamList, 'ChatBot'>;

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true);
  const route = useRoute<ChatBotRouteProp>();
  const { chatId } = route.params;

  if (_.isNull(chatId)) {
    useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: 'Hello! Welcome to the ChatBot VGTC.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Support',
            avatar: 'https://res.cloudinary.com/dxsdyc667/image/upload/v1730269304/8943377.png.png',
          },
        },
      ]);
    }, []);
  }

  const fetchChats = useCallback(async (page: number) => {
    if (_.isNull(chatId)) return;
    try {
      const data = await getHistoryChatBotDetail(chatId, 10, page); 
      if (_.isNull(data)) {
        setHasMore(false);
        return;
      }

      const formattedChats: IMessage[] = data.chat_contents.flatMap((chat: any, index: number) => {
        const userMessage: IMessage = {
          _id: `${chatId}-user-${page}-${index}`,
          text: chat.user_message,
          createdAt: new Date(chat.created_at),
          user: {
            _id: 1,
            name: 'User',
          },
        };

        const botMessage: IMessage = {
          _id: `${chatId}-bot-${page}-${index}`,
          text: chat.bot_message,
          createdAt: new Date(chat.created_at),
          user: {
            _id: 2,
            name: 'Bot',
            avatar: 'https://res.cloudinary.com/dxsdyc667/image/upload/v1730269304/8943377.png.png',
          },
        };

        return [userMessage, botMessage];
      });

      setMessages((prevMessages) => GiftedChat.append(formattedChats.reverse(), prevMessages));
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChats(1);
  }, [fetchChats]);

  const loadMoreMessages = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchChats(page + 1);
    }
  }, [fetchChats, hasMore, page]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    if (newMessages.length === 0) return;

    setIsTyping(true);

    const requestBody = _.isNull(chatId)
      ? { message: newMessages[0].text }
      : { chat_id: chatId, message: newMessages[0].text };

    try {
      const response = await postMessageToChatBot(requestBody);
      
      setIsTyping(false);

      const botResponse: IMessage = {
        _id: response.chat_id,
        text: response.reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
          avatar: 'https://res.cloudinary.com/dxsdyc667/image/upload/v1730269304/8943377.png.png',
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [botResponse]));
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  }, [chatId]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      isTyping={isTyping}
      loadEarlier={hasMore}
      onLoadEarlier={loadMoreMessages} 
    />
  );
};

export default ChatBot;
