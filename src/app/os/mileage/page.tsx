import type { Metadata } from 'next'
import MileageClient from './MileageClient'
export const metadata: Metadata = { title: 'Mileage — Business OS' }
export default function MileagePage() { return <MileageClient /> }
