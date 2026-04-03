import type { Metadata } from 'next'
import ExpensesClient from './ExpensesClient'
export const metadata: Metadata = { title: 'Expenses — Business OS' }
export default function ExpensesPage() { return <ExpensesClient /> }
