import { useState, useEffect } from "react";
import GameHeader from "./GameHeader";
import BettingSection from "./BettingSection";
import HistorySection from "./HistorySection";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  placeBet,
  getGameHistory,
  getUserBets,
} from "../../services/colorAPI.js";
import WinDialog from "./winningDiloagbox.jsx";
import { useBalance } from "../../context/BalanceContext";
import { toast } from "react-toastify";

const GameBoard = () => {
  const { currentRound, timeLeft, lastResult } = useSocket();
  const [selectedBet, setSelectedBet] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [gameHistory, setGameHistory] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [activeTab, setActiveTab] = useState("history");
  const [showPopup, setShowPopup] = useState(false);
  const [popupTimer, setPopupTimer] = useState(5); // 5 sec timer
  const [savedResult, setSavedResult] = useState(null);
  const { balance, setBalance, loadBalance } = useBalance();
  const [winingLoad, setWiningLoad] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // ✅ Jab lastResult change ho to data save karo aur popup dikhao
  useEffect(() => {
    if (lastResult) {
      setSavedResult(lastResult);
      setShowPopup(true);
      setPopupTimer(5); // reset timer
      fetchGameHistory();
      fetchUserBets();
    }
  }, [lastResult]);

  // ✅ Popup countdown logic
  useEffect(() => {
    let timer;
    if (showPopup && popupTimer > 0) {
      timer = setTimeout(() => setPopupTimer(popupTimer - 1), 1000);
    }
    if (popupTimer === 0) {
      setShowPopup(false);
    }
    return () => clearTimeout(timer);
  }, [showPopup, popupTimer]);

  const fetchGameHistory = async () => {
    try {
      const response = await getGameHistory();
      if (response.data.success) {
        setGameHistory(response.data.data);
        const latest = response.data.data[0];
        const userBet = getAllBets();
        console.log("User Bets:", userBet, "Latest Result:", latest);
        if (
          userBet.period === latest.period &&
          userBet.winningNumber === latest.betValue
        ) {
          setWiningLoad(true);
        }
      }
    } catch (error) {
      console.error("Error fetching game history:", error);
    }
  };

  const fetchUserBets = async () => {
    try {
      const response = await getUserBets(userId);
      if (response.data.success) {
        setUserBets(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user bets:", error);
    }
  };
  function getAllBets() {
    return JSON.parse(localStorage.getItem("betBox")) || [];
  }

  function saveBetData(newBet) {
    // 'betBox' key ke andar array me saare bets save honge
    const existing = JSON.parse(localStorage.getItem("betBox")) || [];

    // Example: same period aane par update karna
    const updated = [...existing];
    const index = updated.findIndex((item) => item.period === newBet.period);

    if (index >= 0) {
      updated[index] = newBet; // update if same period
    } else {
      updated.push(newBet); // else add new
    }

    localStorage.setItem("betBox", JSON.stringify(updated));
  }

  const handlePlaceBet = async () => {
    if (!selectedBet || !currentRound) {
      toast("Please select a bet and wait for the next round");
      return;
    }

    try {
      const betData = {
        period: currentRound.period,
        betType: selectedBet.type,
        betValue: selectedBet.value,
        amount: betAmount,
        multiplier: multiplier,
        userId: userId,
      };

      const response = await placeBet(betData);
      console.log("Bet Response:", response);
      if (response.data.success) {
        saveBetData(betData);
        toast.success("Bet placed successfully!");
        setBalance((prev) => prev - betAmount);
        setSelectedBet(null);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Failed to place bet");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#010125] shadow-xl shadow-red-950 min-h-screen relative">
      <GameHeader
        period={currentRound?.period || "---"}
        timeLeft={timeLeft}
        showPopup={showPopup}
        savedResult={savedResult}
        popupTimer={popupTimer}
      />

      <BettingSection
        selectedBet={selectedBet}
        setSelectedBet={setSelectedBet}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        onPlaceBet={handlePlaceBet}
        disabled={timeLeft < 10}
      />

      <HistorySection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gameHistory={gameHistory}
        lastResult={lastResult}
        userBets={userBets}
      />

      {/* {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

          <div className="relative bg-[#1e1e2f]/80 rounded-2xl p-8 shadow-2xl text-center w-80 border border-gray-700">
            <h2 className="text-xl font-bold text-white">🎉 New Result!</h2>

            <div className="mt-6 flex justify-center">
              <div
                className={`w-20 h-20 flex items-center justify-center rounded-full text-white text-2xl font-bold shadow-lg
          ${savedResult?.winningColor === "green" ? "bg-green-500" : ""}
          ${savedResult?.winningColor === "red" ? "bg-red-500" : ""}
          ${
            savedResult?.winningColor === "violet"
              ? "bg-purple-500"
              : "bg-gray-500"
          }`}
              >
                {savedResult?.winningNumber ?? "-"}
              </div>
            </div>

            <p className="mt-4 text-lg text-gray-300">
              Size:{" "}
              <span
                className={`font-semibold ${
                  savedResult?.size?.toUpperCase() === "BIG"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {savedResult?.size?.toUpperCase()}
              </span>
            </p>

            <div className="relative mt-6 flex justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="gray"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="yellow"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 35}
                  strokeDashoffset={2 * Math.PI * 35 * (popupTimer / 5)}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                {popupTimer}
              </span>
            </div>
          </div>
        </div>
      )} */}

      <WinDialog
        open={winingLoad} // 👉 sirf true pe show
        amount={savedResult?.winningAmount || betAmount}
        onClose={() => setWiningLoad(false)} // Close button par false set
      />
    </div>
  );
};

export default GameBoard;
