import React, { useEffect, useState } from "react";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/v1/spinner`; // update with your backend URL

const AddSpinnerPrizes = () => {
  const [prizesDocs, setPrizesDocs] = useState([]);
  const [newPrizes, setNewPrizes] = useState("");
  const [singlePrize, setSinglePrize] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPrizes, setEditPrizes] = useState("");

  //   ✅ Fetch all prize documents
  const fetchPrizes = async () => {
    try {
      const res = await axios.get(`${API}/prizes`);
      setPrizesDocs(res.data);
      console.log(res.data[0]?.prizes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  // ✅ Add new prize document (full array)
  const handleAddPrizes = async () => {
    if (!newPrizes.trim()) return;
    const prizesArray = newPrizes.split(",").map((p) => p.trim());

    try {
      await axios.post(`${API}/prize`, { prizes: prizesArray });
      setNewPrizes("");
      fetchPrizes();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add single prize item
  const handleAddPrizeItem = async (id) => {
    if (!singlePrize.trim()) return;
    try {
      await axios.post(`${API}/prize/${id}/add`, { prize: singlePrize });
      setSinglePrize("");
      fetchPrizes();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Remove single prize item
  const handleRemovePrizeItem = async (id, prize) => {
    try {
      await axios.post(`${API}/prize/${id}/remove`, { prize });
      fetchPrizes();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete entire prize document
  const handleDeletePrize = async (id) => {
    try {
      await axios.delete(`${API}/prize/${id}`);
      fetchPrizes();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update entire prize array
  const handleUpdatePrizes = async (id) => {
    if (!editPrizes.trim()) return;
    const prizesArray = editPrizes.split(",").map((p) => p.trim());
    try {
      await axios.put(`${API}/prize/${id}`, { prizes: prizesArray });
      setEditId(null);
      setEditPrizes("");
      fetchPrizes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6  mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Spinner Prizes</h1>

      {prizesDocs.length < 1 ? (
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter prizes separated by commas"
            value={newPrizes}
            onChange={(e) => setNewPrizes(e.target.value)}
            className="border p-2 flex-1 rounded"
          />

          <button
            onClick={handleAddPrizes}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List all prizes */}
          {prizesDocs.map((doc) => (
            <div
              key={doc._id}
              className="border p-2 rounded shadow flex flex-col gap-2"
            >
              {/* <h2 className="font-semibold">Document ID: {doc._id.slice(-6)}</h2> */}

              <div className="flex flex-wrap gap-2">
                {doc.prizes.map((p, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 text-black px-3 py-1 rounded flex items-center gap-1"
                  >
                    {p}
                    <button
                      onClick={() => handleRemovePrizeItem(doc._id, p)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add single prize"
                  value={singlePrize}
                  onChange={(e) => setSinglePrize(e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={() => handleAddPrizeItem(doc._id)}
                  className="bg-green-600 text-white px-3 rounded"
                >
                  Add
                </button>
              </div>

              {editId === doc._id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Update prizes comma separated"
                    value={editPrizes}
                    onChange={(e) => setEditPrizes(e.target.value)}
                    className="border p-1 rounded flex-1"
                  />
                  <button
                    onClick={() => handleUpdatePrizes(doc._id)}
                    className="bg-yellow-600 text-white px-3 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-500 text-white px-3 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => setEditId(doc._id)}
                    className="bg-orange-500 text-white px-3 py-1 rounded mt-2 w-32"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeletePrize(doc._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded mt-2 w-32"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddSpinnerPrizes;
