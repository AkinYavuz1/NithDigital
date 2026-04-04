'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const PROJECT_REF = 'mrdozyxbonbukpmywxqi'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient()

      // Parse both hash fragments (#access_token=...) and query params (?code=...)
      const hash = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const searchParams = new URLSearchParams(window.location.search)

      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type') ?? 'magiclink'
      const next = searchParams.get('next') ?? '/os'

      try {
        if (accessToken && refreshToken) {
          // Hash fragment flow — Supabase verified the token and gave us tokens directly
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          router.replace(next)
          return
        }

        if (code) {
          // PKCE flow
          await supabase.auth.exchangeCodeForSession(code)
          router.replace(next)
          return
        }

        if (tokenHash && type) {
          // Token hash flow (some email clients)
          await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as 'magiclink' | 'email' | 'recovery' | 'invite' })
          router.replace(next)
          return
        }
      } catch (err) {
        console.error('Auth callback error:', err)
      }

      // Nothing worked — back to login
      router.replace('/auth/login?error=auth_error')
    }

    handleCallback()
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F5F0E6',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid rgba(27,42,74,0.1)',
          borderTop: '3px solid #D4A84B',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontSize: 14, color: '#5A6A7A' }}>Signing you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
