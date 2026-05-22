import { NextRequest, NextResponse } from "next/server";
import { getConflicts } from "@/lib/blob";
import { AnalyticsData, DayOfWeek, Quarter } from "@/lib/types";
import { DAYS_OF_WEEK, QUARTER_IDS } from "@/lib/calendar-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const quarterParam = searchParams.getAll("quarter") as Quarter[];

  let conflicts = await getConflicts();

  if (quarterParam.length > 0) {
    conflicts = conflicts.filter((c) =>
      c.quartersAffected.some((q) => quarterParam.includes(q))
    );
  }

  const byDay = DAYS_OF_WEEK.map((day) => ({
    day: day as DayOfWeek,
    count: conflicts.filter((c) => c.daysOfWeek.includes(day as DayOfWeek)).length,
  }));

  const byQuarter = QUARTER_IDS.map((q) => ({
    quarter: q,
    count: conflicts.filter((c) => c.quartersAffected.includes(q)).length,
  }));

  const maxDay = byDay.reduce(
    (max, cur) => (cur.count > max.count ? cur : max),
    byDay[0]
  );
  const maxQuarter = byQuarter.reduce(
    (max, cur) => (cur.count > max.count ? cur : max),
    byQuarter[0]
  );

  const analytics: AnalyticsData = {
    total: conflicts.length,
    recurringCount: conflicts.filter((c) => c.isRecurring).length,
    byDay,
    byQuarter,
    mostConflictedDay: maxDay?.count > 0 ? maxDay.day : null,
    mostConflictedQuarter: maxQuarter?.count > 0 ? maxQuarter.quarter : null,
  };

  return NextResponse.json(analytics);
}
