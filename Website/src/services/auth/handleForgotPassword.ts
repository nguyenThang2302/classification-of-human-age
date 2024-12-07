import { instance } from '../instance';

interface ForgotPasswordRequest {
    email: string;
}

export const handleForgotPassword = async (forgotPasswordRequest: ForgotPasswordRequest) => {
    try {
        const response = await instance.post('auth/forgot-password', forgotPasswordRequest);
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
