'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronDown, Check, ExternalLink } from 'lucide-react'
import { CHECKLIST_STEPS } from '@/lib/checklistSteps'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import CertificateDownload from './CertificateDownload'

type Progress = Record<number, { completed: boolean; notes: string }>

function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `LAUNCH-${seg()}-${seg()}`
}

export default function ChecklistClient() {
  const [progress, setProgress] = useState<Progress>({})
  const [open, setOpen] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const completed = Object.values(progress).filter((p) => p.completed).length
  const pct = Math.round((completed / 10) * 100)
  const allDone = completed === 10

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('launchpad_progress')
    if (stored) {
      try { setProgress(JSON.parse(stored)) } catch { /* ignore */ }
    }
    const code = localStorage.getItem('launchpad_promo')
    if (code) setPromoCode(code)
  }, [])

  // Load user + supabase progress
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setLoading(false)
      if (data.user) {
        loadSupabaseProgress(data.user.id, supabase)
      }
    })
  }, [])

  const loadSupabaseProgress = async (userId: string, supabase: ReturnType<typeof createClient>) => {
    const { data } = await supabase
      .from('launchpad_progress')
      .select('*')
      .eq('user_id', userId)
    if (data && data.length > 0) {
      const prog: Progress = {}
      data.forEach((row: { step_number: number; completed: boolean; notes: string }) => {
        prog[row.step_number] = { completed: row.completed, notes: row.notes || '' }
      })
      setProgress(prog)
    }
    // Load promo code
    const { data: codes } = await supabase
      .from('promo_codes')
      .select('code')
      .eq('user_id', userId)
      .limit(1)
    if (codes && codes.length > 0) setPromoCode(codes[0].code)
  }

  const toggleStep = useCallback(
    async (stepNum: number) => {
      const current = progress[stepNum]?.completed ?? false
      const newProgress = {
        ...progress,
        [stepNum]: { completed: !current, notes: progress[stepNum]?.notes ?? '' },
      }
      setProgress(newProgress)
      localStorage.setItem('launchpad_progress', JSON.stringify(newProgress))

      if (user) {
        const supabase = createClient()
        await supabase.from('launchpad_progress').upsert({
          user_id: user.id,
          step_number: stepNum,
          completed: !current,
          completed_at: !current ? new Date().toISOString() : null,
          notes: progress[stepNum]?.notes ?? '',
        })
      }

      // Generate promo code if step 10 just completed
      if (stepNum === 10 && !current && !promoCode) {
        const allPrevDone = [1, 2, 3, 4, 5, 6, 7, 8, 9].every(
          (n) => newProgress[n]?.completed
        )
        if (allPrevDone) {
          await generateAndSavePromoCode()
        }
      }
    },
    [progress, user, promoCode]
  )

  const updateNotes = useCallback(
    async (stepNum: number, notes: string) => {
      const newProgress = {
        ...progress,
        [stepNum]: { ...progress[stepNum], notes },
      }
      setProgress(newProgress)
      localStorage.setItem('launchpad_progress', JSON.stringify(newProgress))
      if (user) {
        const supabase = createClient()
        await supabase.from('launchpad_progress').upsert({
          user_id: user.id,
          step_number: stepNum,
          completed: progress[stepNum]?.completed ?? false,
          notes,
        })
      }
    },
    [progress, user]
  )

  const generateAndSavePromoCode = async () => {
    const code = generatePromoCode()
    setPromoCode(code)
    localStorage.setItem('launchpad_promo', code)
    if (user) {
      const supabase = createClient()
      await supabase.from('promo_codes').insert({ user_id: user.id, code, type: 'startup_bundle' })
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, color: '#5A6A7A' }}>Loading...</div>
      </div>
    )
  }

  return (
    <>
      {/* Page header */}
      <div style={{ background: '#1B2A4A', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Your Startup Checklist
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)' }}>
          10 steps to launch your Scottish business
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>
              {completed} of 10 complete
            </span>
            <span style={{ fontSize: 14, color: '#5A6A7A' }}>{pct}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(27,42,74,0.1)', borderRadius: 100, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: '#D4A84B',
                borderRadius: 100,
                width: `${pct}%`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Auth banner */}
        {!user && (
          <div
            style={{
              background: '#F5F0E6',
              border: '1px solid rgba(27,42,74,0.1)',
              borderLeft: '3px solid #D4A84B',
              borderRadius: '0 8px 8px 0',
              padding: '12px 16px',
              marginBottom: 24,
              fontSize: 13,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span style={{ color: '#5A6A7A' }}>
              💾 Create a free account to save your progress across devices
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/auth/login" style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>Sign in</Link>
              <span style={{ color: '#5A6A7A' }}>·</span>
              <Link href="/auth/signup" style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>Create account</Link>
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CHECKLIST_STEPS.map((step) => {
            const isCompleted = progress[step.n]?.completed ?? false
            const isOpen = open === step.n
            const notes = progress[step.n]?.notes ?? ''

            return (
              <div
                key={step.n}
                style={{
                  border: `1px solid ${isCompleted ? 'rgba(212,168,75,0.4)' : 'rgba(27,42,74,0.1)'}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: isCompleted ? 'rgba(212,168,75,0.04)' : '#fff',
                }}
              >
                {/* Step header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => setOpen(isOpen ? null : step.n)}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStep(step.n) }}
                    aria-label={`Mark step ${step.n} as ${isCompleted ? 'incomplete' : 'complete'}`}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      border: `2px solid ${isCompleted ? '#D4A84B' : 'rgba(27,42,74,0.2)'}`,
                      background: isCompleted ? '#D4A84B' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isCompleted && <Check size={14} color="#1B2A4A" />}
                  </button>

                  <span style={{ fontSize: 11, color: '#5A6A7A', minWidth: 20 }}>
                    {step.n < 10 ? `0${step.n}` : step.n}
                  </span>
                  <span style={{ fontSize: 16 }}>{step.icon}</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#1B2A4A',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      opacity: isCompleted ? 0.6 : 1,
                    }}
                  >
                    {step.title}
                  </span>
                  <ChevronDown
                    size={16}
                    color="#5A6A7A"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }}
                  />
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(27,42,74,0.06)' }}>
                    {/* Why it matters */}
                    <div style={{ padding: '16px 0 12px' }}>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5A6A7A' }}>{step.why}</p>
                    </div>

                    {/* Actions */}
                    {step.actions.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#1B2A4A', marginBottom: 8, fontWeight: 600 }}>
                          Action items
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {step.actions.map((a, i) => (
                            <li key={i} style={{ fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <span style={{ color: '#D4A84B', marginTop: 2 }}>→</span>
                              {a.href ? (
                                <a href={a.href} target="_blank" rel="noopener noreferrer" style={{ color: '#2D4A7A', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  {a.text} <ExternalLink size={11} />
                                </a>
                              ) : (
                                <span style={{ color: '#1B2A4A' }}>{a.text}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Providers table */}
                    {step.providers && (
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#1B2A4A', marginBottom: 8, fontWeight: 600 }}>
                          Recommended providers
                        </h4>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                              <tr>
                                {['Provider', 'Cost', 'Key features', 'Best for'].map((h) => (
                                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', background: '#F5F0E6', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {step.providers.map((p) => (
                                <tr key={p.name} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: '#D4A84B' }}>
                                      {p.name}
                                    </a>
                                  </td>
                                  <td style={{ padding: '10px 12px', color: '#5A6A7A' }}>{p.cost}</td>
                                  <td style={{ padding: '10px 12px', color: '#5A6A7A' }}>{p.cover}</td>
                                  <td style={{ padding: '10px 12px', color: '#5A6A7A' }}>{p.bestFor}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Tip */}
                    {step.tip && (
                      <div
                        style={{
                          background: '#F5F0E6',
                          borderLeft: '3px solid #D4A84B',
                          padding: '10px 14px',
                          borderRadius: '0 6px 6px 0',
                          fontSize: 13,
                          color: '#5A6A7A',
                          marginBottom: 16,
                        }}
                      >
                        <strong style={{ color: '#1B2A4A' }}>Tip: </strong>
                        {step.tip}
                      </div>
                    )}

                    {/* Step 6 website CTA */}
                    {step.n === 6 && (
                      <div style={{ background: '#1B2A4A', borderRadius: 8, padding: '16px 20px', marginBottom: 16, color: '#F5F0E6', fontSize: 13 }}>
                        <strong style={{ color: '#D4A84B' }}>Need a website?</strong> Nith Digital builds business websites from £500. Or{' '}
                        <Link href="/launchpad/bundle" style={{ color: '#D4A84B', textDecoration: 'underline' }}>
                          complete this checklist
                        </Link>{' '}
                        and unlock our Startup Bundle — we&apos;ll build it for free.
                      </div>
                    )}

                    {/* Completion section (step 10) */}
                    {step.n === 10 && allDone && (
                      <div style={{ marginBottom: 16 }}>
                        <CompletionSection promoCode={promoCode} onGenerateCode={generateAndSavePromoCode} />
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#1B2A4A', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                        Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => updateNotes(step.n, e.target.value)}
                        placeholder="Add your notes here..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid rgba(27,42,74,0.15)',
                          borderRadius: 6,
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          resize: 'vertical',
                          minHeight: 72,
                          outline: 'none',
                          color: '#1B2A4A',
                        }}
                      />
                    </div>

                    {/* Mark complete button */}
                    <button
                      onClick={() => toggleStep(step.n)}
                      style={{
                        marginTop: 12,
                        padding: '10px 20px',
                        background: isCompleted ? 'transparent' : '#D4A84B',
                        color: isCompleted ? '#5A6A7A' : '#1B2A4A',
                        borderRadius: 100,
                        fontSize: 13,
                        fontWeight: 600,
                        border: isCompleted ? '1px solid rgba(27,42,74,0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isCompleted ? '✓ Completed — click to undo' : 'Mark as complete'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Certificate download at bottom if all done */}
        {allDone && promoCode && (
          <div style={{ marginTop: 32 }}>
            <CertificateDownload promoCode={promoCode} />
          </div>
        )}
      </div>
    </>
  )
}

function CompletionSection({ promoCode, onGenerateCode }: { promoCode: string | null; onGenerateCode: () => Promise<void> }) {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    await onGenerateCode()
    setGenerating(false)
  }

  const copyCode = () => {
    if (promoCode) {
      navigator.clipboard.writeText(promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div>
      {/* Confetti placeholder */}
      <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 32 }}>
        🎉 🥳 🎊
      </div>

      {!promoCode ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 16 }}>
            You&apos;ve completed all 10 steps! Generate your unique promo code to claim the Startup Bundle.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: '12px 28px',
              background: '#D4A84B',
              color: '#1B2A4A',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {generating ? 'Generating...' : 'Generate my promo code'}
          </button>
        </div>
      ) : (
        <div
          style={{
            border: '2px solid #D4A84B',
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            background: 'rgba(212,168,75,0.04)',
          }}
        >
          <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 8 }}>
            🎁 You&apos;ve unlocked the Nith Digital Startup Bundle!
          </p>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#1B2A4A',
              letterSpacing: 2,
              margin: '12px 0',
              fontFamily: 'monospace',
            }}
          >
            {promoCode}
          </div>
          <button
            onClick={copyCode}
            style={{
              padding: '8px 20px',
              background: copied ? '#2D4A7A' : '#1B2A4A',
              color: '#F5F0E6',
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            {copied ? '✓ Copied!' : 'Copy code'}
          </button>
          <p style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 16 }}>
            Use this code to claim: free website build + Business OS
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/launchpad/bundle" style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
              Claim Startup Bundle
            </Link>
            <Link href="/os" style={{ padding: '10px 20px', background: 'transparent', color: '#1B2A4A', borderRadius: 100, fontSize: 12, fontWeight: 600, border: '1px solid rgba(27,42,74,0.2)' }}>
              Try Business OS
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
