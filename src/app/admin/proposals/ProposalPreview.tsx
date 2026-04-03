'use client'

import type { ProposalForm } from './ProposalEditor'

interface Props {
  form: ProposalForm
  proposalId: string
}

export default function ProposalPreview({ form }: Props) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const allBullets = [...form.selected_services, ...form.custom_bullets.filter(Boolean)]

  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden', fontSize: 12 }}>
      <div style={{ background: '#5A6A7A', padding: '8px 12px', fontSize: 11, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
        PDF Preview
      </div>

      {/* A4 proportional preview */}
      <div style={{ padding: 0, background: '#f8f8f8', maxHeight: 700, overflowY: 'auto' }}>
        <div style={{ background: '#fff', margin: '0 auto', fontFamily: 'Arial, sans-serif', fontSize: 11 }}>

          {/* Header */}
          <div style={{ background: '#1B2A4A', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#D4A84B', width: 28, height: 28, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#1B2A4A' }}>N</div>
              <div>
                <div style={{ color: '#D4A84B', fontWeight: 700, fontSize: 13 }}>Nith Digital</div>
                <div style={{ color: 'rgba(245,240,230,0.7)', fontSize: 9 }}>Web Design & Digital Solutions</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 9, color: 'rgba(245,240,230,0.6)', lineHeight: 1.6 }}>
              nithdigital.uk<br />hello@nithdigital.uk<br />Sanquhar, DG4
            </div>
          </div>

          {/* Prepared for */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '2px solid #D4A84B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 9, color: '#5A6A7A', marginBottom: 4 }}>Prepared for</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>
                  {form.business_name || <span style={{ color: '#ccc' }}>Business Name</span>}
                </div>
                {(form.contact_name || form.contact_email) && (
                  <div style={{ fontSize: 10, color: '#5A6A7A' }}>
                    {[form.contact_name, form.contact_email].filter(Boolean).join(' · ')}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', fontSize: 9, color: '#5A6A7A', lineHeight: 1.7 }}>
                <div>{today}</div>
                <div style={{ color: '#D4A84B', fontWeight: 600 }}>Nith Digital Proposal</div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 3, height: 16, background: '#D4A84B', borderRadius: 2 }} />
              <div style={{ fontWeight: 700, fontSize: 12, color: '#1B2A4A' }}>What we&apos;d build for you</div>
            </div>
            {allBullets.length === 0 ? (
              <div style={{ color: '#ccc', fontSize: 10, paddingLeft: 12 }}>Select services from the form…</div>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {allBullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4, fontSize: 10, color: '#1B2A4A' }}>
                    <span style={{ color: '#D4A84B', marginTop: 1, flexShrink: 0 }}>●</span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pricing */}
          <div style={{ padding: '8px 16px 12px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 3, height: 16, background: '#D4A84B', borderRadius: 2 }} />
              <div style={{ fontWeight: 700, fontSize: 12, color: '#1B2A4A' }}>Investment</div>
            </div>
            {form.pricing_model === 'startup' && (
              <div style={{ background: '#F5F0E6', borderRadius: 6, padding: 10, fontSize: 10 }}>
                <div style={{ fontWeight: 600, color: '#D4A84B', marginBottom: 4 }}>Startup Bundle</div>
                <div style={{ color: '#1B2A4A' }}>£0 upfront · £40/month (12-month min, then £30/month)</div>
                <div style={{ color: '#5A6A7A' }}>Business OS: 1 month free, then £4.99/month</div>
              </div>
            )}
            {form.pricing_model === 'standard' && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(form.estimated_price_low || form.estimated_price_high) && (
                  <div style={{ background: '#F5F0E6', borderRadius: 6, padding: '8px 12px', fontSize: 10 }}>
                    <div style={{ color: '#5A6A7A', marginBottom: 2 }}>One-off build</div>
                    <div style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 13 }}>
                      {form.estimated_price_low ? `£${parseInt(form.estimated_price_low).toLocaleString('en-GB')}` : '—'}
                      {form.estimated_price_high ? ` – £${parseInt(form.estimated_price_high).toLocaleString('en-GB')}` : ''}
                    </div>
                  </div>
                )}
                {form.monthly_cost && (
                  <div style={{ background: '#F5F0E6', borderRadius: 6, padding: '8px 12px', fontSize: 10 }}>
                    <div style={{ color: '#5A6A7A', marginBottom: 2 }}>Monthly</div>
                    <div style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 13 }}>£{parseInt(form.monthly_cost).toLocaleString('en-GB')}/mo</div>
                  </div>
                )}
                {!form.estimated_price_low && !form.estimated_price_high && !form.monthly_cost && (
                  <div style={{ color: '#ccc', fontSize: 10 }}>Enter pricing details in the form…</div>
                )}
              </div>
            )}
            {form.pricing_model === 'custom' && (
              <div style={{ fontSize: 10, color: '#1B2A4A', background: '#F5F0E6', borderRadius: 6, padding: 10 }}>
                {form.notes || <span style={{ color: '#ccc' }}>Custom pricing description…</span>}
              </div>
            )}
          </div>

          {/* Personal note */}
          {form.notes && form.pricing_model !== 'custom' && (
            <div style={{ padding: '8px 16px 12px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 3, height: 16, background: '#D4A84B', borderRadius: 2 }} />
                <div style={{ fontWeight: 700, fontSize: 12, color: '#1B2A4A' }}>A note from Akin</div>
              </div>
              <div style={{ fontSize: 10, color: '#5A6A7A', fontStyle: 'italic', paddingLeft: 12 }}>
                &ldquo;{form.notes}&rdquo;
              </div>
            </div>
          )}

          {/* Demo URL */}
          {form.demo_url && (
            <div style={{ padding: '8px 16px 12px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 3, height: 16, background: '#D4A84B', borderRadius: 2 }} />
                <div style={{ fontWeight: 700, fontSize: 12, color: '#1B2A4A' }}>See a live preview</div>
              </div>
              <div style={{ fontSize: 10, color: '#3B82F6', paddingLeft: 12, textDecoration: 'underline' }}>{form.demo_url}</div>
              <div style={{ fontSize: 9, color: '#5A6A7A', paddingLeft: 12, marginTop: 2 }}>[QR code will appear here in the PDF]</div>
            </div>
          )}

          {/* Footer */}
          <div style={{ background: '#1B2A4A', padding: '10px 16px', marginTop: 4 }}>
            <div style={{ fontSize: 9, color: '#D4A84B', fontWeight: 600, marginBottom: 2 }}>Book a free consultation: nithdigital.uk/book</div>
            <div style={{ fontSize: 8, color: 'rgba(245,240,230,0.4)' }}>This proposal is valid for 30 days · Nith Digital · nithdigital.uk</div>
          </div>
        </div>
      </div>
    </div>
  )
}
