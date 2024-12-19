import { instance } from '../instance';

interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    new_repeat_password: string;
}

export const handleChangePassword = async (changePasswordRequest: ChangePasswordRequest) => {
    try {
        const accessToken = localStorage.getItem('access_token');
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
