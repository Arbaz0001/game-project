import { X, Trophy, Frown } from 'lucide-react';

const WinPopup = ({ winAmount, multiplier, betAmount, gameState, onClose }) => {
  const isWin = gameState === 'won';
  
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-300 shadow-sm shadow-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="mb-6">
          {isWin ? (
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
          ) : (
            <Frown className="w-16 h-16 text-red-500 mx-auto" />
          )}
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold mb-4 ${isWin ? 'text-green-600' : 'text-red-600'}`}>
          {isWin ? 'Congratulations!' : 'Game Over!'}
        </h2>

        {/* Results */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bet Amount:</span>
            <span className="font-semibold">${betAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Multiplier:</span>
            <span className={`font-semibold ${isWin ? 'text-green-600' : 'text-red-600'}`}>
              {multiplier.toFixed(2)}x
            </span>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {isWin ? 'You Won:' : 'You Lost:'}
              </span>
              <span className={`text-xl font-bold ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                {isWin ? `+$${winAmount.toFixed(2)}` : `-$${betAmount.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {isWin 
            ? `Great job! You cashed out at ${multiplier.toFixed(2)}x multiplier.`
            : 'Better luck next time! The chicken hit a 0x multiplier.'
          }
        </p>

        {/* Play Again Button */}
        <button 
          onClick={onClose}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isWin 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinPopup;