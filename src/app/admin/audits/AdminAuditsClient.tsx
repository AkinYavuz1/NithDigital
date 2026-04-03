'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  Download, Trash2, FileSignature, ChevronDown, ChevronUp,
  Globe, Loader2, CheckCircle, XCircle,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditResult {
  url: string
  fetchedAt: string
  loadTimeMs: number
  title: string | null
  metaDescription: string | null
  scores: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number }
  seo: {
    hasTitle: boolean; titleLength: number; hasMetaDescription: boolean; metaDescriptionLength: number
    hasCanonical: boolean; hasRobotsTxt: boolean; hasSitemap: boolean; h1Count: number; h1Text: string[]
    hasStructuredData: boolean; hasOpenGraph: boolean; hasTwitterCard: boolean; metaKeywords: string | null
    imgWithoutAlt: number; totalImages: number
  }
  security: { isHttps: boolean; hasHSTS: boolean; hasCSP: boolean; mixedContent: boolean }
  performance: {
    htmlSizeKb: number; totalScripts: number; totalStylesheets: number; inlineStyleCount: number
    hasMinifiedAssets: boolean; usesModernImageFormats: boolean; hasLazyLoading: boolean
    hasViewport: boolean; hasFontPreload: boolean; totalExternalRequests: number; usesGzip: boolean
  }
  mobile: { hasViewportMeta: boolean; viewportContent: string | null; usesResponsiveImages: boolean; hasTouchIcons: boolean; textTooSmall: boolean }
  content: {
    wordCount: number; hasContactForm: boolean; hasPhoneNumber: boolean; hasEmail: boolean
    hasAddress: boolean; hasSocialLinks: boolean; hasCookieNotice: boolean; hasPrivacyPolicy: boolean
    totalLinks: number; brokenInternalLinks: number; externalLinks: number
  }
  technology: { platform: string | null; framework: string | null; analytics: string[]; fonts: string[]; cdn: string | null; cms: string | null }
}

interface SiteAudit {
  id: string
  url: string
  business_name: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  audit_result: AuditResult
  overall_score: number
  seo_score: number
  performance_score: number
  security_score: number
  mobile_score: number
  content_score: number
  technology_detected: string | null
  notes: string | null
  status: string
  created_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['new', 'proposal_sent', 'converted', 'archived']
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  proposal_sent: { bg: 'rgba(212,168,75,0.12)', color: '#D4A84B' },
  converted: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  archived: { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' },
}

const FILTER_TABS = ['all', 'new', 'proposal_sent', 'converted', 'archived']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreBg(score: number): { bg: string; color: string } {
  if (score >= 70) return { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' }
  if (score >= 40) return { bg: 'rgba(217,119,6,0.1)', color: '#D97706' }
  return { bg: 'rgba(220,38,38,0.1)', color: '#DC2626' }
}

function extractDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

function getTopIssues(result: AuditResult): string[] {
  const issues: string[] = []
  if (!result.security.isHttps) issues.push('No HTTPS')
  if (!result.seo.hasTitle) issues.push('No title tag')
  if (!result.seo.hasMetaDescription) issues.push('No meta description')
  if (!result.mobile.hasViewportMeta) issues.push('No viewport meta')
  if (result.security.mixedContent) issues.push('Mixed content')
  if (!result.content.hasPrivacyPolicy) issues.push('No privacy policy')
  if (!result.seo.hasSitemap) issues.push('No sitemap')
  if (!result.seo.hasStructuredData) issues.push('No structured data')
  if (result.content.wordCount < 300) issues.push(`Low word count (${result.content.wordCount})`)
  if (!result.content.hasContactForm) issues.push('No contact form')
  return issues.slice(0, 6)
}

const iconBtn: React.CSSProperties = {
  background: 'rgba(27,42,74,0.06)',
  border: 'none',
  borderRadius: 6,
  padding: '5px 7px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: '#5A6A7A',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminAuditsClient() {
  const [audits, setAudits] = useState<SiteAudit[]>([])
  const [loading, setLoading] = useState(true)
  const [urlInput, setUrlInput] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)
  const [showContactFields, setShowContactFields] = useState(false)
  const [selectedAudit, setSelectedAudit] = useState<SiteAudit | null>(null)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [toast, setToast] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const router = useRouter()

  // ── Data Loading ─────────────────────────────────────────

  const fetchAudits = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_audits').select('*').order('created_at', { ascending: false })
    if (data) setAudits(data)
    setLoading(false)
  }

