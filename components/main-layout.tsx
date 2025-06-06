import type React from "react"
import Navbar from "./navbar"
import Footer from "./footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
