'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Download, Calendar, Star, X, Check, AlertTriangle } from 'lucide-react'

const NAVY = '#1B2A4A'
const GOLD = '#D4A84B'
const CREAM = '#F5F0E6'
const GRAY = '#5A6A7A'

function scoreBg(score: number) {
  if (score >= 70) return { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' }
  if (score >= 40) return { bg: 'rgba(217,119,6,0.1)', color: '#D97706' }
  return { bg: 'rgba(220,38,38,0.1)', color: '#DC2626' }
}

function fmt(n: number) { return '£' + n.toLocaleString('en-GB') }

interface Dossier {
  id: string
  business_name: string
  contact_name: string | null
  sector: string
  url: string | null
  location: string | null
  audit_snapshot: {
    scores: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number }
    technology?: { platform?: string }
    checks?: { label: string; status: string }[]
    grade?: string
  } | null
  visibility_score: number | null
  visibility_answers: Record<string, boolean> | null
  local_seo_score: number | null
  social_profiles: { facebook?: string | null; instagram?: string | null; twitter?: string | null; linkedin?: string | null } | null
  google_review_count: number | null
  google_rating: number | null
  review_response_rate: number | null
  competitor_audits: { url: string; scores: { seo: number; security: number; performance: number; mobile: number; content: number; overall: number } }[] | null
  service_descriptions: Record<string, { name: string; description: string; priority: number; priceLow: number; priceHigh: number; monthlyCost?: number }> | null
  roi_projection: { monthlySearchVolume: number; conversionRate: number; avgTicketValue: number; estimatedMonthlyLeads: number; estimatedMonthlyRevenue: number; annualRevenueGain: number; paybackMonths: number } | null
  custom_stats: { stat: string; source: string }[] | null
  estimated_price_low: number | null
  estimated_price_high: number | null
  monthly_cost: number | null
  personal_note: string | null
  status: string
  public_token: string
  created_at: string
}

