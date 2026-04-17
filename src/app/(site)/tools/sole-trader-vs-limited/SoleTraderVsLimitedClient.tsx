'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Link from 'next/link'

const PA = 12570
const BASIC_RATE_LIMIT = 50270
const HIGHER_RATE_LIMIT = 125140
const NI_CLASS2_RATE = 3.45
const NI_CLASS4_LOWER = 12570
const NI_CLASS4_UPPER = 50270
const NI_CLASS4_RATE_LOW = 0.09
const NI_CLASS4_RATE_HIGH = 0.02
const CORP_TAX_RATE_LOW = 0.19
const CORP_TAX_RATE_HIGH = 0.25
const CORP_TAX_THRESHOLD_LOW = 50000
const CORP_TAX_THRESHOLD_HIGH = 250000
const DIVIDEND_ALLOWANCE = 500
const DIV_BASIC_RATE = 0.0875
const DIV_HIGHER_RATE = 0.3375
const EMPLOYERS_NI_THRESHOLD = 9100
const EMPLOYERS_NI_RATE = 0.138

function calcIncomeTax(income: number): number {
  let tax = 0
  const taxable = Math.max(0, income - PA)
  const basic = Math.min(taxable, BASIC_RATE_LIMIT - PA)
  tax += basic * 0.20
  if (income > BASIC_RATE_LIMIT) {
    const higher = Math.min(income, HIGHER_RATE_LIMIT) - BASIC_RATE_LIMIT
    tax += higher * 0.40
  }
  if (income > HIGHER_RATE_LIMIT) {
    tax += (income - HIGHER_RATE_LIMIT) * 0.45
  }
  return Math.max(0, tax)
}

function calcSoleTraderTax(profit: number) {
  const incomeTax = calcIncomeTax(profit)
  const class2 = profit > NI_CLASS4_LOWER ? NI_CLASS2_RATE * 52 : 0
  let class4 = 0
  if (profit > NI_CLASS4_LOWER) {
    class4 += Math.min(profit, NI_CLASS4_UPPER) - NI_CLASS4_LOWER
    class4 = class4 * NI_CLASS4_RATE_LOW
  }
  if (profit > NI_CLASS4_UPPER) {
    class4 += (profit - NI_CLASS4_UPPER) * NI_CLASS4_RATE_HIGH
  }
  const totalTax = incomeTax + class2 + class4
  return { incomeTax, class2, class4, totalTax, takeHome: profit - totalTax }
}

function calcLimitedTax(profit: number) {
  // Optimal salary = NI threshold
  const salary = Math.min(profit, EMPLOYERS_NI_THRESHOLD)
  const employersNI = Math.max(0, (salary - EMPLOYERS_NI_THRESHOLD) * EMPLOYERS_NI_RATE)
  const profitAfterSalary = profit - salary - employersNI

  // Corporation tax
  let corpTax = 0
  if (profitAfterSalary <= CORP_TAX_THRESHOLD_LOW) {
    corpTax = profitAfterSalary * CORP_TAX_RATE_LOW
  } else if (profitAfterSalary >= CORP_TAX_THRESHOLD_HIGH) {
    corpTax = profitAfterSalary * CORP_TAX_RATE_HIGH
  } else {
    // Marginal relief
    const marginalFraction = 3 / 200
    const fullCorpTax = profitAfterSalary * CORP_TAX_RATE_HIGH
    const marginalRelief = (CORP_TAX_THRESHOLD_HIGH - profitAfterSalary) * marginalFraction
    corpTax = fullCorpTax - marginalRelief
  }

  const dividendAvailable = profitAfterSalary - corpTax
  // Personal income tax on salary
  const salaryTax = calcIncomeTax(salary)
  // Dividend tax
  const dividendIncome = dividendAvailable
  const dividendTaxable = Math.max(0, dividendIncome - DIVIDEND_ALLOWANCE)
  const totalPersonalIncome = salary + dividendIncome
  let dividendTax = 0
  if (totalPersonalIncome > BASIC_RATE_LIMIT) {
    dividendTax = dividendTaxable * DIV_HIGHER_RATE
  } else {
    dividendTax = dividendTaxable * DIV_BASIC_RATE
  }

  const totalTax = salaryTax + corpTax + dividendTax + employersNI
  const takeHome = salary - salaryTax + dividendAvailable - dividendTax

  return { salaryTax, corpTax, dividendTax, employersNI, totalTax, takeHome, salary, dividendAvailable }
}

function fmt(n: number) {
  return `£${Math.round(n).toLocaleString()}`
}

