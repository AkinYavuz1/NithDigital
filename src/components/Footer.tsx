export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span>© 2026 Nith Digital — Sanquhar, Dumfries &amp; Galloway</span>
        <span>
          <a href="mailto:hello@nithdigital.uk" style={{ color: 'inherit' }}>
            hello@nithdigital.uk
          </a>
        </span>
      </div>
    </footer>
  )
}
