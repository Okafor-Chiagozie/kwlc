"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, X, Menu } from "lucide-react"

export default function ShopNav() {
  const [sideNavOpen, setSideNavOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/shop" className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back to Shop</span>
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
          <span className="font-bold text-gray-900">KWLC Shop</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-gray-900 hover:bg-gray-100 transition-colors relative">
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

          <button className="lg:hidden text-gray-900" onClick={() => setSideNavOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Side Navigation */}
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
              <span className="font-bold text-gray-900">KWLC Shop</span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" onClick={() => setSideNavOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/shop"
                  className="flex items-center py-3 px-4 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  onClick={() => setSideNavOpen(false)}
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Back to Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="flex items-center py-3 px-4 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  onClick={() => setSideNavOpen(false)}
                >
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
