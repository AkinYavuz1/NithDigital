'use client'

interface LogoProps {
  size?: number
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'var(--color-gold)',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.5,
        fontWeight: 700,
        color: 'var(--color-navy)',
        flexShrink: 0,
      }}
    >
      N
    </div>
  )
}
