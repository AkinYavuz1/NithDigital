'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import {
  demoClients, demoInvoices, demoQuotes, demoExpenses, demoIncome,
  demoMileage, demoBookings, demoNotifications,
  type DemoClient, type DemoInvoice, type DemoQuote, type DemoExpense,
  type DemoIncomeRecord, type DemoMileageLog, type DemoBooking, type DemoNotification,
} from './demo-data'

export interface DemoData {
  clients: DemoClient[]
  invoices: DemoInvoice[]
  quotes: DemoQuote[]
  expenses: DemoExpense[]
  income: DemoIncomeRecord[]
  mileage: DemoMileageLog[]
  bookings: DemoBooking[]
  notifications: DemoNotification[]
}

interface DemoContextValue {
  isDemo: true
  data: DemoData
  updateData: (fn: (prev: DemoData) => DemoData) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>({
    clients: demoClients,
    invoices: demoInvoices,
    quotes: demoQuotes,
    expenses: demoExpenses,
    income: demoIncome,
    mileage: demoMileage,
    bookings: demoBookings,
    notifications: demoNotifications,
  })

  const updateData = (fn: (prev: DemoData) => DemoData) => {
    setData(prev => fn(prev))
  }

  return (
    <DemoContext.Provider value={{ isDemo: true, data, updateData }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside DemoDataProvider')
  return ctx
}
