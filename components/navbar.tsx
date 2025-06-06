"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Phone, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [sideNavOpen, setSideNavOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Pages", href: "#pages" },
    { name: "Donations", href: "/donations" },
    { name: "Event", href: "/events" },
    { name: "Blog", href: "#blog" },
    { name: "Shop", href: "#shop" },
    { name: "Livestream", href: "/livestream" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="relative w-12 h-12">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
            alt="Kingdom Ways Living Church Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-gray-900 hover:text-primary" : "text-white hover:text-primary/90"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className={`hidden lg:flex gap-2 bg-transparent transition-colors ${
              scrolled
                ? "border-gray-200 text-gray-900 hover:bg-gray-50"
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>+234 70 433 2832</span>
          </Button>

          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-full transition-colors ${
                scrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button
              className={`p-2 rounded-full transition-colors relative ${
                scrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-white">Donate</Button>

          <button
            className={`lg:hidden ${scrolled ? "text-gray-900" : "text-white"}`}
            onClick={() => setSideNavOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Side Navigation for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
          sideNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSideNavOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300 ${
            sideNavOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                  alt="Kingdom Ways Living Church Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-gray-900">KWLC</span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" onClick={() => setSideNavOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center py-3 px-4 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    onClick={() => setSideNavOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white mb-3">Donate</Button>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-md">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-700 text-sm">+234 70 433 2832</span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
