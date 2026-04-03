import type { Metadata } from 'next'
import FilesClient from './FilesClient'
export const metadata: Metadata = { title: 'Files — Business OS' }
export default function FilesPage() { return <FilesClient /> }
