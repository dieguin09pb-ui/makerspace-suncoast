"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { AnalyticsData } from "@/lib/types";

interface Props {
  data: AnalyticsData["byDay"];
}

const DAY_COLORS = [
  "#4F46E5", // Mon - brand blue
  "#34D399", // Tue - green (the meeting day)
  "#F59E0B", // Wed - amber
  "#EC4899", // Thu - pink
  "#8B5CF6", // Fri - purple
];

export function DayOfWeekChart({ data }: Props) {
  const chartData = data.map((d, i) => ({
    name: d.day.slice(0, 3),
    Conflicts: d.count,
    color: DAY_COLORS[i],
    fullName: d.day,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 18, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6B7280", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value, _name, props) => [value, props.payload.fullName]}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Bar dataKey="Conflicts" radius={[6, 6, 0, 0]} maxBarSize={52}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="Conflicts"
              position="top"
              style={{ fontSize: 11, fontWeight: 700, fill: "#374151" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
