import axios from "axios";
import { ListCollapse } from "lucide-react";
import React, { useState, useEffect } from "react";
import TelegramApproval from "./TelegramAproval";

const Deposite = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState("telegram"); // Filter state for 'upi' or 'crypto'
  const [isTelegramAOpen, setIsTelegramAOpen] = useState(false);
  // Fetch transaction history from API
  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/wallet/history/deposit`
      );
      const data = await response.json();
      setTransactions(data.data.deposit); // Adjust according to the response structure
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  const updateWithdrawalStatus = async (
    transactionId,
    status,
    userId,
    amount
  ) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/wallet/telegram/update-deposite-transaction-status`,
        {
          status,
          id: transactionId,
          userId,
          amount,
        }
      );

      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === transactionId
              ? { ...transaction, status }
              : transaction
          )
        );
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleDetails = (index) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction, i) =>
        i === index
          ? { ...transaction, showDetails: !transaction.showDetails }
          : transaction
      )
    );
  };

  // Filter transactions by selected method if any
  const filteredTransactions = filterMethod
    ? transactions.filter(
        (transaction) =>
          transaction.method.toLowerCase() === filterMethod.toLowerCase()
      )
    : transactions;

  // Handler for toggling filter buttons
  const handleFilterClick = (method) => {
    setFilterMethod((prev) => (prev === method ? "" : method)); // toggle filter on/off
  };

  return (
    <div className="md:min-w-l w-auto mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">
        Telegram Subscriptions
      </h2>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No transactions found.
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex md:flex-row flex-col justify-between gap-4 items-center">
                  <div className="flex justify-between items-center gap-8">
                    <span className="font-semibold text-lg">
                      Amount: {transaction.amount}
                    </span>
                    <span className="text-gray-500">
                      {transaction.details.gameName}
                    </span>
                    <p>{transaction.status}</p>
                  </div>
                  <div className="flex gap-4 justify-between items-center text-center flex-row-reverse">
                    <button
                      onClick={() => toggleDetails(index)}
                      className="text-blue-500 hover:underline"
                    >
                      <ListCollapse />
                    </button>

                    {/* Approve and Reject buttons */}
                    {transaction.status === "pending" && (
                      <div className="flex mt-2 space-x-4">
                        <TelegramApproval
                          transaction={transaction}
                          isOpen={isTelegramAOpen}
                          onClose={() => setIsTelegramAOpen(false)}
                        />

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsTelegramAOpen(true);
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          {/* <button
                         
                          onClick={() =>
                            updateWithdrawalStatus(
                              transaction._id,
                              "approved",
                              transaction.userId,
                              transaction.amount
                            )
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >  */}
                          Approve
                        </button>
                        {/* <button
                          onClick={() =>
                            updateWithdrawalStatus(
                              transaction._id,
                              "rejected",
                              transaction.userId,
                              transaction.amount
                            )
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {transaction.showDetails && (
                <div className="p-4 bg-gray-50">
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Details</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {Object.entries(transaction.details).map(
                        ([key, value]) => (
                          <li key={key}>
                            <strong className="capitalize">{key}:</strong>{" "}
                            {value}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Deposite;
