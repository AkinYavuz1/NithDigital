'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Download, Calendar, CheckCircle } from 'lucide-react'

interface Proposal {
  id: string
  business_name: string
  contact_name: string | null
  contact_email: string | null
  business_type: string
  selected_services: string[]
  custom_bullets: string[]
  pricing_model: string
  estimated_price_low: number | null
  estimated_price_high: number | null
  monthly_cost: number | null
  notes: string | null
  demo_url: string | null
  status: string
  public_token: string
  created_at: string
}

export default function PublicProposalClient({ token }: { token: string }) {
  const [proposal, setProposal] = useState<Proposal | null | undefined>(undefined)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('proposals').select('*').eq('public_token', token).single().then(async ({ data }) => {
      if (!data) { setProposal(null); return }
      setProposal(data)
      if (data.status === 'sent') {
        await supabase.from('proposals').update({ status: 'viewed', viewed_at: new Date().toISOString() }).eq('id', data.id)
      }
    })
  }, [token])

  const handleAccept = async () => {
    if (!proposal) return
    const supabase = createClient()
    await supabase.from('proposals').update({ status: 'accepted' }).eq('id', proposal.id)
    setAccepted(true)
    setProposal(prev => prev ? { ...prev, status: 'accepted' } : prev)
  }

  const handleDownloadPDF = async () => {
    if (!proposal) return
    const { generateProposalPDF } = await import('../../../admin/proposals/proposalPdf')
    await generateProposalPDF(proposal)
  }

  if (proposal === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E6' }}>
        <div style={{ fontSize: 14, color: '#5A6A7A' }}>Loading your proposal…</div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E6', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#1B2A4A' }}>Proposal not found</div>
        <div style={{ fontSize: 14, color: '#5A6A7A' }}>This proposal link may have expired or been removed.</div>
        <Link href="/" style={{ color: '#D4A84B', textDecoration: 'underline', fontSize: 14 }}>Visit nithdigital.uk</Link>
      </div>
    )
  }

  const allBullets = [...proposal.selected_services, ...proposal.custom_bullets]
  const today = new Date(proposal.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E6', fontFamily: 'var(--font-body, sans-serif)' }}>
      {/* Header */}
      <header style={{ background: '#1B2A4A', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#D4A84B', width: 36, height: 36, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#1B2A4A', fontFamily: 'var(--font-display, serif)' }}>N</div>
          <div>
            <div style={{ color: '#D4A84B', fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-display, serif)' }}>Nith Digital</div>
            <div style={{ color: 'rgba(245,240,230,0.6)', fontSize: 10 }}>Web Design & Digital Solutions</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(245,240,230,0.1)', color: '#F5F0E6', border: '1px solid rgba(245,240,230,0.2)', borderRadius: 100, cursor: 'pointer', fontSize: 13 }}>
            <Download size={13} /> Download PDF
          </button>
          <Link href="/book" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <Calendar size={13} /> Book a call
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
        {/* Prepared for */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', marginBottom: 24, boxShadow: '0 2px 12px rgba(27,42,74,0.06)' }}>
          <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 8 }}>Prepared for</p>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 32, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>{proposal.business_name}</h1>
          {(proposal.contact_name || proposal.contact_email) && (
            <p style={{ fontSize: 14, color: '#5A6A7A' }}>{[proposal.contact_name, proposal.contact_email].filter(Boolean).join(' · ')}</p>
          )}
          <p style={{ fontSize: 13, color: '#5A6A7A', marginTop: 8 }}>Prepared: {today}</p>
        </div>

        {/* Services */}
        {allBullets.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 36px', marginBottom: 24, boxShadow: '0 2px 12px rgba(27,42,74,0.06)', borderLeft: '4px solid #D4A84B' }}>
            <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 20 }}>What we&apos;d build for you</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {allBullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10, fontSize: 15, color: '#1B2A4A' }}>
                  <span style={{ color: '#D4A84B', marginTop: 2, flexShrink: 0, fontSize: 16 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pricing */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '28px 36px', marginBottom: 24, boxShadow: '0 2px 12px rgba(27,42,74,0.06)' }}>
          <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 20 }}>Your investment</h2>
          {proposal.pricing_model === 'startup' && (
            <div>
              <div style={{ background: '#F5F0E6', borderRadius: 8, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#D4A84B', marginBottom: 12 }}>Startup Bundle</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Upfront', value: '£0' },
                    { label: 'Monthly (yr 1)', value: '£40/month' },
                    { label: 'Monthly (after)', value: '£30/month' },
                  ].map(item => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A' }}>{item.value}</div>
                      <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 4 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: '#5A6A7A', marginTop: 12, marginBottom: 0 }}>
                  12-month minimum commitment. Business OS included free for the first month, then £4.99/month.
                </p>
              </div>
            </div>
          )}
          {proposal.pricing_model === 'standard' && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {(proposal.estimated_price_low || proposal.estimated_price_high) && (
                <div style={{ background: '#F5F0E6', borderRadius: 8, padding: '20px 24px', flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 8 }}>One-off build cost</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A' }}>
                    {proposal.estimated_price_low ? `£${proposal.estimated_price_low.toLocaleString('en-GB')}` : ''}
                    {proposal.estimated_price_high ? ` – £${proposal.estimated_price_high.toLocaleString('en-GB')}` : ''}
                  </div>
                </div>
              )}
              {proposal.monthly_cost && (
                <div style={{ background: '#F5F0E6', borderRadius: 8, padding: '20px 24px', flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 8 }}>Monthly hosting & support</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A' }}>£{proposal.monthly_cost.toLocaleString('en-GB')}<span style={{ fontSize: 14, fontWeight: 400 }}>/month</span></div>
                </div>
              )}
            </div>
          )}
          {proposal.pricing_model === 'custom' && proposal.notes && (
            <div style={{ fontSize: 15, color: '#1B2A4A', lineHeight: 1.7 }}>{proposal.notes}</div>
          )}
        </div>

        {/* Personal note */}
        {proposal.notes && proposal.pricing_model !== 'custom' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 36px', marginBottom: 24, boxShadow: '0 2px 12px rgba(27,42,74,0.06)', borderLeft: '4px solid #D4A84B' }}>
            <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 16 }}>A note from us</h2>
            <p style={{ fontSize: 15, color: '#5A6A7A', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>&ldquo;{proposal.notes}&rdquo;</p>
          </div>
        )}

        {/* Demo link */}
        {proposal.demo_url && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 36px', marginBottom: 24, boxShadow: '0 2px 12px rgba(27,42,74,0.06)' }}>
            <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 12 }}>See a live preview</h2>
            <a href={proposal.demo_url.startsWith('http') ? proposal.demo_url : `https://${proposal.demo_url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#D4A84B', fontSize: 16, fontWeight: 600 }}>
              {proposal.demo_url} →
            </a>
          </div>
        )}

        {/* CTA */}
        {accepted || proposal.status === 'accepted' ? (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, padding: '28px 36px', textAlign: 'center' }}>
            <CheckCircle size={40} color="#16a34a" style={{ marginBottom: 12 }} />
            <h2 style={{ fontSize: 20, color: '#16a34a', marginBottom: 8 }}>Proposal accepted!</h2>
            <p style={{ color: '#15803d', fontSize: 14 }}>Thanks for accepting. We'll be in touch shortly to get things moving.</p>
          </div>
        ) : (
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '32px 36px', textAlign: 'center', boxShadow: '0 4px 20px rgba(27,42,74,0.15)' }}>
            <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 24, fontWeight: 400, color: '#F5F0E6', marginBottom: 12 }}>Ready to get started?</h2>
            <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.7)', marginBottom: 24 }}>Accept this proposal or book a call to discuss further.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleAccept} style={{ padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Accept this proposal
              </button>
              <Link href="/book" style={{ padding: '12px 28px', background: 'rgba(245,240,230,0.1)', color: '#F5F0E6', border: '1px solid rgba(245,240,230,0.2)', borderRadius: 100, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> Book a free call
              </Link>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#5A6A7A', marginTop: 32 }}>
          This proposal is valid for 30 days · <a href="https://nithdigital.uk" style={{ color: '#D4A84B' }}>nithdigital.uk</a>
        </p>
      </main>
    </div>
  )
}
