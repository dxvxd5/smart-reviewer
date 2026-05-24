# Smart Reviewer

Single-page app that searches news, summarizes articles + scores sentiment via GenAI, and stores results in MongoDB.

## Stack

- **Frontend:** React 19 + Vite + TypeScript + CSS Modules + TanStack Query
- **Backend:** Node 20 + Express + TypeScript + Mongoose + Zod
- **DB:** MongoDB Atlas (M0 free tier)
- **News:** GNews.io
- **GenAI:** Google Gemini 2.5 Flash

See [PLAN.md](./PLAN.md) for the full project plan.

## Quick start

```bash
npm install                  # installs both workspaces
cp backend/.env.example backend/.env       # then fill in keys
cp frontend/.env.example frontend/.env
npm run dev                  # runs backend and frontend in parallel
```

- Backend: <http://localhost:4000>
- Frontend: <http://localhost:5173>

## Workspaces

- [`backend/`](./backend) — Express API
- [`frontend/`](./frontend) — React SPA
