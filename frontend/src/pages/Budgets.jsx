import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import BudgetForm from "../components/budgets/BudgetForm";
import BudgetList from "../components/budgets/BudgetList";
import * as budgetService from "../services/budgetService";
import { analyticsService } from "../services/analyticsService";
import { formatCurrency } from "../utils/formatCurrency";
import {
  FaShoppingBag,
  FaCar,
  FaUtensils,
  FaHome,
  FaPlus,
  FaChartPie,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";

const BudgetCard = ({ category, spent, limit, icon: Icon, color }) => {
  const percentage = (spent / limit) * 100;
  const status =
    percentage >= 100 ? "over" : percentage >= 80 ? "warning" : "good";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{category}</h3>
          <p className="text-sm text-gray-500">Monthly Budget</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Spent: ${spent}</span>
          <span className="text-gray-500">Limit: ${limit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              status === "over"
                ? "bg-red-500"
                : status === "warning"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <p
        className={`text-sm ${
          status === "over"
            ? "text-red-500"
            : status === "warning"
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        {status === "over"
          ? "Over budget!"
          : status === "warning"
          ? "Close to limit!"
          : "On track"}
      </p>
    </div>
  );
};

export default function Budgets() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [unbudgetedExpenses, setUnbudgetedExpenses] = useState([]);

  useEffect(() => {
    fetchBudgets();
    // Set up an interval to refresh data every 5 minutes
    const interval = setInterval(fetchBudgets, 5 * 60 * 1000);

    // Listen for budget updates from transaction changes
    const handleBudgetUpdate = (event) => {
      const updatedBudgets = event.detail;
      if (updatedBudgets) {
        fetchBudgets();
      }
    };

    window.addEventListener("budgetUpdate", handleBudgetUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("budgetUpdate", handleBudgetUpdate);
    };
  }, []);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const [budgetData, monthlySpending, categoryExpenses] = await Promise.all(
        [
          budgetService.getBudgets(),
          budgetService.getMonthlySpending(),
          analyticsService.getCategoryExpenses("month"),
        ]
      );

      // Create a map of budgeted categories
      const budgetedCategories = new Set(budgetData.map((b) => b.category));

      // Create maps for spending
      const spendingMap = {};
      const unbudgetedExpenses = [];

      // Categorize expenses
      categoryExpenses.forEach((expense) => {
        spendingMap[expense.name] = expense.value;
        if (!budgetedCategories.has(expense.name)) {
          unbudgetedExpenses.push({
            category: expense.name,
            spent: expense.value,
          });
        }
      });

      // Combine budget data with actual spending
      const budgetStatus = budgetData.map((budget) => ({
        ...budget,
        spent: spendingMap[budget.category] || 0,
      }));

      setBudgets(budgetData);
      setBudgetStatus(budgetStatus);
      setUnbudgetedExpenses(unbudgetedExpenses);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);

      // Validate input
      if (!formData.category || !formData.monthlyLimit) {
        toast.error("Please fill in all fields");
        return;
      }

      const monthlyLimit = parseFloat(formData.monthlyLimit);
      if (isNaN(monthlyLimit) || monthlyLimit <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      // Create budget
      await budgetService.createBudget({
        category: formData.category,
        monthlyLimit: monthlyLimit,
      });

      // Success handling
      toast.success("Budget created successfully");
      setModalOpen(false);
      await fetchBudgets(); // Refresh budgets list
    } catch (error) {
      console.error("Error creating budget:", error);
      const errorMessage = error.message || "Failed to create budget";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryIcons = {
    Food: { icon: FaUtensils, color: "bg-blue-500" },
    Transport: { icon: FaCar, color: "bg-green-500" },
    Shopping: { icon: FaShoppingBag, color: "bg-purple-500" },
    Housing: { icon: FaHome, color: "bg-orange-500" },
    Entertainment: { icon: FaHome, color: "bg-pink-500" },
    Bills: { icon: FaHome, color: "bg-yellow-500" },
    Other: { icon: FaHome, color: "bg-gray-500" },
  };

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

  const unbudgetedTotal = unbudgetedExpenses.reduce(
    (sum, exp) => sum + exp.spent,
    0
  );

  const totals = budgetStatus.reduce(
    (acc, curr) => {
      const spent = curr.spent || 0;
      return {
        totalBudgets: acc.totalBudgets + curr.monthlyLimit,
        totalSpent: acc.totalSpent + spent,
        totalRemaining: acc.totalRemaining + (curr.monthlyLimit - spent),
        overspentCategories:
          acc.overspentCategories + (spent > curr.monthlyLimit ? 1 : 0),
        nearLimitCategories:
          acc.nearLimitCategories +
          (spent > curr.monthlyLimit * 0.8 && spent <= curr.monthlyLimit
            ? 1
            : 0),
      };
    },
    {
      totalBudgets: 0,
      totalSpent: 0,
      totalRemaining: 0,
      overspentCategories: 0,
      nearLimitCategories: 0,
    }
  );

  // ✅ Add unbudgeted total after reduction
  totals.totalSpent += unbudgetedTotal;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Budget Management
                </h1>
                <p className="text-slate-400 text-lg">
                  Track and optimize your monthly spending
                </p>
              </div>
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
              >
                <FaPlus className="text-white/90" /> Create Budget
              </Button>
            </div>

            {/* Budget Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FaChartPie className="mr-2 text-emerald-400" />
                Monthly Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-700/50 rounded-xl border border-white/5 hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center mb-2">
                    <FaWallet className="text-emerald-400 text-xl mr-2" />
                    <p className="text-sm text-slate-300">Total Budgets</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(totals.totalBudgets)}
                  </p>
                  <div className="mt-2 text-xs text-emerald-400">
                    Budget Allocation
                  </div>
                </div>
                <div className="p-6 bg-slate-700/50 rounded-xl border border-white/5 hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-rose-400 text-xl mr-2" />
                    <p className="text-sm text-slate-300">Total Spent</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(totals.totalSpent)}
                  </p>
                  <div className="mt-2 text-xs text-rose-400">
                    Budgeted Expenses
                  </div>
                </div>
                <div className="p-6 bg-slate-700/50 rounded-xl border border-white/5 hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-purple-400 text-xl mr-2" />
                    <p className="text-sm text-slate-300">Unbudgeted</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(
                      unbudgetedExpenses.reduce(
                        (sum, exp) => sum + exp.spent,
                        0
                      )
                    )}
                  </p>
                  <div className="mt-2 text-xs text-purple-400">
                    Expenses without Budget
                  </div>
                </div>
                <div className="p-6 bg-slate-700/50 rounded-xl border border-white/5 hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center mb-2">
                    <FaWallet className="text-amber-400 text-xl mr-2" />
                    <p className="text-sm text-slate-300">Remaining</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(totals.totalRemaining)}
                  </p>
                  <div className="mt-2 text-xs text-amber-400">
                    Available in Budget
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Alerts */}
            {(totals.overspentCategories > 0 ||
              totals.nearLimitCategories > 0) && (
              <div className="mb-8">
                {totals.overspentCategories > 0 && (
                  <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center text-rose-400">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="font-semibold">
                        {totals.overspentCategories}{" "}
                        {totals.overspentCategories === 1
                          ? "category has"
                          : "categories have"}{" "}
                        exceeded their budget
                      </span>
                    </div>
                  </div>
                )}

                {totals.nearLimitCategories > 0 && (
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center text-amber-400">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-semibold">
                        {totals.nearLimitCategories}{" "}
                        {totals.nearLimitCategories === 1
                          ? "category is"
                          : "categories are"}{" "}
                        near their budget limit
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Budgeted Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FaChartPie className="mr-2 text-emerald-400" />
                Budgeted Categories
              </h2>
              {budgetStatus.length > 0 ? (
                <BudgetList
                  budgets={budgetStatus}
                  spentAmounts={budgetStatus.reduce(
                    (acc, curr) => ({
                      ...acc,
                      [curr.category]: curr.spent,
                    }),
                    {}
                  )}
                  onEdit={(budget) => {
                    setSelectedBudget(budget);
                    setModalOpen(true);
                  }}
                  onDelete={async (budgetId) => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this budget?"
                      )
                    ) {
                      try {
                        await budgetService.deleteBudget(budgetId);
                        toast.success("Budget deleted successfully");
                        fetchBudgets();
                      } catch (error) {
                        console.error("Error deleting budget:", error);
                        toast.error("Failed to delete budget");
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center py-8 text-slate-400">
                  No budgets found. Click "Create Budget" to add one.
                </div>
              )}
            </div>

            {/* Unbudgeted Expenses */}
            {unbudgetedExpenses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-rose-400" />
                  Unbudgeted Expenses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unbudgetedExpenses.map((expense) => (
                    <div
                      key={expense.category}
                      className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {expense.category}
                          </h3>
                          <p className="text-sm text-slate-400">
                            No budget set
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setModalOpen(true);
                            setSelectedBudget({ category: expense.category });
                          }}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Set Budget
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Total Spent</span>
                          <span className="text-xl font-semibold text-rose-400">
                            {formatCurrency(expense.spent)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Budget Modal */}
      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Budget"
      >
        <BudgetForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
