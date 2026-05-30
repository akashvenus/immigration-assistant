# CanadaPath AI - Agent Instructions

## Project Overview
Canadian immigration assistant (student → PR pathways) using RAG with Gemma 4 26B via Google AI Studio and Supabase pgvector.

## Context Window
Always read these files first when making changes:
- `src/lib/guardrails/system-prompt.ts`
- `supabase/schema.sql`
- `src/lib/rag/*.ts`

## Coding Conventions
- TypeScript strict mode, no semicolons, named exports
- Absolute imports using `@/` (e.g., `@/lib/supabase/client`)
- Components in `src/components/`, API in `src/app/api/`, lib in `src/lib/`

## Data Flow
Chat: UI → POST `/api/chat` → embed query → vector search → build prompt → stream Gemma 4 → save → render

## Guardrails Extension
If adding new guardrail patterns, update both `filters.ts` and `system-prompt.ts`.

## Scraping Protocol
Never scrape without chunking. Always store `source_url`. Respect robots.txt. Chunk at 3072 chars with 256 overlap.

## Testing
- Chat API: `curl -X POST localhost:3000/api/chat -d '{"message":"...","deviceId":"test"}'`
- Scraper: `npx tsx scripts/scrape-and-embed.ts --dry-run`
