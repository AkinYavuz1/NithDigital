'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { PoundSterling, TrendingUp, TrendingDown, AlertCircle, CreditCard, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface StarlingData {
  clearedBalance: number
  effectiveBalance: number
  pendingOut: number
  transactions: {
    id: string
    date: string
    direction: 'IN' | 'OUT'
    amount: number
    name: string
    category: string
    status: string
    reference: string
  }[]
  monthly: Record<string, { in: number; out: number }>
}

interface Invoice {
  id: string
  client_id: string
  invoice_number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  total: number
  clients: { name: string } | { name: string }[] | null
}

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

interface Income {
  id: string
  source: string
  description: string
  amount: number
  date: string
  category: string
}

type Tab = 'cashflow' | 'invoices' | 'aged-debtors' | 'expenses' | 'tax'

const TABS: { id: Tab; label: string }[] = [
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'aged-debtors', label: 'Aged Debtors' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'tax', label: 'Tax Pot' },
]

const STATUS_COLOURS: Record<string, string> = {
  paid: '#27ae60',
  sent: '#2D4A7A',
  overdue: '#e74c3c',
  draft: '#5A6A7A',
  cancelled: '#aaa',
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(n)
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7) // YYYY-MM
}

function daysDiff(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

export default function AdminFinanceClient({
  invoices: initialInvoices,
  expenses: initialExpenses,
  income: initialIncome,
}: {
  invoices: Invoice[]
  expenses: Expense[]
  income: Income[]
}) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [income, setIncome] = useState<Income[]>(initialIncome)
  const [starling, setStarling] = useState<StarlingData | null>(null)
  const [starlingLoading, setStarlingLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('cashflow')
  const [invoiceFilter, setInvoiceFilter] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('invoices').select('id, client_id, invoice_number, status, issue_date, due_date, total, clients(name)').order('issue_date', { ascending: false }),
      supabase.from('expenses').select('id, category, description, amount, date').order('date', { ascending: false }),
      supabase.from('income').select('id, source, description, amount, date, category').order('date', { ascending: false }),
    ]).then(([inv, exp, inc]) => {
      if (inv.data) setInvoices(inv.data as unknown as Invoice[])
      if (exp.data) setExpenses(exp.data as Expense[])
      if (inc.data) setIncome(inc.data as Income[])
    })

    fetch('/api/admin/starling')
      .then(r => r.ok ? r.json() : null)
      .then((d: StarlingData | null) => { if (d?.transactions) setStarling(d); setStarlingLoading(false) })
      .catch(() => setStarlingLoading(false))
  }, [])

  // ── derived numbers ──────────────────────────────────────────────
  const totalIncome = income.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const outstanding = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((s, i) => s + i.total, 0)

  const overdueInvoices = invoices.filter(i => i.status === 'overdue')
  const overdueTotal = overdueInvoices.reduce((s, i) => s + i.total, 0)

  // Monthly cashflow (last 12 months)
  const last12: string[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    last12.push(d.toISOString().slice(0, 7))
  }

  const cashflowData = last12.map(month => {
    const inflow = income.filter(i => monthKey(i.date) === month).reduce((s, i) => s + i.amount, 0)
    const outflow = expenses.filter(e => monthKey(e.date) === month).reduce((s, e) => s + e.amount, 0)
    return { month: month.slice(5), inflow, outflow, net: inflow - outflow }
  })

  // Aged debtors
  const aged = {
    current: invoices.filter(i => (i.status === 'sent' || i.status === 'overdue') && daysDiff(i.due_date) <= 0),
    d30: invoices.filter(i => (i.status === 'sent' || i.status === 'overdue') && daysDiff(i.due_date) > 0 && daysDiff(i.due_date) <= 30),
    d60: invoices.filter(i => (i.status === 'sent' || i.status === 'overdue') && daysDiff(i.due_date) > 30 && daysDiff(i.due_date) <= 60),
    d60plus: invoices.filter(i => (i.status === 'sent' || i.status === 'overdue') && daysDiff(i.due_date) > 60),
  }

  // Expenses by category
  const expCats: Record<string, number> = {}
  expenses.forEach(e => { expCats[e.category] = (expCats[e.category] || 0) + e.amount })
  const expCatData = Object.entries(expCats)
    .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
    .sort((a, b) => b.value - a.value)

  // Tax estimate (simplified: 20% of net profit)
  const taxYear = `${new Date().getFullYear() - (new Date().getMonth() < 3 ? 1 : 0)}/${String(new Date().getFullYear() - (new Date().getMonth() < 3 ? 1 : 0) + 1).slice(2)}`
  const taxEstimate = Math.max(0, netProfit * 0.20)
  const niEstimate = Math.max(0, (netProfit - 12570) * 0.09) // Class 4 simplified
  const totalTaxEstimate = taxEstimate + niEstimate

  // Filtered invoices
  const filteredInvoices = invoiceFilter === 'all'
    ? invoices
    : invoices.filter(i => i.status === invoiceFilter)

  const KPI = [
    { label: 'Bank Balance', value: starlingLoading ? '…' : starling ? fmt(starling.clearedBalance) : '—', color: '#1B2A4A', icon: Building2 },
    { label: 'Total Income', value: fmt(totalIncome), color: '#27ae60', icon: TrendingUp },
    { label: 'Total Expenses', value: fmt(totalExpenses), color: '#e74c3c', icon: TrendingDown },
    { label: 'Net Profit', value: fmt(netProfit), color: netProfit >= 0 ? '#2D4A7A' : '#e74c3c', icon: PoundSterling },
    { label: 'Outstanding', value: fmt(outstanding), color: '#D4A84B', icon: CreditCard },
    { label: 'Overdue', value: fmt(overdueTotal), color: '#e74c3c', icon: AlertCircle },
  ]

  return (
    <div className="finance-wrap" style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400 }}>Finance</h1>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 32 }} className="fin-kpi-grid">
        {KPI.map(k => (
          <div key={k.label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '20px', borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid rgba(27,42,74,0.08)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#1B2A4A' : '#5A6A7A',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid #D4A84B' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: -2,
              transition: 'all 0.15s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CASHFLOW TAB ── */}
      {tab === 'cashflow' && (
        <div>
          {/* Starling balance cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }} className="starling-grid">
            {[
              { label: 'Cleared Balance', value: starling ? fmt(starling.clearedBalance) : starlingLoading ? '…' : '—', color: '#1B2A4A' },
              { label: 'Effective Balance', value: starling ? fmt(starling.effectiveBalance) : starlingLoading ? '…' : '—', color: '#2D4A7A' },
              { label: 'Pending Out', value: starling ? fmt(starling.pendingOut) : starlingLoading ? '…' : '—', color: '#D4A84B' },
            ].map(c => (
              <div key={c.label} style={{ background: '#1B2A4A', borderRadius: 10, padding: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(212,168,75,0.8)', marginBottom: 8, fontWeight: 600 }}>Starling · {c.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#F5F0E6' }}>{c.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Monthly cashflow (last 12 months)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={cashflowData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: unknown) => fmt(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="inflow" name="Income" fill="#27ae60" radius={[3, 3, 0, 0]} />
                <Bar dataKey="outflow" name="Expenses" fill="#e74c3c" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 0 }} className="cashflow-bottom-grid">
            <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Net profit trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={cashflowData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="rgba(27,42,74,0.06)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: unknown) => fmt(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Line type="monotone" dataKey="net" name="Net" stroke="#D4A84B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Recent Starling transactions</h3>
              {starlingLoading ? (
                <p style={{ fontSize: 13, color: '#5A6A7A' }}>Loading…</p>
              ) : !starling || starling.transactions.length === 0 ? (
                <p style={{ fontSize: 13, color: '#5A6A7A' }}>No transactions found</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {starling.transactions.map((tx, i) => (
                    <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < starling.transactions.length - 1 ? '1px solid rgba(27,42,74,0.05)' : 'none' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: tx.direction === 'IN' ? 'rgba(39,174,96,0.12)' : 'rgba(231,76,60,0.10)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, color: tx.direction === 'IN' ? '#27ae60' : '#e74c3c',
                      }}>
                        {tx.direction === 'IN' ? '↓' : '↑'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: '#1B2A4A', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.name}</div>
                        <div style={{ fontSize: 11, color: '#5A6A7A' }}>{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {tx.category.replace(/_/g, ' ').toLowerCase()}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: tx.direction === 'IN' ? '#27ae60' : '#e74c3c', flexShrink: 0 }}>
                        {tx.direction === 'IN' ? '+' : '−'}{fmt(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── INVOICES TAB ── */}
      {tab === 'invoices' && (
        <div>
          {/* Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setInvoiceFilter(s)}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  borderRadius: 20,
                  border: `1px solid ${invoiceFilter === s ? '#1B2A4A' : 'rgba(27,42,74,0.2)'}`,
                  background: invoiceFilter === s ? '#1B2A4A' : 'white',
                  color: invoiceFilter === s ? 'white' : '#5A6A7A',
                  cursor: 'pointer',
                  fontWeight: invoiceFilter === s ? 600 : 400,
                  textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F5F0E6' }}>
                  {['Invoice #', 'Client', 'Issue Date', 'Due Date', 'Total', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#5A6A7A' }}>No invoices found</td></tr>
                ) : filteredInvoices.map((inv, i) => (
                  <tr key={inv.id} style={{ borderBottom: i < filteredInvoices.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1B2A4A' }}>{inv.invoice_number}</td>
                    <td style={{ padding: '14px 16px', color: '#1B2A4A' }}>{(Array.isArray(inv.clients) ? inv.clients[0]?.name : inv.clients?.name) || '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#5A6A7A' }}>{new Date(inv.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '14px 16px', color: inv.status === 'overdue' ? '#e74c3c' : '#5A6A7A' }}>{new Date(inv.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{fmt(inv.total)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        background: `${STATUS_COLOURS[inv.status]}18`,
                        color: STATUS_COLOURS[inv.status],
                        textTransform: 'capitalize',
                      }}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── AGED DEBTORS TAB ── */}
      {tab === 'aged-debtors' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }} className="aged-grid">
            {[
              { label: 'Current (not yet due)', invoices: aged.current, color: '#27ae60' },
              { label: '1–30 days overdue', invoices: aged.d30, color: '#D4A84B' },
              { label: '31–60 days overdue', invoices: aged.d60, color: '#e67e22' },
              { label: '60+ days overdue', invoices: aged.d60plus, color: '#e74c3c' },
            ].map(bucket => (
              <div key={bucket.label} style={{ background: '#F5F0E6', borderRadius: 10, padding: 20, borderTop: `3px solid ${bucket.color}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: bucket.color }}>{fmt(bucket.invoices.reduce((s, i) => s + i.total, 0))}</div>
                <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>{bucket.label}</div>
                <div style={{ fontSize: 12, color: '#1B2A4A', marginTop: 8, fontWeight: 600 }}>{bucket.invoices.length} invoice{bucket.invoices.length !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>

          {[
            { label: 'Current', invoices: aged.current },
            { label: '1–30 days overdue', invoices: aged.d30 },
            { label: '31–60 days overdue', invoices: aged.d60 },
            { label: '60+ days overdue', invoices: aged.d60plus },
          ].map(bucket => bucket.invoices.length > 0 && (
            <div key={bucket.label} style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(27,42,74,0.06)', fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>{bucket.label}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  {bucket.invoices.map((inv, i) => (
                    <tr key={inv.id} style={{ borderBottom: i < bucket.invoices.length - 1 ? '1px solid rgba(27,42,74,0.05)' : 'none' }}>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{inv.invoice_number}</td>
                      <td style={{ padding: '12px 20px', color: '#1B2A4A' }}>{(Array.isArray(inv.clients) ? inv.clients[0]?.name : inv.clients?.name) || '—'}</td>
                      <td style={{ padding: '12px 20px', color: '#5A6A7A' }}>Due {new Date(inv.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 700, textAlign: 'right' }}>{fmt(inv.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {outstanding === 0 && (
            <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: '48px 24px', textAlign: 'center', color: '#5A6A7A', fontSize: 14 }}>
              No outstanding invoices
            </div>
          )}
        </div>
      )}

      {/* ── EXPENSES TAB ── */}
      {tab === 'expenses' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }} className="exp-grid">
            <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>By category</h3>
              {expCatData.map(c => (
                <div key={c.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#1B2A4A', textTransform: 'capitalize' }}>{c.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{fmt(c.value)}</span>
                  </div>
                  <div style={{ height: 4, background: '#F5F0E6', borderRadius: 2 }}>
                    <div style={{ height: '100%', borderRadius: 2, background: '#D4A84B', width: `${(c.value / totalExpenses) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Recent expenses</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  {expenses.slice(0, 15).map((e, i) => (
                    <tr key={e.id} style={{ borderBottom: i < 14 ? '1px solid rgba(27,42,74,0.05)' : 'none' }}>
                      <td style={{ padding: '10px 0', color: '#5A6A7A', fontSize: 11 }}>{new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                      <td style={{ padding: '10px 8px', color: '#1B2A4A' }}>{e.description}</td>
                      <td style={{ padding: '10px 0', color: '#5A6A7A', fontSize: 11, textTransform: 'capitalize' }}>{e.category.replace(/_/g, ' ')}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>{fmt(e.amount)}</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: '40px 0', textAlign: 'center', color: '#5A6A7A' }}>No expenses recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAX POT TAB ── */}
      {tab === 'tax' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }} className="tax-grid">
            <div style={{ background: '#F5F0E6', borderRadius: 10, padding: 20, borderTop: '3px solid #1B2A4A' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A' }}>{fmt(netProfit)}</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Net profit (income − expenses)</div>
            </div>
            <div style={{ background: '#F5F0E6', borderRadius: 10, padding: 20, borderTop: '3px solid #e74c3c' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e74c3c' }}>{fmt(totalTaxEstimate)}</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Estimated tax + NI (set aside)</div>
            </div>
            <div style={{ background: '#F5F0E6', borderRadius: 10, padding: 20, borderTop: '3px solid #27ae60' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#27ae60' }}>{fmt(Math.max(0, netProfit - totalTaxEstimate))}</div>
              <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 4 }}>Yours to keep (after tax)</div>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 12, padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, fontWeight: 400 }}>Tax year {taxYear} estimate</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Gross income', value: fmt(totalIncome), note: '' },
                { label: 'Allowable expenses', value: `− ${fmt(totalExpenses)}`, note: '' },
                { label: 'Taxable profit', value: fmt(netProfit), note: '', bold: true },
                { label: 'Income tax (20% basic rate)', value: fmt(taxEstimate), note: 'Simplified — assumes basic rate' },
                { label: 'Class 4 NI (9% above £12,570)', value: fmt(niEstimate), note: '' },
                { label: 'Total estimated tax liability', value: fmt(totalTaxEstimate), note: '', bold: true, color: '#e74c3c' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: row.bold ? 600 : 400, color: row.color || '#1B2A4A' }}>{row.label}</span>
                    {row.note && <span style={{ fontSize: 11, color: '#5A6A7A', marginLeft: 8 }}>{row.note}</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: row.bold ? 700 : 500, color: row.color || '#1B2A4A' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#5A6A7A', marginTop: 20, lineHeight: 1.6 }}>
              This is a rough estimate based on recorded income and expenses. Consult an accountant for accurate figures. Does not account for personal allowance thresholds, dividends, or other allowances.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .fin-kpi-grid {}
        .starling-grid {}
        .cashflow-bottom-grid {}
        .aged-grid {}
        .exp-grid {}
        .tax-grid {}
        @media (max-width: 1024px) {
          .fin-kpi-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .starling-grid { grid-template-columns: 1fr 1fr !important; }
          .cashflow-bottom-grid { grid-template-columns: 1fr !important; }
          .aged-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .exp-grid { grid-template-columns: 1fr !important; }
          .tax-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .finance-wrap { padding: 20px 16px !important; }
          .fin-kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .starling-grid { grid-template-columns: 1fr !important; }
          .aged-grid { grid-template-columns: 1fr 1fr !important; }
          .tax-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .fin-kpi-grid { grid-template-columns: 1fr !important; }
          .aged-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
