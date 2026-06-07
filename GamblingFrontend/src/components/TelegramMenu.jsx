import { ArrowDownNarrowWide } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PiSpinnerBallFill } from "react-icons/pi";

const TelegramMenu = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [button, setButton] = useState(true);

  // Toggle the visibility of the options menu
  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
    setButton((prev) => !prev); // Toggle button visibility
  };

  return (
    <div className="relative flex items-center z-50 justify-center">
      {/* Options panel with transition */}
      {showOptions && (
        <div className="absolute right-0 bottom-0 flex flex-col bg-gradient-to-b from-black via-[#9C1137] to-black rounded-xl items-center space-y-2 p-4 z-50 transition-all duration-1000 ease-in-out transform translate-y-0 opacity-100">
          <button onClick={toggleOptions}>
            <ArrowDownNarrowWide color="gold" />
          </button>
          {/* Links for different games */}
          <Link
            to={"/telegram-subscription/chicken"}
            className="text-amber-200 flex flex-col items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
              alt="Telegram"
              className="w-8 h-8 rounded-full cursor-pointer hover:scale-105 transition-transform"
              style={{
                boxShadow: "0 4px 6px 2px rgba(0,136,204, 0.5)", // Consistent shadow
              }}
              onClick={toggleOptions} // Close menu when clicked
            />
            <span className="font-medium">Chicken</span>
          </Link>
          <Link
            to={"/telegram-subscription/aviator"}
            className="text-amber-200 flex flex-col items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
              alt="Telegram"
              className="w-8 h-8 rounded-full cursor-pointer hover:scale-105 transition-transform"
              style={{
                boxShadow: "0 4px 6px 2px rgba(0,136,204, 0.5)",
              }}
              onClick={toggleOptions}
            />

            <span className="font-medium">Aviator</span>
          </Link>
          <Link
            to={"/telegram-subscription/mines"}
            className="text-amber-200 flex flex-col items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
              alt="Telegram"
              className="w-8 h-8 rounded-full cursor-pointer hover:scale-105 transition-transform"
              style={{
                boxShadow: "0 4px 6px 2px rgba(0,136,204, 0.5)",
              }}
              onClick={toggleOptions}
            />
            <span className="font-medium">Mines</span>
          </Link>

          <Link
            to={"/telegram-subscription/color"}
            className="text-amber-200 flex flex-col items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
              alt="Telegram"
              className="w-8 h-8 rounded-full cursor-pointer hover:scale-105 transition-transform"
              style={{
                boxShadow: "0 4px 6px 2px rgba(0,136,204, 0.5)",
              }}
              onClick={toggleOptions}
            />
            <span className="font-medium">Color</span>
          </Link>
        </div>
      )}

      {/* Telegram Image (button) */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
          alt="Telegram"
          className={`w-10 h-10 ${
            button ? "inline" : "hidden"
          } cursor-pointer rounded-full shadow-lg shadow-blue-500 hover:scale-105 transition-transform`}
          style={{
            boxShadow: "0 4px 6px 2px rgba(0,136,204, 0.7)", // Consistent shadow for icon
          }}
          onClick={toggleOptions}
        />

        <Link
          to={"spinner"}
          className="text-amber-200 flex flex-col items-center"
        >
          <PiSpinnerBallFill
            className="w-10 h-10 text-amber-400 animate-spin cursor-pointer hover:scale-110 transition-transform"
            style={{ filter: "drop-shadow(0 4px 6px rgba(255,165,0,0.5))" }}
            onClick={toggleOptions}
          />
          <span className="font-medium">Spinner</span>
        </Link>
      </div>
    </div>
  );
};

export default TelegramMenu;
