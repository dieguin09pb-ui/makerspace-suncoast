import { QuarterInfo, getMeetingDates } from "@/lib/calendar-data";
import { cn } from "@/lib/utils";

interface Props {
  quarter: QuarterInfo;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMonthsInRange(start: Date, end: Date): Date[] {
  const months: Date[] = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cur <= endMonth) {
    months.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function QuarterCalendar({ quarter }: Props) {
  const meetingDates = getMeetingDates(quarter);
  const months = getMonthsInRange(quarter.start, quarter.end);

  return (
    <div className="space-y-8">
      {months.map((monthDate) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDow = getFirstDayOfWeek(year, month);

        // Build cells: blanks + days
        const cells: (number | null)[] = [
          ...Array(firstDow).fill(null),
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ];

        // Pad to full weeks
        while (cells.length % 7 !== 0) cells.push(null);

        return (
          <div key={`${year}-${month}`} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 text-white px-4 py-3">
              <h3 className="font-semibold text-lg">
                {MONTH_NAMES[month]} {year}
              </h3>
            </div>
            <div className="p-3">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map((d) => (
                  <div
                    key={d}
                    className={cn(
                      "text-center text-xs font-semibold py-1",
                      d === "Tue" ? "text-indigo-600" : "text-gray-400"
                    )}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, i) => {
                  if (!day) {
                    return <div key={`blank-${i}`} className="h-9" />;
                  }

                  const date = new Date(year, month, day);
                  const isMeeting = meetingDates.some((m) => isSameDay(m, date));
                  const isInQuarter = date >= quarter.start && date <= quarter.end;
                  const isToday = isSameDay(date, new Date());

                  return (
                    <div
                      key={`day-${day}`}
                      className={cn(
                        "h-9 flex items-center justify-center rounded-md text-sm transition-colors",
                        !isInQuarter && "opacity-30",
                        isMeeting &&
                          "bg-indigo-600 text-white font-bold rounded-full cursor-default",
                        !isMeeting && isInQuarter && "text-gray-700 hover:bg-indigo-50",
                        isToday && !isMeeting && "ring-2 ring-indigo-600 ring-offset-1"
                      )}
                      title={isMeeting ? "Makerspace Meeting" : undefined}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Meeting count for this month */}
            {(() => {
              const monthMeetings = meetingDates.filter(
                (m) => m.getFullYear() === year && m.getMonth() === month
              );
              if (monthMeetings.length === 0) return null;
              return (
                <div className="px-3 pb-3">
                  <p className="text-xs text-indigo-600 bg-indigo-50 rounded-md px-2 py-1 inline-block">
                    {monthMeetings.length} meeting{monthMeetings.length > 1 ? "s" : ""} this month
                  </p>
                </div>
              );
            })()}
          </div>
        );
      })}

      {/* Meeting list for the quarter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h4 className="font-semibold text-gray-700 mb-3">All Meeting Dates — {quarter.label}</h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {meetingDates.map((d) => (
            <div
              key={d.toISOString()}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
              {d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Total: {meetingDates.length} meeting{meetingDates.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
