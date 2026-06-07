import { useState } from 'react';
import axios from 'axios';

const WithdrawalFormINR = () => {
  const [formData, setFormData] = useState({
    amount: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    accountNumber: '',
    ifsc: '',
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
        method: "UPI",
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
        placeholder="Payout amount (INR)"
        className="input"
        value={formData.amount}
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

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        className="input"
        value={formData.phone}
        onChange={handleChange}
      />

      <div className="flex space-x-4">
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          className="input flex-1"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          className="input flex-1"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <input
        type="text"
        name="accountNumber"
        placeholder="Bank account number"
        className="input"
        value={formData.accountNumber}
        onChange={handleChange}
      />

      <input
        type="text"
        name="ifsc"
        placeholder="IFSC Code"
        className="input"
        value={formData.ifsc}
        onChange={handleChange}
      />

      <button type="submit" className="w-full cursor-pointer bg-gradient-to-b shadow-xs shadow-[#9C1137] from-[#9C1137] via-[#9C1137] to-black text-white py-2 rounded">
        Submit Withdrawal
      </button>
    </form>
  );
};

export default WithdrawalFormINR;
