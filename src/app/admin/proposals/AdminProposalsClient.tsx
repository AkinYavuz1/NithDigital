'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Download, Edit, Trash2, Copy, Send, CheckCircle } from 'lucide-react'

interface Proposal {
  id: string
  business_name: string
  contact_name: string | null
  contact_email: string | null
  business_type: string
  selected_services: string[]
  custom_bullets: string[]
  pricing_model: string
  estimated_price_low: number | null
  estimated_price_high: number | null
  monthly_cost: number | null
  notes: string | null
  demo_url: string | null
  status: string
  public_token: string
  sent_at: string | null
  created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: 'rgba(107,114,128,0.12)', color: '#6B7280' },
  sent: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  viewed: { bg: 'rgba(212,168,75,0.12)', color: '#D4A84B' },
  accepted: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  declined: { bg: 'rgba(239,68,68,0.12)', color: '#DC2626' },
}

const BIZ_LABELS: Record<string, string> = {
  tradesperson: 'Tradesperson',
  bnb: 'B&B / Holiday Let',
  restaurant: 'Restaurant / Café',
  retail: 'Retail / Shop',
  professional: 'Professional Services',
  health_beauty: 'Health & Beauty',
  agriculture: 'Agriculture / Rural',
  community: 'Community / Non-profit',
  other: 'Other',
}

function fmt(n: number) { return '£' + n.toLocaleString('en-GB') }

