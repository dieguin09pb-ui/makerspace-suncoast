"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AnalyticsData } from "@/lib/types";

interface Props {
  data: AnalyticsData["byQuarter"];
  selectedQuarters: string[];
}

const QUARTER_COLORS: Record<string, string> = {
  Q1: "#5BA4CF",
  Q2: "#F59E0B",
  Q3: "#34D399",
  Q4: "#EC4899",
};

const QUARTER_LABELS: Record<string, string> = {
  Q1: "Q1 (Aug–Oct)",
  Q2: "Q2 (Oct–Jan)",
  Q3: "Q3 (Jan–Mar)",
  Q4: "Q4 (Mar–May)",
};

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  value: number;
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: CustomLabelProps) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 13, fontWeight: 700 }}>
      {value}
    </text>
  );
}

export function QuarterChart({ data, selectedQuarters }: Props) {
  const chartData = data
    .filter((d) => d.count > 0)
    .filter((d) => selectedQuarters.length === 0 || selectedQuarters.includes(d.quarter))
    .map((d) => ({
      name: QUARTER_LABELS[d.quarter],
      value: d.count,
      quarter: d.quarter,
      color: QUARTER_COLORS[d.quarter],
    }));

  if (chartData.length === 0 || chartData.every((d) => d.value === 0)) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={40}
            dataKey="value"
            labelLine={false}
            label={CustomLabel as (props: unknown) => React.ReactElement | null}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value: number, name: string) => [`${value} conflict${value !== 1 ? "s" : ""}`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span style={{ fontSize: 12, color: "#6B7280" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
