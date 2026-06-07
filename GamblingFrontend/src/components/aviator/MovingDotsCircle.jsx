import React, { useState, useEffect } from "react";

export default function MovingDotsLine() {
  const [isMoving, setIsMoving] = useState(true);
  const dotCount = 15;
  const containerHeight = 300;

  // Initial offsets for each dot (staggered positions)
  const [dotOffsets, setDotOffsets] = useState(
    Array.from({ length: dotCount }, (_, i) => i * 20)
  );

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setDotOffsets((prev) =>
        prev.map((offset) => (offset < 0 ? containerHeight : offset - 2)) // loop upward
      );
    }, 60); // smoother animation (30ms ≈ 33fps)

    return () => clearInterval(interval);
  }, [isMoving]);

  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ height: containerHeight }}
    >
      {dotOffsets.map((offset, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_6px_white]"
          style={{
            right: "0", // center horizontally
            bottom: `${offset % containerHeight}px`,
            transform: "translateX(-50%)",
          }}
        />
      ))}
    </div>
  );
}
