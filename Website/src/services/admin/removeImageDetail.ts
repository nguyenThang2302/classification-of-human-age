import { instance } from '../instance';


export const removeImageDetail = async (image_detail_id: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.delete(`admin/image-details/${image_detail_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching history image details:', error);
    throw error;
  }
};
