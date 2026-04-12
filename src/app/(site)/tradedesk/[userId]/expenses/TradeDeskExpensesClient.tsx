'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Download, Filter } from 'lucide-react'

interface Expense {
  id: string
  date: string | null
  supplier: string | null
  amount: number | null
  vat: number | null
  category: string | null
  created_at: string
}

const CATEGORIES = ['All', 'Materials', 'Tools', 'Fuel', 'Insurance', 'Subcontractor', 'Office', 'Vehicle', 'Other']

export default function TradeDeskExpensesClient({ userId }: { userId: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('tradedesk_expenses')
      .select('id, date, supplier, amount, vat, category, created_at')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .then(({ data }) => {
        setExpenses(data || [])
        setLoading(false)
      })
  }, [userId])

  const filtered = category === 'All' ? expenses : expenses.filter((e) => e.category === category)

  const totalAmount = filtered.reduce((sum, e) => sum + (e.amount || 0), 0)
  const totalVat = filtered.reduce((sum, e) => sum + (e.vat || 0), 0)

  const handleExport = () => {
    window.location.href = `/api/tradedesk/${userId}/expenses/export`
  }

  if (loading) {
    return (
      <div style={{ padding: '48px 24px', color: '#5A6A7A', fontSize: 14 }}>
        Loading expenses...
      </div>
    )
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} color="#5A6A7A" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              fontSize: 13,
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid rgba(27,42,74,0.15)',
              background: '#fff',
              color: '#1B2A4A',
              cursor: 'pointer',
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#D4A84B',
            color: '#1B2A4A',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expenses</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>{filtered.length}</div>
        </div>
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Total</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>£{totalAmount.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>VAT</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>£{totalVat.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 8, border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gross Total</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B2A4A' }}>£{(totalAmount + totalVat).toFixed(2)}</div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p style={{ fontSize: 14, color: '#5A6A7A' }}>No expenses found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.1)' }}>
                {['Date', 'Supplier', 'Amount', 'VAT', 'Category'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      color: '#5A6A7A',
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr
                  key={e.id}
                  style={{ borderBottom: '1px solid rgba(27,42,74,0.06)', background: i % 2 === 0 ? '#fff' : 'transparent' }}
                >
                  <td style={{ padding: '12px 12px', color: '#1B2A4A', whiteSpace: 'nowrap' }}>
                    {e.date ? new Date(e.date).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td style={{ padding: '12px 12px', color: '#1B2A4A' }}>{e.supplier || '—'}</td>
                  <td style={{ padding: '12px 12px', color: '#1B2A4A', whiteSpace: 'nowrap' }}>
                    {e.amount != null ? `£${e.amount.toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 12px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>
                    {e.vat != null ? `£${e.vat.toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 100,
                      background: 'rgba(212,168,75,0.12)',
                      color: '#1B2A4A',
                      fontWeight: 500,
                    }}>
                      {e.category || 'Other'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
