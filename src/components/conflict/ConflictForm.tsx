"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  conflictSchema,
  ConflictFormData,
  DayOfWeek,
  ScheduleScope,
  TimeSlot,
  RecurrenceFrequency,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const SCHEDULE_SCOPE_OPTIONS: { value: ScheduleScope; label: string }[] = [
  { value: "Q1", label: "Q1 — Aug 17 to Oct 16, 2026" },
  { value: "Q2", label: "Q2 — Oct 19, 2026 to Jan 8, 2027" },
  { value: "Q3", label: "Q3 — Jan 11 to Mar 12, 2027" },
  { value: "Q4", label: "Q4 — Mar 15 to May 28, 2027" },
  { value: "Custom", label: "Custom date range..." },
];

const RECURRENCE_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: "Weekly", label: "Every week" },
  { value: "Every other week", label: "Every other week" },
  { value: "Monthly", label: "Once a month" },
  { value: "Other", label: "Other / Irregular" },
];

const TIME_SLOTS: { value: TimeSlot; label: string; desc: string }[] = [
  { value: "Lunch", label: "Lunch", desc: "~11:30 AM – 12:30 PM" },
  {
    value: "After School",
    label: "After School",
    desc: "~3:30 PM onwards",
  },
];

function ToggleButton({
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
        "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors select-none",
        active
          ? "bg-[#5BA4CF] text-white border-[#5BA4CF]"
          : "bg-white text-gray-600 border-gray-300 hover:border-[#5BA4CF] hover:text-[#5BA4CF]"
      )}
    >
      {children}
    </button>
  );
}

export function ConflictForm() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConflictFormData>({
    resolver: zodResolver(conflictSchema),
    defaultValues: {
      name: "",
      reason: "",
      timeSlot: undefined,
      isRecurring: false,
      daysOfWeek: [],
      recurrenceFrequency: undefined,
      recurrenceStartDate: "",
      scheduleScope: undefined,
      customStartDate: "",
      customEndDate: "",
      specificDate: "",
    },
  });

  const selectedDays = watch("daysOfWeek") ?? [];
  const isRecurring = watch("isRecurring");
  const scheduleScope = watch("scheduleScope");

  function toggleDay(day: DayOfWeek) {
    if (selectedDays.includes(day)) {
      setValue(
        "daysOfWeek",
        selectedDays.filter((d) => d !== day),
        { shouldValidate: true }
      );
    } else {
      setValue("daysOfWeek", [...selectedDays, day], { shouldValidate: true });
    }
  }

  async function onSubmit(data: ConflictFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/conflicts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast({
        variant: "success",
        title: "Conflict submitted",
        description: "Your scheduling conflict has been recorded. Thank you!",
      });
      reset();
    } catch {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not save your conflict. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Your full name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Activity */}
      <div className="space-y-1.5">
        <Label htmlFor="reason">Activity / Reason</Label>
        <p className="text-xs text-gray-500">
          e.g. Basketball practice, Orchestra rehearsal, Tutoring
        </p>
        <Textarea
          id="reason"
          rows={2}
          placeholder="Describe your conflict..."
          {...register("reason")}
        />
        {errors.reason && (
          <p className="text-sm text-red-500">{errors.reason.message}</p>
        )}
      </div>

      {/* Time slot */}
      <div className="space-y-1.5">
        <Label>When during the day?</Label>
        <Controller
          name="timeSlot"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3 mt-1">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => field.onChange(slot.value)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    field.value === slot.value
                      ? "border-[#5BA4CF] bg-[#F0F7FF]"
                      : "border-gray-200 bg-white hover:border-[#5BA4CF]/50"
                  )}
                >
                  <p className="font-medium text-sm text-gray-800">
                    {slot.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{slot.desc}</p>
                </button>
              ))}
            </div>
          )}
        />
        {errors.timeSlot && (
          <p className="text-sm text-red-500">{errors.timeSlot.message}</p>
        )}
      </div>

      {/* Recurring toggle */}
      <div className="space-y-1.5">
        <Label>Does this happen more than once?</Label>
        <Controller
          name="isRecurring"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3 mt-1">
              <ToggleButton
                active={field.value === true}
                onClick={() => {
                  field.onChange(true);
                  setValue("specificDate", "");
                }}
              >
                Yes — recurring
              </ToggleButton>
              <ToggleButton
                active={field.value === false}
                onClick={() => {
                  field.onChange(false);
                  setValue("daysOfWeek", []);
                  setValue("recurrenceFrequency", undefined);
                  setValue("scheduleScope", undefined);
                }}
              >
                No — one-time only
              </ToggleButton>
            </div>
          )}
        />
      </div>

      {/* ── RECURRING BRANCH ── */}
      {isRecurring && (
        <>
          {/* Days of week */}
          <div className="space-y-1.5">
            <Label>Which days of the week?</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {DAYS.map((day) => (
                <ToggleButton
                  key={day}
                  active={selectedDays.includes(day)}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </ToggleButton>
              ))}
            </div>
            {errors.daysOfWeek && (
              <p className="text-sm text-red-500">{errors.daysOfWeek.message}</p>
            )}
          </div>

          {/* Frequency */}
          <div className="space-y-1.5">
            <Label htmlFor="recurrenceFrequency">How often does it repeat?</Label>
            <Controller
              name="recurrenceFrequency"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value || undefined)
                  }
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#5BA4CF]"
                >
                  <option value="">Select frequency...</option>
                  {RECURRENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.recurrenceFrequency && (
              <p className="text-sm text-red-500">
                {errors.recurrenceFrequency.message}
              </p>
            )}
          </div>

          {/* Start date */}
          <div className="space-y-1.5">
            <Label htmlFor="recurrenceStartDate">
              When does it start? <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="recurrenceStartDate"
              type="date"
              {...register("recurrenceStartDate")}
            />
          </div>

          {/* Schedule scope */}
          <div className="space-y-1.5">
            <Label htmlFor="scheduleScope">
              How long does this last?
            </Label>
            <Controller
              name="scheduleScope"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value || undefined)
                  }
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#5BA4CF]"
                >
                  <option value="">Select period...</option>
                  {SCHEDULE_SCOPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.scheduleScope && (
              <p className="text-sm text-red-500">
                {errors.scheduleScope.message}
              </p>
            )}
          </div>

          {/* Custom date range */}
          {scheduleScope === "Custom" && (
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-[#5BA4CF]/40">
              <div className="space-y-1.5">
                <Label htmlFor="customStartDate">From</Label>
                <Input
                  id="customStartDate"
                  type="date"
                  {...register("customStartDate")}
                />
                {errors.customStartDate && (
                  <p className="text-sm text-red-500">
                    {errors.customStartDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customEndDate">To</Label>
                <Input
                  id="customEndDate"
                  type="date"
                  {...register("customEndDate")}
                />
                {errors.customEndDate && (
                  <p className="text-sm text-red-500">
                    {errors.customEndDate.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ONE-TIME BRANCH ── */}
      {!isRecurring && (
        <div className="space-y-1.5">
          <Label htmlFor="specificDate">Date of the conflict</Label>
          <Input
            id="specificDate"
            type="date"
            {...register("specificDate")}
          />
          {errors.specificDate && (
            <p className="text-sm text-red-500">{errors.specificDate.message}</p>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? "Submitting..." : "Submit Conflict"}
        </Button>
      </div>
    </form>
  );
}
