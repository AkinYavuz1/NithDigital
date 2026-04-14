'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react'

interface ServiceLine {
  service: string
  monthly_price: number
  duration_months: number
  total: number
}

interface SentProposal {
  id: string
  prospect_id: string | null
  business_name: string
  contact_email: string
  sent_at: string
  sent_from: string
  subject: string
  services_offered: ServiceLine[] | null
  total_monthly: number
  total_monthly_after_year: number
  discount_applied: string | null
  status: 'sent' | 'accepted' | 'declined' | 'no_response' | 'follow_up'
  follow_up_at: string | null
  notes: string | null
  created_at: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  accepted:    { bg: 'rgba(22,163,74,0.12)',   color: '#15803d', label: 'Accepted' },
  sent:        { bg: 'rgba(212,168,75,0.15)',  color: '#92660a', label: 'Sent' },
  follow_up:   { bg: 'rgba(212,168,75,0.15)',  color: '#92660a', label: 'Follow Up' },
  declined:    { bg: 'rgba(220,38,38,0.1)',    color: '#b91c1c', label: 'Declined' },
  no_response: { bg: 'rgba(107,114,128,0.12)', color: '#6B7280', label: 'No Response' },
}

const ALL_STATUSES = ['sent', 'accepted', 'declined', 'no_response', 'follow_up'] as const

