import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700/50">
        <thead className="bg-slate-800/50">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                {transaction.description || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                {transaction.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span
                  className={
                    transaction.type === "income"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                >
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${
                    transaction.type === "income"
                      ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                      : "bg-rose-400/10 text-rose-400 border-rose-400/20"
                  }`}
                >
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(transaction)}
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
                  onClick={() => onDelete(transaction._id)}
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
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 mb-3 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  No transactions found
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
