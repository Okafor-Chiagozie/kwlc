import type React from "react"
import LivestreamNav from "@/components/livestream-nav"
import Image from "next/image"

export default function LivestreamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <LivestreamNav />
      {children}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8 border-t border-gray-800/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                    alt="Kingdom Ways Living Church Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">KWLC</h3>
                  <p className="text-xs text-gray-400">KINGDOM WAYS LIVING CHURCH</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Kingdom Ways Living Church is dedicated to spreading God's love and building a community of believers
                through worship, fellowship, and service.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full group-hover:bg-primary transition-colors"></span>
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full group-hover:bg-primary transition-colors"></span>
                    <span>About</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full group-hover:bg-primary transition-colors"></span>
                    <span>Services</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full group-hover:bg-primary transition-colors"></span>
                    <span>Contact</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white relative inline-block">
                Connect
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Facebook</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </div>
                  <span className="text-sm">Instagram</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Twitter</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                      <path d="m10 15 5-3-5-3z"></path>
                    </svg>
                  </div>
                  <span className="text-sm">YouTube</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white relative inline-block">
                Contact
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">+234 70 433 2832</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">info@kwlchq.org</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-white">24 Prince Ibrahim Eletu Avenue, Lagos</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">© 2024 Kingdom Ways Living Church. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
