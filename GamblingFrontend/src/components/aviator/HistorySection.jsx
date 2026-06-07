import { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";

const HistorySection = ({ activeTab, setActiveTab, liveBets, userBets }) => {
  const tabs = [
    { id: "bets", label: "All Bets" },
    { id: "my", label: "My History" },
    { id: "top", label: "Top" },
  ];

  const [sortedBets, setSortedBets] = useState([]);
  // console.log(liveBets)

  useEffect(() => {
    setSortedBets([...liveBets].sort((a, b) => b.betAmount - a.betAmount));
  }, [liveBets]);

  return (
    <div className="bg-transparent border-t-1 border-[#9f3e3e] pt-2 w-full text-white mb-4">
      {/* Tab Navigation */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white bg-transparent shadow-xs shadow-amber-700"
                : "text-gray-600 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === "bets" && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-[#9f3e3e] pb-2 border-b text-center">
              <div>User</div>
              <div className="text-center">Bet Amount</div>
              <div className="text-center">Result</div>
            </div>

            {liveBets.map((bet, index) => (
              <div
                key={index}
                className="grid grid-cols-3 space-x-2 text-center gap-4 py-2 rounded"
              >
                <div className="text-sm font-medium">
                  {bet.userId[0]}***{bet.userId[length - 1]}
                  {/* {console.log(bet)} */}
                </div>
                <div className="text-sm font-medium">{bet.betAmount}</div>
                <div className="text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium`}
                  >
                    {bet.result}
                  </span>
                </div>
              </div>
            ))}

            {liveBets.length === 0 && (
              <div className="text-center text-white py-8">
                <div className="text-4xl mb-2">🎮</div>
                <div>No Bets available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "top" && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-center text-xs font-medium text-[#9f3e3e] pb-2 border-b">
              <div>User</div>
              <div className="text-center">Bet Amount</div>
              <div className="text-center">Cashed Out</div>
            </div>

            {sortedBets.map((bet, index) => (
              <div
                key={index}
                className="grid grid-cols-3 space-x-2 text-center gap-4 py-2 rounded"
              >
                <div className="text-sm font-medium">
                  {bet.userId[0]}***{bet.userId[length - 1]}
                </div>
                <div className="text-sm font-medium">{bet.betAmount}</div>
                <div className="text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium`}
                  >
                    {bet.payoutAmount}
                  </span>
                </div>
              </div>
            ))}

            {sortedBets.length === 0 && (
              <div className="text-center text-white py-8">
                <div className="text-4xl mb-2">🎮</div>
                <div>No Bets available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "my" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-center text-xs font-medium text-[#9f3e3e] pb-2 border-b">
              <div>Date</div>
              <div className="text-center">Balance</div>
            </div>
            <TransactionHistory userBets={userBets} />
            {userBets.length === 0 && (
              <div className="text-center text-white py-8">
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
