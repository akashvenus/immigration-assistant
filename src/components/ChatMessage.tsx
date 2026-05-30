'use client'

import type { Message } from '@/types'
import { CitationBadge } from './CitationBadge'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  const renderContent = (content: string) => {
    const parts = content.split(/(\[\d+\])/g)
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/)
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
        {!isUser && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {message.citations.map((citation, i) => (
                <a
                  key={i}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {citation.title || `Source ${i + 1}`} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
