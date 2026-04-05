'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Search, RefreshCw, Send, ChevronDown, ChevronUp,
  Download, CheckSquare, Square, Mail, Globe, AlertCircle, Zap
} from 'lucide-react'

interface ScrapedLead {
  id: string
  business_name: string
  website: string | null
  contact_email: string | null
  phone: string | null
  address: string | null
  category: string | null
  source: string | null
  overall_score: number | null
  seo_score: number | null
  security_score: number | null
  performance_score: number | null
  mobile_score: number | null
  content_score: number | null
  issues: string[] | null
  platform: string | null
  email_subject: string | null
  email_body: string | null
  status: string
  sent_at: string | null
  created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  audited: { bg: 'rgba(139,92,246,0.12)', color: '#7c3aed' },
  drafted: { bg: 'rgba(212,168,75,0.12)', color: '#D4A84B' },
  approved: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  sent: { bg: 'rgba(34,197,94,0.2)', color: '#15803d' },
  failed: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
  skipped: { bg: 'rgba(156,163,175,0.15)', color: '#6B7280' },
}

const SCORE_COLOR = (s: number) =>
  s >= 70 ? '#16a34a' : s >= 45 ? '#D4A84B' : '#dc2626'

const SECRET = 'nith-email-secret'

type Tab = 'scrape' | 'audit' | 'draft' | 'review' | 'sent'

