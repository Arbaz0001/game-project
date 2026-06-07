import { useEffect, useRef, useState } from "react";
import GameBoard from "../components/mines/GameBoard";
import { startMineGame, stopMineGame } from "../services/mines";
import { useAuth } from "../context/AuthContext";
import BalanceButton from "../components/BalanceButton";
import { useBalance } from "../context/BalanceContext";
import WinPopup from "../components/chickenRoad/WinPopup";
import { toast } from "react-toastify";

const minePositions = [
  3, 7, 12, 17, 20, 1, 5, 9, 13, 22, 24, 0, 2, 4, 6, 8, 10, 11, 14, 15, 16, 18,
  19, 21,
];

function Mines() {
  const [gameState, setGameState] = useState("setup");
  const [mineCount, setMineCount] = useState(3);
  let multp = 0.2 + 0.05 * (mineCount - 3);
  const [winAmount, SetWinAmount] = useState(0);
  const [currentMines, setCurrentMines] = useState([]);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [MINE_POSITIONS, setMINE_POSITIONS] = useState(minePositions);
  const [bet, setBet] = useState(10);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [multiplier, setMultiplier] = useState(1 + multp);
  const { user } = useAuth();
  const { balance, setBalance, loadBalance } = useBalance();

  useEffect(() => {
    const audio = new Audio("/main.mp3");
    audio.loop = true; // Loop the sound
    audio.play().catch((err) => {
      console.error("Autoplay failed:", err);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset if needed
    };
  }, []);

  const startGame = () => {
    if (balance < bet) {
      toast.error("Insufficient balance!");
      return;
    }

    startMineGame(user._id, bet)
      .then((data) => {
        const fetchedMultipliers = data.data.multipliers;
        setMINE_POSITIONS(fetchedMultipliers);
        setGameState("playing");
        setRevealedTiles([]);
        setCurrentMines(MINE_POSITIONS.slice(0, mineCount));
        setMultiplier(1 + multp);
      })
      .catch((err) => console.error("Failed to start game."));
  };

  const handleTileClick = (index) => {
    if (revealedTiles.includes(index)) return;
    if (currentMines.includes(index)) {
      const bombAudio = new Audio("/bomb.m4a"); // path relative to /public
      const loseAudio = new Audio("/lose.wav");

      bombAudio
        .play()
        .then(() => {
          bombAudio.onended = () => {
            loseAudio.play().catch((e) => {
              console.warn("Lose sound failed:", e);
            });
          };
        })
        .catch((e) => {
          console.warn("Fire sound failed:", e);
        });

      setGameState("lost");
      setTimeout(() => {
        setShowWinPopup(true);
      }, 1000);

      setBalance(balance - bet);
      setRevealedTiles([...revealedTiles, index]);
      stopMineGame(user._id, bet, 0);
    } else {
      const newRevealed = [...revealedTiles, index];
      setRevealedTiles(newRevealed);
      const safeClicks = newRevealed.length;
      const remainingSafe = 25 - mineCount - safeClicks;
      const newMultiplier = +(1 + safeClicks * multp).toFixed(2);
      setMultiplier(newMultiplier);
    }
  };

  const handleCashOut = () => {
    const audio = new Audio("/win.wav");
    audio.play().catch((e) => {
      console.warn("Playback failed:", e);
    });

    const winnings = +(bet * multiplier).toFixed(2);
    setBalance(balance + winnings);
    setGameState("won");
    setShowWinPopup(true);
    SetWinAmount(winnings);
    stopMineGame(user._id, bet, winnings);
  };

  const getPotentialWin = () => {
    return bet * multiplier;
  };

  const resetGame = () => {
    setGameState("setup");
    setRevealedTiles([]);
    setCurrentMines([]);
    SetWinAmount(0);
    setMultiplier(1);
  };

  const closePopup = () => {
    setShowWinPopup(false);
    resetGame();
  };

  const videoRef = useRef(null);
  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  };

  return (
    <div className="min-h-screen text-center flex flex-col gap-4 justify-between">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="top-0 left-0 w-full h-screen fixed object-cover z-[-1]"
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <header className="bg-gray-800 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="text-2xl font-bold">MINES</div>

          {/* Stats */}
          <div className="text-start">
            <BalanceButton />
          </div>
        </div>
      </header>

      <GameBoard
        gameState={gameState}
        revealedTiles={revealedTiles}
        currentMines={currentMines}
        onTileClick={handleTileClick}
      />

      <div className="bg-gray-800 px-6 py-4 flex flex-col md:flex-row gap-4 items-center w-full justify-between">
        {/* Bet Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1 text-start">
              Bet Amount
            </label>
            <input
              type="number"
              min={10}
              value={bet}
              onChange={(e) => setBet(parseFloat(e.target.value) || 0)}
              disabled={gameState === "playing"}
              className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1 text-start">
              Mines
            </label>
            <input
              type="number"
              min={3}
              max={24}
              value={mineCount}
              onChange={(e) => {
                setMineCount(Number(e.target.value));
                setMultiplier(parseFloat(1 + multp).toFixed(2));
              }}
              disabled={gameState !== "setup"}
              className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1 text-start">
              Gems
            </label>
            <span className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 text-start">
              {25 - mineCount}
            </span>
          </div>
        </div>

        <div className="flex md:flex-row flex-col-reverse items-center gap-4 md:gap-40">
          {/* Game Control Buttons */}
          <div className="flex items-center space-x-3">
            {gameState === "setup" && (
              <button
                onClick={startGame}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold text-white"
              >
                <span>Start Game</span>
              </button>
            )}

            {gameState === "playing" && (
              <>
                <button
                  onClick={() => handleCashOut()}
                  className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors font-semibold text-white"
                >
                  <span>Cash Out</span>
                </button>
              </>
            )}

            {(gameState === "gameOver" || gameState === "won") && (
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors font-semibold text-white"
              >
                <span>New Game</span>
              </button>
            )}
          </div>

          {/* Current Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-xs text-gray-400">Current Multiplier</p>
              <p className="text-lg font-bold text-green-400">{multiplier}x</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400">Potential Win</p>
              <p className="text-lg font-bold text-yellow-400">
                ${getPotentialWin()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showWinPopup && (
        <WinPopup
          winAmount={winAmount}
          multiplier={multiplier}
          betAmount={bet}
          gameState={gameState}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

export default Mines;
