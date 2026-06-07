// Function to decode the JWT and check expiration
import jwt_decode from 'jwt-decode';

const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = jwt_decode(token);
  const expDate = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expDate;
};

// Function to refresh the access token automatically
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const { accessToken, refreshToken } = data.data;

    // Store the refreshed tokens in localStorage or cookies
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    console.log('Tokens refreshed successfully');
    return accessToken; // Return the new access token
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Optionally redirect the user to the login page if the refresh fails
    window.location.href = '/login';
  }
};

// Function to check and refresh token on page load
const checkAndRefreshToken = async () => {
  let accessToken = localStorage.getItem('accessToken');
  
  if (accessToken && isTokenExpired(accessToken)) {
    console.log('Access token expired, refreshing...');
    accessToken = await refreshAccessToken(); // Refresh the access token if expired
  }

  if (accessToken) {
    // Proceed to make API calls, using the refreshed token if needed
    console.log('Access token is valid');
  } else {
    // Optionally, you can redirect to login if there's no valid access token
    window.location.href = '/login';
  }
};

// Call the checkAndRefreshToken function when the page loads
window.onload = checkAndRefreshToken;