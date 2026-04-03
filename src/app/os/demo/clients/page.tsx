'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, FileText } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { useDemo } from '@/lib/demo-context'

export default function DemoClientsPage() {
  const { data } = useDemo()
  const [search, setSearch] = useState('')

  const filtered = data.clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <OSPageHeader
        title="Clients"
        description="Manage your client relationships"
        action={
          <Link href="/os/demo/clients/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> Add client
          </Link>
        }
      />
      <div style={{ padding: 32 }}>
        <div style={{ position: 'relative', maxWidth: 320, marginBottom: 24 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F5F0E6' }}>
                {['Name', 'Email', 'Phone', 'Location', 'Tags', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    <span style={{ color: '#1B2A4A' }}>{c.name}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#5A6A7A' }}>{c.email ?? '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#5A6A7A' }}>{c.phone ?? '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#5A6A7A' }}>{[c.city, c.postcode].filter(Boolean).join(', ') || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(c.tags || []).map(t => (
                        <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(27,42,74,0.08)', borderRadius: 100, color: '#1B2A4A' }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button title="Edit (demo)" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Edit size={14} color="#5A6A7A" /></button>
                      <Link href={`/os/demo/invoices/new?client=${c.id}`} title="New invoice"><FileText size={14} color="#5A6A7A" /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
