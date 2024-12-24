import React, { useState, useEffect, useContext } from "react";
import {
  PlusCircle,
  Trash2,
  DollarSign,
  CreditCard,
  TrendingUp,
  LogOut,
} from "lucide-react";

import { AuthContext } from "./context/AuthContext";

import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "./config/api";

const ExpenseTracker = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(ENDPOINTS.TRANSACTIONS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setTransactions(data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch transactions");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text || !amount) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.TRANSACTIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          text,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      setTransactions([data.data, ...transactions]);
      setText("");
      setAmount("");
      setError("");
    } catch (err) {
      setError("Failed to add transaction");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`${ENDPOINTS.TRANSACTIONS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTransactions(
        transactions.filter((transaction) => transaction._id !== id)
      );
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  const totalAmount = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header with User Profile */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Transactions</p>
              <p className="text-xl font-bold text-white">
                {transactions.length}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-2xl font-bold text-white">
                ${totalAmount?.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Income</p>
              <p className="text-2xl font-bold text-green-400">
                ${income?.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Expenses</p>
              <p className="text-2xl font-bold text-red-400">
                ${Math.abs(expenses || 0).toFixed(2)}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-1 block w-full h-12 px-2 py-2 rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full h-12 px-2 py-2 rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter amount..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Add Transaction
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 text-red-300 border border-red-800 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-400">
                Loading transactions...
              </p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-gray-400">No transactions found</p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">{transaction.text}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-semibold ${
                        transaction.amount > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(transaction._id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
