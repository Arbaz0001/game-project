import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUserBets = (userId, limit = 50) => api.get(`/api/v1/aviator/user/${userId}/bets?limit=${limit}`);

export const getAllBets = (limit = 50) => api.get(`/api/v1/aviator/all-bets?limit=${limit}`);
export default api;