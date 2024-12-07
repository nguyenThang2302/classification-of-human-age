import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Verify2FARequest {
    secret: string;
    token: string;
}

export const handleVerify2FA = async (verify2FARequest: Verify2FARequest) => {
    try {
        const accessToken = await AsyncStorage.getItem('temp_access_token');
        const response = await instance.post('auth/verify-totp', verify2FARequest, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
