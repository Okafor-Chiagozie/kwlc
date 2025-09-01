import type React from "react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { useChurchInfo } from "@/components/church-info-provider"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { details, socials } = useChurchInfo()
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                {details.welcomeAddress || "Kingdom Ways Living Church is dedicated to spreading God's love and building a community of believers."}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
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
                  <Link href={'/events'} className="text-gray-400 hover:text-white transition-colors">Events</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                {socials.facebook && (
                  <li>
                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                  </li>
                )}
                {socials.instagram && (
                  <li>
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                  </li>
                )}
                {socials.twitter && (
                  <li>
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                  </li>
                )}
                {socials.youtube && (
                  <li>
                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">YouTube</a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>{details.phoneNumber || "+234 70 433 2832"}</li>
                <li>{details.email || "info@kwlchq.org"}</li>
                <li>{details.address || "24 Prince Ibrahim Eletu Avenue, Lagos"}</li>
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
