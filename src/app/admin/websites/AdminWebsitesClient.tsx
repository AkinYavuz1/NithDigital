'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Plus, X, Search, Code2, Rocket, Globe,
  ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Circle,
  AlertCircle, CloudUpload, Zap, User, FolderKanban,
  FileSignature, ClipboardList, Server, Eye, MessageSquare,
  Type, Sigma, Bot, RefreshCw,
} from 'lucide-react'
import { PIPELINE_STAGES, TOTAL_ESTIMATED_DAYS } from './pipelineStages'
import type { PipelineStage, ChecklistItem } from './pipelineStages'
import BuildSiteModal from './BuildSiteModal'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskItem extends ChecklistItem {
  done: boolean
}

interface StageLog {
  stage_index: number
  status: 'pending' | 'in_progress' | 'complete' | 'skipped'
  started_at: string | null
  completed_at: string | null
  checklist: TaskItem[]
  notes: string
}

interface Project {
  id: string
  client_name: string
  project_name: string
  project_type: 'brochure' | 'ecommerce' | 'webapp' | 'landing' | 'other'
  status: 'active' | 'on_hold' | 'complete' | 'cancelled'
  health: 'on_track' | 'at_risk' | 'blocked'
  current_stage: number
  contract_value: number | null
  kickoff_date: string | null
  target_launch: string | null
  launched_at: string | null
  staging_url: string | null
  live_url: string | null
  github_repo: string | null
  vercel_project: string | null
  figma_url: string | null
  notion_url: string | null
  stage_logs: StageLog[]
  notes: string | null
  created_at: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PROJECT_TYPE_LABELS: Record<string, string> = {
  brochure: 'Brochure Site',
  ecommerce: 'E-Commerce',
  webapp: 'Web App',
  landing: 'Landing Page',
  other: 'Other',
}

const HEALTH_CONFIG = {
  on_track: { color: '#22c55e', label: 'On Track', bg: 'rgba(34,197,94,0.1)' },
  at_risk: { color: '#f59e0b', label: 'At Risk', bg: 'rgba(245,158,11,0.1)' },
  blocked: { color: '#ef4444', label: 'Blocked', bg: 'rgba(239,68,68,0.1)' },
}

const STATUS_CONFIG = {
  active: { color: '#3b82f6', label: 'Active', bg: 'rgba(59,130,246,0.1)' },
  on_hold: { color: '#f59e0b', label: 'On Hold', bg: 'rgba(245,158,11,0.1)' },
  complete: { color: '#22c55e', label: 'Complete', bg: 'rgba(34,197,94,0.1)' },
  cancelled: { color: '#ef4444', label: 'Cancelled', bg: 'rgba(239,68,68,0.1)' },
}


function getStageIcon(iconName: string): React.ElementType {
  const map: Record<string, React.ElementType> = {
    Search, FileSignature, ClipboardList, Type,
    Server, Code2, Eye, MessageSquare, Rocket, CloudUpload, CheckCircle2,
  }
  return map[iconName] || Circle
}

function daysAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return '1d ago'
  return `${diff}d ago`
}

function daysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'today'
  return `${diff}d`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function buildDefaultStageLogs(): StageLog[] {
  return PIPELINE_STAGES.map(s => ({
    stage_index: s.index,
    status: 'pending' as const,
    started_at: null,
    completed_at: null,
    checklist: s.defaultChecklist.map(t => ({ ...t, done: false })),
    notes: '',
  }))
}

// ─── Mini Stepper ─────────────────────────────────────────────────────────────

