"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { conflictSchema, ConflictFormData, DayOfWeek, Quarter } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
const QUARTER_LABELS: Record<Quarter, string> = {
  Q1: "Q1 (Aug–Oct 2026)",
  Q2: "Q2 (Oct 2026–Jan 2027)",
  Q3: "Q3 (Jan–Mar 2027)",
  Q4: "Q4 (Mar–May 2027)",
};

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
      daysOfWeek: [],
      timeStart: "",
      timeEnd: "",
      reason: "",
      isRecurring: false,
      quartersAffected: [],
    },
  });

  const selectedDays = watch("daysOfWeek");
  const selectedQuarters = watch("quartersAffected");
  const isRecurring = watch("isRecurring");

  function toggleDay(day: DayOfWeek) {
    const current = selectedDays ?? [];
    if (current.includes(day)) {
      setValue("daysOfWeek", current.filter((d) => d !== day), {
        shouldValidate: true,
      });
    } else {
      setValue("daysOfWeek", [...current, day], { shouldValidate: true });
    }
  }

  function toggleQuarter(q: Quarter) {
    const current = selectedQuarters ?? [];
    if (current.includes(q)) {
      setValue("quartersAffected", current.filter((x) => x !== q), {
        shouldValidate: true,
      });
    } else {
      setValue("quartersAffected", [...current, q], { shouldValidate: true });
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

      if (!res.ok) {
        throw new Error("Submission failed");
      }

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
        <Input
          id="name"
          placeholder="Your full name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Days of week */}
      <div className="space-y-1.5">
        <Label>Days of the Week</Label>
        <p className="text-xs text-gray-500">Which days do you have a conflict?</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {DAYS.map((day) => (
            <ToggleButton
              key={day}
              active={selectedDays?.includes(day) ?? false}
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

      {/* Time range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="timeStart">Start Time</Label>
          <Input id="timeStart" type="time" {...register("timeStart")} />
          {errors.timeStart && (
            <p className="text-sm text-red-500">{errors.timeStart.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timeEnd">End Time</Label>
          <Input id="timeEnd" type="time" {...register("timeEnd")} />
          {errors.timeEnd && (
            <p className="text-sm text-red-500">{errors.timeEnd.message}</p>
          )}
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-1.5">
        <Label htmlFor="reason">Activity / Reason</Label>
        <p className="text-xs text-gray-500">
          Describe your conflict (e.g., &quot;Basketball practice&quot;, &quot;Orchestra rehearsal&quot;)
        </p>
        <Textarea
          id="reason"
          rows={3}
          placeholder="Basketball practice, tennis matches, music rehearsal..."
          {...register("reason")}
        />
        {errors.reason && (
          <p className="text-sm text-red-500">{errors.reason.message}</p>
        )}
      </div>

      {/* Recurring */}
      <div className="space-y-1.5">
        <Label>Is this a recurring conflict?</Label>
        <div className="flex gap-3 mt-1">
          <Controller
            name="isRecurring"
            control={control}
            render={({ field }) => (
              <>
                <ToggleButton
                  active={field.value === true}
                  onClick={() => field.onChange(true)}
                >
                  Yes — recurring
                </ToggleButton>
                <ToggleButton
                  active={field.value === false}
                  onClick={() => field.onChange(false)}
                >
                  No — one-time
                </ToggleButton>
              </>
            )}
          />
        </div>
        {isRecurring && (
          <p className="text-xs text-[#5BA4CF] mt-1">
            Select the quarters below for which this conflict repeats.
          </p>
        )}
      </div>

      {/* Quarters affected */}
      <div className="space-y-1.5">
        <Label>Quarters Affected</Label>
        <p className="text-xs text-gray-500">
          Which quarters does this conflict apply to?
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {QUARTERS.map((q) => (
            <ToggleButton
              key={q}
              active={selectedQuarters?.includes(q) ?? false}
              onClick={() => toggleQuarter(q)}
            >
              {QUARTER_LABELS[q]}
            </ToggleButton>
          ))}
        </div>
        {errors.quartersAffected && (
          <p className="text-sm text-red-500">{errors.quartersAffected.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Submitting..." : "Submit Conflict"}
        </Button>
      </div>
    </form>
  );
}
