'use client'

import { useState } from 'react'
import Link from 'next/link'

const BANDS = [
  { from: 0, to: 145000, rate: 0 },
  { from: 145000, to: 250000, rate: 0.02 },
  { from: 250000, to: 325000, rate: 0.05 },
  { from: 325000, to: 750000, rate: 0.1 },
  { from: 750000, to: Infinity, rate: 0.12 },
]

const FTB_THRESHOLD = 175000

interface CalcResult {
  tax: number
  ads: number
  breakdown: { label: string; amount: number }[]
}

function calcLBTT(price: number, isAdditional: boolean, isFirstTimeBuyer: boolean): CalcResult {
  let tax = 0
  const breakdown: { label: string; amount: number }[] = []

  const nilRateThreshold = isFirstTimeBuyer && price <= 250000 ? FTB_THRESHOLD : 145000

  for (const band of BANDS) {
    const effectiveFrom = Math.max(band.from, nilRateThreshold)
    if (price <= effectiveFrom) continue
    const taxable = Math.min(price, band.to) - effectiveFrom
    if (taxable <= 0) continue
    const effectiveRate = band.from < nilRateThreshold ? 0 : band.rate
    const amount = taxable * effectiveRate
    tax += amount
    if (amount > 0) {
      breakdown.push({
        label: `${(band.rate * 100).toFixed(0)}% on £${effectiveFrom.toLocaleString()}–£${Math.min(price, band.to).toLocaleString()}`,
        amount,
      })
    }
  }

  const ads = isAdditional ? price * 0.06 : 0

  return { tax: Math.round(tax), ads: Math.round(ads), breakdown }
}

function fmt(n: number) {
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LBTT Calculator 2026 — Scottish Stamp Duty Calculator',
  description: 'Calculate Land and Buildings Transaction Tax (LBTT) for Scottish property purchases.',
  url: 'https://nithdigital.uk/tools/lbtt-calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  provider: { '@type': 'Organization', name: 'Nith Digital', url: 'https://nithdigital.uk' },
}

export default function LBTTCalculatorClient() {
  const [price, setPrice] = useState('')
  const [isAdditional, setIsAdditional] = useState(false)
  const [isFTB, setIsFTB] = useState(false)

  const priceNum = parseFloat(price.replace(/,/g, '')) || 0
  const result = priceNum > 0 ? calcLBTT(priceNum, isAdditional, isFTB) : null
  const total = result ? result.tax + result.ads : 0
  const effectiveRate = priceNum > 0 && result ? ((total / priceNum) * 100).toFixed(2) : '0'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ background: '#1B2A4A', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 12, fontWeight: 600 }}>
            Free tool · Scottish property
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E6', fontWeight: 400, marginBottom: 12 }}>
            LBTT Calculator 2026
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,240,230,0.7)' }}>
            Calculate your Land and Buildings Transaction Tax for a Scottish property purchase.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>
            Purchase price (£)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9,]/g, ''))}
            placeholder="e.g. 250000"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 16,
              border: '1px solid rgba(27,42,74,0.2)',
              borderRadius: 8,
              outline: 'none',
              boxSizing: 'border-box' as const,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={isFTB}
              onChange={(e) => setIsFTB(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            First-time buyer
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={isAdditional}
              onChange={(e) => setIsAdditional(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            Additional dwelling (buy-to-let / second home)
          </label>
        </div>

        {result && priceNum > 0 && (
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 28, marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isAdditional ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 4 }}>LBTT</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#1B2A4A' }}>{fmt(result.tax)}</div>
              </div>
              {isAdditional && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 4 }}>ADS (6%)</div>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#1B2A4A' }}>{fmt(result.ads)}</div>
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 4 }}>Total tax</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#D4A84B' }}>{fmt(total)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 4 }}>Effective rate</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#1B2A4A' }}>{effectiveRate}%</div>
              </div>
            </div>

            {result.breakdown.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(27,42,74,0.1)', paddingTop: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#5A6A7A', marginBottom: 10 }}>Breakdown</div>
                {result.breakdown.map((b) => (
                  <div key={b.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#1B2A4A', marginBottom: 4 }}>
                    <span>{b.label}</span>
                    <span style={{ fontWeight: 600 }}>{fmt(b.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: 13, lineHeight: 1.7, color: '#5A6A7A', marginBottom: 24 }}>
          <p style={{ marginBottom: 12 }}>
            <strong style={{ color: '#1B2A4A' }}>LBTT bands (2026):</strong> 0% up to £145,000 · 2% on £145,001–£250,000 · 5% on £250,001–£325,000 · 10% on £325,001–£750,000 · 12% above £750,000
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong style={{ color: '#1B2A4A' }}>First-time buyers:</strong> No LBTT on properties up to £175,000. Standard rates apply above this.
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong style={{ color: '#1B2A4A' }}>ADS:</strong> 6% on the full purchase price for additional residential properties.
          </p>
        </div>

        <p style={{ fontSize: 12, color: '#5A6A7A', fontStyle: 'italic', marginBottom: 24 }}>
          This calculator provides an estimate only. Always confirm your LBTT liability with your solicitor.{' '}
          <Link href="/blog/lbtt-rates-2026-scotland" style={{ color: '#D4A84B' }}>
            Read our full guide to LBTT rates in 2026 →
          </Link>
        </p>
      </section>
    </>
  )
}
