import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.SCRAPE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    message: 'Scraping runs via GitHub Actions CRON. To trigger manually, push to main or run the workflow from GitHub Actions UI.',
    docs: 'Run: npx tsx scripts/scrape-and-embed.ts',
  })
}
