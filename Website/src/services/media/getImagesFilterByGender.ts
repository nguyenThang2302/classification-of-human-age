import { instance } from '../instance';


export const getImagesFilterByGender = async (gender: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get(`admin/gender-images?gender=${gender}`, {
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
