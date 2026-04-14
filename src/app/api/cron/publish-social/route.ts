import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Credentials are stored per-client in the social_clients table.
// Cron picks up all due posts across all active clients in one pass.
// Graph API base: https://graph.facebook.com/v19.0
// ---------------------------------------------------------------------------

const GRAPH_API = 'https://graph.facebook.com/v19.0'
const CRON_SECRET = process.env.CRON_SECRET || 'nith-cron-secret'

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get('Authorization') === `Bearer ${CRON_SECRET}`
}

type ClientCredentials = {
  fb_page_id: string
  fb_page_access_token: string
  instagram_business_account_id: string | null
  active: boolean
}

type SocialPost = {
  id: string
  platform: 'facebook' | 'instagram' | 'both'
  content: string
  image_url: string | null
  social_clients: ClientCredentials
}

async function publishToFacebook(post: SocialPost, creds: ClientCredentials): Promise<string> {
  const body: Record<string, string> = {
    message: post.content,
    access_token: creds.fb_page_access_token,
  }
  if (post.image_url) body.link = post.image_url

  const res = await fetch(`${GRAPH_API}/${creds.fb_page_id}/feed`, {
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

async function publishToInstagram(post: SocialPost, creds: ClientCredentials): Promise<string> {
  if (!creds.instagram_business_account_id) {
    throw new Error('No Instagram Business Account ID configured for this client')
  }

  const containerRes = await fetch(`${GRAPH_API}/${creds.instagram_business_account_id}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      caption: post.content,
      image_url: post.image_url,
      access_token: creds.fb_page_access_token,
    }),
  })
  const containerData = await containerRes.json()
  if (!containerRes.ok || containerData.error) {
    throw new Error(containerData.error?.message ?? `Instagram container error ${containerRes.status}`)
  }

  const publishRes = await fetch(`${GRAPH_API}/${creds.instagram_business_account_id}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerData.id,
      access_token: creds.fb_page_access_token,
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

  // Fetch all due posts with their client credentials in one query
  const { data: duePosts, error } = await supabase
    .from('social_posts')
    .select('id, platform, content, image_url, social_clients(fb_page_id, fb_page_access_token, instagram_business_account_id, active)')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })

  if (error) throw new Error(`Failed to query social_posts: ${error.message}`)
  if (!duePosts || duePosts.length === 0) return { processed: 0, results: [] }

  const results = []
  for (const post of duePosts as SocialPost[]) {
    const creds = post.social_clients

    if (!creds?.active) {
      await supabase
        .from('social_posts')
        .update({ status: 'failed', error_message: 'Client inactive or missing credentials' })
        .eq('id', post.id)
      results.push({ id: post.id, status: 'failed', error: 'Client inactive' })
      continue
    }

    const errors: string[] = []
    const ids: string[] = []

    if (post.platform === 'facebook' || post.platform === 'both') {
      try { ids.push(await publishToFacebook(post, creds)) }
      catch (err) { errors.push(`Facebook: ${err instanceof Error ? err.message : String(err)}`) }
    }
    if (post.platform === 'instagram' || post.platform === 'both') {
      try { ids.push(await publishToInstagram(post, creds)) }
      catch (err) { errors.push(`Instagram: ${err instanceof Error ? err.message : String(err)}`) }
    }

    const succeeded = ids.length > 0
    const status = errors.length === 0 ? 'published' : succeeded ? 'published' : 'failed'
    const metaPostId = ids.join(',') || null
    const errorMessage = errors.length > 0 ? errors.join(' | ') : null

    await supabase
      .from('social_posts')
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
