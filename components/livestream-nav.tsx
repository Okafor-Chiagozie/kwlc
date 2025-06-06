"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LivestreamNav() {
  const [scrolled, setScrolled] = useState(false)
  const [sideNavOpen, setSideNavOpen] = useState(false)

  useEffect(() => {
    // No scroll effect for livestream nav - it maintains its background color
    setScrolled(true)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-gray-900/90 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`flex items-center gap-2 ${
              scrolled ? "text-white" : "text-white"
            } hover:text-primary/90 transition-colors`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
              alt="Kingdom Ways Living Church Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-white">KWLC Live</span>
        </div>

        <div className="flex items-center gap-4">
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90 transition-colors">
            Donate
          </Button>

          <button className="lg:hidden text-white" onClick={() => setSideNavOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Side Navigation */}
      <div
        className={`fixed inset-0 bg-black/70 z-50 lg:hidden transition-opacity duration-300 ${
          sideNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSideNavOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-gray-900 shadow-xl transition-transform duration-300 ${
            sideNavOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                  alt="Kingdom Ways Living Church Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-white">KWLC Live</span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400" onClick={() => setSideNavOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="flex items-center py-3 px-4 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  onClick={() => setSideNavOpen(false)}
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </Link>
              </li>
              <li>
                <Link
                  href="#previous-sundays"
                  className="flex items-center py-3 px-4 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  onClick={() => setSideNavOpen(false)}
                >
                  Previous Sundays
                </Link>
              </li>
              <li>
                <Link
                  href="#schedule"
                  className="flex items-center py-3 px-4 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  onClick={() => setSideNavOpen(false)}
                >
                  Service Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="flex items-center py-3 px-4 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  onClick={() => setSideNavOpen(false)}
                >
                  Events
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white mb-3">Donate</Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
