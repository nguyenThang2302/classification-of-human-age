import { instance } from '../instance';


export const submitImage = async (formData: any) => {
  try {
    const accessToken =  localStorage.getItem('access_token');
    const response = await instance.post('media/uploads/image', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
