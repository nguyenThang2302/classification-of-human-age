import { instance } from '../instance';

interface LoginRequest {
    email: string;
    password: string;
}

export const handleLogin = async (loginData: LoginRequest) => {
    try {
        const response = await instance.post('auth/login', loginData);
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
