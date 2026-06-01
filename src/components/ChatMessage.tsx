'use client'

import type { Message } from '@/types'
import { CitationBadge } from './CitationBadge'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  const renderContent = (content: string) => {
    const parts = content.split(/(\[Source [\d,\s]+\])/g)
    return parts.map((part, i) => {
      const match = part.match(/\[Source ([\d,\s]+)\]/)
      if (match) {
        const indices = match[1].split(',').map(s => parseInt(s.trim()) - 1)
        const validIndices = indices.filter(idx => message.citations[idx])
        if (validIndices.length > 0) {
          return (
            <span key={i} className="inline-flex gap-0.5">
              {validIndices.map(idx => (
                <CitationBadge
                  key={idx}
                  citation={message.citations[idx]}
                  index={idx}
                />
              ))}
            </span>
          )
        }
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
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  )
}
