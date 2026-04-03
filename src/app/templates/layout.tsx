import { Suspense } from 'react'
import { TemplateProvider } from './TemplateContext'

// Templates are standalone sites — no Nith Digital navbar or footer
export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <TemplateProvider>
        {children}
      </TemplateProvider>
    </Suspense>
  )
}
