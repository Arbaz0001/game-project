import React, { useEffect, useState } from "react";
import axios from "axios";

const Games = () => {
  const [games, setGames] = useState([
    { gameType: "mining", isVisible: false },
    { gameType: "chicken", isVisible: false },
    { gameType: "aviator", isVisible: false },
    { gameType: "color", isVisible: false },
  ]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/visible-games`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const visibleGameNames = data.data.map((game) => game); // e.g., ['aviator', 'mining']

          setGames((prevGames) =>
            prevGames.map((game) => ({
              ...game,
              isVisible: visibleGameNames.includes(game.gameType),
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Failed to fetch visible games:", error);
      });
  }, []);

  const toggleVisibility = async (gameType, newVisibility) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/game-visibility`,
        {
          gameType,
          isVisible: newVisibility,
        }
      );

      // Update local state
      setGames((prev) =>
        prev.map((game) =>
          game.gameType === gameType
            ? { ...game, isVisible: newVisibility }
            : game
        )
      );
    } catch (error) {
      console.error("Error updating game visibility:", error);
    }
  };

  return (
    <div className="p-6 text-gray-200 text-center">
      <h2 className="text-2xl font-bold mb-4">Game Visibility Manager</h2>
      <table className="max-w-xl w-full border border-gray-200 rounded">
        <thead className="bg-transparent shadow shadow-gray-600">
          <tr>
            <th className="text-center px-4 py-2">Game</th>
            <th className="text-center px-4 py-2">Visibility</th>
            <th className=" px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {games.map(({ gameType, isVisible }) => (
            <tr key={gameType} className="border-t">
              <td className="px-2 py-2">{gameType}</td>
              <td className="px-2 py-2">
                <span
                  className={`font-semibold ${
                    isVisible ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {isVisible ? "Enabled" : "Disabled"}
                </span>
              </td>
              <td className="px-2 py-2">
                <div
                  onClick={() => toggleVisibility(gameType, !isVisible)}
                  className={`px-1 py-1 rounded text-white ${
                    isVisible
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isVisible ? "Disable" : "Enable"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Games;
