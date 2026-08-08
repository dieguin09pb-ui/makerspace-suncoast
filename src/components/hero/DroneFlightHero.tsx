"use client";

import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────
type Size = "small" | "medium" | "large" | "xlarge" | "stack";
type ContentKind = "image" | "text";

interface Slot {
  id: number;
  cx: number;
  cy: number;
  size: Size;
  kind: ContentKind;
  contentIdx: number;
  visible: boolean;
}

// ── Content pools ─────────────────────────────────────────────────────────────
const IMAGES = [
  { src: "/images/real/bionic-arm-on.jpg",         label: "Bionic Arm",      rotate: "-3deg"   },
  { src: "/images/real/rc-car.jpg",                label: "RC Car Build",    rotate: "2deg"    },
  { src: "/images/real/bionic-arm-standalone.jpg", label: "Arm V1",          rotate: "-1.5deg" },
  { src: "/images/real/belt-printed.jpg",          label: "3D Printed Part", rotate: "1.5deg"  },
  { src: "/images/real/bionic-arm-top.jpg",        label: "Arm Detail",      rotate: "-2deg"   },
  { src: "/images/real/bionic-arm-bottom.jpg",     label: "Arm Base",        rotate: "2.5deg"  },
];

type TextVariant = "headline" | "subhead" | "byStudents" | "stat" | "location" | "tags" | "meeting" | "tagline";
const TEXT_VARIANTS: TextVariant[] = ["headline", "subhead", "byStudents", "stat", "location", "tags", "meeting", "tagline"];

// ── Size system ────────────────────────────────────────────────────────────────
const DIMS: Record<Size, { w: number; h: number }> = {
  small:  { w: 145, h: 108 },
  medium: { w: 215, h: 162 },
  large:  { w: 272, h: 203 },
  xlarge: { w: 430, h: 324 },
  stack:  { w: 430, h: 240 },  // xlarge width, max height that keeps both stacked cards above the rails
};

interface CycleItem { kind: ContentKind; contentIdx: number; }
interface Cycle {
  a: CycleItem;
  b: CycleItem;
  c?: CycleItem;        // third slot used in "stacked" layout (image on right)
  layout?: "stacked";   // two texts left-stacked + image right
}

// ── Ambient content cycles ────────────────────────────────────────────────────
// "stacked": a = upper-left text, b = lower-left text, c = right image (as normal)
// default:   a = left, b = right (standard side-by-side)
const CYCLES: Cycle[] = [
  // ── original 14 ──
  { a: { kind: "image", contentIdx: 0 }, b: { kind: "text",  contentIdx: 0 } },
  { a: { kind: "text",  contentIdx: 2 }, b: { kind: "image", contentIdx: 1 } },
  { a: { kind: "text",  contentIdx: 0 }, b: { kind: "text",  contentIdx: 6 }, c: { kind: "image", contentIdx: 2 }, layout: "stacked" },
  { a: { kind: "image", contentIdx: 2 }, b: { kind: "text",  contentIdx: 3 } },
  { a: { kind: "text",  contentIdx: 1 }, b: { kind: "image", contentIdx: 3 } },
  { a: { kind: "text",  contentIdx: 4 }, b: { kind: "text",  contentIdx: 7 }, c: { kind: "image", contentIdx: 5 }, layout: "stacked" },
  { a: { kind: "image", contentIdx: 4 }, b: { kind: "text",  contentIdx: 4 } },
  { a: { kind: "text",  contentIdx: 5 }, b: { kind: "image", contentIdx: 5 } },
  { a: { kind: "text",  contentIdx: 7 }, b: { kind: "text",  contentIdx: 2 }, c: { kind: "image", contentIdx: 4 }, layout: "stacked" },
  { a: { kind: "image", contentIdx: 1 }, b: { kind: "text",  contentIdx: 6 } },
  { a: { kind: "text",  contentIdx: 0 }, b: { kind: "image", contentIdx: 4 } },
  { a: { kind: "image", contentIdx: 3 }, b: { kind: "text",  contentIdx: 1 } },
  { a: { kind: "text",  contentIdx: 3 }, b: { kind: "image", contentIdx: 0 } },
  { a: { kind: "image", contentIdx: 5 }, b: { kind: "text",  contentIdx: 5 } },
  // ── 10 new ──
  { a: { kind: "image", contentIdx: 3 }, b: { kind: "text",  contentIdx: 5 } },
  { a: { kind: "text",  contentIdx: 6 }, b: { kind: "image", contentIdx: 2 } },
  { a: { kind: "text",  contentIdx: 1 }, b: { kind: "text",  contentIdx: 4 }, c: { kind: "image", contentIdx: 0 }, layout: "stacked" },
  { a: { kind: "image", contentIdx: 0 }, b: { kind: "text",  contentIdx: 2 } },
  { a: { kind: "text",  contentIdx: 3 }, b: { kind: "image", contentIdx: 1 } },
  { a: { kind: "text",  contentIdx: 3 }, b: { kind: "text",  contentIdx: 5 }, c: { kind: "image", contentIdx: 3 }, layout: "stacked" },
  { a: { kind: "image", contentIdx: 4 }, b: { kind: "text",  contentIdx: 6 } },
  { a: { kind: "text",  contentIdx: 2 }, b: { kind: "image", contentIdx: 3 } },
  { a: { kind: "text",  contentIdx: 6 }, b: { kind: "text",  contentIdx: 7 }, c: { kind: "image", contentIdx: 1 }, layout: "stacked" },
  { a: { kind: "image", contentIdx: 5 }, b: { kind: "text",  contentIdx: 0 } },
];

