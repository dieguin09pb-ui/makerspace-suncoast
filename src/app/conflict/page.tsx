import Image from "next/image";
import { ConflictForm } from "@/components/conflict/ConflictForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a Conflict — Makerspace @ Suncoast",
};

export default function ConflictPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/images/Clipboard.png"
          alt=""
          width={48}
          height={48}
          className="object-contain"
          aria-hidden="true"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#5BA4CF]">Report a Scheduling Conflict</h1>
          <p className="text-gray-500">Let us know when you cannot attend</p>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 mb-8 rounded-xl bg-[#F0F7FF] border border-[#93C5FD]/50 px-5 py-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          Makerspace meets every <strong>Tuesday after school</strong>. If you
          have a recurring activity — sports, music, academic program — please
          fill out this form so the club leadership can plan meetings that
          maximize attendance. Your data will appear on the dashboard to help
          us find the best schedule for every quarter.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Example: A basketball player could submit Tuesdays and Thursdays,
          3:30–6:00 PM, recurring throughout Q2 and Q3.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <ConflictForm />
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Submitted information is used only for scheduling purposes within the Makerspace club.
      </p>
    </div>
  );
}
