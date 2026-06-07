import axios from "axios";


const startChickenGame = async ( userId, betAmount, difficulty) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/chicken-road/start`, {
      userId,
      gameType: 'chicken',
      betAmount: betAmount,
      difficulty
    });

    return response.data;
  } catch (error) {
    console.error('Error starting chicken game:', error.response?.data || error.message);
    throw error;
  }
};

const stopChickenGame = async ( userId, betAmount, payout ) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/chicken-road/stop`, {
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
    startChickenGame,
    stopChickenGame
}