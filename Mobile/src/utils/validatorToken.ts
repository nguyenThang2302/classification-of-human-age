import { jwtDecode } from "jwt-decode";

function isTokenExpired(token: any) {
    if (!token) return true;
  
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      return decoded['exp'] < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; 
    }
}

export default isTokenExpired;