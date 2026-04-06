'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Settings2, Copy, FileSignature, X, ExternalLink, Check } from 'lucide-react'

interface TemplateConfig {
  slug: string
  name: string
  businessType: string
  description: string
  previewUrl: string
  defaultConfig: {
    name: string
    tagline: string
    location: string
    phone: string
    email: string
  }
}

const TEMPLATES: TemplateConfig[] = [
  {
    slug: 'highland-rest',
    name: 'Highland Rest B&B',
    businessType: 'B&B / Holiday Let',
    description: 'Warm, inviting B&B template with room listings, gallery, local area guide, and booking enquiry form.',
    previewUrl: '/templates/highland-rest',
    defaultConfig: {
      name: 'Highland Rest B&B',
      tagline: 'A peaceful retreat in the heart of Nithsdale',
      location: 'Thornhill, Dumfries & Galloway',
      phone: '01848 330 123',
      email: 'stay@highlandrest.co.uk',
    },
  },
  {
    slug: 'nithsdale-plumbing',
    name: 'Nithsdale Plumbing',
    businessType: 'Tradesperson',
    description: 'Professional trades template with services, emergency callout banner, recent work gallery, and quote request form.',
    previewUrl: '/templates/nithsdale-plumbing',
    defaultConfig: {
      name: 'Nithsdale Plumbing & Heating',
      tagline: 'Reliable plumbing & heating across Dumfries & Galloway',
      location: 'Sanquhar',
      phone: '07700 123 456',
      email: 'info@nithsdaleplumbing.co.uk',
    },
  },
  {
    slug: 'river-kitchen',
    name: 'The River Kitchen',
    businessType: 'Restaurant / Café',
    description: 'Modern bistro template with tabbed menu, gallery, events section, and reservation form.',
    previewUrl: '/templates/river-kitchen',
    defaultConfig: {
      name: 'The River Kitchen',
      tagline: 'Modern Scottish dining on the banks of the Dee',
      location: 'Castle Douglas',
      phone: '01556 503 456',
      email: 'hello@riverkitchen.co.uk',
    },
  },
  {
    slug: 'galloway-larder',
    name: 'The Galloway Larder',
    businessType: 'Farm Shop / Retail',
    description: 'Rustic farm shop template with product categories, featured items, supplier stories, and delivery info.',
    previewUrl: '/templates/galloway-larder',
    defaultConfig: {
      name: 'The Galloway Larder',
      tagline: "Local produce from Galloway's finest farms",
      location: 'Gatehouse of Fleet',
      phone: '01557 814 123',
      email: 'hello@gallowaylarder.co.uk',
    },
  },
  {
    slug: 'nithsdale-motors',
    name: 'Nithsdale Motors',
    businessType: 'Car Mechanic / MOT Centre',
    description: 'Industrial garage template with MOT booking, price list, service cards, fleet accounts, and quote form.',
    previewUrl: '/templates/nithsdale-motors',
    defaultConfig: {
      name: 'Nithsdale Motors',
      tagline: 'Your local garage in Thornhill — honest, reliable, affordable',
      location: 'Thornhill',
      phone: '01848 330 789',
      email: 'info@nithsdalemotors.co.uk',
    },
  },
  {
    slug: 'upper-nithsdale-construction',
    name: 'Upper Nithsdale Construction',
    businessType: 'Building Company',
    description: 'Premium building company template with project gallery, process timeline, accreditations, and site survey form.',
    previewUrl: '/templates/upper-nithsdale-construction',
    defaultConfig: {
      name: 'Upper Nithsdale Construction Ltd',
      tagline: 'Building excellence across Dumfries & Galloway',
      location: 'Sanquhar',
      phone: '01659 50234',
      email: 'info@uppernithsdaleconstruction.co.uk',
    },
  },
  {
    slug: 'nith-valley-joinery',
    name: 'Nith Valley Joinery',
    businessType: 'Joinery / Carpentry',
    description: 'Warm, artisanal joinery template with portfolio gallery, materials section, process timeline, and project enquiry form.',
    previewUrl: '/templates/nith-valley-joinery',
    defaultConfig: {
      name: 'Nith Valley Joinery',
      tagline: 'Bespoke joinery, handcrafted in Nithsdale',
      location: 'Sanquhar',
      phone: '01659 50567',
      email: 'hello@nithvalleyjoinery.co.uk',
    },
  },
  {
    slug: 'galloway-beauty',
    name: 'Galloway Beauty Studio',
    businessType: 'Beauty & Hair Salon',
    description: 'Upmarket salon template with service cards, price list, gallery, about section, and appointment booking form.',
    previewUrl: '/templates/galloway-beauty',
    defaultConfig: {
      name: 'Galloway Beauty Studio',
      tagline: 'Luxury hair & beauty in the heart of Dumfries',
      location: 'Dumfries',
      phone: '01387 254 780',
      email: 'hello@gallowaybeauty.co.uk',
    },
  },
  {
    slug: 'nith-legal',
    name: 'Nith & Co Solicitors',
    businessType: 'Legal / Professional Services',
    description: 'Corporate solicitors template with practice areas, team profiles, accreditations, and free consultation request form.',
    previewUrl: '/templates/nith-legal',
    defaultConfig: {
      name: 'Nith & Co Solicitors',
      tagline: 'Clear, trusted legal advice for individuals and businesses across Dumfries & Galloway',
      location: 'Dumfries',
      phone: '01387 267 400',
      email: 'enquiries@nithandco.co.uk',
    },
  },
  {
    slug: 'annandale-health',
    name: 'Annandale Health & Wellness',
    businessType: 'Physiotherapy / Wellness',
    description: 'Clean healthcare template with treatment services, conditions treated, team bios, and appointment booking form.',
    previewUrl: '/templates/annandale-health',
    defaultConfig: {
      name: 'Annandale Health & Wellness',
      tagline: 'Physiotherapy, sports massage & wellness in Annan',
      location: 'Annan',
      phone: '01461 207 350',
      email: 'hello@annandalehealth.co.uk',
    },
  },
  {
    slug: 'galloway-fitness',
    name: 'Galloway Fitness & PT',
    businessType: 'Gym / Personal Training',
    description: 'Bold fitness studio template with class timetable, membership pricing, trainer profiles, and free trial sign-up.',
    previewUrl: '/templates/galloway-fitness',
    defaultConfig: {
      name: 'Galloway Fitness & PT',
      tagline: 'Train harder. Feel stronger. Live better.',
      location: 'Castle Douglas',
      phone: '07812 345 678',
      email: 'info@gallowayfitness.co.uk',
    },
  },
  {
    slug: 'castle-events',
    name: 'Castle Nith Events',
    businessType: 'Wedding & Events Venue',
    description: 'Elegant wedding venue template with gallery, capacity details, tiered packages, and full event enquiry form.',
    previewUrl: '/templates/castle-events',
    defaultConfig: {
      name: 'Castle Nith Events',
      tagline: 'Timeless celebrations in the heart of Galloway',
      location: 'Kirkcudbright',
      phone: '01556 620 340',
      email: 'hello@castlenithevents.co.uk',
    },
  },
  {
    slug: 'nithsdale-properties',
    name: 'Nithsdale Properties',
    businessType: 'Estate Agent / Property',
    description: 'Clean property agency template with featured listings, services breakdown, local expertise, and valuation request form.',
    previewUrl: '/templates/nithsdale-properties',
    defaultConfig: {
      name: 'Nithsdale Properties',
      tagline: 'Finding you the right home across Dumfries & Galloway',
      location: 'Dumfries',
      phone: '01387 272 900',
      email: 'hello@nithsdaleproperties.co.uk',
    },
  },
  {
    slug: 'stepping-stones',
    name: 'Stepping Stones Nursery',
    businessType: 'Nursery / Childcare',
    description: 'Warm, friendly nursery template with session types, funding info, key features, and child registration form.',
    previewUrl: '/templates/stepping-stones',
    defaultConfig: {
      name: 'Stepping Stones Nursery',
      tagline: 'A safe, nurturing place where little ones learn and grow',
      location: 'Dumfries',
      phone: '01387 248 650',
      email: 'hello@steppingstonesnursery.co.uk',
    },
  },
  {
    slug: 'galloway-adventures',
    name: 'Galloway Adventures',
    businessType: 'Tourism & Outdoor Activities',
    description: 'Dramatic adventure tourism template with activity cards, pricing, guide profiles, and group booking form.',
    previewUrl: '/templates/galloway-adventures',
    defaultConfig: {
      name: 'Galloway Adventures',
      tagline: "Explore Scotland's wild south — by land, water & sky",
      location: 'Newton Stewart',
      phone: '07923 456 789',
      email: 'hello@gallowayadventures.co.uk',
    },
  },
  {
    slug: 'high-street-retail',
    name: 'The Galloway Gift Co.',
    businessType: 'Independent Retail',
    description: 'Charming gift shop template with product showcase, shop interior feature, brand story, and contact/directions form.',
    previewUrl: '/templates/high-street-retail',
    defaultConfig: {
      name: 'The Galloway Gift Co.',
      tagline: 'Thoughtful gifts & beautiful homewares for every occasion',
      location: 'Kirkcudbright',
      phone: '01557 332 190',
      email: 'hello@gallowaygieft.co.uk',
    },
  },
]

