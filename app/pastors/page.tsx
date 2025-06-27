"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, ChevronRight, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getAllMinisters } from "@/services/minister"
import { getAllBranches } from "@/services/branch"
import { Minister } from "@/types/minister"
import { Branch } from "@/types/branch"

export default function MinistersPage() {
  const [selectedBranch, setSelectedBranch] = useState("All Branches")
  const [branches, setBranches] = useState<Branch[]>([])

  // Fetch ministers
  const {
    data: ministersResponse,
    loading: ministersLoading,
    error: ministersError,
    refetch: refetchMinisters,
  } = useApi(() => getAllMinisters(), [])

  // Fetch branches
  const {
    data: branchesResponse,
    loading: branchesLoading,
    error: branchesError,
    refetch: refetchBranches,
  } = useApi(() => getAllBranches({ pageSize: 100, pageNumber: 1 }), [])

  // Extract ministers and branches from API responses
  const ministers = ministersResponse?.data || []
  const allBranches = branchesResponse?.data || []

  // Create branch options for filter
  useEffect(() => {
    if (allBranches.length > 0) {
      setBranches(allBranches)
    }
  }, [allBranches])

  // Filter ministers by selected branch
  const filteredMinisters = selectedBranch === "All Branches" 
    ? ministers 
    : ministers.filter((minister: Minister) => {
        const ministerBranch = branches.find(branch => branch.id === minister.branchId)
        return ministerBranch?.name === selectedBranch
      })

  // Helper function to check if error is "No Record found."
  const isNoRecordsError = (error: string | null) => {
    return error && error.toLowerCase().includes("no record found")
  }

  // Get branch name by ID
  const getBranchName = (branchId: number) => {
    const branch = branches.find(b => b.id === branchId)
    return branch?.name || "Unknown Branch"
  }

  // Loading state component
  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  )

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">Our Ministers</h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slide-up animation-delay-200">
            Meet the dedicated leaders shepherding our community with love, wisdom, and faith
          </p>
        </div>
      </section>

      {/* Branch Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          {branchesLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : branchesError && !isNoRecordsError(branchesError) ? (
            <div className="text-center">
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 text-sm">Unable to load branch filters</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={selectedBranch === "All Branches" ? "default" : "outline"}
                onClick={() => setSelectedBranch("All Branches")}
                className={
                  selectedBranch === "All Branches" 
                    ? "bg-primary text-white" 
                    : "text-gray-600 hover:text-primary"
                }
              >
                All Branches
              </Button>
              {branches.map((branch) => (
                <Button
                  key={branch.id}
                  variant={selectedBranch === branch.name ? "default" : "outline"}
                  onClick={() => setSelectedBranch(branch.name)}
                  className={
                    selectedBranch === branch.name 
                      ? "bg-primary text-white" 
                      : "text-gray-600 hover:text-primary"
                  }
                >
                  {branch.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ministers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {ministersLoading ? (
            <LoadingState message="Loading our ministers..." />
          ) : ministersError && !isNoRecordsError(ministersError) ? (
            <div className="text-center max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Unable to Load Ministers</h2>
              <p className="text-gray-600 mb-4">{ministersError}</p>
              <Button onClick={refetchMinisters}>Try Again</Button>
            </div>
          ) : (!ministersLoading && (ministers.length === 0 || isNoRecordsError(ministersError))) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">No ministers found</p>
              <p className="text-sm text-gray-500 text-center">Please check back later or contact us for more information.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMinisters.map((minister: Minister, index: number) => (
                <Card
                  key={minister.id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={minister.imageUrl || "/placeholder.svg"}
                      alt={minister.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-primary/90 text-white mb-2">
                        {minister.eventType || "Minister"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {minister.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{getBranchName(minister.branchId)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">{minister.location || "Ministry Location"}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {minister.description || "Dedicated to serving God and His people with passion and commitment."}
                    </p>

                    <div className="flex items-center justify-end">
                      <Link href={`/ministers/${minister.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white group-hover:bg-primary/80">
                          Learn More
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}