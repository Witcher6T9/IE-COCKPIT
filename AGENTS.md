# Base44 Dev Environment

## App Overview
Single-origin React 19 + Vite 6 + Express app: a Garment Line Efficiency Tracker for industrial engineering teams. The Express server (`server.ts`) runs Vite in middleware mode in dev, serving both the API and frontend on port 3000.

## Running the App
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Node 22 slim image, source bind-mounted at `/app`.
- `npm install` runs on every container start; deps cached in an anonymous volume (`/app/node_modules`).
- Dev command: `tsx server.ts` (Express + Vite middleware, live reload via chokidar polling).
- Health check: `GET /api/health` → `{"status":"ok"}`.

## Architecture
- **Single origin**: Express serves the Vite dev middleware and the `/api/*` endpoints on the same port 3000. No separate API service.
- **No database**: All state is client-side `localStorage` + in-memory mock data (`src/mockData.ts`). No migrations or seeds needed.
- **AI feature**: `POST /api/ai-audit` uses `@google/genai` (Gemini) when `GEMINI_API_KEY` is set. Without the key, it falls back to rule-based heuristics — the app is fully functional without it.

## Secrets
- `GEMINI_API_KEY` (optional): Google Gemini API key for the AI audit feature. Without it, the app boots and uses heuristic fallbacks. Obtain from https://aistudio.google.com/apikey.

## Verification
- `curl http://localhost:3000/api/health` returns ok.
- `curl http://localhost:3000/` returns the Vite-served HTML with `/@vite/client` (confirms live dev source, not a prebuilt bundle).
- `curl http://localhost:3000/src/main.tsx` returns 200 (confirms TSX compiles via Vite).
