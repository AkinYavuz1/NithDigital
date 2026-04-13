import type { Metadata } from 'next'
import TradeDeskSignupClient from './TradeDeskSignupClient'

export const metadata: Metadata = {
  title: 'Sign up — TradeDesk | Nith Digital',
  description: 'The WhatsApp back-office for UK tradespeople. Log expenses, build your portfolio, and get trade answers — all by text.',
}

export default function TradeDeskSignupPage() {
  return <TradeDeskSignupClient />
}
