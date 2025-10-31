"use client"

import React from "react"

interface PaymentsToggleContextValue {
  paymentsEnabled: boolean
}

const PaymentsToggleContext = React.createContext<PaymentsToggleContextValue>({ paymentsEnabled: true })

export function PaymentsToggleProvider({ children }: { children: React.ReactNode }) {
  const defaultEnabled = typeof process !== 'undefined'
    ? (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== 'false')
    : true

  const [paymentsEnabled] = React.useState<boolean>(defaultEnabled)

  return (
    <PaymentsToggleContext.Provider value={{ paymentsEnabled }}>
      {children}
    </PaymentsToggleContext.Provider>
  )
}

export function usePaymentsToggle(): PaymentsToggleContextValue {
  return React.useContext(PaymentsToggleContext)
}


