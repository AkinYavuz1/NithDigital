'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, RefreshCw, ChevronDown, ChevronUp, Mic, TrendingUp } from 'lucide-react'

interface Recording {
  id: string
  business_name: string
  contact_phone: string | null
  recording_url: string
  duration_secs: number | null
  transcript: string | null
  ai_summary: string | null
  outcome: string | null
  called_at: string
}

interface AISummary {
  score?: number
  outcome_summary?: string
  what_worked?: string
  what_to_improve?: string
  objections?: string[]
  objection_handling?: string
  coaching_tip?: string
}

const OUTCOME_LABELS: Record<string, { label: string; colour: string; bg: string }> = {
  interested:      { label: 'Interested',      colour: '#15803d', bg: 'rgba(34,197,94,0.1)' },
  not_interested:  { label: 'Not interested',  colour: '#b91c1c', bg: 'rgba(239,68,68,0.1)' },
  callback:        { label: 'Callback',         colour: '#92621a', bg: 'rgba(212,168,75,0.12)' },
  no_answer:       { label: 'No answer',        colour: '#5A6A7A', bg: 'rgba(27,42,74,0.08)' },
  voicemail:       { label: 'Voicemail',        colour: '#5A6A7A', bg: 'rgba(27,42,74,0.08)' },
}

