import { instance } from '../instance';

export const getListMail = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get('admin/mails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching history images:', error);
    throw error;
  }
};
