'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { formatCurrency } from '@/lib/taxCalc'
import { useDemo } from '@/lib/demo-context'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

interface LineItem { description: string; quantity: number; unit_price: number }

function DemoNewInvoiceForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { data, updateData } = useDemo()
  const preselectedClient = params.get('client') || ''

  const [clientId, setClientId] = useState(preselectedClient)
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().split('T')[0]
  })
  const [vatRate, setVatRate] = useState(0)
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price: 0 }])
  const [notes, setNotes] = useState('')

  const client = data.clients.find(c => c.id === clientId)
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const vatAmount = subtotal * vatRate / 100
  const total = subtotal + vatAmount

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0 }])
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx))
  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const save = () => {
    if (!clientId) { alert('Please select a client.'); return }
    const nextNum = Math.max(...data.invoices.map(i => parseInt(i.invoice_number.replace('INV-', '')))) + 1
    const newInvoice = {
      id: `demo-new-inv-${Date.now()}`,
      invoice_number: `INV-${String(nextNum).padStart(4, '0')}`,
      client_id: clientId,
      client_name: client?.name || 'Unknown',
      issue_date: issueDate,
      due_date: dueDate,
      status: 'draft',
      subtotal,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      total,
      notes: notes || null,
      payment_terms: 'Payment due within 14 days of invoice date.',
      items: items.map(i => ({ ...i, total: i.quantity * i.unit_price })),
    }
    updateData(prev => ({ ...prev, invoices: [newInvoice, ...prev.invoices] }))
    router.push(`/os/demo/invoices/${newInvoice.id}`)
  }

  return (
    <div>
      <OSPageHeader title="Create Invoice" />
      <div style={{ padding: 32, maxWidth: 760 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Client + Dates */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Client</label>
                <select value={clientId} onChange={e => setClientId(e.target.value)} style={inputStyle}>
                  <option value="">Select client...</option>
                  {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Issue date</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Due date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>VAT rate (%)</label>
                <select value={vatRate} onChange={e => setVatRate(Number(e.target.value))} style={inputStyle}>
                  <option value={0}>0% (no VAT)</option>
                  <option value={20}>20% standard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>Line items</h3>
            <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12, minWidth: 400 }}>
              <thead>
                <tr style={{ background: '#F5F0E6' }}>
                  {['Description', 'Qty', 'Unit price', 'Total', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: i > 0 && i < 4 ? 'right' : 'left', padding: '8px 12px', fontSize: 11, textTransform: 'uppercase', color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px 4px' }}>
                      <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Description" style={{ ...inputStyle, fontSize: 13 }} />
                    </td>
                    <td style={{ padding: '6px 4px', width: 60 }}>
                      <input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 1)} style={{ ...inputStyle, fontSize: 13, textAlign: 'right' }} />
                    </td>
                    <td style={{ padding: '6px 4px', width: 100 }}>
                      <input type="number" min={0} step={0.01} value={item.unit_price || ''} onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)} placeholder="0.00" style={{ ...inputStyle, fontSize: 13, textAlign: 'right' }} />
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600, fontSize: 13 }}>{formatCurrency(item.quantity * item.unit_price)}</td>
                    <td style={{ padding: '6px 4px', width: 32 }}>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Trash2 size={13} color="#EF4444" /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
            <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#D4A84B', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Plus size={13} /> Add line item
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 32 }}><span style={{ color: '#5A6A7A' }}>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div style={{ display: 'flex', gap: 32 }}><span style={{ color: '#5A6A7A' }}>VAT ({vatRate}%)</span><span>{formatCurrency(vatAmount)}</span></div>
              <div style={{ display: 'flex', gap: 32, fontWeight: 700, fontSize: 15, borderTop: '2px solid #1B2A4A', paddingTop: 8 }}><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 24 }}>
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Optional notes for the client..." />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Save invoice (demo)
            </button>
            <Link href="/os/demo/invoices" style={{ padding: '10px 20px', background: '#F5F0E6', color: '#5A6A7A', borderRadius: 100, fontSize: 13 }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DemoNewInvoicePage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, color: '#5A6A7A' }}>Loading...</div>}>
      <DemoNewInvoiceForm />
    </Suspense>
  )
}
