import React, { useEffect, useState } from "react";

export default function Timer({ onFinish }) {
  const [time, setTime] = useState(5);

  useEffect(() => {
    if (time === 0) {
      if (onFinish) onFinish(); // parent ko inform karega
      return;
    }
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onFinish]);

  if (time === 0) return null; // 👈 zero hone ke baad gayab

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="flex space-x-2">
        {String(time)
          .padStart(2, "0")
          .split("")
          .map((digit, idx) => (
            <div
              key={idx}
              className="bg-blue-900 text-cyan-400 font-bold text-9xl flex items-center justify-center rounded-2xl w-32 h-48 shadow-lg"
            >
              {digit}
            </div>
          ))}
      </div>
    </div>
  );
}
