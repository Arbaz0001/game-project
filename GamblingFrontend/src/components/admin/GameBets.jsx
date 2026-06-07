import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import BottomBar from "../BottomBar";
import { ReferEarn } from "../ReferEarn";

const GameBets = ({ userId }) => {
  const [userBets, setUserBets] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState("aviator"); // Default to "aviator"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReferOpen, setIsReferOpen] = useState(false);

  const fetchUserBets = async (gameType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/admin/game-history/${userId}/${gameType}`
      );
      setUserBets(response.data.data || []); // Ensure response.data contains the data field
    } catch (err) {
      setError("Failed to fetch data");
      console.error("API Error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const formatTransactionType = (bet) =>
    bet.payoutAmount > 0 ? "Period Win" : "Join Period";

  const getAmount = (bet) => {
    // Format the amount with two decimal places
    const amount = bet.payoutAmount > 0 ? bet.payoutAmount : bet.betAmount;
    return `${amount >= 0 ? "+" : ""}${amount.toFixed(2)}`;
  };

  const getAmountStyle = (bet) => ({
    color: bet.payoutAmount > 0 ? "green" : "red",
    fontWeight: "bold",
  });

  useEffect(() => {
    fetchUserBets(selectedGameType);
  }, [selectedGameType]);

  return (
    <div className="max-w-3xl mx-auto py-2 pb-20 text-gray-300 bg-[#160003] min-h-screen min-w-screen items-center flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-amber-200">
        Game History
      </h2>
      <div className="border-t md:hidden fixed left-0 bottom-0 z-20">
        <BottomBar />
      </div>
      <div className="game-type-selector pb-4 flex gap-8">
        <label htmlFor="gameType">Select Game Type: </label>
        <select
          id="gameType"
          value={selectedGameType}
          onChange={(e) => setSelectedGameType(e.target.value)}
          className="bg-transparent shadow-xs shadow-[#9C1137] px-2 py-1"
        >
          <option value="aviator" className="bg-[#160003] hover:bg-[#160003]">
            Aviator
          </option>
          <option value="mining" className="bg-[#160003] hover:bg-[#160003]">
            Mining
          </option>
          <option value="chicken" className="bg-[#160003] hover:bg-[#160003]">
            Chicken
          </option>
          <option value="color" className="bg-[#160003] hover:bg-[#160003]">
            Color
          </option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table className="min-w-full  rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#451118] text-[#9f3e3e] text-center text-sm font-semibold">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Balance</th>
            </tr>
          </thead>
          <tbody>
            {userBets.map((bet, index) =>
              bet ? (
                <tr
                  key={bet._id || index}
                  className="cursor-pointer transition-colors duration-200 text-center"
                >
                  <td className="px-4 py-3">
                    {moment(bet?.createdAt)
                      .local()
                      .format("YYYY-MM-DD hh:mm A")}
                  </td>
                  <td style={getAmountStyle(bet)}>{getAmount(bet)}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      )}

      <div className="bg-[#451118] flex items-center justify-center w-full h-20 fixed md:bottom-0 bottom-16">
        <a
          onClick={(e) => {
            e.preventDefault();
            setIsReferOpen(true);
          }}
          href="/"
          className="bg-amber-500 text-black px-4 py-2 rounded-md"
        >
          Refer & Earn
        </a>

        {/* Global modal */}
        <ReferEarn
          isOpen={isReferOpen}
          onClose={() => setIsReferOpen(false)}
          userId="12345"
        />
      </div>
    </div>
  );
};

export default GameBets;
