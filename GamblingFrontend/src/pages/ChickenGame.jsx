import Header from '../components/chickenRoad/Header';
import GameBoard from '../components/chickenRoad/GameBoard';
import { useEffect } from 'react';

function ChickenGame() {
  useEffect(() => {
    const audio = new Audio('/main.mp3');
    audio.loop = true; // Loop the sound
    audio.play().catch((err) => {
      console.error("Autoplay failed:", err);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset if needed
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <div className="flex-1 min-h-0 overflow-hidden">
        <GameBoard />
      </div>
    </div>
  );
}

export default ChickenGame;