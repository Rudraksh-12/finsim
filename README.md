### FinSim — Learn Finance by Playing

FinSim is a game-based web app that teaches financial literacy through interactive simulations. Choose life events, adjust their impact, run projections, compare scenarios, and visualize net worth and cash flow with a beautiful, modern UI.

---

## Overview

- Interactive life events with adjustable amounts
- Local and server-side simulations (10-year projection)
- Scenario save/list/share (public links)
- Charts: Net worth (area), Cash flow (line)
- Market data integrations (FRED, CoinGecko)

---

## Tech Stack

- Frontend: React + Vite + Tailwind, React Router, Zustand, Recharts
- Backend: Node + Express + TypeScript, Prisma (TiDB/MySQL), Zod
- Hosting: Vercel (frontend), Render (backend)
- Database: TiDB Cloud (MySQL-compatible)

---

## Monorepo

```
finsim/
  client/   # React + Vite + Tailwind app
  server/   # Express + TypeScript + Prisma API
```

---

## Quickstart (local)

### Prerequisites
- Node.js 20+, npm
- TiDB Cloud free cluster (MySQL) and a FRED API key

### Backend (server)
1) Create `server/.env` (do not commit):
```
PORT=5179
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/finsim?sslaccept=strict
FRED_API_KEY=YOUR_FRED_API_KEY
```
2) Install, migrate, run:
```
cd server
npm install
npx prisma db push
npx prisma generate
npm run dev
```
3) Verify:
- Health: http://localhost:5179/api/health
- Simulate:
```
curl -X POST http://localhost:5179/api/simulate -H "Content-Type: application/json" -d "{\"income\":70000,\"expense\":38000}"
```

### Frontend (client)
1) Create `client/.env.local`:
```
VITE_API_URL=http://localhost:5179/api
```
2) Install and run:
```
cd client
npm install
npm run dev
```

---

## Build

```
cd client && npm run build
cd server && npm run build && npm start
```

---

## API (base: `/api`)

- GET `/health`
- POST `/simulate`
  - Body: `{ "income": number, "expense": number }`
- GET `/scenarios`
- POST `/scenarios`
  - Body: `{ "name": string, "income": number, "expense": number }`
- GET `/scenarios/:id`
- DELETE `/scenarios/:id`
- POST `/scenarios/:id/share`
- GET `/public/:slug`
- GET `/market/inflation?series=CPIAUCSL`
- GET `/market/crypto?ids=bitcoin,ethereum`

---

## Environment Variables

- Frontend (`client/.env.local`)
  - `VITE_API_URL` — e.g., `http://localhost:5179/api` or your Render URL + `/api`
- Backend (`server/.env`)
  - `PORT` — default 5179
  - `DATABASE_URL` — TiDB MySQL URL (use `?sslaccept=strict`; if SSL issues → `accept_invalid_certs`)
  - `FRED_API_KEY` — your FRED key

---

## Deploy (summary)

### Backend (Render)
- Root Directory: `server`
- Build: `npm ci && npx prisma generate && npx prisma db push && npm run build`
- Start: `npm start`
- Environment:
  - `DATABASE_URL`, `FRED_API_KEY`, `NODE_VERSION=20`

### Frontend (Vercel)
- Root Directory: `client`
- Build: `npm run build`
- Output: `dist`
- Environment:
  - `VITE_API_URL=https://YOUR-RENDER.onrender.com/api`

---

## Troubleshooting

- JSON parse error with curl: ensure proper quoting; in Windows, prefer `--data-binary @file.json`.
- Prisma EPERM on Windows: stop running Node processes, regenerate with default client output, rerun `npx prisma generate`.
- DB connect issues: confirm TiDB IP allowlist and use `?sslaccept=accept_invalid_certs` if needed.
- 404/Network from frontend: verify `VITE_API_URL` and that the backend is reachable.

---

## License

MIT


