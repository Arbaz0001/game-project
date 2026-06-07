import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ReferEarn = ({ isOpen, onClose }) => {
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user")) || {};

  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users/referral-link/${
          userId._id
        }`
      );
      setReferralLink(res.data.referralLink);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleGenerateLink();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br mx-3 from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl w-[600px] p-8 animate-fadeIn">
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          🎉 Refer & Earn
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Share your unique link and earn rewards when friends join!
        </p>

        {/* Referral Box */}
        <div className="bg-gray-100 border  border-gray-200 rounded-xl p-4 flex items-center justify-between mb-6">
          <input
            type="text"
            readOnly
            value={loading ? "Generating link..." : referralLink}
            className="flex-1 bg-transparent text-gray-800 text-sm outline-none"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              toast("Copied to clipboard!");
            }}
            disabled={!referralLink}
            className="ml-3 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50"
          >
            Copy
          </button>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() =>
              window.open("https://wa.me/?text=" + referralLink, "_blank")
            }
            disabled={!referralLink}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 transition-transform disabled:opacity-50"
          >
            📩 Share via WhatsApp
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
