"use client"

import React, { use } from "react"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getBranchDetails, getWeeklyActivities } from "@/services/branch"
import { getBranchMinisters } from "@/services/minister"
import type { Branch, WeeklyActivityViewModel } from "@/types/branch"
import type { MinisterViewModel } from "@/types/minister"
import { MapPin, Phone, Mail, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BranchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const branchId = Number(id)

  const { data: branchResp, loading: branchLoading, error: branchError, refetch: refetchBranch } = useApi(
    () => getBranchDetails(branchId), [branchId]
  )
  const { data: activitiesResp, loading: actLoading, error: actError, refetch: refetchActs } = useApi(
    () => getWeeklyActivities(branchId), [branchId]
  )
  const { data: pastorsResp, loading: pastorsLoading, error: pastorsError, refetch: refetchPastors } = useApi(
    () => getBranchMinisters(branchId, { pageSize: 50, pageNumber: 1, searchParams: {} }), [branchId]
  )

  const extract = (resp: any) => {
    if (!resp) return null
    const d1 = resp.data ?? resp
    const d2 = d1?.data ?? d1
    return d2
  }

  const branchArr = extract(branchResp)
  const branch: Branch | undefined = Array.isArray(branchArr) ? branchArr[0] : (branchArr as any)

  const activitiesData = extract(activitiesResp)
  const activities: WeeklyActivityViewModel[] = Array.isArray(activitiesData) ? activitiesData : []

  const pastorsData = extract(pastorsResp)
  const pastors: MinisterViewModel[] = Array.isArray(pastorsData) ? pastorsData : []

  const loading = branchLoading || actLoading || pastorsLoading
  const isRealError = (msg?: string | null) => !!(msg && !msg.toLowerCase().includes('no record'))
  const hardError = isRealError(branchError) || isRealError(actError) || isRealError(pastorsError)

  const formatTime = (time: any) => {
    if (!time) return ''
    const hh = String(time.hour ?? 0).padStart(2, '0')
    const mm = String(time.minute ?? 0).padStart(2, '0')
    const d = new Date()
    d.setHours(Number(hh), Number(mm), 0, 0)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  }

  const directionsHref = branch?.location && String(branch.location).startsWith('http')
    ? branch.location
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch?.address || '')}`
  const mapSrc = (branch?.location && String(branch.location).includes('/embed'))
    ? String(branch.location)
    : `https://www.google.com/maps?q=${encodeURIComponent(branch?.address || '')}&output=embed`

  const LoadingState = () => (
    <div className="text-center py-24">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading branch details...</h1>
    </div>
  )

  const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Branch</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      </div>
    </section>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-40">
      <MapPin className="h-12 w-12 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Branch not found</h2>
      <p className="text-gray-600 mb-4">This branch may have been removed or doesn't exist.</p>
      <Link href="/branches">
        <Button variant="outline" className="border-primary bg-primary text-white hover:bg-primary/5">
          View All Branches
        </Button>
      </Link>
    </div>
  )

  return (
    <MainLayout>
      <div className="min-h-screen">
        {loading ? (
          <LoadingState />
        ) : hardError ? (
          <ErrorState error={(branchError || actError || pastorsError) as string} onRetry={() => { refetchBranch(); refetchActs(); refetchPastors(); }} />
        ) : !branch ? (
          <EmptyState />
        ) : (
          <>
            {/* Header - title only */}
            <section className="relative bg-gradient-to-r from-gray-900 to-primary/90 pt-28 pb-16 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lagos-VgjOxtCXSS5PU2WpGNpg21KuQQyOqw.png')] bg-cover bg-center"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-primary/40"></div>

              <div className="container mx-auto px-4 relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{branch.name}</h1>
                <p className="text-white/80 max-w-2xl">Welcome to our {branch.name} branch — a warm, vibrant family of believers growing together in faith and love. We’d be delighted to have you worship with us.</p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
            </section>

            {/* Branch Details */}
            <section className="py-10 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</h3>
                    <p className="text-gray-700">{branch.address}</p>
                    <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm mt-2 inline-block">Get directions</a>
                  </div>
                  <div className="p-5 rounded-xl border bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</h3>
                    <p className="text-gray-700">{branch.phoneNumber}</p>
                  </div>
                  <div className="p-5 rounded-xl border bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Mail className="h-4 w-4" /> Email</h3>
                    <p className="text-gray-700">{branch.email || 'N/A'}</p>
                  </div>
                </div>

                {branch.welcomeAddress && (
                  <div className="mt-8 p-6 rounded-xl border bg-white">
                    <h3 className="text-xl font-semibold mb-2">A Note from Us</h3>
                    <p className="text-gray-700">{branch.welcomeAddress}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Pastors */}
            <section className="py-10 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4">Pastors</h2>
                {pastors.length === 0 ? (
                  <p className="text-gray-600">No pastors found for this branch.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastors.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl border bg-white shadow-sm flex gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={p.imageUrl || "/placeholder.svg"} alt={p.firstName} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{p.firstName} {p.lastName}</h3>
                          <p className="text-sm text-gray-600">{p.ministerRole || 'Pastor'}</p>
                          {p.phoneNumber && <p className="text-sm text-gray-600 mt-1">{p.phoneNumber}</p>}
                          {p.email && <p className="text-sm text-gray-600">{p.email}</p>}
                          <Link href={`/pastors/${p.id}`} className="text-primary text-sm underline">View profile</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Weekly Activities */}
            <section className="py-10 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4">Weekly Activities</h2>
                {activities.length === 0 ? (
                  <p className="text-gray-600">No activities recorded for this branch.</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                        <div>
                          <div className="font-medium">{a.name}</div>
                          {a.description && <div className="text-sm text-gray-600">{a.description}</div>}
                        </div>
                        <div className="text-right text-sm text-gray-700">
                          <div>{a.day}</div>
                          <div>{formatTime(a.startTime)} - {formatTime(a.closeTime)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Map at bottom */}
            <section className="py-10 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4">Find Us</h2>
                <div className="rounded-xl overflow-hidden shadow border">
                  <div className="relative aspect-video">
                    <iframe src={mapSrc} className="absolute inset-0 w-full h-full border-0" loading="lazy" />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  )
} 