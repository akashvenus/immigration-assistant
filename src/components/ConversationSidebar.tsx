'use client'

import type { Conversation } from '@/types'

interface ConversationSidebarProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <div className="w-72 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNew}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + New Conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8">
            No conversations yet
          </p>
        )}
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer mb-1 transition-colors ${
              conv.id === activeId
                ? 'bg-blue-100 text-blue-900'
                : 'hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <p className="text-sm truncate flex-1">{conv.title}</p>
            <button
              onClick={e => {
                e.stopPropagation()
                onDelete(conv.id)
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-xs ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
