import { useState } from "react";
import WithdrawalTabs from "./WithdrawalTabs";
import WithdrawalFormINR from "./WithdrawalFormINR";
import WithdrawalFormUSDT from "./WithdrawalFormUSDT";
import WithdrawalFormETH from "./WithdrawalFormETH";

const WithdrawalContainer = () => {
  const [selectedMethod, setSelectedMethod] = useState("INR");

  return (
    <div className="p-6 bg-[#160003] text-white min-h-screen flex flex-col items-center">
      <WithdrawalTabs selected={selectedMethod} onSelect={setSelectedMethod} />
      <div className="mt-6">
        {selectedMethod === "INR" && <WithdrawalFormINR />}
        {selectedMethod === "USDT" && <WithdrawalFormUSDT />}
        {selectedMethod === "ETH" && <WithdrawalFormETH />}
    <p className="my-4 text-center text-gray-400 text-sm underline">Or widthraw with</p>
      <button className="w-full cursor-pointer bg-gradient-to-b shadow-xs shadow-[#9C1137] from-[#9C1137] via-[#9C1137] to-black text-white py-2 rounded">
        Withdrawal
      </button>
      </div>
    </div>
  );
};

export default WithdrawalContainer;
