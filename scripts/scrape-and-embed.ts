import { config } from 'dotenv'
import { scrapeAllSources } from '../src/lib/scraper'
import { getSupabaseAdmin } from '../src/lib/supabase/admin'
import type { ScrapedChunk } from '../src/lib/scraper'

config({ path: '.env.local' })

async function main() {
  const { embedText } = await import('@/lib/rag/embedder')

  const dryRun = process.argv.includes('--dry-run')

  const { data: existingDocs } = await getSupabaseAdmin()
    .from('documents')
    .select('source_url, metadata')

  const existingHashes = new Map<string, string>()
  for (const doc of existingDocs || []) {
    if (!existingHashes.has(doc.source_url)) {
      existingHashes.set(doc.source_url, doc.metadata?.content_hash || '')
    }
  }

  const chunks = await scrapeAllSources()
  console.log(`Scraped ${chunks.length} chunks from all sources`)

  const byUrl = new Map<string, ScrapedChunk[]>()
  for (const chunk of chunks) {
    const arr = byUrl.get(chunk.source_url) || []
    arr.push(chunk)
    byUrl.set(chunk.source_url, arr)
  }

  if (dryRun) {
    for (const [url, urlChunks] of byUrl) {
      const currentHash = urlChunks[0].content_hash
      const existingHash = existingHashes.get(url)
      const status = existingHash === currentHash ? 'UP TO DATE' : 'NEW/CHANGED'
      console.log(`  [${status}] ${url} (${urlChunks.length} chunks, hash: ${currentHash})`)
      if (urlChunks.length > 0) {
        console.log(`  Content preview: ${urlChunks[0].content.slice(0, 120)}...\n`)
      }
    }
    console.log(`\nTotal: ${chunks.length} chunks from ${byUrl.size} URLs`)
    return
  }

  let embedded = 0
  let errors = 0
  let skipped = 0

  for (const [url, urlChunks] of byUrl) {
    const currentHash = urlChunks[0].content_hash
    const existingHash = existingHashes.get(url)

    if (existingHash === currentHash) {
      console.log(`✓ data up to date for ${url}`)
      skipped += urlChunks.length
      continue
    }

    for (const chunk of urlChunks) {
      try {
        const embedding = await embedText(chunk.content)
        const id = chunk.source_url + '::' + chunk.chunk_index

        const { error } = await getSupabaseAdmin().from('documents').upsert(
          {
            id,
            source_url: chunk.source_url,
            source_title: chunk.source_title,
            content: chunk.content,
            chunk_index: chunk.chunk_index,
            embedding,
            metadata: {
              category: chunk.category,
              content_hash: currentHash,
              scraped_at: new Date().toISOString(),
            },
          },
          { onConflict: 'id' }
        )

        if (error) {
          console.error(`Upsert error for ${chunk.source_url}:`, error)
          errors++
        } else {
          embedded++
        }
      } catch (e) {
        console.error(`Error processing ${chunk.source_url}:`, e)
        errors++
      }
    }
  }

  await getSupabaseAdmin().from('site_meta').upsert(
    { key: 'last_updated', value: new Date().toISOString(), updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  )

  console.log(`\nDone! Embedded: ${embedded}, Up to date: ${skipped}, Errors: ${errors}`)
}

main().catch(console.error)
