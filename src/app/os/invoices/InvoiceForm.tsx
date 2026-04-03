'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import OSPageHeader from '@/components/OSPageHeader'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/taxCalc'

interface LineItem { description: string; quantity: number; unit_price: number; total: number }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8,
  fontFamily: 'inherit', fontSize: 14, outline: 'none', color: '#1B2A4A',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A',
  textTransform: 'uppercase', letterSpacing: '0.5px',
}

interface InvoiceFormProps { invoiceId?: string }

export default function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = !!invoiceId
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    client_id: searchParams.get('client') || '',
    invoice_number: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    vat_rate: 0,
    notes: '',
    payment_terms: 'Payment due within 30 days of invoice date.',
  })
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price: 0, total: 0 }])
  const [saving, setSaving] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.total, 0)
  const vatAmount = subtotal * (form.vat_rate / 100)
  const total = subtotal + vatAmount

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: cls } = await supabase.from('clients').select('id, name').eq('user_id', data.user.id).order('name')
      setClients(cls || [])
      // Auto-generate invoice number
      const { data: lastInv } = await supabase.from('invoices').select('invoice_number').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(1)
      const prefix = 'INV'
      const lastNum = lastInv?.[0]?.invoice_number?.match(/\d+$/)?.[0] ?? '000'
      const nextNum = String(parseInt(lastNum) + 1).padStart(3, '0')
      setForm(f => ({ ...f, invoice_number: `${prefix}-${nextNum}` }))
    })
    if (isEdit) {
      const supabase = createClient()
      supabase.from('invoices').select('*, invoice_items(*)').eq('id', invoiceId).single().then(({ data }) => {
        if (data) {
          setForm({ client_id: data.client_id || '', invoice_number: data.invoice_number, issue_date: data.issue_date, due_date: data.due_date, vat_rate: data.vat_rate, notes: data.notes || '', payment_terms: data.payment_terms || '' })
          setItems(data.invoice_items?.sort((a: LineItem & { sort_order: number }, b: LineItem & { sort_order: number }) => a.sort_order - b.sort_order) || [])
        }
      })
    }
  }, [invoiceId, isEdit])

  const updateItem = (i: number, field: keyof LineItem, val: string | number) => {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: val }
    if (field === 'quantity' || field === 'unit_price') {
      updated[i].total = updated[i].quantity * updated[i].unit_price
    }
    setItems(updated)
  }

  const save = async (status: string) => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { ...form, user_id: user.id, subtotal, vat_amount: vatAmount, total, status }
    let invId = invoiceId
    if (isEdit) {
      await supabase.from('invoices').update(payload).eq('id', invoiceId)
      await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId)
    } else {
      const { data } = await supabase.from('invoices').insert([payload]).select().single()
      invId = data?.id
    }
    if (invId) {
      await supabase.from('invoice_items').insert(items.map((item, idx) => ({ ...item, invoice_id: invId, sort_order: idx })))
    }
    router.push('/os/invoices')
  }

  return (
    <div>
      <OSPageHeader title={isEdit ? 'Edit Invoice' : 'New Invoice'} />
      <div style={{ padding: 32, maxWidth: 800 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Client</label>
              <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} style={inputStyle}>
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Invoice number</label>
              <input value={form.invoice_number} onChange={e => setForm({ ...form, invoice_number: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Issue date</label>
              <input type="date" value={form.issue_date} onChange={e => setForm({ ...form, issue_date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Due date</label>
              <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={inputStyle} />
            </div>
          </div>

          {/* Line items */}
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Line items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr>
                {['Description', 'Qty', 'Unit price', 'Total', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500, borderBottom: '1px solid rgba(27,42,74,0.08)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '6px 8px 6px 0', width: '50%' }}>
                    <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Description" style={{ ...inputStyle, padding: '8px 10px' }} />
                  </td>
                  <td style={{ padding: '6px 4px', width: 80 }}>
                    <input type="number" value={item.quantity} min={0} step={0.01} onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '8px 10px' }} />
                  </td>
                  <td style={{ padding: '6px 4px', width: 120 }}>
                    <input type="number" value={item.unit_price} min={0} step={0.01} onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '8px 10px' }} />
                  </td>
                  <td style={{ padding: '6px 4px', width: 100, fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                  <td style={{ padding: '6px 4px', width: 32 }}>
                    {items.length > 1 && (
                      <button onClick={() => setItems(items.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={14} color="#EF4444" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setItems([...items, { description: '', quantity: 1, unit_price: 0, total: 0 }])}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#F5F0E6', border: '1px dashed rgba(27,42,74,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#5A6A7A', marginBottom: 24 }}>
            <Plus size={14} /> Add line item
          </button>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 32, fontSize: 13 }}>
              <span style={{ color: '#5A6A7A' }}>Subtotal</span>
              <span style={{ fontWeight: 600, minWidth: 80, textAlign: 'right' }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', gap: 32, fontSize: 13, alignItems: 'center' }}>
              <span style={{ color: '#5A6A7A' }}>VAT</span>
              <select value={form.vat_rate} onChange={e => setForm({ ...form, vat_rate: Number(e.target.value) })}
                style={{ padding: '4px 8px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 13, outline: 'none' }}>
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={20}>20%</option>
              </select>
              <span style={{ fontWeight: 600, minWidth: 80, textAlign: 'right' }}>{formatCurrency(vatAmount)}</span>
            </div>
            <div style={{ display: 'flex', gap: 32, fontSize: 16, fontWeight: 700, borderTop: '2px solid #1B2A4A', paddingTop: 8, marginTop: 4 }}>
              <span>Total</span>
              <span style={{ minWidth: 80, textAlign: 'right' }}>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Notes & payment terms */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Payment terms</label>
              <textarea value={form.payment_terms} onChange={e => setForm({ ...form, payment_terms: e.target.value })} style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => save('draft')} disabled={saving}
              style={{ padding: '10px 24px', background: 'transparent', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: '1px solid rgba(27,42,74,0.2)', cursor: 'pointer' }}>
              Save as draft
            </button>
            <button onClick={() => save('sent')} disabled={saving}
              style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save & mark as sent'}
            </button>
            <Link href="/os/invoices" style={{ padding: '10px 24px', background: 'transparent', color: '#5A6A7A', borderRadius: 100, fontSize: 13, border: '1px solid rgba(27,42,74,0.1)' }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
