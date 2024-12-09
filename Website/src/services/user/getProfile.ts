import { instance } from '../instance';

export const fetchProfileData = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await instance.get('users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return response;
  } catch (error) {
    console.error('Error fetching history images:', error);
    throw error;
  }
};
