import Image from "next/image"
import Link from "next/link"
import { Church, Heart, Calendar } from "lucide-react"
import FadeIn from "./ui/fade-in"

const services = [
  {
    title: "Live Service",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/live-service-5faFVpfIByX7WiFuRlhAfkv8BbmtjY.png",
    href: "/livestream",
    description: "Experience powerful moments of worship and prayer.",
    icon: Church,
  },
  {
    title: "Church Weddings",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/church-weddings-DmQ5gtkndaCkxGoNJw8nAlnk0Jjwvh.png",
    href: "/events",
    description: "Begin your journey together with a beautiful, sacred ceremony.",
    icon: Heart,
  },
  {
    title: "Special Events",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/special-event-qzExNLmmxo7PJwS7A1c1MAXrZMdft9.png",
    href: "/events",
    description: "Join us for transformative conferences and community gatherings.",
    icon: Calendar,
  },
]

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold my-4">Experience God's Love</h2>
            <p className="text-lg text-slate-600">
              Join us in worship, celebration, and community as we grow together in faith and purpose.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={0.2 * (index + 1)}>
              <Link href={service.href} className="group block">
                <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="w-12 h-12 mb-4 bg-primary/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/90 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
