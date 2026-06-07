import React from "react";

export const HelpAndSupport = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl w-[600px] p-8 animate-fadeIn">
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          🎉 Help And Support
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We're here to help you! Reach out to us through the options below:
        </p>

        {/* Support Buttons */}
        <div className="flex flex-col items-center gap-4">
          {/* Email */}
          {/* <button
            onClick={() => window.open("mailto:support@example.com", "_blank")}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            📧 Contact via Email
          </button> */}

          {/* WhatsApp */}
          <button
            onClick={() => window.open("https://wa.me/1234567890", "_blank")}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            💬 Chat on WhatsApp
          </button>

          {/* Telegram */}
          <button
            onClick={() =>
              window.open("https://t.me/YourTelegramUsername", "_blank")
            }
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            📲 Connect on Telegram
          </button>
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
