"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Phone, Mail, Award, BookOpen, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getAllMinisters } from "@/services/minister"
import { MinisterViewModel } from "@/types/minister"
import { getWeeklyActivities } from "@/services/branch"
import { WeeklyActivityViewModel, TimeOnly } from "@/types/branch"
import React from "react"

const isNoRecordsError = (error: string | null) => {
  return error && error.toLowerCase().includes("no record found")
}

const LoadingState = () => (
  <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading pastor details...</h1>
    </div>
)

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to Load Pastor Details</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  </section>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-40">
    <Users className="h-12 w-12 text-gray-400 mb-4" />
    <h2 className="text-xl font-semibold mb-2">Pastor not found</h2>
    <p className="text-gray-600 mb-4">This pastor may have been removed or doesn't exist.</p>
    <Link href="/pastors">
      <Button variant="outline" className="border-primary bg-primary text-white hover:bg-primary/5">
        View All Pastors
      </Button>
    </Link>
  </div>
)

export default function PastorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise
  const { id } = use(params)
  const pastorId = parseInt(id)

  // Fetch all ministers and find the specific one
  const { 
    data: ministersResponse, 
    loading: ministersLoading, 
    error: ministersError, 
    refetch: refetchMinisters 
  } = useApi(() => getAllMinisters({ pageSize: 100, pageNumber: 1, searchParams: {} }), [])

  const ministers = Array.isArray(ministersResponse?.data) ? ministersResponse.data : []
  const pastor = ministers.find((minister: MinisterViewModel) => minister.id === pastorId)

  // Weekly activities for pastor's branch
  const [activities, setActivities] = useState<WeeklyActivityViewModel[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(false)
  const [activitiesError, setActivitiesError] = useState<string | null>(null)

  const formatTime = (time: TimeOnly | string): string => {
    if (!time) return ""
    if (typeof time === "string") return time.slice(0, 5)
    const hh = String(time.hour).padStart(2, '0')
    const mm = String(time.minute).padStart(2, '0')
    return `${hh}:${mm}`
  }

  // Load branch weekly activities when pastor is available and has branchId
  React.useEffect(() => {
    const load = async () => {
      if (!pastor?.branchId) return
      try {
        setActivitiesLoading(true)
        setActivitiesError(null)
        const resp = await getWeeklyActivities(pastor.branchId)
        if (resp?.isSuccessful && Array.isArray(resp.data)) {
          setActivities(resp.data)
        } else {
          setActivities([])
        }
      } catch (e: any) {
        setActivitiesError(e?.message || 'Failed to load weekly activities')
      } finally {
        setActivitiesLoading(false)
      }
    }
    load()
  }, [pastor?.branchId])

  // Handle loading state
  if (ministersLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingState />
        </div>
      </MainLayout>
    )
  }

  // Handle error state (but not "no records found")
  if (ministersError && !isNoRecordsError(ministersError)) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <ErrorState error={ministersError} onRetry={refetchMinisters} />
        </div>
      </MainLayout>
    )
  }

  // Handle empty state (no pastor found)
  if (!pastor || isNoRecordsError(ministersError)) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <EmptyState />
        </div>
      </MainLayout>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  // Get branch information
  const getBranchInfo = () => {
    return pastor.branchName || "Kingdom Ways Living Church"
  }

  // Get sample education (since not in API)
  const getSampleEducation = () => [
    "Master of Theology - Lagos Baptist Seminary",
    "Bachelor of Religious Studies",
    "Certificate in Church Leadership"
  ]

  // Get sample achievements (based on available data)
  const getSampleAchievements = () => {
    const achievements = []
    
    achievements.push("Dedicated servant of God's kingdom")
    achievements.push("Active in church leadership and ministry")
    
    if (pastor.ministerRole) {
      achievements.push(`Specialized in ${pastor.ministerRole} ministry`)
    }
    
    return achievements
  }

  const branchInfo = getBranchInfo()
  const education = getSampleEducation()
  const achievements = getSampleAchievements()

  return (
    <MainLayout>
      {/* Back Button */}
      <div className="hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-end">
            <Link href="/pastors">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pastors
              </Button>
            </Link>
          </div>
        </div>
      </div>
 
      {/* Hero Section (match single branch style) */}
      <section className="relative bg-gradient-to-r from-gray-900 to-primary/90 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png')] bg-cover bg-center"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-primary/40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-start mb-3">
            <Link href="/pastors" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Pastors</span>
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{`${pastor.firstName} ${pastor.lastName}`}</h1>
          <p className="text-white/80 max-w-2xl">
            {(pastor.ministerRole || "Pastor")} {pastor.branchName ? `• ${pastor.branchName}` : ""}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
      </section>

      {/* Pastor Profile Header */}
      <section className="pt-6 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Pastor Image */}
            <div className="lg:col-span-1">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={pastor.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"} 
                  alt={`${pastor.firstName} ${pastor.lastName}` || "Pastor"} 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* Pastor Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-primary/10 text-primary mb-4">
                    {pastor.ministerRole || "Pastor"}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {`${pastor.firstName} ${pastor.lastName}` || "Pastor"}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">
                    {pastor.biography || "A dedicated servant of God, committed to leading His people with wisdom, compassion, and biblical truth. Passionate about ministry and helping others grow in their faith journey."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Branch</p>
                        <p className="text-gray-600">{branchInfo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Ministry Role</p>
                        <p className="text-gray-600">{pastor.ministerRole || "Pastor"}</p>
                      </div>
                    </div>


                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{pastor.phoneNumber || "+234 70 433 2832"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{pastor.email || "pastor@kwlc.org"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education & Achievements */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Education & Training
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {education.map((edu: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Ministry Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Schedule from Branch */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="flex items-center gap-2 text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Loading activities...</div>
                  ) : activitiesError ? (
                    <div className="text-sm text-red-600">{activitiesError}</div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((act) => (
                        <div key={act.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{act.name}</p>
                            <p className="text-sm text-gray-600">{act.description}</p>
                          </div>
                          <div className="text-right text-sm text-gray-700">
                            <div>{act.day}</div>
                            <div>{formatTime(act.startTime)} - {formatTime(act.closeTime)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No weekly activities found for this pastor's branch.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Feel free to reach out for pastoral counseling, prayer requests, or spiritual guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${pastor.phoneNumber || "+234704332832"}`}>
                <Button className="bg-primary hover:bg-primary/90">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Pastor
                </Button>
              </a>
              <a href={`mailto:${pastor.email || "pastor@kwlc.org"}`}>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}