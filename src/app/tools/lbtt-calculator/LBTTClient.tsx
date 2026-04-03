'use client'

import { useState } from 'react'
import Link from 'next/link'

// LBTT Residential bands 2025/26
const RESIDENTIAL_BANDS = [
  { threshold: 145000, rate: 0 },
  { threshold: 250000, rate: 0.02 },
  { threshold: 325000, rate: 0.05 },
  { threshold: 750000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 },
]

const FTB_BANDS = [
  { threshold: 175000, rate: 0 },
  { threshold: 250000, rate: 0.02 },
  { threshold: 325000, rate: 0.05 },
  { threshold: 750000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 },
]

// England SDLT residential bands
const SDLT_BANDS = [
  { threshold: 250000, rate: 0 },
  { threshold: 925000, rate: 0.05 },
  { threshold: 1500000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 },
]

function calcTax(price: number, bands: typeof RESIDENTIAL_BANDS) {
  let tax = 0
  const breakdown: { band: string; amount: number; tax: number }[] = []
  let prev = 0
  for (const band of bands) {
    if (price <= prev) break
    const taxable = Math.min(price, band.threshold) - prev
    const t = taxable * band.rate
    breakdown.push({
      band: band.threshold === Infinity ? `Over £${(prev).toLocaleString()}` : `£${prev.toLocaleString()} – £${band.threshold.toLocaleString()}`,
      amount: taxable,
      tax: t,
    })
    tax += t
    prev = band.threshold
  }
  return { tax, breakdown }
}

function fmt(n: number) {
  return `£${Math.round(n).toLocaleString()}`
}

