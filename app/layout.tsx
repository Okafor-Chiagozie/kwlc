import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ChurchInfoProvider } from "@/components/church-info-provider"
import { CartProvider } from "@/hooks/useCart"

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
          <CartProvider>
            {children}
          </CartProvider>
        </ChurchInfoProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
