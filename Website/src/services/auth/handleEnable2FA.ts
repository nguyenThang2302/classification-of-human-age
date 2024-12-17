import { instance } from '../instance';

export const handleEnable2FA = async () => {
    try {
        const accessToken = localStorage.getItem('access_token');
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
