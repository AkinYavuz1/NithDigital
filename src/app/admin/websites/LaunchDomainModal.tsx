'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle2, AlertCircle, Globe, ExternalLink } from 'lucide-react'

interface Props {
  project: {
    id: string
    client_name: string
    project_name: string
    vercel_project: string | null
    staging_url: string | null
  }
  onClose: () => void
  onLaunched: (liveUrl: string) => void
}

type Option = 'staging' | 'subdomain' | 'custom'
type Step = 'choose' | 'running' | 'polling' | 'done' | 'error'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function LaunchDomainModal({ project, onClose, onLaunched }: Props) {
  const [option, setOption] = useState<Option>('staging')
  const [customDomain, setCustomDomain] = useState('')
  const [step, setStep] = useState<Step>('choose')
  const [statusMsg, setStatusMsg] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const clientSlug = slugify(project.client_name)

  const subdomainPreview = `${clientSlug}.nithdigital.uk`

  const launch = async () => {
    if (!project.vercel_project) {
      setError('No Vercel project ID found. Build the site first.')
      setStep('error')
      return
    }

    setStep('running')
    setError('')

    if (option === 'staging') setStatusMsg('Setting staging URL as live...')
    if (option === 'subdomain') setStatusMsg(`Creating ${subdomainPreview}...`)
    if (option === 'custom') setStatusMsg(`Connecting ${customDomain} to Vercel and Cloudflare...`)

    try {
      const res = await fetch('/api/launch-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          option,
          vercel_project_id: project.vercel_project,
          staging_url: project.staging_url,
          client_slug: clientSlug,
          custom_domain: option === 'custom' ? customDomain.trim() : undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Launch failed')
        setStep('error')
        return
      }

      setLiveUrl(data.live_url)

      if (option === 'custom' && !data.requires_manual_dns) {
        setStep('polling')
        setStatusMsg('DNS records created. Waiting for Vercel to verify...')
      } else if (data.requires_manual_dns) {
        setError(data.message || 'Domain not in Cloudflare — add it manually then retry.')
        setStep('error')
      } else {
        setStep('done')
        onLaunched(data.live_url)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error')
      setStep('error')
    }
  }

  // Poll for domain verification
  useEffect(() => {
    if (step !== 'polling' || !liveUrl || !project.vercel_project) return
    let count = 0
    const domain = liveUrl.replace('https://', '')

    const interval = setInterval(async () => {
      count++
      if (count > 30) {
        clearInterval(interval)
        setStep('done')
        onLaunched(liveUrl)
        return
      }
      try {
        const res = await fetch(`/api/verify-domain?projectId=${project.vercel_project}&domain=${domain}`)
        const data = await res.json()
        if (data.verified) {
          clearInterval(interval)
          setVerified(true)
          setStep('done')
          onLaunched(liveUrl)
        }
      } catch {
        // ignore
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [step])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(0,0,0,0.25)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', background: '#1B2A4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 10, color: '#D4A84B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>Launch Site</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#F5F0E6', fontWeight: 400, margin: 0 }}>
              {project.client_name} — {project.project_name}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(245,240,230,0.5)', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 24 }}>

          {/* Choose step */}
          {step === 'choose' && (
            <>
              <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 20 }}>Choose how to launch this site:</p>

              {/* Option cards */}
              {([
                {
                  key: 'staging' as Option,
                  title: 'Use staging URL',
                  desc: project.staging_url || 'Already live on Vercel',
                  badge: 'Instant',
                  badgeColor: '#22c55e',
                },
                {
                  key: 'subdomain' as Option,
                  title: 'Nith Digital subdomain',
                  desc: subdomainPreview,
                  badge: 'Free · 2 min',
                  badgeColor: '#3B82F6',
                },
                {
                  key: 'custom' as Option,
                  title: 'Custom domain',
                  desc: 'Your own domain — automated DNS via Cloudflare',
                  badge: 'Full setup',
                  badgeColor: '#D4A84B',
                },
              ] as const).map(({ key, title, desc, badge, badgeColor }) => (
                <div
                  key={key}
                  onClick={() => setOption(key)}
                  style={{
                    padding: '14px 16px', borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                    border: option === key ? '2px solid #D4A84B' : '2px solid rgba(27,42,74,0.1)',
                    background: option === key ? 'rgba(212,168,75,0.04)' : 'white',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: 12, color: '#5A6A7A' }}>{desc}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: badgeColor, background: `${badgeColor}18`, padding: '2px 7px', borderRadius: 100, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8 }}>
                      {badge}
                    </span>
                  </div>
                </div>
              ))}

              {/* Custom domain input */}
              {option === 'custom' && (
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#5A6A7A', display: 'block', marginBottom: 6, letterSpacing: '0.5px' }}>DOMAIN NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. smithplumbing.co.uk"
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', color: '#1B2A4A', boxSizing: 'border-box' }}
                  />
                  <p style={{ fontSize: 11, color: '#5A6A7A', marginTop: 6 }}>
                    Domain must already be purchased. DNS will be configured automatically if it's in your Cloudflare account.
                  </p>
                </div>
              )}

              <button
                onClick={launch}
                disabled={option === 'custom' && !customDomain.trim()}
                style={{
                  width: '100%', marginTop: 20, padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: option === 'custom' && !customDomain.trim() ? 'rgba(27,42,74,0.1)' : '#D4A84B',
                  color: option === 'custom' && !customDomain.trim() ? '#5A6A7A' : '#1B2A4A',
                  border: 'none', cursor: option === 'custom' && !customDomain.trim() ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Globe size={15} /> Launch Site
              </button>
            </>
          )}

          {/* Running / polling */}
          {(step === 'running' || step === 'polling') && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Loader2 size={36} color="#D4A84B" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>{statusMsg}</p>
              {step === 'polling' && (
                <p style={{ fontSize: 12, color: '#5A6A7A' }}>
                  Checking every 10 seconds. This can take 1–3 minutes for DNS to propagate.
                </p>
              )}
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle2 size={40} color="#22c55e" style={{ marginBottom: 12 }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 6 }}>Site is Live!</h3>
              <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 20 }}>
                {verified ? 'Domain verified and SSL active.' : 'Live URL saved to project.'}
              </p>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: '#D4A84B', color: '#1B2A4A', textDecoration: 'none', fontSize: 13, fontWeight: 700, marginBottom: 12 }}
              >
                <Globe size={15} /> Open {liveUrl} <ExternalLink size={12} />
              </a>
              <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 100, fontSize: 12, color: '#5A6A7A', background: 'none', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div style={{ padding: '12px 0' }}>
              <div style={{ display: 'flex', gap: 10, padding: '14px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: 16 }}>
                <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
              </div>
              <button onClick={() => setStep('choose')} style={{ padding: '10px 20px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: '#F5F0E6', border: '1px solid rgba(27,42,74,0.15)', cursor: 'pointer', color: '#1B2A4A' }}>
                Try again
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
