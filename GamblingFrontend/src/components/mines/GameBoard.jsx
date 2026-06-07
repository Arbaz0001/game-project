import Tile from './Tile';

function GameBoard({ gameState, revealedTiles, currentMines, onTileClick }) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-5 bg-transparent shadow mx-2 shadow-gray-600 p-2 md:p-4 rounded gap-2 w-[40rem] md:w-[25rem]">
        {Array.from({ length: 25 }, (_, index) => (
          <Tile
            key={index}
            index={index}
            gameState={gameState}
            isRevealed={revealedTiles.includes(index)}
            isMine={currentMines.includes(index)}
            onClick={() => onTileClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;