import { instance } from '../instance';

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    repeat_password: string;
}

export const handelRegister = async (registerData: RegisterRequest) => {
    try {
        const response = await instance.post('auth/register', registerData);
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
};
