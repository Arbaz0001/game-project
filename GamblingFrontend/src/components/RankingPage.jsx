import React, { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import BottomBar from "./BottomBar";
import one from "../assets/avtar/1.png";
import two from "../assets/avtar/2.png";
import three from "../assets/avtar/3.png";
import four from "../assets/avtar/4.png";
import five from "../assets/avtar/5.png";
import six from "../assets/avtar/6.png";
import seven from "../assets/avtar/7.png";
import eight from "../assets/avtar/8.png";
import nine from "../assets/avtar/9.png";
import ten from "../assets/avtar/10.png";

const RankingPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Player1",
      points: 2405817,
      bonus: 86000,
      rank: 1,
      avtar: one,
    },
    {
      id: 2,
      name: "flayer2",
      points: 2692414,
      bonus: 130000,
      rank: 2,
      avtar: two,
    },
    {
      id: 3,
      name: "ylayer3",
      points: 2138155,
      bonus: 52000,
      rank: 3,
      avtar: three,
    },
    {
      id: 4,
      name: "ulayer4",
      points: 2109002,
      bonus: 31297,
      rank: 4,
      avtar: four,
    },
    {
      id: 5,
      name: "jlayer5",
      points: 1819301,
      bonus: 28689,
      rank: 5,
      avtar: five,
    },
    {
      id: 6,
      name: "fglayer6",
      points: 1327775,
      bonus: 25211,
      rank: 6,
      avtar: six,
    },
    {
      id: 7,
      name: "ylayer7",
      points: 1193040,
      bonus: 22603,
      rank: 7,
      avtar: seven,
    },
    {
      id: 8,
      name: "clayer8",
      points: 900000,
      bonus: 10000,
      rank: 8,
      avtar: eight,
    },
    {
      id: 9,
      name: "4layer9",
      points: 850000,
      bonus: 15000,
      rank: 9,
      avtar: nine,
    },
    {
      id: 10,
      name: "ulayer10asfd",
      points: 800000,
      bonus: 12000,
      rank: 10,
      avtar: ten,
    },
  ]);

  // Shuffle function
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Update ranks after shuffle
    return shuffled.map((u, idx) => ({ ...u, rank: idx + 1 }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) => shuffleArray(prevUsers));
    }, 5000); // every 6 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-[#1a0a0a] to-[#420303] text-white py-8 px-4 sm:px-8">
      <div className="border-t md:hidden fixed left-0 bottom-0 z-20">
        <BottomBar />
      </div>
      <div className="container mx-auto">
        {/* Jackpot Section */}
        <div className="bg-[#9C1137] p-6 rounded-xl shadow-lg mb-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-400">JACKPOT</h2>
          <div className="text-4xl font-extrabold text-white">₹ 008069381</div>
          <div className="text-sm text-yellow-200 mt-2">
            2% of the total bet of selected games
          </div>
        </div>

        {/* Ranking Section */}
        <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>

        <div className="flex justify-center mb-6">
          {/* Top 3 Ranks */}
          {users.slice(0, 3).map((user) => (
            <div key={user.id} className="text-center mx-4">
              <div className="flex justify-center mb-2">
                <Crown size={48} color="#ffd700" />
              </div>
              <div className="text-xl font-semibold text-yellow-400">
                {user.name[0]}****{user.name[user.name.length - 1]}
              </div>
              <div className="text-lg text-gray-300">
                ₹ {user.points.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                ₹ {user.bonus.toLocaleString()} Bonus
              </div>
            </div>
          ))}
        </div>

        {/* Ranking List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-[#6A1F2A] p-4 rounded-lg flex items-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b6b] to-[#d44444] rounded-full flex justify-center items-center text-xl font-semibold text-white">
                {/* {user.rank} */}
                <img src={user.avtar} className="rounded-full h-full w-full" />
              </div>
              <div className="ml-4 flex-1">
                <div className="font-semibold">
                  {user.name[0]}****{user.name[user.name.length - 1]}
                </div>
                <div className="text-sm text-gray-400">
                  ₹ {user.points.toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                ₹ {user.bonus.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
