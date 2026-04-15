import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FB_SECRET = process.env.FB_POST_SECRET || 'nith-fb-secret'
const PAGE_ID = process.env.FACEBOOK_PAGE_ID!
const PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!
const GRAPH_API = 'https://graph.facebook.com/v19.0'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${FB_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { dry_run } = await req.json().catch(() => ({}))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find next scheduled post that hasn't been published yet
  const now = new Date().toISOString()
  const { data: post, error } = await supabase
    .from('facebook_posts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', now)
    .order('scheduled_for', { ascending: true })
    .limit(1)
    .single()

  if (error || !post) {
    return NextResponse.json({ message: 'No posts due for publishing.', published: 0 })
  }

  if (dry_run) {
    return NextResponse.json({ dry_run: true, post: { week: post.week_number, topic: post.topic, content: post.content } })
  }

  // Atomically claim the post so a concurrent invocation (double-fired cron,
  // manual retry, etc.) can't publish the same row twice to Facebook.
  const { data: claimed, error: claimError } = await supabase
    .from('facebook_posts')
    .update({ status: 'publishing' })
    .eq('id', post.id)
    .eq('status', 'scheduled')
    .select('id')
  if (claimError || !claimed || claimed.length === 0) {
    return NextResponse.json({ message: 'Post already claimed by another run.', published: 0 })
  }

  // Post to Facebook Page
  try {
    const res = await fetch(`${GRAPH_API}/${PAGE_ID}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: post.content,
        access_token: PAGE_TOKEN,
      }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      const errMsg = data.error?.message || 'Unknown Facebook API error'
      await supabase
        .from('facebook_posts')
        .update({ status: 'failed', error: errMsg })
        .eq('id', post.id)
      return NextResponse.json({ error: errMsg, published: 0 }, { status: 500 })
    }

    await supabase
      .from('facebook_posts')
      .update({ status: 'published', published_at: new Date().toISOString(), facebook_post_id: data.id })
      .eq('id', post.id)

    return NextResponse.json({ published: 1, facebook_post_id: data.id, week: post.week_number, topic: post.topic })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase
      .from('facebook_posts')
      .update({ status: 'failed', error: message })
      .eq('id', post.id)
    return NextResponse.json({ error: message, published: 0 }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${FB_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: posts } = await supabase
    .from('facebook_posts')
    .select('week_number, post_type, topic, status, scheduled_for, published_at')
    .order('week_number', { ascending: true })

  const scheduled = (posts || []).filter(p => p.status === 'scheduled').length
  const published = (posts || []).filter(p => p.status === 'published').length
  const failed = (posts || []).filter(p => p.status === 'failed').length

  return NextResponse.json({ total: (posts || []).length, scheduled, published, failed, posts })
}
