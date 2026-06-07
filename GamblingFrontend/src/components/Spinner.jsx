import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}/api/v1/spinner`;

const Spinner = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [rotation, setRotation] = useState(0);
  const [cooldownMessage, setCooldownMessage] = useState("");
  const canvasRef = useRef(null);
  const [prizes, setPrizes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  // ✅ Fetch prizes from backend
  const fetchPrizes = async () => {
    try {
      const res = await axios.get(`${API}/prizes`);
      setPrizes(res.data[0]?.prizes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateWithdrawalStatus = async (amount) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/wallet/update-deposite-transaction-status`,
        {
          status: "approved",
          userId: userId,
          amount: parseInt(amount),
        }
      );

      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === transactionId
              ? { ...transaction, status }
              : transaction
          )
        );
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const radius = 150;

  // ✅ Calculate dynamic segment angle
  const segmentAngle = prizes.length ? 360 / prizes.length : 360;

  const getRandomRotation = () => Math.floor(Math.random() * 360) + 3600; // 10+ spins

  // ✅ FIXED Winning Segment with pointer on top
  const getWinningSegment = (rotation) => {
    if (!prizes.length) return null;
    const normalizedRotation = rotation % 360;

    // By default canvas 0° = right (3 o’clock), but pointer is at top (12 o’clock)
    const adjustedRotation = (normalizedRotation + 90) % 360;

    const index = Math.floor(adjustedRotation / segmentAngle) % prizes.length;

    return prizes[prizes.length - 1 - index];
  };

  const drawSpinner = (rotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    prizes.forEach((p, i) => {
      const angleStart = (i * 360) / prizes.length;
      const angleEnd = ((i + 1) * 360) / prizes.length;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0,
        0,
        radius,
        (angleStart * Math.PI) / 180,
        (angleEnd * Math.PI) / 180
      );
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#FF5733" : "#FFC300";
      ctx.fill();

      // Draw prize text
      ctx.save();
      const textAngle = ((angleStart + angleEnd) / 2) * (Math.PI / 180);
      ctx.rotate(textAngle);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.fillText(p, radius * 0.6, 0);
      ctx.restore();
    });

    ctx.restore();
  };
  const navigate = useNavigate();
  const spinWheel = () => {
    if (isSpinning || !prizes.length) return;

    // ✅ Check cooldown
    const lastSpin = localStorage.getItem("lastSpinTime");
    const now = Date.now();
    if (lastSpin && now - lastSpin < 3600000) {
      return; // still in cooldown
    }

    // ✅ Save new spin time
    localStorage.setItem("lastSpinTime", now);

    setIsSpinning(true);
    const finalRotation = getRandomRotation();
    let currentRotation = rotation;
    let speed = 30;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      currentRotation += speed;
      setRotation(currentRotation);

      // Slow down gradually
      if (elapsed < 4000) {
        if (speed > 0.5) speed *= 0.97;
        requestAnimationFrame(animate);
      } else {
        const prize = getWinningSegment(currentRotation);

        if (prize && prize !== "LOSE") {
          updateWithdrawalStatus(prize);
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);

        setResultMessage(`🎉 You won: ${prize}`);
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  // ✅ Check cooldown on load and update message every second
  useEffect(() => {
    const checkCooldown = () => {
      const lastSpin = localStorage.getItem("lastSpinTime");
      if (lastSpin) {
        const now = Date.now();
        const diff = now - lastSpin;
        if (diff < 3600000) {
          const remaining = 3600000 - diff;
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setCooldownMessage(`You can spin again in ${minutes}m ${seconds}s`);
          return;
        }
      }
      setCooldownMessage("");
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    drawSpinner(rotation);
  }, [rotation, prizes]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white relative">
      <p className="mb-4 text-lg font-semibold">
        {isSpinning ? "Spinning..." : "Click to Spin"}
      </p>

      {/* Spinner with pointer */}
      <div className="relative">
        {/* Canvas wheel */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border-8 border-white rounded-full"
        />

        {/* Pointer (fixed at top center, downward facing blue triangle) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[165px]">
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "30px solid #3B82F6", // 🔵 royal blue pointer
            }}
          ></div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || !prizes.length || cooldownMessage}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md disabled:bg-gray-500 hover:bg-blue-700 transition-colors"
      >
        {cooldownMessage ? cooldownMessage : "Spin"}
      </button>

      {/* Result Message */}
      {resultMessage && (
        <p className="mt-6 text-xl font-bold text-yellow-400">
          {resultMessage}
        </p>
      )}
    </div>
  );
};

export default Spinner;
