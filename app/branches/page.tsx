"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Users, ChevronLeft, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import MainLayout from "@/components/main-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllBranches } from "@/services/branch"
import { useApi } from "@/hooks/useApi"
import { Branch, GetAllBranchesRequest } from "@/types/branch"

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
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

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
        {/* Hero Section - Always shown */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Branches</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Kingdom Ways Living Church has grown to serve communities across Nigeria, spreading the gospel and
              building strong faith communities.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{branchesLoading ? '...' : totalBranches}</div>
                <div className="text-sm opacity-90">Branches</div>
              </div>
              <div>
                <div className="text-3xl font-bold">14</div>
                <div className="text-sm opacity-90">Years of Service</div>
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
            {!branchesLoading && (!branchesError || isNoRecordsError(branchesError)) && branches.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {branches.map((branch) => (
                  <Card
                    key={branch.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedBranch(branch)}
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
                        <Button className="flex-1" onClick={() => setSelectedBranch(branch)}>
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
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Branch Details Dialog */}
      {selectedBranch && (
        <Dialog open={!!selectedBranch} onOpenChange={() => setSelectedBranch(null)}>
          <DialogContent className="sm:max-w-[800px] p-0">
            <ScrollArea className="max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 w-full">
                <Image
                  src={selectedBranch.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                  alt={selectedBranch.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 text-white bg-black/50 hover:bg-black/70"
                  onClick={() => setSelectedBranch(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-3xl font-bold">{selectedBranch.name}</DialogTitle>
                  <DialogDescription className="text-lg text-gray-600">
                    Established: {formatEstablishedYear(selectedBranch.dateCreated)}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Location & Contact
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">{selectedBranch.address}</p>
                      <p className="text-gray-700">
                        <span className="font-medium">{selectedBranch.lga}, {selectedBranch.state}</span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">{selectedBranch.country}</span>
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {selectedBranch.phoneNumber}
                      </p>
                      {selectedBranch.email && (
                        <p className="text-gray-700">{selectedBranch.email}</p>
                      )}
                    </div>
                    <Button asChild>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Get Directions <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  {/* Branch Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5" /> Branch Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Established:</span> {formatEstablishedYear(selectedBranch.dateCreated)}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Location:</span> {selectedBranch.lga}, {selectedBranch.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Welcome Address */}
                {selectedBranch.welcomeAddress && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Welcome Message</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{selectedBranch.welcomeAddress}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <Button className="flex-1" asChild>
                    <a
                      href={selectedBranch.location?.replace('/embed', '') || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Visit Branch <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`tel:${selectedBranch.phoneNumber}`}>Contact Branch</a>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  )
}