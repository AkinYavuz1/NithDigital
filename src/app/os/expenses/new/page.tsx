import type { Metadata } from 'next'
import ExpenseForm from '../ExpenseForm'
export const metadata: Metadata = { title: 'Add Expense — Business OS' }
export default function NewExpensePage() { return <ExpenseForm /> }
