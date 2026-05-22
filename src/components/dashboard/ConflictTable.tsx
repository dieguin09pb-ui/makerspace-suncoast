"use client";

import { SchedulingConflict } from "@/lib/types";

interface Props {
  conflicts: SchedulingConflict[];
}

function fmt12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
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
            <tr className="bg-[#F0F7FF] text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Days</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Time</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Activity</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Recurring</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Quarters</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.map((c, i) => (
              <tr
                key={c.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {c.daysOfWeek.map((d) => d.slice(0, 3)).join(", ")}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {fmt12h(c.timeStart)} – {fmt12h(c.timeEnd)}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[200px]">
                  <span
                    title={c.reason}
                    className="block truncate"
                  >
                    {c.reason}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.isRecurring
                        ? "bg-[#5BA4CF]/10 text-[#5BA4CF]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.isRecurring ? "Recurring" : "One-time"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {c.quartersAffected.join(", ")}
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
