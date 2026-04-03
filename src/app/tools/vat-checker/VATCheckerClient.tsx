'use client'

import { useState } from 'react'
import Link from 'next/link'

const VAT_THRESHOLD = 90000

export default function VATCheckerClient() {
  const [turnover, setTurnover] = useState(60000)
  const [turnoverInput, setTurnoverInput] = useState('60000')
  const [next30Days, setNext30Days] = useState(5000)
  const [next30Input, setNext30Input] = useState('5000')
  const [trend, setTrend] = useState<'growing' | 'stable' | 'declining'>('stable')

  const handleTurnover = (v: string) => {
    setTurnoverInput(v)
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(n)) setTurnover(n)
  }

  const handleNext30 = (v: string) => {
    setNext30Input(v)
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(n)) setNext30Days(n)
  }

  const mustRegisterBackward = turnover > VAT_THRESHOLD
  const mustRegisterForward = next30Days > VAT_THRESHOLD
  const mustRegister = mustRegisterBackward || mustRegisterForward
  const gap = VAT_THRESHOLD - turnover
  const monthsToThreshold = trend === 'growing' && gap > 0 ? Math.ceil(gap / (turnover / 12)) : null
  const approaching = !mustRegister && gap > 0 && gap < 20000

  const verdict = mustRegister ? 'must' : approaching ? 'approaching' : 'fine'
  const verdictConfig = {
    must: { color: '#c0392b', bg: 'rgba(192,57,43,0.08)', icon: '🔴', title: 'You MUST register for VAT', subtitle: 'Your turnover exceeds the £90,000 threshold.' },
    approaching: { color: '#D4A84B', bg: 'rgba(212,168,75,0.1)', icon: '🟡', title: "You're approaching the VAT threshold", subtitle: `You're £${gap.toLocaleString()} below the £90,000 threshold.` },
    fine: { color: '#27ae60', bg: 'rgba(39,174,96,0.08)', icon: '🟢', title: "You don't need to register for VAT yet", subtitle: `You're £${gap.toLocaleString()} below the £90,000 threshold.` },
  }[verdict]

  const frsFlatRate = 0.12
  const frsVAT = turnover * frsFlatRate
  const standardVAT = turnover * 0.20
  const frsSaving = standardVAT - frsVAT

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }} className="vat-layout">
        <div>
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 24, fontWeight: 400 }}>Your business turnover</h2>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Annual taxable turnover (last 12 months)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A', fontWeight: 600 }}>£</span>
                <input type="text" value={turnoverInput} onChange={e => handleTurnover(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 28px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 16, fontWeight: 600, color: '#1B2A4A', fontFamily: 'inherit' }} />
              </div>
              <input type="range" min={0} max={200000} step={1000} value={turnover} onChange={e => { setTurnover(Number(e.target.value)); setTurnoverInput(String(e.target.value)) }} style={{ width: '100%', marginTop: 8 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Expected turnover in the next 30 days alone</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A', fontWeight: 600 }}>£</span>
                <input type="text" value={next30Input} onChange={e => handleNext30(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 28px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 15, color: '#1B2A4A', fontFamily: 'inherit' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>Business trend</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['growing', 'stable', 'declining'] as const).map(t => (
                  <button key={t} onClick={() => setTrend(t)} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '2px solid', borderColor: trend === t ? '#1B2A4A' : 'rgba(27,42,74,0.15)', background: trend === t ? '#1B2A4A' : 'white', color: trend === t ? '#F5F0E6' : '#5A6A7A', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div style={{ background: verdictConfig.bg, border: `2px solid ${verdictConfig.color}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{verdictConfig.icon}</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: verdictConfig.color, marginBottom: 8, fontWeight: 400 }}>{verdictConfig.title}</h2>
            <p style={{ fontSize: 15, color: '#2D4A7A', lineHeight: 1.7, marginBottom: 0 }}>{verdictConfig.subtitle}</p>
            {approaching && monthsToThreshold !== null && (
              <p style={{ fontSize: 14, color: verdictConfig.color, marginTop: 8, fontWeight: 600 }}>
                At your current rate, you could reach the threshold in approximately {monthsToThreshold} month{monthsToThreshold !== 1 ? 's' : ''}.
              </p>
            )}
            {mustRegisterForward && !mustRegisterBackward && (
              <p style={{ fontSize: 14, color: verdictConfig.color, marginTop: 8, fontWeight: 600 }}>
                Your expected turnover in the next 30 days alone (£{next30Days.toLocaleString()}) exceeds the annual threshold. You must register immediately.
              </p>
            )}
          </div>

          {/* VAT progress bar */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5A6A7A', marginBottom: 8 }}>
              <span>£0</span><span>VAT threshold: £90,000</span>
            </div>
            <div style={{ background: 'rgba(27,42,74,0.1)', borderRadius: 100, height: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 100, width: `${Math.min(100, (turnover / VAT_THRESHOLD) * 100)}%`, background: mustRegister ? '#c0392b' : approaching ? '#D4A84B' : '#27ae60', transition: 'all 0.3s ease' }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>
              Your turnover: £{turnover.toLocaleString()} ({Math.round((turnover / VAT_THRESHOLD) * 100)}% of threshold)
            </div>
          </div>

          {/* Flat Rate Scheme */}
          {turnover > 0 && (
            <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 12, fontWeight: 400 }}>VAT Flat Rate Scheme</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5A6A7A', marginBottom: 16 }}>
                If you register for VAT, the Flat Rate Scheme (FRS) can simplify your VAT returns. Instead of tracking every purchase, you pay a fixed percentage of your gross turnover. For many service businesses, this can be more profitable.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'white', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4 }}>Standard VAT collected (20%)</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A' }}>£{Math.round(standardVAT).toLocaleString()}</div>
                </div>
                <div style={{ background: 'white', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4 }}>Flat Rate paid (est. 12%)</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#27ae60' }}>£{Math.round(frsVAT).toLocaleString()}</div>
                </div>
              </div>
              {frsSaving > 0 && <p style={{ fontSize: 13, color: '#27ae60', marginTop: 12, fontWeight: 600 }}>You could potentially keep £{Math.round(frsSaving).toLocaleString()}/year with the Flat Rate Scheme.</p>}
              <p style={{ fontSize: 12, color: '#5A6A7A', marginTop: 12 }}>Note: Flat Rate Scheme percentages vary by industry. 12% is an estimate for business services.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12, fontWeight: 400 }}>VAT facts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Registration threshold', '£90,000'],
                ['Standard rate', '20%'],
                ['Reduced rate', '5%'],
                ['Zero rate', '0%'],
                ['Registration deadline', '30 days after exceeding threshold'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                  <span style={{ color: '#5A6A7A' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#1B2A4A' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: 24, color: '#F5F0E6' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 10, fontWeight: 400 }}>Free Launchpad checklist</h3>
            <p style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)', marginBottom: 16, lineHeight: 1.6 }}>
              VAT registration is one of 10 steps in our free business launch checklist.
            </p>
            <Link href="/launchpad" style={{ display: 'inline-block', padding: '8px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
              Start checklist →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .vat-layout { }
        @media (max-width: 768px) { .vat-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