export default function AdminProposalsClient() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sendModal, setSendModal] = useState<Proposal | null>(null)
  const [emailCopied, setEmailCopied] = useState(false)
  const [toast, setToast] = useState('')
  const router = useRouter()

  const fetchProposals = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('proposals').select('*').order('created_at', { ascending: false })
    if (data) setProposals(data)
    setLoading(false)
  }

  useEffect(() => { fetchProposals() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const deleteProposal = async (id: string) => {
    if (!confirm('Delete this proposal?')) return
    const supabase = createClient()
    await supabase.from('proposals').delete().eq('id', id)
    setProposals(prev => prev.filter(p => p.id !== id))
    showToast('Proposal deleted')
  }

  const duplicateProposal = async (p: Proposal) => {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, public_token, sent_at, ...rest } = p
    const { data } = await supabase.from('proposals').insert({ ...rest, status: 'draft', business_name: rest.business_name + ' (copy)' }).select().single()
    if (data) {
      setProposals(prev => [data, ...prev])
      showToast('Proposal duplicated')
    }
  }

  const openSendModal = (p: Proposal) => {
    setSendModal(p)
    setEmailCopied(false)
  }

  const handleSend = async () => {
    if (!sendModal) return
    const link = `${window.location.origin}/proposal/view/${sendModal.public_token}`
    const subject = `Website proposal for ${sendModal.business_name}`
    const name = sendModal.contact_name ? sendModal.contact_name.split(' ')[0] : 'there'
    const body = `Hi ${name},\n\nI put together a quick proposal for a website based on what we discussed. You can view it here: ${link}\n\nHappy to chat through it whenever suits — feel free to book a call at nithdigital.uk/book or just drop me an email.\n\nCheers,\nAkin`
    const emailText = `Subject: ${subject}\n\n${body}`
    await navigator.clipboard.writeText(emailText)
    setEmailCopied(true)

    const supabase = createClient()
    await supabase.from('proposals').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', sendModal.id)
    setProposals(prev => prev.map(p => p.id === sendModal.id ? { ...p, status: 'sent', sent_at: new Date().toISOString() } : p))
  }

  const downloadPDF = async (p: Proposal) => {
    const { generateProposalPDF } = await import('./proposalPdf')
    await generateProposalPDF(p)
  }

  const filtered = statusFilter === 'all' ? proposals : proposals.filter(p => p.status === statusFilter)

  const now = new Date()
  const thisMonth = proposals.filter(p => {
    const d = new Date(p.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const sentThisMonth = thisMonth.filter(p => p.status === 'sent' || p.status === 'viewed' || p.status === 'accepted')
  const accepted = proposals.filter(p => p.status === 'accepted')
  const sent = proposals.filter(p => ['sent', 'viewed', 'accepted', 'declined'].includes(p.status))
  const acceptanceRate = sent.length > 0 ? Math.round((accepted.length / sent.length) * 100) : 0

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Proposals</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A' }}>{proposals.length} total proposals</p>
        </div>
        <Link href="/admin/proposals/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          <Plus size={14} /> New proposal
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }} className="admin-prop-stats">
        {[
          { label: 'Total proposals', value: proposals.length },
          { label: 'Sent this month', value: sentThisMonth.length },
          { label: 'Acceptance rate', value: `${acceptanceRate}%` },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 20, border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#5A6A7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'draft', 'sent', 'viewed', 'accepted', 'declined'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none',
              background: statusFilter === s ? '#1B2A4A' : 'rgba(27,42,74,0.06)',
              color: statusFilter === s ? '#F5F0E6' : '#5A6A7A',
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
                {['Business', 'Contact', 'Type', 'Estimate', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#5A6A7A' }}>No proposals yet</td></tr>
              ) : filtered.map((p, i) => {
                const sc = STATUS_COLORS[p.status] || STATUS_COLORS.draft
                return (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 500, color: '#1B2A4A' }}>{p.business_name}</td>
                    <td style={{ padding: '12px 14px', color: '#5A6A7A' }}>
                      {p.contact_name || '—'}
                      {p.contact_email && <div style={{ fontSize: 11 }}>{p.contact_email}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#5A6A7A' }}>{BIZ_LABELS[p.business_type] || p.business_type}</td>
                    <td style={{ padding: '12px 14px', color: '#1B2A4A', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {p.pricing_model === 'startup' ? '£0 upfront / £40/mo' :
                        p.estimated_price_low && p.estimated_price_high
                          ? `${fmt(p.estimated_price_low)} – ${fmt(p.estimated_price_high)}`
                          : '—'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: sc.bg, color: sc.color }}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#5A6A7A', fontSize: 11, whiteSpace: 'nowrap' }}>
                      {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => router.push(`/admin/proposals/${p.id}/edit`)} title="Edit" style={iconBtn}><Edit size={13} /></button>
                        <button onClick={() => duplicateProposal(p)} title="Duplicate" style={iconBtn}><Copy size={13} /></button>
                        <button onClick={() => downloadPDF(p)} title="Download PDF" style={iconBtn}><Download size={13} /></button>
                        {p.status === 'draft' && (
                          <button onClick={() => openSendModal(p)} title="Send" style={{ ...iconBtn, color: '#3B82F6' }}><Send size={13} /></button>
                        )}
                        <button onClick={() => deleteProposal(p.id)} title="Delete" style={{ ...iconBtn, color: '#DC2626' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Send Modal */}
      {sendModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 500, width: '100%', margin: '0 16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>Send proposal to {sendModal.business_name}</h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 20 }}>The email text will be copied to your clipboard. Paste it into your email client.</p>
            <div style={{ background: '#F5F0E6', borderRadius: 8, padding: 16, fontSize: 12, color: '#1B2A4A', lineHeight: 1.7, marginBottom: 24, fontFamily: 'monospace' }}>
              <strong>Subject:</strong> Website proposal for {sendModal.business_name}<br /><br />
              Hi {sendModal.contact_name ? sendModal.contact_name.split(' ')[0] : 'there'},<br /><br />
              I put together a quick proposal for a website based on what we discussed. You can view it here:<br />
              <span style={{ color: '#1B2A4A', textDecoration: 'underline' }}>{typeof window !== 'undefined' ? window.location.origin : ''}/proposal/view/{sendModal.public_token}</span><br /><br />
              Happy to chat through it whenever suits — feel free to book a call at nithdigital.uk/book or just drop me an email.<br /><br />
              Cheers,<br />Nith Digital
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setSendModal(null)} style={{ padding: '9px 18px', borderRadius: 100, border: '1px solid rgba(27,42,74,0.2)', background: 'none', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              {emailCopied ? (
                <button style={{ padding: '9px 18px', borderRadius: 100, background: '#16a34a', color: '#fff', border: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={13} /> Copied! Status updated to Sent
                </button>
              ) : (
                <button onClick={handleSend} style={{ padding: '9px 18px', borderRadius: 100, background: '#1B2A4A', color: '#F5F0E6', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                  Copy email & mark as sent
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1B2A4A', color: '#F5F0E6', padding: '12px 20px', borderRadius: 8, fontSize: 13, zIndex: 100 }}>
          {toast}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .admin-prop-stats { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'rgba(27,42,74,0.06)',
  border: 'none',
  borderRadius: 6,
  padding: '5px 7px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: '#5A6A7A',
}
