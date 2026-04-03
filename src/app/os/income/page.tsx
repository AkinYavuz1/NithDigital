import type { Metadata } from 'next'
import IncomeClient from './IncomeClient'
export const metadata: Metadata = { title: 'Income — Business OS' }
export default function IncomePage() { return <IncomeClient /> }
