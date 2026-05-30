import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('deviceId')
  if (!deviceId) {
    return NextResponse.json({ error: 'deviceId required' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('conversations')
    .select('*')
    .eq('device_id', deviceId)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id, deviceId, title } = body

  if (!id || !deviceId) {
    return NextResponse.json({ error: 'id and deviceId required' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('conversations')
    .insert({ id, device_id: deviceId, title: title || 'New conversation' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
