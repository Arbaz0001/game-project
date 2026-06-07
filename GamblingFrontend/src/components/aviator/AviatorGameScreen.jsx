import React, { useEffect, useRef, useState } from "react";
import { useAviatorSocket } from "../../context/AviatorSocketContext";
import { getUserBets, getAllBets } from "../../services/aviatorApi";
import { History } from "lucide-react";
import HistorySection from "./HistorySection";
import Header from "./Header";
import { useDeviceType } from "../../hooks/deviceType";

import { useBalance } from "../../context/BalanceContext";

export default function AviatorGameScreen() {
  const {
    socket,
    isConnected,
    multiplier,
    crashPoint,
    isRunning,
    liveBets,
    topBets,
    hasBet,
    gameHistory,
    setHasBet,
  } = useAviatorSocket();

  const device = useDeviceType();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const crashPoints = gameHistory ? gameHistory.slice(1) : [];

  const [isExpanded, setIsExpanded] = useState(false);
  const [nextRoundTimer, setNextRoundTimer] = useState(0);
    const [showWinPopup, setShowWinPopup] = useState(false);
  useEffect(() => {
    // const audio = new Audio("/main.mp3");
    // audio.loop = true;
    // audio.play().catch((err) => {
    //   console.error("Autoplay failed:", err);
    // });
    // return () => {
    //   audio.pause();
    //   audio.currentTime = 0;
    // };
  }, []);

  const toggleHistory = () => setIsExpanded((prev) => !prev);

  const getColor = (value) => {
    if (value <= 3) return "bg-purple-500";
    if (value < 7) return "bg-cyan-500";
    return "bg-green-500";
  };

  const [bet, setBet] = useState(10);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [activeTab, setActiveTab] = useState("bets");
  const [userBets, setUserBets] = useState([]);
  const [allBets, setAllBets] = useState([]);
  const { balance, setBalance, loadBalance } = useBalance();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTsRef = useRef(null);

  const planeImg = useRef(new Image());
  planeImg.current.src = "./plane.png";

  // logical viewbox
  const VIEW_W = device === "desktop" ? 750 : device === "tablet" ? 700 : 500;
  const VIEW_H = device === "desktop" ? 560 : device === "tablet" ? 560 : 600;
  const PAD = 28;
  const yTop = PAD;
  const yBottom = VIEW_H - PAD;

  const PASS_SECONDS = 2.75;

  useEffect(() => {
    fetchUserBets();
  }, [multiplier]);

  useEffect(() => {
    if (!isRunning && crashPoint) {
      let countdown = 5;
      setNextRoundTimer(countdown);

      const interval = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
          clearInterval(interval);
          setNextRoundTimer(0);
        } else {
          setNextRoundTimer(countdown);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, crashPoint]);

  const fetchUserBets = async () => {
    if (!userId) return;
    try {
      const response = await getUserBets(userId);
      const responseAll = await getAllBets();
      console.log("All Bets:", responseAll);
      if (responseAll.data.success) {
        setAllBets(responseAll.data.data);
      }
      if (response.data.success) {
        setUserBets(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching game history:", error);
    }
  };
  33;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const displayWidth = canvas.parentElement.clientWidth;
      const displayHeight = Math.min(window.innerHeight * 0.6, 500);

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = (ts) => {
      if (!startTsRef.current) startTsRef.current = ts;
      const tSec = (ts - startTsRef.current) / 1000;

      // CSS pixel width/height after DPR scaling
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.clearRect(0, 0, W, H);

      const sx = W / VIEW_W;
      const sy = H / VIEW_H;

      // drawBackground(ctx, W, H);
      drawBackground(
        ctx,
        canvas.width,
        device === "desktop"
          ? canvas.height
          : device === "tablet"
          ? canvas.height - 100
          : canvas.height - 300
      );

      const { x, y } = getPlanePos(tSec);

      // ==========================
      // Tail: curve + fill red
      // ==========================
      ctx.save();
      ctx.beginPath();

      const bottomY = H; // actual bottom in CSS pixels

      ctx.moveTo(PAD * sx, bottomY);

      const cpX = (x * sx) / 2;
      const cpY = bottomY - (bottomY - y * sy) * 0.25;

      ctx.quadraticCurveTo(cpX, cpY, x * sx, y * sy);
      ctx.lineTo(x * sx, bottomY);

      ctx.closePath();
      ctx.fillStyle = "rgba(255, 80, 80, 0.3)";
      ctx.fill();
      ctx.restore();

      // ==========================
      // Plane
      // ==========================
      const planeSize = 100;
      const px = x * sx - (planeSize * sx) / 2;
      const py = y * sy - (planeSize * sy) / 1.2;
      try {
        ctx.drawImage(planeImg.current, px, py, planeSize * sx, planeSize * sy);
      } catch {}

      if (isRunning) rafRef.current = requestAnimationFrame(render);
    };

    if (isRunning) {
      startTsRef.current = null;
      rafRef.current = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isRunning]);

  // Glow + background
  let rayRotation = 0;
  const glowColors = ["cyan", "green", "purple"];
  let currentColorIndex = 0;
  let nextColorIndex = 1;
  let transitionProgress = 0;

  function updateGlowColor() {
    transitionProgress += 0.001;
    if (transitionProgress >= 1) {
      transitionProgress = 0;
      currentColorIndex = nextColorIndex;
      nextColorIndex = (nextColorIndex + 1) % glowColors.length;
    }
  }

  function lerpColor(a, b, t) {
    const pa = parseInt(a.slice(1), 16),
      pb = parseInt(b.slice(1), 16);
    const ar = (pa >> 16) & 0xff,
      ag = (pa >> 8) & 0xff,
      ab = pa & 0xff;
    const br = (pb >> 16) & 0xff,
      bg = (pb >> 8) & 0xff,
      bb = pb & 0xff;
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `rgb(${rr},${rg},${rb})`;
  }

  function drawBackground(ctx, width, height) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    updateGlowColor();
    const colorA = glowColors[currentColorIndex];
    const colorB = glowColors[nextColorIndex];
    const glowColor = lerpColor(
      colorToHex(colorA),
      colorToHex(colorB),
      transitionProgress
    );

    const glowRadius = width * 0.7;
    const glowGradient = ctx.createRadialGradient(
      0,
      height,
      0,
      0,
      height,
      glowRadius
    );
    glowGradient.addColorStop(0, glowColor);
    glowGradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);

    const numRays = 20;
    ctx.save();
    ctx.translate(0, height);
    for (let i = 0; i < numRays; i++) {
      const baseAngle = (Math.PI / 2) * (i / (numRays - 1));
      const angle = (baseAngle + rayRotation) % (Math.PI / 2);
      const rayLength = width * 0.8;
      const rayGradient = ctx.createLinearGradient(
        0,
        0,
        Math.cos(angle) * rayLength,
        -Math.sin(angle) * rayLength
      );
      rayGradient.addColorStop(0, "rgba(255,255,255,0.25)");
      rayGradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rayGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(angle) * rayLength,
        -Math.sin(angle) * rayLength - 30
      );
      ctx.lineTo(
        Math.cos(angle) * rayLength,
        -Math.sin(angle) * rayLength + 30
      );
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    rayRotation += 0.003;
  }

  function colorToHex(color) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle;
  }

  const getPlanePos = (tSec) => {
    const cycleIndex = Math.floor(tSec / PASS_SECONDS);
    const cycleT = (tSec % PASS_SECONDS) / PASS_SECONDS;
    const yMiddle = (yTop + yBottom) / 2;
    let x, y;
    if (cycleIndex === 0) {
      x = PAD + cycleT * (VIEW_W - 2 * PAD - 70);
      y = yMiddle - (yMiddle - yTop) * cycleT;
    } else {
      x = VIEW_W - PAD - 70;
      const goingDown = cycleIndex % 2 === 1;
      if (goingDown) {
        y = yTop + (yMiddle - yTop) * cycleT;
      } else {
        y = yMiddle - (yMiddle - yTop) * cycleT;
      }
    }
    return { x, y, cycleIndex, cycleT };
  };

  const handlePlaceBet = async () => {
    if (!isConnected || hasBet || !userId) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/aviator/bet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, amount: bet }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to place bet");
      setHasBet(true);
      setBalance((prev) => prev - bet);
      setHasCashedOut(false);
    } catch (error) {
      console.error("Error placing bet:", error.message);
    }
  };
  const closePopup = () => {
    setShowWinPopup(false);

  };
  const handleCashOut = async () => {
    if (!isConnected || !hasBet || hasCashedOut || !userId) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/aviator/cashout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Cash out failed");
      const audio1 = new Audio("/win.wav");
      audio1.play().catch(() => {});
      setHasCashedOut(true);
      
    } catch (error) {
      console.error("Error during cash out:", error.message);
    }
  };

  const getPotentialWin = () => (bet * multiplier).toFixed(2);

  console.log(user?._id);
  return (
    <div className="min-h-screen bg-[#160003] text-white">
      <Header />

      {/* history strip */}
      <div className="flex mb-2 w-full md:px-12 px-3 gap-2 items-start">
        <div
          className={`overflow-y-hidden overflow-x-auto ${
            isExpanded ? "" : ""
          }`}
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-nowrap gap-2 bg-transparent mt-2 p-4 rounded-md">
            {crashPoints.map((point, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded-2xl font-mono font-semibold shadow-sm ${getColor(
                  point?.crashPoint ?? null
                )}`}
              >
                {point?.crashPoint ?? null}x
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={toggleHistory}
          className="mt-6 flex items-center bg-transparent shadow-xs shadow-[#9C1137] text-white p-2 rounded"
        >
          <History className="mr-2 h-5 w-5" />
        </button>
      </div>

      {/* Game container */}
      <div className="w-full relative flex justify-center overflow-hidden md:px-0 px-1">
        <div className="relative w-full mx-2 max-w-6xl rounded-2xl overflow-hidden border border-white/5">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20">
            <div className="font-bold text-4xl md:!text-[80px]">
              {multiplier.toFixed(2)}x
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="block w-full  md:max-h-[720px] max-h-[250px] bg-transparent"
          />

          {!isRunning && crashPoint ? (
            <div className="absolute inset-0  flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
              <p className="text-red-400 text-2xl md:text-3xl font-bold mt-10">
                💥 Crashed at {crashPoint.toFixed(2)}x
              </p>
              {nextRoundTimer > 0 && (
                <p className="text-yellow-400 text-lg mt-2">
                  Next round in {nextRoundTimer}s…
                </p>
              )}
            </div>
          ) : !isRunning ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-300/80">Waiting for next round…</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Stats + Controls */}
      <div className="w-full flex justify-center px-3 md:px-6">
        <div className="w-full max-w-6xl mt-5 grid grid-cols-1 md:grid-cols-3 md:gap-4 space-y-4 md:space-y-0">
          <div className="col-span-2 rounded-2xl bg-transparent shadow-xs shadow-[#9C1137] p-4 md:p-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-2xl md:text-3xl font-extrabold text-green-400">
                {multiplier.toFixed(2)}x
              </div>
              <div className="text-xl md:text-2xl font-bold text-yellow-300">
                ${getPotentialWin()}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>{isConnected ? "Connected" : "Connecting…"}</span>
            </div>
          </div>

          <div className="col-span-1 rounded-2xl bg-transparent shadow-xs shadow-[#9C1137] backdrop-blur p-4 md:p-5">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value || 0))}
                className="w-28 p-2 rounded-xl bg-black/40 border border-white/10 text-center focus:outline-none focus:ring-2 focus:ring-red-400/40"
              />
              {!hasBet ? (
                <button
                  onClick={handlePlaceBet}
                  className="px-4 py-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                >
                  Place Bet
                </button>
              ) : !hasCashedOut ? (
                <button
                  onClick={handleCashOut}
                  disabled={!isRunning}
                  className="px-4 py-2 w-full rounded-xl bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 font-semibold shadow-[0_8px_20px_rgba(234,179,8,0.25)]"
                >
                  Cash Out
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 w-full rounded-xl bg-gray-600/60 border border-white/10 opacity-70"
                >
                  Bet Closed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showWinPopup && (
        <WinPopup
          winAmount={winAmount}
          multiplier={getCurrentMultiplier()}
          betAmount={betAmount}
          gameState={gameState}
          onClose={closePopup}
        />
      )}

      {/* History section */}
      <div className="w-full flex justify-center md:px-6">
        <div className="w-full max-w-6xl mt-5">
          <HistorySection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            liveBets={allBets}
            userBets={userBets}
          />
        </div>
      </div>
    </div>
  );
}
