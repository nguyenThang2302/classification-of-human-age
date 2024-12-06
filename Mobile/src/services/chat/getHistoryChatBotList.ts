import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getHistoryChatBotList = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await instance.get(`chat-bots`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching history images:', error);
    throw error;
  }
};
