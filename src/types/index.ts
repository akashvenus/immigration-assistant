export interface Conversation {
  id: string
  device_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  citations: Citation[]
  created_at: string
}

export interface Citation {
  title: string
  url: string
  snippet: string
}

export interface ChunkResult {
  id: string
  content: string
  source_url: string
  source_title: string
  chunk_index: number
  similarity: number
}

export interface ScrapeSource {
  url: string
  category: string
  label: string
}
