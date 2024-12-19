import { instance } from '../instance';


export const restoreImageDetail = async (image_detail_id: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.put(`admin/trash-image-details/${image_detail_id}/restore`, {}, {
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
