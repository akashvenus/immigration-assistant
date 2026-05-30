export interface Chunk {
  content: string
  index: number
}

export function chunkText(text: string, chunkSize = 3072, overlap = 256): Chunk[] {
  if (!text || text.length === 0) return []

  const chunks: Chunk[] = []
  let start = 0

  while (start < text.length) {
    let end = start + chunkSize
    if (end >= text.length) {
      chunks.push({ content: text.slice(start).trim(), index: chunks.length })
      break
    }

    let splitAt = text.lastIndexOf('\n\n', end)
    if (splitAt <= start) {
      splitAt = text.lastIndexOf('\n', end)
    }
    if (splitAt <= start) {
      splitAt = text.lastIndexOf('. ', end) + 1
    }
    if (splitAt <= start) {
      splitAt = end
    }

    chunks.push({ content: text.slice(start, splitAt).trim(), index: chunks.length })
    start = splitAt - overlap
    if (start < 0) start = 0
  }

  return chunks.filter(c => c.content.length > 50)
}
