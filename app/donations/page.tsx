"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2, Target, TrendingUp, Building, AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { searchProjects } from "@/services/churchProject"
import { ChurchProjectPageViewModel, SearchProjectsResponse, ChurchProjectGetProjectsData } from "@/types/churchProject"
import { Progress } from "@/components/ui/progress"

const isNoRecordsError = (error: string | null) => {
  return error && error.toLowerCase().includes("no record found")
}

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    <p className="text-gray-600">Loading projects...</p>
  </div>
)

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to Load Projects</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  </section>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Building className="h-12 w-12 text-gray-400 mb-4" />
    <p className="text-gray-600 mb-2">No projects available</p>
    <p className="text-sm text-gray-500 text-center">Check back later for new projects to support.</p>
  </div>
)

export default function DonationsPage() {
  const [pageNumber, setPageNumber] = useState<number>(1)

  // Fetch projects from API using SearchProjects with pagination (3 per page)
  const { 
    data: projectsResponse, 
    loading: projectsLoading, 
    error: projectsError, 
    refetch: refetchProjects 
  } = useApi<SearchProjectsResponse>(() => searchProjects({ pageSize: 3, pageNumber, searchParams: {} }), [pageNumber])

  // Map live payload
  const payload = projectsResponse?.data as ChurchProjectGetProjectsData | undefined
  const projects: ChurchProjectPageViewModel[] = Array.isArray(payload?.porjects) ? payload!.porjects : []
  const totalPages = projectsResponse?.totalPages || 1

  // Hero carousel images
  const fallbackHero = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/donation.png-9JtcRLA0zWlxl6ac4XovOm11jhfnK9.jpeg"
  const heroImages: string[] = useMemo(() => {
    const arr = Array.isArray(payload?.carouselImages) ? payload!.carouselImages.filter(Boolean) : []
    return arr.length > 0 ? arr : [fallbackHero]
  }, [payload?.carouselImages])
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  useEffect(() => { setHeroIndex(0) }, [payload?.carouselImages])
  useEffect(() => {
    if (heroImages.length <= 1) return
    const t = setInterval(() => {
      if (!heroPaused) setHeroIndex((i) => (i + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(t)
  }, [heroImages.length, heroPaused])
  const prevHero = () => setHeroIndex((i) => (i - 1 + heroImages.length) % heroImages.length)
  const nextHero = () => setHeroIndex((i) => (i + 1) % heroImages.length)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProgress = (raised: number, target: number) => {
    return (raised / target) * 100
  }

  const getProjectImage = (project: ChurchProjectPageViewModel) => {
    if (project.carouselImages?.[0]) return project.carouselImages[0]
    if (project.imageUrl) return project.imageUrl
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
  }

  return (
    <MainLayout>
      <div className="min-h-screen overflow-x-hidden">
        {/* Hero Section - Carousel */}
        <section className="relative h-[400px] overflow-hidden">
          <div className="absolute inset-0" onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)}>
            <Image
              src={heroImages[heroIndex]}
              alt="Donation hero"
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
            {heroImages.length > 1 && (
              null
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

          <div className="relative h-full flex items-center justify-center text-center text-white px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                "A gift opens the way and ushers the giver into the presence of the great."
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-2">Proverbs 18:16</p>
            </div>
          </div>
        </section>

        {/* Projects - 3 per page, large layout each */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 space-y-16">
            {projectsLoading ? (
              <LoadingState />
            ) : projectsError && !isNoRecordsError(projectsError) ? (
              <ErrorState error={projectsError} onRetry={refetchProjects} />)
            : projects.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {projects.map((project) => (
                  <div key={project.id} className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Project Image */}
                    <div className="relative">
                      <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
                        <Image
                          src={getProjectImage(project)}
                          alt={project.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{project.name}</h2>

                      <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                        <p>{project.description}</p>
                        {project.location && (
                          <p className="text-sm text-gray-600">
                            <strong>Location:</strong> {project.location}
                          </p>
                        )}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Progress</span>
                            <span className="text-sm font-medium text-primary">
                              {calculateProgress(project.amountRaised || 0, project.targetAmount).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={calculateProgress(project.amountRaised || 0, project.targetAmount)} 
                            className="h-3 mb-3" 
                          />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Raised: {formatCurrency(project.amountRaised || 0)}
                            </span>
                            <span className="text-gray-600">
                              Target: {formatCurrency(project.targetAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/donations/${project.id}`}>
                          <Button 
                            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                          >
                            <Heart className="h-4 w-4" />
                            View Project
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share Project
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={() => setPageNumber((p) => Math.max(1, p - 1))} disabled={pageNumber === 1 || projectsLoading}>Previous</Button>
                  <span className="text-sm text-gray-600">Page {pageNumber} of {totalPages}</span>
                  <Button variant="outline" onClick={() => setPageNumber((p) => p + 1)} disabled={projectsLoading || pageNumber >= totalPages}>Next</Button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-16 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-4-6G003aSifHweV8WyppEggse9XDXGwg.png')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact Together</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                See how your donations have made a difference in our community
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-white/80">Children Educated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">₦50M+</div>
                <div className="text-white/80">Total Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">25+</div>
                <div className="text-white/80">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
                <div className="text-white/80">Lives Impacted</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}