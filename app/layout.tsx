import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ChurchInfoProvider } from "@/components/church-info-provider"
import { CartProvider } from "@/hooks/useCart"
import { PaymentsToggleProvider } from "@/components/payments-toggle-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChurchInfoProvider>
          <PaymentsToggleProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </PaymentsToggleProvider>
        </ChurchInfoProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
