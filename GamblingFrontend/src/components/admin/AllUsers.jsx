import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Save, Trash } from "lucide-react"; // For edit/save/trash icons
import GameBets from "./GameBets";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUser, setShowUser] = useState(true);
  const [userId, setUserId] = useState("");
  const [showUserGameHistory, setShowUserGameHistory] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [editUserId, setEditUserId] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Fetch all users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users/`
      );
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle start editing user
  const handleEditUser = (user) => {
    setEditUserId(user._id);
    setUpdatedUser({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
    });
  };

  // Handle save edited user
  const handleSaveUser = async () => {
    try {
      const userData = { ...updatedUser };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/users/${editUserId}`,
        userData
      );
      setEditUserId(null); // Exit edit mode
      fetchUsers(); // Refresh the list after saving
    } catch (err) {
      console.error("Failed to save user", err);
    }
  };

  // Handle input change for edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(users.length / pagination.pageSize)
    ) {
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const handleonClick = (user) => {
    setUserId(user._id);
    setShowUser(false);
    setShowUserGameHistory(true);
  };

  useEffect(() => {
    fetchUsers(); // Fetch all users once when the component mounts
  }, []);

  // Calculate the users to be displayed on the current page
  const getPaginatedUsers = () => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return users.slice(startIndex, endIndex);
  };

  const paginatedUsers = getPaginatedUsers();

  if (loading)
    return <div className="text-center text-xl mt-10">Loading users...</div>;
  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div>
      {showUser && (
        <div>
          <div className="mx-auto p-4 text-white max-w-screen overflow-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>
            {users.length === 0 ? (
              <p className="text-center text-gray-500">No users found.</p>
            ) : (
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-black">
                    <th className="border border-gray-300 p-2 text-left">
                      History
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Name
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Email
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Phone
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Password
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Created At
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      <td
                        className="border border-gray-300 p-2"
                        onClick={() => handleonClick(user)}
                      >
                        View
                      </td>
                      <td className="border border-gray-300 p-2">
                        {editUserId === user._id ? (
                          <input
                            type="text"
                            name="fullName"
                            value={updatedUser.fullName}
                            onChange={handleInputChange}
                            className="border p-1 rounded"
                          />
                        ) : (
                          user.fullName || "N/A"
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {editUserId === user._id ? (
                          <input
                            type="email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleInputChange}
                            className="border p-1 rounded"
                          />
                        ) : (
                          user.email || "N/A"
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {editUserId === user._id ? (
                          <input
                            type="text"
                            name="phoneNumber"
                            value={updatedUser.phoneNumber}
                            onChange={handleInputChange}
                            className="border p-1 rounded"
                          />
                        ) : (
                          user.phoneNumber
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {editUserId === user._id ? (
                          <input
                            type="text"
                            name="password"
                            placeholder="Enter new password"
                            value={updatedUser.password}
                            onChange={handleInputChange}
                            className="border p-1 rounded"
                          />
                        ) : (
                          <span>{user?.password}</span>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 text-center p-2">
                        {editUserId === user._id ? (
                          <button
                            className="text-green-500"
                            onClick={handleSaveUser}
                          >
                            <Save />
                          </button>
                        ) : (
                          <>
                            <button
                              className="text-yellow-500"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex justify-center space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="my-auto text-white">
              Page {pagination.page} of{" "}
              {Math.ceil(users.length / pagination.pageSize)}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= users.length}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showUserGameHistory && <GameBets userId={userId} />}
    </div>
  );
};

export default AllUsers;
