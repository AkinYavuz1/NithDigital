'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  city: string | null
  postcode: string | null
  tags: string[]
  created_at: string
}

export default function ClientsClient() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('clients').select('*').eq('user_id', user.id).order('name')
    setClients(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return
    const supabase = createClient()
    await supabase.from('clients').delete().eq('id', id)
    setClients(clients.filter(c => c.id !== id))
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <OSPageHeader
        title="Clients"
        description="Manage your client relationships"
        action={
          <Link href="/os/clients/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> Add client
          </Link>
        }
      />
      <div style={{ padding: 32 }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 320, marginBottom: 24 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        {loading ? (
          <div style={{ color: '#5A6A7A', fontSize: 14 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#5A6A7A' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
            <p style={{ marginBottom: 16 }}>No clients yet.</p>
            <Link href="/os/clients/new" style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
              Add your first client
            </Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F5F0E6' }}>
                  {['Name', 'Email', 'Phone', 'Location', 'Tags', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      <Link href={`/os/clients/${c.id}`} style={{ color: '#1B2A4A' }}>{c.name}</Link>
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
                        <Link href={`/os/clients/${c.id}/edit`} title="Edit"><Edit size={14} color="#5A6A7A" /></Link>
                        <Link href={`/os/invoices/new?client=${c.id}`} title="New invoice"><FileText size={14} color="#5A6A7A" /></Link>
                        <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Delete">
                          <Trash2 size={14} color="#EF4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
