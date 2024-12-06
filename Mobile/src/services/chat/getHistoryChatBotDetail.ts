import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getHistoryChatBotDetail = async (chatId: any, limit: any, offset: any) => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await instance.get(`chat-bots/${chatId}?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching history images:', error);
    throw error;
  }
};
