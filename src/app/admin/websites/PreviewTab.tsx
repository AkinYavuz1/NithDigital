'use client'

import { useState, useEffect, useRef } from 'react'
import { RefreshCw, ExternalLink, Loader2 } from 'lucide-react'

interface Props {
  stagingUrl: string
  vercelProjectId: string | null
}

export default function PreviewTab({ stagingUrl, vercelProjectId }: Props) {
  const [iframeKey, setIframeKey] = useState(0)
  const [deployState, setDeployState] = useState<'READY' | 'BUILDING' | 'unknown'>('unknown')
  const [iframeLoading, setIframeLoading] = useState(true)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollCount = useRef(0)

  const checkDeploy = async () => {
    if (!vercelProjectId) return
    try {
      const res = await fetch(`/api/vercel-deploy-status?projectId=${vercelProjectId}`)
      const data = await res.json()
      const state = data.state?.toUpperCase()
      if (state === 'READY' || state === 'BUILDING' || state === 'ERROR') {
        const prev = deployState
        setDeployState(state === 'ERROR' ? 'unknown' : state as 'READY' | 'BUILDING')
        if (prev === 'BUILDING' && state === 'READY') {
          setIframeKey(k => k + 1)
        }
      }
    } catch {
      // ignore poll errors
    }
    pollCount.current++
    if (pollCount.current > 30) stopPolling()
  }

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  useEffect(() => {
    checkDeploy()
    pollRef.current = setInterval(checkDeploy, 10000)
    return stopPolling
  }, [vercelProjectId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', marginBottom: 8, flexShrink: 0 }}>
        <div style={{
          flex: 1, fontSize: 11, color: '#5A6A7A', padding: '5px 10px',
          background: 'rgba(27,42,74,0.04)', borderRadius: 6, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {stagingUrl}
        </div>
        {deployState === 'BUILDING' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#D4A84B', flexShrink: 0 }}>
            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            Deploying...
          </div>
        )}
        {deployState === 'READY' && (
          <div style={{ fontSize: 11, color: '#22c55e', flexShrink: 0 }}>● Live</div>
        )}
        <button
          onClick={() => { setIframeKey(k => k + 1); setIframeLoading(true) }}
          style={{ background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: '#5A6A7A', flexShrink: 0 }}
          title="Refresh preview"
        >
          <RefreshCw size={13} />
        </button>
        <a
          href={stagingUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: '#5A6A7A', flexShrink: 0, display: 'flex', alignItems: 'center' }}
          title="Open in new tab"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      {/* iframe */}
      <div style={{ flex: 1, position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(27,42,74,0.1)' }}>
        {iframeLoading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,240,230,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <Loader2 size={24} color="#D4A84B" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <iframe
          key={iframeKey}
          src={stagingUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => setIframeLoading(false)}
        />
      </div>
    </div>
  )
}
