'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  Check, X, AlertTriangle, ChevronDown, ChevronUp,
  Shield, Zap, Search, Smartphone, FileText, Globe,
  ExternalLink, Download, Phone, ArrowRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditResult {
  url: string
  fetchedAt: string
  loadTimeMs: number
  title: string | null
  metaDescription: string | null
  favicon: boolean
  language: string | null
  charset: string | null
  seo: {
    hasTitle: boolean
    titleLength: number
    hasMetaDescription: boolean
    metaDescriptionLength: number
    hasCanonical: boolean
    hasRobotsTxt: boolean
    hasSitemap: boolean
    h1Count: number
    h1Text: string[]
    hasStructuredData: boolean
    hasOpenGraph: boolean
    hasTwitterCard: boolean
    metaKeywords: string | null
    imgWithoutAlt: number
    totalImages: number
  }
  security: {
    isHttps: boolean
    hasHSTS: boolean
    hasCSP: boolean
    mixedContent: boolean
  }
  performance: {
    htmlSizeKb: number
    totalScripts: number
    totalStylesheets: number
    inlineStyleCount: number
    hasMinifiedAssets: boolean
    usesModernImageFormats: boolean
    hasLazyLoading: boolean
    hasViewport: boolean
    hasFontPreload: boolean
    totalExternalRequests: number
    usesGzip: boolean
  }
  mobile: {
    hasViewportMeta: boolean
    viewportContent: string | null
    usesResponsiveImages: boolean
    hasTouchIcons: boolean
    textTooSmall: boolean
  }
  content: {
    wordCount: number
    hasContactForm: boolean
    hasPhoneNumber: boolean
    hasEmail: boolean
    hasAddress: boolean
    hasSocialLinks: boolean
    hasCookieNotice: boolean
    hasPrivacyPolicy: boolean
    totalLinks: number
    brokenInternalLinks: number
    externalLinks: number
  }
  technology: {
    platform: string | null
    framework: string | null
    analytics: string[]
    fonts: string[]
    cdn: string | null
    cms: string | null
  }
  scores: {
    seo: number
    security: number
    performance: number
    mobile: number
    content: number
    overall: number
  }
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 70) return '#16A34A'
  if (score >= 40) return '#D97706'
  return '#DC2626'
}

function scoreGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 45) return 'D'
  return 'F'
}

function ScoreGauge({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference
  const color = scoreColor(score)
  const cx = size / 2
  const cy = size / 2

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={6} />
        <circle
          cx={cx} cy={cy} r={radius} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.16, fontWeight: 600, color: '#7A7A7A', lineHeight: 1.2 }}>{scoreGrade(score)}</span>
      </div>
    </div>
  )
}

// ─── Check Row ────────────────────────────────────────────────────────────────

type CheckStatus = 'pass' | 'fail' | 'warn'

interface CheckRowProps {
  status: CheckStatus
  name: string
  detail?: string
  why?: string
  fix?: string
}