export default function LBTTClient() {
  const [price, setPrice] = useState(250000)
  const [priceInput, setPriceInput] = useState('250000')
  const [ftb, setFtb] = useState(false)
  const [ads, setAds] = useState(false)

  const bands = ftb ? FTB_BANDS : RESIDENTIAL_BANDS
  const { tax: lbtt, breakdown } = calcTax(price, bands)
  const adsTax = ads ? price * 0.06 : 0
  const total = lbtt + adsTax
  const effectiveRate = price > 0 ? (total / price) * 100 : 0

  const { tax: sdlt } = calcTax(price, SDLT_BANDS)
  const saving = sdlt - lbtt

  const handlePriceChange = (val: string) => {
    setPriceInput(val)
    const n = parseInt(val.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(n) && n >= 0) setPrice(n)
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }} className="lbtt-layout">
        {/* Calculator */}
        <div>
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 24, fontWeight: 400 }}>Property details</h2>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Purchase price</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A', fontWeight: 600 }}>£</span>
                <input
                  type="text"
                  value={priceInput}
                  onChange={e => handlePriceChange(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 28px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 16, fontWeight: 600, color: '#1B2A4A', fontFamily: 'inherit' }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={2000000}
                step={5000}
                value={price}
                onChange={e => { setPrice(Number(e.target.value)); setPriceInput(String(e.target.value)) }}
                style={{ width: '100%', marginTop: 10 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>
                <span>£0</span><span>£2,000,000</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={ftb} onChange={e => setFtb(e.target.checked)} style={{ width: 16, height: 16 }} />
                <span><strong>First-time buyer</strong> — 0% on first £175,000</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={ads} onChange={e => setAds(e.target.checked)} style={{ width: 16, height: 16 }} />
                <span><strong>Additional Dwelling Supplement</strong> — +6% (second home or buy-to-let)</span>
              </label>
            </div>
          </div>

          {/* Results */}
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: 32, color: '#F5F0E6', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>LBTT</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#D4A84B' }}>{fmt(lbtt)}</div>
              </div>
              {ads && (
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>ADS (6%)</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#D4A84B' }}>{fmt(adsTax)}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Total tax</div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>{fmt(total)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Effective rate</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{effectiveRate.toFixed(2)}%</div>
              </div>
            </div>

            {/* Breakdown table */}
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'rgba(245,240,230,0.7)' }}>Tax breakdown by band</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Band', 'Taxable amount', 'Rate', 'Tax'].map(h => (
                    <th key={h} style={{ padding: '6px 0', textAlign: 'left', fontSize: 11, color: 'rgba(245,240,230,0.5)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breakdown.filter(b => b.amount > 0).map((b, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', fontSize: 12, color: 'rgba(245,240,230,0.8)' }}>{b.band}</td>
                    <td style={{ padding: '8px 0' }}>{fmt(b.amount)}</td>
                    <td style={{ padding: '8px 0', color: '#D4A84B' }}>
                      {(RESIDENTIAL_BANDS.find(rb => b.band.includes(rb.threshold.toLocaleString()))?.rate || 0) * 100}%
                    </td>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>{fmt(b.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* England comparison */}
          {price > 0 && (
            <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12, fontWeight: 400 }}>🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs 🏴󠁧󠁢󠁥󠁮󠁧󠁿 — Scottish LBTT vs England SDLT</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'white', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4 }}>Scottish LBTT</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A' }}>{fmt(lbtt)}</div>
                </div>
                <div style={{ background: 'white', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4 }}>England SDLT</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A' }}>{fmt(sdlt)}</div>
                </div>
              </div>
              {saving !== 0 && (
                <p style={{ fontSize: 13, color: saving > 0 ? '#27ae60' : '#c0392b', marginTop: 12, fontWeight: 600 }}>
                  {saving > 0 ? `✓ Buying in Scotland saves you ${fmt(saving)} vs England` : `Buying in Scotland costs ${fmt(Math.abs(saving))} more vs England`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12, fontWeight: 400 }}>LBTT rates 2025/26</h3>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.1)' }}>
                  <th style={{ padding: '6px 0', textAlign: 'left', color: '#5A6A7A' }}>Band</th>
                  <th style={{ padding: '6px 0', textAlign: 'right', color: '#5A6A7A' }}>Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['£0 – £145,000', '0%'],
                  ['£145,001 – £250,000', '2%'],
                  ['£250,001 – £325,000', '5%'],
                  ['£325,001 – £750,000', '10%'],
                  ['Over £750,000', '12%'],
                ].map(([band, rate]) => (
                  <tr key={band} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                    <td style={{ padding: '8px 0', color: '#1B2A4A' }}>{band}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#1B2A4A' }}>{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: 24, color: '#F5F0E6' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 10, fontWeight: 400 }}>Starting a business?</h3>
            <p style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)', marginBottom: 16, lineHeight: 1.6 }}>
              Our free Launchpad checklist walks you through everything you need to launch in D&G.
            </p>
            <Link href="/launchpad" style={{ display: 'inline-block', padding: '8px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
              Start the checklist →
            </Link>
          </div>
        </div>
      </div>

      {/* SEO content */}
      <div style={{ maxWidth: 720, marginTop: 64 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, marginBottom: 20 }}>What is LBTT?</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#2D4A7A', marginBottom: 16 }}>
          Land and Buildings Transaction Tax (LBTT) is the Scottish equivalent of Stamp Duty Land Tax (SDLT) in England. It was introduced in April 2015 and is administered by Revenue Scotland. LBTT applies to most residential and commercial property transactions in Scotland where the purchase price exceeds a certain threshold.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#2D4A7A', marginBottom: 16 }}>
          Unlike the old stamp duty which applied a flat rate to the entire purchase price, LBTT is a progressive tax — like income tax. You only pay each rate on the portion of the purchase price within that band. This means most buyers pay less than they would have under the old system.
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 16, marginTop: 40 }}>First-time buyer relief</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#2D4A7A', marginBottom: 16 }}>
          First-time buyers in Scotland benefit from a higher nil-rate band of £175,000 (compared to £145,000 for other buyers). This means no LBTT is payable on properties up to £175,000. Above that, the standard rates apply from the £175,001 threshold.
        </p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 16, marginTop: 40 }}>Additional Dwelling Supplement (ADS)</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#2D4A7A', marginBottom: 16 }}>
          If you&apos;re buying a second home or a buy-to-let property, you&apos;ll pay an Additional Dwelling Supplement (ADS) of 6% on the entire purchase price. This is on top of any LBTT payable. The ADS also applies to companies buying residential property.
        </p>

        <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24, marginTop: 40 }}>
          <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.7 }}>
            <strong>Disclaimer:</strong> This calculator is for guidance only and should not be relied upon as legal or tax advice. LBTT rates may change. Always confirm with Revenue Scotland or a qualified solicitor before completing a property transaction. Last updated: April 2025.
          </p>
        </div>
      </div>

      <style>{`
        .lbtt-layout { }
        @media (max-width: 768px) { .lbtt-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
