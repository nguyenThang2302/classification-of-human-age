import { instance } from '../instance';


export const getFoldersAge = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get(`admin/age-folders`, {
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
