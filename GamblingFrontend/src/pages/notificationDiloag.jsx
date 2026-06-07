import React, { useEffect, useState } from "react";

const AboutDialog = () => {
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // ✅ Step 1: Check localStorage
    const lastClosed = localStorage.getItem("aboutDialogClosedAt");
    if (lastClosed) {
      const closedTime = new Date(parseInt(lastClosed, 10));
      const oneHourLater = new Date(closedTime.getTime() + 60 * 60 * 1000);

      if (new Date() < oneHourLater) {
        setOpen(false);
        return; // mat dikhao
      }
    }

    // ✅ Step 2: Fetch from API
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/notification/get`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.message) setMessage(data.message);
        else setOpen(false);
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
    // ✅ Step 3: Save close timestamp in localStorage
    localStorage.setItem("aboutDialogClosedAt", Date.now().toString());
  };

  if (!message || !open) return null;

  return (
    <div className="fixed inset-0 flex !z-30 items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">📢 Notification</h2>
        <p className="mb-4">{message}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutDialog;
