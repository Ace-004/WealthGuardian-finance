import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import TransactionForm from "../components/transactions/TransactionForm";
import { FaSearch, FaFilter } from "react-icons/fa";
import { categories } from "../constants/categories";
import * as transactionService from "../services/transactionService";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

export default function Transactions() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: categories.find((cat) => cat.type === "expense")?.name || "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await transactionService.listTransactions();
      setTransactions(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Show loading state
      setIsLoading(true);

      // Make sure we have all required fields with proper formats
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString(),
      };

      const result = await transactionService.createTransaction(transaction);
      console.log("Transaction creation result:", result); // Debug log

      if (result.success) {
        // Update transactions list with new transaction
        setTransactions((prevTransactions) => [
          result.data.transaction,
          ...prevTransactions,
        ]);

        // Update budget status if expense was added
        if (formData.type === "expense") {
          // Emit a custom event that the budgets page will listen to
          window.dispatchEvent(
            new CustomEvent("budgetUpdate", {
              detail: result.data.budgetStatus,
            })
          );
        }

        toast.success("Transaction added successfully");
        setModalOpen(false);

        // Refresh the transactions list to ensure we have the latest data
        fetchTransactions();
      } else {
        // Show error message from the backend if available
        toast.error("Failed to create transaction");
      }
    } catch (error) {
      console.error("Transaction submission error:", error);
      toast.error(
        error.message || "Failed to create transaction. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const transaction = transactions.find((t) => t._id === id);
      const result = await transactionService.deleteTransaction(id);

      if (result.success) {
        setTransactions((prevTransactions) =>
          prevTransactions.filter((t) => t._id !== id)
        );

        // Update budget status if expense was deleted
        if (transaction && transaction.type === "expense") {
          window.dispatchEvent(
            new CustomEvent("budgetUpdate", {
              detail: result.budgetStatus,
            })
          );
        }

        toast.success("Transaction deleted successfully");
      } else {
        // Show the specific error message
        toast.error("Could not delete the transaction. Please try again.");
      }
    }
  };

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    searchTerm: "",
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      filters.type === "all" || transaction.type === filters.type;
    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;
    const matchesSearch =
      filters.searchTerm === "" ||
      transaction.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      transaction.category
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <Loader />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Transactions
              </h1>
              <p className="text-slate-400 text-lg">
                Track all your income and expenses
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              + Add Transaction
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters({ ...filters, searchTerm: e.target.value })
                  }
                />
              </div>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            transaction.type === "income"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Transaction Modal */}
      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
