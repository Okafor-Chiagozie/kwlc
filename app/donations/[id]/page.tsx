"use client"

import React, { use } from "react"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getProject } from "@/services/churchProject"
import { initiateDonation } from "@/services/donation"
import type { ChurchProjectViewModel } from "@/types/churchProject"
import { Currency, DonationType, PaymentMethod, PurposeCode } from "@/types/donation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Loader2, Heart, ArrowLeft, Share2, Target, TrendingUp, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const projectId = Number(id)

  const { data: projectResp, loading, error, refetch } = useApi(() => getProject(projectId), [projectId])

  const extractProject = (resp: any): ChurchProjectViewModel | null => {
    if (!resp) return null
    const d1 = resp.data ?? resp
    const d2 = d1?.data ?? d1
    return d2 || null
  }

  const project = extractProject(projectResp)

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
    isAnonymous: false,
    amount: ""
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Build unified image list and active index
  const images: string[] = React.useMemo(() => {
    const list: string[] = []
    if (project?.imageUrl) list.push(project.imageUrl)
    if (project?.carouselImages?.length) list.push(...project.carouselImages)
    if (project?.previewImages?.length) list.push(...project.previewImages)
    if (project?.galleryImages?.length) list.push(...project.galleryImages)
    // de-duplicate, filter falsy
    const seen = new Set<string>()
    return list.filter((url) => {
      if (!url) return false
      if (seen.has(url)) return false
      seen.add(url)
      return true
    })
  }, [project])
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const thumbsRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => { setActiveIndex(0) }, [projectId])
  React.useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((i) => (i + 1) % images.length)
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length, isPaused])
  React.useEffect(() => {
    const cont = thumbsRef.current
    if (!cont) return
    const el = cont.children?.[activeIndex] as HTMLElement | undefined
    if (el) {
      const targetLeft = el.offsetLeft - cont.clientWidth / 2 + el.clientWidth / 2
      cont.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
    }
  }, [activeIndex])

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
  const calculateProgress = (raised: number, target: number) => (target > 0 ? (raised / target) * 100 : 0)
  const bannerImage = project?.carouselImages?.[0] || project?.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
  const heroImage = images[activeIndex] || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"

  const handleDonate = async () => {
    if (isSubmitting || !project) return
    const amount = parseFloat(formData.amount)
    if (!formData.email.trim() || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount and email")
      return
    }

    setIsSubmitting(true)
    try {
      const donationData = {
        email: formData.email.trim(),
        amount,
        message: formData.message.trim() || undefined,
        currencyId: Currency.NGN,
        donorName: formData.isAnonymous ? undefined : formData.fullName.trim(),
        isAnnonymous: formData.isAnonymous,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        churchProjectId: project.id,
        purposeCode: PurposeCode.DON,
        donationTypeId: DonationType.Project,
        paymenMethodId: PaymentMethod.Card
      }
      const response = await initiateDonation(donationData)
      if (response.status && response.data?.data?.checkoutUrl) {
        window.location.href = response.data.data.checkoutUrl
      } else {
        alert("Unable to process donation. Please try again.")
      }
    } catch (err: any) {
      let errorMessage = "An error occurred while processing your donation. Please try again."
      if (err?.response?.data?.responseMessage) errorMessage = err.response.data.responseMessage
      else if (err?.response?.data?.message) errorMessage = err.response.data.message
      else if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) errorMessage = err.response.data.errors.map((e: any) => e.description || e.message).join(', ')
      else if (err?.message) errorMessage = err.message
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const prevImage = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)
  const nextImage = () => setActiveIndex((i) => (i + 1) % images.length)

  const LoadingState = () => (
    <div className="text-center py-24">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading project...</h1>
    </div>
  )

  const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Project</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      </div>
    </section>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-40">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Project not found</h2>
      <p className="text-gray-600 mb-4">This project may have been removed or doesn't exist.</p>
      <Link href="/donations">
        <Button variant="outline" className="border-primary bg-primary text-white hover:bg-primary/5">
          Back to Projects
        </Button>
      </Link>
    </div>
  )

  return (
    <MainLayout>
      <div className="min-h-screen overflow-x-hidden">
        {loading ? (
          <LoadingState />
        ) : error && !String(error).toLowerCase().includes('no record') ? (
          <ErrorState error={error as string} onRetry={refetch} />
        ) : !project ? (
          <EmptyState />
        ) : (
          <>
            {/* Hero */}
            <section className="relative h-[380px] overflow-hidden">
              <div className="absolute inset-0">
                <Image src={bannerImage} alt={project.name} fill className="object-cover brightness-[0.4]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{project.name}</h1>
                  {project.location && (
                    <p className="text-white/90 flex items-center justify-center gap-2"><MapPin className="h-4 w-4" /> {project.location}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Main section */}
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <Link href="/donations" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Image carousel */}
                  <div className="space-y-4 min-w-0">
                    <div className="relative h-[420px] rounded-2xl overflow-hidden shadow" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                      <Image src={heroImage} alt={project.name} fill className="object-cover" />
                      {images.length > 1 && (
                        <>
                          <button aria-label="Previous" onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button aria-label="Next" onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                    {images.length > 0 && (
                      <div ref={thumbsRef} className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative h-16 md:h-20 w-24 md:w-28 rounded-md overflow-hidden flex-shrink-0 border ${idx === activeIndex ? 'border-primary ring-2 ring-primary/40' : 'border-gray-200'}`}
                            aria-current={idx === activeIndex ? 'true' : undefined}
                            aria-label={`Thumbnail ${idx + 1}`}
                          >
                            <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details + Donate */}
                  <div className="min-w-0">
                    <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                      <p>{project.description}</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-primary">
                            {calculateProgress(project.amountRaised || 0, project.targetAmount).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={calculateProgress(project.amountRaised || 0, project.targetAmount)} className="h-3 mb-3" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Raised: {formatCurrency(project.amountRaised || 0)}</span>
                          <span className="text-gray-600">Target: {formatCurrency(project.targetAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Donate form */}
                    <div className="rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Support this Project</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (NGN)</label>
                          <Input type="number" placeholder="5000" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <Input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                          <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="min-h-[100px]" />
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                          <input type="checkbox" id="anonymous" className="rounded" checked={formData.isAnonymous} onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} />
                          <label htmlFor="anonymous" className="text-sm text-gray-600">Make this donation anonymous</label>
                        </div>
                      </div>
                      <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3" onClick={handleDonate} disabled={isSubmitting}>
                        <Heart className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Processing..." : "Donate Now"}
                      </Button>
                      <p className="text-xs text-gray-500 text-center mt-4">Your donation is secure and tax-deductible. You will receive a receipt via email.</p>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  <div className="p-4 rounded-xl border bg-white text-center">
                    <div className="text-sm text-gray-600 mb-1">Target</div>
                    <div className="text-xl font-semibold">{formatCurrency(project.targetAmount)}</div>
                  </div>
                  <div className="p-4 rounded-xl border bg-white text-center">
                    <div className="text-sm text-gray-600 mb-1">Raised</div>
                    <div className="text-xl font-semibold">{formatCurrency(project.amountRaised || 0)}</div>
                  </div>
                  <div className="p-4 rounded-xl border bg-white text-center">
                    <div className="text-sm text-gray-600 mb-1 flex items-center justify-center gap-1"><Target className="h-4 w-4" /> Progress</div>
                    <div className="text-xl font-semibold">{calculateProgress(project.amountRaised || 0, project.targetAmount).toFixed(1)}%</div>
                  </div>
                  <div className="p-4 rounded-xl border bg-white text-center">
                    <div className="text-sm text-gray-600 mb-1 flex items-center justify-center gap-1"><TrendingUp className="h-4 w-4" /> Status</div>
                    <div className="text-xl font-semibold">Ongoing</div>
                  </div>
                </div>

                {/* Share */}
                <div className="mt-10 flex items-center gap-3">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Share2 className="h-4 w-4" /> Share Project
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  )
}
