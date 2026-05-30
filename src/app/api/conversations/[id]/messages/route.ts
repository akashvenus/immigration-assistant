import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await getSupabaseAdmin()
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { messageId, role, content, citations } = body

  if (!messageId || !role || !content) {
    return NextResponse.json({ error: 'messageId, role, content required' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('messages')
    .insert({
      id: messageId,
      conversation_id: id,
      role,
      content,
      citations: citations || [],
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await getSupabaseAdmin()
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json(data)
}
