"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Search, Share2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const previousSermons = [
  {
    id: 1,
    title: "Healing Sunday",
    pastor: "Pastor Ken",
    date: "20th Sept. 2021",
    views: "140.2k",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png",
  },
  {
    id: 2,
    title: "Power of Faith",
    pastor: "Pastor Ken",
    date: "13th Sept. 2021",
    views: "135.8k",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-2-U32r6iEgfd2Lfx6ankMMHQVltVVlpX.png",
  },
  {
    id: 3,
    title: "Walking in Grace",
    pastor: "Pastor Ken",
    date: "6th Sept. 2021",
    views: "142.3k",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-3-0cWkRXuoGw3r8yqCXIqVL0agA5oU4R.png",
  },
  {
    id: 4,
    title: "Divine Breakthrough",
    pastor: "Pastor Ken",
    date: "30th Aug. 2021",
    views: "138.9k",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-4-6G003aSifHweV8WyppEggse9XDXGwg.png",
  },
]

export default function LivestreamPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16 pt-16">
      {/* Live Stream Section */}
      <div className="relative aspect-video w-full max-h-[80vh] bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/live-hero-7CTS3qrc5mYuIuCPpCojv3rWBxAw0U.png"
          alt="Live Stream"
          fill
          className="object-cover"
          priority
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button
            className="group relative w-20 h-20 rounded-full bg-primary/90 hover:bg-primary transition-all duration-300 transform hover:scale-110"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-white rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-white rounded-full opacity-10 group-hover:scale-125 transition-transform duration-700"></div>
            <Play className="h-8 w-8 text-white ml-1.5" />
          </button>
        </div>

        {/* Live Badge and Viewer Count */}
        <div className="absolute top-4 left-4 flex items-center gap-4 z-20">
          <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <span className="text-sm font-medium">LIVE</span>
          </div>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">40.2k watching</span>
          </div>
        </div>

        {/* Share Button */}
        <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-white hover:bg-white/20 z-20">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Stream Info */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-5xl mx-auto relative overflow-hidden shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 mix-blend-overlay"></div>

          {/* Live indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-red-500/90 px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              <span className="text-sm font-medium text-white">LIVE NOW</span>
            </div>
            <div className="h-px flex-grow bg-gradient-to-r from-red-500/50 to-transparent"></div>
            <div className="text-gray-400 text-sm flex items-center gap-2">
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
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Started 45 minutes ago</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white leading-tight">
                Sunday Service with Pastor Ken Nbachi
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Sunday Service</span>
                <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">Worship</span>
                <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">Teaching</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Join us for a powerful time of worship and the Word. Experience the transforming presence of God as we
                gather together in faith and unity. Pastor Ken brings an inspiring message of hope and encouragement for
                your spiritual journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path>
                  </svg>
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Save</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
              <h3 className="font-bold text-lg mb-4 text-white">Stream Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">Sunday, July 7, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
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
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="text-white">9:00 AM - 11:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
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
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Viewers</p>
                    <p className="text-white">40.2k watching</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
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
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">Main Auditorium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Sundays Section */}
      <div id="previous-sundays" className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Previous Sundays</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Sermon"
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previousSermons.map((sermon) => (
            <div
              key={sermon.id}
              className="group relative bg-gray-800 rounded-xl overflow-hidden transition-transform hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-video">
                <Image
                  src={sermon.image || "/placeholder.svg"}
                  alt={sermon.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white ml-1" />
                  </div>
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{sermon.title}</h3>
                <p className="text-gray-400 text-sm">{sermon.pastor}</p>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                  <span>{sermon.date}</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{sermon.views} Views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white">
            See More
          </Button>
        </div>
      </div>

      {/* Service Schedule Section */}
      <div id="schedule" className="container mx-auto px-4 py-16 mt-8">
        <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6">Service Schedule</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Sunday Service</h3>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Weekly</span>
              </div>
              <p className="text-gray-400 mb-4">Join us for our main worship service with Pastor Ken.</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">9:00 AM - 11:30 AM</span>
                <span className="text-gray-400">Main Auditorium</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Bible Study</h3>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Wednesday</span>
              </div>
              <p className="text-gray-400 mb-4">Midweek Bible study and prayer meeting.</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">6:00 PM - 8:00 PM</span>
                <span className="text-gray-400">Fellowship Hall</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Prayer Meeting</h3>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Friday</span>
              </div>
              <p className="text-gray-400 mb-4">Join us for a powerful time of prayer and intercession.</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">7:00 PM - 9:00 PM</span>
                <span className="text-gray-400">Prayer Room</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
