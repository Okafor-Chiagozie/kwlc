"use client"
import type React from "react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { useChurchInfo } from "@/components/church-info-provider"
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react"
import { Toaster } from "sonner"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { details, socials } = useChurchInfo()
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster richColors position="top-center" />
      <Navbar />
      {children}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:[grid-template-columns:1.5fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 shrink-0">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png" alt="Church Logo" className="object-contain w-full h-full" />
                </div>
                <h3 className="font-bold text-lg">{details.name || "Kingdom Ways Living Church"}</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {details.welcomeAddress || "Kingdom Ways Living Church is dedicated to spreading God's love and building a community of believers."}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 relative inline-block">Quick Links<span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span></h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={'/'} className="text-gray-400 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href={'/branches'} className="text-gray-400 hover:text-white transition-colors">Branches</Link>
                </li>
                <li>
                  <Link href={'/donations'} className="text-gray-400 hover:text-white transition-colors">Donate</Link>
                </li>
                <li>
                  <Link href={'/payments'} className="text-gray-400 hover:text-white transition-colors">Payments</Link>
                </li>
                <li>
                  <Link href={'/events'} className="text-gray-400 hover:text-white transition-colors">Events</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 relative inline-block">Connect<span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span></h3>
              <ul className="space-y-2 text-sm">
                <li>
                  {socials.facebook ? (
                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Facebook className="h-4 w-4 text-primary" />
                      </span>
                      Facebook
                    </a>
                  ) : (
                    <span className="text-gray-400 inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Facebook className="h-4 w-4 text-primary" />
                      </span>
                      Facebook
                    </span>
                  )}
                  </li>
                <li>
                  {socials.instagram ? (
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Instagram className="h-4 w-4 text-primary" />
                      </span>
                      Instagram
                    </a>
                  ) : (
                    <span className="text-gray-400 inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Instagram className="h-4 w-4 text-primary" />
                      </span>
                      Instagram
                    </span>
                  )}
                </li>
                <li>
                  {socials.twitter ? (
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Twitter className="h-4 w-4 text-primary" />
                      </span>
                      Twitter
                    </a>
                  ) : (
                    <span className="text-gray-400 inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Twitter className="h-4 w-4 text-primary" />
                      </span>
                      Twitter
                    </span>
                  )}
                  </li>
                <li>
                  {socials.youtube ? (
                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Youtube className="h-4 w-4 text-primary" />
                      </span>
                      YouTube
                    </a>
                  ) : (
                    <span className="text-gray-400 inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center">
                        <Youtube className="h-4 w-4 text-primary" />
                      </span>
                      YouTube
                    </span>
                  )}
                  </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 relative inline-block">Contact<span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span></h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-gray-300">{details.phoneNumber || "+234 70 433 2832"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-gray-300">{details.email || "info@kwlchq.org"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 inline-flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-gray-300">{details.address || "24 Prince Ibrahim Eletu Avenue, Lagos"}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} {details.name || "Kingdom Ways Living Church"}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
