import { config } from 'dotenv'
import { scrapeAllSources } from '../src/lib/scraper'
import { getSupabaseAdmin } from '../src/lib/supabase/admin'

config({ path: '.env.local' })

async function main() {
  const { embedText } = await import('@/lib/rag/embedder')

  const dryRun = process.argv.includes('--dry-run')
  console.log(`Starting scrape ${dryRun ? '(DRY RUN)' : ''}...`)

  const chunks = await scrapeAllSources()
  console.log(`Scraped ${chunks.length} chunks from all sources`)

  if (dryRun) {
    console.log('\nSample chunks:')
    chunks.slice(0, 3).forEach(c => {
      console.log(`- [${c.category}] ${c.source_title} (chunk ${c.chunk_index})`)
      console.log(`  ${c.content.slice(0, 150)}...\n`)
    })
    console.log(`Total: ${chunks.length} chunks ready for embedding`)
    return
  }

  let embedded = 0
  let errors = 0

  for (const chunk of chunks) {
    try {
      const embedding = await embedText(chunk.content)
      const id = Buffer.from(chunk.source_url).toString('base64').slice(0, 20) + '_' + chunk.chunk_index

      const { error } = await getSupabaseAdmin().from('documents').upsert(
        {
          id,
          source_url: chunk.source_url,
          source_title: chunk.source_title,
          content: chunk.content,
          chunk_index: chunk.chunk_index,
          embedding,
          metadata: { category: chunk.category, scraped_at: new Date().toISOString() },
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

  console.log(`\nDone! Embedded: ${embedded}, Errors: ${errors}`)
}

main().catch(console.error)
