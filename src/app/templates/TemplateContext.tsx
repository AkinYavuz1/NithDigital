'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export interface TemplateOverrides {
  name?: string
  tagline?: string
  phone?: string
  email?: string
  location?: string
  accent?: string
}

interface TemplateContextValue {
  overrides: TemplateOverrides
  get: (key: keyof TemplateOverrides, fallback: string) => string
  accent: string
  hideBar: boolean
}

const TemplateContext = createContext<TemplateContextValue>({
  overrides: {},
  get: (_key, fallback) => fallback,
  accent: '',
  hideBar: false,
})

export function useTemplate() {
  return useContext(TemplateContext)
}

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const overrides: TemplateOverrides = {
    name: searchParams.get('name') ?? undefined,
    tagline: searchParams.get('tagline') ?? undefined,
    phone: searchParams.get('phone') ?? undefined,
    email: searchParams.get('email') ?? undefined,
    location: searchParams.get('location') ?? undefined,
    accent: searchParams.get('accent') ?? undefined,
  }

  const accent = overrides.accent ? `#${overrides.accent}` : ''
  const hideBar = searchParams.get('hideBar') === 'true'

  const get = (key: keyof TemplateOverrides, fallback: string) =>
    overrides[key] ?? fallback

  // Apply accent colour as CSS var override
  useEffect(() => {
    if (!mounted) return
    if (accent) {
      document.documentElement.style.setProperty('--template-accent', accent)
    }
  }, [accent, mounted])

  return (
    <TemplateContext.Provider value={{ overrides, get, accent, hideBar }}>
      {children}
    </TemplateContext.Provider>
  )
}
