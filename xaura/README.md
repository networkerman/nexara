# xAura — Multi-agent Marketing Playground

An interactive prototype of **xAura**, a multi-agent marketing copilot. It features a chat interface with collaborative and autonomous modes, specialist agents (Content, Segment, Insights, Scheduler, Journey, Deep Research), a campaigns workspace, journeys, and a decisioning engine.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router, TanStack Query

## Getting started

```sh
# Install dependencies
npm i

# Start the dev server (http://localhost:8080)
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server with hot reload
- `npm run build` — production build
- `npm run build:dev` — development-mode build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Project structure

- `src/pages/` — top-level routes (Campaigns, Journeys, Decisioning Engine, Settings)
- `src/components/` — chat interface, sidebars, agent UI, campaign components
- `src/data/` — agent definitions, mock conversations, schedules
- `public/` — static assets (agent avatars, icons, campaign assets)
- `docs/` — supporting documentation

See `project_details.md` for a detailed file-by-file overview.
