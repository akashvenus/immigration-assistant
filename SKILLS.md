# CanadaPath AI - Skills & Setup

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript, Tailwind)
- **Database**: Supabase + pgvector (PostgreSQL vector extension)
- **LLM**: Gemma 4 26B via Google AI Studio API
- **Embeddings**: Gemini Embedding 2 (3072-dim) via Google AI Studio
- **Scraping**: Cheerio (static) + Puppeteer (dynamic)
- **CRON**: GitHub Actions (9:00 AM, 3:00 PM daily)
- **Deploy**: Vercel (auto-deploy from GitHub)

## Project Setup
```bash
npm install
cp .env.example .env.local  # fill in your keys
npm run dev
```

## Supabase Setup
1. Create project at supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Enable pgvector extension
4. Copy URL, anon key, service role key to `.env.local`

## Key Architecture Decisions
- **No auth**: Device-based via localStorage device ID
- **CRON via GH Actions**: Free, no server needed for scraping
- **Embedding dim**: 3072 (Gemini Embedding 2)
- **Chunk strategy**: 3072 chars per chunk, 256 overlap

## RAG Pipeline
Query → embed → cosine similarity search → top-5 chunks → guardrails prompt → Gemma 4 generation → output filter

## Guardrails
- Input sanitization (strip API keys, SIN, passport numbers)
- System prompt (not a lawyer, no guarantees, recommend RCIC)
- Output validation (verify citations, strip hallucinated claims)

## Deployment
Push to main → Vercel auto-deploys. Set all env vars in Vercel dashboard.
