"use client";

import { SchedulingConflict } from "@/lib/types";

interface Props {
  conflicts: SchedulingConflict[];
}

const QUARTER_LABELS: Record<string, string> = {
  Q1: "Q1 (Aug–Oct)",
  Q2: "Q2 (Oct–Jan)",
  Q3: "Q3 (Jan–Mar)",
  Q4: "Q4 (Mar–May)",
  Custom: "Custom range",
};

function formatPeriod(c: SchedulingConflict): string {
  if (!c.isRecurring) {
    if (!c.specificDate) return "—";
    return new Date(c.specificDate + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const scopes = c.scheduleScope ?? [];
  if (scopes.length === 0) return "—";
  const quarters = scopes.filter((s) => s !== "Custom");
  const hasCustom = scopes.includes("Custom");
  const parts: string[] = quarters.map((q) => QUARTER_LABELS[q] ?? q);
  if (hasCustom) parts.push(`${c.customStartDate ?? ""} – ${c.customEndDate ?? ""}`);
  return parts.join(", ");
}

export function ConflictTable({ conflicts }: Props) {
  if (conflicts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">No conflicts recorded yet</p>
        <p className="text-sm mt-1">
          Conflicts submitted via the form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Days</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Slot</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Activity</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Period</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.map((c, i) => (
              <tr
                key={c.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {c.isRecurring && c.daysOfWeek && c.daysOfWeek.length > 0
                    ? c.daysOfWeek.map((d) => d.slice(0, 3)).join(", ")
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.timeSlot === "Lunch"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {c.timeSlot}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                  <span title={c.reason} className="block truncate">
                    {c.reason}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.isRecurring
                        ? "bg-indigo-600/10 text-indigo-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.isRecurring
                      ? c.recurrenceFrequency ?? "Recurring"
                      : "One-time"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                  {formatPeriod(c)}
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                  {new Date(c.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-right">
        {conflicts.length} record{conflicts.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
