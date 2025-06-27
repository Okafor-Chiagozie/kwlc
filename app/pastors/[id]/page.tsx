"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Phone, Mail, Award, Heart, BookOpen, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getAllMinisters } from "@/services/minister"
import { getAllBranches } from "@/services/branch"
import { Minister } from "@/types/minister"
import { Branch } from "@/types/branch"

interface MinisterWithBranch extends Minister {
  branch?: Branch;
}

export default function PastorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params)
  
  const [minister, setMinister] = useState<MinisterWithBranch | null>(null)
  const [ministerNotFound, setMinisterNotFound] = useState(false)

  // Fetch ministers data
  const { 
    data: ministersResponse, 
    loading: ministersLoading, 
    error: ministersError,
    refetch: refetchMinisters 
  } = useApi(() => getAllMinisters(), [])

  // Fetch branches data
  const { 
    data: branchesResponse, 
    loading: branchesLoading, 
    error: branchesError,
    refetch: refetchBranches 
  } = useApi(() => getAllBranches({
    pageSize: 100,
    pageNumber: 1
  }), [])

  // Helper function to check if error is "No Record found."
  const isNoRecordsError = (error: string | null) => {
    return error && error.toLowerCase().includes("no record found")
  }

  useEffect(() => {
    if (id && ministersResponse?.data && branchesResponse?.data) {
      // Find minister by ID
      const foundMinister = ministersResponse.data.find((m: Minister) => m.id.toString() === id)
      
      if (foundMinister) {
        // Find associated branch
        const associatedBranch = branchesResponse.data.find((b: Branch) => b.id === foundMinister.branchId)
        
        setMinister({
          ...foundMinister,
          branch: associatedBranch
        })
        setMinisterNotFound(false)
      } else {
        setMinisterNotFound(true)
        setMinister(null)
      }
    }
  }, [id, ministersResponse, branchesResponse])

  // Loading state
  if (ministersLoading || branchesLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Pastor Details...</h1>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Error state for ministers
  if (ministersError && !isNoRecordsError(ministersError)) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Back Button */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <Link href="/pastors">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Pastors
                </Button>
              </Link>
            </div>
          </div>
          
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Unable to Load Pastor Details</h2>
                <p className="text-gray-600 mb-4">{ministersError}</p>
                <Button onClick={refetchMinisters}>Try Again</Button>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    )
  }

  // Minister not found
  if (ministerNotFound || (ministersResponse && !ministersLoading && !minister)) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Back Button */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <Link href="/pastors">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Pastors
                </Button>
              </Link>
            </div>
          </div>
          
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-md mx-auto">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Pastor Not Found</h2>
                <p className="text-gray-600 mb-4">The pastor you're looking for doesn't exist or may have been removed.</p>
                <Link href="/pastors">
                  <Button>View All Pastors</Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    )
  }

  // No ministers found (empty state)
  if (isNoRecordsError(ministersError) || (ministersResponse?.data && ministersResponse.data.length === 0)) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Back Button */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <Link href="/pastors">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Pastors
                </Button>
              </Link>
            </div>
          </div>
          
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center py-20">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">No pastors found</p>
                <p className="text-sm text-gray-500 text-center">Please check back later or contact us for more information.</p>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    )
  }

  if (!minister) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Helper function to get minister title based on role
  const getMinisterTitle = (roleId: string) => {
    switch (roleId) {
      case 'SeniorPastor':
        return 'Senior Pastor'
      case 'AssociatePastor':
        return 'Associate Pastor'
      case 'YouthPastor':
        return 'Youth Pastor'
      case 'WomenMinister':
        return 'Women\'s Minister'
      case 'ChildrenMinister':
        return 'Children\'s Minister'
      default:
        return 'Minister'
    }
  }

  // Helper function to get minister specializations based on role
  const getMinisterSpecializations = (roleId: string) => {
    switch (roleId) {
      case 'SeniorPastor':
        return ['Leadership', 'Church Planting', 'Biblical Teaching']
      case 'AssociatePastor':
        return ['Pastoral Care', 'Counseling', 'Community Outreach']
      case 'YouthPastor':
        return ['Youth Ministry', 'Music', 'Digital Evangelism']
      case 'WomenMinister':
        return ['Women\'s Ministry', 'Marriage Counseling', 'Family Life']
      case 'ChildrenMinister':
        return ['Children\'s Ministry', 'Sunday School', 'Family Ministry']
      default:
        return ['Ministry', 'Pastoral Care']
    }
  }

  // Format minister name
  const ministerName = `${minister.firstName || ''} ${minister.middleName ? minister.middleName + ' ' : ''}${minister.lastName || ''}`.trim()
  const ministerTitle = getMinisterTitle(minister.ministerRoleId)
  const specializations = getMinisterSpecializations(minister.ministerRoleId)

  return (
    <MainLayout>
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/pastors">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pastors
            </Button>
          </Link>
        </div>
      </div>

      {/* Pastor Profile Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Pastor Image */}
            <div className="lg:col-span-1">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={minister.imageUrl || "/placeholder.svg?height=600&width=600"} 
                  alt={ministerName} 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* Pastor Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-primary/10 text-primary mb-4">{ministerTitle}</Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{ministerName}</h1>
                  <p className="text-xl text-gray-600 mb-6">{minister.biography || 'A dedicated servant of God, committed to spreading the Gospel and serving the community with love and compassion.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Branch</p>
                        <p className="text-gray-600">
                          {minister.branch ? `${minister.branch.name} - ${minister.branch.location}` : 'Branch information not available'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Ministry Role</p>
                        <p className="text-gray-600">{ministerTitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{minister.phoneNumber || 'Contact information not available'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{minister.email || 'Email not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  {specializations.map((spec: string) => (
                    <Badge key={spec} variant="outline" className="text-primary border-primary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Information Section */}
      {minister.branch && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Branch Information</h2>
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {minister.branch.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{minister.branch.address}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">{minister.branch.location}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">State</p>
                        <p className="text-gray-600">{minister.branch.state}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{minister.branch.phoneNumber}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{minister.branch.email}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Country</p>
                        <p className="text-gray-600">{minister.branch.country}</p>
                      </div>
                    </div>
                  </div>
                  
                  {minister.branch.welcomeAddress && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="font-medium text-gray-900 mb-2">Welcome Message</p>
                      <p className="text-gray-600">{minister.branch.welcomeAddress}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Error state for branches (if there's an issue loading branch data) */}
      {branchesError && !isNoRecordsError(branchesError) && (
        <section className="py-8 bg-yellow-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-md mx-auto">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-yellow-700 mb-2">Unable to load branch information</p>
              <Button variant="outline" size="sm" onClick={refetchBranches}>
                Retry
              </Button>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  )
}