const STYLE_TAGS: Record<string, { bg: string; color: string }> = {
  'B&B / Holiday Let': { bg: 'rgba(124,91,58,0.12)', color: '#7C5B3A' },
  'Tradesperson': { bg: 'rgba(232,114,12,0.12)', color: '#C25A00' },
  'Restaurant / Café': { bg: 'rgba(201,168,76,0.15)', color: '#8A6A00' },
  'Farm Shop / Retail': { bg: 'rgba(59,107,74,0.12)', color: '#2D5238' },
  'Car Mechanic / MOT Centre': { bg: 'rgba(211,47,47,0.1)', color: '#B71C1C' },
  'Building Company': { bg: 'rgba(44,62,80,0.1)', color: '#2C3E50' },
  'Joinery / Carpentry': { bg: 'rgba(45,80,22,0.1)', color: '#2D5016' },
  'Beauty & Hair Salon': { bg: 'rgba(184,122,138,0.1)', color: '#8A4A5A' },
  'Legal / Professional Services': { bg: 'rgba(26,58,92,0.1)', color: '#1A3A5C' },
  'Physiotherapy / Wellness': { bg: 'rgba(46,125,94,0.1)', color: '#1A5A3E' },
  'Gym / Personal Training': { bg: 'rgba(230,57,70,0.1)', color: '#B71C2A' },
  'Wedding & Events Venue': { bg: 'rgba(139,105,20,0.1)', color: '#705510' },
  'Estate Agent / Property': { bg: 'rgba(43,76,140,0.1)', color: '#1E3870' },
  'Nursery / Childcare': { bg: 'rgba(232,133,10,0.1)', color: '#9A5A00' },
  'Tourism & Outdoor Activities': { bg: 'rgba(26,107,62,0.1)', color: '#125430' },
  'Independent Retail': { bg: 'rgba(91,138,90,0.1)', color: '#2D5A2C' },
}

