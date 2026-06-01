import { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { embedText } from '@/lib/rag/embedder'
import { sanitizeOutput } from '@/lib/guardrails/filters'
import { buildSystemPrompt } from '@/lib/guardrails/system-prompt'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, message, deviceId, simplified } = body

    if (!conversationId || !message || !deviceId) {
      return new Response(
        JSON.stringify({ error: 'conversationId, message, and deviceId required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await getSupabaseAdmin().from('messages').insert({
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'user',
      content: message,
      citations: [],
    })

    const queryEmbedding = await embedText(message)

    const { data: chunks } = await getSupabaseAdmin().rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 10,
    })

    const context = (chunks || []).map((c: any) => ({
      content: c.content,
      source_url: c.source_url,
      source_title: c.source_title,
    }))

    const { data: history } = await getSupabaseAdmin()
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10)

    const contextStr = context
      .map((c: any, i: number) => `[Source ${i + 1}] ${c.source_title} (${c.source_url})\n${c.content}`)
      .join('\n\n')

    const historyStr = (history || [])
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n')

    const systemPrompt = buildSystemPrompt(simplified)

    const fullPrompt = `${systemPrompt}

RELEVANT INFORMATION FROM OFFICIAL SOURCES:
${contextStr || 'No specific sources found. Answer based on general knowledge but note this.'}

CONVERSATION HISTORY:
${historyStr}

User question: ${message}

Provide a helpful, accurate answer based on the information above. Include citation markers like [Source 1], [Source 2] referencing the sources. If no sources match, say so clearly and suggest the user consult an RCIC.`

    const stream = await ai.models.generateContentStream({
      model: 'gemma-4-26b-a4b-it',
      contents: fullPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    })

    const encoder = new TextEncoder()
    const validUrls = context.map((c: any) => c.source_url)
    let fullResponse = ''

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }

          const finalResponse = sanitizeOutput(fullResponse, validUrls)

          const citations = context.map((c: any) => ({
            title: c.source_title || 'Source',
            url: c.source_url,
            snippet: c.content.slice(0, 200),
          }))

          await getSupabaseAdmin().from('messages').insert({
            id: crypto.randomUUID(),
            conversation_id: conversationId,
            role: 'assistant',
            content: finalResponse,
            citations,
          })

          await getSupabaseAdmin()
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId)

          const metaLine = `\n__META__${JSON.stringify({ citations })}__META__`
          controller.enqueue(encoder.encode(metaLine))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
