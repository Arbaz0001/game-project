import { Clock, TrendingUp } from "lucide-react";
import Header from "./Header";
import { useBalance } from "../../context/BalanceContext";
import { useState } from "react";

const GameHeader = ({
  period,
  timeLeft,
  showPopup,
  savedResult,
  popupTimer,
}) => {
  const { balance } = useBalance();
  const integerBalance = Math.floor(parseInt(balance, 10));

  // const formatTime = (seconds) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, "0")}:${secs
  //     .toString()
  //     .padStart(2, "0")}`;
  // };

  // const getTimerColor = () => {
  //   if (timeLeft <= 10) return "text-red-400";
  //   if (timeLeft <= 30) return "text-yellow-400";
  //   return "text-white";
  // };

  const methods = [`WinGo 30sec`, "WinGo 1 Min", "WinGo 3 Min", "WinGo 5 Min"];
  const [activeMethod, setActiveMethod] = useState(methods[0]);

  console.log(activeMethod);
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const getTimerColor = () => {
    if (timeLeft < 10) return "text-red-500";
    if (timeLeft < 30) return "text-yellow-400";
    return "text-green-400";
  };

  const ClockIcon = ({ size = 40 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      {/* Outer gray circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      {/* Inner white circle */}
      <circle cx="50" cy="50" r="42" fill="white" />
      {/* Clock hands */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="25"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="70"
        y2="50"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="50" cy="50" r="4" fill="black" />
    </svg>
  );

  return (
    <div className=" bg-[#010125]  text-white p-4">
      {/* <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold">Color Trading</div>
        <div className="max-w-8 px-3 min-w-36 py-2 bg-[#fff] rounded text-gray-800 font-medium">{``}</div>
      </div> */}

      <div className="space-y-3">
        {/* Top Buttons */}
        {/* <div className="flex justify-around mb-4 bg-[#040446] rounded-lg">
          {methods.map((label) => {
            const isActive = label === activeMethod;
            return (
              <button
                key={label}
                onClick={() => setActiveMethod(label)}
                className={`flex flex-col cursor-pointer items-center gap-1 px-3 py-4 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-gradient-to-tr from-teal-400  to-cyan-300 text-black"
                  : "text-white"
              }`}
              >
                <ClockIcon size={28} active={isActive} />
                {label}
              </button>
            );
          })}
        </div> */}
        {/* Timer + Result Row */}
        {/* <span className=" bg-white text-black px-3 py-2 rounded-md">
                ₹{integerBalance}
              </span> */}
        <div className="relative w-full max-w-md mx-auto">
          {/* Ticket Background */}
          <div className="bg-gradient-to-b from-teal-400  to-sky-500 rounded-xl shadow-lg p-4 flex justify-between items-center relative">
            {/* Ticket cutouts */}
            <div className="absolute left-1/2 -top-3 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#010139]"></div>
            <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#010139]"></div>

            <div className="absolute top-5 bottom-5 left-1/2 border-l-2 border-dashed border-teal-600/70"></div>

            {/* Left Side */}
            <div className="flex flex-col gap-2">
              {/* <button className="px-3 py-1 bg-white/30 text-xs text-black rounded-full shadow-sm">
                How to play
              </button> */}
              <span className="px-3 py-2 bg-white/30 text-sm text-black rounded-full shadow-sm">
                ₹{integerBalance}
              </span>
              <span className="text-sm font-semibold text-black">
                WinGo 30sec
              </span>
            </div>

            {/* Right Side */}
            <div className="text-right">
              <span className="text-md font-semibold text-black/80">
                Time remaining
              </span>
              <div className="flex justify-end gap-1 text-black font-bold text-lg mt-1">
                <div className="flex justify-end gap-1 text-black font-bold text-lg mt-1">
                  {formatTime(timeLeft)
                    .split("")
                    .map((char, index) =>
                      char === "" ? (
                        <span key={index} className="px-0.5">
                          {char}
                        </span>
                      ) : (
                        <span
                          key={index}
                          className={`bg-black text-white px-1.5 py-0.5 
                            ${
                              index === 0
                                ? "rounded-tl-xl"
                                : index === 4
                                ? "rounded-br-xl"
                                : ""
                            }
                            `}
                        >
                          {char}
                        </span>
                      )
                    )}
                </div>
                {/* {formatTime(timeLeft)} */}
              </div>
              <span className="text-sm font-semibold text-black/80 mt-1 block">
                {/* {period?.slice(-6) || "---"} */}
                {period}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="text-right flex flex-col leading-tight">
            <span className="opacity-70">Time remaining</span>
            <span className={`font-bold text-lg ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs opacity-80">
              {period?.slice(-6) || "---"}
            </span>
          </div> */}
      {/* <div className="flex justify-around mb-4">
        {["WinGo 30sec", "WinGo 1 Min", "WinGo 3 Min", "WinGo 5 Min"].map(
          (label, index) => {
            const isActive = label === "WinGo 30sec"; // Mock active
            return (
              <button
                key={label}
                className={
                  ("flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition",
                  {
                    "bg-green-300 text-black": isActive,
                    "bg-white/10 text-white": !isActive,
                  })
                }
              >
                <Clock size={16} />
                {label}
              </button>
            );
          }
        )}
      </div>
      
      <div className="bg-white/10 p-3  rounded-lg grid grid-cols-2 gap-4 text-sm mb-2">
        <div className="flex items-center gap-2">
          <button
            className="bg-white text-blue-600 px-2 py-1 text-xs rounded font-medium"
            onClick={showPopup}
          >
            How to play
          </button>
          <span className="font-semibold">WinGo 30sec</span>
        </div>
        <div className="text-right flex flex-col ">
          <span className="opacity-70 ">Time remaining</span>
          <span className={`font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </span>
          <span>{period.slice(-6) || "---"}</span>
        </div>
      </div> */}

      {/* Result Balls */}
      {/* <div className="flex justify-start gap-2 mb-3">
        {["1", "8", "5", "0", "0"].map((num, i) => (
          <div
            key={i}
            className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor:
                i === 0 ? "#7fff7f" : i === 1 ? "#ff7f7f" : "#e0e0e0",
              color: "black",
            }}
          >
            {num}
          </div>
        ))}
      </div> */}

      {/* Period ID */}

      {/* <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs opacity-80 mb-1">Time to stop</div>
          <div className={`text-xl font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs opacity-80 mb-1">Period</div>
          <div className="text-lg font-bold">{period.slice(-6) || "---"}</div>
        </div>
      </div> */}
    </div>
  );
};

export default GameHeader;

// import { Clock } from "lucide-react";
// import { useBalance } from "../../context/BalanceContext";

// const GameHeader = ({
//   period,
//   timeLeft,
//   showPopup,
//   savedResult,
//   popupTimer,
// }) => {
//   const { balance } = useBalance();
//   const integerBalance = Math.floor(parseInt(balance, 10));

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const getTimerColor = () => {
//     if (timeLeft <= 10) return "text-red-400";
//     if (timeLeft <= 30) return "text-yellow-400";
//     return "text-white";
//   };

//   return (
//     <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-lg shadow-md">
//       {/* Top Tabs */}
//       <div className="flex justify-around mb-4">
//         {["WinGo 30sec", "WinGo 1 Min", "WinGo 3 Min", "WinGo 5 Min"].map(
//           (label, index) => {
//             const isActive = label === "WinGo 30sec"; // Mock active
//             return (
//               <button
//                 key={label}
//                 className={
//                   ("flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition",
//                   {
//                     "bg-green-300 text-black": isActive,
//                     "bg-white/10 text-white": !isActive,
//                   })
//                 }
//               >
//                 <Clock size={16} />
//                 {label}
//               </button>
//             );
//           }
//         )}
//       </div>

//       {/* Timer + Result Row */}
//       <div className="bg-white/10 p-3 rounded-lg grid grid-cols-2 gap-4 text-sm mb-2">
//         <div className="flex items-center gap-2">
//           <button
//             className="bg-white text-blue-600 px-2 py-1 text-xs rounded font-medium"
//             onClick={showPopup}
//           >
//             How to play
//           </button>
//           <span className="font-semibold">WinGo 30sec</span>
//         </div>
//         <div className="text-right">
//           <span className="opacity-70 mr-2">Time remaining</span>
//           <span className={`font-bold ${getTimerColor()}`}>
//             {formatTime(timeLeft)}
//           </span>
//         </div>
//       </div>

//       {/* Result Balls */}
//       <div className="flex justify-start gap-2 mb-3">
//         {["1", "8", "5", "0", "0"].map((num, i) => (
//           <div
//             key={i}
//             className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
//             style={{
//               backgroundColor:
//                 i === 0 ? "#7fff7f" : i === 1 ? "#ff7f7f" : "#e0e0e0",
//               color: "black",
//             }}
//           >
//             {num}
//           </div>
//         ))}
//       </div>

//       {/* Period ID */}
//       <div className="text-center text-xs text-white/80">
//         {period || "20250902100052270"}
//       </div>
//     </div>
//   );
// };

// export default GameHeader;
