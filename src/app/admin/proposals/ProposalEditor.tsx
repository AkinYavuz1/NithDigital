'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2, Download, Save, ArrowLeft, Layout } from 'lucide-react'
import ProposalPreview from './ProposalPreview'

const TEMPLATE_PICKS = [
  { slug: 'highland-rest', name: 'Highland Rest B&B', type: 'B&B / Holiday Let', path: '/templates/highland-rest' },
  { slug: 'nithsdale-plumbing', name: 'Nithsdale Plumbing', type: 'Tradesperson', path: '/templates/nithsdale-plumbing' },
  { slug: 'river-kitchen', name: 'The River Kitchen', type: 'Restaurant / Café', path: '/templates/river-kitchen' },
  { slug: 'galloway-larder', name: 'The Galloway Larder', type: 'Farm Shop / Retail', path: '/templates/galloway-larder' },
]

export interface ProposalForm {
  business_name: string
  contact_name: string
  contact_email: string
  business_type: string
  selected_services: string[]
  custom_bullets: string[]
  pricing_model: string
  estimated_price_low: string
  estimated_price_high: string
  monthly_cost: string
  notes: string
  internal_notes: string
  demo_url: string
}

const SERVICES = [
  'Mobile-responsive business website',
  'Online booking / scheduling system',
  'E-commerce with product listings and payments',
  'Photo gallery with lightbox',
  'Google Maps and directions',
  'Contact form with email notifications',
  'SEO setup for local search (Google Business Profile, meta tags, sitemap)',
  'Blog / news section',
  'Menu display (restaurant/café)',
  'Room/property listings with availability (B&B)',
  'Customer reviews / testimonials section',
  'Social media integration',
  'Newsletter signup',
  'Branded business email setup',
  'SSL certificate and security',
  'Monthly hosting and support',
  'Analytics and performance tracking',
  'Custom dashboard or reporting tool',
  'Client portal / login area',
  'Job tracking / management system',
]

const BIZ_TYPES = [
  { value: 'tradesperson', label: 'Tradesperson' },
  { value: 'bnb', label: 'B&B / Holiday Let' },
  { value: 'restaurant', label: 'Restaurant / Café' },
  { value: 'retail', label: 'Retail / Shop' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'health_beauty', label: 'Health & Beauty' },
  { value: 'agriculture', label: 'Agriculture / Rural' },
  { value: 'community', label: 'Community / Non-profit' },
  { value: 'other', label: 'Other' },
]

const EMPTY: ProposalForm = {
  business_name: '', contact_name: '', contact_email: '', business_type: 'other',
  selected_services: [], custom_bullets: [], pricing_model: 'standard',
  estimated_price_low: '', estimated_price_high: '', monthly_cost: '',
  notes: '', internal_notes: '', demo_url: '',
}

interface Props {
  proposal: (ProposalForm & { id: string; public_token: string }) | null
  prefill?: Partial<ProposalForm>
}

