import type { Metadata } from "next";
import Image from "next/image";
import { StlViewer } from "@/components/progress/StlViewer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Progress — Makerspace @ Suncoast",
};

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-indigo-50">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-16">
        <ScrollReveal direction="up">
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">What We&apos;ve Built</span>
          <h1 className="text-4xl font-black text-gray-900 mt-1 mb-2">Member Progress</h1>
          <p className="text-gray-500 text-sm mb-10 max-w-xl">
            Real work from our members — from digital file to finished product. Every project here started as an idea at a Tuesday meeting.
          </p>
        </ScrollReveal>

        {/* ── Belt Holder ── */}
        <ScrollReveal direction="up">
          <section className="mb-14">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">Belt Holder</h2>
              <p className="text-sm text-gray-500 mt-0.5">Designed by Abhi · STL → 3D printed in PLA</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <StlViewer url="/models/stl/belt-holder.stl" color="#818cf8" height={320} label="STL file (digital)" />
                <p className="text-xs text-gray-400 text-center">Original CAD/STL design</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50" style={{ height: 320 }}>
                  <Image src="/images/real/belt-printed.jpg" alt="3D printed belt holder" fill className="object-contain" />
                </div>
                <p className="text-xs text-gray-400 text-center">Finished 3D print</p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Drone Chassis Evolution ── */}
        <ScrollReveal direction="up" delay={50}>
          <section className="mb-14">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">Drone Chassis — Design Evolution</h2>
              <p className="text-sm text-gray-500 mt-0.5">From V2 to V6.1 — iterating toward a lighter, stronger frame over multiple design cycles</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <StlViewer url="/models/stl/drone-chassis-v2.stl" color="#6366f1" height={320} label="V2 — initial design" />
                <p className="text-xs text-gray-400 text-center">Version 2 — where it started</p>
              </div>
              <div className="flex flex-col gap-2">
                <StlViewer url="/models/stl/drone-chassis-v6.stl" color="#a78bfa" height={320} label="V6.1 — refined" />
                <p className="text-xs text-gray-400 text-center">Version 6.1 — current build</p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Bionic Arm ── */}
        <ScrollReveal direction="up">
          <section className="mb-14">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">Bionic Arm</h2>
              <p className="text-sm text-gray-500 mt-0.5">A fully 3D-printed prosthetic arm — built and assembled by club members</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { src: "/images/real/bionic-arm-standalone.jpg", label: "Standalone" },
                { src: "/images/real/bionic-arm-on.jpg",         label: "Worn on limb" },
                { src: "/images/real/bionic-arm-top.jpg",        label: "Top view" },
                { src: "/images/real/bionic-arm-bottom.jpg",     label: "Bottom view" },
              ].map((img, i) => (
                <ScrollReveal key={img.src} direction="up" delay={i * 80}>
                  <div className="flex flex-col gap-1.5">
                    <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-white" style={{ paddingBottom: "100%" }}>
                      <Image src={img.src} alt={img.label} fill className="object-contain absolute inset-0" />
                    </div>
                    <p className="text-xs text-gray-400 text-center">{img.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ── RC Car ── */}
        <ScrollReveal direction="left">
          <section className="mb-14">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">RC Car Build</h2>
              <p className="text-sm text-gray-500 mt-0.5">A custom RC car built from scratch by club members</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white" style={{ paddingBottom: "56.25%" }}>
              <Image src="/images/real/rc-car.jpg" alt="RC car built by members" fill className="object-contain absolute inset-0" />
            </div>
          </section>
        </ScrollReveal>

        {/* ── Greenhouse STL ── */}
        <ScrollReveal direction="up">
          <section className="mb-4">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">Greenhouse Model</h2>
              <p className="text-sm text-gray-500 mt-0.5">3D modeled greenhouse — an ongoing design project</p>
            </div>
            <StlViewer url="/models/stl/greenhouse.stl" color="#34d399" height={340} label="Greenhouse STL" />
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