// ── Catmull-Rom spline ─────────────────────────────────────────────────────────
function catmullRom(pts: Array<{ x: number; y: number }>): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(pts.length - 1, i + 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

// Drone A: blasts up to the top zone immediately after entering, then S-curves through the
//           upper 8–22% of ch. Stays HIGH for the whole on-screen flight.
// Drone B: enters mid-right and stays in the lower 32–52% zone — opposite S direction.
//           The two drones occupy clearly different vertical bands so they don't overlap
//           in the middle. A (z-20) briefly crosses in front of B (z-15) during entry.
// A uses autoRotate:true (ltr). B uses autoRotate:false (prevents upside-down on rtl path).
function buildDronePathA(cw: number, ch: number): string {
  return catmullRom([
    { x: -260,       y: ch * 0.60 },  // off-screen bottom-left
    { x: cw * 0.06,  y: ch * 0.42 },  // first on-screen (bottom≈42%*720+108=410<523 ✓)
    { x: cw * 0.14,  y: ch * 0.16 },  // FAST RISE into upper zone
    { x: cw * 0.26,  y: ch * 0.08 },  // PEAK (near top of screen)
    { x: cw * 0.40,  y: ch * 0.14 },  // slight dip — first curve of upper S
    { x: cw * 0.54,  y: ch * 0.22 },  // VALLEY of upper S (still well above rails)
    { x: cw * 0.67,  y: ch * 0.14 },  // rising back up
    { x: cw * 0.82,  y: ch * 0.08 },  // near peak heading to exit
    { x: cw + 260,   y: ch * 0.08 },  // exit top-right
  ]);
}

// B: enters mid-right, dips DOWN (opposite direction from A), then sweeps UP and back.
// S-range: 30–52% of ch = ~158px of vertical movement. Clearly in the lower band.
function buildDronePathB(cw: number, ch: number): string {
  return catmullRom([
    { x: cw + 260,   y: ch * 0.40 },  // off-screen mid-right
    { x: cw * 0.92,  y: ch * 0.38 },  // entering mid level
    { x: cw * 0.78,  y: ch * 0.48 },  // DIP — opposite of A shooting up
    { x: cw * 0.64,  y: ch * 0.52 },  // LOWEST POINT (bottom≈52%*720+85=374+85=459<523 ✓)
    { x: cw * 0.50,  y: ch * 0.46 },  // coming back up
    { x: cw * 0.36,  y: ch * 0.34 },  // RISE above entry level (opposite of A's valley)
    { x: cw * 0.24,  y: ch * 0.30 },  // PEAK for B (highest B gets)
    { x: cw * 0.14,  y: ch * 0.36 },  // slight dip back
    { x: -260,        y: ch * 0.38 },  // exit mid-left
  ]);
}

// ── Model viewers ──────────────────────────────────────────────────────────────
function DroneViewer({ flip }: { flip: boolean }) {
  return React.createElement("model-viewer", {
    src: "/models/flying-drone.glb",
    alt: "Flying drone",
    "auto-rotate": true,
    "rotation-per-second": "90deg",
    "auto-rotate-delay": 0,
    "camera-orbit": flip ? "210deg 75deg 2.5m" : "30deg 75deg 2.5m",
    exposure: "1.3",
    "shadow-intensity": "0",
    loading: "eager",
    style: {
      width: "220px",
      height: "170px",
      background: "transparent",
      "--poster-color": "transparent",
      "--progress-bar-color": "transparent",
      "--progress-bar-height": "0px",
    } as React.CSSProperties,
  });
}

function TrainViewer() {
  return React.createElement("model-viewer", {
    src: "/models/train.glb",
    alt: "Train",
    "camera-orbit": "90deg 88deg 10m",
    exposure: "1.5",
    "shadow-intensity": "0",
    loading: "eager",
    style: {
      width: "1050px",
      height: "263px",
      background: "transparent",
      "--poster-color": "transparent",
    } as React.CSSProperties,
  });
}

// ── Content renderers ──────────────────────────────────────────────────────────
function ImageSlot({ slot }: { slot: Slot }) {
  const img = IMAGES[slot.contentIdx % IMAGES.length];
  const { w, h } = DIMS[slot.size];
  const imgH = Math.round(h * 0.84);
  const xl = slot.size === "xlarge";
  return (
    <div style={{ transform: `rotate(${img.rotate})` }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: w,
          height: imgH,
          boxShadow:
            "0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.14), 0 0 40px rgba(99,102,241,0.12)",
        }}
      >
        <Image
          src={img.src}
          alt={img.label}
          width={xl ? 430 : 272}
          height={xl ? 272 : 203}
          className="w-full h-full object-cover"
        />
      </div>
      <p
        className={`text-white/40 text-center mt-2 font-semibold tracking-widest uppercase ${xl ? "text-xs" : "text-[9px]"}`}
      >
        {img.label}
      </p>
    </div>
  );
}

