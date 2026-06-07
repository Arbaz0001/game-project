import { useEffect, useState } from 'react';

function Tile({ index, gameState, isRevealed, isMine, onClick }) {
  const baseClass =
    'aspect-square w-full border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200 rounded-md cursor-pointer select-none';

  const [flipped, setFlipped] = useState(false);

  // Trigger flip state shortly after reveal to start animation
  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => setFlipped(true), 50);
      return () => clearTimeout(timer);
    } else {
      setFlipped(false);
    }
  }, [isRevealed]);

  const getTileClass = () => {
    if (gameState === 'setup') {
      return `${baseClass} bg-gray-300 border-gray-400 cursor-not-allowed`;
    }

    if (!isRevealed && gameState === 'playing') {
      return `${baseClass} bg-blue-200 border-blue-300 hover:bg-blue-300 hover:scale-105`;
    }

    if (!isRevealed) {
      return `${baseClass} bg-gray-300 border-gray-400 cursor-not-allowed`;
    }

    return isMine
      ? `${baseClass} bg-red-500 border-red-600 text-white cursor-default`
      : `${baseClass} bg-green-400 border-green-500 text-white cursor-default`;
  };

  return (
    <div
      className={getTileClass()}
      onClick={gameState === 'playing' && !isRevealed ? onClick : undefined}
      style={{ perspective: '80px' }} // Needed for 3D flip effect
    >
      <div
        className="relative w-full h-full"
        style={{
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-md"
          style={{
            backgroundColor:
              !isRevealed && gameState === 'playing'
                ? '#bfdbfe' // Tailwind bg-blue-200 hex
                : '#d1d5db', // Tailwind bg-gray-300 hex
            border: '2px solid',
            borderColor:
              !isRevealed && gameState === 'playing'
                ? '#93c5fd' // Tailwind border-blue-300 hex
                : '#9ca3af', // Tailwind border-gray-400 hex
            backfaceVisibility: 'hidden',
            fontWeight: '700',
            fontSize: '1.5rem',
            userSelect: 'none',
          }}
        >
          {!isRevealed ? (gameState === 'setup' ? '' : '') : ''}
        </div>

        {/* Back face */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-md ${
            isMine ? 'bg-red-500 border-red-600 text-white' : 'bg-green-400 border-green-500 text-white'
          }`}
          style={{
            borderWidth: '2px',
            borderStyle: 'solid',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            fontSize: '1.75rem',
            userSelect: 'none',
          }}
        >
          {isMine ? '💣' : '💎'}
        </div>
      </div>
    </div>
  );
}

export default Tile;