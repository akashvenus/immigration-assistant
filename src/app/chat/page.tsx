'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ConversationSidebar } from '@/components/ConversationSidebar'
import type { Conversation, Message } from '@/types'

function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('canadapath_device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('canadapath_device_id', id)
  }
  return id
}

export default function ChatListPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [deviceId, setDeviceId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = getDeviceId()
    setDeviceId(id)
    fetchConversations(id)
  }, [])

  async function fetchConversations(devId: string) {
    try {
      const res = await fetch(`/api/conversations?deviceId=${devId}`)
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch (e) {
      console.error('Failed to fetch conversations:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = useCallback(async () => {
    const id = crypto.randomUUID()
    const devId = getDeviceId()

    await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, deviceId: devId, title: 'New conversation' }),
    })

    router.push(`/chat/${id}`)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <ConversationSidebar
        conversations={conversations}
        activeId={null}
        onSelect={id => router.push(`/chat/${id}`)}
        onNew={handleNew}
        onDelete={async id => {
          await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
          setConversations(prev => prev.filter(c => c.id !== id))
        }}
      />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            Welcome to CanadaPath AI
          </h2>
          <p className="text-gray-500 mb-6">
            Start a new conversation or select an existing one to continue.
          </p>
          <button
            onClick={handleNew}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            + New Conversation
          </button>
        </div>
      </div>
    </div>
  )
}
