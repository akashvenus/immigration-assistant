# CanadaPath AI

Canadian immigration assistant (student → PR pathways) using RAG with Gemma 4 via Google AI Studio and Supabase pgvector.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Google GenAI SDK (Gemini 2.0 Flash, Gemini Embedding)
- **Vector DB:** Supabase pgvector
- **Scraper:** Puppeteer
- **Deployment:** Vercel + GitHub Actions

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (no trailing path) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_URL` | Same as above (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `SCRAPE_API_KEY` | Secret for protecting `/api/scrape` |

### 2. Database

Run `supabase/schema.sql` in your Supabase **SQL Editor** to create tables, indexes, and the `match_documents` RPC.

> **Note:** The schema omits the embedding index (pgvector caps indexes at 2000 dims, but our embeddings are 3072 dims). Full scans work fine for demo-scale data.

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scraper

Scrapes Canada.ca immigration pages, chunks text, and embeds into Supabase.

```bash
# Dry run (scrape only, no DB)
npx tsx scripts/scrape-and-embed.ts --dry-run

# Full run (scrape + embed + upsert)
npx tsx scripts/scrape-and-embed.ts
```

### Scheduled Scraping

GitHub Actions runs daily at 9 AM and 3 PM via `.github/workflows/scrape.yml`. The workflow passes secrets as environment variables.

## API Routes

| Route | Description |
|---|---|
| `POST /api/chat` | RAG chat: embed query → vector search → stream Gemma 4 |
| `GET /api/conversations` | List conversations for a device |
| `POST /api/conversations` | Create a conversation |
| `GET /api/conversations/[id]` | Get a conversation |
| `GET /api/conversations/[id]/messages` | Get messages for a conversation |
| `POST /api/scrape` | Trigger scraper (requires `SCRAPE_API_KEY`) |

## Architecture

```
User → Chat UI → POST /api/chat → embed query → vector search (Supabase)
  → build prompt → stream Gemma 4 (Google AI) → sanitize → save → render
```

## Deployment

Push to GitHub — Vercel auto-deploys. Set all environment variables from `.env.example` in the Vercel dashboard.
