"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SchedulingConflict, Quarter, DayOfWeek, AnalyticsData } from "@/lib/types";
import { QUARTER_IDS, DAYS_OF_WEEK } from "@/lib/calendar-data";
import { DayOfWeekChart } from "@/components/dashboard/DayOfWeekChart";
import { QuarterChart } from "@/components/dashboard/QuarterChart";
import { ConflictTable } from "@/components/dashboard/ConflictTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  initialConflicts: SchedulingConflict[];
}

function QuarterToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
        active
          ? "bg-[#5BA4CF] text-white border-[#5BA4CF]"
          : "bg-white text-gray-600 border-gray-300 hover:border-[#5BA4CF] hover:text-[#5BA4CF]"
      )}
    >
      {children}
    </button>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-[#5BA4CF] mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function DashboardClient({ initialConflicts }: Props) {
  const [selectedQuarters, setSelectedQuarters] = useState<Quarter[]>([]);

  function toggleQuarter(q: Quarter) {
    setSelectedQuarters((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q]
    );
  }

  const filtered = useMemo(() => {
    if (selectedQuarters.length === 0) return initialConflicts;
    return initialConflicts.filter((c) =>
      c.quartersAffected.some((q) => selectedQuarters.includes(q))
    );
  }, [initialConflicts, selectedQuarters]);

  const analytics: AnalyticsData = useMemo(() => {
    const byDay = DAYS_OF_WEEK.map((day) => ({
      day: day as DayOfWeek,
      count: filtered.filter((c) => c.daysOfWeek.includes(day as DayOfWeek)).length,
    }));

    const byQuarter = QUARTER_IDS.map((q) => ({
      quarter: q,
      count: filtered.filter((c) => c.quartersAffected.includes(q)).length,
    }));

    const maxDay = byDay.reduce(
      (max, cur) => (cur.count > max.count ? cur : max),
      byDay[0]
    );
    const maxQuarter = byQuarter.reduce(
      (max, cur) => (cur.count > max.count ? cur : max),
      byQuarter[0]
    );

    return {
      total: filtered.length,
      recurringCount: filtered.filter((c) => c.isRecurring).length,
      byDay,
      byQuarter,
      mostConflictedDay: maxDay?.count > 0 ? maxDay.day : null,
      mostConflictedQuarter: maxQuarter?.count > 0 ? maxQuarter.quarter : null,
    };
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/images/Analytics.png"
          alt=""
          width={48}
          height={48}
          className="object-contain"
          aria-hidden="true"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#5BA4CF]">Conflict Dashboard</h1>
          <p className="text-gray-500">Scheduling conflict overview — 2026–2027</p>
        </div>
      </div>

      {/* Quarter filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Filter by quarter:</span>
        {QUARTER_IDS.map((q) => (
          <QuarterToggle
            key={q}
            active={selectedQuarters.includes(q)}
            onClick={() => toggleQuarter(q)}
          >
            {q}
          </QuarterToggle>
        ))}
        {selectedQuarters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedQuarters([])}
            className="text-gray-400 hover:text-gray-600"
          >
            Clear filter
          </Button>
        )}
      </div>
      {selectedQuarters.length > 0 && (
        <p className="text-xs text-[#5BA4CF] mt-2">
          Showing data for: {selectedQuarters.join(", ")}
        </p>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Total Conflicts"
          value={analytics.total}
          sub="submissions"
        />
        <StatCard
          label="Recurring"
          value={analytics.recurringCount}
          sub={
            analytics.total > 0
              ? `${Math.round((analytics.recurringCount / analytics.total) * 100)}% of total`
              : "—"
          }
        />
        <StatCard
          label="Most Conflicted Day"
          value={analytics.mostConflictedDay?.slice(0, 3) ?? "—"}
          sub={
            analytics.mostConflictedDay
              ? `${analytics.byDay.find((d) => d.day === analytics.mostConflictedDay)?.count ?? 0} conflicts`
              : "No data yet"
          }
        />
        <StatCard
          label="Most Affected Quarter"
          value={analytics.mostConflictedQuarter ?? "—"}
          sub={
            analytics.mostConflictedQuarter
              ? `${analytics.byQuarter.find((q) => q.quarter === analytics.mostConflictedQuarter)?.count ?? 0} conflicts`
              : "No data yet"
          }
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/images/StatGraphs.png"
              alt=""
              width={28}
              height={28}
              className="object-contain"
              aria-hidden="true"
            />
            <h2 className="font-semibold text-gray-700">Conflicts by Day of Week</h2>
          </div>
          {analytics.total === 0 ? (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          ) : (
            <DayOfWeekChart data={analytics.byDay} />
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/images/AnalyzeGraph.png"
              alt=""
              width={28}
              height={28}
              className="object-contain"
              aria-hidden="true"
            />
            <h2 className="font-semibold text-gray-700">Conflicts by Quarter</h2>
          </div>
          {analytics.total === 0 ? (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          ) : (
            <QuarterChart
              data={analytics.byQuarter}
              selectedQuarters={selectedQuarters}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">All Submitted Conflicts</h2>
          <Link href="/conflict">
            <Button variant="outline" size="sm">
              Add a conflict
            </Button>
          </Link>
        </div>
        <ConflictTable conflicts={filtered} />
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Data refreshes on page load. Use the quarter filter to focus on a specific period.
      </p>
    </div>
  );
}
