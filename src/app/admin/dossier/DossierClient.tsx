'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus, ArrowLeft, Download, Trash2, Copy, Send, Eye, Edit,
  ChevronRight, ChevronLeft, Search, Loader2, ExternalLink,
  Check, X, AlertTriangle, Globe, Star, Share2, MessageSquare,
  Maximize2, Minimize2, Printer,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { generateRecommendation, type SectorEngineInput, type SectorRecommendation, type ServiceRecommendation, type ROIProjection, type IndustryStat } from './sectorEngine'
import { generateDossierPDF } from './dossierPdf'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Dossier {
  id: string
  business_name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  sector: string
  url: string | null
  location: string | null
  prospect_id: string | null
  audit_id: string | null
  audit_snapshot: AuditSnapshot | null
  visibility_score: number | null
  visibility_answers: Record<string, boolean> | null
  local_seo_score: number | null
  local_seo_answers: Record<string, string> | null
  social_profiles: SocialProfiles | null
  google_review_count: number | null
  google_rating: number | null
  review_response_rate: number | null
  competitor_urls: string[]
  competitor_audits: AuditSnapshot[] | null
  recommended_services: string[]
  service_descriptions: Record<string, ServiceRecommendation> | null
  roi_projection: ROIProjection | null
  custom_stats: IndustryStat[] | null
  estimated_price_low: number | null
  estimated_price_high: number | null
  monthly_cost: number | null
  pricing_model: string
  personal_note: string | null
  status: string
  public_token: string
  sent_at: string | null
  viewed_at: string | null
  created_at: string
  updated_at: string
}

interface AuditSnapshot {
  url: string
  scores: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number }
  technology?: { platform?: string; framework?: string; cms?: string }
  checks?: AuditCheck[]
  grade?: string
}

interface AuditCheck {
  category: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail?: string
}

interface SocialProfiles {
  facebook?: string | null
  instagram?: string | null
  twitter?: string | null
  linkedin?: string | null
  active?: boolean
  last_post?: string | null
}

interface Prospect {
  id: string
  business_name: string
  url: string | null
  location: string
  sector: string
  score_overall: number
  has_website: boolean
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  google_review_count: number | null
  social_presence: string | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAVY = '#1B2A4A'
const GOLD = '#D4A84B'
const CREAM = '#F5F0E6'
const GRAY = '#5A6A7A'

const SECTORS = [
  'Trades & Construction', 'Home Services', 'Food & Drink', 'Accommodation & Tourism',
  'Automotive', 'Retail', 'Beauty & Hair', 'Healthcare', 'Fitness & Leisure',
  'Professional Services', 'Property', 'Childcare & Education', 'Wedding & Events',
]

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: 'rgba(107,114,128,0.12)', color: '#6B7280' },
  ready: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  sent: { bg: 'rgba(212,168,75,0.12)', color: '#D4A84B' },
  viewed: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  converted: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' },
  archived: { bg: 'rgba(107,114,128,0.08)', color: '#9CA3AF' },
}

const VISIBILITY_ITEMS = [
  { id: 'has-website', label: 'Has a website', weight: 10 },
  { id: 'first-page', label: 'Appears on first page of Google for main service', weight: 12 },
  { id: 'has-gbp', label: 'Has a Google Business Profile', weight: 12 },
  { id: 'gbp-accurate', label: 'GBP has correct phone, address, hours', weight: 6 },
  { id: 'reviews-5', label: 'At least 5 Google reviews', weight: 7 },
  { id: 'reviews-10', label: 'At least 10 Google reviews', weight: 5 },
  { id: 'rating-4', label: 'Average Google rating 4+ stars', weight: 6 },
  { id: 'gbp-post', label: 'Posted a GBP update in the last month', weight: 5 },
  { id: 'maps-search', label: 'Appears in Google Maps for service searches', weight: 12 },
  { id: 'local-keywords', label: 'Website mentions local towns/areas served', weight: 8 },
  { id: 'gbp-photos', label: 'Has photos on Google Business Profile', weight: 7 },
  { id: 'fresh-website', label: 'Website updated in the last 6 months', weight: 10 },
]
const VISIBILITY_TOTAL = VISIBILITY_ITEMS.reduce((s, i) => s + i.weight, 0)

const SEO_QUESTIONS = [
  { id: 'mobile', text: 'Website works well on mobile', impact: 'high' as const },
  { id: 'speed', text: 'Website loads quickly (under 3 seconds)', impact: 'high' as const },
  { id: 'https', text: 'Website uses HTTPS (secure)', impact: 'high' as const },
  { id: 'contact', text: 'Has a contact form or clear contact info', impact: 'high' as const },
  { id: 'fresh', text: 'Content updated in the last 6 months', impact: 'medium' as const },
  { id: 'ranking', text: 'Ranks on first page for main keywords', impact: 'high' as const },
  { id: 'gbp', text: 'Has an active Google Business Profile', impact: 'high' as const },
  { id: 'cta', text: 'Has clear calls to action', impact: 'medium' as const },
  { id: 'reviews', text: 'Has Google reviews (5+)', impact: 'medium' as const },
  { id: 'services', text: 'Has dedicated pages for each service', impact: 'medium' as const },
]

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 6,
  border: '1px solid rgba(27,42,74,0.2)', fontSize: 13, color: NAVY,
  background: '#fff', outline: 'none', boxSizing: 'border-box',
}
const sectionStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 10, padding: 20,
  border: '1px solid rgba(27,42,74,0.08)', marginBottom: 16,
}
const sectionTitle: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12,
}
const btnGold: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', background: GOLD, color: NAVY,
  borderRadius: 6, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
}
const btnNavy: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', background: NAVY, color: CREAM,
  borderRadius: 6, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
}
const iconBtn: React.CSSProperties = {
  background: 'rgba(27,42,74,0.06)', border: 'none', borderRadius: 6,
  padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: GRAY,
}
const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 4, display: 'block',
}

function scoreBg(score: number) {
  if (score >= 70) return { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' }
  if (score >= 40) return { bg: 'rgba(217,119,6,0.1)', color: '#D97706' }
  return { bg: 'rgba(220,38,38,0.1)', color: '#DC2626' }
}

function gradeFor(score: number) {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 45) return 'D'
  return 'F'
}

function fmt(n: number) { return '£' + n.toLocaleString('en-GB') }

// ─── Form state ───────────────────────────────────────────────────────────────

interface DossierForm {
  business_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  sector: string
  url: string
  location: string
  prospect_id: string
  audit_snapshot: AuditSnapshot | null
  visibility_answers: Record<string, boolean>
  local_seo_answers: Record<string, string>
  social_profiles: SocialProfiles
  google_review_count: string
  google_rating: string
  review_response_rate: string
  competitor_urls: string[]
  competitor_audits: AuditSnapshot[]
  recommended_services: string[]
  service_descriptions: Record<string, ServiceRecommendation>
  roi_projection: ROIProjection | null
  custom_stats: IndustryStat[]
  estimated_price_low: string
  estimated_price_high: string
  monthly_cost: string
  personal_note: string
}

