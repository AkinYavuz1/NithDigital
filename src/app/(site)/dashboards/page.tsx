import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { SectorBarChart, NeedBarChart, WebsiteDonutChart } from './DGCharts'

export const revalidate = 86400

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const metadata: Metadata = {
  title: 'Dumfries & Galloway Business Digital Health | Data Analytics & Power BI | Nith Digital',
  description:
    'We surveyed 600+ businesses across Dumfries & Galloway. See the data: website gaps, Google visibility, digital need by sector. Nith Digital delivers data analytics and Power BI dashboards as a service.',
  alternates: { canonical: 'https://nithdigital.uk/dashboards' },
  openGraph: {
    title: 'D&G Business Digital Health Report | Nith Digital',
    description:
      'Live insights from 600+ surveyed businesses across Dumfries & Galloway. Data analytics and Power BI dashboards by Nith Digital.',
    url: 'https://nithdigital.uk/dashboards',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'D&G Business Digital Health Report | Nith Digital',
    description: 'Live insights from 600+ surveyed businesses across Dumfries & Galloway.',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Dumfries & Galloway Business Digital Health Survey',
    description:
      'Survey of 600+ small businesses across Dumfries & Galloway assessing website presence, Google visibility, and digital readiness across 13 sectors.',
    creator: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
    spatialCoverage: { '@type': 'Place', name: 'Dumfries and Galloway, Scotland' },
    datePublished: '2026-01-01',
    license: 'https://nithdigital.uk/dashboards',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Data Analytics & Power BI Dashboards',
    provider: { '@type': 'ProfessionalService', name: 'Nith Digital', url: 'https://nithdigital.uk' },
    description: 'Data analytics consulting, Power BI dashboard development, and KPI reporting for businesses in Dumfries & Galloway and across Scotland.',
    areaServed: { '@type': 'Place', name: 'Dumfries and Galloway' },
    offers: { '@type': 'Offer', price: '500', priceCurrency: 'GBP' },
  },
]

