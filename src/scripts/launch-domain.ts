/**
 * launch-domain.ts
 * Final step: point a domain at the Vercel-deployed client site.
 *
 * Three options:
 *   --option subdomain   → creates [slug].nithdigital.uk via Cloudflare (fully automatic)
 *   --option custom      → adds domain to Vercel, prints DNS records for client to set manually
 *   --option cloudflare  → adds domain to Vercel + creates CNAME in client's Cloudflare zone
 *
 * Usage:
 *   npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
 *     --client-slug apex-electrical --option subdomain
 *
 *   npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
 *     --client-slug apex-electrical --option custom --domain apexelectrical.co.uk
 *
 *   npx ts-node --project tsconfig.json src/scripts/launch-domain.ts \
 *     --client-slug apex-electrical --option cloudflare --domain apexelectrical.co.uk \
 *     --cf-zone-id <zone-id>
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

// ─── Load .env.local ──────────────────────────────────────────────────────────

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const CF_NITH_ZONE_ID = process.env.CLOUDFLARE_NITHDIGITAL_ZONE_ID

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag: string): string | undefined => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const clientSlug = getArg('--client-slug')
const option = getArg('--option') as 'subdomain' | 'custom' | 'cloudflare' | undefined
const customDomain = getArg('--domain')
const cfZoneId = getArg('--cf-zone-id')

if (!clientSlug || !option) {
  console.error('Usage: launch-domain.ts --client-slug <slug> --option <subdomain|custom|cloudflare> [--domain <domain>] [--cf-zone-id <id>]')
  process.exit(1)
}

// Validate client slug format
if (!/^[a-z0-9-]{1,50}$/.test(clientSlug)) {
  console.error(`Invalid client slug "${clientSlug}" — must be lowercase alphanumeric with hyphens only (max 50 chars)`)
  process.exit(1)
}

if (!VERCEL_TOKEN) {
  console.error('VERCEL_TOKEN not found in .env.local')
  process.exit(1)
}

if ((option === 'custom' || option === 'cloudflare') && !customDomain) {
  console.error(`--domain is required for option "${option}"`)
  process.exit(1)
}

// Validate domain format
if (customDomain) {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i
  if (!domainRegex.test(customDomain)) {
    console.error(`Invalid domain name "${customDomain}" — must be a valid domain (e.g. example.co.uk)`)
    process.exit(1)
  }
}

// ─── Provision JSON ───────────────────────────────────────────────────────────

const designsDir = path.join(process.cwd(), 'designs', clientSlug!)
const provisionPath = path.join(designsDir, 'provision.json')

if (!fs.existsSync(provisionPath)) {
  console.error(`provision.json not found at ${provisionPath}. Run provision-project.ts first.`)
  process.exit(1)
}

interface Provision {
  repo_name: string
  github_url: string
  github_full_name: string
  vercel_project: string
  staging_url: string
  latest_deploy_url?: string
  live_url?: string
}

const provision = JSON.parse(fs.readFileSync(provisionPath, 'utf-8')) as Provision
const projectId = provision.vercel_project

if (!projectId) {
  console.error('vercel_project ID not found in provision.json')
  process.exit(1)
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function apiRequest(options: https.RequestOptions, body?: string): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let raw = ''
      res.on('data', (chunk) => { raw += chunk })
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 0, data: JSON.parse(raw) })
        } catch {
          resolve({ status: res.statusCode || 0, data: raw })
        }
      })
    })
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Vercel: add domain to project ───────────────────────────────────────────

async function vercelAddDomain(domain: string): Promise<void> {
  console.log(`  Adding ${domain} to Vercel project...`)
  const body = JSON.stringify({ name: domain })
  const res = await apiRequest({
    hostname: 'api.vercel.com',
    path: `/v10/projects/${projectId}/domains`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  }, body)

  if (res.status === 200 || res.status === 201 || res.status === 409) {
    if (res.status === 409) {
      console.log(`  Domain ${domain} already on this project.`)
    } else {
      console.log(`  Domain added to Vercel.`)
    }
  } else {
    const err = (res.data as Record<string, unknown>)?.error
    throw new Error(`Vercel add domain failed (${res.status}): ${JSON.stringify(err || res.data)}`)
  }
}

// ─── Vercel: poll domain verification ────────────────────────────────────────

interface VercelDomainInfo {
  name: string
  verified: boolean
  verification?: Array<{ type: string; domain: string; value: string; reason: string }>
  cnames?: string[]
  apexName?: string
  projectId?: string
}

async function vercelGetDomain(domain: string): Promise<VercelDomainInfo> {
  const res = await apiRequest({
    hostname: 'api.vercel.com',
    path: `/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` },
  })
  return res.data as VercelDomainInfo
}

async function pollVercelVerification(domain: string, timeoutMs = 120_000): Promise<boolean> {
  console.log(`  Polling Vercel for domain verification (up to ${timeoutMs / 1000}s)...`)
  const start = Date.now()
  let lastInfo: VercelDomainInfo | null = null

  while (Date.now() - start < timeoutMs) {
    const info = await vercelGetDomain(domain)
    lastInfo = info
    if (info.verified) {
      console.log(`  ✓ Domain ${domain} verified by Vercel.`)
      return true
    }
    await sleep(8000)
    process.stdout.write('.')
  }
  console.log()
  console.log(`  Domain not yet verified (may need DNS to propagate).`)
  if (lastInfo?.verification) {
    console.log('  Vercel verification records needed:')
    for (const v of lastInfo.verification) {
      console.log(`    Type: ${v.type} | Name: ${v.domain} | Value: ${v.value}`)
    }
  }
  return false
}

// ─── Cloudflare: create DNS record ───────────────────────────────────────────

async function cloudflareCreateRecord(
  zoneId: string,
  type: 'CNAME' | 'A',
  name: string,
  content: string,
  proxied = false
): Promise<void> {
  const body = JSON.stringify({ type, name, content, proxied, ttl: proxied ? 1 : 300 })
  const res = await apiRequest({
    hostname: 'api.cloudflare.com',
    path: `/client/v4/zones/${zoneId}/dns_records`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  }, body)

  const data = res.data as { success?: boolean; errors?: Array<{ message: string }> }
  if (!data.success) {
    const msgs = data.errors?.map(e => e.message).join(', ') || JSON.stringify(res.data)
    // 81057 = record already exists — treat as success
    if (msgs.includes('81057') || msgs.toLowerCase().includes('already exists')) {
      console.log(`  CNAME ${name} already exists in Cloudflare — skipping.`)
      return
    }
    throw new Error(`Cloudflare DNS creation failed: ${msgs}`)
  }
  console.log(`  ✓ Cloudflare DNS record created: ${type} ${name} → ${content}`)
}

// ─── Cloudflare: look up zone by apex domain ─────────────────────────────────

async function cloudflareGetZoneId(apexDomain: string): Promise<string | null> {
  const res = await apiRequest({
    hostname: 'api.cloudflare.com',
    path: `/client/v4/zones?name=${encodeURIComponent(apexDomain)}&status=active`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${CF_TOKEN}` },
  })
  const data = res.data as { result?: Array<{ id: string }> }
  return data.result?.[0]?.id ?? null
}

// ─── Save live URL to provision.json ─────────────────────────────────────────

function saveLiveUrl(domain: string) {
  const updated = { ...provision, live_url: `https://${domain}` }
  fs.writeFileSync(provisionPath, JSON.stringify(updated, null, 2))
  console.log(`  live_url saved to provision.json`)
}

// ─── Option A: Nith Digital subdomain ────────────────────────────────────────

async function optionSubdomain() {
  const subdomain = `${clientSlug}.nithdigital.uk`
  console.log(`\n── Option: Nith Digital subdomain ──────────────────────────`)
  console.log(`  Target: ${subdomain}`)

  if (!CF_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN not found in .env.local')
    process.exit(1)
  }
  if (!CF_NITH_ZONE_ID) {
    console.error('CLOUDFLARE_NITHDIGITAL_ZONE_ID not found in .env.local')
    process.exit(1)
  }

  // Vercel's CNAME target for custom subdomains
  const vercelCname = 'cname.vercel-dns.com'

  // 1. Add subdomain to Vercel project
  await vercelAddDomain(subdomain)

  // 2. Create CNAME in nithdigital.uk Cloudflare zone (proxied = false so Vercel TLS works)
  await cloudflareCreateRecord(CF_NITH_ZONE_ID, 'CNAME', subdomain, vercelCname, false)

  // 3. Poll Vercel for verification
  const verified = await pollVercelVerification(subdomain)

  // 4. Done
  const liveUrl = `https://${subdomain}`
  saveLiveUrl(subdomain)

  console.log(`\n════════════════════════════════════════`)
  if (verified) {
    console.log(`  ✓ Site is live at ${liveUrl}`)
  } else {
    console.log(`  DNS propagating — check ${liveUrl} in a few minutes.`)
  }
  console.log(`════════════════════════════════════════\n`)
}

// ─── Option B: Client's own domain (manual DNS) ───────────────────────────────

async function optionCustom() {
  const domain = customDomain!
  const apexDomain = domain.replace(/^www\./, '')
  const isWww = domain.startsWith('www.')

  console.log(`\n── Option: Custom domain (manual DNS) ──────────────────────`)
  console.log(`  Domain: ${domain}`)

  // 1. Add domain to Vercel
  await vercelAddDomain(domain)
  if (!isWww) {
    // Also add www redirect
    await vercelAddDomain(`www.${apexDomain}`)
  }

  // 2. Get Vercel's required DNS records
  const info = await vercelGetDomain(domain)

  // 3. Write domain-setup.md for the client
  const isApex = domain === apexDomain

  const dnsLines: string[] = []
  if (isApex) {
    dnsLines.push('| A | @ | 76.76.21.21 | 3600 |')
    dnsLines.push('| CNAME | www | cname.vercel-dns.com. | 3600 |')
  } else {
    dnsLines.push(`| CNAME | ${domain.replace(`.${apexDomain}`, '')} | cname.vercel-dns.com. | 3600 |`)
  }

  if (info.verification) {
    for (const v of info.verification) {
      dnsLines.push(`| ${v.type} | ${v.domain} | ${v.value} | 3600 | (verification) |`)
    }
  }

  const setupMd = `# DNS Setup for ${domain}

Please log in to your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records:

| Type | Name / Host | Value / Points to | TTL |
|------|-------------|-------------------|-----|
${dnsLines.join('\n')}

**Notes:**
- Remove any existing A records for @ before adding the new one.
- DNS changes can take up to 48 hours to propagate worldwide, but usually under an hour.
- Once done, your site will be live at https://${domain}

If you need help, reply to this email and we'll guide you through it.
`
  const setupPath = path.join(designsDir, 'domain-setup.md')
  fs.writeFileSync(setupPath, setupMd)
  console.log(`  DNS guide written to: ${setupPath}`)

  // 4. Print to console too
  console.log(`\n  DNS records for ${domain}:`)
  if (isApex) {
    console.log(`    A     @    → 76.76.21.21`)
    console.log(`    CNAME www  → cname.vercel-dns.com`)
  } else {
    console.log(`    CNAME ${domain.replace(`.${apexDomain}`, '')} → cname.vercel-dns.com`)
  }
  if (info.verification) {
    for (const v of info.verification) {
      console.log(`    ${v.type}   ${v.domain} → ${v.value}  (verification)`)
    }
  }

  saveLiveUrl(domain)

  console.log(`\n════════════════════════════════════════`)
  console.log(`  Send ${setupPath} to the client.`)
  console.log(`  Site goes live at https://${domain} once DNS propagates.`)
  console.log(`════════════════════════════════════════\n`)
}

// ─── Option C: Client's domain on Cloudflare (fully automatic) ───────────────

async function optionCloudflare() {
  const domain = customDomain!
  const apexDomain = domain.replace(/^www\./, '')

  console.log(`\n── Option: Cloudflare auto-DNS ─────────────────────────────`)
  console.log(`  Domain: ${domain}`)

  if (!CF_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN not found in .env.local')
    process.exit(1)
  }

  // Resolve zone ID: use provided flag or look up by apex domain
  let zoneId = cfZoneId
  if (!zoneId) {
    console.log(`  Looking up Cloudflare zone for ${apexDomain}...`)
    zoneId = (await cloudflareGetZoneId(apexDomain)) ?? undefined
    if (!zoneId) {
      console.error(`  Cloudflare zone not found for ${apexDomain}. Pass --cf-zone-id manually.`)
      process.exit(1)
    }
    console.log(`  Zone ID: ${zoneId}`)
  }

  // 1. Add domain to Vercel
  await vercelAddDomain(domain)
  if (!domain.startsWith('www.')) {
    await vercelAddDomain(`www.${apexDomain}`)
  }

  // 2. Create DNS records in Cloudflare
  const isApex = domain === apexDomain
  if (isApex) {
    await cloudflareCreateRecord(zoneId, 'A', '@', '76.76.21.21', true)
    await cloudflareCreateRecord(zoneId, 'CNAME', 'www', 'cname.vercel-dns.com', false)
  } else {
    const sub = domain.replace(`.${apexDomain}`, '')
    await cloudflareCreateRecord(zoneId, 'CNAME', sub, 'cname.vercel-dns.com', false)
  }

  // 3. Poll Vercel verification (Cloudflare usually propagates within seconds)
  const verified = await pollVercelVerification(domain, 60_000)

  saveLiveUrl(domain)

  console.log(`\n════════════════════════════════════════`)
  if (verified) {
    console.log(`  ✓ Site is live at https://${domain}`)
  } else {
    console.log(`  DNS set. Check https://${domain} in a few minutes.`)
  }
  console.log(`════════════════════════════════════════\n`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n════════════════════════════════════════`)
  console.log(`  Launch Domain: ${clientSlug}`)
  console.log(`════════════════════════════════════════`)

  if (option === 'subdomain') {
    await optionSubdomain()
  } else if (option === 'custom') {
    await optionCustom()
  } else if (option === 'cloudflare') {
    await optionCloudflare()
  } else {
    console.error(`Unknown option "${option}". Choose: subdomain | custom | cloudflare`)
    process.exit(1)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
