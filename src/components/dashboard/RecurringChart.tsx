"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  recurring: number;
  total: number;
}

export function RecurringChart({ recurring, total }: Props) {
  const oneTime = total - recurring;

  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  const data = [
    { name: "Recurring", value: recurring, color: "#8B5CF6" },
    { name: "One-time", value: oneTime, color: "#818CF8" },
  ].filter((d) => d.value > 0);

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            dataKey="value"
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px" }}
            formatter={(value: number, name: string) => [`${value}`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span style={{ fontSize: 11, color: "#6B7280" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
