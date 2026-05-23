import { getConflicts } from "@/lib/blob";
import { SchedulingConflict } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const QUARTER_LABELS: Record<string, string> = {
  Q1: "Q1 — Aug 17 to Oct 16, 2026",
  Q2: "Q2 — Oct 19, 2026 to Jan 8, 2027",
  Q3: "Q3 — Jan 11 to Mar 12, 2027",
  Q4: "Q4 — Mar 15 to May 28, 2027",
};

function formatPeriod(c: SchedulingConflict): string {
  if (!c.isRecurring) {
    if (!c.specificDate) return "—";
    return new Date(c.specificDate + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  const scopes = c.scheduleScope ?? [];
  if (scopes.length === 0) return "—";
  const quarters = scopes.filter((s) => s !== "Custom");
  const hasCustom = scopes.includes("Custom");
  const parts: string[] = quarters.map((q) => QUARTER_LABELS[q] ?? q);
  if (hasCustom) parts.push(`${c.customStartDate} to ${c.customEndDate}`);
  return parts.join(", ");
}

export default async function ActivitiesPage() {
  const conflicts = await getConflicts();
  const sorted = [...conflicts].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/images/Clipboard.png"
          alt=""
          width={40}
          height={40}
          className="object-contain"
          aria-hidden="true"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#5BA4CF]">
            Submitted Activities
          </h1>
          <p className="text-gray-500">
            All member scheduling conflicts — {conflicts.length} total
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-5 mb-6">
        <Link href="/conflict">
          <Button size="sm">Report a Conflict</Button>
        </Link>
        <Link href="/dashboard">
          <Button size="sm" variant="outline">View Dashboard</Button>
        </Link>
      </div>

      {conflicts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-lg font-medium">No activities submitted yet</p>
          <p className="text-sm mt-1">
            Members can report conflicts using the conflict form.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-800 text-base">
                    {c.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">{c.reason}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.isRecurring
                        ? "bg-[#5BA4CF]/10 text-[#5BA4CF]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.isRecurring ? "Recurring" : "One-time"}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.timeSlot === "Lunch"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {c.timeSlot}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                {c.isRecurring && c.daysOfWeek && c.daysOfWeek.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-400 block">
                      Days
                    </span>
                    <span className="text-gray-700">
                      {c.daysOfWeek.join(", ")}
                    </span>
                  </div>
                )}
                {c.isRecurring && c.recurrenceFrequency && (
                  <div>
                    <span className="text-xs font-medium text-gray-400 block">
                      Frequency
                    </span>
                    <span className="text-gray-700">
                      {c.recurrenceFrequency}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-gray-400 block">
                    {c.isRecurring ? "Period" : "Date"}
                  </span>
                  <span className="text-gray-700">{formatPeriod(c)}</span>
                </div>
                {c.isRecurring && c.recurrenceStartDate && (
                  <div>
                    <span className="text-xs font-medium text-gray-400 block">
                      Starts
                    </span>
                    <span className="text-gray-700">
                      {new Date(
                        c.recurrenceStartDate + "T12:00:00"
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Submitted{" "}
                {new Date(c.submittedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
