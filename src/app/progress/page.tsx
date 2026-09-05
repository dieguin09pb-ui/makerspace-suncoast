import type { Metadata } from "next";
import Image from "next/image";
import { StlViewer } from "@/components/progress/StlViewer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Progress | Makerspace @ Suncoast",
};

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-indigo-50">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-16">
        <ScrollReveal direction="up">
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">What We&apos;ve Built</span>
          <h1 className="text-4xl font-black text-gray-900 mt-1 mb-2">Member Progress</h1>
          <p className="text-gray-500 text-sm mb-10 max-w-xl">
            Real work from our members, from digital file to finished product. Every project here started as an idea at a lunch meeting.
          </p>
        </ScrollReveal>

        {/* ---- MPFI Project 1: Microscope Stage Lift ---- */}
        <ScrollReveal direction="up">
          <section className="mb-14">
            <div className="mb-3">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-indigo-500">MPFI · Project 1</span>
              <h2 className="text-2xl font-black text-gray-900">Microscope Stage-Assisted Lift</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                A gas-spring assisted lift that raises the stage of a Zeiss LSM 980 confocal microscope for
                objective access. Designed in SolidWorks on T-slotted framing with a linear guide rail and
                locking sleeve-bearing carriage.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              {[
                { src: "/images/real/mpfi-stage-measure.jpg",   label: "Measuring stage travel on the optical table" },
                { src: "/images/real/mpfi-objective-turret.jpg", label: "Objective turret the lift has to clear" },
                { src: "/images/real/mpfi-stage-clearance.jpg",  label: "Stage clearance above the nosepiece" },
              ].map((img, i) => (
                <ScrollReveal key={img.src} direction="up" delay={i * 80}>
                  <div className="flex flex-col gap-1.5">
                    <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-white" style={{ paddingBottom: "75%" }}>
                      <Image src={img.src} alt={img.label} fill className="object-cover absolute inset-0" />
                    </div>
                    <p className="text-xs text-gray-400 text-center">{img.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  rev: "Assembly 1",
                  when: "June",
                  body: "First concept: a gear-driven lift on a 250 mm guide rail, with custom gussets and under-rails around off-the-shelf hardware.",
                },
                {
                  rev: "Assembly 2",
                  when: "July",
                  body: "Gears dropped for a gas spring. Stage plate, carriage front and rail mounts redesigned around T-slotted framing and corner brackets.",
                },
                {
                  rev: "Assembly 3",
                  when: "Late July",
                  body: "Final build: reworked gas spring, aluminum spacers and shoulder screws, knurled-grip knob, and the Zeiss 10x objective modeled in for clearance checks.",
                },
              ].map((v, i) => (
                <ScrollReveal key={v.rev} direction="up" delay={i * 80}>
                  <div className="h-full rounded-xl border border-indigo-100 bg-white p-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-sm font-bold text-gray-900">{v.rev}</h3>
                      <span className="text-[10px] uppercase tracking-wide text-indigo-400">{v.when}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ---- MPFI Project 1: the finished assembly ---- */}
        <ScrollReveal direction="up">
          <section className="mb-14">
            <div className="mb-3">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-indigo-500">MPFI &middot; Project 1</span>
              <h2 className="text-2xl font-black text-gray-900">The Finished Assembly, In Context</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Every part in one model. The lift is the actual project; the microscope around it was modelled
                purely as reference, so you can see exactly how the lift mounts to the real instrument.
              </p>
            </div>
            <StlViewer
              url="/models/lift-assembly.glb"
              color="#c8ccd8"
              height={440}
              label="LSM980 stage-assisted lift, full assembly"
            />
            <p className="text-xs text-gray-400 text-center mt-2">
              535,824 triangles, 300 x 361 x 505 mm. Drag to rotate, scroll to zoom.
            </p>
          </section>
        </ScrollReveal>

        {/* ---- MPFI Project 1: Assembly 1 hardware ---- */}
        <ScrollReveal direction="up">
          <section className="mb-14">
            <div className="mb-3">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-indigo-500">MPFI &middot; Project 1</span>
              <h2 className="text-2xl font-black text-gray-900">Assembly 1 Hardware</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                The off-the-shelf drive and motion components the first gear-driven concept was built around.
                These are the McMaster-Carr catalog models that were mated into the Assembly 1 SolidWorks file,
                shown here at their real dimensions. Drag any of them to rotate.
              </p>
            </div>
            {/* Flex rather than grid so the trailing row of 3 centres itself
                instead of hanging off the left edge. */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { url: "/models/stl/lift-carriage-3249k3.stl",     color: "#818cf8", name: "Bearing carriage",   dim: "80 x 25 x 87 mm" },
                { url: "/models/stl/lift-guide-rail-9867k134.stl", color: "#6366f1", name: "Guide rail",         dim: "250 x 31 x 19 mm" },
                { url: "/models/stl/lift-gear-3598n159.stl",       color: "#a78bfa", name: "High-power gear",    dim: "22 x 22 x 18 mm" },
                { url: "/models/stl/lift-gear-3598n264.stl",       color: "#c4b5fd", name: "High-power gear",    dim: "98 x 15 x 8 mm" },
                { url: "/models/stl/lift-gear-2664n11.stl",        color: "#34d399", name: "Spur gear, 20 deg",  dim: "31 x 18 x 17 mm" },
                { url: "/models/stl/lift-gear-2664n475.stl",       color: "#5eead4", name: "Spur gear, 20 deg",  dim: "25 x 25 x 14 mm" },
                { url: "/models/stl/lift-knob-62195k34.stl",       color: "#fbbf24", name: "Ball knob",          dim: "17 x 17 x 17 mm" },
              ].map((m, i) => (
                <ScrollReveal
                  key={m.url}
                  direction="up"
                  delay={Math.min(i * 60, 300)}
                  className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)]"
                >
                  <div className="flex flex-col gap-2">
                    <StlViewer url={m.url} color={m.color} height={200} label={m.name} />
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">{m.name}</p>
                      <p className="text-[11px] text-gray-400">{m.dim}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ---- MPFI Project 2: Light Box Enclosure ---- */}
        <ScrollReveal direction="up">
          <section className="mb-14">
            <div className="mb-3">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-indigo-500">MPFI · Project 2</span>
              <h2 className="text-2xl font-black text-gray-900">Light Box Enclosure</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                A light-tight enclosure with magnetic doors and sliding panels. V1 was a full SolidWorks
                assembly; V2 added the manufacturing files: DXFs for the laser-cut panels and STLs for the
                printed rails and mounts below.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { url: "/models/stl/lightbox-rail.stl",           color: "#6366f1", label: "Rail" },
                { url: "/models/stl/lightbox-bottom-rail.stl",    color: "#818cf8", label: "Bottom rail" },
                { url: "/models/stl/lightbox-panel-mount.stl",    color: "#a78bfa", label: "Panel mount" },
                { url: "/models/stl/lightbox-wall-mag-mount.stl", color: "#34d399", label: "Wall magnet mount" },
              ].map((m, i) => (
                <ScrollReveal key={m.url} direction="up" delay={i * 80}>
                  <div className="flex flex-col gap-2">
                    <StlViewer url={m.url} color={m.color} height={220} label={m.label} />
                    <p className="text-xs text-gray-400 text-center">{m.label}, V2 print file</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ---- Belt Holder ---- */}
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

        {/* ---- Drone Chassis Evolution ---- */}
        <ScrollReveal direction="up" delay={50}>
          <section className="mb-14">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">Drone Chassis Design Evolution</h2>
              <p className="text-sm text-gray-500 mt-0.5">From V2 to V6.1, iterating toward a lighter, stronger frame over multiple design cycles</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <StlViewer url="/models/stl/drone-chassis-v2.stl" color="#6366f1" height={320} label="V2, initial design" />
                <p className="text-xs text-gray-400 text-center">Version 2, where it started</p>
              </div>
              <div className="flex flex-col gap-2">
                <StlViewer url="/models/stl/drone-chassis-v6.stl" color="#a78bfa" height={320} label="V6.1, refined" />
                <p className="text-xs text-gray-400 text-center">Version 6.1, current build</p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ---- Bionic Arm ---- */}
        <ScrollReveal direction="up">
          <section className="mb-14">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">Bionic Arm</h2>
              <p className="text-sm text-gray-500 mt-0.5">A fully 3D-printed prosthetic arm, built and assembled by club members</p>
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

        {/* ---- RC Car ---- */}
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

        {/* ---- Greenhouse STL ---- */}
        <ScrollReveal direction="up">
          <section className="mb-4">
            <div className="mb-3">
              <h2 className="text-2xl font-black text-gray-900">Greenhouse Model</h2>
              <p className="text-sm text-gray-500 mt-0.5">3D modeled greenhouse, an ongoing design project</p>
            </div>
            <StlViewer url="/models/stl/greenhouse.stl" color="#34d399" height={340} label="Greenhouse STL" />
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