export default function ProposalEditor({ proposal, prefill }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProposalForm>(() => {
    if (proposal) {
      return {
        business_name: proposal.business_name,
        contact_name: proposal.contact_name || '',
        contact_email: proposal.contact_email || '',
        business_type: proposal.business_type,
        selected_services: proposal.selected_services || [],
        custom_bullets: proposal.custom_bullets || [],
        pricing_model: proposal.pricing_model || 'standard',
        estimated_price_low: proposal.estimated_price_low?.toString() || '',
        estimated_price_high: proposal.estimated_price_high?.toString() || '',
        monthly_cost: proposal.monthly_cost?.toString() || '',
        notes: proposal.notes || '',
        internal_notes: (proposal as unknown as Record<string, string>).internal_notes || '',
        demo_url: proposal.demo_url || '',
      }
    }
    return prefill ? { ...EMPTY, ...prefill } : EMPTY
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form')
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)

  const set = useCallback((field: keyof ProposalForm, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const toggleService = (s: string) => {
    setForm(prev => ({
      ...prev,
      selected_services: prev.selected_services.includes(s)
        ? prev.selected_services.filter(x => x !== s)
        : [...prev.selected_services, s],
    }))
  }

  const addBullet = () => setForm(prev => ({ ...prev, custom_bullets: [...prev.custom_bullets, ''] }))
  const removeBullet = (i: number) => setForm(prev => ({ ...prev, custom_bullets: prev.custom_bullets.filter((_, j) => j !== i) }))
  const updateBullet = (i: number, v: string) => setForm(prev => ({ ...prev, custom_bullets: prev.custom_bullets.map((b, j) => j === i ? v : b) }))

  const buildPayload = () => ({
    business_name: form.business_name,
    contact_name: form.contact_name || null,
    contact_email: form.contact_email || null,
    business_type: form.business_type,
    selected_services: form.selected_services,
    custom_bullets: form.custom_bullets.filter(Boolean),
    pricing_model: form.pricing_model,
    estimated_price_low: form.estimated_price_low ? parseInt(form.estimated_price_low) : null,
    estimated_price_high: form.estimated_price_high ? parseInt(form.estimated_price_high) : null,
    monthly_cost: form.monthly_cost ? parseInt(form.monthly_cost) : null,
    notes: form.notes || null,
    internal_notes: form.internal_notes || null,
    demo_url: form.demo_url || null,
    updated_at: new Date().toISOString(),
  })

  const saveDraft = async () => {
    if (!form.business_name || !form.business_type) { showToast('Business name and type are required'); return }
    setSaving(true)
    const supabase = createClient()
    if (proposal) {
      await supabase.from('proposals').update(buildPayload()).eq('id', proposal.id)
      showToast('Saved')
    } else {
      const { data } = await supabase.from('proposals').insert({ ...buildPayload(), status: 'draft' }).select().single()
      if (data) router.replace(`/admin/proposals/${data.id}/edit`)
      showToast('Draft saved')
    }
    setSaving(false)
  }

  const handleDownload = async () => {
    if (!form.business_name) { showToast('Enter a business name first'); return }
    const { generateProposalPDF } = await import('./proposalPdf')
    const pdfData = {
      id: proposal?.id || 'draft',
      public_token: proposal?.public_token || '',
      created_at: new Date().toISOString(),
      ...form,
      estimated_price_low: form.estimated_price_low ? parseInt(form.estimated_price_low) : null,
      estimated_price_high: form.estimated_price_high ? parseInt(form.estimated_price_high) : null,
      monthly_cost: form.monthly_cost ? parseInt(form.monthly_cost) : null,
      notes: form.notes || null,
      demo_url: form.demo_url || null,
    }
    await generateProposalPDF(pdfData)
  }

  const saveAndDownload = async () => {
    await saveDraft()
    await handleDownload()
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <button onClick={() => router.push('/admin/proposals')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5A6A7A', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 8 }}>
            <ArrowLeft size={13} /> Back to proposals
          </button>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>
            {proposal ? `Edit: ${form.business_name || 'Proposal'}` : 'New Proposal'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={saveDraft} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'rgba(27,42,74,0.08)', color: '#1B2A4A', border: 'none', borderRadius: 100, cursor: 'pointer', fontSize: 13 }}>
            <Save size={13} /> {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#1B2A4A', color: '#F5F0E6', border: 'none', borderRadius: 100, cursor: 'pointer', fontSize: 13 }}>
            <Download size={13} /> Download PDF
          </button>
          <button onClick={saveAndDownload} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#D4A84B', color: '#1B2A4A', border: 'none', borderRadius: 100, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            Save &amp; Download
          </button>
        </div>
      </div>

      {/* Mobile tab toggle */}
      <div className="proposal-tab-toggle" style={{ display: 'none', gap: 0, marginBottom: 20, border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, overflow: 'hidden' }}>
        {(['form', 'preview'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab ? '#1B2A4A' : '#fff', color: activeTab === tab ? '#F5F0E6' : '#5A6A7A' }}>
            {tab === 'form' ? 'Form' : 'Preview'}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }} className="proposal-layout">

        {/* LEFT: Form */}
        <div className={`proposal-form-col ${activeTab === 'preview' ? 'proposal-hidden' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Client Details */}
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Client Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Business name <span style={{ color: '#DC2626' }}>*</span></label>
                <input value={form.business_name} onChange={e => set('business_name', e.target.value)} style={inputStyle} placeholder="e.g. The Old Mill B&B" />
              </div>
              <div>
                <label style={labelStyle}>Contact name</label>
                <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} style={inputStyle} placeholder="e.g. Jane Smith" />
              </div>
              <div>
                <label style={labelStyle}>Contact email</label>
                <input value={form.contact_email} onChange={e => set('contact_email', e.target.value)} style={inputStyle} placeholder="jane@example.com" type="email" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Business type <span style={{ color: '#DC2626' }}>*</span></label>
                <select value={form.business_type} onChange={e => set('business_type', e.target.value)} style={inputStyle}>
                  {BIZ_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Services */}
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>What We&apos;d Build</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SERVICES.map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, color: '#1B2A4A' }}>
                  <input
                    type="checkbox"
                    checked={form.selected_services.includes(s)}
                    onChange={() => toggleService(s)}
                    style={{ marginTop: 2, accentColor: '#D4A84B', flexShrink: 0 }}
                  />
                  {s}
                </label>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={labelStyle}>Custom bullets</label>
                <button onClick={addBullet} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#D4A84B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  <Plus size={12} /> Add
                </button>
              </div>
              {form.custom_bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={b} onChange={e => updateBullet(i, e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} placeholder="Custom item…" />
                  <button onClick={() => removeBullet(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: '0 4px' }}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Pricing</h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              {[['standard', 'Standard'], ['startup', 'Startup Bundle'], ['custom', 'Custom']].map(([v, l]) => (
                <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="pricing_model" value={v} checked={form.pricing_model === v} onChange={() => set('pricing_model', v)} style={{ accentColor: '#D4A84B' }} />
                  {l}
                </label>
              ))}
            </div>
            {form.pricing_model === 'standard' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>One-off cost (low)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A', fontSize: 13 }}>£</span>
                    <input value={form.estimated_price_low} onChange={e => set('estimated_price_low', e.target.value)} style={{ ...inputStyle, paddingLeft: 24 }} placeholder="800" type="number" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>One-off cost (high)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A', fontSize: 13 }}>£</span>
                    <input value={form.estimated_price_high} onChange={e => set('estimated_price_high', e.target.value)} style={{ ...inputStyle, paddingLeft: 24 }} placeholder="1200" type="number" />
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Monthly cost (hosting & support)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A', fontSize: 13 }}>£</span>
                    <input value={form.monthly_cost} onChange={e => set('monthly_cost', e.target.value)} style={{ ...inputStyle, paddingLeft: 24 }} placeholder="25" type="number" />
                  </div>
                </div>
              </div>
            )}
            {form.pricing_model === 'startup' && (
              <div style={{ background: '#F5F0E6', borderRadius: 8, padding: 16, fontSize: 13, color: '#1B2A4A', lineHeight: 1.7 }}>
                <strong style={{ color: '#D4A84B' }}>Startup Bundle</strong><br />
                £0 upfront · £40/month (12-month minimum, then £30/month)<br />
                Business OS: 1 month free, then £4.99/month
              </div>
            )}
            {form.pricing_model === 'custom' && (
              <div>
                <label style={labelStyle}>Custom pricing description</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Describe the pricing arrangement…" />
              </div>
            )}
          </section>

          {/* Extras */}
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Extras</h2>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Demo URL (optional)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={form.demo_url} onChange={e => set('demo_url', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="e.g. /templates/highland-rest?name=My+B%26B" />
                <button
                  type="button"
                  onClick={() => setShowTemplatePicker(p => !p)}
                  title="Choose a template"
                  style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', background: showTemplatePicker ? '#1B2A4A' : '#f9f8f5', color: showTemplatePicker ? '#D4A84B' : '#5A6A7A', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}
                >
                  <Layout size={13} /> Templates
                </button>
              </div>
              {showTemplatePicker && (
                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {TEMPLATE_PICKS.map(t => {
                    const url = `${t.path}?name=${encodeURIComponent(form.business_name || t.name)}&phone=${encodeURIComponent(form.contact_email || '')}&email=${encodeURIComponent(form.contact_email || '')}`
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => { set('demo_url', url); setShowTemplatePicker(false) }}
                        style={{ padding: '10px 12px', background: '#f9f8f5', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 6, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4A84B')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(27,42,74,0.12)')}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 2 }}>{t.type}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            {form.pricing_model !== 'custom' && (
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Personal note to client (optional)</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="I had a look at what you're doing and…" />
              </div>
            )}
            <div>
              <label style={labelStyle}>Internal notes (not shown on PDF)</label>
              <textarea value={form.internal_notes} onChange={e => set('internal_notes', e.target.value)} style={{ ...inputStyle, height: 60, resize: 'vertical' }} placeholder="Budget notes, source, follow-up date…" />
            </div>
          </section>
        </div>

        {/* RIGHT: Live Preview */}
        <div className={`proposal-preview-col ${activeTab === 'form' ? 'proposal-preview-desktop' : ''}`} style={{ position: 'sticky', top: 80 }}>
          <ProposalPreview form={form} proposalId={proposal?.id || 'draft'} />
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1B2A4A', color: '#F5F0E6', padding: '12px 20px', borderRadius: 8, fontSize: 13, zIndex: 100 }}>
          {toast}
        </div>
      )}

      <style>{`
        .proposal-layout { grid-template-columns: 1fr 1fr; }
        @media (max-width: 1024px) {
          .proposal-layout { grid-template-columns: 1fr !important; }
          .proposal-tab-toggle { display: flex !important; }
          .proposal-preview-col { position: static !important; }
          .proposal-preview-desktop { display: none; }
          .proposal-hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}

const sectionStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 10, padding: 20, border: '1px solid rgba(27,42,74,0.08)',
}
const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, marginBottom: 16, color: '#1B2A4A',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500, color: '#5A6A7A', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid rgba(27,42,74,0.2)', fontSize: 13,
  color: '#1B2A4A', background: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: 0,
}
