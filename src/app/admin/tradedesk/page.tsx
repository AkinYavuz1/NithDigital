import type { Metadata } from 'next'
import TradeDeskDashboardClient from './TradeDeskDashboardClient'

export const metadata: Metadata = {
  title: 'TradeDesk — Admin | Nith Digital',
}

export default function TradeDeskAdminPage() {
  return <TradeDeskDashboardClient />
}
