"use client";

import React, { useEffect, useRef } from "react";

function DroneViewer({ cameraOrbit = "30deg 75deg 2.5m" }: { cameraOrbit?: string }) {
  return React.createElement("model-viewer", {
    src: "/models/flying-drone.glb",
    alt: "Flying drone",
    "auto-rotate": true,
    "rotation-per-second": "25deg",
    "auto-rotate-delay": 0,
    "camera-orbit": cameraOrbit,
    exposure: "1.3",
    "shadow-intensity": "0",
    loading: "eager",
    style: {
      width: "300px",
      height: "240px",
      background: "transparent",
      "--poster-color": "transparent",
      "--progress-bar-color": "transparent",
      "--progress-bar-height": "0px",
      display: "block",
    } as React.CSSProperties,
  });
}

function TrainViewer() {
  return React.createElement("model-viewer", {
    src: "/models/train.glb",
    alt: "Intercity 125 train",
    "camera-orbit": "90deg 88deg 10m",
    exposure: "1.5",
    "shadow-intensity": "0",
    loading: "eager",
    style: {
      width: "700px",
      height: "180px",
      background: "transparent",
      "--poster-color": "transparent",
      filter: "grayscale(1) brightness(2.5) contrast(0.55)",
    } as React.CSSProperties,
  });
}

