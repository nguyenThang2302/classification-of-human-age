import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VerifyCodeRequest {
    code: string;
    password: string;
    repeat_password: string;
}

export const handleVerifyCode = async (verifyCodeRequest: VerifyCodeRequest) => {
    try {
        const email = await AsyncStorage.getItem('forgot_email');
        const forgotToken = await AsyncStorage.getItem('forgot_token');
        const requestBody = {
            email: email,
            token: forgotToken,
            code: verifyCodeRequest.code,
            password: verifyCodeRequest.password,
            repeat_password: verifyCodeRequest.repeat_password
        };
        const response = await instance.put('auth/reset-password', requestBody);
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
