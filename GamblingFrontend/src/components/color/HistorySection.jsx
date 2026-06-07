import { useState } from "react";
import TransactionHistory from "./TransactionHistory";

const HistorySection = ({
  activeTab,
  setActiveTab,
  gameHistory,
  lastResult,
  userBets,
}) => {
  // console.log('activeTab, setActiveTab, gameHistory, lastResult, userBets', activeTab, setActiveTab, gameHistory, lastResult, userBets);
  const tabs = [
    { id: "history", label: "Game History" },
    { id: "chart", label: "Chart" },
    { id: "my", label: "My History" },
  ];

  const getResultColor = (number) => {
    if ([1, 3, 7, 9].includes(number)) return "text-green-600";
    if ([2, 4, 6, 8].includes(number)) return "text-red-600";
    return "text-purple-600";
  };

  const getResultBg = (number) => {
    if ([1, 3, 7, 9].includes(number)) return "bg-green-100";
    if ([2, 4, 6, 8].includes(number)) return "bg-red-100";
    return "bg-purple-100";
  };

  const formatPeriod = (period) => {
    return period ? period.slice(-6) : "---";
  };

  return (
    <div className="bg-transparent  pt-2 w-full text-white">
      {/* Tab Navigation */}
      <div className="flex px-4 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2  rounded-md cursor-pointer  text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white  shadow-xs  border-white  bg-gradient-to-b from-teal-500  to-sky-500"
                : "text-gray-0 hover:text-white bg-[#020240]  text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className=" max-h-96 overflow-y-auto bg-[#030342] rounded-t-xl shadow-2xl mx-4 mt-4">
        {activeTab === "history" && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs text-center rounded-t-xl px-4 py-4 bg-[#2525a7] font-medium  text-gray-300 ">
              <div>Period</div>
              <div className="text-center">Number</div>
              <div className="text-center">Result</div>
            </div>

            {lastResult && (
              <div className="grid grid-cols-3 px-3 gap-4 py-3 mx-3 bg-yellow-50 text-black rounded-lg animate-pulse">
                <div className="text-sm font-medium">
                  {formatPeriod(lastResult.period)}
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block w-8 h-8 rounded-full text-white font-bold text-sm leading-8 ${
                      [1, 3, 7, 9].includes(lastResult.winningNumber)
                        ? "bg-green-500"
                        : [2, 4, 6, 8].includes(lastResult.winningNumber)
                        ? "bg-red-500"
                        : "bg-purple-500"
                    }`}
                  >
                    {lastResult.winningNumber}
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getResultBg(
                      lastResult.winningNumber
                    )} ${getResultColor(lastResult.winningNumber)}`}
                  >
                    {lastResult.size.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {gameHistory.map((round) => (
              <div
                key={round._id}
                className="grid grid-cols-3 gap-4 px-3 mx-3 hover:bg-gray-50 hover:text-black rounded"
              >
                <div className="text-sm font-medium">
                  {formatPeriod(round.period)}
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block w-8 h-8 rounded-full text-white font-bold text-sm leading-8 ${
                      [1, 3, 7, 9].includes(round.winningNumber)
                        ? "bg-green-500"
                        : [2, 4, 6, 8].includes(round.winningNumber)
                        ? "bg-red-500"
                        : "bg-purple-500"
                    }`}
                  >
                    {round.winningNumber}
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getResultBg(
                      round.winningNumber
                    )} ${getResultColor(round.winningNumber)}`}
                  >
                    {round.size.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}

            {gameHistory.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🎮</div>
                <div>No game history available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "chart" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 text-center text-xs px-4 py-4 bg-[#2525a7] font-medium text-gray-300  ">
              <div>Period</div>
              <div className="text-center">Number</div>
            </div>
            {gameHistory.map((round) => (
              <div
                key={round._id}
                className="grid grid-cols-2 px-3 cursor:pointer hover:bg-gray-50 hover:text-black cursor-pointer rounded"
              >
                <div className="text-sm font-medium">
                  {formatPeriod(round.period)}
                </div>
                <div className="text-center flex justify-center items-center">
                  {/* Loop through all numbers from 1 to 9 */}
                  {[...Array(9)].map((_, i) => {
                    const number = i + 1; // Create numbers from 1 to 9

                    // Check if this number is the winning number
                    const isWinningNumber = round.winningNumber === number;

                    return (
                      <span
                        key={number}
                        className={`inline-block min-w-6 h-6 text-center rounded-full font-bold text-sm ${
                          isWinningNumber
                            ? [1, 3, 7, 9].includes(number) // Green for odd numbers (1, 3, 7, 9)
                              ? "bg-green-500"
                              : [2, 4, 6, 8].includes(number) // Red for even numbers (2, 4, 6, 8)
                              ? "bg-red-500"
                              : "bg-purple-500" // Purple for others
                            : "text-gray-500" // Non-winning numbers are gray
                        }`}
                      >
                        {number}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}

            {gameHistory.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🎮</div>
                <div>No game history available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "my" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 px-4 py-4 text-center bg-[#2525a7]  text-xs font-medium text-gray-300  ">
              <div>Date</div>
              <div className="text-center">Balance</div>
            </div>
            <TransactionHistory userBets={userBets} />
            {userBets.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">👤</div>
                <div>My betting history</div>
                <div className="text-sm mt-2">Login to view your bets</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySection;
