'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Link from 'next/link'

const PA = 12570
const BASIC_LIMIT = 50270
const HIGHER_LIMIT = 125140
const NI_CLASS2_WEEKLY = 3.45
const NI_CLASS4_LOWER = 12570
const NI_CLASS4_UPPER = 50270

const STUDENT_LOAN_PLANS = [
  { value: 'none', label: 'No student loan', threshold: 0, rate: 0 },
  { value: 'plan1', label: 'Plan 1', threshold: 24990, rate: 0.09 },
  { value: 'plan2', label: 'Plan 2', threshold: 27295, rate: 0.09 },
  { value: 'plan4', label: 'Plan 4 (Scotland)', threshold: 31395, rate: 0.09 },
  { value: 'plan5', label: 'Plan 5', threshold: 25000, rate: 0.09 },
  { value: 'postgrad', label: 'Postgraduate', threshold: 21000, rate: 0.06 },
]

function calcIncomeTax(income: number): number {
  const taxable = Math.max(0, income - PA)
  let tax = 0
  tax += Math.min(taxable, BASIC_LIMIT - PA) * 0.20
  if (income > BASIC_LIMIT) tax += (Math.min(income, HIGHER_LIMIT) - BASIC_LIMIT) * 0.40
  if (income > HIGHER_LIMIT) tax += (income - HIGHER_LIMIT) * 0.45
  return Math.max(0, tax)
}

export default function TakeHomeClient() {
  const [grossIncome, setGrossIncome] = useState(40000)
  const [grossInput, setGrossInput] = useState('40000')
  const [expenses, setExpenses] = useState(5000)
  const [expInput, setExpInput] = useState('5000')
  const [studentLoan, setStudentLoan] = useState('none')

  const handleGross = (v: string) => {
    setGrossInput(v)
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(n)) setGrossIncome(n)
  }
  const handleExp = (v: string) => {
    setExpInput(v)
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(n)) setExpenses(n)
  }

  const taxableProfit = Math.max(0, grossIncome - expenses)
  const incomeTax = calcIncomeTax(taxableProfit)

  const class2 = taxableProfit > NI_CLASS4_LOWER ? NI_CLASS2_WEEKLY * 52 : 0
  let class4 = 0
  if (taxableProfit > NI_CLASS4_LOWER) {
    class4 += Math.min(taxableProfit, NI_CLASS4_UPPER) - NI_CLASS4_LOWER
    class4 = class4 * 0.09
  }
  if (taxableProfit > NI_CLASS4_UPPER) {
    class4 += (taxableProfit - NI_CLASS4_UPPER) * 0.02
  }

  const slPlan = STUDENT_LOAN_PLANS.find(p => p.value === studentLoan)!
  const slRepayment = taxableProfit > slPlan.threshold ? (taxableProfit - slPlan.threshold) * slPlan.rate : 0

  const totalDeductions = incomeTax + class2 + class4 + slRepayment
  const takeHome = taxableProfit - totalDeductions
  const effectiveRate = taxableProfit > 0 ? (totalDeductions / taxableProfit) * 100 : 0

  const fmt = (n: number) => `£${Math.round(n).toLocaleString()}`

  const chartData = [
    { name: 'Take-home', value: Math.max(0, Math.round(takeHome)), fill: '#27ae60' },
    { name: 'Income tax', value: Math.round(incomeTax), fill: '#c0392b' },
    { name: 'NI (Class 2 + 4)', value: Math.round(class2 + class4), fill: '#E85D3A' },
    ...(slRepayment > 0 ? [{ name: 'Student loan', value: Math.round(slRepayment), fill: '#333333' }] : []),
  ].filter(d => d.value > 0)

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }} className="takehome-layout">
        <div>
          <div style={{ background: '#FAF8F5', borderRadius: 12, padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 24, fontWeight: 400 }}>Your income</h2>

            {[
              { label: 'Gross annual income', value: grossInput, handler: handleGross, sliderVal: grossIncome, setSlider: setGrossIncome, setInput: setGrossInput, max: 300000 },
              { label: 'Annual business expenses', value: expInput, handler: handleExp, sliderVal: expenses, setSlider: setExpenses, setInput: setExpInput, max: 100000 },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7A7A7A', fontWeight: 600 }}>£</span>
                  <input type="text" value={field.value} onChange={e => field.handler(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 28px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, fontSize: 15, fontWeight: 600, color: '#1A1A1A', fontFamily: 'inherit' }} />
                </div>
                <input type="range" min={0} max={field.max} step={500} value={field.sliderVal} onChange={e => { field.setSlider(Number(e.target.value)); field.setInput(String(e.target.value)) }} style={{ width: '100%', marginTop: 8 }} />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>Student loan plan</label>
              <select value={studentLoan} onChange={e => setStudentLoan(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: 'white' }}>
                {STUDENT_LOAN_PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Results */}
          <div style={{ background: '#1A1A1A', borderRadius: 12, padding: 32, color: '#FAF8F5', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 24, fontWeight: 400 }}>Your results</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Annual take-home</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#27ae60' }}>{fmt(takeHome)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Monthly take-home</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#E85D3A' }}>{fmt(takeHome / 12)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Gross income', fmt(grossIncome)],
                ['Less expenses', `– ${fmt(expenses)}`],
                ['Taxable profit', fmt(taxableProfit)],
                ['Income tax', `– ${fmt(incomeTax)}`],
                ['NI Class 2', `– ${fmt(class2)}`],
                ['NI Class 4', `– ${fmt(class4)}`],
                ...(slRepayment > 0 ? [['Student loan', `– ${fmt(slRepayment)}`]] : []),
                ['Effective tax rate', `${effectiveRate.toFixed(1)}%`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(250,248,245,0.6)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart + sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16, fontWeight: 400 }}>Income breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={false}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => fmt(Number(v ?? 0))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#FAF8F5', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 12, fontWeight: 400 }}>Monthly budget</h3>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{fmt(takeHome / 12)}</div>
            <p style={{ fontSize: 13, color: '#7A7A7A', lineHeight: 1.6 }}>
              This is your monthly take-home after all deductions. Set aside at least 25–30% of each payment for your Self Assessment bill.
            </p>
          </div>

          <div style={{ background: '#1A1A1A', borderRadius: 12, padding: 24, color: '#FAF8F5' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 10, fontWeight: 400 }}>Track your income</h3>
            <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.7)', marginBottom: 16, lineHeight: 1.6 }}>
              The Business OS tracks your income, expenses, and estimated tax in real time.
            </p>
            <Link href="/os" style={{ display: 'inline-block', padding: '8px 18px', background: '#E85D3A', color: '#1A1A1A', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
              Try Business OS →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .takehome-layout { }
        @media (max-width: 768px) { .takehome-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
