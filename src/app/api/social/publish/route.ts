import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Credentials are stored per-client in the social_clients table, not env vars.
// Graph API base: https://graph.facebook.com/v19.0
// Facebook:  POST /{fb_page_id}/feed
// Instagram: POST /{instagram_business_account_id}/media  → media_publish
// ---------------------------------------------------------------------------

const GRAPH_API = 'https://graph.facebook.com/v19.0'

type ClientCredentials = {
  fb_page_id: string
  fb_page_access_token: string
  instagram_business_account_id: string | null
}

async function publishToFacebook(
  post: { id: string; content: string; image_url: string | null },
  creds: ClientCredentials
): Promise<string> {
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

async function publishToInstagram(
  post: { id: string; content: string; image_url: string | null },
  creds: ClientCredentials
): Promise<string> {
  if (!creds.instagram_business_account_id) {
    throw new Error('No Instagram Business Account ID configured for this client')
  }

  // Step 1: create media container (image required)
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

  // Step 2: publish the container
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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id } = body
  if (!id) {
    return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch post + client credentials in one join
  const { data: post, error: fetchError } = await supabase
    .from('social_posts')
    .select('*, social_clients(fb_page_id, fb_page_access_token, instagram_business_account_id, active)')
    .eq('id', id)
    .single()

  if (fetchError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  if (post.status === 'published') {
    return NextResponse.json({ error: 'Post already published' }, { status: 409 })
  }

  const creds = post.social_clients as ClientCredentials & { active: boolean }
  if (!creds?.active) {
    return NextResponse.json({ error: 'Client is inactive or credentials not found' }, { status: 422 })
  }

  const results: Record<string, string> = {}
  const errors: string[] = []

  if (post.platform === 'facebook' || post.platform === 'both') {
    try {
      results.facebook_id = await publishToFacebook(post, creds)
    } catch (err) {
      errors.push(`Facebook: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (post.platform === 'instagram' || post.platform === 'both') {
    try {
      results.instagram_id = await publishToInstagram(post, creds)
    } catch (err) {
      errors.push(`Instagram: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const succeeded = Object.keys(results).length > 0
  const metaPostId = Object.values(results).join(',') || null
  const newStatus = errors.length === 0 ? 'published' : succeeded ? 'published' : 'failed'

  await supabase
    .from('social_posts')
    .update({
      status: newStatus,
      published_at: succeeded ? new Date().toISOString() : null,
      meta_post_id: metaPostId,
      error_message: errors.length > 0 ? errors.join(' | ') : null,
    })
    .eq('id', id)

  return NextResponse.json({
    ok: succeeded,
    status: newStatus,
    meta_post_id: metaPostId,
    ...(errors.length > 0 ? { errors } : {}),
  })
}
