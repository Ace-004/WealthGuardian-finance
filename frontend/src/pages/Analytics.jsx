import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import TrendLineChart from "../components/charts/TrendLineChart";
import { analyticsService } from "../services/analyticsService";
import Loader from "../components/common/Loader";

export default function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching analytics data...");
        const [categoryExpenses, incomeExpense, trends] = await Promise.all([
          analyticsService.getCategoryExpenses(),
          analyticsService.getIncomeExpenseComparison(),
          analyticsService.getFinancialTrends(),
        ]);

        console.log("Category Expenses:", categoryExpenses);
        console.log("Income/Expense:", incomeExpense);
        console.log("Trends:", trends);

        if (
          categoryExpenses.length === 0 &&
          incomeExpense.length === 0 &&
          trends.length === 0
        ) {
          setError(
            "No data available. Please add some transactions to see analytics."
          );
        } else {
          setCategoryData(categoryExpenses);
          setIncomeExpenseData(incomeExpense);
          setTrendData(trends);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading)
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

  if (error)
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-rose-400 bg-rose-500/20 border border-rose-400/20 p-4 rounded-lg">
              {error}
            </div>
          </main>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-slate-400 text-lg">
              Gain insights into your financial patterns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Category-wise Expenses
              </h2>
              <CategoryPieChart data={categoryData} />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Income vs Expenses
              </h2>
              <IncomeExpenseChart data={incomeExpenseData} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Financial Trends
            </h2>
            <TrendLineChart data={trendData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Key Statistics
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/20 border border-emerald-400/20 rounded-lg">
                  <p className="text-sm text-emerald-400">
                    Total Expenses This Month
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {categoryData
                      .reduce((sum, item) => sum + item.value, 0)
                      .toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                  </p>
                </div>
                <div className="p-4 bg-emerald-500/20 border border-emerald-400/20 rounded-lg">
                  <p className="text-sm text-emerald-400">
                    Highest Spending Category
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {categoryData.length > 0 &&
                      categoryData.reduce((max, item) =>
                        item.value > max.value ? item : max
                      ).name}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Monthly Summary
              </h2>
              {incomeExpenseData.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/20 border border-amber-400/20 rounded-lg">
                    <p className="text-sm text-amber-400">
                      Average Monthly Income
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {(
                        incomeExpenseData.reduce(
                          (sum, item) => sum + item.income,
                          0
                        ) / incomeExpenseData.length
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-rose-500/20 border border-rose-400/20 rounded-lg">
                    <p className="text-sm text-rose-400">
                      Average Monthly Expenses
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {(
                        incomeExpenseData.reduce(
                          (sum, item) => sum + item.expense,
                          0
                        ) / incomeExpenseData.length
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
