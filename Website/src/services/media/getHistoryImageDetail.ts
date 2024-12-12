import { instance } from '../instance';


export const getHistoryImageDetail = async (image_id: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get(`media/images/${image_id}`, {
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
