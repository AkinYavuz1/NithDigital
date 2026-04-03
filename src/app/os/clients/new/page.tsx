import type { Metadata } from 'next'
import ClientForm from '../ClientForm'

export const metadata: Metadata = { title: 'Add Client — Business OS' }
export default function NewClientPage() { return <ClientForm /> }
