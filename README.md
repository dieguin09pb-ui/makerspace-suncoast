# Makerspace @ Suncoast

Official website for the Makerspace STEM Club at Suncoast Community High School in Riviera Beach, Florida. Built to handle scheduling conflict tracking, meeting calendars, project showcases, and member resources for the 2026–2027 school year.

**Live site:** https://makerspace-suncoast.vercel.app

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — drone flight hero, scheduling info, roles section, scroll-reveal animations |
| `/calendar` | Q1–Q4 meeting calendar with Tuesdays highlighted per quarter |
| `/conflict` | Scheduling conflict submission form |
| `/dashboard` | Analytics dashboard — charts, filters, and conflict table |
| `/activities` | Club activities listing |
| `/progress` | 3D model viewer for printed parts + real project photos |
| `/org` | Club org structure and team |
| `/contact` | Contact information |

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS** with custom indigo theme
- **Radix UI** primitives (hand-written components, no CLI)
- **Recharts** for analytics charts
- **Three.js + @google/model-viewer** for interactive 3D STL/GLB viewing
- **GSAP** for hero animations
- **react-hook-form + Zod** for conflict form validation
- **OpenAI API** for the Abhi chatbot assistant
- **Vercel Blob** for persistent conflict data storage
- Deployed on **Vercel**

---

## Key Features

### Scheduling Conflict Tracker
Members submit scheduling conflicts via `/conflict`. Fields include name, days of week (multi-select), time slot (Before School / Lunch / After School), reason, recurring toggle, and quarters affected. Submissions are stored in Vercel Blob as JSON.

### Analytics Dashboard
`/dashboard` aggregates all conflict submissions into:
- Bar chart by day of week
- Bar chart by quarter (Q1–Q4)
- Recurring vs. one-time breakdown chart
- Schedule grid heat map
- Filterable and sortable conflict table

### Abhi Chatbot
Floating chat widget (bottom-right) powered by OpenAI. Abhi answers questions about 3D printing, Arduino, electronics, competitions, and the club itself. Persists across all pages.

### 3D Progress Viewer
`/progress` renders interactive STL models (drone chassis, greenhouse, belt holder) and GLB files (flying drone, train) using `@google/model-viewer` and Three.js, alongside real photos of finished builds.

### Meeting Calendar
`/calendar` shows Q1–Q4 tabs with every Tuesday highlighted as a meeting day, aligned to the 2026–2027 Palm Beach County School District calendar.

### Page Transitions
Every route change triggers a smooth 200ms fade-in via `app/template.tsx`.

---

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/conflicts` | GET | Fetch all conflict submissions |
| `/api/conflicts` | POST | Submit a new conflict (writes to Vercel Blob) |
| `/api/analytics` | GET | Aggregated stats by day, quarter, and recurrence |
| `/api/chat` | POST | Streams OpenAI response as Abhi |

### Conflict Data Model
Stored in Vercel Blob at `makerspace/conflicts.json`:
```ts
{
  id: string
  submittedAt: string
  name: string
  daysOfWeek: string[]
  timeStart: string
  timeEnd: string
  reason: string
  isRecurring: boolean
  quartersAffected: string[]
}
```

---

## School Calendar (2026–2027)

| Quarter | Dates |
|---|---|
| Q1 | Aug 17 – Oct 16, 2026 |
| Q2 | Oct 19, 2026 – Jan 8, 2027 |
| Q3 | Jan 11 – Mar 12, 2027 |
| Q4 | Mar 15 – May 28, 2027 |

Meeting day: **Tuesday after school (~3:30 PM)**

---

## Local Development

```bash
npm install
npm run dev
```

Requires a `.env.local` with:
```
BLOB_READ_WRITE_TOKEN=...
OPENAI_API_KEY=...
```

Pull environment variables from Vercel:
```bash
vercel env pull
```

---

## Deployment

Pushes to `master` auto-deploy to production via Vercel's GitHub integration. To deploy manually:

```bash
vercel --prod
```
