import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaWallet,
  FaBullseye,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";

export default function Landing() {
  const { user, token } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/wealth-guardian-logo1.png"
              alt="Wealth Guardian Logo"
              className="h-15 w-auto rounded-lg shadow-sm hover:opacity-90 transition"
            />
          </div>
          <div className="space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-300">Welcome, {user?.name}!</span>
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <FaTachometerAlt className="mr-2" />
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
        </div>
      </div>

      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 mx-auto w-3/4 h-3/4 bg-gradient-radial from-emerald-500/20 to-transparent blur-2xl"></div>
          {token ? (
            <>
              <h2 className="text-5xl font-bold text-white mb-4">
                Welcome Back!
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Continue managing your finances and tracking your progress
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/transactions"
                  className="group px-6 py-3 bg-emerald-500 text-white rounded-lg text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105"
                >
                  View Transactions
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/analytics"
                  className="group px-6 py-3 bg-indigo-500 text-white rounded-lg text-lg hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105"
                >
                  View Analytics
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                Take Control of Your <span className="text-emerald-400">Financial Future</span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Smart budgeting, intuitive expense tracking, and powerful analytics to help you achieve your financial goals
              </p>
              <Link
                to="/register"
                className="group inline-flex items-center px-8 py-4 bg-emerald-500 text-white rounded-lg text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105"
              >
                Start Your Journey
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="group bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 transition-all hover:bg-white/10 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-emerald-500/20 to-transparent blur-xl"></div>
              <FaWallet className="text-5xl text-emerald-400 mx-auto mb-6 relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Smart Expense Tracking</h3>
            <p className="text-slate-300">
              Effortlessly monitor your income and expenses with intelligent categorization
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 transition-all hover:bg-white/10 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-indigo-500/20 to-transparent blur-xl"></div>
              <FaBullseye className="text-5xl text-indigo-400 mx-auto mb-6 relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Intelligent Budgeting</h3>
            <p className="text-slate-300">
              Create dynamic budgets with real-time alerts and smart recommendations
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 transition-all hover:bg-white/10 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-teal-500/20 to-transparent blur-xl"></div>
              <FaChartLine className="text-5xl text-teal-400 mx-auto mb-6 relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Advanced Analytics</h3>
            <p className="text-slate-300">
              Gain deep insights with interactive charts and predictive analysis
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[4rem_4rem]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-900 to-transparent"></div>
    </div>
  );
}
