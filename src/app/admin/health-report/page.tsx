import type { Metadata } from 'next'
import HealthReportClient from './HealthReportClient'

export const metadata: Metadata = {
  title: 'D&G Digital Health Report — Nith Digital Admin',
}

export default function HealthReportPage() {
  return <HealthReportClient />
}
