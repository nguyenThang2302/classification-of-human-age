import { instance } from '../instance';


export const getImageTrash = async (imageName: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get(`admin/trash-image-details?image_name=${imageName}`, {
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
