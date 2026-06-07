import { useState } from "react";

const BettingSection = ({
  selectedBet,
  setSelectedBet,
  betAmount,
  setBetAmount,
  multiplier,
  setMultiplier,
  onPlaceBet,
  disabled,
}) => {
  const colorButtons = [
    { color: "green", label: "Green", bg: "bg-green-500" },
    { color: "violet", label: "Violet", bg: "bg-purple-500" },
    { color: "red", label: "Red", bg: "bg-red-500" },
  ];

  const multiplierButtons = [1, 5, 10, 50, 100];

  const sizeButtons = [
    { size: "small", label: "Small", desc: "0-4" },
    { size: "big", label: "Big", desc: "5-9" },
  ];

  const handleBetSelect = (type, value) => {
    setSelectedBet({ type, value });
  };

  const isSelected = (type, value) => {
    return selectedBet?.type === type && selectedBet?.value === value;
  };

  return (
    <div className="p-2 space-y-4 bg-[#010139] mb-4 mx-4 rounded-md shadow-2xl">
      {/* Color Betting */}
      <div className="grid grid-cols-3 gap-2">
        {colorButtons.map(({ color, label, bg }) => (
          <button
            key={color}
            onClick={() => handleBetSelect("color", color)}
            className={`${bg} text-white py-3 px-4 cursor-pointer font-medium relative transition-all
              ${
                color === "green"
                  ? "rounded-bl-xl rounded-tr-xl"
                  : color === "violet"
                  ? "rounded-xl"
                  : "rounded-tl-xl rounded-br-xl"
              }
              ${isSelected("color", color) ? "ring-2 ring-blue-400" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-95"}
            `}
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Number Betting */}
      <div className="bg-[#010125]  p-4 rounded-2xl">
        <div className="grid grid-cols-5 gap-4 ">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isRed = [2, 4, 6, 8].includes(num);
            const isGreen = [1, 3, 7, 9].includes(num);
            const isViolet = [0, 5].includes(num);

            let bgGradient = "";
            let textColor = "";

            if (isRed) {
              bgGradient = "from-red-400 via-red-600 to-red-400";
              textColor = "text-red-700";
            } else if (isGreen) {
              bgGradient = "from-green-300 via-green-500 to-green-300";
              textColor = "text-green-700";
            } else if (isViolet) {
              bgGradient = "from-purple-400 via-purple-600 to-purple-400";
              textColor = "text-purple-700";
            }

            return (
              <div
                key={num}
                onClick={() => handleBetSelect("number", num)}
                className={`relative h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br ${bgGradient}
                flex items-center justify-center text-lg font-bold ${textColor}
                shadow-inner shadow-white/30 cursor-pointer hover:scale-95 transition-all duration-150
                ${isSelected("number", num) ? "ring-2 ring-yellow-300" : ""}
              `}
              >
                {/* Highlights like poker chip */}
                <div className="absolute -bottom-[6px] w-3.5 h-3 rounded-full bg-white"></div>
                <div className="absolute -top-[6px] w-3.5 h-3 rounded-full bg-white"></div>
                <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 h-3.5 w-3 rounded-full bg-white"></div>
                <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 h-3.5 w-3 rounded-full bg-white"></div>
                <span className="bg-white px-3 py-1 rounded-full">{num}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multiplier */}
      <div className="flex gap-2 mx-1">
        {multiplierButtons.map((mult) => (
          <button
            key={mult}
            onClick={() => setMultiplier(mult)}
            className={`flex-1 py-2 px-1 rounded-lg cursor-pointer font-medium transition-all
              ${
                multiplier === mult
                  ? "bg-green-600 text-white"
                  : "bg-[#03035b] text-gray-300 hover:bg-[#0a0a82]"
              }
            `}
            disabled={disabled}
          >
            x{mult}
          </button>
        ))}
      </div>

      {/* Size Betting */}
      <div className="grid grid-cols-2 mx-1">
        {sizeButtons.map(({ size, label }) => (
          <button
            key={size}
            onClick={() => handleBetSelect("size", size)}
            className={`py-2 px-4 font-medium transition-all
              ${
                size === "small"
                  ? "rounded-l-full bg-yellow-500"
                  : "rounded-r-full bg-blue-500 text-white"
              }
              ${isSelected("size", size) ? "ring-2 ring-blue-400" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bet Amount */}
      <div className="flex items-center gap-2 mx-1">
        <button
          onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
          className="px-3 py-2 h-10 w-10 text-black bg-gray-200 rounded-full font-medium"
          disabled={disabled}
        >
          -
        </button>
        <input
          type="number"
          value={betAmount}
          onChange={(e) =>
            setBetAmount(
              isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
            )
          }
          className="flex-1 text-center py-2 border border-gray-300 rounded-full font-medium"
          min="10"
          disabled={disabled}
        />
        <button
          onClick={() => setBetAmount(betAmount + 10)}
          className="px-3 py-2 h-10 w-10 bg-gray-200 text-black rounded-full font-medium"
          disabled={disabled}
        >
          +
        </button>
      </div>

      {/* Place Bet Button */}
      <button
        onClick={onPlaceBet}
        disabled={!selectedBet || disabled}
        className={`w-full py-3 rounded-full font-bold text-lg transition-all
          ${
            !selectedBet || disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900 shadow-lg hover:shadow-xl"
          }
        `}
      >
        {disabled
          ? "Betting Closed"
          : selectedBet
          ? `Place Bet ₹${betAmount * multiplier}`
          : "Select Your Bet"}
      </button>

      {selectedBet && (
        <div className="text-center text-sm text-gray-300">
          Selected: {selectedBet.type} - {selectedBet.value} | Amount: ₹
          {betAmount * multiplier}
        </div>
      )}
    </div>
  );
};

export default BettingSection;
