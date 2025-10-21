"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/useApi"
import { getAllBranches } from "@/services/branch"
import { Branch } from "@/types/branch"



// Fallback image for branches when no image is provided
const branchFallbackImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"

// Transform API branch data to UI format
const transformBranchToLocation = (branch: Branch) => ({
  id: branch.id,
  name: branch.name,
  image: branch.imageUrl || branchFallbackImage,
  times: "8:30am • 10:00am • 11:45am", // Default times since not in API
  address: branch.address, // Clean address display
  mapLink: branch.location, // Google Maps link for directions
  description: branch.welcomeAddress || `Join us in ${branch.name} for spiritual growth`,
  state: branch.state,
  lga: branch.lga,
  country: branch.country,
  email: branch.email,
  phoneNumber: branch.phoneNumber,
})

export default function LocationsSection() {
  // Fetch branches from API
  const { data: branchesResponse, loading, error, refetch } = useApi(
    () => getAllBranches({
      pageSize: 50, // Get up to 50 branches
      pageNumber: 1,
      searchParams: {}
    }),
    []
  )





  // Transform API data to location format
  const allLocations = branchesResponse?.isSuccessful && branchesResponse.data
    ? branchesResponse.data
        .filter((b: Branch) => !b.isDeleted)
        .map(transformBranchToLocation)
    : []
  const locations = allLocations.slice(0, 3)

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Loading our locations...</p>
    </div>
  )

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-gray-600 mb-4">Unable to load locations</p>
      <Button onClick={refetch} variant="outline">
        Try Again
      </Button>
    </div>
  )

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

        {/* Show loading or error states */}
        {loading && <LoadingState />}
        {error && !loading && <ErrorState />}

        {/* Show locations when data is available and not empty */}
        {!loading && !error && locations.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-10 relative">
              {locations.map((location, index) => (
                <div
                  key={location.id || location.name}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${800 + index * 200}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/5 opacity-60 group-hover:opacity-70 transition-opacity z-10"></div>
                    <Image
                      src={location.image}
                      alt={`${location.name} Branch`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = branchFallbackImage
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
                      <span className="text-xs uppercase tracking-wider bg-primary/80 px-3 py-1 rounded-full mb-3">
                        Branch
                      </span>
                      <h3 className="text-4xl font-bold tracking-tight drop-shadow-md mb-2 px-4 text-center">{location.name}</h3>
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
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <p className="text-sm text-gray-600">{location.address}</p>
                      </div>
                      {location.phoneNumber && (
                        <div className="flex items-center gap-3 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-primary shrink-0"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <a
                            href={`tel:${location.phoneNumber}`}
                            className="text-sm text-gray-600 hover:text-primary transition-colors"
                          >
                            {location.phoneNumber}
                          </a>
                        </div>
                      )}
                      <a 
                        href={location.mapLink?.replace('/embed', '') || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all group-hover:shadow-md inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium"
                      >
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
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/branches">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  View more branches
                </Button>
              </Link>
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-600 mb-6 animate-fade-in" style={{ animationDelay: "1400ms" }}>
                Can't find a location near you? Join our online services every Sunday.
              </p>
              <Link href="/livestream">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-colors animate-fade-in"
                  style={{ animationDelay: "1600ms" }}
                >
                  Join Online Service
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Show empty state when no branches found */}
        {!loading && !error && locations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <MapPin className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No branches found</p>
            <p className="text-sm text-gray-500 text-center">Please check back later or contact us for more information.</p>
          </div>
        )}

        {/* Removed branch count display */}
      </div>
    </section>
  )
}