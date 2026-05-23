import { z } from "zod";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type TimeSlot = "Lunch" | "After School";
export type RecurrenceFrequency =
  | "Weekly"
  | "Every other week"
  | "Monthly"
  | "Other";
export type ScheduleScope = "Q1" | "Q2" | "Q3" | "Q4" | "Custom";

export const conflictSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    reason: z.string().min(3, "Please describe your activity"),
    timeSlot: z.enum(["Lunch", "After School"], {
      required_error: "Select a time slot",
    }),
    isRecurring: z.boolean(),

    // --- Recurring fields ---
    daysOfWeek: z
      .array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]))
      .optional(),
    recurrenceFrequency: z
      .enum(["Weekly", "Every other week", "Monthly", "Other"])
      .optional(),
    recurrenceStartDate: z.string().optional(),
    scheduleScope: z.enum(["Q1", "Q2", "Q3", "Q4", "Custom"]).optional(),
    customStartDate: z.string().optional(),
    customEndDate: z.string().optional(),

    // --- One-time fields ---
    specificDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Select at least one day",
          path: ["daysOfWeek"],
        });
      }
      if (!data.recurrenceFrequency) {
        ctx.addIssue({
          code: "custom",
          message: "Select how often this repeats",
          path: ["recurrenceFrequency"],
        });
      }
      if (!data.scheduleScope) {
        ctx.addIssue({
          code: "custom",
          message: "Select the time period",
          path: ["scheduleScope"],
        });
      }
      if (data.scheduleScope === "Custom") {
        if (!data.customStartDate) {
          ctx.addIssue({
            code: "custom",
            message: "Enter start date",
            path: ["customStartDate"],
          });
        }
        if (!data.customEndDate) {
          ctx.addIssue({
            code: "custom",
            message: "Enter end date",
            path: ["customEndDate"],
          });
        }
      }
    } else {
      if (!data.specificDate) {
        ctx.addIssue({
          code: "custom",
          message: "Enter the date of your conflict",
          path: ["specificDate"],
        });
      }
    }
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
  bySlot: { slot: TimeSlot; count: number }[];
  scheduleGrid: { day: DayOfWeek; slot: TimeSlot; count: number }[];
  mostConflictedDay: DayOfWeek | null;
  mostConflictedQuarter: Quarter | null;
}
