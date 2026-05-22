import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";
import { getConflicts } from "@/lib/blob";

export const metadata: Metadata = {
  title: "Dashboard — Makerspace @ Suncoast",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const conflicts = await getConflicts();
  return <DashboardClient initialConflicts={conflicts} />;
}
