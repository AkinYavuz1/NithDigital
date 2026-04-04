import type { Metadata } from 'next'
import FileShareWrapper from './FileShareWrapper'

export const dynamic = 'force-static'
export const metadata: Metadata = { title: 'Download File — Nith Digital' }

export default function FileSharePage() {
  return <FileShareWrapper />
}