function fmt(n: number | null | undefined) {
  if (n == null) return '—'
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtDate(s: string | null | undefined) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isOverdue(dateStr: string | null) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export default function ProposalsPipelineClient() {
  const [proposals, setProposals] = useState<SentProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [detailModal, setDetailModal] = useState<SentProposal | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchProposals = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('sent_at', { ascending: false })
    if (data) setProposals(data as SentProposal[])
    if (error) console.error('proposals fetch error:', error)
    setLoading(false)
  }

  useEffect(() => { fetchProposals() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: string, newStatus: SentProposal['status']) => {
    setUpdatingId(id)
    const supabase = createClient()
    const { error } = await supabase
      .from('proposals')
      .update({ status: newStatus })
      .eq('id', id)
    if (!error) {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
      if (detailModal?.id === id) setDetailModal(prev => prev ? { ...prev, status: newStatus } : prev)
      showToast('Status updated')
    } else {
      showToast('Failed to update status')
    }
    setUpdatingId(null)
  }

  const filtered = statusFilter === 'all'
    ? proposals
    : proposals.filter(p => p.status === statusFilter)

  // Summary stats
  const totalMonthlyPipeline = proposals
    .filter(p => p.status !== 'declined')
    .reduce((sum, p) => sum + (p.total_monthly || 0), 0)
  const accepted = proposals.filter(p => p.status === 'accepted')
  const pending = proposals.filter(p => p.status === 'sent' || p.status === 'follow_up')
  const declined = proposals.filter(p => p.status === 'declined')
  const noResponse = proposals.filter(p => p.status === 'no_response')

  const followUpsOverdue = proposals.filter(p =>
    (p.status === 'sent' || p.status === 'follow_up') && isOverdue(p.follow_up_at)
  )

  return (
    <div style={{ padding: '32px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 4, fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Proposals Pipeline</h1>
          <p style={{ fontSize: 14, color: '#5A6A7A' }}>
            {proposals.length} proposals sent
            {followUpsOverdue.length > 0 && (
              <span style={{ marginLeft: 10, color: '#b91c1c', fontWeight: 600 }}>
                · {followUpsOverdue.length} follow-up{followUpsOverdue.length > 1 ? 's' : ''} overdue
              </span>
            )}
          </p>
        </div>
        <button onClick={fetchProposals} style={iconBtnStyle}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="pipeline-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total sent', value: proposals.length, color: '#1B2A4A' },
          { label: 'Pipeline value / mo', value: fmt(totalMonthlyPipeline), color: '#D4A84B' },
          { label: 'Accepted', value: accepted.length, color: '#15803d' },
          { label: 'Pending / follow-up', value: pending.length, color: '#92660a' },
          { label: 'Declined', value: declined.length, color: '#b91c1c' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#5A6A7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Status filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', ...ALL_STATUSES] as const).map(s => {
          const style = s !== 'all' ? STATUS_STYLES[s] : null
          const count = s === 'all' ? proposals.length
            : s === 'no_response' ? noResponse.length
            : proposals.filter(p => p.status === s).length
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: statusFilter === s ? '#1B2A4A' : 'rgba(27,42,74,0.06)',
                color: statusFilter === s ? '#F5F0E6' : '#5A6A7A',
              }}
            >
              {s === 'all' ? 'All' : style?.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 13 }}>
          No proposals found
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(27,42,74,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(27,42,74,0.08)', background: 'rgba(27,42,74,0.02)' }}>
                {['Business', 'Sent', 'Services', 'Monthly', 'Status', 'Follow-up', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#5A6A7A', fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const sc = STATUS_STYLES[p.status] || STATUS_STYLES.no_response
                const isExpandedRow = expanded === p.id
                const overdueFollowUp = isOverdue(p.follow_up_at) && (p.status === 'sent' || p.status === 'follow_up')
                const serviceNames = Array.isArray(p.services_offered)
                  ? p.services_offered.map(s => s.service).join(', ')
                  : '—'

                return [
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: !isExpandedRow && i < filtered.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none',
                      background: isExpandedRow ? 'rgba(27,42,74,0.02)' : 'transparent',
                    }}
                  >
                    {/* Business */}
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#1B2A4A' }}>{p.business_name}</div>
                      <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 2 }}>{p.contact_email}</div>
                    </td>

                    {/* Sent date */}
                    <td style={{ padding: '13px 14px', color: '#5A6A7A', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {fmtDate(p.sent_at)}
                      {p.sent_from && (
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{p.sent_from}</div>
                      )}
                    </td>

                    {/* Services */}
                    <td style={{ padding: '13px 14px', color: '#5A6A7A', fontSize: 12, maxWidth: 220 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={serviceNames}>
                        {serviceNames}
                      </div>
                    </td>

                    {/* Monthly value */}
                    <td style={{ padding: '13px 14px', fontWeight: 600, color: '#1B2A4A', whiteSpace: 'nowrap' }}>
                      {fmt(p.total_monthly)}
                      {p.total_monthly_after_year && p.total_monthly_after_year !== p.total_monthly && (
                        <div style={{ fontSize: 11, color: '#5A6A7A', fontWeight: 400 }}>
                          {fmt(p.total_monthly_after_year)}/mo after yr 1
                        </div>
                      )}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                        background: sc.bg,
                        color: sc.color,
                        whiteSpace: 'nowrap',
                      }}>
                        {sc.label}
                      </span>
                    </td>

                    {/* Follow-up */}
                    <td style={{ padding: '13px 14px', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {p.follow_up_at ? (
                        <span style={{ color: overdueFollowUp ? '#b91c1c' : '#5A6A7A', fontWeight: overdueFollowUp ? 600 : 400 }}>
                          {overdueFollowUp ? '⚠ ' : ''}{fmtDate(p.follow_up_at)}
                        </span>
                      ) : (
                        <span style={{ color: '#9CA3AF' }}>—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          onClick={() => setDetailModal(p)}
                          style={{ ...actionBtn, color: '#1B2A4A' }}
                          title="View details"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setExpanded(isExpandedRow ? null : p.id)}
                          style={{ ...actionBtn, color: '#5A6A7A', paddingLeft: 6, paddingRight: 6 }}
                          title="Change status"
                        >
                          {isExpandedRow ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>,

                  // Inline status changer row
                  isExpandedRow && (
                    <tr key={`${p.id}-expand`} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                      <td colSpan={7} style={{ padding: '10px 14px 14px', background: 'rgba(27,42,74,0.02)' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 8 }}>UPDATE STATUS</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {ALL_STATUSES.map(s => {
                            const st = STATUS_STYLES[s]
                            const isCurrentStatus = p.status === s
                            return (
                              <button
                                key={s}
                                disabled={updatingId === p.id || isCurrentStatus}
                                onClick={() => updateStatus(p.id, s)}
                                style={{
                                  padding: '6px 14px',
                                  borderRadius: 100,
                                  fontSize: 12,
                                  fontWeight: isCurrentStatus ? 700 : 500,
                                  cursor: isCurrentStatus ? 'default' : 'pointer',
                                  border: isCurrentStatus ? `2px solid ${st.color}` : '1px solid rgba(27,42,74,0.15)',
                                  background: isCurrentStatus ? st.bg : '#fff',
                                  color: isCurrentStatus ? st.color : '#5A6A7A',
                                  opacity: updatingId === p.id && !isCurrentStatus ? 0.5 : 1,
                                }}
                              >
                                {st.label}
                                {isCurrentStatus && ' ✓'}
                              </button>
                            )
                          })}
                        </div>
                        {p.notes && (
                          <div style={{ marginTop: 12, fontSize: 12, color: '#5A6A7A', background: '#F5F0E6', borderRadius: 6, padding: '8px 12px', lineHeight: 1.6 }}>
                            <span style={{ fontWeight: 600, color: '#1B2A4A' }}>Notes: </span>{p.notes}
                          </div>
                        )}
                      </td>
                    </tr>
                  ),
                ]
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {detailModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setDetailModal(null) }}
        >
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            {/* Close */}
            <button
              onClick={() => setDetailModal(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}
            >
              <X size={18} />
            </button>

            {/* Title */}
            <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 6, fontWeight: 600 }}>Proposal</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 4, marginTop: 0 }}>{detailModal.business_name}</h2>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 20, marginTop: 0 }}>{detailModal.contact_email}</p>

            {/* Status + dates */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
              <span style={{
                padding: '5px 12px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                background: STATUS_STYLES[detailModal.status]?.bg,
                color: STATUS_STYLES[detailModal.status]?.color,
              }}>
                {STATUS_STYLES[detailModal.status]?.label}
              </span>
              <span style={{ fontSize: 12, color: '#5A6A7A' }}>Sent {fmtDate(detailModal.sent_at)}</span>
              {detailModal.sent_from && <span style={{ fontSize: 12, color: '#9CA3AF' }}>from {detailModal.sent_from}</span>}
            </div>

            {/* Subject */}
            {detailModal.subject && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 4 }}>SUBJECT</div>
                <div style={{ fontSize: 13, color: '#1B2A4A' }}>{detailModal.subject}</div>
              </div>
            )}

            {/* Services breakdown */}
            {Array.isArray(detailModal.services_offered) && detailModal.services_offered.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 10 }}>SERVICES OFFERED</div>
                <div style={{ border: '1px solid rgba(27,42,74,0.1)', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'rgba(27,42,74,0.03)', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                        {['Service', 'Monthly', 'Duration', 'Total'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#9CA3AF' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detailModal.services_offered.map((svc, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < (detailModal.services_offered?.length ?? 0) - 1 ? '1px solid rgba(27,42,74,0.06)' : 'none' }}>
                          <td style={{ padding: '9px 12px', color: '#1B2A4A', fontWeight: 500 }}>{svc.service}</td>
                          <td style={{ padding: '9px 12px', color: '#5A6A7A' }}>{fmt(svc.monthly_price)}/mo</td>
                          <td style={{ padding: '9px 12px', color: '#5A6A7A' }}>{svc.duration_months ? `${svc.duration_months} mo` : '—'}</td>
                          <td style={{ padding: '9px 12px', color: '#1B2A4A', fontWeight: 600 }}>{fmt(svc.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Totals */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#F5F0E6', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: '#92660a', fontWeight: 600, marginBottom: 2 }}>MONTHLY (NOW)</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A' }}>{fmt(detailModal.total_monthly)}</div>
              </div>
              {detailModal.total_monthly_after_year != null && detailModal.total_monthly_after_year !== detailModal.total_monthly && (
                <div style={{ background: 'rgba(27,42,74,0.04)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#5A6A7A', fontWeight: 600, marginBottom: 2 }}>MONTHLY (AFTER YR 1)</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A' }}>{fmt(detailModal.total_monthly_after_year)}</div>
                </div>
              )}
            </div>

            {/* Discount */}
            {detailModal.discount_applied && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 4 }}>DISCOUNT</div>
                <div style={{ fontSize: 13, color: '#5A6A7A' }}>{detailModal.discount_applied}</div>
              </div>
            )}

            {/* Follow-up */}
            {detailModal.follow_up_at && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 4 }}>FOLLOW-UP DATE</div>
                <div style={{ fontSize: 13, color: isOverdue(detailModal.follow_up_at) ? '#b91c1c' : '#5A6A7A', fontWeight: isOverdue(detailModal.follow_up_at) ? 600 : 400 }}>
                  {isOverdue(detailModal.follow_up_at) ? '⚠ Overdue — ' : ''}{fmtDate(detailModal.follow_up_at)}
                </div>
              </div>
            )}

            {/* Notes */}
            {detailModal.notes && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 4 }}>NOTES</div>
                <div style={{ fontSize: 13, color: '#1B2A4A', lineHeight: 1.7, background: '#F9F8F5', borderRadius: 6, padding: '10px 14px' }}>
                  {detailModal.notes}
                </div>
              </div>
            )}

            {/* Status changer inside modal */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 10 }}>UPDATE STATUS</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ALL_STATUSES.map(s => {
                  const st = STATUS_STYLES[s]
                  const isCurrent = detailModal.status === s
                  return (
                    <button
                      key={s}
                      disabled={updatingId === detailModal.id || isCurrent}
                      onClick={() => updateStatus(detailModal.id, s)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: isCurrent ? 700 : 500,
                        cursor: isCurrent ? 'default' : 'pointer',
                        border: isCurrent ? `2px solid ${st.color}` : '1px solid rgba(27,42,74,0.15)',
                        background: isCurrent ? st.bg : '#fff',
                        color: isCurrent ? st.color : '#5A6A7A',
                        opacity: updatingId === detailModal.id && !isCurrent ? 0.5 : 1,
                      }}
                    >
                      {st.label}
                      {isCurrent && ' ✓'}
                    </button>
                  )
                })}
              </div>
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
        @media (max-width: 1100px) {
          .pipeline-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .pipeline-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const actionBtn: React.CSSProperties = {
  background: 'rgba(27,42,74,0.06)',
  border: 'none',
  borderRadius: 6,
  padding: '5px 10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 12,
  fontWeight: 500,
}

const iconBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  background: 'rgba(27,42,74,0.06)',
  color: '#1B2A4A',
}
