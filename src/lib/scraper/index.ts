import { createHash } from 'crypto'
import { SCRAPE_SOURCES } from './sources'
import { chunkText } from './chunker'
import type { ScrapeSource } from '@/types'

export interface ScrapedChunk {
  source_url: string
  source_title: string
  content: string
  chunk_index: number
  category: string
  content_hash: string
}

async function expandAccordions(page: any): Promise<void> {
  const selectors = [
    'details summary',
    '[data-wb-toggle]',
    '.wb-toggle',
    '.accordion .accordion-toggle',
  ]

  for (const selector of selectors) {
    try {
      const handles = await page.$$(selector)
      for (const handle of handles) {
        try {
          await handle.click()
          await new Promise(r => setTimeout(r, 100))
        } catch {
          // skip
        }
      }
    } catch {
      // skip
    }
  }
}

export async function scrapeUrl(url: string, browser: any): Promise<ScrapedChunk[]> {
  const page = await browser.newPage()

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await new Promise(r => setTimeout(r, 3000))

    await expandAccordions(page)
    await new Promise(r => setTimeout(r, 500))

    const result = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || document.title

      const main = document.querySelector('main') ||
        document.querySelector('article') ||
        document.querySelector('[role="main"]') ||
        document.querySelector('#content') ||
        document.body

      const clone = main.cloneNode(true) as HTMLElement
      const removals = clone.querySelectorAll(
        'script, style, nav:not(.gc-subway), footer, header, .alert, .breadcrumb, iframe, .pager, .pagedetails, #wb-info'
      )
      removals.forEach(el => el.remove())

      return {
        title,
        content: clone.textContent || '',
      }
    })

    const cleaned = result.content
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    if (cleaned.length < 100) {
      console.warn(`Skipping ${url}: content too short (${cleaned.length} chars)`)
      return []
    }

    const contentHash = createHash('sha256').update(cleaned).digest('hex').slice(0, 16)
    const chunks = chunkText(cleaned)
    return chunks.map(chunk => ({
      source_url: url,
      source_title: result.title,
      content: chunk.content,
      chunk_index: chunk.index,
      category: '',
      content_hash: contentHash,
    }))
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, (error as Error).message)
    return []
  } finally {
    await page.close()
  }
}

export async function scrapeSource(source: ScrapeSource, browser: any): Promise<ScrapedChunk[]> {
  const chunks = await scrapeUrl(source.url, browser)
  return chunks.map(c => ({ ...c, category: source.category }))
}

export async function scrapeAllSources(): Promise<ScrapedChunk[]> {
  const { default: puppeteer } = await import('puppeteer')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const results = await Promise.allSettled(
      SCRAPE_SOURCES.map(source => scrapeSource(source, browser))
    )
    return results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => (r as PromiseFulfilledResult<ScrapedChunk[]>).value)
  } finally {
    await browser.close()
  }
}
