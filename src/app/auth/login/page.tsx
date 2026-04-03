import type { Metadata } from 'next'
import LoginForm from './LoginForm'
import Logo from '@/components/Logo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In — Nith Digital',
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F0E6',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '48px 40px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 2px 16px rgba(27,42,74,0.08)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <Logo size={40} />
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 400,
              color: '#1B2A4A',
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            Sign in
          </h1>
          <p style={{ fontSize: 13, color: '#5A6A7A' }}>We&apos;ll send you a magic link</p>
        </div>
        <LoginForm />
        <p style={{ textAlign: 'center', fontSize: 13, color: '#5A6A7A', marginTop: 24 }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: '#D4A84B', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
