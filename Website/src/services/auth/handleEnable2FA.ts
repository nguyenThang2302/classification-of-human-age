import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleEnable2FA = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await instance.get('auth/enable-2fa', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
