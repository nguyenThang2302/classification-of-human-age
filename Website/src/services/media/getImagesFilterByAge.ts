import { instance } from '../instance';


export const getImagesFilterByAge = async (age: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get(`admin/age-images?age=${age}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching history images:', error);
    throw error;
  }
};
