'use client'

import { useState, useRef, useEffect } from 'react'
import type { Message } from '@/types'
import { ChatMessage } from './ChatMessage'
import { LanguageToggle } from './LanguageToggle'
import { DISCLAIMER } from '@/lib/guardrails/system-prompt'

interface ChatInterfaceProps {
  conversationId: string
  deviceId: string
  messages: Message[]
  onMessagesChange: (messages: Message[]) => void
}

export function ChatInterface({
  conversationId,
  deviceId,
  messages,
  onMessagesChange,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [simplified, setSimplified] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'user',
      content: input.trim(),
      citations: [],
      created_at: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    onMessagesChange(updatedMessages)
    setInput('')
    setLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: userMessage.content,
          deviceId,
          simplified,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          fullContent += chunk
          setStreamingContent(fullContent)
        }
      }

      let citations: import('@/types').Citation[] = []
      const metaMatch = fullContent.match(/__META__(\{.*\})__META__$/)
      if (metaMatch) {
        try {
          const meta = JSON.parse(metaMatch[1])
          citations = meta.citations || []
        } catch {}
        fullContent = fullContent.slice(0, metaMatch.index)
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: fullContent,
        citations,
        created_at: new Date().toISOString(),
      }

      onMessagesChange([...updatedMessages, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: "I'm sorry, I couldn't process that request. Please try again.",
        citations: [],
        created_at: new Date().toISOString(),
      }
      onMessagesChange([...updatedMessages, errorMessage])
    } finally {
      setLoading(false)
      setStreamingContent('')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">CanadaPath AI</h2>
        <LanguageToggle simplified={simplified} onChange={setSimplified} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && !streamingContent && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to CanadaPath AI
              </h3>
              <p className="text-gray-600 text-sm">
                Ask me anything about Canadian immigration pathways from student to PR. I can help with study permits, PGWP, Express Entry, PNP programs, and more.
              </p>
            </div>
          </div>
        )}

        {messages.filter(m => m.role === 'user' || m.content).map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {streamingContent && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[80%] bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamingContent}</p>
            </div>
          </div>
        )}

        {loading && !streamingContent && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {messages.length > 0 && (
          <p className="text-xs text-gray-500 text-center mt-4">{DISCLAIMER}</p>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about Canadian immigration..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
