import type { Metadata } from 'next'
import FileShareWrapper from './FileShareWrapper'

export const metadata: Metadata = { title: 'Download File — Nith Digital' }
export function generateStaticParams() { return [] }

export default function FileSharePage() {
  return <FileShareWrapper />
}
