const MultiplierStep = ({ multiplier, isActive, isVisited, gameState, visualMultiplier }) => (
  <div className="relative w-full h-full flex flex-col px-6 pb-20 items-center justify-center">
    {/* Vertical Dotted Line */}

    <div className="absolute top-0 h-full bottom-0 right-0 w-px border-r-4 border-dotted border-white opacity-40" />

    {/* Multiplier Circle */}
    <div
      className={`relative z-10 mt-2 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300 ${isActive
          ? "bg-green-500 scale-110 shadow-green-500/50"
          : isVisited && gameState === 'playing'
            ? "bg-green-600"
            : "bg-gray-700"
        }`}
    >
      {visualMultiplier.toFixed(2)}x
    </div>
  </div>
);

export default MultiplierStep;