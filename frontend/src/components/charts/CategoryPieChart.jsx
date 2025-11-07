import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function CategoryPieChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const COLORS = [
    "#34d399", // emerald-400
    "#60a5fa", // blue-400
    "#f472b6", // pink-400
    "#a78bfa", // violet-400
    "#fbbf24", // amber-400
    "#fb923c", // orange-400
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl">
          <p className="font-medium text-white mb-1">{payload[0].name}</p>
          <p className="text-emerald-400 font-medium">
            {formatCurrency(payload[0].value)}
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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          No data available
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          dataKey="value"
          onMouseEnter={onPieEnter}
          strokeWidth={2}
          stroke="#1e293b" // slate-800
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={activeIndex === index ? 1 : 0.75}
              stroke={
                activeIndex === index
                  ? COLORS[index % COLORS.length]
                  : "#1e293b"
              }
              strokeWidth={activeIndex === index ? 3 : 2}
            />
          ))}
        </Pie>
        <Tooltip
          content={customTooltip}
          cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
        />
        <Legend
          formatter={(value) => <span className="text-slate-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
