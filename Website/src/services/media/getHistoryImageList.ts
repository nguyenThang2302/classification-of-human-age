import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const fetchHistoryImages = async (offset: any, limit: any) => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await instance.get(`media/images?offset=${offset}&limit=${limit}`, {
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