function CheckRow({ status, name, detail, why, fix }: CheckRowProps) {
  const [open, setOpen] = useState(false)

  const iconEl = status === 'pass'
    ? <Check size={15} color="#16A34A" />
    : status === 'warn'
    ? <AlertTriangle size={15} color="#D97706" />
    : <X size={15} color="#DC2626" />

  const iconBg = status === 'pass'
    ? 'rgba(22,163,74,0.1)'
    : status === 'warn'
    ? 'rgba(217,119,6,0.1)'
    : 'rgba(220,38,38,0.1)'

  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', paddingBottom: 0 }}>
      <div
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '12px 0', cursor: (why || fix) ? 'pointer' : 'default',
        }}
        onClick={() => (why || fix) ? setOpen(o => !o) : undefined}
      >
        <div style={{
          width: 26, height: 26, borderRadius: 6, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
        }}>
          {iconEl}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{name}</span>
            {(why || fix) && (
              <span style={{ color: '#7A7A7A', flexShrink: 0 }}>
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            )}
          </div>
          {detail && <p style={{ fontSize: 12, color: '#7A7A7A', margin: '3px 0 0', lineHeight: 1.5 }}>{detail}</p>}
        </div>
      </div>
      {open && (why || fix) && (
        <div style={{
          margin: '0 0 12px 38px', background: 'rgba(0,0,0,0.03)',
          borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {why && (
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#E85D3A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Why it matters</span>
              <p style={{ fontSize: 12, color: '#7A7A7A', margin: '4px 0 0', lineHeight: 1.6 }}>{why}</p>
            </div>
          )}
          {fix && (
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>How to fix</span>
              <p style={{ fontSize: 12, color: '#7A7A7A', margin: '4px 0 0', lineHeight: 1.6 }}>{fix}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ id, title, icon: Icon, score, children }: {
  id: string; title: string; icon: React.ElementType; score: number; children: React.ReactNode
}) {
  return (
    <div id={id} style={{
      background: '#fff', borderRadius: 12, padding: '28px 32px',
      border: '1px solid rgba(0,0,0,0.08)', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color="#E85D3A" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#1A1A1A', fontWeight: 400, margin: 0 }}>{title}</h2>
        </div>
        <ScoreGauge score={score} size={56} />
      </div>
      {children}
    </div>
  )
}

// ─── Loading Steps ────────────────────────────────────────────────────────────

const LOAD_STEPS = [
  'Fetching page...',
  'Checking SEO signals...',
  'Analysing performance...',
  'Testing security headers...',
  'Evaluating mobile readiness...',
  'Reviewing content...',
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SiteAuditClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function handleAudit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setError(null)
    setResult(null)

    let targetUrl = url.trim()
    if (!targetUrl) return
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl

    setLoading(true)
    setLoadingStep(0)

    let step = 0
    stepIntervalRef.current = setInterval(() => {
      step = Math.min(step + 1, LOAD_STEPS.length - 1)
      setLoadingStep(step)
    }, 2000)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      const data: AuditResult = await res.json()
      setResult(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current)
      setLoading(false)
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contactName || !contactEmail || !result) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      await supabase.from('site_audits').insert({
        url: result.url,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        audit_result: result,
        overall_score: result.scores.overall,
        seo_score: result.scores.seo,
        performance_score: result.scores.performance,
        security_score: result.scores.security,
        mobile_score: result.scores.mobile,
        content_score: result.scores.content,
      })
      setSubmitted(true)
    } catch {
      // fail silently — still mark submitted
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ background: '#1A1A1A', padding: '72px 24px 56px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
            color: '#E85D3A', marginBottom: 14, fontWeight: 600,
          }}>Free tool</p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#FAF8F5', fontWeight: 400, marginBottom: 16, lineHeight: 1.2,
          }}>
            Free Website Audit
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(250,248,245,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
            Instant SEO, performance, security and mobile analysis for any website.
            No signup required.
          </p>

          <form onSubmit={handleAudit} style={{ display: 'flex', gap: 0, maxWidth: 560, margin: '0 auto', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              style={{
                flex: 1, padding: '16px 20px', fontSize: 15, border: 'none',
                outline: 'none', color: '#1A1A1A', fontFamily: 'inherit',
                background: '#fff',
              }}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              style={{
                padding: '16px 24px', background: '#E85D3A', color: '#1A1A1A',
                border: 'none', fontSize: 14, fontWeight: 700, cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !url.trim() ? 0.7 : 1, whiteSpace: 'nowrap', fontFamily: 'inherit',
              }}
            >
              {loading ? 'Auditing...' : 'Audit this site'}
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.45)', marginTop: 12 }}>
            Takes about 10–15 seconds &middot; No account needed
          </p>
        </div>
      </section>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ maxWidth: 560, margin: '48px auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1A1A1A', fontWeight: 400, marginBottom: 24 }}>
              Analysing your site...
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LOAD_STEPS.map((step, i) => {
                const done = i < loadingStep
                const active = i === loadingStep
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: i > loadingStep ? 0.35 : 1, transition: 'opacity 0.3s' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: done ? 'rgba(22,163,74,0.12)' : active ? 'rgba(232,93,58,0.15)' : 'rgba(0,0,0,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {done
                        ? <Check size={12} color="#16A34A" />
                        : active
                        ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E85D3A', animation: 'pulse 1s infinite' }} />
                        : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.2)' }} />
                      }
                    </div>
                    <span style={{ fontSize: 13, color: done ? '#16A34A' : active ? '#1A1A1A' : '#7A7A7A', fontWeight: active ? 600 : 400 }}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div style={{ maxWidth: 560, margin: '48px auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', border: '1px solid rgba(220,38,38,0.2)', textAlign: 'center' }}>
            <X size={32} color="#DC2626" style={{ marginBottom: 12 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1A1A1A', fontWeight: 400, marginBottom: 8 }}>
              Audit failed
            </h3>
            <p style={{ fontSize: 14, color: '#7A7A7A', marginBottom: 20, lineHeight: 1.6 }}>{error}</p>
            <button
              onClick={() => { setError(null); handleAudit() }}
              style={{ padding: '10px 24px', background: '#1A1A1A', color: '#FAF8F5', borderRadius: 100, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div ref={resultsRef} style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* ── Top Summary ── */}
          <div style={{
            background: '#1A1A1A', borderRadius: 16, padding: '36px 40px', marginBottom: 24,
            display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center',
          }} className="audit-summary">
            <ScoreGauge score={result.scores.overall} size={120} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 11, color: 'rgba(250,248,245,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Overall score</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#FAF8F5', fontWeight: 400, margin: '0 0 6px' }}>
                {result.title || result.url}
              </h2>
              <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'rgba(250,248,245,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                {result.url} <ExternalLink size={11} />
              </a>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <span style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)' }}>
                  Audited {new Date(result.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)' }}>
                  Load time: {result.loadTimeMs < 1000 ? `${result.loadTimeMs}ms` : `${(result.loadTimeMs / 1000).toFixed(1)}s`}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'flex-start' }}>
              <Link
                href="/book"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px',
                  background: '#E85D3A', color: '#1A1A1A', borderRadius: 100,
                  fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
                }}
              >
                <Phone size={14} /> Book a free call
              </Link>
            </div>
          </div>

          {/* ── Category Score Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }} className="audit-score-grid">
            {([
              { id: 'seo', label: 'SEO', score: result.scores.seo, icon: Search },
              { id: 'performance', label: 'Performance', score: result.scores.performance, icon: Zap },
              { id: 'security', label: 'Security', score: result.scores.security, icon: Shield },
              { id: 'mobile', label: 'Mobile', score: result.scores.mobile, icon: Smartphone },
              { id: 'content', label: 'Content', score: result.scores.content, icon: FileText },
            ] as const).map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(`section-${cat.id}`)}
                style={{
                  background: '#fff', borderRadius: 12, padding: '18px 12px',
                  border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  transition: 'box-shadow 0.15s', textAlign: 'center',
                }}
                className="audit-cat-card"
              >
                <ScoreGauge score={cat.score} size={64} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* ── SEO Section ── */}
          <SectionCard id="section-seo" title="SEO" icon={Search} score={result.scores.seo}>
            <CheckRow
              status={result.seo.hasTitle ? 'pass' : 'fail'}
              name="Title tag"
              detail={result.seo.hasTitle ? `"${result.title?.slice(0, 80)}${(result.title?.length ?? 0) > 80 ? '…' : ''}"` : 'No title tag found'}
              why="Search engines display this as the blue link in results. It's the single most important on-page SEO element."
              fix="Add a descriptive 50–60 character title tag that includes your main keyword and location."
            />
            <CheckRow
              status={result.seo.hasTitle ? (result.seo.titleLength >= 50 && result.seo.titleLength <= 60 ? 'pass' : 'warn') : 'fail'}
              name={`Title length (${result.seo.titleLength} characters)`}
              detail={result.seo.titleLength === 0 ? 'No title present' : result.seo.titleLength < 50 ? 'Too short — add more descriptive text' : result.seo.titleLength > 60 ? 'Too long — will be cut off in search results' : 'Ideal length'}
              why="Titles over 60 characters get truncated in Google search results, reducing click-through rates."
              fix="Keep your title between 50–60 characters. Include your primary keyword near the beginning."
            />
            <CheckRow
              status={result.seo.hasMetaDescription ? 'pass' : 'fail'}
              name="Meta description"
              detail={result.seo.hasMetaDescription ? `${result.seo.metaDescriptionLength} characters — ${result.metaDescription?.slice(0, 100)}${(result.metaDescription?.length ?? 0) > 100 ? '…' : ''}` : 'No meta description found'}
              why="Google displays this as the snippet below your title link. A compelling description improves click-through rate from search results."
              fix="Add a 150–160 character meta description that summarises the page and includes a call to action."
            />
            <CheckRow
              status={result.seo.h1Count === 1 ? 'pass' : result.seo.h1Count === 0 ? 'fail' : 'warn'}
              name={`H1 heading (found ${result.seo.h1Count})`}
              detail={result.seo.h1Text.length > 0 ? `"${result.seo.h1Text[0]?.slice(0, 80)}"` : 'No H1 heading found on this page'}
              why="A single H1 tells search engines and users exactly what the page is about. Multiple H1s confuse crawlers."
              fix="Have exactly one H1 per page. Make it descriptive, include your primary keyword, and keep it concise."
            />
            <CheckRow
              status={result.seo.hasCanonical ? 'pass' : 'warn'}
              name="Canonical URL"
              detail={result.seo.hasCanonical ? 'Canonical tag present' : 'No canonical tag — could lead to duplicate content issues'}
              why="Canonical tags tell search engines which version of a page is the 'master' copy, preventing duplicate content penalties."
              fix={'Add a <link rel="canonical" href="..."> tag in the <head> pointing to the preferred URL of each page.'}
            />
            <CheckRow
              status={result.seo.hasRobotsTxt ? 'pass' : 'warn'}
              name="robots.txt file"
              detail={result.seo.hasRobotsTxt ? 'robots.txt detected' : 'No robots.txt found at /robots.txt'}
              why="robots.txt tells search engine crawlers which pages to crawl and which to skip, preventing wasted crawl budget."
              fix="Create a robots.txt file in your site root. At minimum it should allow all crawlers with User-agent: * and Allow: /."
            />
            <CheckRow
              status={result.seo.hasSitemap ? 'pass' : 'warn'}
              name="XML Sitemap"
              detail={result.seo.hasSitemap ? 'Sitemap detected' : 'No XML sitemap found — search engines may miss pages'}
              why="An XML sitemap helps search engines discover and index all your pages, especially for larger or newer sites."
              fix="Generate an XML sitemap (most CMS platforms do this automatically) and submit it in Google Search Console."
            />
            <CheckRow
              status={result.seo.hasStructuredData ? 'pass' : 'warn'}
              name="Structured data (JSON-LD)"
              detail={result.seo.hasStructuredData ? 'Structured data markup found' : 'No structured data detected'}
              why="Structured data (Schema.org) can enable rich results in Google — star ratings, FAQs, business info — improving visibility."
              fix="Add JSON-LD markup for your business type. Use schema.org to find the right type (LocalBusiness, Product, etc.)."
            />
            <CheckRow
              status={result.seo.hasOpenGraph ? 'pass' : 'warn'}
              name="Open Graph tags"
              detail={result.seo.hasOpenGraph ? 'Open Graph meta tags present' : 'No Open Graph tags — social shares will look poor'}
              why="Open Graph tags control how your page looks when shared on Facebook, LinkedIn, and WhatsApp — title, image, description."
              fix="Add og:title, og:description, og:image, and og:url tags to every page. Use a 1200×630px image for best results."
            />
            <CheckRow
              status={result.seo.hasTwitterCard ? 'pass' : 'warn'}
              name="Twitter / X card tags"
              detail={result.seo.hasTwitterCard ? 'Twitter card tags present' : 'No Twitter card tags found'}
              why="Twitter card tags control how your pages appear when shared on X/Twitter, enabling rich link previews with images."
              fix="Add twitter:card, twitter:title, twitter:description, and twitter:image tags in your page head."
            />
            <CheckRow
              status={result.seo.imgWithoutAlt === 0 ? 'pass' : result.seo.imgWithoutAlt < result.seo.totalImages * 0.3 ? 'warn' : 'fail'}
              name={`Image alt text (${result.seo.totalImages - result.seo.imgWithoutAlt}/${result.seo.totalImages} have alt)`}
              detail={result.seo.imgWithoutAlt === 0 ? 'All images have alt attributes' : `${result.seo.imgWithoutAlt} image${result.seo.imgWithoutAlt > 1 ? 's' : ''} missing alt text`}
              why="Alt text helps search engines understand images and is essential for accessibility — screen readers rely on it."
              fix="Add descriptive alt attributes to all images. Describe what's in the image naturally — don't keyword-stuff."
            />
          </SectionCard>

          {/* ── Performance Section ── */}
          <SectionCard id="section-performance" title="Performance" icon={Zap} score={result.scores.performance}>
            <CheckRow
              status={result.performance.htmlSizeKb < 100 ? 'pass' : result.performance.htmlSizeKb < 200 ? 'warn' : 'fail'}
              name={`HTML page size (${result.performance.htmlSizeKb.toFixed(1)} KB)`}
              detail={result.performance.htmlSizeKb < 100 ? 'Good page size' : result.performance.htmlSizeKb < 200 ? 'Slightly large — consider reducing' : 'Large HTML — this will slow down page load'}
              why="Large HTML files take longer to download and parse, slowing your page and increasing bounce rates."
              fix="Minify your HTML, remove unnecessary whitespace and comments, and avoid inline scripts or styles where possible."
            />
            <CheckRow
              status={result.performance.hasViewport ? 'pass' : 'fail'}
              name="Viewport meta tag"
              detail={result.performance.hasViewport ? 'Viewport tag present' : 'Missing viewport meta tag'}
              why="The viewport tag tells browsers how to scale your page on different screen sizes. Without it, mobile devices render a desktop view."
              fix={'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your <head>.'}
            />
            <CheckRow
              status={result.performance.hasLazyLoading ? 'pass' : 'warn'}
              name="Lazy loading images"
              detail={result.performance.hasLazyLoading ? 'Lazy loading detected on images' : 'No lazy loading detected — all images load on page open'}
              why="Lazy loading defers off-screen images until the user scrolls to them, significantly reducing initial page load time."
              fix={'Add loading="lazy" to all <img> tags that are not above the fold.'}
            />
            <CheckRow
              status={result.performance.hasFontPreload ? 'pass' : 'warn'}
              name="Font preloading"
              detail={result.performance.hasFontPreload ? 'Font preload hints found' : 'No font preload detected — fonts may cause layout shift'}
              why="Preloading fonts prevents invisible text (FOIT) during load and reduces Cumulative Layout Shift, a Core Web Vital."
              fix={'Add <link rel="preload" as="font"> for your main web fonts in the <head> before other stylesheets.'}
            />
            <CheckRow
              status={result.performance.usesModernImageFormats ? 'pass' : 'warn'}
              name="Modern image formats (WebP / AVIF)"
              detail={result.performance.usesModernImageFormats ? 'WebP or AVIF images detected' : 'No modern image formats found — using JPEG/PNG'}
              why="WebP images are 25–35% smaller than JPEG at the same quality. AVIF is even better. Smaller images = faster pages."
              fix="Convert your images to WebP format. Tools like Squoosh, Cloudinary, or your CMS plugin can do this automatically."
            />
            <CheckRow
              status={result.performance.hasMinifiedAssets ? 'pass' : 'warn'}
              name="Minified CSS / JS assets"
              detail={result.performance.hasMinifiedAssets ? 'Minified assets detected' : 'Assets may not be minified'}
              why="Minification removes whitespace and comments from code files, reducing their size by up to 30%."
              fix="Enable minification in your build tool (Webpack, Vite, etc.) or use a WordPress optimisation plugin like NitroPack."
            />
            <CheckRow
              status={result.performance.usesGzip ? 'pass' : 'warn'}
              name="Gzip / Brotli compression"
              detail={result.performance.usesGzip ? 'Compression detected on server responses' : 'No compression detected — files are served uncompressed'}
              why="Gzip typically reduces text file sizes by 70%. Without it, your CSS, JS, and HTML files are much larger than necessary."
              fix="Enable Gzip or Brotli compression in your web server config (nginx, Apache) or CDN settings. Most hosts support this."
            />
            <CheckRow
              status={result.performance.totalScripts <= 5 ? 'pass' : result.performance.totalScripts <= 10 ? 'warn' : 'fail'}
              name={`Script tags (${result.performance.totalScripts} found)`}
              detail={result.performance.totalScripts <= 5 ? 'Low script count — good' : result.performance.totalScripts <= 10 ? 'Moderate scripts — consider reducing' : 'High script count will slow your page'}
              why="Each script tag is a request that blocks or slows page rendering. Too many third-party scripts are a common performance killer."
              fix="Audit your scripts — remove any you don't actively use. Defer or async-load any that aren't needed immediately."
            />
          </SectionCard>

          {/* ── Security Section ── */}
          <SectionCard id="section-security" title="Security" icon={Shield} score={result.scores.security}>
            <CheckRow
              status={result.security.isHttps ? 'pass' : 'fail'}
              name="HTTPS encryption"
              detail={result.security.isHttps ? 'Site is served over HTTPS' : 'Site is not using HTTPS — traffic is unencrypted'}
              why="HTTPS encrypts data between your server and visitors. Google uses it as a ranking factor and browsers show warnings on HTTP sites."
              fix="Install an SSL certificate. Most hosts (including cPanel, Cloudflare, Netlify) offer free Let's Encrypt certificates."
            />
            <CheckRow
              status={result.security.hasHSTS ? 'pass' : 'warn'}
              name="HSTS header"
              detail={result.security.hasHSTS ? 'Strict-Transport-Security header present' : 'No HSTS header found'}
              why="HSTS forces browsers to always use HTTPS, even if someone types the HTTP version — preventing SSL-stripping attacks."
              fix='Add the Strict-Transport-Security header to your server config: Strict-Transport-Security: max-age=31536000; includeSubDomains'
            />
            <CheckRow
              status={result.security.hasCSP ? 'pass' : 'warn'}
              name="Content Security Policy"
              detail={result.security.hasCSP ? 'CSP header detected' : 'No Content-Security-Policy header found'}
              why="A CSP restricts which resources (scripts, images, fonts) can load on your page, preventing XSS attacks and data injection."
              fix="Implement a Content-Security-Policy header in your server config. Start with report-only mode to identify issues before enforcing."
            />
            <CheckRow
              status={result.security.mixedContent ? 'fail' : 'pass'}
              name="No mixed content"
              detail={result.security.mixedContent ? 'Mixed HTTP/HTTPS content detected — some resources load over insecure HTTP' : 'No mixed content issues found'}
              why="Mixed content (HTTP resources on an HTTPS page) triggers browser warnings and can block content from loading in modern browsers."
              fix="Find all HTTP resource URLs (images, scripts, stylesheets) in your source and update them to HTTPS. Check your CMS media library too."
            />
          </SectionCard>

          {/* ── Mobile Section ── */}
          <SectionCard id="section-mobile" title="Mobile" icon={Smartphone} score={result.scores.mobile}>
            <CheckRow
              status={result.mobile.hasViewportMeta ? 'pass' : 'fail'}
              name="Mobile viewport tag"
              detail={result.mobile.hasViewportMeta ? `Viewport: ${result.mobile.viewportContent || 'present'}` : 'No viewport meta tag — mobile layout will be broken'}
              why="Without a viewport tag, mobile browsers render your page as a scaled-down desktop view — tiny and unusable."
              fix={'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your HTML <head>.'}
            />
            <CheckRow
              status={(result.mobile.viewportContent?.includes('width=device-width') ?? false) ? 'pass' : 'warn'}
              name="Responsive viewport settings"
              detail={(result.mobile.viewportContent?.includes('width=device-width') ?? false) ? 'width=device-width is set correctly' : 'Viewport may not use device width'}
              why="width=device-width ensures the page fills the mobile screen. Without it, content may appear zoomed out or misaligned."
              fix={'Set viewport to content="width=device-width, initial-scale=1" — the standard responsive configuration.'}
            />
            <CheckRow
              status={result.mobile.usesResponsiveImages ? 'pass' : 'warn'}
              name="Responsive images (srcset)"
              detail={result.mobile.usesResponsiveImages ? 'srcset attributes detected on images' : 'No srcset attributes found — single image size for all devices'}
              why="Responsive images (srcset) let browsers download the right image size for each device — smaller on phones, full-size on desktop."
              fix={'Add srcset and sizes attributes to your <img> tags, or use a responsive image component/CDN that does this automatically.'}
            />
            <CheckRow
              status={result.mobile.hasTouchIcons ? 'pass' : 'warn'}
              name="Apple touch icons"
              detail={result.mobile.hasTouchIcons ? 'Apple touch icon links found' : 'No Apple touch icons detected'}
              why="Touch icons appear when users add your site to their iPhone/iPad home screen. Without one, iOS shows a screenshot thumbnail."
              fix={'Add <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"> with a 180x180px PNG icon.'}
            />
            <CheckRow
              status={result.mobile.textTooSmall ? 'fail' : 'pass'}
              name="No tiny font sizes"
              detail={result.mobile.textTooSmall ? 'Small font sizes detected — may be hard to read on mobile' : 'Font sizes appear appropriate for mobile'}
              why="Text smaller than 12px is hard to read on mobile screens. Google uses this as a mobile usability signal."
              fix="Ensure body text is at least 14–16px. Use relative units (em, rem) rather than fixed pixel sizes for better scaling."
            />
          </SectionCard>

          {/* ── Content Section ── */}
          <SectionCard id="section-content" title="Content" icon={FileText} score={result.scores.content}>
            <CheckRow
              status={result.content.wordCount >= 300 ? 'pass' : result.content.wordCount >= 100 ? 'warn' : 'fail'}
              name={`Word count (${result.content.wordCount.toLocaleString()} words)`}
              detail={result.content.wordCount >= 300 ? 'Good amount of content' : result.content.wordCount >= 100 ? 'Thin content — consider adding more' : 'Very little content — pages with thin content rank poorly'}
              why="Pages with at least 300 words give search engines enough content to understand your topic and rank you appropriately."
              fix="Aim for at least 300 words on your homepage and 500+ on service/product pages. Focus on what your customers need to know."
            />
            <CheckRow
              status={result.content.hasContactForm ? 'pass' : 'warn'}
              name="Contact form"
              detail={result.content.hasContactForm ? 'Contact form detected' : 'No contact form detected'}
              why="A contact form reduces friction for enquiries. Visitors who can't easily contact you will leave for a competitor."
              fix="Add a contact form to your site. At minimum: name, email, and message fields. Tools like Gravity Forms or WPForms make this easy."
            />
            <CheckRow
              status={result.content.hasPhoneNumber ? 'pass' : 'warn'}
              name="Phone number"
              detail={result.content.hasPhoneNumber ? 'Phone number found on page' : 'No phone number detected on this page'}
              why="Displaying your phone number builds trust, especially for local businesses. It's a key local SEO signal and increases conversions."
              fix="Add your phone number prominently in your header and footer. Use a tel: link so mobile users can tap to call."
            />
            <CheckRow
              status={result.content.hasEmail ? 'pass' : 'warn'}
              name="Email address"
              detail={result.content.hasEmail ? 'Email address found' : 'No email address found — hard for customers to reach you'}
              why="An email address gives visitors another way to contact you and signals your site belongs to a real, accessible business."
              fix="Add your business email address to your contact page and footer. Use a professional domain email (you@yourdomain.com)."
            />
            <CheckRow
              status={result.content.hasAddress ? 'pass' : 'warn'}
              name="Business address"
              detail={result.content.hasAddress ? 'Address information found' : 'No address detected — important for local SEO'}
              why="Your physical address is a critical local SEO signal. Google uses NAP (name, address, phone) consistency to rank local businesses."
              fix="Add your full business address to your contact page and footer. Ensure it matches exactly what's on your Google Business Profile."
            />
            <CheckRow
              status={result.content.hasSocialLinks ? 'pass' : 'warn'}
              name="Social media links"
              detail={result.content.hasSocialLinks ? 'Social media links found' : 'No social media links detected'}
              why="Social links signal to visitors and search engines that your business has an active presence across the web."
              fix="Add links to your active social profiles in your footer or header. Only link to profiles you actually maintain."
            />
            <CheckRow
              status={result.content.hasPrivacyPolicy ? 'pass' : 'fail'}
              name="Privacy Policy"
              detail={result.content.hasPrivacyPolicy ? 'Privacy policy link detected' : 'No privacy policy found — legally required if you collect data'}
              why="A privacy policy is legally required under UK GDPR if you collect any personal data (contact forms, analytics, cookies)."
              fix="Add a privacy policy page explaining what data you collect and why. Free generators are available at ico.org.uk."
            />
            <CheckRow
              status={result.content.hasCookieNotice ? 'pass' : 'warn'}
              name="Cookie notice / consent"
              detail={result.content.hasCookieNotice ? 'Cookie notice detected' : 'No cookie notice found'}
              why="UK GDPR and PECR require a cookie consent banner if you use non-essential cookies (analytics, advertising, social embeds)."
              fix="Add a cookie consent tool (Cookiebot, CookieYes, etc.) if you use Google Analytics, Facebook Pixel, or any tracking scripts."
            />
            {result.content.brokenInternalLinks > 0 && (
              <CheckRow
                status="fail"
                name={`Broken internal links (${result.content.brokenInternalLinks} found)`}
                detail={`${result.content.brokenInternalLinks} internal link${result.content.brokenInternalLinks > 1 ? 's' : ''} appear to be broken`}
                why="Broken links create a poor user experience and waste crawl budget. They signal to search engines that your site is poorly maintained."
                fix="Use a tool like Screaming Frog or Broken Link Checker to find and fix all broken links on your site."
              />
            )}
            {result.content.brokenInternalLinks === 0 && (
              <CheckRow
                status="pass"
                name="Internal links"
                detail={`${result.content.totalLinks} links found, none appear broken`}
              />
            )}
          </SectionCard>

          {/* ── Technology Section ── */}
          {(result.technology.platform || result.technology.framework || result.technology.analytics.length > 0 || result.technology.fonts.length > 0 || result.technology.cdn || result.technology.cms) && (
            <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={18} color="#E85D3A" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#1A1A1A', fontWeight: 400, margin: 0 }}>Technology</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {result.technology.platform && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform</span>
                    <p style={{ fontSize: 14, color: '#1A1A1A', margin: '4px 0 0', fontWeight: 500 }}>{result.technology.platform}</p>
                  </div>
                )}
                {result.technology.cms && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CMS</span>
                    <p style={{ fontSize: 14, color: '#1A1A1A', margin: '4px 0 0', fontWeight: 500 }}>{result.technology.cms}</p>
                  </div>
                )}
                {result.technology.framework && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Framework</span>
                    <p style={{ fontSize: 14, color: '#1A1A1A', margin: '4px 0 0', fontWeight: 500 }}>{result.technology.framework}</p>
                  </div>
                )}
                {result.technology.cdn && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CDN</span>
                    <p style={{ fontSize: 14, color: '#1A1A1A', margin: '4px 0 0', fontWeight: 500 }}>{result.technology.cdn}</p>
                  </div>
                )}
                {result.technology.analytics.length > 0 && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Analytics</span>
                    <p style={{ fontSize: 14, color: '#1A1A1A', margin: '4px 0 0', fontWeight: 500 }}>{result.technology.analytics.join(', ')}</p>
                  </div>
                )}
                {result.technology.fonts.length > 0 && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fonts</span>
                    <p style={{ fontSize: 14, color: '#1A1A1A', margin: '4px 0 0', fontWeight: 500 }}>{result.technology.fonts.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Comparison Section ── */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#1A1A1A', fontWeight: 400, marginBottom: 6 }}>How does your site compare?</h2>
            <p style={{ fontSize: 13, color: '#7A7A7A', marginBottom: 24 }}>See how your score stacks up against typical websites</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Average small business website', score: 45, sub: 'Typical SME with no active optimisation' },
                { label: 'Your site', score: result.scores.overall, sub: result.url, highlight: true },
                { label: 'Nith Digital client average', score: 85, sub: 'After our build & optimisation process' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: item.highlight ? 700 : 500, color: item.highlight ? '#1A1A1A' : '#7A7A7A' }}>{item.label}</span>
                      <span style={{ fontSize: 11, color: '#7A7A7A', marginLeft: 8 }}>{item.sub}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: item.highlight ? scoreColor(item.score) : '#7A7A7A', minWidth: 36, textAlign: 'right' }}>{item.score}</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${item.score}%`,
                      background: item.highlight ? scoreColor(item.score) : item.score >= 75 ? '#16A34A' : '#D97706',
                      borderRadius: 4, transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
              <p style={{ fontSize: 13, color: '#7A7A7A', marginBottom: 12 }}>
                Want to see what a Nith Digital site looks like?
              </p>
              <Link href="/templates" style={{ fontSize: 13, color: '#E85D3A', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                View our templates <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* ── Lead Capture Form ── */}
          <div style={{ background: '#1A1A1A', borderRadius: 12, padding: '32px 36px', marginBottom: 20 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={22} color="#16A34A" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#FAF8F5', fontWeight: 400, marginBottom: 8 }}>
                  Report on its way!
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.65)', lineHeight: 1.6 }}>
                  We&apos;ll send a detailed breakdown to {contactEmail} shortly. Keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#FAF8F5', fontWeight: 400, marginBottom: 6 }}>
                  Want a detailed breakdown emailed to you?
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.6)', marginBottom: 24, lineHeight: 1.6 }}>
                  We&apos;ll send a full report with prioritised recommendations for {new URL(result.url.startsWith('http') ? result.url : 'https://' + result.url).hostname}.
                </p>
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="audit-form-grid">
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(250,248,245,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="Your name"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(250,248,245,0.15)', background: 'rgba(250,248,245,0.07)', color: '#FAF8F5', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(250,248,245,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(250,248,245,0.15)', background: 'rgba(250,248,245,0.07)', color: '#FAF8F5', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(250,248,245,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone (optional)</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      placeholder="+44 7700 000000"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(250,248,245,0.15)', background: 'rgba(250,248,245,0.07)', color: '#FAF8F5', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !contactName || !contactEmail}
                    style={{
                      marginTop: 4, padding: '13px', background: '#E85D3A', color: '#1A1A1A',
                      borderRadius: 100, border: 'none', fontSize: 14, fontWeight: 700,
                      cursor: submitting || !contactName || !contactEmail ? 'not-allowed' : 'pointer',
                      opacity: submitting || !contactName || !contactEmail ? 0.7 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {submitting ? 'Sending...' : 'Send me the report →'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ── CTA Banner ── */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #333333 100%)',
            borderRadius: 16, padding: '40px 40px', textAlign: 'center',
            border: '1px solid rgba(232,93,58,0.2)',
          }}>
            <p style={{ fontSize: 11, color: '#E85D3A', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
              Ready to fix it?
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#FAF8F5', fontWeight: 400, marginBottom: 10 }}>
              We can fix all of this.
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.7)', marginBottom: 28, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>
              Our team builds fast, SEO-optimised websites for Scottish businesses.
              Book a free 30-minute call and we&apos;ll walk through your results together.
            </p>
            <Link
              href="/book"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', background: '#E85D3A', color: '#1A1A1A',
                borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none',
              }}
            >
              Book a free call <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ── Default empty state (no result, no loading, no error) ── */}
      {!result && !loading && !error && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="audit-features-grid">
            {[
              { icon: Search, title: 'SEO Analysis', desc: 'Title tags, meta descriptions, headings, structured data, sitemaps and more.' },
              { icon: Zap, title: 'Performance', desc: 'Page size, scripts, compression, lazy loading, image formats and caching signals.' },
              { icon: Shield, title: 'Security', desc: 'HTTPS, HSTS headers, Content Security Policy and mixed content detection.' },
              { icon: Smartphone, title: 'Mobile Readiness', desc: 'Viewport settings, responsive images, touch icons and mobile usability signals.' },
              { icon: FileText, title: 'Content Quality', desc: 'Word count, contact details, privacy policy, cookie consent and broken links.' },
              { icon: Globe, title: 'Technology', desc: 'Platform, CMS, analytics tools, fonts, CDN and framework detection.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#fff', borderRadius: 12, padding: '24px 24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <item.icon size={18} color="#1A1A1A" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#1A1A1A', fontWeight: 400, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#7A7A7A', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .audit-summary { flex-direction: column !important; align-items: flex-start !important; }
          .audit-score-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .audit-features-grid { grid-template-columns: 1fr !important; }
          .audit-form-grid { grid-template-columns: 1fr !important; }
          .audit-cat-card { padding: 12px 8px !important; }
        }
        @media (max-width: 420px) {
          .audit-score-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
