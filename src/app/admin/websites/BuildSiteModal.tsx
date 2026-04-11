'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Loader2, Globe, CheckCircle2, AlertCircle, ChevronRight, Rocket, Code } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Project {
  id: string
  client_name: string
  project_name: string
  project_type: string
  notes: string | null
  github_repo: string | null
  vercel_project: string | null
  staging_url: string | null
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Brief {
  client_name: string
  business_description: string
  industry: string
  location: string
  service_area?: string
  target_audience: string
  key_services: string[]
  usp: string
  tone: string
  pages: string[]
  features: string[]
  style_notes?: string
  color_preferences?: string
  brief_summary: string
  sitemap?: string[]
}

interface BuildState {
  step: 'idle' | 'provisioning' | 'generating_copy' | 'scaffolding' | 'done' | 'error'
  message: string
  github_url?: string
  staging_url?: string
  file_count?: number
  error?: string
}

function parseBrief(text: string): Brief | null {
  const match = text.match(/<BRIEF>([\s\S]*?)<\/BRIEF>/)
  if (!match) return null
  try {
    return JSON.parse(match[1].trim())
  } catch {
    return null
  }
}

function stripBriefTag(text: string): string {
  return text.replace(/<BRIEF>[\s\S]*?<\/BRIEF>/g, '').trim()
}

interface ScrapeEntry {
  url: string
  label: 'client' | 'competitor'
  status: 'idle' | 'scraping' | 'done' | 'error'
  summary?: string
  data?: Record<string, unknown>
}

