import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}`);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('newRound', (roundData) => {
      setCurrentRound(roundData);
      setTimeLeft(roundData.duration / 1000);
      console.log('New round started:', roundData.period);
    });

    newSocket.on('countdown', (data) => {
      setTimeLeft(data.timeLeft);
    });

    newSocket.on('roundResult', (result) => {
      setLastResult(result);
      console.log('Round result:', result);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const value = {
    socket,
    isConnected,
    currentRound,
    timeLeft,
    lastResult
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};