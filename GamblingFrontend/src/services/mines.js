import axios from "axios";


const startMineGame = async ( userId, betAmount) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/mine/start`, {
      userId,
      gameType: 'mining',
      betAmount: betAmount
    });

    return response.data;
  } catch (error) {
    console.error('Error starting chicken game:', error.response?.data || error.message);
    throw error;
  }
};

const stopMineGame = async ( userId, betAmount, payout ) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/mine/stop`, {
      userId,
      betAmount,
      payout
    });

    return response.data;
  } catch (error) {
    console.error('Error starting chicken game:', error.response?.data || error.message);
    throw error;
  }
};

export {
    startMineGame,
    stopMineGame
}