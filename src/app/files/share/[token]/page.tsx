import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Download File — Nith Digital' }

import FileShareWrapper from './FileShareWrapper'

export default function FileSharePage({ params }: { params: { token: string } }) {
  return <FileShareWrapper token={params.token} />
}
