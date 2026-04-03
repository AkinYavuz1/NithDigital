import type { Metadata } from 'next'
import SettingsClient from './SettingsClient'
export const metadata: Metadata = { title: 'Settings — Business OS' }
export default function SettingsPage() { return <SettingsClient /> }
