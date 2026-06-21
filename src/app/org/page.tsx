import { RolesSection } from "@/components/roles/RolesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Org Structure — Makerspace @ Suncoast",
};

export default function OrgPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">Organization</span>
        <h1 className="text-4xl font-black text-gray-900 mt-1 mb-1">Club Structure</h1>
        <p className="text-gray-500 text-sm mb-2">
          How MakerSpace @ Suncoast is organized — roles, responsibilities, and authority.
        </p>
      </div>
      <RolesSection hideHeader />
    </div>
  );
}