  useEffect(() => { fetchAudits() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toast ────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // ── Run New Audit ────────────────────────────────────────

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    setRunning(true)
    setRunError(null)

    let targetUrl = urlInput.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Audit failed (${res.status})`)
      }
      const result: AuditResult = await res.json()

      const techItems = [
        result.technology.platform,
        result.technology.framework,
        result.technology.cms,
        result.technology.cdn,
      ].filter(Boolean).join(', ')

      const supabase = createClient()
      const { data: inserted } = await supabase.from('site_audits').insert({
        url: result.url,
        business_name: businessName.trim() || null,
        contact_name: contactName.trim() || null,
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
        audit_result: result,
        overall_score: result.scores.overall,
        seo_score: result.scores.seo,
        performance_score: result.scores.performance,
        security_score: result.scores.security,
        mobile_score: result.scores.mobile,
        content_score: result.scores.content,
        technology_detected: techItems || null,
        status: 'new',
      }).select().single()

      if (inserted) {
        setAudits(prev => [inserted, ...prev])
        setSelectedAudit(inserted)
        setNotes('')
      }

      // Reset form
      setUrlInput('')
      setBusinessName('')
      setContactName('')
      setContactEmail('')
      setContactPhone('')
      setShowContactFields(false)
      showToast('Audit complete')
    } catch (err) {
      setRunError(err instanceof Error ? err.message : 'Audit failed — please try again')
    } finally {
      setRunning(false)
    }
  }

  // ── Update Status ────────────────────────────────────────

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('site_audits').update({ status }).eq('id', id)
    setAudits(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selectedAudit?.id === id) setSelectedAudit(prev => prev ? { ...prev, status } : prev)
  }

  // ── Save Notes ───────────────────────────────────────────

  const saveNotes = async () => {
    if (!selectedAudit) return
    setSavingNotes(true)
    const supabase = createClient()
    await supabase.from('site_audits').update({ notes }).eq('id', selectedAudit.id)
    setAudits(prev => prev.map(a => a.id === selectedAudit.id ? { ...a, notes } : a))
    setSelectedAudit(prev => prev ? { ...prev, notes } : prev)
    setSavingNotes(false)
    showToast('Notes saved')
  }

  // ── Delete ───────────────────────────────────────────────

  const deleteAudit = async (id: string) => {
    if (!confirm('Delete this audit? This cannot be undone.')) return
    const supabase = createClient()
    await supabase.from('site_audits').delete().eq('id', id)
    setAudits(prev => prev.filter(a => a.id !== id))
    if (selectedAudit?.id === id) setSelectedAudit(null)
    showToast('Audit deleted')
  }

  // ── Download PDF ─────────────────────────────────────────

  const downloadPDF = async (audit: SiteAudit) => {
    const { generateAuditPDF } = await import('@/app/tools/site-audit/auditPdf')
    await generateAuditPDF(audit.audit_result)
  }

  // ── Create Proposal ──────────────────────────────────────

  const createProposal = (audit: SiteAudit) => {
    const result = audit.audit_result
    const services: string[] = []
    if (result.scores.seo < 50) services.push('SEO setup for local search (Google Business Profile, meta tags, sitemap)')
    if (result.scores.mobile < 50) services.push('Mobile-responsive business website')
    if (!result.content.hasContactForm) services.push('Contact form with email notifications')
    const platform = (result.technology.platform || result.technology.cms || '').toLowerCase()
    if (platform.includes('wix') || platform.includes('squarespace') || platform.includes('weebly')) {
      if (!services.includes('Mobile-responsive business website')) {
        services.push('Mobile-responsive business website')
      }
    }
    if (services.length === 0) services.push('Mobile-responsive business website')
    services.push('Monthly hosting and support')

    const notesParam = `Based on our website audit (score: ${audit.overall_score}/100), we recommend: ${services.slice(0, 3).join('; ')}.`
    const params = new URLSearchParams({
      business_name: audit.business_name || extractDomain(audit.url),
      ...(audit.contact_name ? { contact_name: audit.contact_name } : {}),
      ...(audit.contact_email ? { contact_email: audit.contact_email } : {}),
      notes: notesParam,
      from_audit: audit.id,
    })
    router.push(`/admin/proposals/new?${params.toString()}`)
  }

  // ── Filtered list ────────────────────────────────────────

  const filtered = statusFilter === 'all' ? audits : audits.filter(a => a.status === statusFilter)

  // ── Stats ────────────────────────────────────────────────

  const now = new Date()
  const thisMonth = audits.filter(a => {
    const d = new Date(a.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const avgScore = audits.length > 0
    ? Math.round(audits.reduce((s, a) => s + a.overall_score, 0) / audits.length)
    : 0

  // ── Render ───────────────────────────────────────────────

  return (
    <div style={{ padding: '32px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Site Audits</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A' }}>{audits.length} total audits</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }} className="admin-audits-stats">
        {[
          { label: 'Total audits', value: audits.length },
          { label: 'This month', value: thisMonth.length },
          { label: 'Avg overall score', value: audits.length ? `${avgScore}/100` : '—' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 20, border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#5A6A7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Run New Audit Panel */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', padding: 24, marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, marginBottom: 16, color: '#1B2A4A' }}>Run New Audit</h2>
        <form onSubmit={runAudit}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              disabled={running}
              style={{
                flex: '1 1 300px', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.15)',
                fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#1B2A4A',
              }}
            />
            <button
              type="submit"
              disabled={running || !urlInput.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', background: running ? 'rgba(27,42,74,0.4)' : '#1B2A4A',
                color: '#F5F0E6', border: 'none', borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: running || !urlInput.trim() ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {running ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Running audit...</> : <><Globe size={14} /> Run audit</>}
            </button>
          </div>

          {/* Contact fields toggle */}
          <button
            type="button"
            onClick={() => setShowContactFields(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#D4A84B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: showContactFields ? 12 : 0 }}
          >
            {showContactFields ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showContactFields ? 'Hide contact details' : 'Add contact details (optional)'}
          </button>

          {showContactFields && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, paddingTop: 4 }}>
              {[
                { placeholder: 'Business name', value: businessName, onChange: setBusinessName },
                { placeholder: 'Contact name', value: contactName, onChange: setContactName },
                { placeholder: 'Contact email', value: contactEmail, onChange: setContactEmail },
                { placeholder: 'Contact phone', value: contactPhone, onChange: setContactPhone },
              ].map(f => (
                <input
                  key={f.placeholder}
                  type="text"
                  value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  placeholder={f.placeholder}
                  style={{
                    padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.15)',
                    fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#1B2A4A',
                  }}
                />
              ))}
            </div>
          )}

          {runError && (
            <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(220,38,38,0.08)', borderRadius: 8, fontSize: 13, color: '#DC2626' }}>
              {runError}
            </div>
          )}
        </form>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTER_TABS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', border: 'none',
              background: statusFilter === s ? '#1B2A4A' : 'rgba(27,42,74,0.06)',
              color: statusFilter === s ? '#F5F0E6' : '#5A6A7A',
            }}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Audits table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden', marginBottom: 28 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
                {['Site / Business', 'Overall', 'SEO', 'Perf.', 'Security', 'Mobile', 'Content', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>
                    No audits yet — run your first audit above
                  </td>
                </tr>
              ) : filtered.map((audit, i) => {
                const sc = STATUS_COLORS[audit.status] || STATUS_COLORS.new
                const ovCol = scoreBg(audit.overall_score)
                const isSelected = selectedAudit?.id === audit.id
                return (
                  <tr
                    key={audit.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none',
                      background: isSelected ? 'rgba(212,168,75,0.04)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 500, color: '#1B2A4A', fontSize: 13 }}>
                        {audit.business_name || extractDomain(audit.url)}
                      </div>
                      <div style={{ fontSize: 11, color: '#5A6A7A' }}>{extractDomain(audit.url)}</div>
                      {audit.contact_name && <div style={{ fontSize: 11, color: '#5A6A7A' }}>{audit.contact_name}</div>}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 9px', borderRadius: 100,
                        fontSize: 12, fontWeight: 700, background: ovCol.bg, color: ovCol.color,
                      }}>
                        {audit.overall_score}
                      </span>
                    </td>
                    {[audit.seo_score, audit.performance_score, audit.security_score, audit.mobile_score, audit.content_score].map((score, si) => {
                      const c = scoreBg(score)
                      return (
                        <td key={si} style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: c.color }}>{score}</span>
                        </td>
                      )
                    })}
                    <td style={{ padding: '12px 10px', color: '#5A6A7A', fontSize: 11, whiteSpace: 'nowrap' }}>
                      {new Date(audit.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <select
                        value={audit.status}
                        onChange={e => updateStatus(audit.id, e.target.value)}
                        style={{
                          padding: '4px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                          border: 'none', background: sc.bg, color: sc.color, cursor: 'pointer',
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'nowrap' }}>
                        <button
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAudit(null)
                            } else {
                              setSelectedAudit(audit)
                              setNotes(audit.notes || '')
                            }
                          }}
                          title={isSelected ? 'Close detail' : 'View detail'}
                          style={{ ...iconBtn, color: isSelected ? '#D4A84B' : '#5A6A7A' }}
                        >
                          {isSelected ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                        <button
                          onClick={() => downloadPDF(audit)}
                          title="Download PDF"
                          style={iconBtn}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => createProposal(audit)}
                          title="Create proposal"
                          style={{ ...iconBtn, background: 'rgba(212,168,75,0.12)', color: '#D4A84B' }}
                        >
                          <FileSignature size={13} />
                        </button>
                        <button
                          onClick={() => deleteAudit(audit.id)}
                          title="Delete"
                          style={{ ...iconBtn, color: '#DC2626' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail view */}
      {selectedAudit && (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', padding: 28, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 4 }}>
                {selectedAudit.business_name || extractDomain(selectedAudit.url)}
              </h2>
              <a href={selectedAudit.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#5A6A7A', textDecoration: 'none' }}>
                {selectedAudit.url}
              </a>
              {selectedAudit.contact_name && (
                <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 4 }}>
                  {selectedAudit.contact_name}
                  {selectedAudit.contact_email && ` · ${selectedAudit.contact_email}`}
                  {selectedAudit.contact_phone && ` · ${selectedAudit.contact_phone}`}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => downloadPDF(selectedAudit)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(27,42,74,0.06)', color: '#1B2A4A', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}
              >
                <Download size={13} /> Download PDF
              </button>
              <button
                onClick={() => createProposal(selectedAudit)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(212,168,75,0.12)', color: '#D4A84B', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
              >
                <FileSignature size={13} /> Create Proposal
              </button>
            </div>
          </div>

          {/* Score cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 24 }} className="admin-audits-scores">
            {[
              { label: 'Overall', score: selectedAudit.overall_score },
              { label: 'SEO', score: selectedAudit.seo_score },
              { label: 'Performance', score: selectedAudit.performance_score },
              { label: 'Security', score: selectedAudit.security_score },
              { label: 'Mobile', score: selectedAudit.mobile_score },
              { label: 'Content', score: selectedAudit.content_score },
            ].map(cat => {
              const c = scoreBg(cat.score)
              return (
                <div key={cat.label} style={{ background: c.bg, borderRadius: 8, padding: '14px 10px', textAlign: 'center', border: `1px solid ${c.color}22` }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{cat.score}</div>
                  <div style={{ fontSize: 10, color: '#5A6A7A', marginTop: 2 }}>{cat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Top issues */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 10 }}>Top Issues</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {getTopIssues(selectedAudit.audit_result).map(issue => (
                <span
                  key={issue}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(220,38,38,0.08)', color: '#DC2626', borderRadius: 100, fontSize: 11, fontWeight: 500 }}
                >
                  <XCircle size={11} /> {issue}
                </span>
              ))}
              {getTopIssues(selectedAudit.audit_result).length === 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(22,163,74,0.1)', color: '#16a34a', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>
                  <CheckCircle size={11} /> No critical issues found
                </span>
              )}
            </div>
          </div>

          {/* Technology detected */}
          {selectedAudit.technology_detected && (
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: '#5A6A7A' }}>
                <strong style={{ color: '#1B2A4A' }}>Technology: </strong>
                {selectedAudit.technology_detected}
              </span>
            </div>
          )}

          {/* Two-column: notes + status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 20, alignItems: 'start' }} className="admin-audits-notes-grid">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 6 }}>Internal Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about this prospect..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.15)',
                  fontSize: 13, fontFamily: 'inherit', color: '#1B2A4A', resize: 'vertical',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                style={{
                  marginTop: 8, padding: '8px 16px', background: '#1B2A4A', color: '#F5F0E6',
                  border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                {savingNotes ? 'Saving...' : 'Save notes'}
              </button>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 6 }}>Status</label>
              <select
                value={selectedAudit.status}
                onChange={e => updateStatus(selectedAudit.id, e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.15)',
                  fontSize: 13, fontFamily: 'inherit', color: '#1B2A4A', outline: 'none', cursor: 'pointer',
                }}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1B2A4A', color: '#F5F0E6', padding: '12px 20px', borderRadius: 8, fontSize: 13, zIndex: 100, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .admin-audits-stats { grid-template-columns: 1fr 1fr !important; }
          .admin-audits-scores { grid-template-columns: repeat(3, 1fr) !important; }
          .admin-audits-notes-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
