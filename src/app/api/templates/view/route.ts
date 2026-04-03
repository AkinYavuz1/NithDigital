import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

    const { data } = await supabase
      .from('templates')
      .select('usage_count')
      .eq('slug', slug)
      .single()

    if (data) {
      await supabase
        .from('templates')
        .update({ usage_count: (data.usage_count ?? 0) + 1 })
        .eq('slug', slug)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
