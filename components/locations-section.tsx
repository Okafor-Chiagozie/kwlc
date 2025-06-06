import Image from "next/image"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const locations = [
  {
    name: "Lagos",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lagos-VgjOxtCXSS5PU2WpGNpg21KuQQyOqw.png",
    times: "8:30am • 10:00am • 11:45am",
    address: "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road, Lagos",
    description: "Experience worship in the heart of Nigeria's most vibrant city",
  },
  {
    name: "Abuja",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abuja-1Q6lmBtbO0fCpaVDqmDIaVhgZXpDs4.png",
    times: "8:30am • 10:00am • 11:45am",
    address: "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road, Abuja",
    description: "Join us in Nigeria's capital city for spiritual growth",
  },
  {
    name: "PH City",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phc-a9J4TJx4dAMLmVKQBlkvjkGySzGDDP.png",
    times: "8:30am • 10:00am • 11:45am",
    address: "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road, PH City",
    description: "Worship with us in the garden city of Nigeria",
  },
]

export default function LocationsSection() {
  return (
    <section id="locations" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 -skew-y-3 transform-gpu"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-primary/5 skew-y-3 transform-gpu"></div>

      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/5 mix-blend-multiply"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary/5 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Our Locations</span>
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            Worship with us today
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "600ms" }}>
            Choose a branch closest to you and join our community of believers for an uplifting experience of faith and
            fellowship
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${800 + index * 200}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/5 opacity-60 group-hover:opacity-70 transition-opacity z-10"></div>
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={location.image || "/placeholder.svg"}
                  alt={`${location.name} Branch`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
                  <span className="text-xs uppercase tracking-wider bg-primary/80 px-3 py-1 rounded-full mb-3">
                    Branch
                  </span>
                  <h3 className="text-4xl font-bold tracking-tight drop-shadow-md mb-2">{location.name}</h3>
                  <p className="text-sm text-white/90 max-w-xs text-center px-4">{location.description}</p>
                </div>
              </div>

              <div className="p-8 relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full p-4 shadow-lg">
                  <div className="bg-primary/10 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="mt-6 mb-6">
                  <h4 className="font-semibold text-lg mb-2 text-center">Sunday Services</h4>
                  <div className="flex justify-center gap-2 mb-4">
                    {location.times.split("•").map((time, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                        {time.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-start gap-3 mb-6">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all group-hover:shadow-md">
                    <span>Get Directions</span>
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
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6 animate-fade-in" style={{ animationDelay: "1400ms" }}>
            Can't find a location near you? Join our online services every Sunday.
          </p>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-colors animate-fade-in"
            style={{ animationDelay: "1600ms" }}
          >
            Join Online Service
          </Button>
        </div>
      </div>
    </section>
  )
}
