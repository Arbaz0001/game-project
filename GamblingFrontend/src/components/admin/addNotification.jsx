import React, { useState } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/v1/notification/add`;

const AdminForm = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Message saved successfully!");
        setMessage("");
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-2xl text-white font-bold mb-4 text-center mt-6">
        Refer Amounts
      </h1>
      <div className=" mx-4  p-6  bg-slate-700 text-white rounded-xl shadow-md">
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full !text-white border rounded-lg p-3 mb-4"
            rows="4"
            placeholder="Enter notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Save Message
          </button>
        </form>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </section>
  );
};

export default AdminForm;
