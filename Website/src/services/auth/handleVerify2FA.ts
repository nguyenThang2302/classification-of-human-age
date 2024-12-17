import { instance } from '../instance';

interface Verify2FARequest {
    secret: string;
    token: string;
}

export const handleVerify2FA = async (verify2FARequest: Verify2FARequest) => {
    try {
        const accessToken = localStorage.getItem('temp_access_token');
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
