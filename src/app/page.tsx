import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QUARTERS, getMeetingDates } from "@/lib/calendar-data";
import { DroneFlightHero } from "@/components/hero/DroneFlightHero";
import { HomeTabSection } from "@/components/home/SchedulingHomeTab";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  const nextMeetings = QUARTERS.flatMap((q) => getMeetingDates(q))
    .filter((d) => d >= new Date())
    .slice(0, 3)
    .map((d) => ({
      iso: d.toISOString(),
      label: d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

  return (
    <div className="min-h-screen">

      {/* ── Hero: drone flight ── */}
      <DroneFlightHero />

      {/* ── What We Do ── */}
      <section className="py-14 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">What We Do</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">Learn by building real things</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
              Hands-on learning through real projects and collaborative builds.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                gradient: "from-blue-500 to-indigo-600",
                icon: "/images/laptop.png",
                title: "Electronics",
                desc: "Design and build circuits, from simple LEDs to complex microcontroller projects.",
                delay: 0,
              },
              {
                gradient: "from-purple-500 to-pink-600",
                icon: "/images/BasicCar.png",
                title: "Robotics",
                desc: "Program and assemble robots using Arduino, Raspberry Pi, and various sensors.",
                delay: 100,
              },
              {
                gradient: "from-emerald-500 to-cyan-600",
                icon: "/images/Gear1.png",
                title: "Programming",
                desc: "Learn coding through practical projects, from embedded systems to web development.",
                delay: 200,
              },
            ].map((card) => (
              <ScrollReveal key={card.title} delay={card.delay} direction="up">
                <div className={`rounded-2xl p-6 bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                  <div className="w-12 h-12 mb-4 flex items-center justify-center">
                    <Image src={card.icon} alt="" width={48} height={48} className="w-full h-full object-contain brightness-0 invert" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 3D Printing + Arduino highlight row */}
          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <ScrollReveal delay={0} direction="left">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 flex gap-4 h-full">
                <div className="text-3xl select-none flex-shrink-0">🖨️</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">3D Printing</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Turn digital designs into physical parts using FDM printers. Members go from CAD sketch to finished prototype in a single meeting — drone chassis, prosthetic arms, and more.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100} direction="right">
              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 flex gap-4 h-full">
                <div className="text-3xl select-none flex-shrink-0">⚡</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Arduino &amp; Microcontrollers</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Write C++ firmware that controls motors, reads sensors, and powers autonomous systems — from RC cars to robotic arms.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Real project photos — full images, no cropping */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { src: "/images/real/bionic-arm-on.jpg",         alt: "Bionic arm worn",    label: "Bionic Arm",  delay: 0 },
              { src: "/images/real/rc-car.jpg",                alt: "RC car build",        label: "RC Car Build", delay: 100 },
              { src: "/images/real/bionic-arm-standalone.jpg", alt: "Bionic arm standalone", label: "Arm V1",   delay: 200 },
            ].map((img) => (
              <ScrollReveal key={img.src} delay={img.delay} direction="up">
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                  <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                    <Image src={img.src} alt={img.alt} fill className="object-contain absolute inset-0" />
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-500">{img.label}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link href="/progress" className="text-sm text-indigo-600 hover:underline font-medium">
              See all member projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Resources: 3D Modeling + Competitions ── */}
      <section className="py-14 px-4 bg-indigo-950 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400">Resources</span>
            <h2 className="text-3xl font-black mt-1">Tools &amp; Competitions</h2>
            <p className="text-indigo-300/80 mt-2 text-sm max-w-md mx-auto">
              Platforms our members use to design, compete, and grow.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {/* 3D Modeling */}
            <ScrollReveal direction="left">
              <h3 className="font-bold text-indigo-300 uppercase text-xs tracking-widest mb-3">3D Modeling</h3>
              <div className="space-y-2">
                {[
                  { name: "Tinkercad",  url: "https://www.tinkercad.com",         desc: "Browser-based 3D design — great for beginners." },
                  { name: "Fusion 360", url: "https://www.autodesk.com/products/fusion-360", desc: "Professional CAD/CAM tool, free for students." },
                  { name: "Onshape",    url: "https://www.onshape.com",            desc: "Cloud-native parametric CAD, collaborative." },
                  { name: "Blender",    url: "https://www.blender.org",            desc: "Free and open source 3D creation suite." },
                ].map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors px-4 py-3 group">
                    <span className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors w-24 flex-shrink-0">{r.name}</span>
                    <span className="text-sm text-indigo-300/70">{r.desc}</span>
                  </a>
                ))}
              </div>
            </ScrollReveal>
            {/* Competitions */}
            <ScrollReveal direction="right" delay={100}>
              <h3 className="font-bold text-indigo-300 uppercase text-xs tracking-widest mb-3">Competitions</h3>
              <div className="space-y-2">
                {[
                  { name: "Devpost",         url: "https://devpost.com",             desc: "Hackathon platform — submit software and hardware projects." },
                  { name: "Science Olympiad", url: "https://www.soinc.org",           desc: "Team science & engineering events, national scope." },
                  { name: "SkillsUSA",       url: "https://www.skillsusa.org",        desc: "STEM career competitions for high school students." },
                  { name: "FIRST Robotics",  url: "https://www.firstinspires.org",    desc: "The premier high school robotics competition." },
                  { name: "HeroX",           url: "https://www.herox.com",            desc: "Crowdsourced innovation challenges with prizes." },
                ].map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors px-4 py-3 group">
                    <span className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors w-28 flex-shrink-0">{r.name}</span>
                    <span className="text-sm text-indigo-300/70">{r.desc}</span>
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 3-tab section: Conflict / Calendar / Org ── */}
      <HomeTabSection nextMeetings={nextMeetings} />

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-400 py-12 px-4 text-center text-white">
        <div className="mx-auto max-w-xl">
          <Image
            src="/images/makerspaceLogo.png"
            alt="Makerspace logo"
            width={1610}
            height={741}
            className="h-20 w-auto object-contain mx-auto mb-4 drop-shadow-lg"
          />
          <h2 className="text-2xl font-black mb-2">Ready to Build Something?</h2>
          <p className="mb-6 opacity-90 text-sm">
            A student-run makerspace at Suncoast Community High School — every Tuesday after school.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/calendar">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">View Calendar</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/15">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Credits */}
      <section className="bg-gray-950 py-4 px-4">
        <div className="mx-auto max-w-5xl text-center space-y-1.5">
          <p className="text-[12px] text-gray-300 font-medium tracking-wide">
            Website designed &amp; built by <span className="text-white font-semibold">Diego Diaz Limon</span>
          </p>
          <div className="w-16 h-px bg-gray-700 mx-auto" />
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <span className="text-gray-400 font-medium">3D assets — </span>
            <a href="https://skfb.ly/o7wqF" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">
              &ldquo;Intercity 125 Executive with Buffers&rdquo;
            </a>
            {" "}by <span className="text-gray-400">timblewee</span> is licensed under{" "}
            <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">
              CC BY 4.0
            </a>
            . Background removed for web use.
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <span className="text-gray-400">&ldquo;Flying Drone&rdquo;</span>
            {" "}by <span className="text-gray-400">Chistodrako._.</span> on Sketchfab. Background removed for web use.
          </p>
        </div>
      </section>
    </div>
  );
}
