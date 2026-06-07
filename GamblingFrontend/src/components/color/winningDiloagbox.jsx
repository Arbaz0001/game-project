import React, { useEffect } from "react";

export default function WinDialog({ open, amount, onClose }) {
  // ✅ Auto–close after 4 seconds
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 animate-fadeIn">
      <div className="bg-[#111] text-white p-6 rounded-2xl text-center w-72 shadow-[0_0_25px_rgba(255,215,0,0.6)] animate-popUp">
        {/* 👑 Crown GIF */}
        
        <h2 className="text-2xl font-bold mb-2">🎉 You Win! 🎉</h2>
        <p className="text-xl font-semibold mb-4">₹{amount}</p>
        <button
          onClick={onClose}
          className="bg-yellow-400 text-black font-bold py-2 px-5 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
