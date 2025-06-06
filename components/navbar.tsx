"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Menu, ShoppingCart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [sideNavOpen, setSideNavOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Pastors", href: "/pastors" },
    { name: "Donations", href: "/donations" },
    { name: "Events", href: "/events" },
    { name: "Shop", href: "/shop" },
    { name: "Livestream", href: "/livestream" },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-md" : "bg-transparent",
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
              alt="Kingdom Ways Living Church Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className={cn("font-bold text-lg transition-colors", scrolled ? "text-slate-900" : "text-white")}>
              KWLC
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 bg-white/20 p-1 rounded-full backdrop-blur-sm">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors px-4 py-2 rounded-full",
                  scrolled
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-colors",
                scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10",
              )}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-colors relative",
                scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10",
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Button>
            <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-white">Give Online</Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden rounded-full transition-colors",
                scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10",
              )}
              onClick={() => setSideNavOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Side Nav */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-[100] lg:hidden transition-opacity",
          sideNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSideNavOpen(false)}
      >
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300",
            sideNavOpen ? "translate-x-0" : "translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-slate-900">Menu</span>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSideNavOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block py-3 px-4 rounded-md text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors"
                    onClick={() => setSideNavOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">Give Online</Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
