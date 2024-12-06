import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchProfileData = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await instance.get('users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return response;
  } catch (error) {
    console.error('Error fetching history images:', error);
    throw error;
  }
};