export default function AdminLeadsClient() {
  const [leads, setLeads] = useState<ScrapedLead[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('review')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [working, setWorking] = useState(false)
  const [workingMsg, setWorkingMsg] = useState('')
  const [progress, setProgress] = useState(0)
  const [progressMax, setProgressMax] = useState(0)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Scrape form
  const [scrapeCategory, setScrapeCategory] = useState('business')
  const [scrapeSources, setScrapeSources] = useState<string[]>(['thomson', 'chamber', 'scoot'])

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchLeads = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('scraped_leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setLeads(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const supabaseClient = createClient()

  // ── Scrape ──────────────────────────────────────────────────────────────────
  const handleScrape = async () => {
    setWorking(true)
    setWorkingMsg('Scraping directories...')
    setProgress(0)
    setProgressMax(0)

    try {
      const res = await fetch('/api/scrape-directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SECRET}` },
        body: JSON.stringify({ sources: scrapeSources, category: scrapeCategory }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scrape failed')

      const businesses = data.businesses || []
      if (businesses.length === 0) {
        showToast('No businesses found. Try different sources or category.', false)
        return
      }

      showToast(`Scraped ${businesses.length} businesses successfully`)
      await fetchLeads()
      setTab('audit')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Scrape failed', false)
    } finally {
      setWorking(false)
      setWorkingMsg('')
    }
  }

  // ── Batch Audit ──────────────────────────────────────────────────────────────
  const handleBatchAudit = async () => {
    const toAudit = leads.filter(l => l.status === 'new' && l.website)
    if (toAudit.length === 0) {
      showToast('No new leads with websites to audit', false)
      return
    }

    setWorking(true)
    setProgressMax(toAudit.length)
    setProgress(0)

    const CHUNK = 20
    let done = 0

    for (let i = 0; i < toAudit.length; i += CHUNK) {
      const chunk = toAudit.slice(i, i + CHUNK)
      setWorkingMsg(`Auditing ${done + 1}–${Math.min(done + CHUNK, toAudit.length)} of ${toAudit.length}...`)

      try {
        const res = await fetch('/api/batch-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SECRET}` },
          body: JSON.stringify({ urls: chunk.map(l => l.website) }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        // Update each lead in Supabase
        for (const result of data.results) {
          const lead = chunk.find(l => l.website === result.url)
          if (!lead) continue

          await supabaseClient.from('scraped_leads').update({
            overall_score: result.scores.overall,
            seo_score: result.scores.seo,
            security_score: result.scores.security,
            performance_score: result.scores.performance,
            mobile_score: result.scores.mobile,
            content_score: result.scores.content,
            issues: result.issues,
            platform: result.platform,
            status: 'audited',
          }).eq('id', lead.id)

          done++
          setProgress(done)
        }
      } catch (err) {
        console.error('Audit chunk error:', err)
      }
    }

    showToast(`Audited ${done} websites`)
    await fetchLeads()
    setTab('draft')
    setWorking(false)
    setWorkingMsg('')
  }

  // ── Draft Emails ──────────────────────────────────────────────────────────────
  const handleDraftEmails = async () => {
    const toDraft = leads.filter(l => l.status === 'audited' || l.status === 'new')
    if (toDraft.length === 0) {
      showToast('No leads ready for email drafting', false)
      return
    }

    setWorking(true)
    setProgressMax(toDraft.length)
    setProgress(0)

    const CHUNK = 20
    let done = 0

    for (let i = 0; i < toDraft.length; i += CHUNK) {
      const chunk = toDraft.slice(i, i + CHUNK)
      setWorkingMsg(`Drafting emails ${done + 1}–${Math.min(done + CHUNK, toDraft.length)} of ${toDraft.length}...`)

      try {
        const res = await fetch('/api/draft-outreach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SECRET}` },
          body: JSON.stringify({
            leads: chunk.map(l => ({
              businessName: l.business_name,
              website: l.website,
              scores: l.overall_score != null ? {
                seo: l.seo_score || 0,
                security: l.security_score || 0,
                performance: l.performance_score || 0,
                mobile: l.mobile_score || 0,
                content: l.content_score || 0,
                overall: l.overall_score || 0,
              } : undefined,
              issues: l.issues || [],
              platform: l.platform,
              category: l.category,
              address: l.address,
            })),
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        for (const draft of data.drafts) {
          const lead = chunk.find(l => l.business_name === draft.businessName)
          if (!lead) continue

          await supabaseClient.from('scraped_leads').update({
            email_subject: draft.subject,
            email_body: draft.body,
            status: 'drafted',
          }).eq('id', lead.id)

          done++
          setProgress(done)
        }
      } catch (err) {
        console.error('Draft chunk error:', err)
      }
    }

    showToast(`Drafted ${done} emails`)
    await fetchLeads()
    setTab('review')
    setWorking(false)
    setWorkingMsg('')
  }

  // ── Approve / Send ───────────────────────────────────────────────────────────
  const approveSelected = async () => {
    const ids = Array.from(selected)
    if (ids.length === 0) return

    for (const id of ids) {
      await supabaseClient.from('scraped_leads').update({ status: 'approved' }).eq('id', id)
    }
    showToast(`${ids.length} leads approved`)
    await fetchLeads()
    setSelected(new Set())
  }

  const sendApproved = async () => {
    const approved = leads.filter(l => l.status === 'approved' && l.contact_email)
    if (approved.length === 0) {
      showToast('No approved leads with email addresses to send', false)
      return
    }

    setWorking(true)
    setWorkingMsg(`Sending ${approved.length} emails...`)

    try {
      const res = await fetch('/api/send-lead-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SECRET}` },
        body: JSON.stringify({ leadIds: approved.map(l => l.id) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      showToast(`Sent ${data.sent} emails${data.failed > 0 ? `, ${data.failed} failed` : ''}`)
      await fetchLeads()
      setTab('sent')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Send failed', false)
    } finally {
      setWorking(false)
      setWorkingMsg('')
    }
  }

  const updateEmail = async (id: string, field: 'email_subject' | 'email_body' | 'contact_email', value: string) => {
    await supabaseClient.from('scraped_leads').update({ [field]: value }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = (visibleLeads: ScrapedLead[]) => {
    const allIds = visibleLeads.map(l => l.id)
    const allSelected = allIds.every(id => selected.has(id))
    if (allSelected) {
      setSelected(prev => { const next = new Set(prev); allIds.forEach(id => next.delete(id)); return next })
    } else {
      setSelected(prev => { const next = new Set(prev); allIds.forEach(id => next.add(id)); return next })
    }
  }

  const exportCSV = () => {
    const headers = ['Business', 'Website', 'Email', 'Phone', 'Category', 'Source', 'Score', 'Status', 'Subject']
    const rows = leads.map(l => [
      l.business_name, l.website || '', l.contact_email || '', l.phone || '',
      l.category || '', l.source || '', l.overall_score ?? '', l.status, l.email_subject || '',
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'leads.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Filtered views ────────────────────────────────────────────────────────────
  const byTab: Record<Tab, ScrapedLead[]> = {
    scrape: [],
    audit: leads.filter(l => l.status === 'new'),
    draft: leads.filter(l => l.status === 'audited'),
    review: leads.filter(l => ['drafted', 'approved'].includes(l.status)),
    sent: leads.filter(l => ['sent', 'failed', 'skipped'].includes(l.status)),
  }

  const stats = {
    total: leads.length,
    audited: leads.filter(l => l.overall_score != null).length,
    drafted: leads.filter(l => l.email_body != null).length,
    approved: leads.filter(l => l.status === 'approved').length,
    sent: leads.filter(l => l.status === 'sent').length,
  }

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'scrape', label: '1. Scrape' },
    { key: 'audit', label: '2. Audit', count: byTab.audit.length },
    { key: 'draft', label: '3. Draft Emails', count: byTab.draft.length },
    { key: 'review', label: '4. Review & Send', count: byTab.review.length },
    { key: 'sent', label: 'Sent', count: stats.sent },
  ]

  const visibleLeads = tab === 'scrape' ? [] : byTab[tab]

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Lead Generator</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A' }}>Scrape D&G businesses · Audit their sites · Send personalised outreach</p>
        </div>
        <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#1B2A4A', color: '#F5F0E6', border: 'none', borderRadius: 100, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total leads', value: stats.total },
          { label: 'Audited', value: stats.audited },
          { label: 'Emails drafted', value: stats.drafted },
          { label: 'Approved', value: stats.approved },
          { label: 'Emails sent', value: stats.sent },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#5A6A7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid rgba(27,42,74,0.08)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? '#1B2A4A' : '#5A6A7A',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid #D4A84B' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: -2,
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}{t.count != null && t.count > 0 ? ` (${t.count})` : ''}
          </button>
        ))}
      </div>

      {/* Working overlay */}
      {working && (
        <div style={{ background: 'rgba(27,42,74,0.06)', borderRadius: 10, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <RefreshCw size={16} color="#D4A84B" style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2A4A', marginBottom: progressMax > 0 ? 8 : 0 }}>{workingMsg}</div>
            {progressMax > 0 && (
              <div style={{ background: 'rgba(27,42,74,0.1)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                <div style={{ background: '#D4A84B', height: '100%', width: `${(progress / progressMax) * 100}%`, transition: 'width 0.3s ease', borderRadius: 100 }} />
              </div>
            )}
          </div>
          {progressMax > 0 && (
            <span style={{ fontSize: 12, color: '#5A6A7A', whiteSpace: 'nowrap' }}>{progress}/{progressMax}</span>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: toast.ok ? '#1B2A4A' : '#dc2626', color: '#fff', padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {toast.msg}
        </div>
      )}

      {/* ── TAB: SCRAPE ── */}
      {tab === 'scrape' && (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', padding: '28px 32px', maxWidth: 560 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 6 }}>Scrape D&G Directories</h2>
          <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 24 }}>Fetch businesses from local directories. Runs in parallel across all selected sources.</p>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 6 }}>BUSINESS CATEGORY</label>
            <input
              value={scrapeCategory}
              onChange={e => setScrapeCategory(e.target.value)}
              placeholder="e.g. plumber, restaurant, hotel, accountant"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, color: '#1B2A4A', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 10 }}>SOURCES</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { key: 'yell', label: 'Yell.com' },
                { key: 'thomson', label: 'Thomson Local' },
                { key: 'chamber', label: 'D&G Chamber' },
                { key: 'scoot', label: 'Scoot.co.uk' },
              ].map(s => (
                <label key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#1B2A4A', padding: '10px 14px', border: `1px solid ${scrapeSources.includes(s.key) ? '#D4A84B' : 'rgba(27,42,74,0.12)'}`, borderRadius: 8, background: scrapeSources.includes(s.key) ? 'rgba(212,168,75,0.06)' : 'transparent' }}>
                  <input
                    type="checkbox"
                    checked={scrapeSources.includes(s.key)}
                    onChange={e => setScrapeSources(prev => e.target.checked ? [...prev, s.key] : prev.filter(x => x !== s.key))}
                    style={{ accentColor: '#D4A84B' }}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleScrape}
            disabled={working || scrapeSources.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#1B2A4A', color: '#F5F0E6', border: 'none', borderRadius: 100, cursor: working ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: working ? 0.6 : 1 }}
          >
            <Search size={14} /> {working ? 'Scraping...' : 'Scrape Businesses'}
          </button>
        </div>
      )}

      {/* ── TAB: AUDIT ── */}
      {tab === 'audit' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#5A6A7A' }}>{byTab.audit.length} new leads with websites ready to audit</p>
            <button
              onClick={handleBatchAudit}
              disabled={working || byTab.audit.filter(l => l.website).length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#1B2A4A', color: '#F5F0E6', border: 'none', borderRadius: 100, cursor: working ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: working ? 0.6 : 1 }}
            >
              <Zap size={14} /> {working ? 'Auditing...' : `Audit ${byTab.audit.filter(l => l.website).length} websites`}
            </button>
          </div>
          <LeadTable leads={byTab.audit} expanded={expanded} setExpanded={setExpanded} selected={selected} toggleSelect={toggleSelect} selectAll={selectAll} updateEmail={updateEmail} showScore showIssues={false} />
        </div>
      )}

      {/* ── TAB: DRAFT ── */}
      {tab === 'draft' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#5A6A7A' }}>{byTab.draft.length} audited leads ready for email drafting</p>
            <button
              onClick={handleDraftEmails}
              disabled={working || byTab.draft.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#1B2A4A', color: '#F5F0E6', border: 'none', borderRadius: 100, cursor: working ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: working ? 0.6 : 1 }}
            >
              <Mail size={14} /> {working ? 'Drafting...' : `Draft ${byTab.draft.length} emails with AI`}
            </button>
          </div>
          <LeadTable leads={byTab.draft} expanded={expanded} setExpanded={setExpanded} selected={selected} toggleSelect={toggleSelect} selectAll={selectAll} updateEmail={updateEmail} showScore showIssues />
        </div>
      )}

      {/* ── TAB: REVIEW & SEND ── */}
      {tab === 'review' && (
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13, color: '#5A6A7A', flex: 1 }}>
              Review AI-drafted emails. Edit subject/body/email address, then approve and send.
            </p>
            <button
              onClick={() => approveSelected()}
              disabled={selected.size === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, cursor: selected.size === 0 ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, opacity: selected.size === 0 ? 0.5 : 1 }}
            >
              <CheckSquare size={13} /> Approve selected ({selected.size})
            </button>
            <button
              onClick={sendApproved}
              disabled={working || stats.approved === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#1B2A4A', color: '#F5F0E6', border: 'none', borderRadius: 100, cursor: (working || stats.approved === 0) ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, opacity: (working || stats.approved === 0) ? 0.5 : 1 }}
            >
              <Send size={13} /> Send {stats.approved} approved emails
            </button>
          </div>
          <LeadTable leads={byTab.review} expanded={expanded} setExpanded={setExpanded} selected={selected} toggleSelect={toggleSelect} selectAll={selectAll} updateEmail={updateEmail} showScore showIssues showEmailEdit />
        </div>
      )}

      {/* ── TAB: SENT ── */}
      {tab === 'sent' && (
        <div>
          <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 20 }}>{stats.sent} emails sent</p>
          <LeadTable leads={byTab.sent} expanded={expanded} setExpanded={setExpanded} selected={selected} toggleSelect={toggleSelect} selectAll={selectAll} updateEmail={updateEmail} showScore showSentAt />
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 48, color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ── Shared Table Component ────────────────────────────────────────────────────
function LeadTable({
  leads, expanded, setExpanded, selected, toggleSelect, selectAll,
  updateEmail, showScore, showIssues, showEmailEdit, showSentAt
}: {
  leads: ScrapedLead[]
  expanded: string | null
  setExpanded: (id: string | null) => void
  selected: Set<string>
  toggleSelect: (id: string) => void
  selectAll: (leads: ScrapedLead[]) => void
  updateEmail: (id: string, field: 'email_subject' | 'email_body' | 'contact_email', value: string) => void
  showScore?: boolean
  showIssues?: boolean
  showEmailEdit?: boolean
  showSentAt?: boolean
}) {
  if (leads.length === 0) {
    return <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>No leads in this stage</div>
  }

  const allSelected = leads.length > 0 && leads.every(l => selected.has(l.id))

  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
            <th style={{ padding: '12px 14px', width: 36 }}>
              <button onClick={() => selectAll(leads)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {allSelected ? <CheckSquare size={14} color="#D4A84B" /> : <Square size={14} color="#5A6A7A" />}
              </button>
            </th>
            <th style={{ padding: '12px 14px', width: 28 }}></th>
            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>Business</th>
            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>Website</th>
            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>Email</th>
            {showScore && <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>Score</th>}
            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>Status</th>
            {showSentAt && <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>Sent</th>}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => {
            const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.new
            const isExpanded = expanded === lead.id
            return (
              <>
                <tr key={lead.id} style={{ borderBottom: isExpanded ? 'none' : i < leads.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none', background: selected.has(lead.id) ? 'rgba(212,168,75,0.04)' : 'transparent' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => toggleSelect(lead.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {selected.has(lead.id) ? <CheckSquare size={14} color="#D4A84B" /> : <Square size={14} color="#5A6A7A" />}
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => setExpanded(isExpanded ? null : lead.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {isExpanded ? <ChevronUp size={14} color="#5A6A7A" /> : <ChevronDown size={14} color="#5A6A7A" />}
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 500, color: '#1B2A4A' }}>{lead.business_name}</div>
                    {lead.category && <div style={{ fontSize: 11, color: '#5A6A7A' }}>{lead.category}</div>}
                    {lead.source && <div style={{ fontSize: 10, color: '#9CA3AF' }}>{lead.source}</div>}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {lead.website
                      ? <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={11} />{new URL(lead.website).hostname}</a>
                      : <span style={{ color: '#dc2626', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} /> No website</span>
                    }
                  </td>
                  <td style={{ padding: '12px 14px', color: '#5A6A7A', fontSize: 12 }}>{lead.contact_email || '—'}</td>
                  {showScore && (
                    <td style={{ padding: '12px 14px' }}>
                      {lead.overall_score != null
                        ? <span style={{ fontWeight: 700, color: SCORE_COLOR(lead.overall_score), fontSize: 14 }}>{lead.overall_score}</span>
                        : <span style={{ color: '#9CA3AF', fontSize: 12 }}>—</span>
                      }
                    </td>
                  )}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: sc.bg, color: sc.color }}>
                      {lead.status}
                    </span>
                  </td>
                  {showSentAt && (
                    <td style={{ padding: '12px 14px', color: '#5A6A7A', fontSize: 11 }}>
                      {lead.sent_at ? new Date(lead.sent_at).toLocaleDateString('en-GB') : '—'}
                    </td>
                  )}
                </tr>
                {isExpanded && (
                  <tr key={`${lead.id}-exp`} style={{ borderBottom: i < leads.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                    <td colSpan={showScore ? 8 : 7} style={{ padding: '0 14px 20px 62px', background: 'rgba(27,42,74,0.015)' }}>
                      <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: showEmailEdit ? '1fr 1fr' : '1fr 1fr 1fr', gap: 20 }}>
                        {/* Contact info */}
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</div>
                          {showEmailEdit ? (
                            <div>
                              <label style={{ fontSize: 11, color: '#5A6A7A', display: 'block', marginBottom: 4 }}>Email address to send to:</label>
                              <input
                                value={lead.contact_email || ''}
                                onChange={e => updateEmail(lead.id, 'contact_email', e.target.value)}
                                placeholder="Enter email address"
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, color: '#1B2A4A', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                              />
                              <div style={{ fontSize: 12, color: '#5A6A7A' }}>{lead.phone || 'No phone'}</div>
                              {lead.address && <div style={{ fontSize: 12, color: '#5A6A7A' }}>{lead.address}</div>}
                              {lead.platform && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Platform: {lead.platform}</div>}
                            </div>
                          ) : (
                            <div style={{ fontSize: 12, color: '#1B2A4A', lineHeight: 1.8 }}>
                              <div>{lead.contact_email || 'No email'}</div>
                              <div>{lead.phone || 'No phone'}</div>
                              {lead.address && <div>{lead.address}</div>}
                              {lead.platform && <div style={{ color: '#9CA3AF', fontSize: 11 }}>Platform: {lead.platform}</div>}
                            </div>
                          )}
                        </div>

                        {/* Issues / Scores */}
                        {showIssues !== false && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issues Found</div>
                            {lead.issues && lead.issues.length > 0 ? (
                              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: '#1B2A4A', lineHeight: 1.8 }}>
                                {lead.issues.map((issue, j) => <li key={j}>{issue}</li>)}
                              </ul>
                            ) : (
                              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{lead.overall_score != null ? 'No major issues' : 'Not audited yet'}</div>
                            )}
                          </div>
                        )}

                        {/* Email draft */}
                        {lead.email_body && (
                          <div style={{ gridColumn: showEmailEdit ? '1 / -1' : 'auto' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Draft</div>
                            {showEmailEdit ? (
                              <>
                                <input
                                  value={lead.email_subject || ''}
                                  onChange={e => updateEmail(lead.id, 'email_subject', e.target.value)}
                                  placeholder="Subject line"
                                  style={{ width: '100%', padding: '8px 10px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#1B2A4A', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                                />
                                <textarea
                                  value={lead.email_body || ''}
                                  onChange={e => updateEmail(lead.id, 'email_body', e.target.value)}
                                  rows={10}
                                  style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, color: '#1B2A4A', outline: 'none', resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6, boxSizing: 'border-box' }}
                                />
                              </>
                            ) : (
                              <div style={{ fontSize: 12 }}>
                                {lead.email_subject && <div style={{ fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Subject: {lead.email_subject}</div>}
                                <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: 12, color: '#5A6A7A', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{lead.email_body}</pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
