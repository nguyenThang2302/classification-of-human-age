import { instance } from '../instance';


export const searchImage = async (offset: any, limit: any, email: any, date: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get(`admin/images?email=${email}&date=${date}&offset=${offset}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching history image details:', error);
    throw error;
  }
};
