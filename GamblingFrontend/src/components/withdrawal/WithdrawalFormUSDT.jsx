import { useState } from 'react';
import axios from 'axios';

const WithdrawalFormUSDT = () => {
  const [formData, setFormData] = useState({
    amount: '',
    network: 'TRC20',
    walletAddress: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const user = JSON.parse(localStorage.getItem("user"))
  const accessToken = localStorage.getItem("accessToken");
  const userId = user._id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace this with your actual API endpoint
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/wallet/withraw`, {
        userId,
        amount: formData.amount,
        method: "USDT",
        details: formData,
        remarks: "Payment request for INR"
      }, {
        headers: {
          Authorization: accessToken, // Make sure the token is valid
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      // Optionally show error feedback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="amount"
        placeholder="Payout amount (USDT)"
        className="input outline-none"
        value={formData.amount}
        onChange={handleChange}
      />

      <select
        name="network"
        className="input"
        value={formData.network}
        onChange={handleChange}
      >
        <option value="TRC20">TRC20</option>
        <option value="ERC20">ERC20</option>
      </select>

      <input
        type="text"
        name="walletAddress"
        placeholder="USDT Wallet Address"
        className="input"
        value={formData.walletAddress}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input"
        value={formData.email}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full cursor-pointer bg-gradient-to-b shadow-xs shadow-[#9C1137] from-[#9C1137] via-[#9C1137] to-black text-white py-2 rounded"
      >
        Submit Withdrawal
      </button>
    </form>
  );
};

export default WithdrawalFormUSDT;