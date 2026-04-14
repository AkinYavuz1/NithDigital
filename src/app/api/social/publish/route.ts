import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Required environment variables when a real client connects:
//
//   FB_PAGE_ACCESS_TOKEN          — long-lived Page access token obtained via
//                                   Meta Business Suite → System Users, or by
//                                   exchanging a user token for a page token.
//                                   Refresh annually (or use a never-expiring
//                                   system user token).
//
//   FB_PAGE_ID                    — the numeric Page ID, e.g. "123456789012345"
//
//   INSTAGRAM_BUSINESS_ACCOUNT_ID — the Instagram Business Account ID linked
//                                   to the Facebook Page (find it in
//                                   GET /{page-id}?fields=instagram_business_account)
//
// Graph API base: https://graph.facebook.com/v19.0
// Facebook post endpoint:   POST /{FB_PAGE_ID}/feed
// Instagram post endpoints: POST /{INSTAGRAM_BUSINESS_ACCOUNT_ID}/media  (create container)
//                           POST /{INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish (publish)
// ---------------------------------------------------------------------------

const GRAPH_API = 'https://graph.facebook.com/v19.0'

async function publishToFacebook(post: {
  id: string
  content: string
  image_url: string | null
}): Promise<string> {
  const pageId = process.env.FB_PAGE_ID
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN

  // Placeholder: tokens not yet configured for this client
  if (!pageId || !pageToken) {
    console.log('[social/publish] FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN not set — mock publish', {
      postId: post.id,
      endpoint: `${GRAPH_API}/${pageId ?? '<FB_PAGE_ID>'}/feed`,
      payload: { message: post.content, ...(post.image_url ? { link: post.image_url } : {}) },
    })
    return `mock-fb-${Date.now()}`
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

async function publishToInstagram(post: {
  id: string
  content: string
  image_url: string | null
}): Promise<string> {
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN

  // Placeholder: tokens not yet configured for this client
  if (!igAccountId || !pageToken) {
    console.log('[social/publish] INSTAGRAM_BUSINESS_ACCOUNT_ID / FB_PAGE_ACCESS_TOKEN not set — mock publish', {
      postId: post.id,
      step1: `POST ${GRAPH_API}/${igAccountId ?? '<INSTAGRAM_BUSINESS_ACCOUNT_ID>'}/media`,
      step2: `POST ${GRAPH_API}/${igAccountId ?? '<INSTAGRAM_BUSINESS_ACCOUNT_ID>'}/media_publish`,
      payload: { caption: post.content, image_url: post.image_url ?? '<required>' },
    })
    return `mock-ig-${Date.now()}`
  }

  // Step 1: create media container (image required for Instagram)
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

  const { data: post, error: fetchError } = await supabase
    .from('social_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (post.status === 'published') {
    return NextResponse.json({ error: 'Post already published' }, { status: 409 })
  }

  const results: Record<string, string> = {}
  const errors: string[] = []

  if (post.platform === 'facebook' || post.platform === 'both') {
    try {
      results.facebook_id = await publishToFacebook(post)
    } catch (err) {
      errors.push(`Facebook: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (post.platform === 'instagram' || post.platform === 'both') {
    try {
      results.instagram_id = await publishToInstagram(post)
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
