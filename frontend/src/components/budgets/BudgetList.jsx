import { formatCurrency } from "../../utils/formatCurrency";

export default function BudgetList({
  budgets,
  spentAmounts,
  onEdit,
  onDelete,
}) {
  const calculateProgress = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    return Math.min(percentage, 100);
  };

  const getProgressBarColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((budget) => {
        const spent = spentAmounts[budget.category] || 0;
        const progress = calculateProgress(spent, budget.monthlyLimit);
        const progressBarColor = getProgressBarColor(
          spent,
          budget.monthlyLimit
        );

        return (
          <div
            key={budget._id}
            className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl p-6 hover:bg-slate-800/70 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">
                  {budget.category}
                </h3>
                <p className="text-sm text-slate-400">Monthly Budget</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(budget)}
                  className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(budget._id)}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Spent</span>
                <span className="text-white font-medium">
                  {formatCurrency(spent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Limit</span>
                <span className="text-white font-medium">
                  {formatCurrency(budget.monthlyLimit)}
                </span>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      className={`
                      text-xs font-semibold inline-block py-1 px-3 rounded-full
                      ${
                        progress >= 100
                          ? "text-rose-400 bg-rose-400/20 border border-rose-400/30"
                          : progress >= 80
                          ? "text-amber-400 bg-amber-400/20 border border-amber-400/30"
                          : "text-emerald-400 bg-emerald-400/20 border border-emerald-400/30"
                      }
                    `}
                    >
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-slate-700/50">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`
                      shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                      transition-all duration-500
                      ${
                        progress >= 100
                          ? "bg-linear-to-r from-rose-500 to-rose-400"
                          : progress >= 80
                          ? "bg-linear-to-r from-amber-500 to-amber-400"
                          : "bg-linear-to-r from-emerald-500 to-emerald-400"
                      }
                    `}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