export default function SoleTraderVsLimitedClient() {
  const [profit, setProfit] = useState(50000)
  const [profitInput, setProfitInput] = useState('50000')
  const [reinvest, setReinvest] = useState(false)
  const [investment, setInvestment] = useState(false)

  const handleProfit = (v: string) => {
    setProfitInput(v)
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(n)) setProfit(n)
  }

  const st = calcSoleTraderTax(profit)
  const ltd = calcLimitedTax(profit)
  const saving = st.totalTax - ltd.totalTax

  const chartData = [
    { name: 'Sole Trader', 'Total tax': Math.round(st.totalTax), 'Take-home': Math.round(st.takeHome) },
    { name: 'Limited Co', 'Total tax': Math.round(ltd.totalTax), 'Take-home': Math.round(ltd.takeHome) },
  ]

  const COMPARISON = [
    ['Setup cost', 'Free', '~£50 (Companies House)'],
    ['Annual filing', 'Self Assessment only', 'Accounts + Confirmation Statement + CT600'],
    ['Tax on profits', fmt(st.totalTax), fmt(ltd.totalTax)],
    ['Take-home pay', fmt(st.takeHome), fmt(ltd.takeHome)],
    ['Personal liability', 'Unlimited', 'Limited to share capital'],
    ['Admin burden', 'Low', 'Higher'],
    ['Raising investment', 'Difficult', 'Easier (issue shares)'],
    ['Credibility', 'Personal name', 'Company name'],
  ]

  const recommendation = () => {
    if (profit < 30000) return { text: `At £${profit.toLocaleString()} profit, a sole trader structure is almost certainly simpler and more tax-efficient. The admin savings outweigh any tax benefit from going limited at this level.`, verdict: 'sole-trader' }
    if (profit > 100000 || reinvest) return { text: `At £${profit.toLocaleString()} profit${reinvest ? ' with reinvestment' : ''}, a limited company could save you ${fmt(Math.abs(saving))} per year in tax. The additional admin is worthwhile at this level.`, verdict: 'limited' }
    if (saving > 2000) return { text: `At £${profit.toLocaleString()} profit, you could save approximately ${fmt(saving)} per year by operating as a limited company. Whether this is worth the extra admin depends on your circumstances.`, verdict: 'limited' }
    return { text: `At £${profit.toLocaleString()} profit, the tax difference is relatively small (${fmt(Math.abs(saving))}). Consider whether the extra admin of a limited company is worth it at this stage.`, verdict: 'sole-trader' }
  }

  const rec = recommendation()

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }} className="ltd-layout">
        <div>
          <div style={{ background: '#FAF8F5', borderRadius: 12, padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 24, fontWeight: 400 }}>Your situation</h2>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>Expected annual profit</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7A7A7A', fontWeight: 600 }}>£</span>
                <input type="text" value={profitInput} onChange={e => handleProfit(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 28px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, fontSize: 16, fontWeight: 600, color: '#1A1A1A', fontFamily: 'inherit' }} />
              </div>
              <input type="range" min={0} max={300000} step={1000} value={profit} onChange={e => { setProfit(Number(e.target.value)); setProfitInput(String(e.target.value)) }} style={{ width: '100%', marginTop: 8 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={reinvest} onChange={e => setReinvest(e.target.checked)} style={{ width: 16, height: 16 }} />
                <span>I plan to reinvest most profits back into the business</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={investment} onChange={e => setInvestment(e.target.checked)} style={{ width: 16, height: 16 }} />
                <span>I plan to raise investment in the next 2 years</span>
              </label>
            </div>
          </div>

          {/* Chart */}
          <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 20, fontWeight: 400 }}>Tax comparison at £{profit.toLocaleString()} profit</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ left: -10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => fmt(Number(v ?? 0))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Total tax" fill="#c0392b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Take-home" fill="#27ae60" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendation */}
          <div style={{ background: rec.verdict === 'limited' ? 'rgba(0,0,0,0.04)' : 'rgba(232,93,58,0.1)', border: `2px solid ${rec.verdict === 'limited' ? '#1A1A1A' : '#E85D3A'}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#7A7A7A', marginBottom: 8 }}>Recommendation</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 10, fontWeight: 400 }}>
              {rec.verdict === 'limited' ? '🏢 Limited company may be worth considering' : '👤 Sole trader is likely the right choice'}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333333' }}>{rec.text}</p>
            {investment && <p style={{ fontSize: 14, color: '#1A1A1A', marginTop: 8, fontWeight: 600 }}>⚡ If you plan to raise investment, a limited company is essentially required — investors expect to receive shares.</p>}
            <p style={{ fontSize: 12, color: '#7A7A7A', marginTop: 12, fontStyle: 'italic' }}>This is a simplified illustration. Speak to an accountant for advice tailored to your situation.</p>
          </div>

          {/* Comparison table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#1A1A1A' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#FAF8F5', fontSize: 12, fontWeight: 600 }}></th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#FAF8F5', fontSize: 12, fontWeight: 600 }}>Sole Trader</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#E85D3A', fontSize: 12, fontWeight: 600 }}>Limited Company</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([label, stVal, ltdVal]) => (
                  <tr key={label} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1A1A1A', background: '#FAF8F5', fontSize: 12 }}>{label}</td>
                    <td style={{ padding: '12px 16px' }}>{stVal}</td>
                    <td style={{ padding: '12px 16px' }}>{ltdVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#FAF8F5', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, fontWeight: 400 }}>Sole Trader breakdown</h3>
            {[
              ['Income tax', fmt(st.incomeTax)],
              ['NI Class 2', fmt(st.class2)],
              ['NI Class 4', fmt(st.class4)],
              ['Total tax', fmt(st.totalTax)],
              ['Take-home', fmt(st.takeHome)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', fontSize: 13 }}>
                <span style={{ color: '#7A7A7A' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#FAF8F5', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, fontWeight: 400 }}>Limited Co breakdown</h3>
            {[
              ['Corporation tax', fmt(ltd.corpTax)],
              ['Income tax on salary', fmt(ltd.salaryTax)],
              ['Dividend tax', fmt(ltd.dividendTax)],
              ['Total tax', fmt(ltd.totalTax)],
              ['Take-home', fmt(ltd.takeHome)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', fontSize: 13 }}>
                <span style={{ color: '#7A7A7A' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#1A1A1A', borderRadius: 12, padding: 24, color: '#FAF8F5' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 10, fontWeight: 400 }}>Starting a business?</h3>
            <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.7)', marginBottom: 16, lineHeight: 1.6 }}>Our Launchpad checklist covers registering your business and more.</p>
            <Link href="/launchpad" style={{ display: 'inline-block', padding: '8px 18px', background: '#E85D3A', color: '#1A1A1A', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
              Start checklist →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .ltd-layout { }
        @media (max-width: 768px) { .ltd-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
