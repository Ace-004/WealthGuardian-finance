import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

export default function TrendLineChart({ data }) {
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl">
          <p className="font-medium text-white mb-2">{label}</p>
          <p className="text-cyan-400 flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Balance: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Savings: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
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
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          No data available
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
        <YAxis
          tickFormatter={(value) => formatCurrency(value)}
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
        />
        <Tooltip
          content={customTooltip}
          cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Legend
          formatter={(value) => <span className="text-slate-300">{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#22d3ee" // cyan-400
          strokeWidth={2}
          dot={{ r: 4, fill: "#0f172a", strokeWidth: 2 }}
          activeDot={{ r: 8, fill: "#22d3ee", strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="savings"
          stroke="#34d399" // emerald-400
          strokeWidth={2}
          dot={{ r: 4, fill: "#0f172a", strokeWidth: 2 }}
          activeDot={{ r: 8, fill: "#34d399", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
