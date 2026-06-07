import { useEffect, useState } from 'react';
import axios from 'axios';

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
            const accessToken = localStorage.getItem("accessToken")
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/wallet/history`, {
                headers: {
                    Authorization: accessToken, // Make sure the token is valid
                },
                params: {
                    page: 1, // or dynamic
                },
            });
            const { transactions, totalPages } = response.data.data;

            setTransactions(transactions);
            setTotalPages(totalPages);
            setPage(pageNumber);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch transaction history.');
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
        <div className="max-w-3xl mx-auto py-2 text-gray-300 bg-[#160003] min-h-screen min-w-full items-center flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-amber-200">Transaction History</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && transactions.length === 0 && <p>No transactions found.</p>}

            {!loading && transactions.length > 0 && (
                <table className="min-w-full rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-[#451118] text-[#9f3e3e] text-left text-sm font-semibold">
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Change</th>
                            <th className="px-4 py-3">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr
                                key={tx.id}
                                className="cursor-pointer transition-colors duration-200"
                            >
                                <td className="px-4 py-3">{tx.type}</td>
                                <td className="px-4 py-3">{tx.method}</td>
                                <td
                                    className={`px-4 py-3 ${tx.status === "approved" ? "text-green-500" : "text-gray-400"
                                        }`}
                                >
                                    ₹{tx.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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
                <span>Page {page} of {totalPages}</span>
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