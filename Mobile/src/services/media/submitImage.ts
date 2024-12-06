import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const submitImage = async (formData: any) => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await instance.post('media/uploads/image', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
