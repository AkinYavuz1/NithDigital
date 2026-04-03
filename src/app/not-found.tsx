import Link from 'next/link'
import Logo from '@/components/Logo'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F0E6',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <Logo size={48} />
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 400,
          color: '#1B2A4A',
          marginTop: 24,
          marginBottom: 8,
        }}
      >
        Page not found
      </h1>
      <p style={{ fontSize: 14, color: '#5A6A7A', marginBottom: 32, maxWidth: 360 }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px',
          background: '#D4A84B',
          color: '#1B2A4A',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
        }}
      >
        Back to homepage
      </Link>
    </div>
  )
}
