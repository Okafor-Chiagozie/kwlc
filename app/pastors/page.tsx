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
import { MinisterViewModel } from "@/types/minister"
import { Branch } from "@/types/branch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function MinistersPage() {
  const [selectedBranch, setSelectedBranch] = useState("All Branches")
  const [nameQuery, setNameQuery] = useState("")
  const [branches, setBranches] = useState<Branch[]>([])

  // Fetch ministers
  const {
    data: ministersResponse,
    loading: ministersLoading,
    error: ministersError,
    refetch: refetchMinisters,
  } = useApi(() => getAllMinisters({ pageSize: 100, pageNumber: 1, searchParams: {} }), [])

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

  // Active-only ministers
  const activeMinisters = Array.isArray(ministers) ? ministers.filter((m: any) => m?.isDeleted !== true && m?.isActive !== false) : []

  useEffect(() => {
    if (allBranches.length > 0) setBranches(allBranches)
  }, [allBranches])

  // Filter by branch and by name
  const filteredMinisters = activeMinisters.filter((minister: MinisterViewModel) => {
    const matchesBranch = selectedBranch === "All Branches" ? true : (branches.find(b => b.id === minister.branchId)?.name === selectedBranch)
    const fullName = `${minister.firstName || ''} ${minister.lastName || ''}`.toLowerCase()
    const matchesName = nameQuery.trim() === "" ? true : fullName.includes(nameQuery.trim().toLowerCase())
    return matchesBranch && matchesName
  })

  // Helper function to check if error is "No Record found."
  const isNoRecordsError = (error: string | null) => error && error.toLowerCase().includes("no record found")

  // Get branch name by ID
  const getBranchName = (branchId: number) => branches.find(b => b.id === branchId)?.name || "Unknown Branch"

  // Loading state component
  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  )

  const clearFilters = () => {
    setSelectedBranch("All Branches")
    setNameQuery("")
  }

  return (
    <MainLayout>
      {/* Hero Section (aligned with shop hero) */}
      <section className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png"
            alt="Pastors Hero"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative h-full flex items-center justify-center text-center text-white px-4 pt-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Our Ministers</h1>
            <p className="text-lg md:text-xl text-white/90">
              Meet the dedicated leaders shepherding our community
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar: Branch dropdown + Name search + Clear */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          {branchesLoading ? (
            <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : branchesError && !isNoRecordsError(branchesError) ? (
            <div className="text-center">
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 text-sm">Unable to load branch filters</p>
            </div>
          ) : (
            <div className="w-full lg:w-[95%] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-black mb-1">Branch</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/40 focus:border-primary">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="All Branches">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-black mb-1">Search by name</label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={nameQuery}
                    onChange={(e) => setNameQuery(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
                <div className="sm:w-auto">
                  <label className="block text-sm text-transparent mb-1">Clear</label>
                  <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto text-primary border-primary hover:bg-primary/5">
                    Clear filters
                  </Button>
                </div>
              </div>
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
          ) : (!ministersLoading && (filteredMinisters.length === 0 || isNoRecordsError(ministersError))) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">No ministers found</p>
              <p className="text-sm text-gray-500 text-center">Try adjusting your filters above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMinisters.map((minister: MinisterViewModel, index: number) => (
                <Card
                  key={minister.id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={minister.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                      alt={`${minister.firstName} ${minister.lastName}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-primary/90 text-white mb-2">
                        {minister.ministerRole || "Minister"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {`${minister.firstName} ${minister.lastName}`}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{minister.branchId ? getBranchName(minister.branchId) : minister.branchName || "Unknown Branch"}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {minister.biography || "Dedicated to serving God and His people with passion and commitment."}
                    </p>

                    <div className="flex items-center justify-end">
                      <Link href={`/pastors/${minister.id}`}>
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
