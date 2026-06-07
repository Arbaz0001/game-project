import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = `${import.meta.env.VITE_API_URL}/my-channels`;

const TelegramApproval = ({ isOpen, onClose, transaction }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // ---- Fetch available Telegram channels ----
  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      console.log("Full response:", res.data);

      // handle both { channels:[...] } or { data:{ channels:[...] } }
      const list =
        res.data.channels || (res.data.data && res.data.data.channels) || [];
      setChannels(list);
      setFetchedOnce(true);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch channels. Check console for details.");
    } finally {
      // always turn loader off
      setLoading(false);
    }
  };

  // Fetch only when the modal opens, and only once per page load
  useEffect(() => {
    if (isOpen && !fetchedOnce) {
      fetchChannels();
    }
  }, [isOpen, fetchedOnce]);

  // ---- Update transaction status ----
  const updateWithdrawalStatus = async (status) => {
    if (!transaction?._id) {
      toast.error("Transaction data missing.");
      return;
    }
    if (!newChannel) {
      toast.error("Please select a channel before continuing.");
      return;
    }

    const channelId = parseInt(newChannel, 10);
    if (isNaN(channelId)) {
      toast.error("Invalid channel ID.");
      return;
    }

    try {
      console.log("Using API URL:", import.meta.env.VITE_API_URL);
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/wallet/telegram/update-deposite-transaction-status`,
        {
          status,
          id: transaction._id,
          userId: transaction.userId,
          amount: transaction.amount,
          channelId,
        }
      );

      console.log("Update response:", response.data);
      toast.success(response.data.message || "Status updated successfully.");
      onClose(); // close the dialog after successful update
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.message || error.message || "Update failed."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded p-6 w-full max-w-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
        >
          ×
        </button>

        <h1 className="text-2xl font-bold mb-4">Telegram Channels</h1>

        {loading && <p className="mb-4">Loading channels…</p>}

        {!loading && channels.length > 0 ? (
          <div className="mb-6">
            <label htmlFor="channelSelect" className="block mb-2 font-medium">
              Select a Channel:
            </label>
            <select
              id="channelSelect"
              className="w-full p-2 border rounded"
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
            >
              <option value="">-- Select a channel --</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          !loading && <p>No channels found.</p>
        )}

        <div className="flex mt-2 space-x-4">
          <button
            onClick={() => updateWithdrawalStatus("approved")}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => updateWithdrawalStatus("rejected")}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramApproval;
