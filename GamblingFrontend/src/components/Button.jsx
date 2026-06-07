// src/components/ui/Button.jsx
import React from "react";

const Button = ({ children, onClick, className = "", disabled = false, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-[10px] rounded-md font-semibold transition duration-200 cursor-pointer text-sm
        ${disabled ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-[#2f4553] hover:bg-[#2f4960] text-gray-200"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
