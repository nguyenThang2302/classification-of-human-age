import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const postMessageToChatBot = async (requestBody: any) => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await instance.post(`chat-bots`, requestBody, {
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
