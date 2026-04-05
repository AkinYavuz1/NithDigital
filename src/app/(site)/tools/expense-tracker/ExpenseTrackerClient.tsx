'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

type TransactionType = 'income' | 'expense'

interface Transaction {
  id: string
  date: string
  type: TransactionType
  category: string
  description: string
  amount: number
}

type FilterType = 'all' | 'income' | 'expense'
type SortField = 'date' | 'amount' | 'category'
type SortDir = 'asc' | 'desc'

// ─── Constants ───────────────────────────────────────────────────────────────

const INCOME_CATEGORIES = ['Sales / fees', 'Other income']
const EXPENSE_CATEGORIES = [
  'Office costs',
  'Travel',
  'Clothing',
  'Staff costs',
  'Stock / materials',
  'Legal & financial',
  'Marketing & advertising',
  'Training',
  'Phone / internet',
  'Insurance',
  'Vehicle expenses',
  'Other',
]

const STORAGE_KEY = 'nith-expense-tracker-v1'

// Tax year quarters: Apr-Jun (Q1), Jul-Sep (Q2), Oct-Dec (Q3), Jan-Mar (Q4)
function getQuarterFromDate(dateStr: string): { quarter: number; year: number } {
  const d = new Date(dateStr)
  const month = d.getMonth() // 0-indexed
  const calYear = d.getFullYear()
  // Tax year starts April
  if (month >= 3 && month <= 5) return { quarter: 1, year: calYear }
  if (month >= 6 && month <= 8) return { quarter: 2, year: calYear }
  if (month >= 9 && month <= 11) return { quarter: 3, year: calYear }
  // Jan-Mar: tax year quarter 4 of previous year
  return { quarter: 4, year: calYear - 1 }
}

function getTaxYear(date: Date): number {
  const month = date.getMonth()
  return month >= 3 ? date.getFullYear() : date.getFullYear() - 1
}

function getQuarterLabel(q: number, year: number): string {
  const labels = ['Apr–Jun', 'Jul–Sep', 'Oct–Dec', 'Jan–Mar']
  const endYear = q === 4 ? year + 1 : year
  return `Q${q} ${labels[q - 1]} ${q === 4 ? endYear : year}`
}

function toDateString(d: Date): string {
  return d.toISOString().split('T')[0]
}