export function DroneFlightHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const droneRef    = useRef<HTMLDivElement>(null);
  const pathRef     = useRef<SVGPathElement>(null);
  const drone2Ref   = useRef<HTMLDivElement>(null);
  const path2Ref    = useRef<SVGPathElement>(null);
  const trainRef    = useRef<HTMLDivElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const panel1Ref   = useRef<HTMLDivElement>(null);
  const panel2Ref   = useRef<HTMLDivElement>(null);
  const panel3Ref   = useRef<HTMLDivElement>(null);
  const orb1Ref     = useRef<HTMLDivElement>(null);
  const orb2Ref     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("@google/model-viewer");

    let gsapCtx: ReturnType<typeof import("gsap")["default"]["context"]> | undefined;
    let introRaf: number;
    let unlockScroll = () => {};

    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger }   = await import("gsap/ScrollTrigger");
      const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;

      svgRef.current?.setAttribute("viewBox", `0 0 ${w} ${h}`);

      // ── Scale drones on mobile ───────────────────────────────────────
      if (isMobile) {
        const mv1 = droneRef.current?.querySelector("model-viewer") as HTMLElement | null;
        const mv2 = drone2Ref.current?.querySelector("model-viewer") as HTMLElement | null;
        if (mv1) { mv1.style.width = "200px"; mv1.style.height = "160px"; }
        if (mv2) { mv2.style.width = "200px"; mv2.style.height = "160px"; }
        gsap.set([droneRef.current, drone2Ref.current], {
          scale: 0.75,
          transformOrigin: "center center",
        });
      }

      // ── Flight paths ─────────────────────────────────────────────────
      pathRef.current?.setAttribute("d",
        `M ${w * 0.03},${h * 0.96}` +
        ` C ${w * 0.12},${h * 0.88} ${w * 0.28},${h * 0.82} ${w * 0.44},${h * 0.80}` +
        ` S ${w * 0.62},${h * 0.76} ${w * 0.70},${h * 0.65}` +
        ` S ${w * 0.83},${h * 0.32} ${w * 0.92},${h * 0.12}` +
        ` L ${w * 1.15},${h * -0.05}`
      );

      path2Ref.current?.setAttribute("d",
        `M ${w * 1.08},${h * 0.18}` +
        ` C ${w * 0.88},${h * 0.12} ${w * 0.72},${h * 0.10} ${w * 0.58},${h * 0.16}` +
        ` S ${w * 0.38},${h * 0.22} ${w * 0.22},${h * 0.26}` +
        ` S ${w * 0.10},${h * 0.32} ${w * -0.06},${h * 0.38}`
      );

      // ── Reveal each drone only once its model-viewer has fully loaded ──
      const revealOnLoad = (wrapperRef: React.RefObject<HTMLDivElement | null>) => {
        const mv = wrapperRef.current?.querySelector("model-viewer") as HTMLElement | null;
        if (!mv) return;
        const reveal = () =>
          gsap.to(wrapperRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });
        mv.addEventListener("load", reveal, { once: true });
        // Fallback: reveal after 5s if the load event never fires (e.g. cached)
        setTimeout(() => {
          const el = wrapperRef.current;
          if (el && parseFloat(window.getComputedStyle(el).opacity) < 0.5) reveal();
        }, 5000);
      };

      gsapCtx = gsap.context(() => {

        // ── Drone 1 ───────────────────────────────────────────────────
        gsap.set(droneRef.current, { opacity: 0 });
        gsap.to(droneRef.current, {
          motionPath: {
            path: pathRef.current!,
            align: pathRef.current!,
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
          },
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom bottom", scrub: 2 },
          ease: "none",
          force3D: true,
        });

        // ── Drone 2 ───────────────────────────────────────────────────
        gsap.set(drone2Ref.current, { opacity: 0 });
        gsap.to(drone2Ref.current, {
          motionPath: {
            path: path2Ref.current!,
            align: path2Ref.current!,
            autoRotate: false,
            alignOrigin: [0.5, 0.5],
          },
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom bottom", scrub: 2 },
          ease: "none",
          force3D: true,
        });

        // ── Train ─────────────────────────────────────────────────────
        gsap.set(trainRef.current, { x: w * 1.15, opacity: 0 });
        gsap.to(trainRef.current, {
          opacity: 1,
          scrollTrigger: { trigger: containerRef.current, start: "44% top", end: "50% top", scrub: 1 },
        });
        gsap.to(trainRef.current, {
          x: -w * 1.5,
          scrollTrigger: { trigger: containerRef.current, start: "45% top", end: "96% top", scrub: 2 },
          ease: "none",
        });

        // ── Parallax orbs ─────────────────────────────────────────────
        gsap.to(orb1Ref.current, {
          y: "-30%",
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });
        gsap.to(orb2Ref.current, {
          y: "-18%", x: "6%",
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom bottom", scrub: 1.5 },
        });

        // ── Text panels ───────────────────────────────────────────────
        gsap.fromTo(panel1Ref.current, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: containerRef.current, start: "3% top", end: "14% top", scrub: 1.5 },
        });
        gsap.to(panel1Ref.current, {
          opacity: 0, y: -20,
          scrollTrigger: { trigger: containerRef.current, start: "36% top", end: "50% top", scrub: 2 },
        });

        gsap.fromTo(panel2Ref.current, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: containerRef.current, start: "50% top", end: "60% top", scrub: 1.5 },
        });
        gsap.to(panel2Ref.current, {
          opacity: 0, y: -20,
          scrollTrigger: { trigger: containerRef.current, start: "72% top", end: "82% top", scrub: 2 },
        });

        gsap.fromTo(panel3Ref.current, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: containerRef.current, start: "82% top", end: "92% top", scrub: 1.5 },
        });

      }, containerRef);

      // Trigger drone reveals (after scroll triggers are set up)
      revealOnLoad(droneRef);
      revealOnLoad(drone2Ref);

      // ── Intro: lock scroll and auto-play the full animation over 2 s ──
      const container = containerRef.current;
      if (!container) return;

      const scrollStart = container.offsetTop;
      const scrollRange = container.offsetHeight - window.innerHeight;
      const INTRO_MS    = 2000;
      const startTime   = performance.now();

      // Prevent all user-initiated scrolling during the intro
      const blockWheel   = (e: Event)       => e.preventDefault();
      const blockTouch   = (e: Event)       => e.preventDefault();
      const blockKeys    = (e: KeyboardEvent) => {
        if (["ArrowDown","ArrowUp","Space","PageDown","PageUp","Home","End"].includes(e.key)) {
          e.preventDefault();
        }
      };
      window.addEventListener("wheel",     blockWheel, { passive: false });
      window.addEventListener("touchmove", blockTouch, { passive: false });
      window.addEventListener("keydown",   blockKeys);

      unlockScroll = () => {
        window.removeEventListener("wheel",     blockWheel);
        window.removeEventListener("touchmove", blockTouch);
        window.removeEventListener("keydown",   blockKeys);
      };

      const scrollRAF = (now: number) => {
        const t     = Math.min((now - startTime) / INTRO_MS, 1);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; // easeInOutCubic
        window.scrollTo(0, scrollStart + scrollRange * eased);
        if (t < 1) {
          introRaf = requestAnimationFrame(scrollRAF);
        } else {
          unlockScroll();
        }
      };
      introRaf = requestAnimationFrame(scrollRAF);
    };

    init();
    return () => {
      gsapCtx?.revert();
      cancelAnimationFrame(introRaf);
      unlockScroll();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[180vh] md:h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950">

        {/* Depth orbs */}
        <div ref={orb1Ref} className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500/25 blur-3xl will-change-transform pointer-events-none" />
        <div ref={orb2Ref} className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl will-change-transform pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none" />

        {/* SVG flight paths */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path ref={pathRef}  d="" fill="none" stroke="none" />
          <path ref={path2Ref} d="" fill="none" stroke="none" />
        </svg>

        {/* Drone 1 — hidden until model-viewer fires load */}
        <div ref={droneRef} className="absolute will-change-transform" style={{ opacity: 0, top: 0, left: 0 }}>
          <div className="absolute inset-0 -z-10 blur-2xl bg-indigo-400/30 rounded-full scale-[1.8] pointer-events-none" />
          <DroneViewer cameraOrbit="30deg 75deg 2.5m" />
        </div>

        {/* Drone 2 — hidden until model-viewer fires load */}
        <div ref={drone2Ref} className="absolute will-change-transform" style={{ opacity: 0, top: 0, left: 0 }}>
          <div className="absolute inset-0 -z-10 blur-2xl bg-violet-400/25 rounded-full scale-[1.8] pointer-events-none" />
          <DroneViewer cameraOrbit="210deg 75deg 2.5m" />
        </div>

        {/* Train — right→left along the bottom */}
        <div ref={trainRef} className="absolute will-change-transform pointer-events-none" style={{ bottom: "8%", left: 0 }}>
          <TrainViewer />
        </div>

        {/* Text panel 1 */}
        <div ref={panel1Ref} className="absolute inset-0 flex items-center justify-start px-8 md:px-20 pointer-events-none" style={{ opacity: 0 }}>
          <div className="max-w-xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
              Build.<br />Create.<br /><span className="text-indigo-300">Innovate.</span>
            </h1>
          </div>
        </div>

        {/* Text panel 2 */}
        <div ref={panel2Ref} className="absolute inset-0 flex items-center justify-end px-8 md:px-20 pointer-events-none" style={{ opacity: 0 }}>
          <div className="max-w-md text-right">
            <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed">
              Where ideas come to life through electronics, robotics, and hands-on engineering.
            </p>
            <div className="mt-4 w-16 h-0.5 bg-indigo-400 ml-auto" />
          </div>
        </div>

        {/* Text panel 3 */}
        <div ref={panel3Ref} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
          <div className="text-center px-4">
            <p className="text-4xl md:text-6xl font-black text-white">By Students.</p>
            <p className="text-4xl md:text-6xl font-black text-indigo-300">For Students.</p>
            <p className="text-base md:text-lg text-white/60 mt-5 max-w-sm mx-auto leading-relaxed">
              Suncoast Community High School&apos;s student-run electronics club —
              where anyone can pick up an Arduino and build something.
            </p>
          </div>
        </div>

        {/* Train tracks */}
        <svg
          className="absolute w-full pointer-events-none"
          style={{ bottom: "calc(8% + 8px)", height: "70px" }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect x="0" y={3}  width="100%" height={3} fill="white" fillOpacity={0.25} rx={1} />
          <rect x="0" y={20} width="100%" height={8} fill="white" fillOpacity={0.88} rx={1} />
          <rect x="0" y={28} width="100%" height={5} fill="white" fillOpacity={0.5} />
          <rect x="0" y={33} width="100%" height={4} fill="white" fillOpacity={0.7} rx={1} />
          {Array.from({ length: 52 }, (_, i) => (
            <rect key={i} x={`${i * 1.96}%`} y={37} width="0.85%" height={16} fill="white" fillOpacity={0.22} rx={1} />
          ))}
          <rect x="0" y={54} width="100%" height={2} fill="white" fillOpacity={0.12} />
        </svg>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs tracking-widest uppercase pointer-events-none select-none">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
