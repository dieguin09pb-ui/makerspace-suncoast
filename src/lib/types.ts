import { z } from "zod";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export const conflictSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  daysOfWeek: z
    .array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]))
    .min(1, "Select at least one day"),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  reason: z.string().min(5, "Please describe your conflict (min 5 characters)"),
  isRecurring: z.boolean(),
  quartersAffected: z
    .array(z.enum(["Q1", "Q2", "Q3", "Q4"]))
    .min(1, "Select at least one quarter"),
});

export type ConflictFormData = z.infer<typeof conflictSchema>;

export interface SchedulingConflict extends ConflictFormData {
  id: string;
  submittedAt: string;
}

export interface ConflictsStore {
  conflicts: SchedulingConflict[];
}

export interface AnalyticsData {
  total: number;
  recurringCount: number;
  byDay: { day: DayOfWeek; count: number }[];
  byQuarter: { quarter: Quarter; count: number }[];
  mostConflictedDay: DayOfWeek | null;
  mostConflictedQuarter: Quarter | null;
}
