'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { formatCurrency } from '@/lib/taxCalc'
import { useDemo } from '@/lib/demo-context'

const TAX_DEADLINES = [
  { date: '5 Apr 2026', label: 'Tax year ends' },
  { date: '6 Apr 2026', label: 'New tax year starts' },
  { date: '31 Jul 2026', label: 'Second payment on account' },
  { date: '31 Jan 2027', label: 'Online return + first payment' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STATUS_COLORS: Record<string, string> = {
  draft: '#9CA3AF', sent: '#3B82F6', paid: '#10B981', overdue: '#EF4444', cancelled: '#6B7280',
}
const DONUT_COLORS = ['#1B2A4A', '#D4A84B', '#F5F0E6', '#2D4A7A', '#E8C97A']

export default function DemoDashboard() {
  const { data } = useDemo()

  // KPIs
  const paidRevenue = data.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const incomeTotal = data.income.reduce((s, i) => s + i.amount, 0)
  const revenue = paidRevenue + incomeTotal
  const outstanding = data.invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
  const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0)
  const taxableProfit = Math.max(0, revenue - totalExpenses)
  const taxLiability = taxableProfit > 12570 ? (Math.min(taxableProfit, 50270) - 12570) * 0.2 : 0

  // Monthly chart (last 12 months)
  const monthly: Record<string, { revenue: number; expenses: number }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(2026, 3, 3) // anchor date for demo
    d.setMonth(d.getMonth() - i)
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    monthly[key] = { revenue: 0, expenses: 0 }
  }
  data.invoices.filter(i => i.status === 'paid').forEach(inv => {
    const d = new Date(inv.issue_date)
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    if (monthly[key]) monthly[key].revenue += inv.total
  })
  data.income.forEach(inc => {
    const d = new Date(inc.date)
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    if (monthly[key]) monthly[key].revenue += inc.amount
  })
  data.expenses.forEach(exp => {
    const d = new Date(exp.date)
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    if (monthly[key]) monthly[key].expenses += exp.amount
  })
  const chartData = Object.entries(monthly).map(([month, v]) => ({ month: month.split(' ')[0], ...v }))

  // Income by source
  const srcMap: Record<string, number> = {}
  data.income.forEach(inc => { srcMap[inc.source] = (srcMap[inc.source] || 0) + inc.amount })
  const incomeBySource = Object.entries(srcMap).map(([name, value]) => ({ name, value }))

  const recentInvoices = data.invoices.slice(0, 5)

  return (
    <div style={{ padding: 32, maxWidth: 1200 }} className="demo-dashboard-wrap">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1B2A4A', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#5A6A7A' }}>Welcome to your demo. Here&apos;s your business at a glance.</p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="demo-kpi-grid">
        {[
          { label: 'Revenue (tax year)', value: formatCurrency(revenue), sub: 'From paid invoices + income' },
          { label: 'Outstanding invoices', value: formatCurrency(outstanding.reduce((s, i) => s + i.total, 0)), sub: `${outstanding.length} unpaid` },
          { label: 'Expenses (tax year)', value: formatCurrency(totalExpenses), sub: 'Total logged expenses' },
          { label: 'Est. tax liability', value: formatCurrency(taxLiability), sub: 'Rough estimate' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: '#1B2A4A', borderRadius: 10, padding: '20px 24px', borderTop: '3px solid #D4A84B' }}>
            <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>{kpi.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#D4A84B', marginBottom: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.4)' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="demo-charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginBottom: 20 }}>Revenue vs Expenses (last 12 months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `£${v}`} />
              <Tooltip formatter={(v) => typeof v === 'number' ? formatCurrency(v) : v} />
              <Legend />
              <Bar dataKey="revenue" fill="#1B2A4A" name="Revenue" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" fill="#D4A84B" name="Expenses" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: 24, overflow: 'hidden' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginBottom: 20 }}>Income by source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={incomeBySource} cx="50%" cy="42%" innerRadius={55} outerRadius={80} dataKey="value">
                {incomeBySource.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => typeof v === 'number' ? formatCurrency(v) : v} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="demo-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Recent invoices */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A' }}>Recent invoices</h3>
            <Link href="/os/demo/invoices/new" style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>New invoice</Link>
          </div>
          <div><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Invoice', 'Client', 'Due', 'Amount', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid rgba(27,42,74,0.08)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.05)' }}>
                  <td style={{ padding: '10px 0' }}>
                    <Link href={`/os/demo/invoices/${inv.id}`} style={{ color: '#2D4A7A', fontWeight: 600 }}>{inv.invoice_number}</Link>
                  </td>
                  <td style={{ padding: '10px 0', color: '#5A6A7A' }}>{inv.client_name}</td>
                  <td style={{ padding: '10px 0', color: '#5A6A7A' }}>{new Date(inv.due_date).toLocaleDateString('en-GB')}</td>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                  <td style={{ padding: '10px 0' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: `${STATUS_COLORS[inv.status]}20`, color: STATUS_COLORS[inv.status] }}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>

        {/* Tax deadlines + quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>Upcoming deadlines</h3>
            {TAX_DEADLINES.map((d) => (
              <div key={d.date} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(27,42,74,0.05)', fontSize: 12 }}>
                <span style={{ color: '#1B2A4A', fontWeight: 500 }}>{d.label}</span>
                <span style={{ color: '#D4A84B', fontWeight: 600 }}>{d.date}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>Quick actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'New Invoice', href: '/os/demo/invoices/new' },
                { label: 'Log Expense', href: '/os/demo/expenses/new' },
                { label: 'Add Client', href: '/os/demo/clients/new' },
              ].map((a) => (
                <Link key={a.href} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#F5F0E6', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>
                  <Plus size={14} /> {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .demo-dashboard-wrap { padding: 16px !important; }
          .demo-kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .demo-charts-grid { grid-template-columns: 1fr !important; }
          .demo-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
