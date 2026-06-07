import { useEffect, useState } from "react";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/wallet/history/users`,
        {
          params: {
            page: 1, // or dynamic
          },
        }
      );
      console.log(response);
      const { transactions, totalPages } = response.data.data;

      setTransactions(transactions);
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transaction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchTransactions(newPage);
    }
  };

  return (
    <div className="max-w mx-auto p-4 text-gray-300 min-h-screen min-w-full items-center flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && transactions.length === 0 && <p>No transactions found.</p>}

      {!loading && transactions.length > 0 && (
        <div className="space-y-4 md:min-w-md  sm:w-96">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="p-3 flex  flex-col gap-2 rounded bg-transparent shadow shadow-gray-200"
            >
              <span className="flex justify-between">
                <p>
                  {new Date(tx.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p
                  className={`${
                    tx.status === "approved"
                      ? "text-green-400"
                      : "text-gray-200"
                  }`}
                >
                  {tx.status}
                </p>
              </span>
              <span className="flex justify-between font-bold">
                <p>{tx.type}</p>
                <p>₹{tx.amount}</p>
              </span>
              <p>{tx.method}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-600 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
