import axios from "axios";

const prefixUrl = `${process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : ''}/`;

export const instance = axios.create({
	baseURL: prefixUrl,
	headers: {
		Accept: 'application/json',
	},
});

export const get = async (url: string, data?: any) => {
	try {
	  const response = await instance.get(url, { params: data });
	  return response;
	} catch (error) {
	  throw error;
	}
  };
  
  export const post = async (url: string, data?: any) => {
	try {
	  const response = await instance.post(url, data);
	  return response;
	} catch (error: any) {
	  throw error;
	}
  };
