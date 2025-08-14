 FinSim — Learn Finance by Playing

FinSim is a game-based web app that teaches financial literacy through interactive simulations. Choose life events, adjust their impact, run projections, compare scenarios, and visualize net worth and cash flow with a beautiful, modern UI.

 Features
- Interactive life events with adjustable amounts
- Local and server-side simulations (10-year projection)
- Scenario save/list/share (public links)
- Charts: Net worth (area), Cash flow (line)
- Market data integrations (FRED, CoinGecko)

Tech Stack
- Frontend: React + Vite + Tailwind, React Router, Zustand, Recharts
- Backend: Node + Express + TypeScript, Prisma (TiDB/MySQL), Zod
- Hosting: Vercel (frontend), Render (backend)
- Database: TiDB Cloud (MySQL-compatible)

 Monorepo
```
finsim/
  client/   # React + Vite + Tailwind app
  server/   # Express + TypeScript + Prisma API
```

 Quickstart (local)
 Backend
1) Create `server/.env`:
```
PORT=5179
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/finsim?sslaccept=strict
FRED_API_KEY=YOUR_FRED_API_KEY
```
2) Install and run:
```
cd server
npm install
npx prisma db push
npx prisma generate
npm run dev
```
Health check: http://localhost:5179/api/health

 Frontend
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

 Build
```
cd client && npm run build
cd server && npm run build && npm start
```

 Deploy (summary)
- Backend (Render):
  - Root: `server`
  - Build: `npm ci && npx prisma generate && npx prisma db push && npm run build`
  - Start: `npm start`
  - Env: `DATABASE_URL`, `FRED_API_KEY`, `NODE_VERSION=20`
- Frontend (Vercel):
  - Root: `client`
  - Build: `npm run build`
  - Output: `dist`
  - Env: `VITE_API_URL=https://YOUR-RENDER.onrender.com/api`

 API (base: `/api`)
- GET `/health`
- POST `/simulate` — body: `{ "income": number, "expense": number }`
- GET `/scenarios`
- POST `/scenarios` — body: `{ "name": string, "income": number, "expense": number }`
- POST `/scenarios/:id/share`
- GET `/public/:slug`
- GET `/market/inflation?series=CPIAUCSL`
- GET `/market/crypto?ids=bitcoin,ethereum`

## License
MIT
```
