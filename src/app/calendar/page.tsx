import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuarterCalendar } from "@/components/calendar/QuarterCalendar";
import { QUARTERS, formatQuarterDateRange, getMeetingDates } from "@/lib/calendar-data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meeting Calendar — Makerspace @ Suncoast",
};

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/images/StatGraphs.png"
          alt=""
          width={48}
          height={48}
          className="object-contain"
          aria-hidden="true"
        />
        <div>
          <h1 className="text-3xl font-bold text-indigo-600">Meeting Calendar</h1>
          <p className="text-gray-500">2026–2027 School Year — Meetings every Tuesday after school</p>
        </div>
      </div>

      {/* Quarter summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {QUARTERS.map((q, i) => {
          const count = getMeetingDates(q).length;
          return (
            <ScrollReveal key={q.id} direction="up" delay={i * 80}>
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 text-center">
                <p className="font-bold text-indigo-600 text-lg">{q.id}</p>
                <p className="text-xs text-gray-500">{count} meetings</p>
                <p className="text-xs text-gray-400 mt-1">
                  {q.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                  {q.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Quarter tabs */}
      <ScrollReveal direction="up" delay={100}>
      <Tabs defaultValue="Q1">
        <TabsList className="w-full sm:w-auto mb-6">
          {QUARTERS.map((q) => (
            <TabsTrigger key={q.id} value={q.id} className="flex-1 sm:flex-none">
              {q.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {QUARTERS.map((q) => (
          <TabsContent key={q.id} value={q.id}>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{q.label}:</span>{" "}
                {formatQuarterDateRange(q)}
              </p>
            </div>
            <QuarterCalendar quarter={q} />
          </TabsContent>
        ))}
      </Tabs>
      </ScrollReveal>

      <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-indigo-600 inline-block" />
          <span>Makerspace meeting (Tuesday)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-indigo-600 inline-block" />
          <span>Today</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Dates based on estimated Palm Beach County School District 2026-2027 calendar. Meetings skip holidays.
      </p>
    </div>
  );
}
