import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Required environment variables when a real client connects:
//
//   FB_PAGE_ACCESS_TOKEN          — long-lived Page access token (Meta Business
//                                   Suite → System Users, or user token exchange)
//   FB_PAGE_ID                    — numeric Facebook Page ID
//   INSTAGRAM_BUSINESS_ACCOUNT_ID — Instagram Business Account ID linked to the Page
//
// Graph API base: https://graph.facebook.com/v19.0
// ---------------------------------------------------------------------------

const GRAPH_API = 'https://graph.facebook.com/v19.0'
const CRON_SECRET = process.env.CRON_SECRET || 'nith-cron-secret'

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get('Authorization') === `Bearer ${CRON_SECRET}`
}

type SocialPost = {
  id: string
  platform: 'facebook' | 'instagram' | 'both'
  content: string
  image_url: string | null
}

async function publishToFacebook(post: SocialPost): Promise<string> {
  const pageId = process.env.FB_PAGE_ID
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN

  if (!pageId || !pageToken) {
    console.log('[cron/publish-social] FB tokens not set — mock publish for post', post.id)
    return `mock-fb-${post.id}`
  }

  const body: Record<string, string> = {
    message: post.content,
    access_token: pageToken,
  }
  if (post.image_url) body.link = post.image_url

  const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `Facebook API error ${res.status}`)
  }
  return data.id as string
}

async function publishToInstagram(post: SocialPost): Promise<string> {
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN

  if (!igAccountId || !pageToken) {
    console.log('[cron/publish-social] Instagram tokens not set — mock publish for post', post.id)
    return `mock-ig-${post.id}`
  }

  // Step 1: create media container
  const containerRes = await fetch(`${GRAPH_API}/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      caption: post.content,
      image_url: post.image_url,
      access_token: pageToken,
    }),
  })
  const containerData = await containerRes.json()
  if (!containerRes.ok || containerData.error) {
    throw new Error(containerData.error?.message ?? `Instagram container error ${containerRes.status}`)
  }

  // Step 2: publish the container
  const publishRes = await fetch(`${GRAPH_API}/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerData.id,
      access_token: pageToken,
    }),
  })
  const publishData = await publishRes.json()
  if (!publishRes.ok || publishData.error) {
    throw new Error(publishData.error?.message ?? `Instagram publish error ${publishRes.status}`)
  }
  return publishData.id as string
}

async function runPublish() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date().toISOString()

  const { data: duePosts, error } = await supabase
    .from('social_posts')
    .select('id, platform, content, image_url')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })

  if (error) throw new Error(`Failed to query social_posts: ${error.message}`)
  if (!duePosts || duePosts.length === 0) return { processed: 0, results: [] }

  const results = []
  for (const post of duePosts as SocialPost[]) {
    const errors: string[] = []
    const ids: string[] = []

    if (post.platform === 'facebook' || post.platform === 'both') {
      try { ids.push(await publishToFacebook(post)) }
      catch (err) { errors.push(`Facebook: ${err instanceof Error ? err.message : String(err)}`) }
    }
    if (post.platform === 'instagram' || post.platform === 'both') {
      try { ids.push(await publishToInstagram(post)) }
      catch (err) { errors.push(`Instagram: ${err instanceof Error ? err.message : String(err)}`) }
    }

    const succeeded = ids.length > 0
    const status = errors.length === 0 ? 'published' : succeeded ? 'published' : 'failed'
    const metaPostId = ids.join(',') || null
    const errorMessage = errors.length > 0 ? errors.join(' | ') : null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('social_posts') as any)
      .update({
        status,
        published_at: succeeded ? new Date().toISOString() : null,
        meta_post_id: metaPostId,
        error_message: errorMessage,
      })
      .eq('id', post.id)

    results.push({ id: post.id, status, meta_post_id: metaPostId, error: errorMessage })
  }

  return { processed: results.length, results }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const result = await runPublish()
    return NextResponse.json({ status: 'ok', ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ status: 'error', error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}

export const maxDuration = 60
