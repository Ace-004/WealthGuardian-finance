import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { FaWallet, FaArrowUp, FaArrowDown, FaPiggyBank } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as transactionService from "../services/transactionService";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="p-6 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-slate-700/70 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div
        className={`p-3 rounded-full ${
          trend === "up"
            ? "bg-emerald-500/20"
            : trend === "down"
            ? "bg-rose-500/20"
            : "bg-emerald-500/20"
        }`}
      >
        <Icon
          className={`text-xl ${
            trend === "up"
              ? "text-emerald-400"
              : trend === "down"
              ? "text-rose-400"
              : "text-emerald-400"
          }`}
        />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch transactions summary
        const summary = await transactionService.getTransactionSummary();
        setStats({
          balance: summary.currentBalance,
          income: summary.totalIncome,
          expenses: summary.totalExpenses,
          savings: summary.totalIncome - summary.totalExpenses,
        });

        // Fetch recent transactions
        const transactions = await transactionService.listTransactions();
        setRecentTransactions(
          transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
        ); // Get last 5 transactions

        // Fetch transaction categories for chart
        const categoryData =
          await transactionService.getTransactionsByCategory();
        console.log("Received category data:", categoryData);

        if (categoryData && categoryData.length > 0) {
          setChartData(
            categoryData.map((item) => ({
              name: item.category,
              amount: Math.abs(item.total),
            }))
          );
        } else {
          setChartData([]); // Set empty array if no data
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Financial Overview
              </h1>
              <p className="text-slate-400 text-lg">
                Monitor your financial health at a glance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Current Balance"
                value={formatCurrency(stats.balance)}
                icon={FaWallet}
              />
              <StatCard
                title="Monthly Income"
                value={formatCurrency(stats.income)}
                icon={FaArrowUp}
                trend="up"
              />
              <StatCard
                title="Monthly Expenses"
                value={formatCurrency(stats.expenses)}
                icon={FaArrowDown}
                trend="down"
              />
              <StatCard
                title="Total Savings"
                value={formatCurrency(stats.savings)}
                icon={FaPiggyBank}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Chart */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Expense Breakdown
                </h2>
                <div className="h-80">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="amount" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      No expense data available
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Recent Transactions
                </h2>
                <div className="space-y-4">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-white/5 hover:bg-slate-700/70 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-slate-400">
                              {formatDate(transaction.date)}
                            </p>
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                              {transaction.category}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      No recent transactions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
