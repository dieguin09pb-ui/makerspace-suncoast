import { chromium } from '@playwright/test';

const b = await chromium.launch({ headless: true });
const p = await b.newPage();
await p.setViewportSize({ width: 1280, height: 720 });

await p.goto('http://localhost:3000', { waitUntil: 'load' });

// --- 1. Drones mid-flight ---
await p.waitForTimeout(2400);

console.log('\n─── Drone bounding boxes at t≈2.4s ───');
const droneInfo = await p.evaluate(() => {
  const els = [...document.querySelectorAll('div')]
    .filter(el => el.querySelector('model-viewer') && el.getBoundingClientRect().width < 350 && el.getBoundingClientRect().width > 10);
  return els.map(el => {
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left) };
  });
});
const TRACK_TOP = Math.round(720 * 0.83 - 75); // 523px
console.log(`Rail track top: ${TRACK_TOP}px`);
droneInfo.forEach(d => {
  const clear = TRACK_TOP - d.bottom;
  const onscreen = d.right > 0 && d.left < 1280;
  if (onscreen) console.log(`  on-screen drone bottom=${d.bottom} → rail clearance ${clear}px ${clear >= 0 ? '✅' : '❌ OVERLAPS RAILS'}`);
  else console.log(`  off-screen drone (x=${d.left}..${d.right})`);
});

// --- 2. Content cards — wait through full ambient delay ---
console.log('\n─── Waiting 11s for ambient loop (7200ms start + import delay) ───');
await p.waitForTimeout(11000);

const slots = await p.evaluate(() => {
  return [...document.querySelectorAll('[data-slot-id]')].map(el => {
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return { w: Math.round(r.width), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), opacity: style.opacity };
  });
});
console.log(`Content slots found: ${slots.length}`);
slots.forEach((s, i) => console.log(`  [${i}] w=${s.w} top=${s.top} bottom=${s.bottom} left=${s.left} opacity=${s.opacity}`));

const TRACK_TOP_VAL = 523;
const railOverlaps = slots.filter(s => s.bottom > TRACK_TOP_VAL && parseFloat(s.opacity) > 0.1);
console.log(railOverlaps.length === 0 ? '✅ No slots overlap rails' : `❌ ${railOverlaps.length} slot(s) overlap rails:`);
railOverlaps.forEach(s => console.log(`   bottom=${s.bottom} > rail_top=${TRACK_TOP_VAL}`));

const overlaps = await p.evaluate(() => {
  const s = [...document.querySelectorAll('[data-slot-id]')];
  const r = s.map(el => el.getBoundingClientRect());
  return r.flatMap((a, i) => r.slice(i+1).map((b, j) => ({i, j: i+1+j, ok: !(a.right>b.left && b.right>a.left && a.bottom>b.top && b.bottom>a.top)})))
    .filter(x => !x.ok);
});
console.log(overlaps.length === 0 ? '✅ No slot overlaps' : `❌ Slot overlaps: ${JSON.stringify(overlaps)}`);

await b.close();
