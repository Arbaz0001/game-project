import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

const checkTokenExpiration = () => {
  const token = localStorage.getItem('accessToken'); // Or sessionStorage if you're using it

  if (!token) return false; // If there's no token, return false

  try {
    const decoded = jwt_decode(token);  // Decode the JWT token
    const currentTime = Date.now() / 1000; // Get the current time in seconds

    if (decoded.exp < currentTime) {
      return true; // Token is expired
    } else {
      return false; // Token is still valid
    }
  } catch (error) {
    return false; // If decoding fails, treat as expired or invalid token
  }
};

export default checkTokenExpiration;
