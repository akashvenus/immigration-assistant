'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChatInterface } from '@/components/ChatInterface'
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

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [deviceId, setDeviceId] = useState('')
  const [loading, setLoading] = useState(true)

  const conversationId = params.id as string

  useEffect(() => {
    const id = getDeviceId()
    setDeviceId(id)
    loadData(id, conversationId)
  }, [conversationId])

  async function loadData(devId: string, convId: string) {
    try {
      const [convRes, msgsRes] = await Promise.all([
        fetch(`/api/conversations?deviceId=${devId}`),
        fetch(`/api/conversations/${convId}/messages`),
      ])

      if (convRes.ok) {
        const convData = await convRes.json()
        setConversations(convData)
      }

      if (msgsRes.ok) {
        const msgsData = await msgsRes.json()
        setMessages(msgsData)
      }
    } catch (e) {
      console.error('Failed to load data:', e)
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

  const handleMessagesChange = useCallback(async (newMessages: Message[]) => {
    setMessages(newMessages)

    const lastMsg = newMessages[newMessages.length - 1]
    if (lastMsg && newMessages.length === 1) {
      const title = lastMsg.content.slice(0, 50) + (lastMsg.content.length > 50 ? '...' : '')
      await fetch(`/api/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: conversationId,
          deviceId,
          title,
        }),
      })
    }
  }, [conversationId, deviceId])

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
        activeId={conversationId}
        onSelect={id => router.push(`/chat/${id}`)}
        onNew={handleNew}
        onDelete={async id => {
          await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
          setConversations(prev => prev.filter(c => c.id !== id))
          if (id === conversationId) router.push('/chat')
        }}
      />
      <ChatInterface
        conversationId={conversationId}
        deviceId={deviceId}
        messages={messages}
        onMessagesChange={handleMessagesChange}
      />
    </div>
  )
}
