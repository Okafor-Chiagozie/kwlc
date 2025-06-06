import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                alt="Kingdom Ways Living Church Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <h3 className="font-serif text-lg font-bold text-white">KINGDOM WAYS</h3>
                <p className="text-xs text-slate-400 tracking-wider">LIVING CHURCH</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              A vibrant community of believers dedicated to experiencing God's love and sharing it with the world.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pastors" className="hover:text-primary transition-colors">
                  Our Pastors
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/donations" className="hover:text-primary transition-colors">
                  Give Online
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-6">Subscribe</h4>
            <p className="text-sm mb-4">Stay updated with our latest news, events, and messages.</p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-primary"
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Upcoming Events */}
          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-6">Upcoming Events</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-bold">07</span>
                  <span className="text-xs font-medium">JUL</span>
                </div>
                <div>
                  <h5 className="font-semibold text-white">Sunday Service</h5>
                  <p className="text-slate-400 text-sm">8:00 am - 10:30 am</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-bold">15</span>
                  <span className="text-xs font-medium">JUL</span>
                </div>
                <div>
                  <h5 className="font-semibold text-white">Bible Study</h5>
                  <p className="text-slate-400 text-sm">6:00 pm - 8:00 pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-950 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Kingdom Ways Living Church. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
