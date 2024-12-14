import { instance } from '../instance';


export const adminUpdateImageDetail = async (image_detail_id: any, body: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.put(`admin/images/${image_detail_id}`, body, {
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
