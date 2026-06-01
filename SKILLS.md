# CanadaPath AI - Skills & Setup

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript, Tailwind v4)
- **Database**: Supabase + pgvector (PostgreSQL vector extension)
- **LLM**: gemma-4-26b-a4b-it via Google AI Studio
- **Embeddings**: gemini-embedding-2 (3072-dim) via Google GenAI SDK
- **Scraping**: Puppeteer (dynamic import, single browser instance)
- **CRON**: GitHub Actions (9 AM, 3 PM daily)
- **Deploy**: Vercel (auto-deploy from GitHub)

## Project Setup
```bash
npm install
cp .env.example .env.local  # fill in your keys
npm run dev
```

## Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (no trailing `/rest/v1/`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_URL` | Same as above (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `SCRAPE_API_KEY` | Secret for `/api/scrape` endpoint |

## Supabase Setup
1. Create project at supabase.com
2. Run `supabase/schema.sql` in SQL Editor (omit the embedding INDEX line — pgvector caps at 2000 dims, our embeddings are 3072 dims)
3. Copy URL, anon key, service role key to `.env.local`
4. **Do not** append `/rest/v1/` to the URL — the Supabase client adds it automatically

## Key Architecture Decisions
- **No auth**: Device-based via localStorage device ID
- **CRON via GH Actions**: Free, no server needed for scraping
- **Embedding dim**: 3072
- **Chunk strategy**: 3072 chars per chunk, 256 overlap
- **Conversation naming**: Auto-named from first user question (truncated to 50 chars)

## RAG Pipeline
Query → embed (gemini-embedding-2) → cosine similarity search (threshold 0.5) → top-10 chunks → build prompt (system prompt + sources + history) → stream gemma-4 response → sanitize output → save to DB (with citations) → append `__META__` JSON to stream → client parses citations → render with inline `[Source N]` badges

## Guardrails
- Input sanitization (strip API keys, SIN, passport numbers)
- System prompt (not a lawyer, no guarantees, cite sources)
- Output validation via `sanitizeOutput()` (strip hallucinated claims, verify URLs)
- Citations served as clickable popup badges from parsed `[Source N]` markers

## Scraper Notes
- Single Puppeteer browser instance (`scrapeAllSources`) to avoid OOM
- `domcontentloaded` + 3s wait strategy (not `networkidle2`)
- 60s timeout per URL
- Expansion of WET-BOEW accordions via `expandAccordions()`
- Runs via `npx tsx scripts/scrape-and-embed.ts` (loads `.env.local` via `dotenv`)
- Dry-run: `npx tsx scripts/scrape-and-embed.ts --dry-run`

## Chat Completions Flow
1. Client sends `POST /api/chat` with `{ conversationId, message, deviceId }`
2. API saves user message → embeds query → `match_documents` RPC → builds prompt
3. Streams model response → saves assistant message with citations to DB
4. Appends `__META__{citations}__META__` at end of stream
5. Client parses `__META__`, strips it, creates `Message` with populated `citations` array
6. `ChatMessage` renders `[Source N]` as clickable badge popups via `CitationBadge`

## Known CSS Details
- Tailwind v4 puts utilities in CSS layers; custom `body` styles in `globals.css` must be wrapped in `@layer base` to avoid overriding utility classes
- Text colors: headings use `text-gray-900`, body text uses `text-gray-600`, small/dim text uses `text-gray-500`

## Deployment
Push to main → Vercel auto-deploys. Set all env vars from `.env.example` in Vercel dashboard. GH Actions workflow passes secrets as environment variables.
