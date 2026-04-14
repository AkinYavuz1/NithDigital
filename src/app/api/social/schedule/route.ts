import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { client_id, platform, content, image_url, scheduled_at } = body

  if (!client_id || !platform || !content || !scheduled_at) {
    return NextResponse.json(
      { error: 'Missing required fields: client_id, platform, content, scheduled_at' },
      { status: 400 }
    )
  }

  if (!['facebook', 'instagram', 'both'].includes(platform)) {
    return NextResponse.json(
      { error: 'platform must be one of: facebook, instagram, both' },
      { status: 400 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('social_posts')
    .insert({
      client_id,
      platform,
      content,
      image_url: image_url ?? null,
      scheduled_at,
    })
    .select()
    .single()

  if (error) {
    console.error('social_posts insert error:', error)
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, post: data }, { status: 201 })
}
