"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ROLES_PREVIEW = [
  { title: "President",        color: "bg-indigo-100 text-indigo-800" },
  { title: "Vice President(s)", color: "bg-violet-100 text-violet-800" },
  { title: "Project Lead",     color: "bg-emerald-100 text-emerald-800" },
  { title: "Competition Lead", color: "bg-amber-100 text-amber-800" },
  { title: "PR & Ops Manager", color: "bg-purple-100 text-purple-800" },
  { title: "Pit Crew",         color: "bg-slate-100 text-slate-700" },
];

const SCHEDULE = [
  { slot: "Lunch",        days: "Monday – Friday", note: "Every day" },
  { slot: "After School", days: "Monday & Friday", note: "Two days a week" },
];

export function HomeTabSection() {
  return (
    <section id="schedule" className="bg-indigo-50 py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <Tabs defaultValue="meetings">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="meetings" className="flex-1">Meetings</TabsTrigger>
            <TabsTrigger value="org"      className="flex-1">Org</TabsTrigger>
          </TabsList>

          {/* ── Meetings ── */}
          <TabsContent value="meetings">
            <ScrollReveal direction="place">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Weekly Schedule</h3>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full px-2.5 py-0.5">
                    Room 3-126
                  </span>
                </div>
                <div className="space-y-3">
                  {SCHEDULE.map((s) => (
                    <div key={s.slot} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-indigo-50/50 px-4 py-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium text-sm block">{s.slot}</span>
                        <span className="text-gray-500 text-xs">{s.days}</span>
                      </div>
                      <span className="ml-auto text-xs text-indigo-600 bg-indigo-100 rounded-full px-2.5 py-0.5">{s.note}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  All meetings are in Room 3-126. Drop in at lunch any day, or stay after school on Mondays and Fridays.
                </p>
              </div>
            </ScrollReveal>
          </TabsContent>

          {/* ── Org ── */}
          <TabsContent value="org">
            <ScrollReveal direction="place">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-4">
                  A lightweight matrix model — authority by decision type, not rank.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROLES_PREVIEW.map((r) => (
                    <div key={r.title} className={`rounded-xl px-3 py-2.5 text-xs font-semibold ${r.color}`}>
                      {r.title}
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <Link href="/org"><Button size="sm">View Full Org Chart →</Button></Link>
                </div>
              </div>
            </ScrollReveal>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