function formatCurrency(n: number): string {
  return '£' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExpenseTrackerClient() {
  const today = toDateString(new Date())

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loaded, setLoaded] = useState(false)

  // Add form
  const [formType, setFormType] = useState<TransactionType>('expense')
  const [formDate, setFormDate] = useState(today)
  const [formCategory, setFormCategory] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formError, setFormError] = useState('')

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Partial<Transaction>>({})

  // Filters
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  // Sort
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Quarter view
  const now = new Date()
  const currentTaxYear = getTaxYear(now)
  const currentQ = getQuarterFromDate(toDateString(now))
  const [selectedQuarter, setSelectedQuarter] = useState(currentQ.quarter)
  const [selectedYear, setSelectedYear] = useState(currentQ.year)

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [clearConfirm, setClearConfirm] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setTransactions(JSON.parse(stored))
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  // Save to localStorage
  const save = useCallback((txns: Transaction[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(txns))
    } catch {
      // ignore
    }
  }, [])

  const setAndSave = (txns: Transaction[]) => {
    setTransactions(txns)
    save(txns)
  }

  // Add transaction
  const handleAdd = () => {
    setFormError('')
    const amount = parseFloat(formAmount)
    if (!formDate) { setFormError('Please enter a date.'); return }
    if (!formCategory) { setFormError('Please select a category.'); return }
    if (!formAmount || isNaN(amount) || amount <= 0) { setFormError('Please enter a valid amount.'); return }

    const txn: Transaction = {
      id: generateId(),
      date: formDate,
      type: formType,
      category: formCategory,
      description: formDescription.trim(),
      amount,
    }
    setAndSave([...transactions, txn])
    setFormCategory('')
    setFormDescription('')
    setFormAmount('')
    setFormDate(today)
  }

  // Delete
  const handleDelete = (id: string) => {
    setAndSave(transactions.filter(t => t.id !== id))
    setDeleteConfirmId(null)
  }

  // Edit
  const startEdit = (txn: Transaction) => {
    setEditingId(txn.id)
    setEditFields({ ...txn })
  }
  const saveEdit = () => {
    if (!editingId || !editFields.amount || editFields.amount <= 0) return
    setAndSave(transactions.map(t => t.id === editingId ? { ...t, ...editFields } as Transaction : t))
    setEditingId(null)
    setEditFields({})
  }

  // Filter & sort
  const filtered = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => !filterCategory || t.category === filterCategory)
    .filter(t => !filterFrom || t.date >= filterFrom)
    .filter(t => !filterTo || t.date <= filterTo)
    .sort((a, b) => {
      let cmp = 0
      if (sortField === 'date') cmp = a.date.localeCompare(b.date)
      else if (sortField === 'amount') cmp = a.amount - b.amount
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  // Quarter data
  const quarterTxns = transactions.filter(t => {
    const q = getQuarterFromDate(t.date)
    return q.quarter === selectedQuarter && q.year === selectedYear
  })

  const quarterIncome = quarterTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const quarterExpenses = quarterTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const quarterNet = quarterIncome - quarterExpenses

  // Year-to-date
  const ytd = transactions.filter(t => getTaxYear(new Date(t.date)) === selectedYear)
  const ytdIncome = ytd.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const ytdExpenses = ytd.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const ytdNet = ytdIncome - ytdExpenses

  // Monthly chart data (last 6 months)
  const monthlyData = (() => {
    const months: { label: string; income: number; expenses: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const year = d.getFullYear()
      const month = d.getMonth()
      const monthTxns = transactions.filter(t => {
        const td = new Date(t.date)
        return td.getFullYear() === year && td.getMonth() === month
      })
      months.push({
        label: d.toLocaleString('en-GB', { month: 'short' }),
        income: monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }
    return months
  })()

  const maxBarValue = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses)), 1)

  // CSV export
  const exportCSV = (txns: Transaction[], filename: string) => {
    const header = 'Date,Type,Category,Description,Amount (£)\n'
    const rows = txns.map(t => `${t.date},${t.type},${t.category},"${t.description.replace(/"/g, '""')}",${t.amount.toFixed(2)}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportQuarterlySummaryCSV = () => {
    const content = `Quarter,Income,Expenses,Net Profit/Loss\n${getQuarterLabel(selectedQuarter, selectedYear)},${quarterIncome.toFixed(2)},${quarterExpenses.toFixed(2)},${quarterNet.toFixed(2)}`
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nith-quarterly-summary-Q${selectedQuarter}-${selectedYear}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const categories = formType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

  // Available quarters (from transactions + current)
  const availableQuarters = (() => {
    const seen = new Set<string>()
    const result: { quarter: number; year: number }[] = []
    ;[...transactions.map(t => getQuarterFromDate(t.date)), currentQ].forEach(q => {
      const key = `${q.year}-${q.quarter}`
      if (!seen.has(key)) { seen.add(key); result.push(q) }
    })
    return result.sort((a, b) => a.year !== b.year ? b.year - a.year : b.quarter - a.quarter)
  })()

  const inputStyle = {
    padding: '9px 12px',
    border: '1px solid rgba(27,42,74,0.2)',
    borderRadius: 6,
    fontSize: 13,
    color: '#1B2A4A',
    fontFamily: 'inherit',
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  const thStyle = (field: SortField) => ({
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 700,
    color: '#5A6A7A',
    textAlign: 'left' as const,
    cursor: 'pointer',
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    background: sortField === field ? 'rgba(27,42,74,0.04)' : 'transparent',
  })

  if (!loaded) return null

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* Privacy notice */}
      <div style={{ background: 'rgba(212,168,75,0.1)', border: '1px solid rgba(212,168,75,0.3)', borderRadius: 8, padding: '10px 16px', marginBottom: 24, fontSize: 12, color: '#4A5A6A', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>🔒</span>
        <span>Your data is stored locally in your browser. It never leaves your device.</span>
      </div>

      {/* Add transaction */}
      <div style={{ background: '#F5F0E6', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', marginBottom: 16, fontWeight: 400 }}>
          Add transaction
        </h2>

        {/* Type toggle */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '2px solid rgba(27,42,74,0.15)', width: 'fit-content' }}>
          {(['income', 'expense'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setFormType(t); setFormCategory('') }}
              style={{
                padding: '9px 24px',
                border: 'none',
                background: formType === t ? (t === 'income' ? '#27ae60' : '#c0392b') : '#fff',
                color: formType === t ? '#fff' : '#5A6A7A',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              {t === 'income' ? '+ Income' : '− Expense'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 2fr auto', gap: 10, alignItems: 'end' }} className="add-form-grid">
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>Date</label>
            <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>Category</label>
            <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>Amount (£)</label>
            <input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>Description</label>
            <input type="text" value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Optional note..." style={inputStyle} />
          </div>
          <div>
            <button
              onClick={handleAdd}
              style={{ padding: '9px 20px', background: '#D4A84B', color: '#1B2A4A', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Add
            </button>
          </div>
        </div>
        {formError && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 8 }}>{formError}</p>}
      </div>

      {/* Quarter summary */}
      <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', margin: 0, fontWeight: 400 }}>
            Quarterly Summary
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={`${selectedYear}-${selectedQuarter}`}
              onChange={e => {
                const [y, q] = e.target.value.split('-').map(Number)
                setSelectedYear(y)
                setSelectedQuarter(q)
              }}
              style={{ ...inputStyle, width: 'auto', fontSize: 12 }}
            >
              {availableQuarters.map(q => (
                <option key={`${q.year}-${q.quarter}`} value={`${q.year}-${q.quarter}`}>
                  {getQuarterLabel(q.quarter, q.year)}
                </option>
              ))}
            </select>
            <button onClick={() => exportCSV(quarterTxns, `nith-transactions-Q${selectedQuarter}-${selectedYear}.csv`)} style={{ padding: '7px 14px', fontSize: 11, fontWeight: 600, background: 'rgba(27,42,74,0.06)', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, cursor: 'pointer', color: '#1B2A4A', whiteSpace: 'nowrap' }}>
              Export CSV
            </button>
            <button onClick={exportQuarterlySummaryCSV} style={{ padding: '7px 14px', fontSize: 11, fontWeight: 600, background: 'rgba(27,42,74,0.06)', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, cursor: 'pointer', color: '#1B2A4A', whiteSpace: 'nowrap' }}>
              Summary CSV
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }} className="summary-grid">
          {[
            { label: 'Income', value: quarterIncome, color: '#27ae60' },
            { label: 'Expenses', value: quarterExpenses, color: '#c0392b' },
            { label: 'Net profit', value: quarterNet, color: quarterNet >= 0 ? '#27ae60' : '#c0392b' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#F5F0E6', borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color }}>{formatCurrency(value)}</div>
            </div>
          ))}
        </div>

        {/* Year-to-date */}
        <div style={{ borderTop: '1px solid rgba(27,42,74,0.08)', paddingTop: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#5A6A7A', marginBottom: 8 }}>
            Year-to-date ({selectedYear}/{String(selectedYear + 1).slice(-2)} tax year)
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#27ae60' }}>Income: <strong>{formatCurrency(ytdIncome)}</strong></span>
            <span style={{ fontSize: 13, color: '#c0392b' }}>Expenses: <strong>{formatCurrency(ytdExpenses)}</strong></span>
            <span style={{ fontSize: 13, color: ytdNet >= 0 ? '#27ae60' : '#c0392b' }}>Net: <strong>{formatCurrency(ytdNet)}</strong></span>
          </div>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', marginBottom: 20, fontWeight: 400 }}>
          Last 6 months
        </h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 120 }}>
          {monthlyData.map(m => {
            const incomeH = maxBarValue > 0 ? (m.income / maxBarValue) * 100 : 0
            const expH = maxBarValue > 0 ? (m.expenses / maxBarValue) * 100 : 0
            return (
              <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 90 }}>
                  <div
                    title={`Income: ${formatCurrency(m.income)}`}
                    style={{
                      flex: 1,
                      background: 'rgba(39,174,96,0.7)',
                      height: `${incomeH}%`,
                      borderRadius: '3px 3px 0 0',
                      minHeight: incomeH > 0 ? 2 : 0,
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <div
                    title={`Expenses: ${formatCurrency(m.expenses)}`}
                    style={{
                      flex: 1,
                      background: 'rgba(192,57,43,0.65)',
                      height: `${expH}%`,
                      borderRadius: '3px 3px 0 0',
                      minHeight: expH > 0 ? 2 : 0,
                      transition: 'height 0.5s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, color: '#9AA8B8', fontWeight: 600 }}>{m.label}</span>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A6A7A' }}>
            <div style={{ width: 12, height: 12, background: 'rgba(39,174,96,0.7)', borderRadius: 2 }} /> Income
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A6A7A' }}>
            <div style={{ width: 12, height: 12, background: 'rgba(192,57,43,0.65)', borderRadius: 2 }} /> Expenses
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', margin: 0, fontWeight: 400 }}>
            Transactions ({filtered.length})
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => exportCSV(filtered, 'nith-transactions.csv')} style={{ padding: '7px 14px', fontSize: 11, fontWeight: 600, background: 'rgba(27,42,74,0.06)', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, cursor: 'pointer', color: '#1B2A4A' }}>
              Export all CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 10, marginBottom: 16, alignItems: 'end' }} className="filter-grid">
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>Type</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value as FilterType)} style={{ ...inputStyle, width: 'auto' }}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>Category</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={inputStyle}>
              <option value="">All categories</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>From</label>
            <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4 }}>To</label>
            <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
          </div>
        </div>

        {/* Table */}
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#5A6A7A' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1B2A4A', fontWeight: 400, marginBottom: 8 }}>
              No transactions yet
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
              Start tracking your income and expenses above. This tool helps you build the digital record-keeping habit you&apos;ll need for Making Tax Digital.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#5A6A7A', fontSize: 14 }}>
            No transactions match your filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)' }}>
                  <th style={thStyle('date')} onClick={() => toggleSort('date')}>
                    Date {sortField === 'date' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#5A6A7A', textAlign: 'left' }}>Type</th>
                  <th style={thStyle('category')} onClick={() => toggleSort('category')}>
                    Category {sortField === 'category' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#5A6A7A', textAlign: 'left' }}>Description</th>
                  <th style={thStyle('amount')} onClick={() => toggleSort('amount')}>
                    Amount {sortField === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#5A6A7A', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(txn => (
                  editingId === txn.id ? (
                    <tr key={txn.id} style={{ background: 'rgba(212,168,75,0.06)', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                      <td style={{ padding: '8px 14px' }}>
                        <input type="date" value={editFields.date ?? txn.date} onChange={e => setEditFields(f => ({ ...f, date: e.target.value }))} style={{ ...inputStyle, fontSize: 12, padding: '5px 8px' }} />
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <select value={editFields.type ?? txn.type} onChange={e => setEditFields(f => ({ ...f, type: e.target.value as TransactionType, category: '' }))} style={{ ...inputStyle, fontSize: 12, padding: '5px 8px' }}>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <select value={editFields.category ?? txn.category} onChange={e => setEditFields(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, fontSize: 12, padding: '5px 8px' }}>
                          {(editFields.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <input type="text" value={editFields.description ?? txn.description} onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, fontSize: 12, padding: '5px 8px' }} />
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <input type="number" value={editFields.amount ?? txn.amount} onChange={e => setEditFields(f => ({ ...f, amount: parseFloat(e.target.value) }))} min="0.01" step="0.01" style={{ ...inputStyle, fontSize: 12, padding: '5px 8px', width: 80 }} />
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={saveEdit} style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Save</button>
                          <button onClick={() => { setEditingId(null); setEditFields({}) }} style={{ padding: '4px 10px', fontSize: 11, background: 'none', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 4, cursor: 'pointer', color: '#5A6A7A' }}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={txn.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)', transition: 'background 0.1s' }}>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: '#5A6A7A' }}>{txn.date}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: txn.type === 'income' ? 'rgba(39,174,96,0.12)' : 'rgba(192,57,43,0.1)', color: txn.type === 'income' ? '#27ae60' : '#c0392b' }}>
                          {txn.type}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: '#1B2A4A' }}>{txn.category}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: '#5A6A7A', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.description || '—'}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: txn.type === 'income' ? '#27ae60' : '#c0392b' }}>
                        {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount)}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {deleteConfirmId === txn.id ? (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: '#c0392b' }}>Delete?</span>
                            <button onClick={() => handleDelete(txn.id)} style={{ padding: '3px 8px', fontSize: 11, fontWeight: 700, background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} style={{ padding: '3px 8px', fontSize: 11, background: 'none', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 4, cursor: 'pointer', color: '#5A6A7A' }}>No</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => startEdit(txn)} style={{ padding: '4px 10px', fontSize: 11, background: 'rgba(27,42,74,0.06)', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 4, cursor: 'pointer', color: '#1B2A4A' }}>Edit</button>
                            <button onClick={() => setDeleteConfirmId(txn.id)} style={{ padding: '4px 10px', fontSize: 11, background: 'none', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 4, cursor: 'pointer', color: '#c0392b' }}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clear data */}
      {transactions.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {clearConfirm ? (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#c0392b' }}>Are you sure? This cannot be undone.</span>
              <button onClick={() => { setAndSave([]); setClearConfirm(false) }} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 700, background: '#c0392b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Yes, clear all data</button>
              <button onClick={() => setClearConfirm(false)} style={{ padding: '7px 16px', fontSize: 12, background: 'none', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, cursor: 'pointer', color: '#5A6A7A' }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setClearConfirm(true)} style={{ fontSize: 12, color: '#9AA8B8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Clear all data
            </button>
          )}
        </div>
      )}

      {/* CTA */}
      <div style={{ background: '#1B2A4A', borderRadius: 12, padding: '36px', textAlign: 'center', marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Need a website that works as hard as you do?
        </h3>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.65)', marginBottom: 24 }}>
          Nith Digital builds modern websites for small businesses across Dumfries & Galloway. Professional, affordable, and built to get you found.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ display: 'inline-block', padding: '12px 28px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Book a free call
          </Link>
          <Link href="/services" style={{ display: 'inline-block', padding: '12px 28px', border: '2px solid rgba(245,240,230,0.3)', color: '#F5F0E6', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            View our services
          </Link>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#9AA8B8' }}>
        Built by <a href="https://nithdigital.uk" style={{ color: '#9AA8B8' }}>Nith Digital</a>
      </p>

      <style>{`
        @media (max-width: 700px) {
          .add-form-grid { grid-template-columns: 1fr !important; }
          .filter-grid { grid-template-columns: 1fr 1fr !important; }
          .summary-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .filter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
