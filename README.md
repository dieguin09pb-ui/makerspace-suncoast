# Makerspace @ Suncoast

Official website for the Makerspace STEM Club at Suncoast Community High School in Riviera Beach, Florida. Built to handle meeting info, project showcases, and member resources for the 2026–2027 school year.

**Live site:** https://makerspace-suncoast.vercel.app

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — drone flight hero, scheduling info, roles section, scroll-reveal animations |
| `/progress` | 3D model viewer for printed parts + real project photos |
| `/org` | Club org structure and team |
| `/contact` | Contact information |

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS** with custom indigo theme
- **Radix UI** primitives (hand-written components, no CLI)
- **Three.js + @google/model-viewer** for interactive 3D STL/GLB viewing
- **GSAP** for hero animations
- **OpenAI API** for the Abhi chatbot assistant
- Deployed on **Vercel**

---

## Key Features

### Meeting Schedule
The club meets in **Room 3-126** every day during lunch, plus after school on Mondays and Fridays. The schedule is shown on the home page's Meetings tab and in the hero.

### Abhi Chatbot
Floating chat widget (bottom-right) powered by OpenAI. Abhi answers questions about 3D printing, Arduino, electronics, competitions, and the club itself. Persists across all pages.

### 3D Progress Viewer
`/progress` renders interactive STL models (drone chassis, greenhouse, belt holder) and GLB files (flying drone, train) using `@google/model-viewer` and Three.js, alongside real photos of finished builds.

### Page Transitions
Every route change triggers a smooth 200ms fade-in via `app/template.tsx`.

---

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/chat` | POST | Streams OpenAI response as Abhi |

## Local Development

```bash
npm install
npm run dev
```

Requires a `.env.local` with:
```
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
