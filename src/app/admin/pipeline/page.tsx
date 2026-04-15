export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import SalesPipelineClient from './SalesPipelineClient'

export const metadata: Metadata = { title: 'Sales Pipeline — Nith Digital Admin' }

export default function PipelinePage() {
  return <SalesPipelineClient />
}