// All text variants float as bare text — no card background.
const BARE_VARIANTS: TextVariant[] = TEXT_VARIANTS.slice();

function TextSlot({ slot }: { slot: Slot }) {
  const variant = TEXT_VARIANTS[slot.contentIdx % TEXT_VARIANTS.length];
  const { w } = DIMS[slot.size];
  const xl = slot.size === "xlarge" || slot.size === "stack";
  const bare = BARE_VARIANTS.includes(variant);

  let inner: React.ReactNode = null;
  switch (variant) {
    case "headline":
      inner = (
        <h1
          className={`font-black text-white leading-tight tracking-tight ${xl ? "text-7xl" : "text-2xl"}`}
          style={{ textShadow: "0 4px 32px rgba(99,102,241,0.55), 0 2px 8px rgba(0,0,0,0.8)" }}
        >
          Build.<br />Create.<br />
          <span className="text-indigo-200">Innovate.</span>
        </h1>
      );
      break;
    case "subhead":
      inner = (
        <div>
          <p
            className={`text-white/90 font-medium leading-relaxed ${xl ? "text-2xl" : "text-sm"}`}
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
          >
            Where ideas come to life through electronics, robotics, and hands-on engineering.
          </p>
          <div className={`mt-4 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full ${xl ? "h-0.5 w-16" : "h-px w-6"}`} />
        </div>
      );
      break;
    case "byStudents":
      inner = (
        <>
          <p className={`font-black text-white ${xl ? "text-5xl" : "text-base"}`}>By Students.</p>
          <p className={`font-black text-indigo-300 ${xl ? "text-5xl" : "text-base"}`}>For Students.</p>
          <p className={`text-white/35 mt-3 ${xl ? "text-base" : "text-xs"}`}>
            Suncoast Community High School
          </p>
        </>
      );
      break;
    case "stat":
      inner = (
        <div className="text-center">
          <p className={`font-black text-white ${xl ? "text-9xl" : "text-3xl"}`} style={{ textShadow: "0 0 60px rgba(99,102,241,0.4)" }}>15+</p>
          <p className={`text-indigo-300 font-semibold tracking-widest uppercase mt-1 ${xl ? "text-base" : "text-[10px]"}`}>
            Active Members
          </p>
          <p className={`text-white/30 mt-2 ${xl ? "text-sm" : "text-[10px]"}`}>
            Every Tuesday · Room 2104
          </p>
        </div>
      );
      break;
    case "location":
      inner = (
        <div style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
          <p className={`text-indigo-300 font-semibold uppercase tracking-widest mb-2 ${xl ? "text-sm" : "text-[9px]"}`}>
            Find us at
          </p>
          <p className={`font-black text-white ${xl ? "text-7xl" : "text-xl"}`}>Room 2104</p>
          <p className={`text-white/60 mt-3 ${xl ? "text-lg" : "text-xs"}`}>
            After school, every Tuesday
          </p>
        </div>
      );
      break;
    case "tags":
      inner = (
        <div className="flex flex-col gap-4">
          {["Electronics", "Robotics", "3D Printing", "Arduino"].map((tag) => (
            <span
              key={tag}
              className={`font-semibold text-indigo-200 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-center ${xl ? "text-xl px-8 py-3" : "text-xs px-2.5 py-1"}`}
            >
              {tag}
            </span>
          ))}
        </div>
      );
      break;
    case "meeting":
      inner = (
        <div style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
          <p className={`text-indigo-400 font-semibold uppercase tracking-widest mb-3 ${xl ? "text-sm" : "text-[9px]"}`}>
            Next meeting
          </p>
          <p className={`font-black text-white leading-none ${xl ? "text-8xl" : "text-2xl"}`}>
            TUESDAY
          </p>
          <p className={`text-indigo-300/80 mt-3 font-medium ${xl ? "text-xl" : "text-xs"}`}>
            After school · Room 2104
          </p>
          <div className={`mt-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full ${xl ? "h-0.5 w-20" : "h-px w-8"}`} />
        </div>
      );
      break;
    case "tagline":
      inner = (
        <div style={{ textShadow: "0 3px 24px rgba(0,0,0,0.85)" }}>
          <p className={`font-black text-white leading-tight ${xl ? "text-6xl" : "text-xl"}`}>
            Real projects.<br />
            <span className="text-indigo-300">Real skills.</span>
          </p>
          <p className={`text-white/50 mt-4 ${xl ? "text-lg" : "text-xs"}`}>
            Student-run · Est. 2024
          </p>
        </div>
      );
      break;
    default:
      inner = null;
  }

  // Bare variants float directly on the hero background — no glass card
  if (bare) {
    return <div style={{ width: w }}>{inner}</div>;
  }

  return (
    <div
      className="rounded-2xl backdrop-blur-2xl"
      style={{
        width: w,
        padding: xl ? "32px" : "16px",
        background: "rgba(8, 12, 40, 0.72)",
        boxShadow:
          "0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 80px rgba(99,102,241,0.06)",
      }}
    >
      {inner}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
let _nextSlotId = 0;

export function DroneFlightHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const droneARef    = useRef<HTMLDivElement>(null);
  const droneBRef    = useRef<HTMLDivElement>(null);
  const pathARef     = useRef<SVGPathElement>(null);
  const pathBRef     = useRef<SVGPathElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const trainRef          = useRef<HTMLDivElement>(null);
  const mobileHeadlineRef = useRef<HTMLDivElement>(null);
  const introRef          = useRef<HTMLDivElement>(null);
  const ambientRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleIdxRef  = useRef(0);
  const isMobileRef  = useRef(false);

  const [, _setSlots] = useState<Slot[]>([]);
  const slotsRef = useRef<Slot[]>([]);

  function setSlots(fn: (prev: Slot[]) => Slot[]) {
    _setSlots((prev) => {
      const next = fn(prev);
      slotsRef.current = next;
      return next;
    });
  }

  useEffect(() => {
    import("@google/model-viewer");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapCtx: any;
    const tids: ReturnType<typeof setTimeout>[] = [];
    const delay = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      tids.push(id);
    };

    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { default: gsap } = (await import("gsap")) as any;
      const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
      gsap.registerPlugin(MotionPathPlugin);

      const el = containerRef.current;
      if (!el) return;
      const cw = el.offsetWidth;
      const ch = el.offsetHeight;
      svgRef.current?.setAttribute("viewBox", `0 0 ${cw} ${ch}`);

      // Responsive card positions — xlarge on desktop, medium on smaller screens
      const isDesktop = cw >= 1024;
      const POS_A = isDesktop
        ? { xPct: 26, yPct: 30, size: "xlarge" as Size }
        : { xPct: 33, yPct: 42, size: "medium" as Size };
      const POS_B = isDesktop
        ? { xPct: 74, yPct: 30, size: "xlarge" as Size }
        : { xPct: 67, yPct: 42, size: "medium" as Size };

      const isMobile = cw < 768;
      isMobileRef.current = isMobile;

      // make() must be defined before showCycle so it's available to all branches
      const make = (
        pos: { xPct: number; yPct: number; size: Size },
        item: CycleItem
      ): Slot => ({
        id:         ++_nextSlotId,
        cx:         (pos.xPct / 100) * cw,
        cy:         (pos.yPct / 100) * ch,
        size:       pos.size,
        kind:       item.kind,
        contentIdx: item.contentIdx,
        visible:    false,
      });

      function showCycle(idx: number) {
        const cycle = CYCLES[idx];
        const stacked = cycle.layout === "stacked" && isDesktop && !!cycle.c;

        // Mobile: single centered image card only (headline is a fixed JSX element)
        if (isMobile) {
          const imgItem = cycle.layout === "stacked"
            ? cycle.c!
            : (cycle.a.kind === "image" ? cycle.a : cycle.b);
          // Mobile tracks sit at bottom:calc(26%+5px) → rail from top = 0.74*ch - 55
          const mobileRailTopPx = 0.74 * ch - 55;
          // Headline top is at 10% with ~185px text height
          const headlineBot = 0.10 * ch + 185;
          const available = mobileRailTopPx - 16 - (headlineBot + 16);
          const mobileSize: Size = available >= 200 ? "large" : available >= 150 ? "medium" : "small";
          const mobileImgCy = headlineBot + 16 + DIMS[mobileSize].h / 2;

          // flushSync commits the DOM synchronously so querySelectorAll finds the new element.
          // GSAP then owns opacity directly (no CSS transition), which is reliable on mobile.
          flushSync(() => {
            setSlots(() => [make({ xPct: 50, yPct: (mobileImgCy / ch) * 100, size: mobileSize }, imgItem)]);
          });
          const newEls = Array.from(containerRef.current?.querySelectorAll("[data-slot-id]") ?? []);
          gsap.set(newEls, { opacity: 0 });
          requestAnimationFrame(() => {
            gsap.to(newEls, { opacity: 1, duration: 0.9, ease: "sine.inOut" });
          });
          return;
        }

        // Track rails top = 0.83*ch - 75 + 20 = 0.83ch - 55 from viewport top.
        // "stack" size (430×240, half=120): dynamic positioning keeps both cards above rail.

        if (stacked) {
          // "stack" = 430px wide (same as xlarge), 220px tall (half=110).
          // At 720px: upper bottom=268px, lower bottom=520px — both clear of 523px rail top ✓.
          // At 1080px: even more room. Dynamic yPct keeps them clear at any height.
          const halfStack = DIMS["stack"].h / 2;          // 110
          const railTopPx = 0.83 * ch - 55;               // main rail from viewport top
          const upperCy   = Math.max(halfStack + 8, ch * 0.22);
          const lowerCy   = Math.min(railTopPx - halfStack - 12,
                              Math.max(upperCy + DIMS["stack"].h + 18, ch * 0.57));
          setSlots(() => [
            make({ xPct: 26, yPct: (upperCy / ch) * 100, size: "stack" }, cycle.a),
            make({ xPct: 26, yPct: (lowerCy / ch) * 100, size: "stack" }, cycle.b),
            make({ xPct: 74, yPct: 30, size: "xlarge" }, cycle.c!),
          ]);
        } else {
          setSlots(() => [make(POS_A, cycle.a), make(POS_B, cycle.b)]);
        }
        delay(() => setSlots((p) => p.map((s) => ({ ...s, visible: true }))), 80);
      }

      function hideThenShow(nextIdx: number) {
        if (isMobile) {
          // GSAP fades out existing slot, then swaps in the next one via onComplete.
          const currentEls = Array.from(containerRef.current?.querySelectorAll("[data-slot-id]") ?? []);
          if (currentEls.length) {
            gsap.to(currentEls, { opacity: 0, duration: 0.7, ease: "sine.inOut", onComplete: () => showCycle(nextIdx) });
          } else {
            showCycle(nextIdx);
          }
          return;
        }
        // Desktop (unchanged):
        setSlots((p) => p.map((s) => ({ ...s, visible: false })));
        delay(() => showCycle(nextIdx), 700);
      }

      gsapCtx = gsap.context(() => {

        // Train starts off-screen right — 2x smaller on mobile, shifted up to align with raised tracks.
        // Formula: y = -(0.13*ch + 14) places the model's rail exactly on the SVG rail at bottom:calc(26%+5px).
        gsap.set(trainRef.current, {
          x: cw + 50,
          y: isMobile ? -(0.13 * ch + 14) : 0,
          scale: isMobile ? 0.5 : 1,
          transformOrigin: "0% 100%",
        });

        // ── Cinematic fade-in from black (t=0) ────────────────────────────
        gsap.to(introRef.current, { opacity: 0, duration: 0.9, ease: "power2.out" });

        // ── Train: single dramatic crossing (desktop t=1500ms, mobile t=2000ms, 5s) ──
        delay(() => {
          gsap.timeline()
            .to(trainRef.current, { opacity: 1, duration: 0.5 }, 0)
            .to(trainRef.current, { x: isMobile ? -560 : -1120, duration: 5, ease: "power1.inOut" }, 0)
            .to(trainRef.current, { opacity: 0, duration: 0.5 }, ">-0.6");
        }, isMobile ? 2000 : 1500);

        // ── Drones: launch simultaneously (t=800ms, 4.5s each) ───────────
        // A (ltr, top lane) and B (rtl, mid lane) are in separate y corridors.
        // No content exists during this window → zero overlap possible.
        delay(() => {
          if (window.innerWidth < 768) return;

          const pathA = buildDronePathA(cw, ch);
          pathARef.current?.setAttribute("d", pathA);
          gsap.timeline()
            .set(droneARef.current, { opacity: 0 })
            .to(droneARef.current, { opacity: 1, duration: 0.5 }, 0)
            .to(droneARef.current, {
              motionPath: {
                path: pathARef.current!, align: pathARef.current!,
                autoRotate: true, alignOrigin: [0.5, 0.5],
              },
              duration: 4.5,
              ease: "power1.inOut",
            }, 0)
            .to(droneARef.current, { opacity: 0, duration: 0.4 }, ">-0.5");

          const pathB = buildDronePathB(cw, ch);
          pathBRef.current?.setAttribute("d", pathB);
          gsap.timeline()
            .set(droneBRef.current, { opacity: 0 })
            .to(droneBRef.current, { opacity: 1, duration: 0.5 }, 0)
            .to(droneBRef.current, {
              motionPath: {
                path: pathBRef.current!, align: pathBRef.current!,
                autoRotate: false, alignOrigin: [0.5, 0.5],
              },
              duration: 4.5,
              ease: "power1.inOut",
            }, 0)
            .to(droneBRef.current, { opacity: 0, duration: 0.4 }, ">-0.5");
        }, 800);

        // ── Ambient loop: content appears after intro ends (~t=7.2s) ─────
        // Train exits ~6.9s (1500ms start + 5s + 0.4s fade), drones exit ~5.3s.
        delay(() => {
          // Mobile: fade in the permanent headline once and leave it visible
          if (isMobile && mobileHeadlineRef.current) {
            gsap.to(mobileHeadlineRef.current, { opacity: 1, duration: 0.8 });
          }

          cycleIdxRef.current = 0;
          showCycle(0);

          ambientRef.current = setInterval(() => {
            cycleIdxRef.current = (cycleIdxRef.current + 1) % CYCLES.length;
            hideThenShow(cycleIdxRef.current);
          }, 5000);
        }, 7200);

      }, containerRef);
    };

    init();

    return () => {
      tids.forEach(clearTimeout);
      gsapCtx?.revert?.();
      if (ambientRef.current) clearInterval(ambientRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900"
    >
      {/* Atmospheric depth orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-[400px] h-[400px] rounded-full bg-purple-500/18 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-400/10 blur-2xl pointer-events-none" />

      {/* GSAP motion paths (invisible) */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path ref={pathARef} d="" fill="none" stroke="none" />
        <path ref={pathBRef} d="" fill="none" stroke="none" />
      </svg>

      {/* Content slots — 0 or 2 always */}
      {slotsRef.current.map((slot) => (
        <div
          key={slot.id}
          data-slot-id={slot.id}
          className="absolute pointer-events-none z-10"
          style={{
            left:       slot.cx - DIMS[slot.size].w / 2,
            top:        slot.cy - DIMS[slot.size].h / 2,
            width:      DIMS[slot.size].w,
            height:     DIMS[slot.size].h,
            overflow:   "visible",
            // Desktop: React controls opacity via CSS transition.
            // Mobile: GSAP owns opacity; willChange promotes element to GPU compositing layer.
            ...(isMobileRef.current ? { willChange: "opacity" } : {
              opacity:    slot.visible ? 1 : 0,
              transform:  slot.visible ? "translateY(0px) scale(1)" : "translateY(18px) scale(0.9)",
              filter:     slot.visible ? "blur(0px)" : "blur(7px)",
              transition: "opacity 800ms ease, transform 800ms cubic-bezier(0.22,1.2,0.36,1), filter 800ms ease",
            }),
          }}
        >
          {slot.kind === "image" ? <ImageSlot slot={slot} /> : <TextSlot slot={slot} />}
        </div>
      ))}

      {/* Drone A — bottom-left → top-right, passes in front of B at crossing (z-20) */}
      <div
        ref={droneARef}
        className="absolute will-change-transform pointer-events-none hidden md:block z-20"
        style={{ opacity: 0, top: 0, left: 0 }}
      >
        <div className="absolute inset-0 -z-10 blur-2xl bg-indigo-400/20 rounded-full scale-[2] pointer-events-none" />
        <DroneViewer flip={false} />
      </div>

      {/* Drone B — bottom-right → top-left, passes behind A at crossing */}
      <div
        ref={droneBRef}
        className="absolute will-change-transform pointer-events-none hidden md:block z-15"
        style={{ opacity: 0, top: 0, left: 0 }}
      >
        <div className="absolute inset-0 -z-10 blur-2xl bg-violet-400/18 rounded-full scale-[2] pointer-events-none" />
        <DroneViewer flip={true} />
      </div>

      {/* Mobile-only: fixed "Build. Create. Innovate." headline above the cycling image */}
      <div
        ref={mobileHeadlineRef}
        className="absolute md:hidden pointer-events-none z-30"
        style={{
          opacity: 0,
          left: "50%",
          top: "10%",
          transform: "translateX(-50%)",
          width: "280px",
          textAlign: "center",
        }}
      >
        <h1
          className="font-black text-white leading-tight tracking-tight text-5xl"
          style={{ textShadow: "0 4px 32px rgba(99,102,241,0.55), 0 2px 8px rgba(0,0,0,0.8)" }}
        >
          Build.<br />Create.<br />
          <span className="text-indigo-200">Innovate.</span>
        </h1>
      </div>

      {/* Train — single crossing, exits forever */}
      <div
        ref={trainRef}
        className="absolute will-change-transform pointer-events-none"
        style={{ bottom: "13%", left: 0, opacity: 0 }}
      >
        <TrainViewer />
      </div>

      {/* Track rails — always visible; higher on mobile */}
      <svg
        className="absolute w-full pointer-events-none bottom-[calc(26%+5px)] md:bottom-[calc(17%+5px)]"
        style={{ height: "70px" }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect x="0" y={3}  width="100%" height={3}  fill="white" fillOpacity={0.18} rx={1} />
        <rect x="0" y={20} width="100%" height={8}  fill="white" fillOpacity={0.82} rx={1} />
        <rect x="0" y={28} width="100%" height={5}  fill="white" fillOpacity={0.40} />
        <rect x="0" y={33} width="100%" height={4}  fill="white" fillOpacity={0.60} rx={1} />
        {Array.from({ length: 52 }, (_, i) => (
          <rect
            key={i}
            x={`${i * 1.96}%`}
            y={37}
            width="0.85%"
            height={16}
            fill="white"
            fillOpacity={0.15}
            rx={1}
          />
        ))}
        <rect x="0" y={54} width="100%" height={2}  fill="white" fillOpacity={0.08} />
      </svg>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 text-xs tracking-widest uppercase pointer-events-none select-none z-20">
        <span>Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
      </div>

      {/* Intro black overlay — GSAP fades this out at mount */}
      <div
        ref={introRef}
        className="absolute inset-0 z-50 pointer-events-none bg-black"
      />
    </div>
  );
}