function MiniStepper({ stageLogs, currentStage }: { stageLogs: StageLog[]; currentStage: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {PIPELINE_STAGES.map((s) => {
        const log = stageLogs.find(l => l.stage_index === s.index)
        const done = log?.status === 'complete' || log?.status === 'skipped'
        const active = s.index === currentStage
        return (
          <div
            key={s.index}
            title={s.label}
            style={{
              width: active ? 14 : 8,
              height: 8,
              borderRadius: 4,
              flexShrink: 0,
              background: done ? '#22c55e' : active ? '#D4A84B' : 'rgba(27,42,74,0.15)',
              transition: 'all 0.2s ease',
              boxShadow: active ? '0 0 0 2px rgba(212,168,75,0.3)' : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Stage Checklist ──────────────────────────────────────────────────────────

function StageChecklist({
  stage,
  log,
  onToggleTask,
  onUpdateNotes,
}: {
  stage: PipelineStage
  log: StageLog
  onToggleTask: (stageIndex: number, taskId: string) => void
  onUpdateNotes: (stageIndex: number, notes: string) => void
}) {
  const done = log.checklist.filter(t => t.done).length
  const total = log.checklist.length
  const autoCount = log.checklist.filter(t => t.automated).length

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>{done}/{total} tasks</span>
          {autoCount > 0 && (
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(212,168,75,0.12)', color: '#8B6D2B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Bot size={10} /> {autoCount} auto
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#5A6A7A' }}>~{stage.estimatedDays}d est.</div>
      </div>

      {log.checklist.map((task) => (
        <div
          key={task.id}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(27,42,74,0.05)' }}
        >
          <button
            onClick={() => onToggleTask(stage.index, task.id)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, color: task.done ? '#22c55e' : 'rgba(27,42,74,0.25)' }}
          >
            {task.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          </button>
          <span style={{ flex: 1, fontSize: 12, color: task.done ? '#5A6A7A' : '#1B2A4A', textDecoration: task.done ? 'line-through' : 'none' }}>
            {task.label}
          </span>
          {task.automated && (
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 100, background: 'rgba(212,168,75,0.1)', color: '#8B6D2B', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Zap size={8} /> Auto
            </span>
          )}
          {task.client_action && !task.automated && (
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 100, background: 'rgba(59,130,246,0.1)', color: '#2563eb', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
              <User size={8} /> Client
            </span>
          )}
        </div>
      ))}

      <textarea
        placeholder="Stage notes..."
        value={log.notes}
        onChange={e => onUpdateNotes(stage.index, e.target.value)}
        style={{
          width: '100%',
          marginTop: 10,
          padding: '8px 10px',
          border: '1px solid rgba(27,42,74,0.12)',
          borderRadius: 6,
          fontSize: 12,
          color: '#1B2A4A',
          fontFamily: 'inherit',
          resize: 'vertical',
          minHeight: 60,
          background: 'rgba(27,42,74,0.02)',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

// ─── Copy Generation Modal ────────────────────────────────────────────────────

interface GeneratedCopy {
  meta: { title: string; description: string; og_title: string; keywords: string[] }
  pages: {
    home: { hero_headline: string; hero_subheading: string; hero_cta: string; intro_paragraph: string; services_intro: string; trust_statement: string; cta_section_headline: string; cta_section_body: string; cta_button: string }
    about: { headline: string; story_paragraph: string; values_intro: string; values: string[]; team_intro: string }
    services: { headline: string; intro: string; service_items: { name: string; description: string; cta: string }[] }
    contact: { headline: string; intro: string; form_cta: string; phone_label: string; email_label: string }
  }
  schema: { type: string; name: string; description: string; address_locality: string; service_area: string }
  social: { tagline: string; twitter_bio: string; google_business_description: string }
}

function CopyGeneratorModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [form, setForm] = useState({
    industry: '',
    target_audience: '',
    tone: 'professional, friendly, trustworthy',
    key_services: '',
    location: '',
    usp: '',
    sitemap: 'Home, About, Services, Contact',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeneratedCopy | null>(null)
  const [rawResult, setRawResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>('meta')

  const generate = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/generate-website-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: project.project_name,
          client_name: project.client_name,
          project_type: project.project_type,
          industry: form.industry,
          target_audience: form.target_audience,
          tone: form.tone,
          key_services: form.key_services,
          location: form.location,
          usp: form.usp,
          sitemap: form.sitemap.split(',').map(s => s.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      if (data.parsed) setResult(data.parsed)
      setRawResult(data.raw || '')
    } catch (e) {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => {
    if (!result) return
    const text = JSON.stringify(result, null, 2)
    navigator.clipboard.writeText(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 1500)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', border: '1px solid rgba(27,42,74,0.15)',
    borderRadius: 6, fontSize: 12, fontFamily: 'inherit', color: '#1B2A4A',
    boxSizing: 'border-box', marginTop: 4, background: 'white',
  }
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => copyText(text, id)}
      title="Copy"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', color: copied === id ? '#22c55e' : '#5A6A7A', fontSize: 11, flexShrink: 0 }}
    >
      {copied === id ? '✓' : '⎘'}
    </button>
  )

  const Field = ({ label, value, id }: { label: string; value: string; id: string }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <CopyBtn text={value} id={id} />
      </div>
      <p style={{ fontSize: 13, color: '#1B2A4A', background: 'rgba(27,42,74,0.03)', borderRadius: 6, padding: '8px 10px', margin: 0, lineHeight: 1.5, border: '1px solid rgba(27,42,74,0.06)' }}>
        {value}
      </p>
    </div>
  )

  const SECTIONS = result ? [
    { key: 'meta', label: 'Meta & SEO' },
    { key: 'home', label: 'Home Page' },
    { key: 'about', label: 'About Page' },
    { key: 'services', label: 'Services' },
    { key: 'contact', label: 'Contact' },
    { key: 'schema', label: 'Schema' },
    { key: 'social', label: 'Social' },
  ] : []

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 780, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(27,42,74,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 10, color: '#D4A84B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>AI Generator</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: '#1B2A4A' }}>
              Generate Website Copy — {project.client_name}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6A7A' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>

          {/* Brief form — shown when no result yet */}
          {!result && (
            <div>
              <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 20 }}>
                Fill in what you know about the client. The more detail you give, the better the copy. Everything is optional — Claude will use {project.client_name} and {project.project_type} as the baseline.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Industry / Sector</label>
                  <input style={inputStyle} placeholder="e.g. Plumbing & Heating" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} placeholder="e.g. Edinburgh, Scotland" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Target Audience</label>
                  <input style={inputStyle} placeholder="e.g. Homeowners aged 30-60 needing emergency plumbing" value={form.target_audience} onChange={e => setForm(f => ({ ...f, target_audience: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Key Services / Products</label>
                  <input style={inputStyle} placeholder="e.g. Boiler installation, emergency callouts, bathroom fitting" value={form.key_services} onChange={e => setForm(f => ({ ...f, key_services: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Unique Selling Point</label>
                  <input style={inputStyle} placeholder="e.g. Family-run, 20 years experience, same-day response" value={form.usp} onChange={e => setForm(f => ({ ...f, usp: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Tone of Voice</label>
                  <input style={inputStyle} placeholder="e.g. professional, friendly, trustworthy" value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Pages (comma-separated)</label>
                  <input style={inputStyle} placeholder="Home, About, Services, Contact" value={form.sitemap} onChange={e => setForm(f => ({ ...f, sitemap: e.target.value }))} />
                </div>
              </div>

              {error && (
                <p style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, color: '#dc2626' }}>
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✍️</div>
              <p style={{ fontSize: 14, color: '#5A6A7A' }}>Claude is writing your website copy...</p>
              <p style={{ fontSize: 12, color: 'rgba(27,42,74,0.35)', marginTop: 4 }}>Usually takes 10–20 seconds</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>✓ Copy generated — review and copy each section below</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { setResult(null); setRawResult('') }}
                    style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', color: '#1B2A4A' }}
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={copyAll}
                    style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: '#D4A84B', border: 'none', cursor: 'pointer', color: '#1B2A4A' }}
                  >
                    {copied === 'all' ? '✓ Copied!' : 'Copy All JSON'}
                  </button>
                </div>
              </div>

              {/* Section tabs */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                {SECTIONS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSection(s.key)}
                    style={{
                      padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: activeSection === s.key ? 700 : 400,
                      background: activeSection === s.key ? '#1B2A4A' : 'transparent',
                      color: activeSection === s.key ? '#F5F0E6' : '#5A6A7A',
                      border: '1px solid', borderColor: activeSection === s.key ? '#1B2A4A' : 'rgba(27,42,74,0.15)',
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {activeSection === 'meta' && (
                <div>
                  <Field label="Page Title" value={result.meta.title} id="meta_title" />
                  <Field label="Meta Description" value={result.meta.description} id="meta_desc" />
                  <Field label="OG Title" value={result.meta.og_title} id="og_title" />
                  <div style={{ marginBottom: 10 }}>
                    <span style={labelStyle}>Keywords</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                      {result.meta.keywords.map((k, i) => (
                        <span key={i} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(27,42,74,0.06)', color: '#1B2A4A' }}>{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'home' && (
                <div>
                  <Field label="Hero Headline" value={result.pages.home.hero_headline} id="h_hero" />
                  <Field label="Hero Subheading" value={result.pages.home.hero_subheading} id="h_sub" />
                  <Field label="Hero CTA" value={result.pages.home.hero_cta} id="h_cta" />
                  <Field label="Intro Paragraph" value={result.pages.home.intro_paragraph} id="h_intro" />
                  <Field label="Services Intro" value={result.pages.home.services_intro} id="h_si" />
                  <Field label="Trust Statement" value={result.pages.home.trust_statement} id="h_trust" />
                  <Field label="Bottom CTA Headline" value={result.pages.home.cta_section_headline} id="h_ctah" />
                  <Field label="Bottom CTA Body" value={result.pages.home.cta_section_body} id="h_ctab" />
                  <Field label="CTA Button" value={result.pages.home.cta_button} id="h_ctabtn" />
                </div>
              )}

              {activeSection === 'about' && (
                <div>
                  <Field label="Headline" value={result.pages.about.headline} id="ab_h" />
                  <Field label="Brand Story" value={result.pages.about.story_paragraph} id="ab_story" />
                  <Field label="Values Intro" value={result.pages.about.values_intro} id="ab_vi" />
                  <div style={{ marginBottom: 10 }}>
                    <span style={labelStyle}>Values</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                      {result.pages.about.values.map((v, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(27,42,74,0.03)', borderRadius: 6, padding: '6px 10px', border: '1px solid rgba(27,42,74,0.06)' }}>
                          <span style={{ fontSize: 13, color: '#1B2A4A' }}>{v}</span>
                          <CopyBtn text={v} id={`val_${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Field label="Team Intro" value={result.pages.about.team_intro} id="ab_team" />
                </div>
              )}

              {activeSection === 'services' && (
                <div>
                  <Field label="Headline" value={result.pages.services.headline} id="sv_h" />
                  <Field label="Intro" value={result.pages.services.intro} id="sv_i" />
                  {result.pages.services.service_items.map((svc, i) => (
                    <div key={i} style={{ marginBottom: 12, padding: '12px 14px', background: 'rgba(27,42,74,0.02)', borderRadius: 8, border: '1px solid rgba(27,42,74,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>{svc.name}</span>
                        <CopyBtn text={`${svc.name}\n${svc.description}\nCTA: ${svc.cta}`} id={`svc_${i}`} />
                      </div>
                      <p style={{ fontSize: 12, color: '#5A6A7A', margin: 0, lineHeight: 1.5 }}>{svc.description}</p>
                      <span style={{ fontSize: 11, color: '#D4A84B', fontWeight: 600, marginTop: 4, display: 'block' }}>→ {svc.cta}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'contact' && (
                <div>
                  <Field label="Headline" value={result.pages.contact.headline} id="ct_h" />
                  <Field label="Intro" value={result.pages.contact.intro} id="ct_i" />
                  <Field label="Form CTA" value={result.pages.contact.form_cta} id="ct_cta" />
                  <Field label="Phone Label" value={result.pages.contact.phone_label} id="ct_ph" />
                  <Field label="Email Label" value={result.pages.contact.email_label} id="ct_em" />
                </div>
              )}

              {activeSection === 'schema' && (
                <div>
                  <Field label="Schema Type" value={result.schema.type} id="sc_type" />
                  <Field label="Description" value={result.schema.description} id="sc_desc" />
                  <Field label="Service Area" value={result.schema.service_area} id="sc_area" />
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={labelStyle}>JSON-LD Schema</span>
                      <CopyBtn text={JSON.stringify({ '@context': 'https://schema.org', '@type': result.schema.type, name: result.schema.name, description: result.schema.description, address: { '@type': 'PostalAddress', addressLocality: result.schema.address_locality }, areaServed: result.schema.service_area }, null, 2)} id="sc_json" />
                    </div>
                    <pre style={{ fontSize: 11, background: 'rgba(27,42,74,0.04)', borderRadius: 6, padding: '10px 12px', overflow: 'auto', margin: '4px 0 0', border: '1px solid rgba(27,42,74,0.08)', color: '#1B2A4A', lineHeight: 1.5 }}>
                      {JSON.stringify({ '@context': 'https://schema.org', '@type': result.schema.type, name: result.schema.name, description: result.schema.description, address: { '@type': 'PostalAddress', addressLocality: result.schema.address_locality }, areaServed: result.schema.service_area }, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {activeSection === 'social' && (
                <div>
                  <Field label="Brand Tagline" value={result.social.tagline} id="so_tag" />
                  <Field label="Twitter / X Bio" value={result.social.twitter_bio} id="so_tw" />
                  <Field label="Google Business Description" value={result.social.google_business_description} id="so_gb" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(27,42,74,0.08)', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', color: '#1B2A4A' }}>
              Cancel
            </button>
            <button
              onClick={generate}
              disabled={loading}
              style={{ padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 600, background: '#D4A84B', color: '#1B2A4A', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Bot size={14} /> {loading ? 'Generating...' : 'Generate Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Project Detail Sheet ─────────────────────────────────────────────────────

function ProjectDetailSheet({
  project,
  onClose,
  onToggleTask,
  onUpdateNotes,
  onSave,
}: {
  project: Project
  onClose: () => void
  onToggleTask: (projectId: string, stageIndex: number, taskId: string) => void
  onUpdateNotes: (projectId: string, stageIndex: number, notes: string) => void
  onSave: (project: Project) => void
}) {
  const [tab, setTab] = useState<'pipeline' | 'links' | 'notes'>('pipeline')
  const [expandedStage, setExpandedStage] = useState<number>(project.current_stage)
  const [editingLinks, setEditingLinks] = useState(false)
  const [showCopyGenerator, setShowCopyGenerator] = useState(false)
  const [showBuildModal, setShowBuildModal] = useState(false)
  const [links, setLinks] = useState({
    staging_url: project.staging_url || '',
    live_url: project.live_url || '',
    github_repo: project.github_repo || '',
    figma_url: project.figma_url || '',
    vercel_project: project.vercel_project || '',
    notion_url: project.notion_url || '',
  })
  const [projectNotes, setProjectNotes] = useState(project.notes || '')

  const completedStages = project.stage_logs.filter(l => l.status === 'complete').length
  const totalStages = PIPELINE_STAGES.length
  const pct = Math.round((completedStages / totalStages) * 100)

  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480, background: 'white',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.12)',
        zIndex: 200, display: 'flex', flexDirection: 'column',
        transform: 'translateX(0)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(27,42,74,0.08)', background: '#1B2A4A', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 10, color: '#D4A84B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
              {PROJECT_TYPE_LABELS[project.project_type] || 'Website'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#F5F0E6', fontWeight: 400, margin: 0 }}>
              {project.project_name}
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)', marginTop: 2 }}>{project.client_name}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setShowBuildModal(true)}
              style={{ padding: '7px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: '#D4A84B', color: '#1B2A4A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Rocket size={12} /> Build Site
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(245,240,230,0.4)', cursor: 'pointer', padding: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)' }}>{completedStages}/{totalStages} stages</span>
            <span style={{ fontSize: 11, color: '#D4A84B', fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(245,240,230,0.1)', borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#D4A84B', borderRadius: 4, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {project.target_launch && (
            <span style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)' }}>
              🎯 Launch: {formatDate(project.target_launch)} ({daysUntil(project.target_launch)})
            </span>
          )}
          {project.contract_value && (
            <span style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)' }}>
              £{project.contract_value.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(27,42,74,0.08)', flexShrink: 0 }}>
        {(['pipeline', 'links', 'notes'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px 0', fontSize: 12, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#1B2A4A' : '#5A6A7A',
              borderBottom: tab === t ? '2px solid #D4A84B' : '2px solid transparent',
              background: 'none', border: 'none', cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>

        {/* Pipeline Tab */}
        {tab === 'pipeline' && (
          <div>
            {PIPELINE_STAGES.map((stage) => {
              const log = project.stage_logs.find(l => l.stage_index === stage.index) || {
                stage_index: stage.index, status: 'pending' as const, started_at: null,
                completed_at: null, checklist: stage.defaultChecklist.map(t => ({ ...t, done: false })), notes: '',
              }
              const isActive = stage.index === project.current_stage
              const isDone = log.status === 'complete'
              const isExpanded = expandedStage === stage.index
              const doneTasks = log.checklist.filter(t => t.done).length
              const totalTasks = log.checklist.length
              const StageIcon = getStageIcon(stage.icon)

              return (
                <div
                  key={stage.index}
                  style={{
                    marginBottom: 4,
                    borderRadius: 8,
                    border: isActive ? `1.5px solid ${stage.color}` : '1px solid rgba(27,42,74,0.08)',
                    overflow: 'hidden',
                    background: isActive ? `${stage.color}08` : 'white',
                  }}
                >
                  <button
                    onClick={() => setExpandedStage(isExpanded ? 0 : stage.index)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: isDone ? 'rgba(34,197,94,0.1)' : isActive ? `${stage.color}18` : 'rgba(27,42,74,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isDone ? '#22c55e' : isActive ? stage.color : 'rgba(27,42,74,0.3)',
                    }}>
                      {isDone ? <CheckCircle2 size={14} /> : <StageIcon size={14} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isDone ? '#5A6A7A' : '#1B2A4A' }}>
                          {stage.label}
                        </span>
                        {isActive && (
                          <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 100, background: stage.color, color: 'white', fontWeight: 700, textTransform: 'uppercase' }}>
                            Active
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 1 }}>
                        {isDone && log.completed_at ? `Completed ${daysAgo(log.completed_at)}` : `${doneTasks}/${totalTasks} tasks`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Mini progress */}
                      <div style={{ width: 40, height: 4, background: 'rgba(27,42,74,0.1)', borderRadius: 4 }}>
                        <div style={{ height: '100%', width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%`, background: isDone ? '#22c55e' : stage.color, borderRadius: 4 }} />
                      </div>
                      {isExpanded ? <ChevronUp size={14} color="#5A6A7A" /> : <ChevronDown size={14} color="#5A6A7A" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 14px 14px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
                      <StageChecklist
                        stage={stage}
                        log={log}
                        onToggleTask={(si, tid) => onToggleTask(project.id, si, tid)}
                        onUpdateNotes={(si, n) => onUpdateNotes(project.id, si, n)}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Links Tab */}
        {tab === 'links' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#5A6A7A' }}>Project integrations & links</p>
              <button
                onClick={() => {
                  if (editingLinks) {
                    onSave({ ...project, ...links, notes: projectNotes })
                  }
                  setEditingLinks(!editingLinks)
                }}
                style={{
                  padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: editingLinks ? '#D4A84B' : '#F5F0E6',
                  color: editingLinks ? '#1B2A4A' : '#1B2A4A',
                  border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer',
                }}
              >
                {editingLinks ? 'Save' : 'Edit'}
              </button>
            </div>

            {[
              { key: 'live_url', icon: Globe, label: 'Live URL', placeholder: 'https://client.co.uk' },
              { key: 'staging_url', icon: Sigma, label: 'Staging URL', placeholder: 'https://project.vercel.app' },
              { key: 'github_repo', icon: Code2, label: 'GitHub Repo', placeholder: 'https://github.com/...' },
              { key: 'figma_url', icon: Eye, label: 'Figma', placeholder: 'https://figma.com/...' },
              { key: 'vercel_project', icon: CloudUpload, label: 'Vercel Project', placeholder: 'project-name' },
              { key: 'notion_url', icon: FileSignature, label: 'Notion / Brief', placeholder: 'https://notion.so/...' },
            ].map(({ key, icon: Icon, label, placeholder }) => {
              const val = links[key as keyof typeof links]
              return (
                <div key={key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Icon size={12} color="#5A6A7A" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                  </div>
                  {editingLinks ? (
                    <input
                      type="text"
                      value={val}
                      onChange={e => setLinks(l => ({ ...l, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: '100%', padding: '8px 12px', border: '1px solid rgba(27,42,74,0.15)',
                        borderRadius: 6, fontSize: 12, fontFamily: 'inherit', color: '#1B2A4A',
                        boxSizing: 'border-box',
                      }}
                    />
                  ) : val ? (
                    <a
                      href={val.startsWith('http') ? val : `https://${val}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {val} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span style={{ fontSize: 12, color: 'rgba(27,42,74,0.25)' }}>Not set</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Notes Tab */}
        {tab === 'notes' && (
          <div>
            <p style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 10 }}>Internal project notes</p>
            <textarea
              value={projectNotes}
              onChange={e => setProjectNotes(e.target.value)}
              onBlur={() => onSave({ ...project, notes: projectNotes })}
              placeholder="Add notes, decisions, blockers, client feedback..."
              style={{
                width: '100%', minHeight: 300, padding: '12px', border: '1px solid rgba(27,42,74,0.12)',
                borderRadius: 8, fontSize: 13, fontFamily: 'inherit', color: '#1B2A4A',
                lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box', background: 'rgba(27,42,74,0.01)',
              }}
            />
          </div>
        )}
      </div>

      {/* Automation Panel */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(27,42,74,0.08)', background: '#fafaf9', flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#D4A84B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>AI Automation</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <button
            onClick={() => setShowCopyGenerator(true)}
            style={{
              padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
              background: '#D4A84B', color: '#1B2A4A',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            ✍️ Generate copy
          </button>
          {[
            { label: 'Run SEO audit', icon: '🔍', tip: 'Coming soon' },
            { label: 'Gen OG images', icon: '🖼️', tip: 'Coming soon' },
            { label: 'Write schema', icon: '📋', tip: 'Coming soon' },
            { label: 'Draft handover', icon: '📄', tip: 'Coming soon' },
          ].map(({ label, icon, tip }) => (
            <button
              key={label}
              title={tip}
              style={{
                padding: '5px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                background: 'rgba(212,168,75,0.1)', color: '#8B6D2B',
                border: '1px solid rgba(212,168,75,0.2)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                opacity: 0.6,
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {showCopyGenerator && (
        <CopyGeneratorModal project={project} onClose={() => setShowCopyGenerator(false)} />
      )}

      {showBuildModal && (
        <BuildSiteModal
          project={project}
          onClose={() => setShowBuildModal(false)}
          onProjectUpdated={(updates) => onSave({ ...project, ...updates })}
        />
      )}
    </div>
  )
}

// ─── New Project Modal ────────────────────────────────────────────────────────

function NewProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: Project) => void }) {
  const [form, setForm] = useState({
    client_name: '', project_name: '', project_type: 'brochure',
    contract_value: '', target_launch: '', kickoff_date: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const stageLogs = buildDefaultStageLogs()
    const { data, error } = await supabase
      .from('client_projects')
      .insert({
        client_name: form.client_name,
        project_name: form.project_name,
        project_type: form.project_type,
        contract_value: form.contract_value ? parseFloat(form.contract_value) : null,
        target_launch: form.target_launch || null,
        kickoff_date: form.kickoff_date || null,
        current_stage: 1,
        status: 'active',
        health: 'on_track',
        stage_logs: stageLogs,
      })
      .select()
      .single()

    setSaving(false)
    if (!error && data) {
      onCreated(data as Project)
      onClose()
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)',
    borderRadius: 8, fontSize: 13, fontFamily: 'inherit', color: '#1B2A4A',
    boxSizing: 'border-box', marginTop: 4,
  }
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 32, width: 520, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 10, color: '#D4A84B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Admin</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400 }}>New Website Project</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6A7A' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Client Name *</label>
              <input required style={inputStyle} placeholder="e.g. Glenavon Farm" value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Project Name *</label>
              <input required style={inputStyle} placeholder="e.g. Glenavon Farm Website Redesign" value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Project Type</label>
              <select style={inputStyle} value={form.project_type} onChange={e => setForm(f => ({ ...f, project_type: e.target.value }))}>
                {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Contract Value (£)</label>
              <input type="number" style={inputStyle} placeholder="e.g. 2400" value={form.contract_value} onChange={e => setForm(f => ({ ...f, contract_value: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Kickoff Date</label>
              <input type="date" style={inputStyle} value={form.kickoff_date} onChange={e => setForm(f => ({ ...f, kickoff_date: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Target Launch</label>
              <input type="date" style={inputStyle} value={form.target_launch} onChange={e => setForm(f => ({ ...f, target_launch: e.target.value }))} />
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', color: '#1B2A4A' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 600, background: '#D4A84B', color: '#1B2A4A', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminWebsitesClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'on_hold' | 'complete' | 'cancelled'>('all')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const supabase = createClient()

  const loadProjects = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('client_projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProjects(data as Project[])
    setLoading(false)
  }, [])

  useEffect(() => { loadProjects() }, [loadProjects])

  const saveProject = useCallback(async (updated: Project) => {
    setProjects(ps => ps.map(p => p.id === updated.id ? updated : p))
    if (selectedProject?.id === updated.id) setSelectedProject(updated)
    await supabase.from('client_projects').update({
      stage_logs: updated.stage_logs,
      notes: updated.notes,
      staging_url: updated.staging_url,
      live_url: updated.live_url,
      github_repo: updated.github_repo,
      figma_url: updated.figma_url,
      vercel_project: updated.vercel_project,
      notion_url: updated.notion_url,
      current_stage: updated.current_stage,
      health: updated.health,
      status: updated.status,
    }).eq('id', updated.id)
  }, [selectedProject])

  const handleToggleTask = useCallback((projectId: string, stageIndex: number, taskId: string) => {
    setProjects(ps => ps.map(p => {
      if (p.id !== projectId) return p
      const newLogs = p.stage_logs.map(log => {
        if (log.stage_index !== stageIndex) return log
        const newChecklist = log.checklist.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        const allDone = newChecklist.every(t => t.done)
        return { ...log, checklist: newChecklist, status: allDone ? 'complete' as const : 'in_progress' as const }
      })
      // Auto-advance current stage
      const currentLog = newLogs.find(l => l.stage_index === p.current_stage)
      let newCurrentStage = p.current_stage
      if (currentLog?.status === 'complete') {
        const nextStage = PIPELINE_STAGES.find(s => s.index > p.current_stage)
        if (nextStage) newCurrentStage = nextStage.index
      }
      const updated = { ...p, stage_logs: newLogs, current_stage: newCurrentStage }
      saveProject(updated)
      return updated
    }))
    if (selectedProject?.id === projectId) {
      setSelectedProject(p => {
        if (!p) return p
        const newLogs = p.stage_logs.map(log => {
          if (log.stage_index !== stageIndex) return log
          const newChecklist = log.checklist.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
          const allDone = newChecklist.every(t => t.done)
          return { ...log, checklist: newChecklist, status: allDone ? 'complete' as const : 'in_progress' as const }
        })
        return { ...p, stage_logs: newLogs }
      })
    }
  }, [selectedProject, saveProject])

  const handleUpdateNotes = useCallback((projectId: string, stageIndex: number, notes: string) => {
    setProjects(ps => ps.map(p => {
      if (p.id !== projectId) return p
      const newLogs = p.stage_logs.map(log => log.stage_index === stageIndex ? { ...log, notes } : log)
      return { ...p, stage_logs: newLogs }
    }))
    if (selectedProject?.id === projectId) {
      setSelectedProject(p => p ? { ...p, stage_logs: p.stage_logs.map(l => l.stage_index === stageIndex ? { ...l, notes } : l) } : p)
    }
  }, [selectedProject])

  const filtered = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => stageFilter === 'all' || PIPELINE_STAGES.find(s => s.index === p.current_stage)?.key === stageFilter)
    .filter(p => !search || p.project_name.toLowerCase().includes(search.toLowerCase()) || p.client_name.toLowerCase().includes(search.toLowerCase()))

  // Stats
  const active = projects.filter(p => p.status === 'active').length
  const complete = projects.filter(p => p.status === 'complete').length
  const totalValue = projects.filter(p => p.status !== 'cancelled').reduce((s, p) => s + (p.contract_value || 0), 0)

  return (
    <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#1B2A4A' }}>Website Projects</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginTop: 4 }}>
            {active} active · {complete} complete · £{totalValue.toLocaleString()} total value
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={loadProjects}
            style={{ padding: '10px', borderRadius: 100, background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', color: '#1B2A4A', display: 'flex', alignItems: 'center' }}
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            style={{ padding: '10px 20px', borderRadius: 100, background: '#D4A84B', color: '#1B2A4A', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={15} /> New Project
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Active Projects', value: active, color: '#3b82f6' },
          { label: 'Completed', value: complete, color: '#22c55e' },
          { label: 'Total Value', value: `£${totalValue.toLocaleString()}`, color: '#D4A84B' },
          { label: 'Avg. Timeline', value: `${TOTAL_ESTIMATED_DAYS}d`, color: '#8b5cf6' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '16px 20px', borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginRight: 8 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A' }} />
          <input
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px 8px 32px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 12, fontFamily: 'inherit', color: '#1B2A4A', width: 200 }}
          />
        </div>
        {(['all', 'active', 'on_hold', 'complete', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 12,
              fontWeight: filter === f ? 600 : 400,
              background: filter === f ? '#1B2A4A' : 'transparent',
              color: filter === f ? '#F5F0E6' : '#5A6A7A',
              border: '1px solid', borderColor: filter === f ? '#1B2A4A' : 'rgba(27,42,74,0.15)',
              cursor: 'pointer',
            }}
          >
            {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Stage filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setStageFilter('all')}
          style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: stageFilter === 'all' ? 600 : 400, background: stageFilter === 'all' ? '#D4A84B' : 'transparent', color: stageFilter === 'all' ? '#1B2A4A' : '#5A6A7A', border: '1px solid', borderColor: stageFilter === 'all' ? '#D4A84B' : 'rgba(27,42,74,0.1)', cursor: 'pointer' }}
        >
          All Stages
        </button>
        {PIPELINE_STAGES.map(s => (
          <button
            key={s.key}
            onClick={() => setStageFilter(s.key)}
            style={{
              padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: stageFilter === s.key ? 600 : 400,
              background: stageFilter === s.key ? `${s.color}18` : 'transparent',
              color: stageFilter === s.key ? s.color : '#5A6A7A',
              border: '1px solid', borderColor: stageFilter === s.key ? `${s.color}40` : 'rgba(27,42,74,0.1)',
              cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Project list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#5A6A7A', fontSize: 14 }}>Loading projects...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <FolderKanban size={40} color="rgba(27,42,74,0.15)" style={{ marginBottom: 16 }} />
          <p style={{ color: '#5A6A7A', fontSize: 14 }}>No projects found.</p>
          {projects.length === 0 && (
            <button
              onClick={() => setShowNewModal(true)}
              style={{ marginTop: 12, padding: '10px 24px', borderRadius: 100, background: '#D4A84B', color: '#1B2A4A', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 120px 180px 80px 100px 80px',
            gap: 12, padding: '8px 16px',
            fontSize: 10, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            <span>Project</span>
            <span>Type</span>
            <span>Stage</span>
            <span>Progress</span>
            <span>Health</span>
            <span>Launch</span>
            <span>Value</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filtered.map(project => {
              const currentStage = PIPELINE_STAGES.find(s => s.index === project.current_stage)
              const health = HEALTH_CONFIG[project.health]
              const log = project.stage_logs.find(l => l.stage_index === project.current_stage)
              const daysInStage = log?.started_at ? Math.floor((Date.now() - new Date(log.started_at).getTime()) / 86400000) : null
              const isOverdue = daysInStage !== null && currentStage && daysInStage > currentStage.estimatedDays * 1.5

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 120px 180px 80px 100px 80px',
                    gap: 12, padding: '14px 16px',
                    background: 'white', border: '1px solid rgba(27,42,74,0.08)',
                    borderRadius: 10, alignItems: 'center', cursor: 'pointer',
                    transition: 'box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,42,74,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  {/* Project name */}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1B2A4A' }}>{project.project_name}</div>
                    <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 1 }}>{project.client_name}</div>
                  </div>

                  {/* Type */}
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: 'rgba(27,42,74,0.06)', color: '#5A6A7A', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
                  </span>

                  {/* Stage */}
                  <div>
                    {currentStage && (
                      <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 100, fontWeight: 600, whiteSpace: 'nowrap',
                        background: `${currentStage.color}15`, color: currentStage.color,
                      }}>
                        {currentStage.label}
                      </span>
                    )}
                    {daysInStage !== null && (
                      <div style={{ fontSize: 10, color: isOverdue ? '#ef4444' : '#5A6A7A', marginTop: 3 }}>
                        {isOverdue && <AlertCircle size={9} style={{ display: 'inline', marginRight: 2 }} />}
                        {daysInStage}d in stage
                      </div>
                    )}
                  </div>

                  {/* Mini stepper */}
                  <MiniStepper stageLogs={project.stage_logs} currentStage={project.current_stage} />

                  {/* Health */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: health.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: health.color, fontWeight: 600 }}>{health.label}</span>
                  </div>

                  {/* Launch date */}
                  <div style={{ fontSize: 12, color: '#5A6A7A' }}>
                    {project.launched_at ? (
                      <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 11 }}>Live ✓</span>
                    ) : project.target_launch ? (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500 }}>{formatDate(project.target_launch)}</div>
                        <div style={{ fontSize: 10, color: '#5A6A7A' }}>{daysUntil(project.target_launch)}</div>
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(27,42,74,0.25)' }}>—</span>
                    )}
                  </div>

                  {/* Value */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>
                    {project.contract_value ? `£${project.contract_value.toLocaleString()}` : <span style={{ color: 'rgba(27,42,74,0.25)', fontWeight: 400 }}>—</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Automation Guide */}
      <div style={{ marginTop: 40, background: 'white', borderRadius: 12, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(27,42,74,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot size={16} color="#D4A84B" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: '#1B2A4A' }}>Automation Guide</h3>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(212,168,75,0.1)', color: '#8B6D2B', fontWeight: 600, marginLeft: 4 }}>
            {PIPELINE_STAGES.flatMap(s => s.defaultChecklist).filter(t => t.automated).length} auto tasks across {PIPELINE_STAGES.length} stages
          </span>
        </div>
        <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[
            { icon: '🤖', title: 'Claude API — Content & SEO', desc: 'Auto-generate all page copy, meta tags, JSON-LD schema, alt text from a client brief. Saves 4–6h per site.', badge: 'claude_api' },
            { icon: '⚡', title: 'v0.dev — UI Generation', desc: 'Generate polished React/Tailwind components from prompts or screenshots. Saves 1–3h per component.', badge: 'v0_generation' },
            { icon: '🚀', title: 'Vercel — Auto Deploy', desc: 'Every push creates a preview URL. Prod deploys on merge to main. SSL auto-provisioned.', badge: 'vercel_auto' },
            { icon: '📊', title: 'Lighthouse CI — Performance', desc: 'Automated performance, accessibility and SEO audits on every PR via GitHub Actions.', badge: 'lighthouse_ci' },
            { icon: '🖼️', title: 'next/og — OG Images', desc: 'Server-side open graph image generation from JSX. No external image service needed.', badge: 'next_og' },
            { icon: '🗺️', title: 'next/sitemap — SEO', desc: 'Dynamic sitemap.xml and robots.txt auto-generated from your routes and CMS content.', badge: 'next_sitemap' },
          ].map(({ icon, title, desc, badge }) => (
            <div key={badge} style={{ padding: '14px 16px', background: '#fafaf9', borderRadius: 8, border: '1px solid rgba(27,42,74,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>{title}</span>
              </div>
              <p style={{ fontSize: 11, color: '#5A6A7A', lineHeight: 1.5, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail sheet backdrop */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 199 }}
        />
      )}

      {/* Detail sheet */}
      {selectedProject && (
        <ProjectDetailSheet
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onToggleTask={handleToggleTask}
          onUpdateNotes={handleUpdateNotes}
          onSave={saveProject}
        />
      )}

      {/* New project modal */}
      {showNewModal && (
        <NewProjectModal
          onClose={() => setShowNewModal(false)}
          onCreated={p => setProjects(ps => [p, ...ps])}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-main { padding-top: 52px; }
        }
      `}</style>
    </div>
  )
}
