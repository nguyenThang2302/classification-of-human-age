import { instance } from '../instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    new_repeat_password: string;
}

export const handleChangePassword = async (changePasswordRequest: ChangePasswordRequest) => {
    try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await instance.put('auth/change-password', changePasswordRequest, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
