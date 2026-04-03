import type { Metadata } from 'next'
import QuotesClient from './QuotesClient'
export const metadata: Metadata = { title: 'Quotes — Business OS' }
export default function QuotesPage() { return <QuotesClient /> }
