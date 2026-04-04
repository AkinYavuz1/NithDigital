export const dynamic = 'force-dynamic'

const BASE = 'https://nithdigital.uk'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  published_at: string
  author: string
  category: string
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  let posts: BlogPost[] = []

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,excerpt,published_at,author,category&published=eq.true&order=published_at.desc&limit=50`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    )
    if (res.ok) {
      posts = await res.json()
    }
  } catch {
    // return empty feed on error
  }

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <author>hello@nithdigital.uk (${escapeXml(post.author)})</author>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
    </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nith Digital Blog</title>
    <link>${BASE}/blog</link>
    <description>Practical guides for starting and growing a business in Dumfries &amp; Galloway</description>
    <language>en-GB</language>
    <atom:link href="${BASE}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <copyright>© ${new Date().getFullYear()} Nith Digital</copyright>
    <managingEditor>hello@nithdigital.uk (Akin Yavuz)</managingEditor>
    <webMaster>hello@nithdigital.uk (Akin Yavuz)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