function pct(count: number, total: number) {
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

function roundTo5(n: number) {
  return Math.round(n / 5) * 5
}

const VIGNETTES = [
  {
    quote:
      'A hospitality business in Castle Douglas with over 140 Google reviews — no working website. Customers can find the reviews but nowhere to book or check availability.',
    sector: 'Hospitality',
  },
  {
    quote:
      "A trades business in Upper Nithsdale with a site that hasn't been updated since 2017. The copyright in the footer gives it away. No contact email found online.",
    sector: 'Trades',
  },
  {
    quote:
      'A retail business in Dumfries with a 4.8-star Google rating and Facebook-only presence. No way to browse stock, check opening hours, or order online.',
    sector: 'Retail',
  },
]

const SERVICES = [
  {
    title: 'Power BI dashboards',
    desc: 'Interactive, automated dashboards connected to your data. Replace manual reporting with live insight your whole team can access.',
    href: '/power-bi/dumfries-galloway',
  },
  {
    title: 'Data analytics consulting',
    desc: '10+ years delivering BI and analytics across NHS, energy, finance, and the public sector — now available to ambitious SMEs in D&G and across Scotland.',
    href: '/data-analytics',
  },
  {
    title: 'KPI reporting & frameworks',
    desc: 'Define the metrics that matter, build the infrastructure to track them, and give every stakeholder the view they need.',
    href: '/data-reporting',
  },
]

export default async function DashboardsPage() {
  // ── Fetch ─────────────────────────────────────────────────────────────────
  const { data, error } = await sb
    .from('prospects')
    .select('sector, location, score_overall, score_need, website_status, has_website, google_review_count, social_presence')

  const rows = (data ?? []) as Array<{
    sector: string
    location: string | null
    score_overall: number | null
    score_need: number | null
    website_status: string | null
    has_website: boolean | null
    google_review_count: number | null
    social_presence: string | null
  }>

  const total = rows.length

  // ── Aggregate ─────────────────────────────────────────────────────────────
  const noWebsite = rows.filter(r => !r.has_website || r.website_status === 'none').length
  const brokenOrOutdated = rows.filter(r =>
    ['broken', 'parked', 'placeholder'].includes(r.website_status ?? '')
  ).length
  const noGoogleReviews = rows.filter(r => !r.google_review_count).length
  const townsSet = new Set(rows.map(r => r.location).filter(Boolean))
  const townCount = townsSet.size

  const pctNoWeb = pct(noWebsite, total)
  const pctBroken = pct(brokenOrOutdated, total)
  const pctNoReviews = pct(noGoogleReviews, total)

  // Website status donut data
  const liveCount = rows.filter(r => r.has_website && r.website_status === 'live').length
  const noneCount = rows.filter(r => !r.has_website || r.website_status === 'none').length
  const brokenCount = rows.filter(r =>
    ['broken', 'parked', 'placeholder'].includes(r.website_status ?? '')
  ).length
  const otherCount = total - liveCount - noneCount - brokenCount

  const websiteData = [
    { name: 'Live website', value: pct(liveCount, total) },
    { name: 'No website', value: pct(noneCount, total) },
    { name: 'Broken / outdated', value: pct(brokenCount, total) },
    { name: 'Unknown', value: pct(otherCount, total) },
  ].filter(d => d.value > 0)

  // By-sector aggregation
  type SectorAgg = { count: number; needSum: number }
  const sectorMap: Record<string, SectorAgg> = {}
  for (const r of rows) {
    const s = r.sector || 'Other'
    if (!sectorMap[s]) sectorMap[s] = { count: 0, needSum: 0 }
    sectorMap[s].count++
    sectorMap[s].needSum += r.score_need ?? 0
  }

  const sectorCounts = Object.entries(sectorMap)
    .map(([sector, v]) => ({ sector, count: roundTo5(v.count) }))
    .sort((a, b) => b.count - a.count)

  const sectorNeeds = Object.entries(sectorMap)
    .map(([sector, v]) => ({
      sector,
      avg_need: Math.round((v.needSum / v.count) * 10) / 10,
    }))
    .sort((a, b) => b.avg_need - a.avg_need)

  const displayTotal = roundTo5(total)

  return (
    <>
      {jsonLd.map((item, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#1B2A4A', padding: '64px 0 52px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Data Analytics · Dumfries & Galloway
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              color: '#F5F0E6',
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.25,
              maxWidth: 640,
            }}
          >
            The Digital Health of<br />Dumfries & Galloway Businesses
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.75)', maxWidth: 560, marginBottom: 8, lineHeight: 1.75 }}>
            We surveyed over {displayTotal.toLocaleString()} businesses across {townCount}+ towns and villages —
            from Stranraer to Moffat, Dumfries to Sanquhar — across 13 sectors.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.75)', maxWidth: 560, marginBottom: 32, lineHeight: 1.75 }}>
            What we found is an opportunity. Most local businesses are invisible online. This is what the data looks like.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#D4A84B',
                color: '#1B2A4A',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Book a free call
            </Link>
            <Link
              href="/power-bi/dumfries-galloway"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'transparent',
                color: '#F5F0E6',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(245,240,230,0.3)',
                textDecoration: 'none',
              }}
            >
              Power BI dashboards for D&G
            </Link>
          </div>
        </div>
      </section>

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
      <section style={{ background: '#F5F0E6', padding: '48px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="kpi-grid">
            {[
              { value: `${pctNoWeb}%`, label: 'of surveyed businesses have no working website' },
              { value: `${pctBroken}%`, label: 'have a broken, parked, or placeholder site' },
              { value: `${pctNoReviews}%`, label: 'have no Google reviews at all' },
              { value: `${townCount}+`, label: 'towns and villages surveyed across D&G' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(27,42,74,0.1)',
                  borderTop: '3px solid #D4A84B',
                  borderRadius: '0 0 8px 8px',
                  padding: '24px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 42,
                    color: '#1B2A4A',
                    fontWeight: 400,
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }} className="chart-grid">

          {/* Sector volume */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 6, color: '#1B2A4A' }}>
              Businesses surveyed by sector
            </h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 24, lineHeight: 1.6 }}>
              Counts rounded to nearest 5 to protect individual business data.
            </p>
            <SectorBarChart data={sectorCounts} />
          </div>

          {/* Digital need by sector */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 6, color: '#1B2A4A' }}>
              Digital need by sector
            </h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 24, lineHeight: 1.6 }}>
              Average digital need score (1–10) across surveyed businesses in each sector. Higher = greater opportunity.
            </p>
            <NeedBarChart data={sectorNeeds} />
          </div>

        </div>
      </section>

      {/* ── Website status donut ────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="donut-grid">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 12, color: '#1B2A4A' }}>
              Website status across all sectors
            </h2>
            <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.75, marginBottom: 16 }}>
              A working website is the foundation of online visibility — yet a significant proportion of D&G businesses
              either have none, or have a site that's broken, parked, or still showing a placeholder.
            </p>
            <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.75 }}>
              For customers who search before they spend, an invisible business is a missed business.
              This is the gap our work addresses.
            </p>
          </div>
          <div>
            <WebsiteDonutChart data={websiteData} />
          </div>
        </div>
      </section>

      {/* ── Vignettes ───────────────────────────────────────────────────── */}
      <section style={{ background: '#1B2A4A', margin: '56px 0 0', padding: '56px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 400,
              color: '#F5F0E6',
              marginBottom: 8,
            }}
          >
            What we actually found
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 36, maxWidth: 560, lineHeight: 1.7 }}>
            These are anonymised observations drawn directly from our survey data. No business names, no contact details — just the patterns.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="vignette-grid">
            {VIGNETTES.map((v) => (
              <div
                key={v.sector}
                style={{
                  background: 'rgba(245,240,230,0.06)',
                  border: '1px solid rgba(245,240,230,0.12)',
                  borderLeft: '3px solid #D4A84B',
                  borderRadius: '0 8px 8px 0',
                  padding: '24px 20px',
                }}
              >
                <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#D4A84B', fontWeight: 600, marginBottom: 12 }}>
                  {v.sector}
                </div>
                <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(245,240,230,0.8)', lineHeight: 1.75, marginBottom: 16 }}>
                  &ldquo;{v.quote}&rdquo;
                </p>
                <p style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600, margin: 0 }}>
                  This is the kind of gap we look for.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 0' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8, color: '#1B2A4A' }}>
          We build dashboards like this for your business
        </h2>
        <p style={{ fontSize: 15, color: '#5A6A7A', marginBottom: 32, maxWidth: 640, lineHeight: 1.75 }}>
          The charts above were produced using the same tools and techniques we apply to client data every day —
          data analytics, Power BI, and custom reporting. If you want to understand your own business numbers this clearly, this is what we do.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }} className="svc-grid">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              style={{
                padding: 24,
                border: '1px solid rgba(27,42,74,0.1)',
                borderLeft: '3px solid #D4A84B',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#1B2A4A' }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: '#5A6A7A', marginBottom: 12 }}>{s.desc}</p>
              <Link href={s.href} style={{ fontSize: 12, fontWeight: 600, color: '#D4A84B', textDecoration: 'none' }}>
                Learn more →
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '44px 48px', textAlign: 'center', color: '#F5F0E6', marginBottom: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
            Want your business data to look this good?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', marginBottom: 24, maxWidth: 460, margin: '0 auto 24px' }}>
            Free consultation. Tell us about your data challenge — we&apos;ll show you what a dashboard built around your numbers could look like.
          </p>
          <Link
            href="/book"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#D4A84B',
              color: '#1B2A4A',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Book a free call
          </Link>
        </div>
      </section>

      <div style={{ height: 64 }} />

      <style>{`
        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .chart-grid { grid-template-columns: 1fr !important; }
          .donut-grid { grid-template-columns: 1fr !important; }
          .vignette-grid { grid-template-columns: 1fr !important; }
          .svc-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
