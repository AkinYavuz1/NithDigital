import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

interface ScrapedBusiness {
  name: string
  website: string | null
  phone: string | null
  address: string | null
  category: string | null
  source: string
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

// ---------------------------------------------------------------------------
// Scraper: D&G Chamber of Commerce — dgchamber.co.uk/members
// ---------------------------------------------------------------------------
async function scrapeDGChamber(): Promise<ScrapedBusiness[]> {
  const businesses: ScrapedBusiness[] = []
  const baseUrl = 'https://www.dgchamber.co.uk'

  try {
    // Fetch the member directory
    const html = await fetchHtml(`${baseUrl}/members`)

    // Extract member entries - look for member listing patterns
    const memberPattern = /<div[^>]*class="[^"]*member[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
    const linkPattern = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
    const phonePattern = /(\+44\s?|0)[\d\s]{9,12}/g
    const websitePattern = /https?:\/\/(?!dgchamber)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}[^\s"<>]*/g

    // Extract all links that look like member profiles
    const profileLinks: string[] = []
    let match
    while ((match = linkPattern.exec(html)) !== null) {
      const href = match[1]
      if (href.includes('/member/') || href.includes('/members/') || href.includes('/directory/')) {
        const fullUrl = href.startsWith('http') ? href : `${baseUrl}${href}`
        if (!profileLinks.includes(fullUrl)) profileLinks.push(fullUrl)
      }
    }

    // If we got profile links, fetch the first 30
    const toFetch = profileLinks.slice(0, 30)

    for (const profileUrl of toFetch) {
      try {
        const profileHtml = await fetchHtml(profileUrl)
        const name = profileHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || null
        const website = profileHtml.match(websitePattern)?.[0] || null
        const phone = profileHtml.match(phonePattern)?.[0]?.trim() || null
        const category = profileHtml.match(/(?:sector|category|industry)[^:]*:\s*<[^>]+>([\s\S]*?)<\/[^>]+>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || null

        if (name) {
          businesses.push({ name, website, phone, address: 'Dumfries & Galloway', category, source: 'DG Chamber' })
        }
      } catch {
        // skip failed profiles
      }
    }

    // Fallback: parse any business names directly from the directory listing
    if (businesses.length === 0) {
      const h2Pattern = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi
      let h2Match
      while ((h2Match = h2Pattern.exec(html)) !== null) {
        const name = h2Match[1].replace(/<[^>]+>/g, '').trim()
        if (name && name.length > 2 && name.length < 80 && !name.toLowerCase().includes('chamber')) {
          businesses.push({ name, website: null, phone: null, address: 'Dumfries & Galloway', category: null, source: 'DG Chamber' })
        }
      }
    }
  } catch (err) {
    console.error('DG Chamber scrape error:', err)
  }

  return businesses
}

// ---------------------------------------------------------------------------
// Scraper: Yell.com — businesses in Dumfries & Galloway
// ---------------------------------------------------------------------------
async function scrapeYell(category: string = 'business'): Promise<ScrapedBusiness[]> {
  const businesses: ScrapedBusiness[] = []

  try {
    const url = `https://www.yell.com/ucs/UcsSearchAction.do?keywords=${encodeURIComponent(category)}&location=Dumfries+%26+Galloway&scrambleSeed=0`
    const html = await fetchHtml(url)

    // Yell listing pattern
    const listingPattern = /<article[^>]*class="[^"]*businessCapsule[^"]*"[^>]*>([\s\S]*?)<\/article>/gi
    let match
    while ((match = listingPattern.exec(html)) !== null) {
      const block = match[1]
      const name = block.match(/class="[^"]*businessCapsule--name[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || null
      const phone = block.match(/class="[^"]*phone[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || null
      const address = block.match(/class="[^"]*address[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || null
      const website = block.match(/href="(https?:\/\/(?!yell\.com)[^"]+)"[^>]*>\s*(?:Visit|Website)/i)?.[1] || null
      const cat = block.match(/class="[^"]*categories[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || category

      if (name) {
        businesses.push({ name, website, phone, address, category: cat, source: 'Yell.com' })
      }
    }
  } catch (err) {
    console.error('Yell scrape error:', err)
  }

  return businesses
}

// ---------------------------------------------------------------------------
// Scraper: Thomson Local — Dumfries businesses
// ---------------------------------------------------------------------------
async function scrapeThomsonLocal(category: string = 'business'): Promise<ScrapedBusiness[]> {
  const businesses: ScrapedBusiness[] = []

  try {
    const url = `https://www.thomsonlocal.com/search/${encodeURIComponent(category)}/dumfries-and-galloway`
    const html = await fetchHtml(url)

    const listingPattern = /<div[^>]*class="[^"]*listing[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div[^>]*class="[^"]*listing)/gi
    let match
    while ((match = listingPattern.exec(html)) !== null) {
      const block = match[1]
      const name = block.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || null
      const phone = block.match(/(\+44\s?|0)[\d\s]{9,12}/)?.[0]?.trim() || null
      const address = block.match(/class="[^"]*address[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || null
      const website = block.match(/href="(https?:\/\/(?!thomsonlocal)[^"]+)"/i)?.[1] || null

      if (name) {
        businesses.push({ name, website, phone, address, category, source: 'Thomson Local' })
      }
    }
  } catch (err) {
    console.error('Thomson Local scrape error:', err)
  }

  return businesses
}

// ---------------------------------------------------------------------------
// Scraper: Scoot.co.uk
// ---------------------------------------------------------------------------
async function scrapeScoot(category: string = 'business'): Promise<ScrapedBusiness[]> {
  const businesses: ScrapedBusiness[] = []

  try {
    const url = `https://www.scoot.co.uk/find/${encodeURIComponent(category)}-in-Dumfries-DG1`
    const html = await fetchHtml(url)

    const listingPattern = /<li[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)<\/li>/gi
    let match
    while ((match = listingPattern.exec(html)) !== null) {
      const block = match[1]
      const name = block.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || null
      const phone = block.match(/(\+44\s?|0)[\d\s]{9,12}/)?.[0]?.trim() || null
      const website = block.match(/href="(https?:\/\/(?!scoot)[^"]+)"/i)?.[1] || null

      if (name) {
        businesses.push({ name, website, phone, address: 'Dumfries & Galloway', category, source: 'Scoot' })
      }
    }
  } catch (err) {
    console.error('Scoot scrape error:', err)
  }

  return businesses
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const secret = process.env.EMAIL_PROCESSOR_SECRET || 'nith-email-secret'
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const sources: string[] = body.sources || ['yell', 'thomson', 'chamber', 'scoot']
  const category: string = body.category || 'business'

  const results = await Promise.allSettled([
    sources.includes('chamber') ? scrapeDGChamber() : Promise.resolve([]),
    sources.includes('yell') ? scrapeYell(category) : Promise.resolve([]),
    sources.includes('thomson') ? scrapeThomsonLocal(category) : Promise.resolve([]),
    sources.includes('scoot') ? scrapeScoot(category) : Promise.resolve([]),
  ])

  const allBusinesses: ScrapedBusiness[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') allBusinesses.push(...r.value)
  }

  // Deduplicate by name
  const seen = new Set<string>()
  const unique = allBusinesses.filter(b => {
    const key = b.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return NextResponse.json({ businesses: unique, total: unique.length })
}
