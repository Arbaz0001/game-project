import { useState } from "react";
import Deposite from "./TelegramDeposite";
import GameRoundsTable from "./GameRoundsTable";

const Telegram = () => {
  const [selectField, setSelectField] = useState("games");

  return (
    <div className="min-h-screen flex flex-col w-full  items-center">
      <div className="mb-6 pt-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            selectField === "games"
              ? "bg-amber-500 text-black font-semibold"
              : "bg-gray-700 text-white"
          }`}
          onClick={() => setSelectField("games")}
        >
          Transactions
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectField === "deposite"
              ? "bg-amber-500 text-black font-semibold"
              : "bg-gray-700 text-white"
          }`}
          onClick={() => setSelectField("deposite")}
        >
          Deposits
        </button>
      </div>

      <div className="w-full ">
        {selectField === "games" && <GameRoundsTable />}
        {selectField === "deposite" && <Deposite />}
      </div>
    </div>
  );
};

export default Telegram;
