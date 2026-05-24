# Smart Reviewer

A single-page app that searches recent news, runs each article through a GenAI
model to produce a neutral summary + sentiment score, and stores the result in
MongoDB so repeated lookups are free.

Built for the Aries case study.

## Stack

| Layer    | Choice                                                      |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19 · Vite · TypeScript · CSS Modules · TanStack Query |
| Backend  | Node 20 · Express · TypeScript · Mongoose · Zod             |
| DB       | MongoDB (Atlas free tier or local)                          |
| News API | [GNews](https://gnews.io) (free tier, 100 req/day)          |
| GenAI    | Google Gemini 2.5 Flash (free tier)                         |

## How it works

1. **Search** — debounced `GET /api/news/search?q=...` proxies GNews so the
   browser never sees the key.
2. **Analyze** — `POST /api/articles/analyze` first checks MongoDB by article
   URL. If present, returns the cached analysis. Otherwise calls Gemini once,
   asking for `{ summary, sentiment, score, reasoning }` in a single JSON
   response (one call covers both summary and sentiment), persists it, and
   returns `cached: false`.
3. **History** — `GET /api/articles` returns the 50 most recent analyses for
   the History pane.

Cache strategy keeps GenAI usage minimal: one call per unique article URL, ever.

## Quick start

Prerequisites: Node ≥ 20, a MongoDB connection string, a GNews API key, and a
Gemini API key.

```bash
# 1. clone and install (uses npm workspaces)
git clone <repo-url> smart-reviewer
cd smart-reviewer
npm install

# 2. configure env
cp backend/.env.example backend/.env       # then fill in keys (see below)
cp frontend/.env.example frontend/.env

# 3. run both apps in parallel
npm run dev
```

- Backend: <http://localhost:4000> · health: `GET /api/health`
- Frontend: <http://localhost:5173>

## Environment variables

### `backend/.env`

| Var              | Example                                                      | Notes                                    |
| ---------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `PORT`           | `4000`                                                       |                                          |
| `NODE_ENV`       | `development`                                                |                                          |
| `CORS_ORIGIN`    | `http://localhost:5173`                                      | Comma-separated for multiple origins.    |
| `MONGODB_URI`    | `mongodb+srv://user:pass@cluster.mongodb.net/smart-reviewer` | Atlas or `mongodb://localhost:27017/...` |
| `GNEWS_API_KEY`  | _required_                                                   | <https://gnews.io>                       |
| `GEMINI_API_KEY` | _required_                                                   | <https://aistudio.google.com/app/apikey> |

### `frontend/.env`

| Var                 | Example                 | Notes                           |
| ------------------- | ----------------------- | ------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:4000` | Backend origin (no trailing /). |

## Scripts

From the repo root:

```bash
npm run dev          # backend + frontend in parallel
npm run build        # builds both workspaces
npm run lint         # lints both workspaces
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

Per workspace (`backend/` or `frontend/`):

```bash
npm run dev          # tsx watch / vite
npm run build        # tsc / vite build
npm run lint         # eslint
```

## API reference

| Method | Path                         | Body / Query           | Returns                                               |
| ------ | ---------------------------- | ---------------------- | ----------------------------------------------------- |
| GET    | `/api/health`                | —                      | `{ status: "ok", uptime, db }`                        |
| GET    | `/api/news/search?q=<query>` | `q` ≥ 2 chars          | `{ articles: Article[] }` (10 max)                    |
| POST   | `/api/articles/analyze`      | `{ article: Article }` | `{ article, analysis, cached, originallyAnalyzedAt }` |
| GET    | `/api/articles`              | —                      | `{ items: HistoryItem[] }` (50 max)                   |

Errors use a uniform shape: `{ error: { code, message } }` with HTTP statuses
`400` (validation), `429` (upstream rate-limit), `502` (upstream failure),
`500` (internal).

## Core types

The frontend mirrors these in its own `types.ts` so both sides stay in sync.

| Type              | Shape                                                     | What it is                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Article`         | `{ url, title, description, source, publishedAt, image }` | A news article as it comes back from GNews and as it's stored in MongoDB. `url` is the unique key — the cache, the analyze request body, and the Mongoose unique index all hang off of it. |
| `Analysis`        | `{ summary, sentiment, score, reasoning? }`               | The Gemini output for one article. `sentiment` is `"positive" \| "neutral" \| "negative"`, `score` is a signed number in `[-1, 1]`, `reasoning` is a short rationale (kept for debugging). |
| `Sentiment`       | `"positive" \| "neutral" \| "negative"`                   | The categorical label rendered as the badge on cards and history rows.                                                                                                                     |
| `AnalyzeResponse` | `{ article, analysis, cached, originallyAnalyzedAt }`     | What `POST /api/articles/analyze` returns. `cached: true` means we served from MongoDB without calling Gemini; `originallyAnalyzedAt` is when the analysis was first persisted.            |
| `HistoryItem`     | `AnalyzeResponse & { id }`                                | A row in the History pane — same shape as an analyze response plus the Mongo document id for React keys.                                                                                   |

## Project structure

```
backend/
  src/
    config/        # env validation (zod)
    middleware/    # error handler, 404, ApiError
    models/        # Mongoose Article model (unique on url)
    routes/        # /news, /articles
    services/      # gnews, gemini, articles (cache-or-analyze)
frontend/
  src/
    api/           # axios clients + query keys
    components/    # Header, SearchResults, ArticleCard, HistoryPane, Drawer, ...
    hooks/         # useNewsSearch, useAnalyzeArticle, useHistory, useIsMobile, ...
    styles/        # tokens (base.css), animations, sr-only
```

## Notes — what I'd do with more time

- **Deploy** to Render (backend) + Vercel (frontend) + Atlas (DB). The README
  is install-ready in the meantime, as the brief allows.
- **Authentication & per-user history**: today history is global (single shared
  collection). With more time I'd add email/password or magic-link auth (e.g.
  Better-Auth or Clerk), scope `Article` documents by `userId`, and gate the
  `/api/articles*` routes behind a session middleware.
- **Personalized sentiment**: once users exist, sentiment shouldn't be a single
  global verdict — it should reflect _their_ stance. A reader could declare
  interests / stakes (e.g. long TSLA, anti-AI-hype, climate-positive) and the
  Gemini prompt would frame "positive/negative" from that perspective. Same
  article → different score per profile. Cache key would then become
  `(url, profileHash)` instead of just `url`.
- **Rate-limit middleware** on `POST /api/articles/analyze` (per-IP, sliding
  window) to harden the GenAI budget further.
- **Sort + free-text filter** in the History pane (currently filterable by
  sentiment only).
- **Optional re-analyze** with `?force=true` to refresh stale summaries.
- **Trend chart** of sentiment over time per topic.
- **Server-side sentiment fallback** (lexicon-based) when Gemini times out, so
  the row still gets a directional badge.
- **Test suite**: contract tests on routes, snapshot tests on cache hits.
