import type { Metadata } from 'next'
import QuoteForm from '../QuoteForm'
export const metadata: Metadata = { title: 'New Quote — Business OS' }
export default function NewQuotePage() { return <QuoteForm /> }
