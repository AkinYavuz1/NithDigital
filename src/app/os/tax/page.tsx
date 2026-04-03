import type { Metadata } from 'next'
import TaxClient from './TaxClient'
export const metadata: Metadata = { title: 'Tax Estimator — Business OS' }
export default function TaxPage() { return <TaxClient /> }
