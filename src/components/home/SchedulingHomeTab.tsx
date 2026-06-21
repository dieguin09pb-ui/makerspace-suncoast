"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConflictForm } from "@/components/conflict/ConflictForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Meeting { iso: string; label: string; }

const ROLES_PREVIEW = [
  { title: "President",        color: "bg-indigo-100 text-indigo-800" },
  { title: "Vice President(s)", color: "bg-violet-100 text-violet-800" },
  { title: "Project Lead",     color: "bg-emerald-100 text-emerald-800" },
  { title: "Competition Lead", color: "bg-amber-100 text-amber-800" },
  { title: "PR & Ops Manager", color: "bg-purple-100 text-purple-800" },
  { title: "Pit Crew",         color: "bg-slate-100 text-slate-700" },
];

export function HomeTabSection({ nextMeetings }: { nextMeetings: Meeting[] }) {
  return (
    <section id="schedule" className="bg-indigo-50 py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <Tabs defaultValue="calendar">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="calendar" className="flex-1">Calendar</TabsTrigger>
            <TabsTrigger value="org"      className="flex-1">Org</TabsTrigger>
            <TabsTrigger value="conflict" className="flex-1">Conflict</TabsTrigger>
          </TabsList>

          {/* ── Calendar ── */}
          <TabsContent value="calendar">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Upcoming Meetings</h3>
              {nextMeetings.length === 0 ? (
                <p className="text-sm text-gray-400">No upcoming meetings found.</p>
              ) : (
                <div className="space-y-3">
                  {nextMeetings.map((m) => (
                    <div key={m.iso} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-indigo-50/50 px-4 py-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-sm">{m.label}</span>
                      <span className="ml-auto text-xs text-indigo-600 bg-indigo-100 rounded-full px-2.5 py-0.5">After School</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-5">
                <Link href="/calendar"><Button size="sm">View Full Calendar →</Button></Link>
              </div>
            </div>
          </TabsContent>

          {/* ── Org ── */}
          <TabsContent value="org">
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
          </TabsContent>

          {/* ── Conflict ── */}
          <TabsContent value="conflict">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-5">
                We meet every <strong>Tuesday after school</strong>. Have a recurring activity? Submit it so leadership can plan around you.
              </p>
              <ConflictForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