function formatDuration(secs: number | null) {
  if (!secs) return '—'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function ScoreBar({ score }: { score: number }) {
  const colour = score >= 8 ? '#15803d' : score >= 6 ? '#92621a' : '#b91c1c'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(27,42,74,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score * 10}%`, height: '100%', background: colour, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: colour, width: 24 }}>{score}</span>
    </div>
  )
}

interface BatchItem {
  file: File
  businessName: string
  phone: string
  outcome: string
  status: 'pending' | 'uploading' | 'done' | 'error'
}

export default function RecordingsClient() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [batch, setBatch] = useState<BatchItem[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 5000)
  }

  const fetchRecordings = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/call-recordings')
    const data = await res.json()
    setRecordings(data.recordings || [])
    setLoading(false)
  }

  useEffect(() => { fetchRecordings() }, [])

  // Poll for transcription updates every 10s if any are pending
  useEffect(() => {
    const pending = recordings.some(r => !r.transcript)
    if (!pending) return
    const timer = setTimeout(fetchRecordings, 10000)
    return () => clearTimeout(timer)
  }, [recordings])

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const newItems: BatchItem[] = files.map(f => ({
      file: f,
      // Try to parse business name from Samsung filename e.g. "Record_20260412_123456_07700123456.m4a"
      businessName: '',
      phone: extractPhone(f.name),
      outcome: 'interested',
      status: 'pending',
    }))
    setBatch(prev => [...prev, ...newItems])
    e.target.value = ''
  }

  function extractPhone(filename: string): string {
    // Samsung call recorder format: Record_YYYYMMDD_HHMMSS_phonenumber.m4a
    const match = filename.match(/(\+?[\d]{7,15})/)
    return match ? match[1] : ''
  }

  const updateItem = (idx: number, patch: Partial<BatchItem>) => {
    setBatch(prev => prev.map((item, i) => i === idx ? { ...item, ...patch } : item))
  }

  const removeItem = (idx: number) => {
    setBatch(prev => prev.filter((_, i) => i !== idx))
  }

  const handleBatchUpload = async () => {
    const ready = batch.filter(b => b.status === 'pending')
    if (!ready.length) return
    const missing = batch.findIndex(b => b.status === 'pending' && !b.businessName.trim())
    if (missing !== -1) {
      showToast('Add a business name for each recording', false)
      return
    }

    setUploading(true)

    for (let i = 0; i < batch.length; i++) {
      if (batch[i].status !== 'pending') continue
      updateItem(i, { status: 'uploading' })

      const form = new FormData()
      form.append('file', batch[i].file)
      form.append('business_name', batch[i].businessName.trim())
      form.append('contact_phone', batch[i].phone.trim())
      form.append('outcome', batch[i].outcome)

      try {
        const res = await fetch('/api/admin/call-recordings', { method: 'POST', body: form })
        const data = await res.json()
        updateItem(i, { status: data.ok ? 'done' : 'error' })
      } catch {
        updateItem(i, { status: 'error' })
      }
    }

    setUploading(false)
    fetchRecordings()
    showToast('All files uploaded — transcribing in the background')
    // Clear done items after a moment
    setTimeout(() => setBatch(prev => prev.filter(b => b.status !== 'done')), 2000)
  }

  // Stats
  const total = recordings.length
  const interested = recordings.filter(r => r.outcome === 'interested').length
  const callbacks = recordings.filter(r => r.outcome === 'callback').length
  const convRate = total > 0 ? Math.round(((interested + callbacks) / total) * 100) : 0
  const avgScore = (() => {
    const scored = recordings.filter(r => {
      try { return r.ai_summary && JSON.parse(r.ai_summary).score } catch { return false }
    })
    if (!scored.length) return null
    const sum = scored.reduce((acc, r) => {
      try { return acc + JSON.parse(r.ai_summary!).score } catch { return acc }
    }, 0)
    return (sum / scored.length).toFixed(1)
  })()

  return (
    <div style={{ padding: 28, maxWidth: 1000, fontFamily: 'var(--font-sans, system-ui)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Call Recordings</h1>
          <p style={{ fontSize: 13, color: '#5A6A7A', margin: '4px 0 0' }}>
            Upload recordings from your Samsung → auto-transcribed and analysed
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchRecordings} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: '#1B2A4A' }}>
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setShowUpload(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#1B2A4A', color: '#fff' }}>
            <Upload size={14} /> Upload recordings
          </button>
        </div>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1B2A4A', margin: '0 0 4px' }}>Upload recordings</h2>
          <p style={{ fontSize: 12, color: '#5A6A7A', margin: '0 0 16px' }}>Select multiple files at once — fill in the business name and outcome for each, then upload all.</p>

          {/* File picker */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border: '2px dashed rgba(27,42,74,0.15)', borderRadius: 8, padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16, background: 'rgba(27,42,74,0.02)' }}
          >
            <Upload size={20} color="#5A6A7A" style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 13, color: '#5A6A7A' }}>Click to select audio files</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>m4a, mp3, wav, ogg, aac — multiple files supported</div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*,.m4a,.mp3,.wav,.ogg,.aac,.amr"
            multiple
            onChange={handleFilePick}
            style={{ display: 'none' }}
          />

          {/* Batch list */}
          {batch.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {batch.map((item, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '1fr 120px 140px auto',
                  gap: 8, alignItems: 'center',
                  padding: '10px 12px', borderRadius: 8,
                  background: item.status === 'done' ? 'rgba(34,197,94,0.06)' : item.status === 'error' ? 'rgba(239,68,68,0.06)' : 'rgba(27,42,74,0.03)',
                  border: `1px solid ${item.status === 'done' ? 'rgba(34,197,94,0.2)' : item.status === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(27,42,74,0.08)'}`,
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#5A6A7A', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.file.name} <span style={{ color: '#9ca3af' }}>({(item.file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                    <input
                      value={item.businessName}
                      onChange={e => updateItem(idx, { businessName: e.target.value })}
                      placeholder="Business name *"
                      disabled={item.status !== 'pending'}
                      style={{ width: '100%', padding: '6px 10px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, outline: 'none', boxSizing: 'border-box', background: item.status !== 'pending' ? '#f9f9f9' : '#fff' }}
                    />
                  </div>
                  <input
                    value={item.phone}
                    onChange={e => updateItem(idx, { phone: e.target.value })}
                    placeholder="Phone"
                    disabled={item.status !== 'pending'}
                    style={{ padding: '6px 10px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, outline: 'none', background: item.status !== 'pending' ? '#f9f9f9' : '#fff' }}
                  />
                  <select
                    value={item.outcome}
                    onChange={e => updateItem(idx, { outcome: e.target.value })}
                    disabled={item.status !== 'pending'}
                    style={{ padding: '6px 10px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, background: item.status !== 'pending' ? '#f9f9f9' : '#fff', cursor: 'pointer' }}
                  >
                    <option value="interested">Interested</option>
                    <option value="callback">Callback</option>
                    <option value="not_interested">Not interested</option>
                    <option value="no_answer">No answer</option>
                    <option value="voicemail">Voicemail</option>
                  </select>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
                    {item.status === 'pending' && (
                      <button onClick={() => removeItem(idx)} style={{ padding: '4px 8px', borderRadius: 5, border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                    )}
                    {item.status === 'uploading' && <span style={{ color: '#92621a' }}>Uploading…</span>}
                    {item.status === 'done' && <span style={{ color: '#15803d' }}>✓ Done</span>}
                    {item.status === 'error' && <span style={{ color: '#b91c1c' }}>Failed</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={handleBatchUpload}
              disabled={uploading || batch.filter(b => b.status === 'pending').length === 0}
              style={{ padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#D4A84B', color: '#1B2A4A', opacity: (uploading || !batch.filter(b => b.status === 'pending').length) ? 0.6 : 1 }}
            >
              {uploading ? 'Uploading…' : `Upload ${batch.filter(b => b.status === 'pending').length} file${batch.filter(b => b.status === 'pending').length !== 1 ? 's' : ''}`}
            </button>
            <button onClick={() => { setShowUpload(false); setBatch([]) }} style={{ padding: '9px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(27,42,74,0.15)', background: 'transparent', color: '#5A6A7A' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total calls', value: total, icon: <Mic size={14} color="#D4A84B" /> },
            { label: 'Interested', value: interested, icon: <TrendingUp size={14} color="#15803d" /> },
            { label: 'Callbacks', value: callbacks, icon: <TrendingUp size={14} color="#92621a" /> },
            { label: 'Conversion', value: `${convRate}%`, icon: <TrendingUp size={14} color="#1B2A4A" /> },
            ...(avgScore ? [{ label: 'Avg score', value: `${avgScore}/10`, icon: <TrendingUp size={14} color="#D4A84B" /> }] : []),
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '14px 16px', border: '1px solid rgba(27,42,74,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                {s.icon}
                <span style={{ fontSize: 11, color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', fontFamily: 'var(--font-display)' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recordings list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#5A6A7A' }}>Loading...</div>
      ) : recordings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#5A6A7A' }}>
          <Mic size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ margin: 0 }}>No recordings yet — upload your first call above</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recordings.map(r => {
            const isExpanded = expanded === r.id
            const outcome = OUTCOME_LABELS[r.outcome || 'no_answer'] || OUTCOME_LABELS.no_answer
            const transcribing = !r.transcript

            let summary: AISummary = {}
            try { if (r.ai_summary) summary = JSON.parse(r.ai_summary) } catch {}

            return (
              <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                  onClick={() => setExpanded(isExpanded ? null : r.id)}>

                  {/* Outcome badge */}
                  <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: outcome.bg, color: outcome.colour, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {outcome.label}
                  </span>

                  {/* Business + date */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.business_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 1 }}>
                      {new Date(r.called_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {r.contact_phone && ` · ${r.contact_phone}`}
                      {r.duration_secs ? ` · ${formatDuration(r.duration_secs)}` : ''}
                    </div>
                  </div>

                  {/* Score */}
                  {summary.score && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: summary.score >= 8 ? '#15803d' : summary.score >= 6 ? '#92621a' : '#b91c1c', flexShrink: 0 }}>
                      {summary.score}/10
                    </div>
                  )}

                  {/* Transcribing indicator */}
                  {transcribing && (
                    <span style={{ fontSize: 11, color: '#92621a', fontWeight: 600, flexShrink: 0 }}>
                      Transcribing...
                    </span>
                  )}

                  <div style={{ color: '#5A6A7A', flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(27,42,74,0.06)', padding: '16px 20px' }}>

                    {/* Audio player */}
                    <audio controls src={r.recording_url} style={{ width: '100%', marginBottom: 20, borderRadius: 6 }} />

                    {transcribing ? (
                      <div style={{ padding: '16px', background: 'rgba(212,168,75,0.06)', borderRadius: 8, fontSize: 13, color: '#92621a', fontWeight: 500 }}>
                        Transcription in progress — refresh in 30–60 seconds
                      </div>
                    ) : (
                      <>
                        {/* AI Analysis */}
                        {summary.score && (
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Call score</div>
                            <ScoreBar score={summary.score} />
                            {summary.outcome_summary && (
                              <p style={{ fontSize: 13, color: '#1B2A4A', margin: '8px 0 0', fontStyle: 'italic' }}>{summary.outcome_summary}</p>
                            )}
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                          {summary.what_worked && (
                            <div style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.06)', borderLeft: '3px solid #15803d', borderRadius: 4 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>What worked</div>
                              <div style={{ fontSize: 13, color: '#1B2A4A', lineHeight: 1.5 }}>{summary.what_worked}</div>
                            </div>
                          )}
                          {summary.what_to_improve && (
                            <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.06)', borderLeft: '3px solid #b91c1c', borderRadius: 4 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Improve</div>
                              <div style={{ fontSize: 13, color: '#1B2A4A', lineHeight: 1.5 }}>{summary.what_to_improve}</div>
                            </div>
                          )}
                        </div>

                        {summary.objections && summary.objections.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Objections raised</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {summary.objections.map((obj, i) => (
                                <span key={i} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(27,42,74,0.06)', color: '#1B2A4A', fontWeight: 500 }}>
                                  {obj}
                                </span>
                              ))}
                            </div>
                            {summary.objection_handling && (
                              <p style={{ fontSize: 13, color: '#5A6A7A', margin: '8px 0 0', lineHeight: 1.5 }}>{summary.objection_handling}</p>
                            )}
                          </div>
                        )}

                        {summary.coaching_tip && (
                          <div style={{ padding: '12px 14px', background: 'rgba(212,168,75,0.08)', borderLeft: '3px solid #D4A84B', borderRadius: 4, marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#92621a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Coaching tip</div>
                            <div style={{ fontSize: 13, color: '#1B2A4A', lineHeight: 1.5 }}>{summary.coaching_tip}</div>
                          </div>
                        )}

                        {/* Transcript */}
                        {r.transcript && (
                          <details style={{ marginTop: 4 }}>
                            <summary style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', cursor: 'pointer', marginBottom: 8 }}>View full transcript</summary>
                            <pre style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#374151', background: '#F9F8F5', padding: '12px 14px', borderRadius: 6, border: '1px solid rgba(27,42,74,0.07)', fontFamily: 'inherit', margin: 0 }}>
                              {r.transcript}
                            </pre>
                          </details>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, padding: '12px 20px', borderRadius: 8,
          background: toast.ok ? '#1B2A4A' : '#dc2626', color: '#fff', fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000, maxWidth: 360,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
