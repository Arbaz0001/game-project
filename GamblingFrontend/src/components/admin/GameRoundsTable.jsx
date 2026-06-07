import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GameRoundsTable = () => {
  const [rounds, setRounds] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedRound, setEditedRound] = useState({});

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    gameType: "chicken",
    period: "",
    multipliers: "1.02,1.1,1.25,1.5,2,0",
    startTime: "",
    endTime: "",
    channelId: newChannel,
  });
  console.log("forom Data", formData);

  console.log(" ===== id: ", newChannel);

  console.log(formData);

  const gameOptions = ["chicken", "aviator", "color", "mining"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchRounds = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/game-rounds`
      );
      setRounds(res.data.data || []);
    } catch (err) {
      console.error("Error fetching rounds:", err);
      toast.error("❌ Failed to fetch game rounds");
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-channels`
      );
      console.log("res", res.data.channels);
      setChannels(res.data.channels || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchChannels();
    }
  }, [showModal]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedRound({ ...rounds[index] });
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedRound({});
  };

  const handleInputChange = (field, value) => {
    setEditedRound((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/update-round/${
          editedRound._id
        }`,
        editedRound
      );
      setEditIndex(null);
      fetchRounds();
      toast.success("✅ Round updated successfully");
    } catch (err) {
      console.error("Error saving round:", err);
      toast.error("❌ Failed to update round");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this round?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/delete-round/${id}`
      );
      fetchRounds();
      toast.success("🗑️ Round deleted successfully");
    } catch (err) {
      console.error("Error deleting round:", err);
      toast.error("❌ Failed to delete round");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      channelId: newChannel,
      multipliers: formData.multipliers.split(",").map(Number),
    };

    console.log("payload", payload);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/telegram/round`,
        payload
      );
      console.log(res.data);
      setShowModal(false);
      fetchRounds();

      setFormData({
        gameType: "chicken",
        period: "",
        multipliers: "",
        startTime: "",
        endTime: "",
        channelId: 0,
      });
    } catch (err) {
      console.log("Failed to add game round", err);
    }
  };

  return (
    <div className=" md:p-6 text-white">
      {/* Header */}

      <div className="flex flex-col pl-5 sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-bold">🎮 Game Rounds</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm sm:text-base"
        >
          ➕ Add New Game Round
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto max-w-screen  ">
        <table className="min-w-full  mx-5  text-sm sm:text-base bg-gray-800 rounded-lg text-white border border-gray-700">
          <thead className="bg-gray-700 text-left">
            <tr>
              <th className="p-2">Game Type</th>
              <th className="p-2">Multipliers</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">End Time</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rounds.map((round, index) => (
              <tr key={round._id} className="border-t border-gray-600">
                <td className="p-2">
                  {editIndex === index ? (
                    <select
                      value={editedRound.gameType}
                      onChange={(e) =>
                        handleInputChange("gameType", e.target.value)
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    >
                      {gameOptions.map((game) => (
                        <option key={game} value={game}>
                          {game.charAt(0).toUpperCase() + game.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    round.gameType
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      value={editedRound.multipliers.join(",")}
                      onChange={(e) =>
                        handleInputChange(
                          "multipliers",
                          e.target.value.split(",").map(Number)
                        )
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    round.multipliers.join(", ")
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="datetime-local"
                      value={new Date(editedRound.startTime)
                        .toLocaleString("sv-SE", {
                          timeZone: "Asia/Kolkata",
                        })
                        .replace(" ", "T")}
                      onChange={(e) =>
                        handleInputChange(
                          "startTime",
                          new Date(e.target.value).toISOString()
                        )
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    new Date(round.startTime).toLocaleString()
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="datetime-local"
                      value={new Date(editedRound.endTime)
                        .toLocaleString("sv-SE", {
                          timeZone: "Asia/Kolkata",
                        })
                        .replace(" ", "T")}
                      onChange={(e) =>
                        handleInputChange(
                          "endTime",
                          new Date(e.target.value).toISOString()
                        )
                      }
                      className="bg-gray-900 p-1 rounded w-full"
                    />
                  ) : (
                    new Date(round.endTime).toLocaleString()
                  )}
                </td>
                <td className="p-2">{round.status}</td>
                <td className="p-2 text-center">
                  {editIndex === index ? (
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(round._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rounds.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No game rounds found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 w-full max-w-md p-6 rounded-lg space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Add Game Round</h3>
            <label htmlFor="channelSelect" className="block mb-2 font-medium">
              Game Type:
            </label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            >
              {gameOptions.map((game) => (
                <option key={game} value={game}>
                  {game.charAt(0) + game.slice(1)}
                </option>
              ))}
            </select>

            {formData.gameType === "color" ? (
              <div>
                <label htmlFor="multipliers" className="block mb-2 font-medium">
                  Period
                </label>
                <input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded text-white"
                  placeholder="Period"
                  required
                />
              </div>
            ) : (
              ""
            )}

            <label htmlFor="multipliers" className="block mb-2 font-medium">
              Multipliers (comma separated):
            </label>
            <input
              type="text"
              name="multipliers"
              value={formData.multipliers}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              placeholder="Multipliers (comma separated)"
              required
            />

            <label htmlFor="startTime" className="block mb-2 font-medium">
              Start Time:
            </label>

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            />

            {channels.length > 0 ? (
              <div className="mb-6">
                <label
                  htmlFor="channelSelect"
                  className="block mb-2 font-medium"
                >
                  Select a Channel:
                </label>
                <select
                  required
                  id="channelSelect"
                  className=" w-full p-2 bg-gray-700 rounded text-white "
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
              <p>No channels found.</p>
            )}

            <label htmlFor="endTime" className="block mb-2 font-medium">
              End Time:
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GameRoundsTable;