function buildUrl(baseUrl: string, config: Partial<typeof TEMPLATES[0]['defaultConfig']> & { accent?: string }): string {
  const params = new URLSearchParams()
  if (config.name) params.set('name', config.name)
  if (config.tagline) params.set('tagline', config.tagline)
  if (config.phone) params.set('phone', config.phone)
  if (config.email) params.set('email', config.email)
  if (config.location) params.set('location', config.location)
  if (config.accent) params.set('accent', config.accent.replace('#', ''))
  const qs = params.toString()
  return qs ? `${baseUrl}?${qs}` : baseUrl
}

interface CustomiseState {
  name: string
  tagline: string
  phone: string
  email: string
  location: string
  accent: string
}

export default function AdminTemplatesClient() {
  const router = useRouter()
  const [customising, setCustomising] = useState<TemplateConfig | null>(null)
  const [form, setForm] = useState<CustomiseState>({ name: '', tagline: '', phone: '', email: '', location: '', accent: '' })
  const [copied, setCopied] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const openCustomise = (template: TemplateConfig) => {
    setCustomising(template)
    setForm({
      name: template.defaultConfig.name,
      tagline: template.defaultConfig.tagline,
      phone: template.defaultConfig.phone,
      email: template.defaultConfig.email,
      location: template.defaultConfig.location,
      accent: '',
    })
    setIframeKey(k => k + 1)
  }

  const closeCustomise = () => setCustomising(null)

  const personalisedUrl = customising
    ? buildUrl(customising.previewUrl, form)
    : ''

  const iframeSrc = customising
    ? `${personalisedUrl}${personalisedUrl.includes('?') ? '&' : '?'}hideBar=true`
    : ''

  const handleCopy = (url: string) => {
    const fullUrl = `https://nithdigital.uk${url}`
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleUseInProposal = (url?: string) => {
    const target = url || personalisedUrl
    if (!target) return
    router.push(`/admin/proposals/new?demo_url=${encodeURIComponent(target)}`)
    closeCustomise()
  }

  // Update iframe src when form changes
  useEffect(() => {
    if (iframeRef.current && iframeSrc) {
      iframeRef.current.src = iframeSrc
    }
  }, [iframeSrc])

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1B2A4A', marginBottom: 6, fontWeight: 400 }}>
          Demo Templates
        </h1>
        <p style={{ color: '#5A6A7A', fontSize: 15 }}>
          Show prospects a personalised demo of their future website. Customise with their business name, then use in a proposal.
        </p>
      </div>

      {/* Template grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {TEMPLATES.map((template) => {
          const tag = STYLE_TAGS[template.businessType] ?? { bg: 'rgba(27,42,74,0.08)', color: '#1B2A4A' }
          return (
            <div key={template.slug} style={{
              background: '#fff',
              border: '1px solid rgba(27,42,74,0.08)',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(27,42,74,0.06)',
              transition: 'box-shadow 0.2s',
            }}>
              {/* Preview thumbnail */}
              <div style={{ background: '#F5F0E6', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <iframe
                  src={`${template.previewUrl}?hideBar=true`}
                  style={{ width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: 'top left', border: 'none', pointerEvents: 'none' }}
                  title={`Preview of ${template.name}`}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0 }} /> {/* click shield */}
              </div>

              {/* Info */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1B2A4A' }}>{template.name}</h2>
                  <span style={{ background: tag.bg, color: tag.color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', marginLeft: 8 }}>{template.businessType}</span>
                </div>
                <p style={{ color: '#5A6A7A', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{template.description}</p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => window.open(template.previewUrl, '_blank')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f9f8f5', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 6, fontSize: 13, color: '#1B2A4A', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => openCustomise(template)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#1B2A4A', border: 'none', borderRadius: 6, fontSize: 13, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <Settings2 size={14} /> Customise
                  </button>
                  <button
                    onClick={() => handleCopy(template.previewUrl)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f9f8f5', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 6, fontSize: 13, color: '#1B2A4A', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <Copy size={14} /> Copy link
                  </button>
                  <button
                    onClick={() => handleUseInProposal(template.previewUrl)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(212,168,75,0.1)', border: '1px solid rgba(212,168,75,0.3)', borderRadius: 6, fontSize: 13, color: '#8A6800', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <FileSignature size={14} /> Use in proposal
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CUSTOMISE PANEL */}
      {customising && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={closeCustomise} />

          {/* Panel */}
          <div style={{ position: 'relative', marginLeft: 'auto', width: '90vw', maxWidth: 1280, height: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 48px rgba(0,0,0,0.15)' }}>
            {/* Panel header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(27,42,74,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1B2A4A' }}>Customise: {customising.name}</h2>
                <p style={{ fontSize: 13, color: '#5A6A7A', marginTop: 2 }}>Changes update the preview live as you type</p>
              </div>
              <button onClick={closeCustomise} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                <X size={20} color="#5A6A7A" />
              </button>
            </div>

            {/* Body: form + iframe */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
              {/* Form column */}
              <div style={{ width: 320, flexShrink: 0, overflowY: 'auto', padding: '24px 28px', borderRight: '1px solid rgba(27,42,74,0.08)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Business Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 14, color: '#1B2A4A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Tagline</label>
                  <input
                    value={form.tagline}
                    onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 14, color: '#1B2A4A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 14, color: '#1B2A4A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Email</label>
                  <input
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 14, color: '#1B2A4A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 14, color: '#1B2A4A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Accent Colour</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={form.accent || '#1B2A4A'}
                      onChange={e => setForm(f => ({ ...f, accent: e.target.value }))}
                      style={{ width: 44, height: 36, padding: 2, border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                    />
                    <input
                      value={form.accent}
                      onChange={e => setForm(f => ({ ...f, accent: e.target.value }))}
                      placeholder="Leave blank for default"
                      style={{ flex: 1, padding: '10px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, color: '#1B2A4A', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Generated URL */}
                <div style={{ background: '#f9f8f5', padding: 14, borderRadius: 8, marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 8, letterSpacing: '0.3px' }}>PERSONALISED URL</div>
                  <div style={{ fontSize: 12, color: '#1B2A4A', wordBreak: 'break-all', lineHeight: 1.5, marginBottom: 12 }}>
                    nithdigital.uk{personalisedUrl}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      onClick={() => handleCopy(personalisedUrl)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', background: copied ? '#2D5A2A' : '#1B2A4A', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                    >
                      {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy personalised link</>}
                    </button>
                    <button
                      onClick={() => window.open(personalisedUrl, '_blank')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', background: '#f9f8f5', color: '#1B2A4A', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <ExternalLink size={14} /> Open in new tab
                    </button>
                    <button
                      onClick={() => handleUseInProposal()}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', background: 'rgba(212,168,75,0.12)', color: '#8A6800', border: '1px solid rgba(212,168,75,0.3)', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <FileSignature size={14} /> Use in proposal
                    </button>
                  </div>
                </div>
              </div>

              {/* iframe preview */}
              <div style={{ flex: 1, background: '#e8e4dc', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ padding: '10px 16px', background: '#f0ece4', borderBottom: '1px solid rgba(27,42,74,0.08)', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
                  <div style={{ flex: 1, background: '#fff', borderRadius: 4, padding: '4px 12px', fontSize: 11, color: '#5A6A7A', marginLeft: 8 }}>
                    nithdigital.uk{iframeSrc.replace('?hideBar=true', '').replace('&hideBar=true', '')}
                  </div>
                </div>
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={iframeSrc}
                  style={{ flex: 1, border: 'none', width: '100%' }}
                  title="Template preview"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
