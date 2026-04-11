'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, CheckCircle2, AlertCircle, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  files_changed?: string[]
  error?: string
}

interface Props {
  projectId: string
  githubFullName: string
  onPushComplete: () => void
}

export default function RefineTab({ projectId, githubFullName, onPushComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendInstruction = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/refine-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_full_name: githubFullName, instruction: text }),
      })
      const data = await res.json()

      if (data.error) {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: data.error, error: data.error }
          return updated
        })
        return
      }

      const changed = data.files_changed || []
      const failed = data.failed || []
      const content = changed.length > 0
        ? `Done — pushed ${changed.length} file${changed.length === 1 ? '' : 's'}. Vercel is redeploying.`
        : 'No changes were needed.'

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content, files_changed: changed }
        return updated
      })

      if (changed.length > 0) onPushComplete()

      if (failed.length > 0) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Note: ${failed.length} file(s) failed to push: ${failed.join(', ')}`,
          error: 'partial failure',
        }])
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Try again.', error: 'network error' }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendInstruction() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <p style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 12, flexShrink: 0 }}>
        Describe changes in plain English. Claude will edit the files and push to GitHub — Vercel redeploys automatically.
      </p>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        {messages.length === 0 && (
          <div style={{ padding: '12px', background: 'rgba(27,42,74,0.03)', borderRadius: 8 }}>
            {[
              'Make the hero section darker with a navy background',
              'Add a testimonials section to the homepage',
              'Change the button style to be more rounded',
              'Update the footer with a two-column layout',
            ].map(example => (
              <button
                key={example}
                onClick={() => setInput(example)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 0', fontSize: 11, color: '#5A6A7A', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(27,42,74,0.05)' }}
              >
                "{example}"
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'assistant' ? '#1B2A4A' : '#D4A84B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {msg.role === 'assistant' ? <Bot size={12} color="#D4A84B" /> : <User size={12} color="#1B2A4A" />}
            </div>
            <div style={{ maxWidth: '80%' }}>
              <div style={{
                padding: '8px 12px',
                borderRadius: msg.role === 'user' ? '10px 3px 10px 10px' : '3px 10px 10px 10px',
                background: msg.role === 'user' ? '#1B2A4A' : msg.error ? 'rgba(239,68,68,0.06)' : '#f5f4f0',
                color: msg.role === 'user' ? '#F5F0E6' : msg.error ? '#dc2626' : '#1B2A4A',
                fontSize: 12,
                lineHeight: 1.5,
              }}>
                {msg.content || (loading && i === messages.length - 1 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: 11, color: '#5A6A7A' }}>Fetching files, applying changes, pushing to GitHub...</span>
                  </div>
                ) : '')}
              </div>
              {msg.files_changed && msg.files_changed.length > 0 && (
                <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {msg.files_changed.map(f => (
                    <span key={f} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(34,197,94,0.1)', color: '#15803d', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircle2 size={9} /> {f.split('/').pop()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: '#f5f4f0', borderRadius: 10, padding: '8px 12px', flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a change (e.g. 'make the nav sticky')..."
          rows={1}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 12, fontFamily: 'inherit', color: '#1B2A4A', resize: 'none', lineHeight: 1.5 }}
        />
        <button
          onClick={sendInstruction}
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? '#D4A84B' : 'rgba(27,42,74,0.1)',
            border: 'none', borderRadius: 7, padding: '5px 8px', cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', flexShrink: 0,
          }}
        >
          {loading ? <Loader2 size={13} color="#5A6A7A" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={13} color={input.trim() ? '#1B2A4A' : '#5A6A7A'} />}
        </button>
      </div>
    </div>
  )
}
