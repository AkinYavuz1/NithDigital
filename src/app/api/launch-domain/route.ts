import { NextRequest, NextResponse } from 'next/server'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN || process.env['cloudflare access token ']
const CF_ZONE_ID = process.env.CLOUDFLARE_NITHDIGITAL_ZONE_ID

export async function POST(req: NextRequest) {
  const { option, vercel_project_id, staging_url, client_slug, custom_domain } = await req.json()

  if (!option || !vercel_project_id) {
    return NextResponse.json({ error: 'option and vercel_project_id required' }, { status: 400 })
  }

  // Option 1: Use existing staging URL
  if (option === 'staging') {
    return NextResponse.json({ live_url: staging_url })
  }

  // Option 2: Nith Digital subdomain (e.g. clientslug.nithdigital.uk)
  if (option === 'subdomain') {
    if (!client_slug) return NextResponse.json({ error: 'client_slug required' }, { status: 400 })
    if (!CF_TOKEN || !CF_ZONE_ID) {
      return NextResponse.json({ error: 'Cloudflare not configured — set CLOUDFLARE_API_TOKEN and CLOUDFLARE_NITHDIGITAL_ZONE_ID in .env.local' }, { status: 500 })
    }

    const subdomain = `${client_slug}.nithdigital.uk`

    // Add domain to Vercel project
    const vercelRes = await fetch(
      `https://api.vercel.com/v10/projects/${vercel_project_id}/domains`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subdomain }),
      }
    )
    const vercelData = await vercelRes.json()
    if (!vercelRes.ok && vercelData.error?.code !== 'domain_already_in_use') {
      return NextResponse.json({ error: `Vercel error: ${vercelData.error?.message || 'unknown'}` }, { status: 500 })
    }

    // Get CNAME target from Vercel
    const cnameTarget = vercelData.cnames?.[0] || 'cname.vercel-dns.com'

    // Create CNAME in Cloudflare
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'CNAME',
          name: client_slug,
          content: cnameTarget,
          proxied: false,
          ttl: 1,
        }),
      }
    )
    const cfData = await cfRes.json()
    if (!cfRes.ok && !cfData.errors?.some((e: { code: number }) => e.code === 81053)) {
      return NextResponse.json({ error: `Cloudflare error: ${cfData.errors?.[0]?.message || 'unknown'}` }, { status: 500 })
    }

    return NextResponse.json({ live_url: `https://${subdomain}` })
  }

  // Option 3: Custom domain
  if (option === 'custom') {
    if (!custom_domain) return NextResponse.json({ error: 'custom_domain required' }, { status: 400 })
    if (!CF_TOKEN) {
      return NextResponse.json({ error: 'Cloudflare not configured — set CLOUDFLARE_API_TOKEN in .env.local' }, { status: 500 })
    }

    // Add domain to Vercel project
    const vercelRes = await fetch(
      `https://api.vercel.com/v10/projects/${vercel_project_id}/domains`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: custom_domain }),
      }
    )
    const vercelData = await vercelRes.json()
    if (!vercelRes.ok && vercelData.error?.code !== 'domain_already_in_use') {
      return NextResponse.json({ error: `Vercel error: ${vercelData.error?.message || 'unknown'}` }, { status: 500 })
    }

    // Get domain config from Vercel (DNS records needed)
    const domainRes = await fetch(
      `https://api.vercel.com/v9/projects/${vercel_project_id}/domains/${custom_domain}`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
    )
    const domainData = await domainRes.json()

    // Find or create Cloudflare zone for the apex domain
    const apexDomain = custom_domain.split('.').slice(-2).join('.')
    const zoneRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${apexDomain}`,
      { headers: { Authorization: `Bearer ${CF_TOKEN}` } }
    )
    const zoneData = await zoneRes.json()
    let zoneId = zoneData.result?.[0]?.id

    if (!zoneId) {
      // Zone doesn't exist in Cloudflare — return instructions for manual setup
      return NextResponse.json({
        live_url: `https://${custom_domain}`,
        requires_manual_dns: true,
        message: `Domain ${apexDomain} is not in your Cloudflare account. Add it to Cloudflare first, then use "Connect to Cloudflare" again.`,
        vercel_dns: domainData.verification || [],
      })
    }

    // Create DNS records in Cloudflare from Vercel's requirements
    const dnsCreated: string[] = []
    for (const record of (domainData.verification || [])) {
      const cfDnsRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: record.type || 'CNAME',
            name: record.domain || custom_domain,
            content: record.value,
            proxied: false,
            ttl: 1,
          }),
        }
      )
      if (cfDnsRes.ok) dnsCreated.push(record.domain || custom_domain)
    }

    // Also create main CNAME if not in verification records
    if (dnsCreated.length === 0) {
      const cnameTarget = vercelData.cnames?.[0] || 'cname.vercel-dns.com'
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CNAME',
            name: custom_domain.startsWith('www.') ? 'www' : custom_domain,
            content: cnameTarget,
            proxied: false,
            ttl: 1,
          }),
        }
      )
    }

    return NextResponse.json({
      live_url: `https://${custom_domain}`,
      zone_id: zoneId,
      dns_records_created: dnsCreated,
    })
  }

  return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
}
