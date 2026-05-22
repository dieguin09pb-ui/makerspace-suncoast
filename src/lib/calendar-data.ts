import { Quarter } from "./types";

export interface QuarterInfo {
  id: Quarter;
  label: string;
  start: Date;
  end: Date;
  holidays: Date[];
}

// Palm Beach County / Suncoast 2026-2027 calendar (estimated from historical patterns)
export const QUARTERS: QuarterInfo[] = [
  {
    id: "Q1",
    label: "Quarter 1",
    start: new Date("2026-08-17"),
    end: new Date("2026-10-16"),
    holidays: [
      new Date("2026-09-07"), // Labor Day
    ],
  },
  {
    id: "Q2",
    label: "Quarter 2",
    start: new Date("2026-10-19"),
    end: new Date("2027-01-08"),
    holidays: [
      new Date("2026-11-11"), // Veterans Day
      new Date("2026-11-23"), // Thanksgiving
      new Date("2026-11-24"), // Day after Thanksgiving
      new Date("2026-11-25"), // Thanksgiving break
      new Date("2026-12-21"), // Winter break start
      new Date("2026-12-22"),
      new Date("2026-12-23"),
      new Date("2026-12-24"),
      new Date("2026-12-25"), // Christmas
      new Date("2026-12-28"),
      new Date("2026-12-29"),
      new Date("2026-12-30"),
      new Date("2026-12-31"),
      new Date("2027-01-01"), // New Year's Day
      new Date("2027-01-02"),
    ],
  },
  {
    id: "Q3",
    label: "Quarter 3",
    start: new Date("2027-01-11"),
    end: new Date("2027-03-12"),
    holidays: [
      new Date("2027-01-18"), // MLK Day
      new Date("2027-02-15"), // Presidents Day
    ],
  },
  {
    id: "Q4",
    label: "Quarter 4",
    start: new Date("2027-03-15"),
    end: new Date("2027-05-28"),
    holidays: [
      new Date("2027-04-05"), // Spring break
      new Date("2027-04-06"),
      new Date("2027-04-07"),
      new Date("2027-04-08"),
      new Date("2027-04-09"),
      new Date("2027-05-31"), // Memorial Day (after school ends)
    ],
  },
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some((h) => isSameDay(date, h));
}

export function getMeetingDates(quarter: QuarterInfo): Date[] {
  const meetings: Date[] = [];
  const current = new Date(quarter.start);

  // Advance to first Tuesday
  while (current.getDay() !== 2) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= quarter.end) {
    if (!isHoliday(current, quarter.holidays)) {
      meetings.push(new Date(current));
    }
    current.setDate(current.getDate() + 7);
  }

  return meetings;
}

export function formatQuarterDateRange(quarter: QuarterInfo): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(quarter.start)} – ${fmt(quarter.end)}`;
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export const QUARTER_IDS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
