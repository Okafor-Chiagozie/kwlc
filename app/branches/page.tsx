"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Users, ChevronLeft, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import MainLayout from "@/components/main-layout"
import { getAllBranches } from "@/services/branch"
import { useApi } from "@/hooks/useApi"
import { Branch, GetAllBranchesRequest } from "@/types/branch"
import { useRouter } from "next/navigation"

// Loading component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    <p className="text-gray-600">Loading our locations...</p>
  </div>
)

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <MapPin className="h-12 w-12 text-gray-400 mb-4" />
    <p className="text-gray-600 mb-2">No branches found</p>
    <p className="text-sm text-gray-500 text-center">Please check back later or contact us for more information.</p>
  </div>
)

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center max-w-md mx-auto py-20">
    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
    <h2 className="text-xl font-semibold mb-2">Unable to Load Branches</h2>
    <p className="text-gray-600 mb-4">{error}</p>
    <Button onClick={onRetry}>Try Again</Button>
  </div>
)

export default function BranchesPage() {
  const router = useRouter()

  // Fetch all branches
  const { 
    data: branchesResponse, 
    loading: branchesLoading, 
    error: branchesError,
    refetch: refetchBranches 
  } = useApi(() => {
    const request: GetAllBranchesRequest = {
      pageSize: 50, // Adjust as needed
      pageNumber: 1,
      searchParams: {}
    }
    return getAllBranches(request)
  }, [])

  const branches = branchesResponse?.data || []
  const visibleBranches = Array.isArray(branches) ? branches.filter((b: any) => b?.isDeleted !== true) : []
  const totalBranches = branchesResponse?.totalCount || 0

  // Helper function to check if error is "No Record found.", so it will use empty state instead of throwing error
  const isNoRecordsError = (error: string | null) => {
    return error && error.toLowerCase().includes("no record found")
  }

  // Check if we should show empty state
  const isEmptyState = !branchesLoading && (
    (!branchesError && branches.length === 0) ||
    isNoRecordsError(branchesError)
  )

  // Format date helper
  const formatEstablishedYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
  }

  // Format day names for display
  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
  }

  // Format time from TimeOnly object
  const formatTime = (timeOnly: any) => {
    if (!timeOnly) return ''
    const hour = timeOnly.hour || 0
    const minute = timeOnly.minute || 0
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section (aligned with shop hero) */}
        <section className="relative h-[300px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png"
              alt="Branches Hero"
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

          <div className="relative h-full flex items-center justify-center text-center text-white px-4 pt-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Our Branches</h1>
              <p className="text-lg md:text-xl text-white/90">
                Kingdom Ways Living Church has grown to serve communities across Nigeria, spreading the gospel and building strong faith communities.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold">{branchesLoading ? '...' : totalBranches}</div>
                  <div className="text-sm text-white/90">Branches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">14</div>
                  <div className="text-sm text-white/90">Years of Service</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Branches Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Loading State */}
            {branchesLoading && <LoadingState />}

            {/* Error State - only show for actual errors, not "no records" */}
            {branchesError && !isNoRecordsError(branchesError) && (
              <ErrorState 
                error={branchesError} 
                onRetry={refetchBranches} 
              />
            )}

            {/* Empty State */}
            {isEmptyState && <EmptyState />}

            {/* Branches Grid - Only show when we have data and no errors (except no records) */}
            {!branchesLoading && (!branchesError || isNoRecordsError(branchesError)) && visibleBranches.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {visibleBranches.map((branch) => (
                  <Card
                    key={branch.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/branches/${branch.id}`)}
                  >
                    <div className="relative h-48">
                      <Image
                        src={branch.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                        alt={branch.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-white">
                          Est. {formatEstablishedYear(branch.dateCreated)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{branch.name}</h3>
                          <div className="flex items-start gap-2 text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="text-sm">{branch.address}</p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Phone className="h-4 w-4" />
                            <p className="text-sm">{branch.phoneNumber}</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{branch.lga}, {branch.state}</span>
                          </div>
                        </div>
                      </div>

                      {/* Welcome Address Preview */}
                      {branch.welcomeAddress && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {branch.welcomeAddress}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => router.push(`/branches/${branch.id}`)}>
                          View Details
                        </Button>
                        <Button variant="outline" className="flex-1" asChild>
                          <a href={`tel:${branch.phoneNumber}`}>Contact</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action - Always shown */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Family</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Find a branch near you and become part of our vibrant community of believers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Find Nearest Branch
              </Button>
              <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}