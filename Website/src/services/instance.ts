/* eslint-disable prettier/prettier */
import axios from "axios";

const prefixUrl = `${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : ''}/`;

export const instance = axios.create({
  baseURL: prefixUrl,
  headers: {
    Accept: 'application/json',

  },
});

export const get = async (url: string, data?: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await instance.get(url, { params: data });
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (url: string, data?: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await instance.post(url, data);
    return response;
  } catch (error: any) {
    throw error;
  }
};
