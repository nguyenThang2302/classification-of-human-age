import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Enable2FARequest {
    secret: string;
    token: string;
}

export const handleSubmitEnable2FA = async (enable2FARequest: Enable2FARequest) => {
    try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await instance.post('auth/verify-totp', enable2FARequest, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
