import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

export default function IncomeExpenseChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          No data available
        </div>
      </div>
    );
  }

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl">
          <p className="font-medium text-slate-300 mb-2">{label}</p>
          <p className="text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Income: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-rose-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Expense: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis
          dataKey="month"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) => formatCurrency(value)}
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
        />
        <Tooltip
          content={customTooltip}
          cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          formatter={(value) => <span className="text-slate-300">{value}</span>}
        />
        <Bar
          name="Income"
          dataKey="income"
          fill="#34d399"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          name="Expense"
          dataKey="expense"
          fill="#fb7185"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