const EMPTY_FORM: DossierForm = {
  business_name: '', contact_name: '', contact_email: '', contact_phone: '',
  sector: '', url: '', location: '', prospect_id: '',
  audit_snapshot: null,
  visibility_answers: {},
  local_seo_answers: {},
  social_profiles: {},
  google_review_count: '', google_rating: '', review_response_rate: '',
  competitor_urls: ['', '', ''],
  competitor_audits: [],
  recommended_services: [],
  service_descriptions: {},
  roi_projection: null,
  custom_stats: [],
  estimated_price_low: '', estimated_price_high: '', monthly_cost: '',
  personal_note: '',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DossierClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<'list' | 'editor' | 'presentation'>('list')
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Dossier | null>(null)
  const [form, setForm] = useState<DossierForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [prospectSearch, setProspectSearch] = useState('')
  const [showProspectDropdown, setShowProspectDropdown] = useState(false)
  const [auditRunning, setAuditRunning] = useState(false)
  const [competitorAuditRunning, setCompetitorAuditRunning] = useState<number | null>(null)
  const [recommendation, setRecommendation] = useState<SectorRecommendation | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const set = useCallback(<K extends keyof DossierForm>(field: K, value: DossierForm[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // ─── Data fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient()
    supabase.from('dossiers').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setDossiers(data); setLoading(false) })
  }, [])

  // Check for prefill from URL params
  useEffect(() => {
    const prospectId = searchParams.get('prospect_id')
    const auditId = searchParams.get('audit_id')
    if (prospectId || auditId) {
      const supabase = createClient()
      if (prospectId) {
        supabase.from('prospects').select('*').eq('id', prospectId).single()
          .then(({ data }) => { if (data) prefillFromProspect(data) })
      }
      if (auditId) {
        supabase.from('site_audits').select('*').eq('id', auditId).single()
          .then(({ data }) => {
            if (data) {
              const snapshot: AuditSnapshot = {
                url: data.url,
                scores: {
                  seo: data.seo_score, security: data.security_score,
                  performance: data.performance_score, mobile: data.mobile_score,
                  content: data.content_score, overall: data.overall_score,
                },
                technology: data.audit_result?.technology,
                checks: extractChecks(data.audit_result),
                grade: gradeFor(data.overall_score),
              }
              setForm(prev => ({ ...prev, audit_snapshot: snapshot, url: data.url, business_name: prev.business_name || data.business_name || '' }))
            }
          })
      }
      setView('editor')
    }
  }, [searchParams])

  const prefillFromProspect = (p: Prospect) => {
    setForm(prev => ({
      ...prev,
      business_name: p.business_name,
      contact_name: p.contact_name || '',
      contact_email: p.contact_email || '',
      contact_phone: p.contact_phone || '',
      sector: p.sector || '',
      url: p.url || '',
      location: p.location || '',
      prospect_id: p.id,
      google_review_count: p.google_review_count?.toString() || '',
    }))
    setShowProspectDropdown(false)
    setProspectSearch('')
  }

  // ─── Audit runner ──────────────────────────────────────────────────────────

  const runAudit = async (url: string, isCompetitor?: number) => {
    if (!url) return
    if (isCompetitor != null) setCompetitorAuditRunning(isCompetitor)
    else setAuditRunning(true)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error('Audit failed')
      const result = await res.json()

      const snapshot: AuditSnapshot = {
        url,
        scores: {
          seo: result.scores?.seo ?? 0,
          security: result.scores?.security ?? 0,
          performance: result.scores?.performance ?? 0,
          mobile: result.scores?.mobile ?? 0,
          content: result.scores?.content ?? 0,
          overall: result.scores?.overall ?? 0,
        },
        technology: result.technology,
        checks: extractChecks(result),
        grade: gradeFor(result.scores?.overall ?? 0),
      }

      if (isCompetitor != null) {
        setForm(prev => {
          const audits = [...prev.competitor_audits]
          audits[isCompetitor] = snapshot
          return { ...prev, competitor_audits: audits }
        })
      } else {
        setForm(prev => ({ ...prev, audit_snapshot: snapshot }))
      }
      showToast('Audit complete')
    } catch {
      showToast('Audit failed — check the URL')
    } finally {
      if (isCompetitor != null) setCompetitorAuditRunning(null)
      else setAuditRunning(false)
    }
  }

  function extractChecks(result: Record<string, unknown>): AuditCheck[] {
    if (!result) return []
    const checks: AuditCheck[] = []
    const categories = ['seo', 'security', 'performance', 'mobile', 'content'] as const
    for (const cat of categories) {
      const section = result[cat] as Record<string, unknown> | undefined
      if (!section) continue
      for (const [key, val] of Object.entries(section)) {
        if (typeof val === 'boolean') {
          checks.push({ category: cat, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), status: val ? 'pass' : 'fail' })
        } else if (typeof val === 'object' && val && 'pass' in (val as Record<string, unknown>)) {
          const v = val as { pass: boolean; detail?: string }
          checks.push({ category: cat, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), status: v.pass ? 'pass' : 'fail', detail: v.detail })
        }
      }
    }
    return checks
  }

  // ─── Sector engine ─────────────────────────────────────────────────────────

  const runSectorEngine = useCallback(() => {
    if (!form.sector) return
    const visScore = calcVisibilityScore(form.visibility_answers)
    const seoScore = calcSeoScore(form.local_seo_answers)
    const input: SectorEngineInput = {
      sector: form.sector,
      auditScores: form.audit_snapshot?.scores || null,
      visibilityScore: visScore,
      localSeoScore: seoScore,
      hasWebsite: !!form.url,
      url: form.url || null,
      googleReviewCount: form.google_review_count ? parseInt(form.google_review_count) : undefined,
      technologyDetected: form.audit_snapshot?.technology?.platform || form.audit_snapshot?.technology?.cms || null,
    }
    const rec = generateRecommendation(input)
    setRecommendation(rec)

    // Auto-populate fields
    const serviceNames = rec.recommendedServices.map(s => s.name)
    const serviceDescs: Record<string, ServiceRecommendation> = {}
    rec.recommendedServices.forEach(s => { serviceDescs[s.name] = s })
    const totalLow = rec.recommendedServices.reduce((sum, s) => sum + s.priceLow, 0)
    const totalHigh = rec.recommendedServices.reduce((sum, s) => sum + s.priceHigh, 0)
    const totalMonthly = rec.recommendedServices.reduce((sum, s) => sum + (s.monthlyCost || 0), 0)

    setForm(prev => ({
      ...prev,
      recommended_services: serviceNames,
      service_descriptions: serviceDescs,
      roi_projection: rec.roiProjection,
      custom_stats: rec.industryStats,
      estimated_price_low: prev.estimated_price_low || totalLow.toString(),
      estimated_price_high: prev.estimated_price_high || totalHigh.toString(),
      monthly_cost: prev.monthly_cost || (totalMonthly > 0 ? totalMonthly.toString() : '40'),
    }))
  }, [form.sector, form.url, form.audit_snapshot, form.visibility_answers, form.local_seo_answers, form.google_review_count])

  // Auto-run sector engine when sector changes
  useEffect(() => {
    if (form.sector) runSectorEngine()
  }, [form.sector, runSectorEngine])

  function calcVisibilityScore(answers: Record<string, boolean>) {
    let score = 0
    VISIBILITY_ITEMS.forEach(item => { if (answers[item.id]) score += item.weight })
    return Math.round((score / VISIBILITY_TOTAL) * 100)
  }

  function calcSeoScore(answers: Record<string, string>) {
    let score = 0
    SEO_QUESTIONS.forEach(q => {
      if (answers[q.id] === 'yes') score += 10
      else if (answers[q.id] === 'notsure') score += 3
    })
    return score
  }

  // ─── Save / delete ─────────────────────────────────────────────────────────

  const buildPayload = () => ({
    business_name: form.business_name,
    contact_name: form.contact_name || null,
    contact_email: form.contact_email || null,
    contact_phone: form.contact_phone || null,
    sector: form.sector,
    url: form.url || null,
    location: form.location || null,
    prospect_id: form.prospect_id || null,
    audit_snapshot: form.audit_snapshot,
    visibility_score: calcVisibilityScore(form.visibility_answers),
    visibility_answers: form.visibility_answers,
    local_seo_score: calcSeoScore(form.local_seo_answers),
    local_seo_answers: form.local_seo_answers,
    social_profiles: form.social_profiles,
    google_review_count: form.google_review_count ? parseInt(form.google_review_count) : null,
    google_rating: form.google_rating ? parseFloat(form.google_rating) : null,
    review_response_rate: form.review_response_rate ? parseInt(form.review_response_rate) : null,
    competitor_urls: form.competitor_urls.filter(Boolean),
    competitor_audits: form.competitor_audits.length > 0 ? form.competitor_audits : null,
    recommended_services: form.recommended_services,
    service_descriptions: form.service_descriptions,
    roi_projection: form.roi_projection,
    custom_stats: form.custom_stats,
    estimated_price_low: form.estimated_price_low ? parseInt(form.estimated_price_low) : null,
    estimated_price_high: form.estimated_price_high ? parseInt(form.estimated_price_high) : null,
    monthly_cost: form.monthly_cost ? parseInt(form.monthly_cost) : null,
    personal_note: form.personal_note || null,
    updated_at: new Date().toISOString(),
  })

  const saveDossier = async (newStatus?: string) => {
    if (!form.business_name || !form.sector) {
      showToast('Business name and sector are required')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = buildPayload()
    if (newStatus) (payload as Record<string, unknown>).status = newStatus

    if (editing) {
      await supabase.from('dossiers').update(payload).eq('id', editing.id)
      setDossiers(prev => prev.map(d => d.id === editing.id ? { ...d, ...payload } as Dossier : d))
      showToast('Saved')
    } else {
      const { data } = await supabase.from('dossiers')
        .insert({ ...payload, status: newStatus || 'draft' })
        .select().single()
      if (data) {
        setDossiers(prev => [data, ...prev])
        setEditing(data)
      }
      showToast('Dossier created')
    }
    setSaving(false)
  }

  const deleteDossier = async (id: string) => {
    if (!confirm('Delete this dossier?')) return
    const supabase = createClient()
    await supabase.from('dossiers').delete().eq('id', id)
    setDossiers(prev => prev.filter(d => d.id !== id))
    showToast('Deleted')
  }

  const startNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setRecommendation(null)
    setView('editor')
  }

  const editDossier = (d: Dossier) => {
    setEditing(d)
    setForm({
      business_name: d.business_name,
      contact_name: d.contact_name || '',
      contact_email: d.contact_email || '',
      contact_phone: d.contact_phone || '',
      sector: d.sector,
      url: d.url || '',
      location: d.location || '',
      prospect_id: d.prospect_id || '',
      audit_snapshot: d.audit_snapshot,
      visibility_answers: d.visibility_answers || {},
      local_seo_answers: d.local_seo_answers || {},
      social_profiles: d.social_profiles || {},
      google_review_count: d.google_review_count?.toString() || '',
      google_rating: d.google_rating?.toString() || '',
      review_response_rate: d.review_response_rate?.toString() || '',
      competitor_urls: [...(d.competitor_urls || []), '', '', ''].slice(0, 3),
      competitor_audits: d.competitor_audits || [],
      recommended_services: d.recommended_services || [],
      service_descriptions: d.service_descriptions as Record<string, ServiceRecommendation> || {},
      roi_projection: d.roi_projection,
      custom_stats: d.custom_stats || [],
      estimated_price_low: d.estimated_price_low?.toString() || '',
      estimated_price_high: d.estimated_price_high?.toString() || '',
      monthly_cost: d.monthly_cost?.toString() || '',
      personal_note: d.personal_note || '',
    })
    setView('editor')
  }

  const openPresentation = (d?: Dossier) => {
    if (d) editDossier(d)
    setSlideIndex(0)
    setView('presentation')
  }

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`https://nithdigital.uk/dossier/view/${token}`)
    showToast('Link copied')
  }

  // ─── Prospect search ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!prospectSearch || prospectSearch.length < 2) { setProspects([]); return }
    const supabase = createClient()
    supabase.from('prospects').select('id,business_name,url,location,sector,score_overall,has_website,contact_name,contact_email,contact_phone,google_review_count,social_presence')
      .ilike('business_name', `%${prospectSearch}%`)
      .order('score_overall', { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setProspects(data) })
  }, [prospectSearch])

  // ─── Keyboard for presentation ────────────────────────────────────────────

  const SLIDE_NAMES = ['Cover', 'Website Assessment', 'Google Visibility', 'Social & Reviews', 'Cost of Inaction', 'Competitor Comparison', 'Recommended Solution', 'Investment & ROI', 'Why Nith Digital', 'Next Steps']
  const totalSlides = SLIDE_NAMES.length

  useEffect(() => {
    if (view !== 'presentation') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') setSlideIndex(prev => Math.min(prev + 1, totalSlides - 1))
      else if (e.key === 'ArrowLeft') setSlideIndex(prev => Math.max(prev - 1, 0))
      else if (e.key === 'Escape') setView('editor')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [view, totalSlides])

  // ─── Render ─────────────────────────────────────────────────────────────────

  const visibilityScore = calcVisibilityScore(form.visibility_answers)
  const seoScore = calcSeoScore(form.local_seo_answers)

  // Toast
  const toastEl = toast ? (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, background: NAVY, color: CREAM,
      padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>{toast}</div>
  ) : null

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  if (view === 'list') {
    const filtered = dossiers.filter(d => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false
      if (searchQuery && !d.business_name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    const now = new Date()
    const thisMonth = dossiers.filter(d => {
      const dt = new Date(d.created_at)
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear()
    })
    const sent = dossiers.filter(d => ['sent', 'viewed', 'converted'].includes(d.status))
    const converted = dossiers.filter(d => d.status === 'converted')
    const convRate = sent.length > 0 ? Math.round((converted.length / sent.length) * 100) : 0

    return (
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, margin: 0 }}>Client Dossiers</h1>
            <p style={{ fontSize: 13, color: GRAY, margin: '4px 0 0' }}>Personalised sales reports for prospects</p>
          </div>
          <button onClick={startNew} style={btnGold}><Plus size={14} /> New Dossier</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total', value: dossiers.length },
            { label: 'This month', value: thisMonth.length },
            { label: 'Sent', value: sent.length },
            { label: 'Conversion rate', value: `${convRate}%` },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid rgba(27,42,74,0.08)' }}>
              <div style={{ fontSize: 12, color: GRAY, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {['all', 'draft', 'ready', 'sent', 'viewed', 'converted', 'archived'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: 'none', background: statusFilter === s ? NAVY : 'rgba(27,42,74,0.06)',
                color: statusFilter === s ? CREAM : GRAY,
              }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: GRAY }} />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..." style={{ ...inputStyle, paddingLeft: 30, width: 200 }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: GRAY }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: GRAY }}>
            <p style={{ fontSize: 14 }}>No dossiers yet</p>
            <button onClick={startNew} style={{ ...btnGold, marginTop: 12 }}><Plus size={14} /> Create your first</button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(27,42,74,0.03)' }}>
                  {['Business', 'Sector', 'Score', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => {
                  const sc = d.audit_snapshot?.scores?.overall
                  const scColor = sc != null ? scoreBg(sc) : null
                  const stColor = STATUS_COLORS[d.status] || STATUS_COLORS.draft
                  return (
                    <tr key={d.id} style={{ borderTop: '1px solid rgba(27,42,74,0.06)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: NAVY }}>{d.business_name}</div>
                        {d.contact_name && <div style={{ fontSize: 11, color: GRAY }}>{d.contact_name}</div>}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'rgba(212,168,75,0.12)', color: '#B8860B' }}>{d.sector}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {sc != null ? (
                          <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: scColor!.bg, color: scColor!.color }}>{sc}/100</span>
                        ) : <span style={{ fontSize: 11, color: GRAY }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: stColor.bg, color: stColor.color }}>{d.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: GRAY }}>
                        {new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => editDossier(d)} title="Edit" style={iconBtn}><Edit size={13} /></button>
                          <button onClick={() => openPresentation(d)} title="Present" style={iconBtn}><Maximize2 size={13} /></button>
                          <button onClick={() => copyLink(d.public_token)} title="Copy link" style={iconBtn}><Share2 size={13} /></button>
                          <button onClick={() => generateDossierPDF(d)} title="Download PDF" style={iconBtn}><Download size={13} /></button>
                          <button onClick={() => deleteDossier(d.id)} title="Delete" style={{ ...iconBtn, color: '#DC2626' }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {toastEl}
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRESENTATION MODE
  // ═══════════════════════════════════════════════════════════════════════════

  if (view === 'presentation') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: NAVY, zIndex: 9999,
        display: 'flex', flexDirection: 'column', color: CREAM,
      }} className="dossier-presentation">
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(245,240,230,0.1)' }}>
          <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)' }}>
            {form.business_name} — Slide {slideIndex + 1} of {totalSlides}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => window.print()} style={{ ...iconBtn, color: CREAM, background: 'rgba(245,240,230,0.1)' }} title="Print"><Printer size={14} /></button>
            <button onClick={() => setView('editor')} style={{ ...iconBtn, color: CREAM, background: 'rgba(245,240,230,0.1)' }} title="Exit"><X size={14} /></button>
          </div>
        </div>

        {/* Slide content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, overflow: 'auto' }}>
          <div style={{ maxWidth: 900, width: '100%' }}>
            {renderSlide(slideIndex)}
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, padding: '16px 24px', borderTop: '1px solid rgba(245,240,230,0.1)' }}>
          <button onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
            disabled={slideIndex === 0}
            style={{ ...btnNavy, opacity: slideIndex === 0 ? 0.3 : 1, background: 'rgba(245,240,230,0.1)' }}>
            <ChevronLeft size={14} /> Previous
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {SLIDE_NAMES.map((_, i) => (
              <button key={i} onClick={() => setSlideIndex(i)}
                style={{
                  width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: i === slideIndex ? GOLD : 'rgba(245,240,230,0.3)',
                }} />
            ))}
          </div>
          <button onClick={() => setSlideIndex(Math.min(totalSlides - 1, slideIndex + 1))}
            disabled={slideIndex === totalSlides - 1}
            style={{ ...btnNavy, opacity: slideIndex === totalSlides - 1 ? 0.3 : 1, background: 'rgba(245,240,230,0.1)' }}>
            Next <ChevronRight size={14} />
          </button>
        </div>

        {toastEl}
        <style>{`
          @media print {
            .dossier-presentation { position: static !important; }
            .dossier-presentation > div:first-child, .dossier-presentation > div:last-child { display: none !important; }
            .dossier-presentation > div:nth-child(2) { padding: 24px !important; }
          }
        `}</style>
      </div>
    )
  }

  // ─── Slide renderer ────────────────────────────────────────────────────────

  function renderSlide(idx: number) {
    const scores = form.audit_snapshot?.scores
    switch (idx) {
      case 0: // Cover
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: GOLD, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Digital Health Report</div>
            <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>{form.business_name || 'Business Name'}</h1>
            {form.location && <p style={{ fontSize: 18, color: 'rgba(245,240,230,0.6)', marginBottom: 8 }}>{form.location}</p>}
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'rgba(212,168,75,0.15)', color: GOLD, fontSize: 13, fontWeight: 600, marginBottom: 40 }}>{form.sector}</div>
            <div style={{ fontSize: 14, color: 'rgba(245,240,230,0.4)', marginTop: 40 }}>
              Prepared by Akin Yavuz — Nith Digital<br />
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        )

      case 1: // Website Assessment
        return (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: GOLD }}>Website Assessment</h2>
            {!form.audit_snapshot ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <AlertTriangle size={48} color={GOLD} />
                <h3 style={{ fontSize: 24, marginTop: 16 }}>No Website Found</h3>
                <p style={{ color: 'rgba(245,240,230,0.6)', maxWidth: 500, margin: '12px auto' }}>
                  80% of customers Google a business before visiting. Without a website, you are invisible to the majority of potential clients.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 64, fontWeight: 700, color: scoreBg(scores!.overall).color }}>{scores!.overall}</div>
                    <div style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)' }}>Overall Score</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: scoreBg(scores!.overall).color, marginTop: 4 }}>Grade {form.audit_snapshot.grade}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {(['seo', 'security', 'performance', 'mobile', 'content'] as const).map(cat => {
                    const s = scores![cat]
                    const c = scoreBg(s)
                    return (
                      <div key={cat} style={{ background: 'rgba(245,240,230,0.05)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{s}</div>
                        <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)', textTransform: 'capitalize' }}>{cat}</div>
                      </div>
                    )
                  })}
                </div>
                {form.audit_snapshot.technology?.platform && (
                  <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>
                    Platform detected: <strong style={{ color: GOLD }}>{form.audit_snapshot.technology.platform}</strong>
                  </div>
                )}
              </>
            )}
          </div>
        )

      case 2: // Google Visibility
        return (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: GOLD }}>Google Visibility</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginBottom: 32 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, fontWeight: 700, color: scoreBg(visibilityScore).color }}>{visibilityScore}%</div>
                <div style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)' }}>Visibility Score</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: scoreBg(visibilityScore).color, marginTop: 4 }}>
                  {visibilityScore >= 80 ? 'Highly Visible' : visibilityScore >= 50 ? 'Moderately Visible' : visibilityScore >= 25 ? 'Low Visibility' : 'Virtually Invisible'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, fontWeight: 700, color: scoreBg(seoScore).color }}>{seoScore}%</div>
                <div style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)' }}>Local SEO Score</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: scoreBg(seoScore).color, marginTop: 4 }}>
                  {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : seoScore >= 40 ? 'Needs Work' : 'Critical'}
                </div>
              </div>
            </div>
            <div style={{ columns: 2, gap: 16 }}>
              {VISIBILITY_ITEMS.filter(item => !form.visibility_answers[item.id]).slice(0, 6).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, breakInside: 'avoid' }}>
                  <X size={14} color="#DC2626" />
                  <span style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 3: // Social & Reviews
        return (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: GOLD }}>Social Media & Reviews</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'rgba(245,240,230,0.05)', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Social Presence</h3>
                {(['facebook', 'instagram', 'twitter', 'linkedin'] as const).map(platform => {
                  const url = form.social_profiles[platform]
                  return (
                    <div key={platform} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(245,240,230,0.1)' }}>
                      <span style={{ textTransform: 'capitalize', fontSize: 14 }}>{platform}</span>
                      {url ? (
                        <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Active</span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>Not found</span>
                      )}
                    </div>
                  )
                })}
                {!form.social_profiles.facebook && !form.social_profiles.instagram && (
                  <p style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)', marginTop: 12 }}>
                    60% of consumers expect businesses to be active on social media
                  </p>
                )}
              </div>
              <div style={{ background: 'rgba(245,240,230,0.05)', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Google Reviews</h3>
                <div style={{ fontSize: 48, fontWeight: 700, color: form.google_review_count && parseInt(form.google_review_count) >= 10 ? '#16a34a' : form.google_review_count && parseInt(form.google_review_count) >= 5 ? GOLD : '#DC2626' }}>
                  {form.google_review_count || '0'}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)', marginBottom: 12 }}>reviews</div>
                {form.google_rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Star size={16} color={GOLD} fill={GOLD} />
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{form.google_rating}</span>
                    <span style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>average</span>
                  </div>
                )}
                {form.review_response_rate && (
                  <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>
                    Owner responds to {form.review_response_rate}% of reviews
                  </div>
                )}
                {(!form.google_review_count || parseInt(form.google_review_count) < 5) && (
                  <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(220,38,38,0.15)', fontSize: 12, color: '#FCA5A5' }}>
                    Fewer than 5 reviews — critically low trust signal
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 4: // Cost of Inaction
        return (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: GOLD }}>What This Is Costing You</h2>
            {recommendation && (
              <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)', marginBottom: 32, maxWidth: 700 }}>{recommendation.sectorPitchMessage}</p>
            )}
            {form.roi_projection && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                <div style={{ background: 'rgba(220,38,38,0.1)', borderRadius: 10, padding: 24, textAlign: 'center', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#FCA5A5' }}>~{form.roi_projection.estimatedMonthlyLeads}</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>missed leads/month</div>
                </div>
                <div style={{ background: 'rgba(220,38,38,0.1)', borderRadius: 10, padding: 24, textAlign: 'center', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#FCA5A5' }}>{fmt(form.roi_projection.estimatedMonthlyRevenue)}</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>missed revenue/month</div>
                </div>
                <div style={{ background: 'rgba(220,38,38,0.1)', borderRadius: 10, padding: 24, textAlign: 'center', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#FCA5A5' }}>{fmt(form.roi_projection.annualRevenueGain)}</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>lost over 12 months</div>
                </div>
              </div>
            )}
            {form.custom_stats.length > 0 && (
              <div style={{ marginTop: 16 }}>
                {form.custom_stats.slice(0, 4).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, marginTop: 7, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 14, color: CREAM }}>{s.stat}</span>
                      <span style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)', marginLeft: 8 }}>— {s.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 5: // Competitor Comparison
        return (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: GOLD }}>Competitor Comparison</h2>
            {form.competitor_audits.length === 0 ? (
              <p style={{ color: 'rgba(245,240,230,0.5)', textAlign: 'center', padding: 40 }}>No competitor data available</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 12, textAlign: 'left', fontSize: 12, color: 'rgba(245,240,230,0.5)', borderBottom: '1px solid rgba(245,240,230,0.1)' }}>Category</th>
                      <th style={{ padding: 12, textAlign: 'center', fontSize: 12, color: GOLD, fontWeight: 700, borderBottom: '1px solid rgba(245,240,230,0.1)' }}>Your Site</th>
                      {form.competitor_audits.map((c, i) => (
                        <th key={i} style={{ padding: 12, textAlign: 'center', fontSize: 12, color: 'rgba(245,240,230,0.5)', borderBottom: '1px solid rgba(245,240,230,0.1)' }}>
                          {new URL(c.url).hostname.replace('www.', '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(['overall', 'seo', 'performance', 'mobile', 'security', 'content'] as const).map(cat => (
                      <tr key={cat}>
                        <td style={{ padding: 12, textTransform: 'capitalize', fontSize: 13, borderBottom: '1px solid rgba(245,240,230,0.06)' }}>{cat}</td>
                        <td style={{ padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 700, color: scores ? scoreBg(scores[cat]).color : GRAY, borderBottom: '1px solid rgba(245,240,230,0.06)' }}>
                          {scores ? scores[cat] : '—'}
                        </td>
                        {form.competitor_audits.map((c, i) => (
                          <td key={i} style={{ padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 700, color: scoreBg(c.scores[cat]).color, borderBottom: '1px solid rgba(245,240,230,0.06)' }}>
                            {c.scores[cat]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )

      case 6: // Recommended Solution
        return (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: GOLD }}>What We Would Build</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {Object.values(form.service_descriptions).sort((a, b) => a.priority - b.priority).map(svc => (
                <div key={svc.name} style={{
                  background: 'rgba(245,240,230,0.05)', borderRadius: 8, padding: '16px 20px',
                  borderLeft: `3px solid ${svc.priority === 1 ? GOLD : svc.priority === 2 ? 'rgba(245,240,230,0.3)' : 'rgba(245,240,230,0.1)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{svc.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase',
                      background: svc.priority === 1 ? 'rgba(212,168,75,0.2)' : 'rgba(245,240,230,0.1)',
                      color: svc.priority === 1 ? GOLD : 'rgba(245,240,230,0.4)',
                    }}>{svc.priority === 1 ? 'Must-have' : svc.priority === 2 ? 'Should-have' : 'Nice-to-have'}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(245,240,230,0.6)', margin: 0 }}>{svc.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 7: // Investment & ROI
        return (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: GOLD }}>Investment & Returns</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'rgba(245,240,230,0.05)', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Your Investment</h3>
                <div style={{ fontSize: 36, fontWeight: 700, color: GOLD }}>
                  {form.estimated_price_low && form.estimated_price_high
                    ? `${fmt(parseInt(form.estimated_price_low))} – ${fmt(parseInt(form.estimated_price_high))}`
                    : 'TBD'}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)', marginTop: 4 }}>one-off build cost</div>
                {form.monthly_cost && (
                  <div style={{ marginTop: 16 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{fmt(parseInt(form.monthly_cost))}</span>
                    <span style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>/month hosting & support</span>
                  </div>
                )}
                <div style={{ marginTop: 20, padding: '10px 14px', borderRadius: 6, background: 'rgba(245,240,230,0.05)', fontSize: 12, color: 'rgba(245,240,230,0.4)' }}>
                  Agencies typically charge £2,000–£10,000 for a comparable build
                </div>
              </div>
              <div style={{ background: 'rgba(245,240,230,0.05)', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Expected Returns</h3>
                {form.roi_projection && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>Monthly search volume</div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{form.roi_projection.monthlySearchVolume.toLocaleString()}</div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>Estimated new leads/month</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>~{form.roi_projection.estimatedMonthlyLeads}</div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.5)' }}>Est. monthly revenue gain</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>{fmt(form.roi_projection.estimatedMonthlyRevenue)}</div>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
                      <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                        Payback period: ~{form.roi_projection.paybackMonths} month{form.roi_projection.paybackMonths !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )

      case 8: // Why Nith Digital
        return (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, color: GOLD }}>Why Nith Digital</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 700, margin: '0 auto' }}>
              {[
                { title: 'Local to D&G', desc: 'Based in Sanquhar — we understand the local market and your customers' },
                { title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. You know what you\'re paying before we start' },
                { title: 'Direct Access', desc: 'You talk to the developer, not a call centre. Fast responses, real answers' },
                { title: 'No Lock-In', desc: 'No long-term contracts. You own your website and your data' },
              ].map(item => (
                <div key={item.title} style={{ background: 'rgba(245,240,230,0.05)', borderRadius: 10, padding: 20, textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.6)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 9: // Next Steps
        return (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: GOLD }}>Next Steps</h2>
            <p style={{ fontSize: 18, color: 'rgba(245,240,230,0.7)', marginBottom: 40 }}>
              Book a free 15-minute consultation to discuss your options
            </p>
            <div style={{ display: 'inline-block', padding: '16px 40px', borderRadius: 10, background: GOLD, color: NAVY, fontSize: 18, fontWeight: 700 }}>
              nithdigital.uk/book
            </div>
            <div style={{ marginTop: 40, fontSize: 14, color: 'rgba(245,240,230,0.4)' }}>
              <div>hello@nithdigital.uk</div>
              <div style={{ marginTop: 4 }}>nithdigital.uk</div>
            </div>
            {form.personal_note && (
              <div style={{ marginTop: 32, padding: 20, borderRadius: 10, background: 'rgba(212,168,75,0.1)', border: '1px solid rgba(212,168,75,0.2)', maxWidth: 500, margin: '32px auto 0', textAlign: 'left' }}>
                <div style={{ fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 8 }}>Personal note</div>
                <div style={{ fontSize: 14, color: 'rgba(245,240,230,0.8)', whiteSpace: 'pre-wrap' }}>{form.personal_note}</div>
              </div>
            )}
            <div style={{ marginTop: 32, fontSize: 11, color: 'rgba(245,240,230,0.25)' }}>
              This report is valid for 30 days
            </div>
          </div>
        )

      default: return null
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EDITOR VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => setView('list')} style={{ ...iconBtn, gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back to list
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => openPresentation()} style={{ ...btnNavy, gap: 6 }}><Maximize2 size={13} /> Present</button>
          <button onClick={() => saveDossier()} disabled={saving} style={{ ...btnGold, opacity: saving ? 0.6 : 1 }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
            Save Draft
          </button>
          <button onClick={() => saveDossier('ready')} style={{ ...btnNavy }}>Mark Ready</button>
        </div>
      </div>

      {/* Mobile tab toggle */}
      <div className="dossier-tab-toggle" style={{ display: 'none', gap: 0, marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(27,42,74,0.2)' }}>
        <button onClick={() => setActiveTab('form')} style={{ flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === 'form' ? NAVY : '#fff', color: activeTab === 'form' ? CREAM : NAVY }}>Edit</button>
        <button onClick={() => setActiveTab('preview')} style={{ flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === 'preview' ? NAVY : '#fff', color: activeTab === 'preview' ? CREAM : NAVY }}>Preview</button>
      </div>

      {/* Two-panel layout */}
      <div className="dossier-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* LEFT: Form */}
        <div className={`dossier-form-col ${activeTab === 'preview' ? 'dossier-hidden' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Business Details */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Business Details</div>

            {/* Prospect search */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <label style={labelStyle}>Pull from prospect</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: GRAY }} />
                <input
                  value={prospectSearch}
                  onChange={e => { setProspectSearch(e.target.value); setShowProspectDropdown(true) }}
                  onFocus={() => setShowProspectDropdown(true)}
                  placeholder="Search prospects..."
                  style={{ ...inputStyle, paddingLeft: 30 }}
                />
              </div>
              {showProspectDropdown && prospects.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 10, maxHeight: 200, overflow: 'auto', border: '1px solid rgba(27,42,74,0.1)' }}>
                  {prospects.map(p => (
                    <button key={p.id} onClick={() => prefillFromProspect(p)} style={{ display: 'block', width: '100%', padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>
                      <div style={{ fontWeight: 600, color: NAVY }}>{p.business_name}</div>
                      <div style={{ fontSize: 11, color: GRAY }}>{p.sector} — {p.location}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Business name *</label>
                <input value={form.business_name} onChange={e => set('business_name', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sector *</label>
                <select value={form.sector} onChange={e => set('sector', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select sector</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Contact name</label>
                <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contact email</label>
                <input value={form.contact_email} onChange={e => set('contact_email', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contact phone</label>
                <input value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} style={inputStyle} placeholder="e.g. Dumfries" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Website URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={form.url} onChange={e => set('url', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="https://" />
                  <button onClick={() => runAudit(form.url)} disabled={auditRunning || !form.url} style={{ ...btnGold, whiteSpace: 'nowrap', opacity: auditRunning || !form.url ? 0.5 : 1 }}>
                    {auditRunning ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Auditing...</> : <><Globe size={13} /> Run Audit</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Results */}
          {form.audit_snapshot && (
            <div style={sectionStyle}>
              <div style={sectionTitle}>Website Audit Results</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {(['overall', 'seo', 'security', 'performance', 'mobile', 'content'] as const).map(cat => {
                  const s = form.audit_snapshot!.scores[cat]
                  const c = scoreBg(s)
                  return (
                    <div key={cat} style={{ textAlign: 'center', padding: '10px 8px', borderRadius: 8, background: c.bg }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: c.color }}>{s}</div>
                      <div style={{ fontSize: 10, color: GRAY, textTransform: 'capitalize' }}>{cat}</div>
                    </div>
                  )
                })}
              </div>
              {form.audit_snapshot.technology?.platform && (
                <div style={{ marginTop: 8, fontSize: 12, color: GRAY }}>
                  Platform: <strong>{form.audit_snapshot.technology.platform}</strong>
                </div>
              )}
              {form.audit_snapshot.checks && form.audit_snapshot.checks.filter(c => c.status === 'fail').length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, marginBottom: 6 }}>Failed checks:</div>
                  {form.audit_snapshot.checks.filter(c => c.status === 'fail').slice(0, 8).map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                      <X size={12} color="#DC2626" />
                      <span style={{ fontSize: 12, color: NAVY }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Visibility Checker */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={sectionTitle}>Google Visibility ({visibilityScore}%)</div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10,
                background: scoreBg(visibilityScore).bg, color: scoreBg(visibilityScore).color,
              }}>
                {visibilityScore >= 80 ? 'Highly Visible' : visibilityScore >= 50 ? 'Moderate' : visibilityScore >= 25 ? 'Low' : 'Invisible'}
              </span>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {VISIBILITY_ITEMS.map(item => (
                <label key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13, color: NAVY }}>
                  <input
                    type="checkbox"
                    checked={!!form.visibility_answers[item.id]}
                    onChange={() => {
                      const next = { ...form.visibility_answers }
                      if (next[item.id]) delete next[item.id]
                      else next[item.id] = true
                      set('visibility_answers', next)
                    }}
                    style={{ accentColor: GOLD }}
                  />
                  {item.label}
                  <span style={{ fontSize: 10, color: GRAY, marginLeft: 'auto' }}>({item.weight}pts)</span>
                </label>
              ))}
            </div>
          </div>

          {/* Local SEO Scorecard */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={sectionTitle}>Local SEO Scorecard ({seoScore}%)</div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10,
                background: scoreBg(seoScore).bg, color: scoreBg(seoScore).color,
              }}>
                {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : seoScore >= 40 ? 'Needs Work' : 'Critical'}
              </span>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {SEO_QUESTIONS.map(q => (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: NAVY }}>{q.text}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['yes', 'notsure', 'no'] as const).map(ans => (
                      <button key={ans} onClick={() => {
                        const next = { ...form.local_seo_answers }
                        next[q.id] = ans
                        set('local_seo_answers', next)
                      }}
                        style={{
                          padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                          background: form.local_seo_answers[q.id] === ans
                            ? (ans === 'yes' ? 'rgba(22,163,74,0.15)' : ans === 'no' ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)')
                            : 'rgba(27,42,74,0.06)',
                          color: form.local_seo_answers[q.id] === ans
                            ? (ans === 'yes' ? '#16a34a' : ans === 'no' ? '#DC2626' : '#D97706')
                            : GRAY,
                        }}>
                        {ans === 'yes' ? 'Yes' : ans === 'no' ? 'No' : '?'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media & Reviews */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Social Media & Reviews</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(['facebook', 'instagram', 'twitter', 'linkedin'] as const).map(platform => (
                <div key={platform}>
                  <label style={labelStyle}>{platform.charAt(0).toUpperCase() + platform.slice(1)} URL</label>
                  <input
                    value={form.social_profiles[platform] || ''}
                    onChange={e => set('social_profiles', { ...form.social_profiles, [platform]: e.target.value || null })}
                    style={inputStyle} placeholder={`${platform}.com/...`}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Google review count</label>
                <input value={form.google_review_count} onChange={e => set('google_review_count', e.target.value)} style={inputStyle} type="number" />
              </div>
              <div>
                <label style={labelStyle}>Average rating (1-5)</label>
                <input value={form.google_rating} onChange={e => set('google_rating', e.target.value)} style={inputStyle} type="number" step="0.1" min="1" max="5" />
              </div>
              <div>
                <label style={labelStyle}>Owner response rate (%)</label>
                <input value={form.review_response_rate} onChange={e => set('review_response_rate', e.target.value)} style={inputStyle} type="number" min="0" max="100" />
              </div>
            </div>
          </div>

          {/* Competitors */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Competitor Comparison</div>
            {form.competitor_urls.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  value={url}
                  onChange={e => {
                    const urls = [...form.competitor_urls]
                    urls[i] = e.target.value
                    set('competitor_urls', urls)
                  }}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder={`Competitor ${i + 1} URL`}
                />
                <button
                  onClick={() => runAudit(url, i)}
                  disabled={!url || competitorAuditRunning != null}
                  style={{ ...btnNavy, whiteSpace: 'nowrap', opacity: !url || competitorAuditRunning != null ? 0.5 : 1 }}>
                  {competitorAuditRunning === i ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Globe size={13} />}
                  Audit
                </button>
              </div>
            ))}
            {form.competitor_audits.length > 0 && (
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>
                {form.competitor_audits.length} competitor{form.competitor_audits.length > 1 ? 's' : ''} audited
              </div>
            )}
          </div>

          {/* Recommended Services */}
          {Object.keys(form.service_descriptions).length > 0 && (
            <div style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={sectionTitle}>Recommended Services</div>
                <button onClick={runSectorEngine} style={{ ...iconBtn, fontSize: 11, gap: 4 }}>Regenerate</button>
              </div>
              {Object.values(form.service_descriptions).sort((a, b) => a.priority - b.priority).map(svc => (
                <div key={svc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{svc.name}</div>
                    <div style={{ fontSize: 11, color: GRAY }}>{svc.description.slice(0, 80)}...</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{fmt(svc.priceLow)}–{fmt(svc.priceHigh)}</div>
                    {svc.monthlyCost && <div style={{ fontSize: 10, color: GRAY }}>+{fmt(svc.monthlyCost)}/mo</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Pricing</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Estimate low</label>
                <input value={form.estimated_price_low} onChange={e => set('estimated_price_low', e.target.value)} style={inputStyle} type="number" placeholder="500" />
              </div>
              <div>
                <label style={labelStyle}>Estimate high</label>
                <input value={form.estimated_price_high} onChange={e => set('estimated_price_high', e.target.value)} style={inputStyle} type="number" placeholder="900" />
              </div>
              <div>
                <label style={labelStyle}>Monthly cost</label>
                <input value={form.monthly_cost} onChange={e => set('monthly_cost', e.target.value)} style={inputStyle} type="number" placeholder="40" />
              </div>
            </div>
          </div>

          {/* ROI */}
          {form.roi_projection && (
            <div style={sectionStyle}>
              <div style={sectionTitle}>ROI Projection</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Monthly local searches</label>
                  <input
                    value={form.roi_projection.monthlySearchVolume}
                    onChange={e => set('roi_projection', { ...form.roi_projection!, monthlySearchVolume: parseInt(e.target.value) || 0 })}
                    style={inputStyle} type="number"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Conversion rate</label>
                  <input
                    value={(form.roi_projection.conversionRate * 100).toFixed(1)}
                    onChange={e => set('roi_projection', { ...form.roi_projection!, conversionRate: (parseFloat(e.target.value) || 0) / 100 })}
                    style={inputStyle} type="number" step="0.5"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Average ticket value (£)</label>
                  <input
                    value={form.roi_projection.avgTicketValue}
                    onChange={e => set('roi_projection', { ...form.roi_projection!, avgTicketValue: parseInt(e.target.value) || 0 })}
                    style={inputStyle} type="number"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Payback months</label>
                  <input value={form.roi_projection.paybackMonths} readOnly style={{ ...inputStyle, background: '#f5f5f5' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
                <div style={{ textAlign: 'center', padding: 10, borderRadius: 6, background: 'rgba(22,163,74,0.08)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>~{form.roi_projection.estimatedMonthlyLeads}</div>
                  <div style={{ fontSize: 10, color: GRAY }}>leads/mo</div>
                </div>
                <div style={{ textAlign: 'center', padding: 10, borderRadius: 6, background: 'rgba(22,163,74,0.08)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>{fmt(form.roi_projection.estimatedMonthlyRevenue)}</div>
                  <div style={{ fontSize: 10, color: GRAY }}>revenue/mo</div>
                </div>
                <div style={{ textAlign: 'center', padding: 10, borderRadius: 6, background: 'rgba(22,163,74,0.08)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>{fmt(form.roi_projection.annualRevenueGain)}</div>
                  <div style={{ fontSize: 10, color: GRAY }}>annual gain</div>
                </div>
              </div>
            </div>
          )}

          {/* Personal Note */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Personal Note</div>
            <textarea
              value={form.personal_note}
              onChange={e => set('personal_note', e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              placeholder="Add a personal message for this prospect..."
            />
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className={`dossier-preview-col ${activeTab === 'form' ? 'dossier-preview-desktop' : ''}`} style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: NAVY, borderRadius: 12, padding: 24, color: CREAM, maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
            <div style={{ fontSize: 10, color: GOLD, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Live Preview</div>

            {/* Mini cover */}
            <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(245,240,230,0.1)' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{form.business_name || 'Business Name'}</h3>
              {form.sector && <div style={{ fontSize: 12, color: GOLD, marginTop: 4 }}>{form.sector}</div>}
              {form.location && <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)', marginTop: 2 }}>{form.location}</div>}
            </div>

            {/* Mini audit scores */}
            {form.audit_snapshot && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,240,230,0.5)', marginBottom: 8 }}>WEBSITE HEALTH</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {(['overall', 'seo', 'mobile'] as const).map(cat => {
                    const s = form.audit_snapshot!.scores[cat]
                    return (
                      <div key={cat} style={{ textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: 'rgba(245,240,230,0.05)' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: scoreBg(s).color }}>{s}</div>
                        <div style={{ fontSize: 9, color: 'rgba(245,240,230,0.4)', textTransform: 'capitalize' }}>{cat}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Mini visibility */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,240,230,0.5)', marginBottom: 8 }}>VISIBILITY</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: scoreBg(visibilityScore).color }}>{visibilityScore}%</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: scoreBg(seoScore).color }}>{seoScore}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: 'rgba(245,240,230,0.4)' }}>Google Visibility</span>
                <span style={{ fontSize: 10, color: 'rgba(245,240,230,0.4)' }}>Local SEO</span>
              </div>
            </div>

            {/* Mini services */}
            {form.recommended_services.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,240,230,0.5)', marginBottom: 8 }}>RECOMMENDED</div>
                {form.recommended_services.slice(0, 4).map(s => (
                  <div key={s} style={{ fontSize: 12, color: CREAM, padding: '4px 0', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: GOLD }} />
                    {s}
                  </div>
                ))}
                {form.recommended_services.length > 4 && (
                  <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)', marginTop: 4 }}>+{form.recommended_services.length - 4} more</div>
                )}
              </div>
            )}

            {/* Mini pricing */}
            {form.estimated_price_low && (
              <div style={{ textAlign: 'center', padding: '12px 0', borderTop: '1px solid rgba(245,240,230,0.1)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: GOLD }}>
                  {fmt(parseInt(form.estimated_price_low))}–{fmt(parseInt(form.estimated_price_high || form.estimated_price_low))}
                </div>
                {form.monthly_cost && (
                  <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)' }}>+ {fmt(parseInt(form.monthly_cost))}/month</div>
                )}
              </div>
            )}

            <button onClick={() => openPresentation()} style={{ ...btnGold, width: '100%', justifyContent: 'center', marginTop: 16 }}>
              <Maximize2 size={13} /> Full Presentation
            </button>
          </div>
        </div>
      </div>

      {toastEl}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 1024px) {
          .dossier-layout { grid-template-columns: 1fr !important; }
          .dossier-tab-toggle { display: flex !important; }
          .dossier-preview-col { position: static !important; }
          .dossier-preview-desktop { display: none !important; }
          .dossier-hidden { display: none !important; }
        }
        @media print {
          .dossier-layout { display: block !important; }
          .dossier-form-col { display: none !important; }
          .dossier-preview-col { position: static !important; display: block !important; }
        }
      `}</style>
    </div>
  )
}
