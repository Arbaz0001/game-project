import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCurrentRound = () => api.get('/api/v1/color/current');
export const placeBet = (betData) => api.post('/api/v1/color/bet', betData);
export const getGameHistory = (limit = 50) => api.get(`/api/v1/color/history?limit=${limit}`);
export const getUserBets = (userId, limit = 50) => api.get(`/api/v1/color/user/${userId}/bets?limit=${limit}`);

export default api;