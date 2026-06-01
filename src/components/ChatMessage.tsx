'use client'

import type { Message } from '@/types'
import { CitationBadge } from './CitationBadge'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  const renderContent = (content: string) => {
    const parts = content.split(/(\[Source \d+\])/g)
    return parts.map((part, i) => {
      const match = part.match(/\[Source (\d+)\]/)
      if (match && message.citations[parseInt(match[1]) - 1]) {
        const idx = parseInt(match[1]) - 1
        return (
          <CitationBadge
            key={i}
            citation={message.citations[idx]}
            index={idx}
          />
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {renderContent(message.content)}
        </p>
      </div>
    </div>
  )
}
