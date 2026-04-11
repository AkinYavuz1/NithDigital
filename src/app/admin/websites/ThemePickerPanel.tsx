'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, Shuffle } from 'lucide-react'

export interface ThemeConfig {
  id: string
  name: string
  personality: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    text_muted: string
  }
  fonts: {
    heading: string
    body: string
  }
  border_radius: 'sharp' | 'soft' | 'rounded'
  spacing: 'compact' | 'balanced' | 'generous'
  hero_layout: 'centered' | 'split' | 'fullwidth'
}

function radiusPx(style: string) {
  if (style === 'sharp') return '2px'
  if (style === 'soft') return '6px'
  return '14px'
}

function ThemeCard({ theme, selected, onSelect }: { theme: ThemeConfig; selected: boolean; onSelect: () => void }) {
  const r = radiusPx(theme.border_radius)
  const headingFont = theme.fonts.heading.replace(/ /g, '+')
  const bodyFont = theme.fonts.body.replace(/ /g, '+')

  useEffect(() => {
    const linkId = `font-${headingFont}-${bodyFont}`
    if (document.getElementById(linkId)) return
    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;700&family=${bodyFont}:wght@400;600&display=swap`
    document.head.appendChild(link)
  }, [headingFont, bodyFont])

  return (
    <div
      onClick={onSelect}
      style={{
        border: selected ? `2px solid #D4A84B` : '2px solid rgba(27,42,74,0.1)',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        background: 'white',
        boxShadow: selected ? '0 4px 20px rgba(212,168,75,0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
        position: 'relative',
      }}
    >
      {selected && (
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <CheckCircle2 size={18} color="#D4A84B" fill="white" />
        </div>
      )}

      {/* Mock site preview */}
      <div style={{ background: theme.colors.background }}>
        {/* Nav */}
        <div style={{ background: theme.colors.primary, padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: `'${theme.fonts.heading}', serif`, fontSize: 11, fontWeight: 700, color: theme.colors.secondary }}>
            Brand
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Home', 'About', 'Contact'].map(p => (
              <span key={p} style={{ fontFamily: `'${theme.fonts.body}', sans-serif`, fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div style={{
          background: theme.hero_layout === 'fullwidth' ? theme.colors.primary : theme.colors.background,
          padding: '14px 12px',
          textAlign: theme.hero_layout === 'centered' ? 'center' : 'left',
          minHeight: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: `'${theme.fonts.heading}', serif`,
              fontSize: 13,
              fontWeight: 700,
              color: theme.hero_layout === 'fullwidth' ? '#fff' : theme.colors.text,
              marginBottom: 4,
              lineHeight: 1.2,
            }}>
              Headline Goes Here
            </div>
            <div style={{
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: 9,
              color: theme.hero_layout === 'fullwidth' ? 'rgba(255,255,255,0.7)' : theme.colors.text_muted,
              marginBottom: 8,
              lineHeight: 1.4,
            }}>
              Subheading text that explains the value proposition briefly.
            </div>
            <div style={{
              display: 'inline-block',
              background: theme.colors.secondary,
              color: theme.colors.primary,
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: 9,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: r,
            }}>
              Get Started
            </div>
          </div>
          {theme.hero_layout === 'split' && (
            <div style={{ width: 50, height: 50, background: theme.colors.surface, borderRadius: r, flexShrink: 0 }} />
          )}
        </div>

        {/* Color dots */}
        <div style={{ padding: '6px 12px', background: theme.colors.surface, display: 'flex', gap: 4, alignItems: 'center' }}>
          {[theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.background].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
          ))}
          <span style={{ fontSize: 8, color: theme.colors.text_muted, marginLeft: 4, fontFamily: `'${theme.fonts.body}', sans-serif` }}>
            {theme.fonts.heading} / {theme.fonts.body}
          </span>
        </div>
      </div>

      {/* Theme info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 2 }}>{theme.name}</div>
        <div style={{ fontSize: 11, color: '#5A6A7A', lineHeight: 1.4 }}>{theme.personality}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {[theme.border_radius, theme.spacing, theme.hero_layout].map(tag => (
            <span key={tag} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 100, background: 'rgba(27,42,74,0.06)', color: '#5A6A7A' }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

interface Props {
  project: { id: string; client_name: string; project_name: string; notes: string | null }
  brief: object | null
  existingTheme: ThemeConfig | null
  onThemeConfirmed: (theme: ThemeConfig) => void
}

export default function ThemePickerPanel({ project, brief, existingTheme, onThemeConfirmed }: Props) {
  const [generating, setGenerating] = useState(false)
  const [themes, setThemes] = useState<ThemeConfig[] | null>(existingTheme ? null : null)
  const [selectedId, setSelectedId] = useState<string | null>(existingTheme?.id || null)
  const [showMix, setShowMix] = useState(false)
  const [mix, setMix] = useState({ palette_from: '', fonts_from: '' })
  const [error, setError] = useState('')

  const generateThemes = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/generate-design-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          project_name: project.project_name,
          client_name: project.client_name,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setThemes(data.themes)
      setSelectedId(data.themes[0]?.id || null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate themes')
    } finally {
      setGenerating(false)
    }
  }

  const getResolvedTheme = (): ThemeConfig | null => {
    if (!themes) return null
    if (showMix && mix.palette_from && mix.fonts_from) {
      const paletteTheme = themes.find(t => t.id === mix.palette_from)
      const fontTheme = themes.find(t => t.id === mix.fonts_from)
      const base = themes.find(t => t.id === selectedId) || themes[0]
      if (paletteTheme && fontTheme) {
        return { ...base, id: 'custom-mix', name: 'Custom Mix', colors: paletteTheme.colors, fonts: fontTheme.fonts }
      }
    }
    return themes.find(t => t.id === selectedId) || null
  }

  const handleConfirm = () => {
    const theme = getResolvedTheme()
    if (theme) onThemeConfirmed(theme)
  }

  if (existingTheme && !themes) {
    return (
      <div style={{ padding: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <CheckCircle2 size={14} color="#22c55e" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>Theme selected: {existingTheme.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {[existingTheme.colors.primary, existingTheme.colors.secondary, existingTheme.colors.accent, existingTheme.colors.background].map((c, i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
          ))}
          <span style={{ fontSize: 11, color: '#5A6A7A', marginLeft: 4 }}>{existingTheme.fonts.heading} / {existingTheme.fonts.body}</span>
        </div>
        <button
          onClick={() => { setThemes(null); generateThemes() }}
          style={{ fontSize: 11, color: '#5A6A7A', background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}
        >
          Regenerate options
        </button>
      </div>
    )
  }

  if (!themes) {
    return (
      <div style={{ padding: '12px 0' }}>
        <p style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 12 }}>
          Generate 4 design theme options based on the client brief. Pick one or mix aspects from different themes.
        </p>
        {error && <p style={{ fontSize: 12, color: '#dc2626', marginBottom: 10 }}>{error}</p>}
        <button
          onClick={generateThemes}
          disabled={generating}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: generating ? 'rgba(27,42,74,0.1)' : '#D4A84B',
            color: generating ? '#5A6A7A' : '#1B2A4A',
            border: 'none', cursor: generating ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {generating ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating themes...</> : '🎨 Generate Design Options'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '12px 0' }}>
      {/* Theme grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
        {themes.map(theme => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={!showMix && selectedId === theme.id}
            onSelect={() => { setSelectedId(theme.id); setShowMix(false) }}
          />
        ))}
      </div>

      {/* Mix panel toggle */}
      <button
        onClick={() => setShowMix(v => !v)}
        style={{ fontSize: 11, color: '#5A6A7A', background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: showMix ? 10 : 16 }}
      >
        <Shuffle size={11} /> {showMix ? 'Cancel mix' : 'Mix aspects from different themes'}
      </button>

      {showMix && (
        <div style={{ background: 'rgba(27,42,74,0.03)', borderRadius: 8, padding: '10px 12px', marginBottom: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#5A6A7A', display: 'block', marginBottom: 4 }}>PALETTE FROM</label>
            <select
              value={mix.palette_from}
              onChange={e => setMix(m => ({ ...m, palette_from: e.target.value }))}
              style={{ width: '100%', padding: '6px 8px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', color: '#1B2A4A', background: 'white' }}
            >
              <option value="">Choose...</option>
              {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#5A6A7A', display: 'block', marginBottom: 4 }}>FONTS FROM</label>
            <select
              value={mix.fonts_from}
              onChange={e => setMix(m => ({ ...m, fonts_from: e.target.value }))}
              style={{ width: '100%', padding: '6px 8px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', color: '#1B2A4A', background: 'white' }}
            >
              <option value="">Choose...</option>
              {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Confirm button */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={generateThemes}
          style={{ padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(27,42,74,0.06)', color: '#5A6A7A', border: 'none', cursor: 'pointer' }}
        >
          Regenerate
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedId && !(showMix && mix.palette_from && mix.fonts_from)}
          style={{
            flex: 1, padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: '#D4A84B', color: '#1B2A4A', border: 'none', cursor: 'pointer',
          }}
        >
          Confirm Theme →
        </button>
      </div>
    </div>
  )
}
