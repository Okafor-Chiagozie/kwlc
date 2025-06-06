import Image from "next/image"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import FadeIn from "./ui/fade-in"
import Link from "next/link"

const locations = [
  {
    name: "Lagos",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lagos-VgjOxtCXSS5PU2WpGNpg21KuQQyOqw.png",
    times: "8:30am • 10:00am • 11:45am",
    address: "24 Prince Ibrahim Eletu Avenue, Lagos",
  },
  {
    name: "Abuja",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abuja-1Q6lmBtbO0fCpaVDqmDIaVhgZXpDs4.png",
    times: "9:00am • 11:00am",
    address: "15 Crescent, Gwarinpa Estate, Abuja",
  },
  {
    name: "PH City",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phc-a9J4TJx4dAMLmVKQBlkvjkGySzGDDP.png",
    times: "10:00am",
    address: "123 Olu Obasanjo Road, Port Harcourt",
  },
]

export default function LocationsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">Our Locations</span>
            <h2 className="text-4xl md:text-5xl font-bold my-4">Worship With Us Today</h2>
            <p className="text-lg text-slate-600">
              Choose a branch closest to you and join our community for an uplifting experience of faith and fellowship.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <FadeIn key={location.name} delay={0.2 * (index + 1)}>
              <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative h-56">
                  <Image
                    src={location.image || "/placeholder.svg"}
                    alt={`${location.name} Branch`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{location.name}</h3>
                  <div className="flex items-start gap-3 mb-4 text-slate-600">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm">{location.address}</p>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Sunday Service Times</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.times.split("•").map((time) => (
                        <span
                          key={time}
                          className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700"
                        >
                          {time.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-primary hover:text-primary"
                    asChild
                  >
                    <Link href="#">
                      Get Directions <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
