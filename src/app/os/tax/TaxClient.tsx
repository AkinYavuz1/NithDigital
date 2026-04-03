'use client'

import { useState } from 'react'
import OSPageHeader from '@/components/OSPageHeader'
import { calculateTax, formatCurrency, type TaxInput } from '@/lib/taxCalc'
import { createClient } from '@/lib/supabase'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function TaxClient() {
  const [input, setInput] = useState<TaxInput>({ grossIncome: 0, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
  const [result, setResult] = useState(() => calculateTax({ grossIncome: 0, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' }))
  const [taxYear, setTaxYear] = useState('2025/26')
  const [saved, setSaved] = useState(false)

  const update = (field: keyof TaxInput, val: string | number) => {
    const newInput = { ...input, [field]: typeof val === 'string' && field !== 'studentLoanPlan' ? parseFloat(val) || 0 : val } as TaxInput
    setInput(newInput)
    setResult(calculateTax(newInput))
    setSaved(false)
  }

  const saveEstimate = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('tax_estimates').insert([{ user_id: user.id, tax_year: taxYear, gross_income: input.grossIncome, allowable_expenses: input.allowableExpenses, taxable_profit: result.taxableProfit, income_tax: result.incomeTax, class2_ni: result.class2NI, class4_ni: result.class4NI, total_tax: result.totalTax, effective_rate: result.effectiveRate }])
    setSaved(true)
  }

  const totalBands = result.basicRateAmount + result.higherRateAmount + result.additionalRateAmount
  const bands = [
    { label: 'Basic rate (20%)', amount: result.basicRateAmount, tax: result.basicRateTax, color: '#2D4A7A' },
    { label: 'Higher rate (40%)', amount: result.higherRateAmount, tax: result.higherRateTax, color: '#D4A84B' },
    { label: 'Additional rate (45%)', amount: result.additionalRateAmount, tax: result.additionalRateTax, color: '#EF4444' },
  ].filter(b => b.amount > 0)

  return (
    <div>
      <OSPageHeader title="Tax Estimator" description="UK sole trader tax calculator — 2025/26" />
      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Inputs */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Tax year</label>
            <select value={taxYear} onChange={e => setTaxYear(e.target.value)} style={inputStyle}>
              <option value="2025/26">2025/26</option>
              <option value="2026/27">2026/27</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Gross income (£)</label>
            <input type="number" min="0" step="100" value={input.grossIncome || ''} onChange={e => update('grossIncome', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Allowable expenses (£)</label>
            <input type="number" min="0" step="100" value={input.allowableExpenses || ''} onChange={e => update('allowableExpenses', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Other taxable income (e.g. employment) (£)</label>
            <input type="number" min="0" step="100" value={input.otherIncome || ''} onChange={e => update('otherIncome', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Student loan plan</label>
            <select value={input.studentLoanPlan} onChange={e => update('studentLoanPlan', e.target.value)} style={inputStyle}>
              <option value="none">None</option>
              <option value="plan1">Plan 1 (threshold £22,015)</option>
              <option value="plan2">Plan 2 (threshold £27,295)</option>
              <option value="plan4">Plan 4 (threshold £27,660)</option>
              <option value="plan5">Plan 5 (threshold £25,000)</option>
              <option value="postgrad">Postgraduate (threshold £21,000)</option>
            </select>
          </div>
          <div style={{ borderTop: '1px solid rgba(27,42,74,0.08)', paddingTop: 12, fontSize: 12, color: '#5A6A7A' }}>
            <p>Personal Allowance: £12,570 {result.combinedIncome > 100000 && <span style={{ color: '#EF4444' }}>(tapered: {formatCurrency(result.personalAllowance)})</span>}</p>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary card */}
          <div style={{ background: '#1B2A4A', borderRadius: 10, padding: 28, color: '#F5F0E6' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Taxable profit', value: formatCurrency(result.taxableProfit) },
                { label: 'Effective rate', value: `${result.effectiveRate.toFixed(1)}%` },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{r.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#D4A84B' }}>{r.value}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.6)', marginBottom: 6 }}>Total tax due</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#D4A84B' }}>{formatCurrency(result.totalTax)}</div>
            </div>
            <div style={{ marginTop: 16, background: 'rgba(212,168,75,0.1)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.6)', marginBottom: 4 }}>Put aside monthly</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#E8C97A' }}>{formatCurrency(result.monthlySetAside)}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>Tax breakdown</h3>
            {/* Income tax bands bar */}
            {totalBands > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 6 }}>Income tax bands</div>
                <div style={{ height: 20, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                  {bands.map(b => (
                    <div key={b.label} style={{ width: `${(b.amount / totalBands) * 100}%`, background: b.color, transition: 'width 0.4s ease' }} title={`${b.label}: ${formatCurrency(b.amount)}`} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                  {bands.map(b => (
                    <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                      <div style={{ width: 10, height: 10, background: b.color, borderRadius: 2 }} />
                      <span style={{ color: '#5A6A7A' }}>{b.label}: {formatCurrency(b.tax)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {[
              { label: 'Income tax', value: result.incomeTax },
              { label: 'Class 2 NI', value: result.class2NI },
              { label: 'Class 4 NI', value: result.class4NI },
              ...(result.studentLoan > 0 ? [{ label: 'Student loan', value: result.studentLoan }] : []),
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(27,42,74,0.06)', fontSize: 13 }}>
                <span style={{ color: '#5A6A7A' }}>{row.label}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(row.value)}</span>
              </div>
            ))}
            <button onClick={saveEstimate} disabled={saved} style={{ marginTop: 16, width: '100%', padding: '10px', background: saved ? '#F5F0E6' : '#1B2A4A', color: saved ? '#5A6A7A' : '#F5F0E6', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {saved ? '✓ Estimate saved' : 'Save this estimate'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
