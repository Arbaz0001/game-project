import { useState, useEffect, useRef } from "react";
import ChickenSprite from "./ChickenSprite";
import MultiplierStep from "./MultiplierStep";
import WinPopup from "./WinPopup";
import { useAuth } from "../../context/AuthContext";
import { startChickenGame, stopChickenGame } from "../../services/chickenRoad";
import { useBalance } from "../../context/BalanceContext";
import { FireSVG } from "./FireSVG";
import { toast } from "react-toastify";

const initialMultipliers = [1.02, 0];

const GameBoard = () => {
  const [multipliers, setMultipliers] = useState(initialMultipliers);
  const [chickenPosition, setChickenPosition] = useState(-1);
  const [gameState, setGameState] = useState("idle"); // 'idle', 'playing', 'gameOver', 'won'
  const [betAmount, setBetAmount] = useState(10.0);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [visitedPositions, setVisitedPositions] = useState([]);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [bestMultiplier, setBestMultiplier] = useState(15.2);
  const { user } = useAuth();
  const { balance, setBalance, loadBalance } = useBalance();
  const [showSVG, setShowSVG] = useState(false);
  const [activeFireIndex, setActiveFireIndex] = useState(null);
  const [difficulty, setDifficulty] = useState("Easy");
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(0.4);

  const options = ["Easy", "Medium", "Hard", "Hardest"];
  const scrollContainerRef = useRef(null);
  const multiplierRefs = useRef([]);

  useEffect(() => {
    if (chickenPosition < 0 || !multiplierRefs.current[chickenPosition]) return;

    multiplierRefs.current[chickenPosition].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [chickenPosition]);

  // Generate random multiplier between 0.8 and 2
  const generateRandomMultiplier = () => {
    return Math.random() * (2 - 0.8) + 0.8;
  };

  // Add more multipliers when needed
  const addMoreMultipliers = () => {
    const lastZeroIndex = multipliers.lastIndexOf(0);

    const previousValue = multipliers[lastZeroIndex - 1] || 1;
    const newMultipliers = [];

    let currentValue = previousValue + difficultyMultiplier;
    for (let i = 0; i < 20; i++) {
      currentValue = parseFloat((currentValue + 0.4).toFixed(2));
      newMultipliers.push(currentValue);
    }
    setMultipliers((prev) => [...prev, ...newMultipliers]);
  };

  useEffect(() => {
    addMoreMultipliers();
  }, [difficultyMultiplier]);

  // Handle scroll to implement infinite scrolling
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // Add more multipliers when near the end
    if (scrollLeft + clientWidth >= scrollWidth - 200) {
      addMoreMultipliers();
    }
  };

  // Start game function
  const startGame = () => {
    if (balance < betAmount) {
      toast.error("Insufficient balance!");
      return;
    }

    startChickenGame(user._id, betAmount, difficulty)
      .then((data) => {
        const fetchedMultipliers = data.data.multipliers;
        setMultipliers(fetchedMultipliers);

        if (fetchedMultipliers[0] === 0) {
          setGameState("gameOver");
          const fireAudio = new Audio("/fire.m4a");
          const loseAudio = new Audio("/lose.wav");

          fireAudio
            .play()
            .then(() => {
              fireAudio.onended = () => {
                loseAudio.play().catch((e) => {
                  console.warn("Lose sound failed:", e);
                });
              };
            })
            .catch((e) => {
              console.warn("Fire sound failed:", e);
            });
          setChickenPosition(0);
          setTimeout(() => {
            setShowWinPopup(true);
          }, 1000);
          setWinAmount(0);
          return;
        }

        setTimeout(() => {
          setGameState("playing");
          setChickenPosition(0);
          setVisitedPositions([0]);
          setBalance((prev) => prev - betAmount);
        }, 200);
      })
      .catch((err) => console.error("Failed to start game."));
  };

  // Go to next position
  const goNext = () => {
    if (gameState !== "playing") return;

    const nextPosition = chickenPosition + 1;
    const nextMultiplier = multipliers[nextPosition];

    // Check if next multiplier is 0 (game over)
    if (nextMultiplier === 0) {
      const fireAudio = new Audio("/fire.m4a");
      const loseAudio = new Audio("/lose.wav");

      fireAudio
        .play()
        .then(() => {
          fireAudio.onended = () => {
            loseAudio.play().catch((e) => {
              console.warn("Lose sound failed:", e);
            });
          };
        })
        .catch((e) => {
          console.warn("Fire sound failed:", e);
        });
      setChickenPosition(nextPosition);
      setVisitedPositions((prev) => [...prev, nextPosition]);
      setGameState("gameOver");
      setTimeout(() => {
        setShowWinPopup(true);
        setWinAmount(0);
        return;
      }, 1000);
    }

    // Move chicken to next position
    setChickenPosition(nextPosition);
    setVisitedPositions((prev) => [...prev, nextPosition]);

    // Check auto cashout
    if (nextMultiplier >= autoCashout) {
      cashOut(nextMultiplier);
    }
  };

  // Cash out function
  const cashOut = (multiplier = null) => {
    if (gameState !== "playing") return;

    const currentMultiplier = multiplier || multipliers[chickenPosition];
    const winnings = betAmount * currentMultiplier;

    stopChickenGame(user._id, betAmount, winnings);
    const audio = new Audio("/win.wav");
    audio.play().catch((e) => {
      console.warn("Playback failed:", e);
    });

    setWinAmount(winnings);
    setBalance((prev) => prev + winnings);
    setGameState("won");
    setShowWinPopup(true);

    // Update best multiplier if current is better
    if (currentMultiplier > bestMultiplier) {
      setBestMultiplier(currentMultiplier);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState("idle");
    setChickenPosition(-1);
    setVisitedPositions([]);
    setShowWinPopup(false);
    setWinAmount(0);
  };

  // Close popup and reset
  const closePopup = () => {
    setShowWinPopup(false);
    resetGame();
  };

  // Add initial random multipliers after 0
  useEffect(() => {
    const zeroIndex = multipliers.findIndex((mult) => mult === 0);
    if (zeroIndex !== -1 && zeroIndex === multipliers.length - 1) {
      addMoreMultipliers();
    }
  }, [multipliers]);

  useEffect(() => {
    let showTimeout;
    let hideTimeout;

    const triggerSVG = () => {
      const delay = Math.floor(Math.random()) + 100;

      showTimeout = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * multipliers.length);
        setActiveFireIndex(randomIndex);

        hideTimeout = setTimeout(() => {
          setActiveFireIndex(null);
          triggerSVG(); // Continue the loop
        }, 200);
      }, delay);
    };

    triggerSVG(); // Start loop on mount

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [multipliers]);

  const getCurrentMultiplier = () => {
    return multipliers[chickenPosition] || 1.0;
  };

  const getPotentialWin = () => {
    return (betAmount * getCurrentMultiplier()).toFixed(2);
  };

  const regenerateMultipliers = (
    baseMultiplier = 1,
    multiplier = difficultyMultiplier
  ) => {
    const newMultipliers = [];
    let currentValue = baseMultiplier;

    for (let i = 0; i < 20; i++) {
      currentValue = parseFloat((currentValue + multiplier).toFixed(2));
      newMultipliers.push(currentValue);
    }

    newMultipliers.push(0); // Add crash point
    setMultipliers(newMultipliers);
  };

  const handleDifficulty = (level) => {
    if (gameState !== "idle") {
      toast("You can't change difficulty during a game!");
      return;
    }

    let newMultiplier = 0.4; // Default for Easy
    if (level === "Medium") newMultiplier = 0.6;
    else if (level === "Hard") newMultiplier = 0.75;
    else if (level === "Hardest") newMultiplier = 0.9;

    setDifficulty(level);
    setDifficultyMultiplier(newMultiplier);

    regenerateMultipliers(0.62, newMultiplier); // Pass directly
  };

  return (
    <div className="w-full h-full flex flex-col-reverse">
      {/* Game Controls */}
      <div className="bg-gray-800 px-6 py-4 flex md:flex-row gap-2 flex-col items-center justify-between border-b border-gray-700">
        {/* Bet Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Bet Amount</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={10}
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                disabled={gameState === "playing"}
                className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <span className="text-gray-400">$</span>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Auto Cashout</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={autoCashout}
                onChange={(e) =>
                  setAutoCashout(parseFloat(e.target.value) || 0)
                }
                step="0.01"
                disabled={gameState === "playing"}
                className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <span className="text-gray-400">x</span>
            </div>
          </div>
        </div>

        <div className="text-gray-400 gap-4 flex border p-2 rounded-xl">
          {options.map((level) => (
            <button
              key={level}
              onClick={() => handleDifficulty(level)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                difficulty === level
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          {/* Game Control Buttons */}
          <div className="flex items-center space-x-3">
            {gameState === "idle" && (
              <button
                onClick={startGame}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold text-white"
              >
                <span className="text-sm">Start Game</span>
              </button>
            )}

            {gameState === "playing" && (
              <>
                <button
                  onClick={goNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold text-white"
                >
                  <span className="text-sm">Go</span>
                </button>

                <button
                  onClick={() => cashOut()}
                  className="flex items-center space-x-2 md:px-6 px-2 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors font-semibold text-white"
                >
                  <span className="text-xs md:text-sm">Cash Out</span>
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
              <p className="text-lg font-bold text-green-400">
                {getCurrentMultiplier().toFixed(2)}x
              </p>
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

      {/* Game Board */}
      <div className="flex-1 bg-[#414865] overflow-hidden relative">
        <div
          ref={scrollContainerRef}
          className="flex h-full w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
          onScroll={handleScroll}
        >
          <div
            className="min-w-[100px] w-24 md:min-w-32"
            style={{
              backgroundImage: "url('/chicken-bg.jpeg')",
              backgroundSize: "contain",
              backgroundPosition: "bottom",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          {multipliers.map((mult, i) => {
            const visualMultiplier =
              mult === 0 && i > 0 ? multipliers[i - 1] + 0.4 : mult;
            return (
              <div
                key={i}
                ref={(el) => (multiplierRefs.current[i] = el)}
                className="relative h-full flex flex-col justify-end items-center min-w-[100px] w-24 md:w-32 flex-shrink-0"
                style={{
                  backgroundImage: "url('/chicken-bg.jpeg')",
                  backgroundSize: "contain",
                  backgroundPosition: "bottom",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {i === activeFireIndex && i > chickenPosition && (
                  <div className="absolute bottom-4 left-0 z-50">
                    <img
                      src="/fire.gif" // If placed in public folder
                      alt="fire"
                      className="object-contain"
                    />
                  </div>
                )}

                <MultiplierStep
                  multiplier={mult}
                  isActive={i === chickenPosition}
                  isVisited={visitedPositions.includes(i)}
                  gameState={gameState}
                  visualMultiplier={visualMultiplier}
                />
              </div>
            );
          })}
          {/* Chicken Sprite */}
          <ChickenSprite
            position={chickenPosition}
            multiplierRefs={multiplierRefs}
            scrollContainer={scrollContainerRef}
            gameState={gameState}
          />
        </div>
      </div>

      {/* Win Popup */}
      {showWinPopup && (
        <WinPopup
          winAmount={winAmount}
          multiplier={getCurrentMultiplier()}
          betAmount={betAmount}
          gameState={gameState}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default GameBoard;
