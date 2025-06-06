"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const services = [
  {
    title: "Live service",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/live-service-5faFVpfIByX7WiFuRlhAfkv8BbmtjY.png",
    href: "#live-service",
    description: "Experience powerful moments of worship and prayer in our live services",
  },
  {
    title: "Church weddings",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/church-weddings-DmQ5gtkndaCkxGoNJw8nAlnk0Jjwvh.png",
    href: "#weddings",
    description: "Begin your journey together with a beautiful, sacred ceremony",
  },
  {
    title: "Special Event",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/special-event-qzExNLmmxo7PJwS7A1c1MAXrZMdft9.png",
    href: "#events",
    description: "Join us for transformative events and conferences",
  },
]

export default function ServicesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 font-medium text-sm mb-6 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span>Our Services</span>
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 text-white animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            Experience God's Love
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "600ms" }}>
            Join us in worship, celebration, and community as we grow together in faith
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={service.href}
              className="group relative block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: hoveredIndex === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="relative h-[400px] rounded-2xl overflow-hidden"
              >
                {/* Background Image */}
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                  priority={index === 0}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <motion.div
                    initial={false}
                    animate={{
                      y: hoveredIndex === index ? -10 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-white/90 text-lg transform opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {service.description}
                    </p>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
