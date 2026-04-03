'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/taxCalc'
import OSPageHeader from '@/components/OSPageHeader'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const COLORS = ['#1B2A4A', '#D4A84B', '#2D4A7A', '#E8C97A', '#F5F0E6', '#5A6A7A']

const CATEGORY_LABELS: Record<string, string> = {
  office_supplies: 'Office supplies', travel: 'Travel', fuel: 'Fuel', phone_internet: 'Phone/internet',
  software: 'Software', insurance: 'Insurance', marketing: 'Marketing', professional_fees: 'Professional fees',
  bank_charges: 'Bank charges', equipment: 'Equipment', training: 'Training', meals_entertainment: 'Meals',
  postage: 'Postage', clothing_uniform: 'Clothing', repairs_maintenance: 'Repairs', other: 'Other',
}

type ReportType = 'pl' | 'income' | 'expenses' | 'tax' | 'client' | 'mileage'

export default function ReportsClient() {
  const [activeReport, setActiveReport] = useState<ReportType>('pl')
  const [data, setData] = useState<{
    monthly: { month: string; income: number; expenses: number }[]
    expenseByCategory: { name: string; value: number }[]
    incomeBySource: { name: string; value: number }[]
    clientRevenue: { name: string; total: number }[]
    mileage: { month: string; miles: number; claim: number }[]
    totals: { income: number; expenses: number; profit: number }
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: authData }) => {
      if (!authData.user) return
      const uid = authData.user.id
      const taxYearStart = new Date().getMonth() >= 3 ? new Date(new Date().getFullYear(), 3, 6) : new Date(new Date().getFullYear() - 1, 3, 6)
      const startStr = taxYearStart.toISOString().split('T')[0]

      const [invRes, expRes, incRes, milRes] = await Promise.all([
        supabase.from('invoices').select('*, clients(name)').eq('user_id', uid).eq('status', 'paid').gte('issue_date', startStr),
        supabase.from('expenses').select('*').eq('user_id', uid).gte('date', startStr),
        supabase.from('income').select('*').eq('user_id', uid).gte('date', startStr),
        supabase.from('mileage_logs').select('*').eq('user_id', uid).gte('date', startStr),
      ])

      const invoices = invRes.data || []
      const expenses = expRes.data || []
      const incomes = incRes.data || []
      const miles = milRes.data || []

      // Monthly P&L
      const monthly: Record<string, { month: string; income: number; expenses: number }> = {}
      for (let i = 11; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        monthly[key] = { month: MONTHS[d.getMonth()], income: 0, expenses: 0 }
      }
      invoices.forEach((inv: { issue_date: string; total: number }) => {
        const d = new Date(inv.issue_date)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (monthly[key]) monthly[key].income += Number(inv.total)
      })
      incomes.forEach((inc: { date: string; amount: number }) => {
        const d = new Date(inc.date)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (monthly[key]) monthly[key].income += Number(inc.amount)
      })
      expenses.forEach((exp: { date: string; amount: number }) => {
        const d = new Date(exp.date)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (monthly[key]) monthly[key].expenses += Number(exp.amount)
      })

      // Expense by category
      const catMap: Record<string, number> = {}
      expenses.forEach((e: { category: string; amount: number }) => { catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount) })

      // Income by source
      const srcMap: Record<string, number> = {}
      incomes.forEach((i: { source: string; amount: number }) => { srcMap[i.source] = (srcMap[i.source] || 0) + Number(i.amount) })

      // Client revenue
      const clientMap: Record<string, number> = {}
      invoices.forEach((inv: { clients: { name: string } | null; total: number }) => {
        const name = inv.clients?.name || 'Unknown'
        clientMap[name] = (clientMap[name] || 0) + Number(inv.total)
      })

      // Monthly mileage
      const mileMonthly: Record<string, { month: string; miles: number; claim: number }> = {}
      Object.keys(monthly).forEach(k => { mileMonthly[k] = { month: monthly[k].month, miles: 0, claim: 0 } })
      miles.forEach((m: { date: string; miles: number; total_claim: number }) => {
        const d = new Date(m.date)
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
        if (mileMonthly[key]) { mileMonthly[key].miles += Number(m.miles); mileMonthly[key].claim += Number(m.total_claim) }
      })

      const totalIncome = invoices.reduce((s: number, i: { total: number }) => s + Number(i.total), 0) + incomes.reduce((s: number, i: { amount: number }) => s + Number(i.amount), 0)
      const totalExpenses = expenses.reduce((s: number, e: { amount: number }) => s + Number(e.amount), 0)

      setData({
        monthly: Object.values(monthly),
        expenseByCategory: Object.entries(catMap).map(([k, v]) => ({ name: CATEGORY_LABELS[k] || k, value: v })),
        incomeBySource: Object.entries(srcMap).map(([k, v]) => ({ name: k, value: v })),
        clientRevenue: Object.entries(clientMap).map(([k, v]) => ({ name: k, total: v })).sort((a, b) => b.total - a.total),
        mileage: Object.values(mileMonthly),
        totals: { income: totalIncome, expenses: totalExpenses, profit: totalIncome - totalExpenses },
      })
      setLoading(false)
    })
  }, [])

  const REPORT_TABS: { key: ReportType; label: string }[] = [
    { key: 'pl', label: 'Profit & Loss' },
    { key: 'income', label: 'Income' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'tax', label: 'Tax Summary' },
    { key: 'client', label: 'Client Revenue' },
    { key: 'mileage', label: 'Mileage' },
  ]

  return (
    <div>
      <OSPageHeader title="Reports" description="Financial reports for your business" />
      <div style={{ padding: 32 }}>
        {/* Report tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, flexWrap: 'wrap' }}>
          {REPORT_TABS.map(t => (
            <button key={t.key} onClick={() => setActiveReport(t.key)}
              style={{ padding: '8px 18px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeReport === t.key ? 600 : 400, background: activeReport === t.key ? '#1B2A4A' : '#fff', color: activeReport === t.key ? '#F5F0E6' : '#5A6A7A', transition: 'all 0.2s ease' }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <div style={{ color: '#5A6A7A' }}>Loading reports...</div> : !data ? null : (
          <div>
            {activeReport === 'pl' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                  {[
                    { label: 'Total income', value: formatCurrency(data.totals.income), color: '#10B981' },
                    { label: 'Total expenses', value: formatCurrency(data.totals.expenses), color: '#EF4444' },
                    { label: 'Net profit', value: formatCurrency(data.totals.profit), color: '#1B2A4A' },
                  ].map(k => (
                    <div key={k.label} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', borderTop: `3px solid ${k.color}` }}>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#5A6A7A', marginBottom: 6 }}>{k.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Monthly Income vs Expenses</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.monthly}>
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `£${v}`} />
                      <Tooltip formatter={(v) => typeof v === 'number' ? formatCurrency(v) : v} />
                      <Legend />
                      <Bar dataKey="income" fill="#1B2A4A" name="Income" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="expenses" fill="#D4A84B" name="Expenses" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {activeReport === 'expenses' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Expenses by Category</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={data.expenseByCategory} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                        {data.expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => typeof v === 'number' ? formatCurrency(v) : v} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Category breakdown</h3>
                  {data.expenseByCategory.sort((a, b) => b.value - a.value).map((c, i) => (
                    <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(27,42,74,0.05)', fontSize: 13 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, background: COLORS[i % COLORS.length], borderRadius: 2, flexShrink: 0 }} />
                        {c.name}
                      </span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeReport === 'income' && (
              <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Income by Source</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={data.incomeBySource} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                      {data.incomeBySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => typeof v === 'number' ? formatCurrency(v) : v} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeReport === 'client' && (
              <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Revenue by Client</h3>
                <ResponsiveContainer width="100%" height={Math.max(200, data.clientRevenue.length * 40)}>
                  <BarChart data={data.clientRevenue} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `£${v}`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                    <Tooltip formatter={(v) => typeof v === 'number' ? formatCurrency(v) : v} />
                    <Bar dataKey="total" fill="#1B2A4A" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeReport === 'mileage' && (
              <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Monthly Mileage</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.mileage}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="miles" fill="#1B2A4A" name="Miles" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="claim" fill="#D4A84B" name="Claim (£)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeReport === 'tax' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 20 }}>Tax Year Summary</h3>
                  {[
                    { label: 'Gross income', value: formatCurrency(data.totals.income) },
                    { label: 'Total expenses', value: formatCurrency(data.totals.expenses) },
                    { label: 'Taxable profit', value: formatCurrency(data.totals.profit) },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(27,42,74,0.06)', fontSize: 14 }}>
                      <span style={{ color: '#5A6A7A' }}>{r.label}</span>
                      <span style={{ fontWeight: 600 }}>{r.value}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: 12, color: '#5A6A7A', marginTop: 16 }}>
                    Use the Tax Estimator for a full breakdown including NI and student loan.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