export default function PublicDossierClient({ token }: { token: string }) {
  const [dossier, setDossier] = useState<Dossier | null | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('dossiers').select('*').eq('public_token', token).single().then(async ({ data }) => {
      if (!data) { setDossier(null); return }
      setDossier(data)
      if (data.status === 'sent') {
        await supabase.from('dossiers').update({ status: 'viewed', viewed_at: new Date().toISOString() }).eq('id', data.id)
      }
    })
  }, [token])

  const handleDownloadPDF = async () => {
    if (!dossier) return
    const { generateDossierPDF } = await import('../../../admin/dossier/dossierPdf')
    await generateDossierPDF(dossier as unknown as Parameters<typeof generateDossierPDF>[0])
  }

  if (dossier === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: CREAM }}>
        <div style={{ fontSize: 14, color: GRAY }}>Loading your report...</div>
      </div>
    )
  }

  if (dossier === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: CREAM }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: NAVY, fontSize: 20 }}>Report not found</h2>
          <p style={{ color: GRAY, fontSize: 14 }}>This link may have expired.</p>
          <Link href="https://nithdigital.uk" style={{ color: GOLD, fontSize: 14 }}>Visit Nith Digital</Link>
        </div>
      </div>
    )
  }

  const scores = dossier.audit_snapshot?.scores
  const visScore = dossier.visibility_score ?? 0
  const seoScore = dossier.local_seo_score ?? 0
  const socials = dossier.social_profiles || {}

  return (
    <div style={{ minHeight: '100vh', background: CREAM }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: NAVY, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>Nith Digital</span>
          <span style={{ color: 'rgba(245,240,230,0.4)', fontSize: 13, marginLeft: 12 }}>Digital Health Report</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleDownloadPDF} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(245,240,230,0.1)', color: CREAM, borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            <Download size={13} /> Download PDF
          </button>
          <Link href="https://nithdigital.uk/book" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: GOLD, color: NAVY, borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            <Calendar size={13} /> Book a Call
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>

        {/* COVER */}
        <section style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: GOLD, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Digital Health Report</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>{dossier.business_name}</h1>
          {dossier.location && <p style={{ fontSize: 15, color: GRAY, margin: 0 }}>{dossier.location}</p>}
          <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 20, background: 'rgba(212,168,75,0.15)', color: '#B8860B', fontSize: 12, fontWeight: 600, marginTop: 8 }}>{dossier.sector}</div>
          <p style={{ fontSize: 12, color: GRAY, marginTop: 16 }}>
            Prepared by Akin Yavuz — Nith Digital · {new Date(dossier.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </section>

        {/* WEBSITE ASSESSMENT */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>Website Assessment</h2>
          {!scores ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <AlertTriangle size={36} color="#DC2626" />
              <h3 style={{ fontSize: 20, color: '#DC2626', marginTop: 12 }}>No Website Found</h3>
              <p style={{ color: GRAY, maxWidth: 400, margin: '8px auto 0' }}>80% of customers Google a business before visiting. Without a website, you are invisible to the majority of potential clients.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 56, fontWeight: 700, color: scoreBg(scores.overall).color }}>{scores.overall}</div>
                  <div style={{ fontSize: 13, color: GRAY }}>Overall Score</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: scoreBg(scores.overall).color }}>Grade {dossier.audit_snapshot?.grade || 'F'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {(['seo', 'security', 'performance', 'mobile', 'content'] as const).map(cat => {
                  const s = scores[cat]
                  const c = scoreBg(s)
                  return (
                    <div key={cat} style={{ textAlign: 'center', padding: 12, borderRadius: 8, background: c.bg }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{s}</div>
                      <div style={{ fontSize: 10, color: GRAY, textTransform: 'capitalize' }}>{cat}</div>
                    </div>
                  )
                })}
              </div>
              {dossier.audit_snapshot?.technology?.platform && (
                <div style={{ marginTop: 12, fontSize: 12, color: GRAY }}>Platform: <strong>{dossier.audit_snapshot.technology.platform}</strong></div>
              )}
              {dossier.audit_snapshot?.checks && dossier.audit_snapshot.checks.filter(c => c.status === 'fail').length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Issues Found:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {dossier.audit_snapshot.checks.filter(c => c.status === 'fail').slice(0, 8).map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <X size={12} color="#DC2626" />
                        <span style={{ fontSize: 12, color: NAVY }}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* VISIBILITY & SEO */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>Google Visibility & Local SEO</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
            <div style={{ textAlign: 'center', padding: 20, borderRadius: 10, background: scoreBg(visScore).bg }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: scoreBg(visScore).color }}>{visScore}%</div>
              <div style={{ fontSize: 12, color: GRAY }}>Google Visibility</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: scoreBg(visScore).color }}>
                {visScore >= 80 ? 'Highly Visible' : visScore >= 50 ? 'Moderate' : visScore >= 25 ? 'Low' : 'Virtually Invisible'}
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: 20, borderRadius: 10, background: scoreBg(seoScore).bg }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: scoreBg(seoScore).color }}>{seoScore}%</div>
              <div style={{ fontSize: 12, color: GRAY }}>Local SEO</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: scoreBg(seoScore).color }}>
                {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : seoScore >= 40 ? 'Needs Work' : 'Critical'}
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL & REVIEWS */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>Social Media & Reviews</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Social Presence</div>
              {(['facebook', 'instagram', 'twitter', 'linkedin'] as const).map(p => (
                <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <span style={{ fontSize: 13, color: NAVY, textTransform: 'capitalize' }}>{p}</span>
                  {(socials as Record<string, string | null>)[p] ? (
                    <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Active</span>
                  ) : (
                    <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>Not found</span>
                  )}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Google Reviews</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: dossier.google_review_count && dossier.google_review_count >= 10 ? '#16a34a' : dossier.google_review_count && dossier.google_review_count >= 5 ? GOLD : '#DC2626' }}>
                {dossier.google_review_count ?? 0} <span style={{ fontSize: 14, color: GRAY }}>reviews</span>
              </div>
              {dossier.google_rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <Star size={14} color={GOLD} fill={GOLD} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{dossier.google_rating}</span>
                  <span style={{ fontSize: 12, color: GRAY }}>average</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COST OF INACTION */}
        {dossier.roi_projection && (
          <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>What This Is Costing You</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.12)' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#DC2626' }}>~{dossier.roi_projection.estimatedMonthlyLeads}</div>
                <div style={{ fontSize: 11, color: GRAY }}>missed leads/month</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.12)' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#DC2626' }}>{fmt(dossier.roi_projection.estimatedMonthlyRevenue)}</div>
                <div style={{ fontSize: 11, color: GRAY }}>missed revenue/month</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.12)' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#DC2626' }}>{fmt(dossier.roi_projection.annualRevenueGain)}</div>
                <div style={{ fontSize: 11, color: GRAY }}>lost over 12 months</div>
              </div>
            </div>
            {dossier.custom_stats && dossier.custom_stats.length > 0 && (
              <div>
                {dossier.custom_stats.slice(0, 4).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 13, color: NAVY }}>{s.stat}</span>
                      <span style={{ fontSize: 11, color: GRAY, marginLeft: 6 }}>— {s.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* COMPETITOR COMPARISON */}
        {dossier.competitor_audits && dossier.competitor_audits.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>Competitor Comparison</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(27,42,74,0.03)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: GRAY }}>Category</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: GOLD, fontWeight: 700 }}>Your Site</th>
                    {dossier.competitor_audits.map((c, i) => (
                      <th key={i} style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: GRAY }}>
                        {(() => { try { return new URL(c.url).hostname.replace('www.', '') } catch { return c.url } })()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['overall', 'seo', 'performance', 'mobile', 'security', 'content'] as const).map(cat => (
                    <tr key={cat} style={{ borderTop: '1px solid rgba(27,42,74,0.06)' }}>
                      <td style={{ padding: '8px 12px', textTransform: 'capitalize' }}>{cat}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: scores ? scoreBg(scores[cat]).color : GRAY }}>{scores ? scores[cat] : '—'}</td>
                      {dossier.competitor_audits!.map((c, i) => (
                        <td key={i} style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: scoreBg(c.scores[cat]).color }}>{c.scores[cat]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* RECOMMENDED SOLUTION */}
        {dossier.service_descriptions && Object.keys(dossier.service_descriptions).length > 0 && (
          <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>What We Would Build</h2>
            {Object.values(dossier.service_descriptions).sort((a, b) => a.priority - b.priority).map(svc => (
              <div key={svc.name} style={{ padding: '14px 16px', borderRadius: 8, marginBottom: 8, background: svc.priority === 1 ? 'rgba(212,168,75,0.06)' : 'rgba(27,42,74,0.02)', borderLeft: `3px solid ${svc.priority === 1 ? GOLD : 'rgba(27,42,74,0.1)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{svc.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: svc.priority === 1 ? 'rgba(212,168,75,0.15)' : 'rgba(27,42,74,0.06)', color: svc.priority === 1 ? '#B8860B' : GRAY }}>
                    {svc.priority === 1 ? 'Must-have' : svc.priority === 2 ? 'Should-have' : 'Nice-to-have'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>{svc.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* INVESTMENT & ROI */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>Investment & Returns</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ padding: 20, borderRadius: 10, background: 'rgba(27,42,74,0.03)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Your Investment</div>
              {dossier.estimated_price_low && dossier.estimated_price_high && (
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{fmt(dossier.estimated_price_low)} – {fmt(dossier.estimated_price_high)}</div>
              )}
              <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>one-off build cost</div>
              {dossier.monthly_cost && (
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{fmt(dossier.monthly_cost)}</span>
                  <span style={{ fontSize: 12, color: GRAY }}>/month</span>
                </div>
              )}
            </div>
            {dossier.roi_projection && (
              <div style={{ padding: 20, borderRadius: 10, background: 'rgba(22,163,74,0.04)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Expected Returns</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>~{dossier.roi_projection.estimatedMonthlyLeads} new leads/month</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a', marginTop: 4 }}>{fmt(dossier.roi_projection.estimatedMonthlyRevenue)} revenue/month</div>
                <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(22,163,74,0.1)' }}>
                  <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Payback: ~{dossier.roi_projection.paybackMonths} month{dossier.roi_projection.paybackMonths !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 12, padding: '8px 14px', borderRadius: 6, background: 'rgba(27,42,74,0.03)', fontSize: 12, color: GRAY, fontStyle: 'italic' }}>
            Agencies typically charge £2,000–£10,000 for a comparable build
          </div>
        </section>

        {/* WHY NITH DIGITAL */}
        <section style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(27,42,74,0.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>Why Nith Digital</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { title: 'Local to D&G', desc: 'Based in Sanquhar — we understand the local market' },
              { title: 'Transparent Pricing', desc: 'No hidden fees, no surprises' },
              { title: 'Direct Access', desc: 'Talk to the developer, not a call centre' },
              { title: 'No Lock-In', desc: 'No long-term contracts. You own your site' },
            ].map(item => (
              <div key={item.title} style={{ padding: 14, borderRadius: 8, background: 'rgba(27,42,74,0.02)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PERSONAL NOTE */}
        {dossier.personal_note && (
          <section style={{ background: 'rgba(212,168,75,0.08)', borderRadius: 12, padding: 28, marginBottom: 24, border: '1px solid rgba(212,168,75,0.15)' }}>
            <div style={{ fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 8 }}>A personal note</div>
            <div style={{ fontSize: 14, color: NAVY, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{dossier.personal_note}</div>
          </section>
        )}

        {/* CTA */}
        <section style={{ background: GOLD, borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>Ready to get started?</h2>
          <p style={{ fontSize: 14, color: 'rgba(27,42,74,0.7)', margin: '0 0 20px' }}>Book a free 15-minute consultation to discuss your options</p>
          <Link href="https://nithdigital.uk/book" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: NAVY, color: CREAM, borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            <Calendar size={16} /> Book a Call
          </Link>
          <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(27,42,74,0.5)' }}>
            hello@nithdigital.uk · nithdigital.uk
          </div>
        </section>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(27,42,74,0.3)', paddingBottom: 20 }}>
          This report is valid for 30 days · Nith Digital · nithdigital.uk
        </div>
      </div>
    </div>
  )
}
