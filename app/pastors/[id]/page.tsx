"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Phone, Mail, Award, Heart, BookOpen, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getAllMinisters } from "@/services/minister"
import { MinisterViewModel } from "@/types/minister"

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

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "TBD"
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return timeString
    }
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

  // Extract specializations from description or use default
  const getSpecializations = (description: string) => {
    if (!description) return ["Ministry", "Leadership"]
    
    // Try to extract meaningful keywords from description
    const keywords = description.toLowerCase()
    const specializations = []
    
    if (keywords.includes("leadership") || keywords.includes("lead")) specializations.push("Leadership")
    if (keywords.includes("youth") || keywords.includes("young")) specializations.push("Youth Ministry")
    if (keywords.includes("women") || keywords.includes("ladies")) specializations.push("Women's Ministry")
    if (keywords.includes("counsel") || keywords.includes("therapy")) specializations.push("Counseling")
    if (keywords.includes("music") || keywords.includes("worship")) specializations.push("Music Ministry")
    if (keywords.includes("teach") || keywords.includes("bible")) specializations.push("Biblical Teaching")
    if (keywords.includes("evangel") || keywords.includes("mission")) specializations.push("Evangelism")
    
    return specializations.length > 0 ? specializations : ["Ministry", "Leadership"]
  }

  // Get branch information
  const getBranchInfo = () => {
    if (!pastor.location && !pastor.address) return "Kingdom Ways Living Church"
    return pastor.location || pastor.address || "Kingdom Ways Living Church"
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
    
    if (pastor.attendanceCount > 0) {
      achievements.push(`Ministered to ${pastor.attendanceCount}+ people`)
    }
    
    achievements.push("Dedicated servant of God's kingdom")
    achievements.push("Active in church leadership and ministry")
    
    if (pastor.eventType) {
      achievements.push(`Specialized in ${pastor.eventType} ministry`)
    }
    
    return achievements
  }

  // Get ministry areas
  const getMinistryAreas = () => [
    "Pastoral Care",
    "Church Leadership",
    "Biblical Teaching",
    "Community Outreach"
  ]

  // Get sample schedule
  const getSampleSchedule = () => {
    const schedule = []
    
    if (pastor.startTime && pastor.closeTime) {
      schedule.push({
        day: "Sunday",
        time: `${formatTime(pastor.startTime)} - ${formatTime(pastor.closeTime)}`,
        activity: pastor.eventType || "Church Service"
      })
    }
    
    schedule.push(
      { day: "Wednesday", time: "6:00 PM - 8:00 PM", activity: "Bible Study" },
      { day: "Friday", time: "2:00 PM - 4:00 PM", activity: "Pastoral Counseling" },
      { day: "Saturday", time: "10:00 AM - 12:00 PM", activity: "Leadership Meeting" }
    )
    
    return schedule
  }

  const specializations = getSpecializations(pastor.description)
  const branchInfo = getBranchInfo()
  const education = getSampleEducation()
  const achievements = getSampleAchievements()
  const ministryAreas = getMinistryAreas()
  const schedule = getSampleSchedule()

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
                  src={pastor.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"} 
                  alt={pastor.name || "Pastor"} 
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
                    {pastor.eventType || "Pastor"}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {pastor.name || "Pastor"}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">
                    {pastor.description || "A dedicated servant of God, committed to leading His people with wisdom, compassion, and biblical truth. Passionate about ministry and helping others grow in their faith journey."}
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
                        <p className="text-gray-600">{pastor.eventType || "Pastor"}</p>
                      </div>
                    </div>

                    {pastor.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">Location</p>
                          <p className="text-gray-600">{pastor.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">+234 70 433 2832</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">pastor@kwlc.org</p>
                      </div>
                    </div>

                    {pastor.attendanceCount > 0 && (
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">Ministry Reach</p>
                          <p className="text-gray-600">{pastor.attendanceCount}+ people</p>
                        </div>
                      </div>
                    )}
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

            {/* Ministries & Schedule */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Ministry Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {ministryAreas.map((ministry: string, index: number) => (
                      <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <span className="text-gray-700 font-medium">{ministry}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedule.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.day}</p>
                          <p className="text-sm text-gray-600">{item.activity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <Button className="bg-primary hover:bg-primary/90">
                <Phone className="h-4 w-4 mr-2" />
                Call Pastor
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}