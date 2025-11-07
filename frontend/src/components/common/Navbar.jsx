import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-slate-900/80 border-b border-white/10 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/wealth-guardian-logo1.png"
              alt="Wealth Guardian Logo"
              className="h-auto w-40 rounded-lg shadow-sm hover:opacity-90 transition"
            />
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-1">
                  {[
                    { to: "/dashboard", label: "Dashboard" },
                    { to: "/transactions", label: "Transactions" },
                    { to: "/budgets", label: "Budgets" },
                    { to: "/analytics", label: "Analytics" },
                  ].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="px-4 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-all relative group"
                    >
                      {link.label}
                      <span className="absolute inset-x-3 -bottom-px h-px bg-emerald-400/0 group-hover:bg-emerald-400 transition-all"></span>
                    </Link>
                  ))}
                </div>

                <div className="flex items-center">
                  <div className="mr-6 flex items-center gap-3 px-4 py-1.5 rounded-lg bg-slate-800/50 border border-white/5">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      {user.name[0].toUpperCase()}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {/* Premium User */}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-slate-800 text-emerald-400 rounded-lg border border-emerald-400/20 hover:bg-emerald-500 hover:text-white transition-all duration-200 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
