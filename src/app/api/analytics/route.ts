import { NextResponse } from "next/server";
import { getConflicts } from "@/lib/blob";
import { AnalyticsData, DayOfWeek, Quarter, TimeSlot } from "@/lib/types";
import { DAYS_OF_WEEK, QUARTER_IDS, QUARTERS } from "@/lib/calendar-data";

function getQuarterForDate(dateStr: string): Quarter | null {
  const date = new Date(dateStr + "T12:00:00");
  for (const q of QUARTERS) {
    if (date >= q.start && date <= q.end) return q.id;
  }
  return null;
}

const TIME_SLOTS: TimeSlot[] = ["Lunch", "After School"];

export async function GET() {
  const conflicts = await getConflicts();

  const byDay = DAYS_OF_WEEK.map((day) => ({
    day: day as DayOfWeek,
    count: conflicts.filter(
      (c) => c.isRecurring && (c.daysOfWeek ?? []).includes(day as DayOfWeek)
    ).length,
  }));

  const byQuarter = QUARTER_IDS.map((q) => ({
    quarter: q,
    count: conflicts.filter((c) => {
      if (c.isRecurring) return c.scheduleScope === q;
      return c.specificDate ? getQuarterForDate(c.specificDate) === q : false;
    }).length,
  }));

  const bySlot = TIME_SLOTS.map((slot) => ({
    slot,
    count: conflicts.filter((c) => c.timeSlot === slot).length,
  }));

  const scheduleGrid = DAYS_OF_WEEK.flatMap((day) =>
    TIME_SLOTS.map((slot) => ({
      day: day as DayOfWeek,
      slot: slot as TimeSlot,
      count: conflicts.filter(
        (c) =>
          c.isRecurring &&
          (c.daysOfWeek ?? []).includes(day as DayOfWeek) &&
          c.timeSlot === slot
      ).length,
    }))
  );

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
    bySlot,
    scheduleGrid,
    mostConflictedDay: maxDay?.count > 0 ? maxDay.day : null,
    mostConflictedQuarter: maxQuarter?.count > 0 ? maxQuarter.quarter : null,
  };

  return NextResponse.json(analytics);
}
