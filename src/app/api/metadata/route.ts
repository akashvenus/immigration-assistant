import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data } = await getSupabaseAdmin()
      .from('site_meta')
      .select('value')
      .eq('key', 'last_updated')
      .single()

    return NextResponse.json({
      lastUpdated: data?.value || null,
    })
  } catch {
    return NextResponse.json({ lastUpdated: null })
  }
}