export default function BuildSiteModal({
  project,
  onClose,
  onProjectUpdated,
}: {
  project: Project
  onClose: () => void
  onProjectUpdated: (updates: Partial<Project>) => void
}) {
  const [step, setStep] = useState<'urls' | 'chat' | 'brief_ready' | 'building' | 'done'>('urls')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [buildState, setBuildState] = useState<BuildState>({ step: 'idle', message: '' })
  const [generatedCopy, setGeneratedCopy] = useState<object | null>(null)
  const [scrapeEntries, setScrapeEntries] = useState<ScrapeEntry[]>([
    { url: '', label: 'client', status: 'idle' },
  ])
  const [scrapedContext, setScrapedContext] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  // Kick off with Claude's opening question — inject scraped context if available
  useEffect(() => {
    if (messages.length === 0 && step === 'chat') {
      const contextMsg = scrapedContext
        ? `Let's build a website for this client. I've already analysed some reference sites:\n\n${scrapedContext}\n\nUse this as a starting point. Ask me any remaining questions you need.`
        : "Let's build a website for this client. Start by asking me what you need to know."
      sendMessage(contextMsg, true)
    }
  }, [step])

  const scrapeUrls = async () => {
    const toScrape = scrapeEntries.filter(e => e.url.trim())
    if (toScrape.length === 0) {
      // Skip straight to chat with no context
      setStep('chat')
      return
    }

    // Mark all as scraping
    setScrapeEntries(prev => prev.map(e => e.url.trim() ? { ...e, status: 'scraping' } : e))

    const results: string[] = []

    for (const entry of toScrape) {
      try {
        const res = await fetch('/api/scrape-site', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: entry.url.trim(), label: entry.label }),
        })
        const data = await res.json()
        if (data.parsed) {
          setScrapeEntries(prev => prev.map(e =>
            e.url === entry.url
              ? { ...e, status: 'done', summary: data.parsed.summary, data: data.parsed }
              : e
          ))
          results.push(`[${entry.label === 'client' ? "Client's existing site" : 'Competitor site'}: ${entry.url}]\n${JSON.stringify(data.parsed, null, 2)}`)
        } else {
          setScrapeEntries(prev => prev.map(e => e.url === entry.url ? { ...e, status: 'error' } : e))
        }
      } catch {
        setScrapeEntries(prev => prev.map(e => e.url === entry.url ? { ...e, status: 'error' } : e))
      }
    }

    setScrapedContext(results.join('\n\n---\n\n'))
    setStep('chat')
  }

  const sendMessage = async (text: string, silent = false) => {
    const userMessage: Message = { role: 'user', content: text }
    const newMessages = silent ? messages : [...messages, userMessage]
    if (!silent) setMessages(newMessages)

    setStreaming(true)
    let accumulated = ''

    try {
      const res = await fetch('/api/website-brief-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: silent
            ? [userMessage]
            : newMessages,
          project_name: project.project_name,
          client_name: project.client_name,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      // Add empty assistant message to stream into
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        accumulated += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: accumulated }
          return updated
        })
      }

      // Check if brief is ready
      const extracted = parseBrief(accumulated)
      if (extracted) {
        setBrief(extracted)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: stripBriefTag(accumulated),
          }
          return updated
        })
        setStep('brief_ready')
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Please try again.' }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')
    sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const buildSite = async () => {
    if (!brief) return
    setStep('building')

    // Step 1 — Generate copy
    setBuildState({ step: 'generating_copy', message: 'Generating all website copy with Claude...' })
    let copy = null
    try {
      const copyRes = await fetch('/api/generate-website-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: project.project_name,
          client_name: brief.client_name || project.client_name,
          project_type: project.project_type,
          industry: brief.industry,
          target_audience: brief.target_audience,
          tone: brief.tone,
          key_services: brief.key_services?.join(', '),
          location: brief.location,
          usp: brief.usp,
          sitemap: brief.sitemap || brief.pages || ['Home', 'About', 'Services', 'Contact'],
        }),
      })
      const copyData = await copyRes.json()
      if (copyData.parsed) {
        copy = copyData.parsed
        setGeneratedCopy(copy)
      }
    } catch {
      // Copy generation failed — continue without it
    }

    // Step 2 — Provision GitHub + Vercel
    setBuildState({ step: 'provisioning', message: 'Creating GitHub repo and Vercel project...' })
    let github_url = ''
    let github_full_name = ''
    let staging_url = ''
    let vercel_project = ''

    try {
      const provRes = await fetch('/api/provision-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: project.project_name,
          client_name: project.client_name,
        }),
      })
      const provData = await provRes.json()
      if (provData.error) throw new Error(provData.error)
      github_url = provData.github_url
      github_full_name = provData.github_full_name
      staging_url = provData.staging_url || ''
      vercel_project = provData.vercel_project || ''
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Provisioning failed'
      setBuildState({ step: 'error', message: '', error: msg })
      return
    }

    // Step 3 — Scaffold and push files
    setBuildState({ step: 'scaffolding', message: 'Claude is writing your website files...' })

    try {
      const scaffoldRes = await fetch('/api/generate-website-scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, copy, github_full_name }),
      })
      const scaffoldData = await scaffoldRes.json()
      if (scaffoldData.error) throw new Error(scaffoldData.error)

      // Step 4 — Save URLs back to project
      await supabase.from('client_projects').update({
        github_repo: github_url,
        vercel_project,
        staging_url,
        notes: `Brief:\n${JSON.stringify(brief, null, 2)}`,
      }).eq('id', project.id)

      onProjectUpdated({ github_repo: github_url, vercel_project, staging_url })

      setBuildState({
        step: 'done',
        message: 'Site built and pushed to GitHub',
        github_url,
        staging_url,
        file_count: scaffoldData.files_pushed,
      })
      setStep('done')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scaffold generation failed'
      setBuildState({ step: 'error', message: '', error: msg })
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'none', border: 'none', outline: 'none',
    flex: 1, fontSize: 13, fontFamily: 'inherit', color: '#1B2A4A',
    resize: 'none', lineHeight: 1.5, padding: 0, maxHeight: 100, overflowY: 'auto',
  }

  const BUILD_STEPS = [
    { key: 'generating_copy', label: 'Generating website copy', icon: '✍️' },
    { key: 'provisioning', label: 'Creating GitHub repo & Vercel project', icon: '🔧' },
    { key: 'scaffolding', label: 'Writing Next.js files', icon: '💻' },
    { key: 'done', label: 'Pushing to GitHub → Vercel deploys', icon: '🚀' },
  ]

  const currentStepIndex = BUILD_STEPS.findIndex(s => s.key === buildState.step)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 680, height: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(27,42,74,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: '#1B2A4A' }}>
          <div>
            <p style={{ fontSize: 10, color: '#D4A84B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
              {step === 'urls' ? 'Reference Sites' : step === 'chat' ? 'Brief Chat' : step === 'brief_ready' ? 'Brief Ready' : step === 'building' ? 'Building...' : 'Site Built'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: '#F5F0E6', fontWeight: 400, margin: 0 }}>
              {project.client_name} — {project.project_name}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,230,0.5)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* ── URL STEP ── */}
        {step === 'urls' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>
            <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 24, lineHeight: 1.6 }}>
              Paste the client's existing website or a competitor's site. Claude will analyse them and use the findings to skip straight to the right questions — or go straight to chat without any URLs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {scrapeEntries.map((entry, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <select
                    value={entry.label}
                    onChange={e => setScrapeEntries(prev => prev.map((en, idx) => idx === i ? { ...en, label: e.target.value as 'client' | 'competitor' } : en))}
                    style={{ padding: '9px 10px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', color: '#1B2A4A', background: 'white', flexShrink: 0 }}
                  >
                    <option value="client">Client site</option>
                    <option value="competitor">Competitor</option>
                  </select>
                  <input
                    type="text"
                    placeholder="https://example.co.uk"
                    value={entry.url}
                    onChange={e => setScrapeEntries(prev => prev.map((en, idx) => idx === i ? { ...en, url: e.target.value } : en))}
                    style={{ flex: 1, padding: '9px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', color: '#1B2A4A' }}
                  />
                  {entry.status === 'scraping' && <Loader2 size={16} color="#D4A84B" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />}
                  {entry.status === 'done' && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />}
                  {entry.status === 'error' && <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />}
                  {scrapeEntries.length > 1 && (
                    <button onClick={() => setScrapeEntries(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(27,42,74,0.3)', padding: 4, flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Summaries after scraping */}
            {scrapeEntries.some(e => e.status === 'done' && e.summary) && (
              <div style={{ marginBottom: 20 }}>
                {scrapeEntries.filter(e => e.summary).map((e, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                      {e.label === 'client' ? 'Client site' : 'Competitor'} — {e.url}
                    </p>
                    <p style={{ fontSize: 12, color: '#5A6A7A', margin: 0 }}>{e.summary}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setScrapeEntries(prev => [...prev, { url: '', label: 'competitor', status: 'idle' }])}
              style={{ fontSize: 12, color: '#5A6A7A', background: 'none', border: '1px dashed rgba(27,42,74,0.2)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', marginBottom: 8 }}
            >
              + Add another URL
            </button>

            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setStep('chat')}
                style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', color: '#5A6A7A' }}
              >
                Skip — go straight to chat
              </button>
              <button
                onClick={scrapeUrls}
                disabled={scrapeEntries.every(e => !e.url.trim()) || scrapeEntries.some(e => e.status === 'scraping')}
                style={{
                  flex: 2, padding: '11px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: scrapeEntries.some(e => e.url.trim()) ? '#D4A84B' : 'rgba(27,42,74,0.1)',
                  color: scrapeEntries.some(e => e.url.trim()) ? '#1B2A4A' : '#5A6A7A',
                  border: 'none', cursor: scrapeEntries.some(e => e.url.trim()) ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {scrapeEntries.some(e => e.status === 'scraping') ? (
                  <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analysing sites...</>
                ) : (
                  <><Globe size={14} /> Analyse & Start Brief</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── CHAT STEP ── */}
        {(step === 'chat' || step === 'brief_ready') && (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'assistant' ? '#1B2A4A' : '#D4A84B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {msg.role === 'assistant' ? <Bot size={14} color="#D4A84B" /> : <User size={14} color="#1B2A4A" />}
                  </div>
                  <div style={{
                    maxWidth: '78%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                    background: msg.role === 'user' ? '#1B2A4A' : '#f5f4f0',
                    color: msg.role === 'user' ? '#F5F0E6' : '#1B2A4A',
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                    {i === messages.length - 1 && streaming && (
                      <span style={{ display: 'inline-block', width: 6, height: 14, background: '#D4A84B', marginLeft: 2, animation: 'blink 0.8s infinite', verticalAlign: 'middle', borderRadius: 1 }} />
                    )}
                  </div>
                </div>
              ))}

              {/* Brief ready card */}
              {step === 'brief_ready' && brief && (
                <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <CheckCircle2 size={16} color="#22c55e" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Brief complete</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {[
                      brief.industry, brief.location, brief.tone,
                      ...(brief.pages || []).slice(0, 4),
                    ].filter(Boolean).map((tag, i) => (
                      <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(27,42,74,0.08)', color: '#1B2A4A' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#5A6A7A', margin: 0 }}>{brief.brief_summary}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(27,42,74,0.08)', flexShrink: 0 }}>
              {step === 'brief_ready' ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { setStep('chat'); setBrief(null) }}
                    style={{ flex: 1, padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', color: '#5A6A7A' }}
                  >
                    Keep chatting
                  </button>
                  <button
                    onClick={buildSite}
                    style={{ flex: 2, padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#D4A84B', color: '#1B2A4A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <Rocket size={15} /> Build Site Now
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: '#f5f4f0', borderRadius: 10, padding: '10px 14px' }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer..."
                    rows={1}
                    style={inputStyle}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || streaming}
                    style={{ background: input.trim() && !streaming ? '#D4A84B' : 'rgba(27,42,74,0.1)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: input.trim() && !streaming ? 'pointer' : 'default', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'background 0.15s' }}
                  >
                    {streaming ? <Loader2 size={15} color="#5A6A7A" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} color={input.trim() ? '#1B2A4A' : '#5A6A7A'} />}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── BUILDING STEP ── */}
        {step === 'building' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: '#1B2A4A', marginBottom: 6 }}>
                  Building your site
                </h3>
                <p style={{ fontSize: 13, color: '#5A6A7A' }}>This takes about 60–90 seconds</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BUILD_STEPS.map((s, i) => {
                  const isDone = buildState.step === 'done' || i < currentStepIndex
                  const isActive = s.key === buildState.step
                  const isPending = i > currentStepIndex && buildState.step !== 'done'
                  return (
                    <div
                      key={s.key}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 10,
                        background: isActive ? 'rgba(212,168,75,0.08)' : isDone ? 'rgba(34,197,94,0.06)' : 'rgba(27,42,74,0.03)',
                        border: `1px solid ${isActive ? 'rgba(212,168,75,0.3)' : isDone ? 'rgba(34,197,94,0.2)' : 'rgba(27,42,74,0.06)'}`,
                      }}
                    >
                      <div style={{ fontSize: 18, flexShrink: 0 }}>
                        {isDone ? '✅' : isActive ? <Loader2 size={18} color="#D4A84B" style={{ animation: 'spin 1s linear infinite' }} /> : s.icon}
                      </div>
                      <span style={{ fontSize: 13, color: isPending ? 'rgba(27,42,74,0.35)' : '#1B2A4A', fontWeight: isActive ? 600 : 400 }}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {buildState.step === 'error' && (
                <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', margin: '0 0 4px' }}>Build failed</p>
                    <p style={{ fontSize: 12, color: '#5A6A7A', margin: 0 }}>{buildState.error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DONE STEP ── */}
        {step === 'done' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
                Site is live on staging
              </h3>
              <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 32 }}>
                {buildState.file_count} files pushed to GitHub. Vercel is deploying now — usually ready in 30–60 seconds.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {buildState.github_url && (
                  <a
                    href={buildState.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 10, background: '#f5f4f0', border: '1px solid rgba(27,42,74,0.1)', color: '#1B2A4A', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                  >
                    <Code size={16} />
                    View GitHub Repo
                    <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#5A6A7A' }} />
                  </a>
                )}
                {buildState.staging_url && (
                  <a
                    href={buildState.staging_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 10, background: '#D4A84B', color: '#1B2A4A', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}
                  >
                    <Globe size={16} />
                    Open Staging Site
                    <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                  </a>
                )}
              </div>

              <p style={{ fontSize: 12, color: 'rgba(27,42,74,0.4)' }}>
                GitHub repo and Vercel URLs have been saved to the project automatically.
              </p>

              <button
                onClick={onClose}
                style={{ marginTop: 16, padding: '10px 28px', borderRadius: 100, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid rgba(27,42,74,0.2)', cursor: 'pointer', color: '#5A6A7A' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
