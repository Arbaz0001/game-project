import React, { useEffect, useState } from "react";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/v1/telegram-amount`;

const AddTelegramAmount = () => {
  const [newAmount, setNewAmount] = useState("");
  const [loading, setLoading] = useState(false);
  // Fetch all telegram amounts
  const [amounts, setAmounts] = useState([]);

  const fetchAmounts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      // Adjust based on API response shape
      setAmounts(res.data.data || res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmounts();
  }, []);

  // Add new telegram amount
  const handleAddAmount = async () => {
    if (!newAmount.trim()) return;
    try {
      const res = await axios.post(API, { amount: newAmount });
      const added = res.data.data || res.data; // adjust shape if needed
      setAmounts((prev) => [...prev, added]);
      setNewAmount("");
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // Delete telegram amount
  const handleDeleteAmount = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setAmounts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Telegram Amount</h1>

      {/* Add New Amount */}
      {amounts.length < 1 ? (
        <div className="flex flex-wrap gap-2 mb-6">
          <input
            type="number"
            placeholder="Enter telegram amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="border text-white p-2 flex-1 rounded bg-gray-900"
          />
          <button
            onClick={handleAddAmount}
            className="bg-blue-600 w-full text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      ) : (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : amounts.length < 1 ? (
            <p>No telegram amounts yet.</p>
          ) : (
            <div className="space-y-4">
              {amounts.map((item) => (
                <div
                  key={item._id}
                  className="border w-52 p-4 rounded shadow flex justify-between items-center bg-gray-800"
                >
                  <span className="text-white font-medium text-lg">
                    {item.amount}
                  </span>
                  <button
                    onClick={() => handleDeleteAmount(item._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddTelegramAmount;
