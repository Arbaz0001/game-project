import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const AviatorSocketContext = createContext();

export const useAviatorSocket = () => {
  const context = useContext(AviatorSocketContext);
  if (!context) {
    throw new Error('useAviatorSocket must be used within an AviatorSocketProvider');
  }
  return context;
};

export const AviatorSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [liveBets, setLiveBets] = useState([]);
  const [topBets, setTopBets] = useState([]);
  const [hasBet, setHasBet] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}`); // namespace
    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('roundStart', ({ crashPoint, history }) => {
      setCrashPoint(crashPoint);
      setMultiplier(1.0);
      setIsRunning(true);
      setHasBet(false);
      if (!historyLoaded && Array.isArray(history) && history.length > 0) {
        setGameHistory(history);
        setHistoryLoaded(true); // ek bar load hone ke baad dobara overwrite mat karna
      }
    });

    newSocket.on('multiplierUpdate', ({ multiplier, history }) => {
      // setGameHistory(history);
      setMultiplier(multiplier);
    });

    newSocket.on('roundCrash', ({ multiplier }) => {
      // console.log('multiplier', multiplier);
      // console.log('allHistory', history);
      setMultiplier(multiplier);
      setIsRunning(false);
    });

    newSocket.on('newLiveBet', (liveBets) => {
      setLiveBets(liveBets);
    });

    // Handle top bets updates
    // newSocket.on('topBetsUpdate', (topBets) => {
    //   setTopBets(topBets);
    // });

    return () => newSocket.disconnect();
  }, []);

  return (
    <AviatorSocketContext.Provider
      value={{ socket, isConnected, multiplier, crashPoint, isRunning, liveBets, topBets, hasBet, gameHistory, setHasBet }}
    >
      {children}
    </AviatorSocketContext.Provider>
  );
};
