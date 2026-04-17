import { MetadataRoute } from 'next'

const BASE = 'https://nithdigital.uk'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function fetchPublishedBlogPosts(): Promise<{ slug: string; published_at: string }[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,published_at&published=eq.true&order=published_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function fetchPublishedHelpArticles(): Promise<{ slug: string; created_at: string }[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/help_articles?select=slug,created_at&published=eq.true`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/book`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/launchpad`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/launchpad/checklist`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/launchpad/bundle`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tools/vat-checker`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/sole-trader-vs-limited`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/take-home-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/invoice-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/website-quote`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/site-audit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/help`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/os/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools/visibility-checker`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools/local-seo-scorecard`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools/mtd-checker`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools/expense-tracker`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/dashboards`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Location pages
    { url: `${BASE}/web-design/dumfries`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/web-design/thornhill`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/castle-douglas`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/stranraer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/newton-stewart`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/kirkcudbright`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/moffat`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/annan`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/lockerbie`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/sanquhar`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/dalbeattie`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/langholm`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/gatehouse-of-fleet`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/web-design/wigtown`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/power-bi/dumfries-galloway`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/power-bi/scotland`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/power-bi/small-business-scotland`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/microsoft-fabric/scotland`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/freelance-data-analyst/scotland`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/web-apps/dumfries-galloway`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tradedesk`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ]

  const [blogPosts, helpArticles] = await Promise.all([
    fetchPublishedBlogPosts(),
    fetchPublishedHelpArticles(),
  ])

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const helpEntries: MetadataRoute.Sitemap = helpArticles.map((article) => ({
    url: `${BASE}/help/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...blogEntries, ...helpEntries]
}
