"use client";

import { DayOfWeek, TimeSlot, AnalyticsData } from "@/lib/types";

interface Props {
  scheduleGrid: AnalyticsData["scheduleGrid"];
}

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const SLOTS: TimeSlot[] = ["Lunch", "After School"];

const SLOT_LABELS: Record<TimeSlot, string> = {
  Lunch: "Lunch (12:10–12:50 PM)",
  "After School": "After School (2:40 PM+)",
};

function heatStyle(
  count: number,
  max: number
): { backgroundColor: string; color: string } {
  if (count === 0) return { backgroundColor: "#F9FAFB", color: "#D1D5DB" };
  const ratio = max > 0 ? count / max : 0;
  if (ratio < 0.34) return { backgroundColor: "#DBEAFE", color: "#1E40AF" };
  if (ratio < 0.67) return { backgroundColor: "#4F46E5", color: "#FFFFFF" };
  return { backgroundColor: "#1D4ED8", color: "#FFFFFF" };
}

export function ScheduleGrid({ scheduleGrid }: Props) {
  const max = Math.max(...scheduleGrid.map((c) => c.count), 1);

  const getCount = (day: DayOfWeek, slot: TimeSlot) =>
    scheduleGrid.find((c) => c.day === day && c.slot === slot)?.count ?? 0;

  const bestSlot = SLOTS.reduce<{ slot: TimeSlot; total: number } | null>(
    (best, slot) => {
      const total = DAYS.reduce((s, d) => s + getCount(d, slot), 0);
      return !best || total < best.total ? { slot, total } : best;
    },
    null
  );

  const bestDay = DAYS.reduce<{ day: DayOfWeek; total: number } | null>(
    (best, day) => {
      const total = SLOTS.reduce((s, slot) => s + getCount(day, slot), 0);
      return !best || total < best.total ? { day, total } : best;
    },
    null
  );

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderSpacing: "4px", borderCollapse: "separate" }}>
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-normal pb-2 w-32" />
              {SLOTS.map((slot) => (
                <th
                  key={slot}
                  className="text-center text-xs font-semibold text-gray-600 pb-2 px-3"
                >
                  {SLOT_LABELS[slot]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <td className="text-sm font-medium text-gray-700 py-1 pr-3 whitespace-nowrap">
                  {day}
                </td>
                {SLOTS.map((slot) => {
                  const count = getCount(day, slot);
                  return (
                    <td
                      key={slot}
                      className="text-center rounded-lg py-4 px-6 font-bold text-base transition-colors"
                      style={heatStyle(count, max)}
                    >
                      {count > 0 ? (
                        count
                      ) : (
                        <span style={{ color: "#E5E7EB", fontWeight: 400 }}>
                          0
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-5 mt-4 text-xs text-gray-500">
        <span className="font-medium">Conflict density:</span>
        {[
          { bg: "#F9FAFB", border: "1px solid #E5E7EB", label: "None" },
          { bg: "#DBEAFE", label: "Low" },
          { bg: "#4F46E5", label: "Medium" },
          { bg: "#1D4ED8", label: "High" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded inline-block"
              style={{ backgroundColor: item.bg, border: item.border }}
            />
            {item.label}
          </span>
        ))}
      </div>

      {(bestDay || bestSlot) && max > 0 && (
        <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-600/30 px-4 py-3 text-sm">
          <span className="font-semibold text-indigo-600">Scheduling tip: </span>
          <span className="text-gray-600">
            {bestDay && bestSlot
              ? `Least conflict on ${bestDay.day} ${bestSlot.slot === "Lunch" ? "at Lunch" : "After School"} — consider that slot for upcoming meetings.`
              : bestDay
              ? `${bestDay.day} has the fewest recurring conflicts overall.`
              : `${bestSlot?.slot} has the fewest recurring conflicts overall.`}
          </span>
        </div>
      )}
    </div>
  );
}
