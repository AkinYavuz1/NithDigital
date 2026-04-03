import type { Metadata } from 'next'
import ClientsClient from './ClientsClient'

export const metadata: Metadata = { title: 'Clients — Business OS' }
export default function ClientsPage() { return <ClientsClient /> }
