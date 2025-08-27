"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, Target, TrendingUp, Building, GraduationCap, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getProjects } from "@/services/churchProject"
import { initiateDonation } from "@/services/donation"
import { ChurchProjectPageViewModel } from "@/types/churchProject"
import { Currency, PurposeCode, DonationType, PaymentMethod } from "@/types/donation"

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
  const [selectedAmount, setSelectedAmount] = useState<string>("")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
    isAnonymous: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ChurchProjectPageViewModel | null>(null)

  // Fetch projects from API
  const { 
    data: projectsResponse, 
    loading: projectsLoading, 
    error: projectsError, 
    refetch: refetchProjects 
  } = useApi(() => getProjects(), [])

  const projects = projectsResponse?.data || []
  
  // Get latest project (first one) and remaining 3 projects
  const latestProject = projects[0]
  const otherProjects = projects.slice(1, 4)

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

  const getProjectGallery = (project: ChurchProjectPageViewModel) => {
    const allImages = [
      ...(project.carouselImages || [])
    ].filter(Boolean)
    
    const churchImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
    
    return allImages.length > 0 ? allImages.slice(0, 5) : [
      churchImage,
      churchImage,
      churchImage,
      churchImage,
      churchImage,
    ]
  }

  const handleDonationSubmit = async () => {
    if (isSubmitting) return
    
    const donationAmount = customAmount.trim() || selectedAmount
    if (!donationAmount || !formData.email.trim() || !formData.fullName.trim()) {
      alert("Please fill in all required fields: amount, email, and full name")
      return
    }
    
    const amount = parseFloat(donationAmount)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const donationData = {
        email: formData.email.trim(),
        amount: parseFloat(donationAmount),
        message: formData.message.trim() || undefined,
        currencyId: Currency.NGN,
        donorName: formData.isAnonymous ? undefined : formData.fullName.trim(),
        isAnnonymous: formData.isAnonymous,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        churchProjectId: selectedProject?.id || null,
        purposeCode: selectedProject ? PurposeCode.DON : PurposeCode.CDON,
        donationTypeId: selectedProject ? DonationType.Project : DonationType.Community,
        paymenMethodId: PaymentMethod.Card
      }
      
      console.log('Donation request:', donationData)
      
      const response = await initiateDonation(donationData)
      
      if (response.isSuccessful && response.data?.checkoutUrl) {
        // Redirect to payment page
        window.location.href = response.data.checkoutUrl
      } else {
        alert("Unable to process donation. Please try again.")
      }
    } catch (error: any) {
      console.error("Donation error:", error)
      
      let errorMessage = "An error occurred while processing your donation. Please try again."
      
      if (error?.response?.data?.responseMessage) {
        errorMessage = error.response.data.responseMessage
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map((e: any) => e.description || e.message).join(', ')
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/donation.png-9JtcRLA0zWlxl6ac4XovOm11jhfnK9.jpeg"
              alt="People distributing food boxes"
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
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

        {/* Main Project Section */}
        {projectsLoading ? (
          <LoadingState />
        ) : projectsError && !isNoRecordsError(projectsError) ? (
          <ErrorState error={projectsError} onRetry={refetchProjects} />
        ) : !latestProject || isNoRecordsError(projectsError) ? (
          <EmptyState />
        ) : (
          <>
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Project Image */}
                  <div className="relative">
                    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={getProjectImage(latestProject)}
                        alt={latestProject.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                      <Building className="h-4 w-4" />
                      <span>Latest Project</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{latestProject.name}</h2>

                    <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                      <p>{latestProject.description}</p>
                      
                      {latestProject.location && (
                        <p className="text-sm text-gray-600">
                          <strong>Location:</strong> {latestProject.location}
                        </p>
                      )}

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-primary">
                            {calculateProgress(latestProject.amountRaised || 0, latestProject.targetAmount).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={calculateProgress(latestProject.amountRaised || 0, latestProject.targetAmount)} 
                          className="h-3 mb-3" 
                        />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Raised: {formatCurrency(latestProject.amountRaised || 0)}
                          </span>
                          <span className="text-gray-600">
                            Target: {formatCurrency(latestProject.targetAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                        onClick={() => {
                          setSelectedProject(latestProject)
                          document.getElementById('donation-form')?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          })
                        }}
                      >
                        <Heart className="h-4 w-4" />
                        Donate Now
                      </Button>
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
              </div>
            </section>

            {/* Project Gallery */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold mb-8 text-gray-900">Pictures from the project</h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {getProjectGallery(latestProject).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Image
                        src={image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                        alt={`Project image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Latest Donations */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Latest Donation Projects</h2>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                View All Projects
              </Button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : projectsError && !isNoRecordsError(projectsError) ? (
              <ErrorState error={projectsError} onRetry={refetchProjects} />
            ) : otherProjects.length === 0 && !isNoRecordsError(projectsError) ? (
              <EmptyState />
            ) : isNoRecordsError(projectsError) ? (
              <EmptyState />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={getProjectImage(project)}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-700">Infrastructure</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{project.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Target className="h-4 w-4" />
                            <span>Target: {formatCurrency(project.targetAmount)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary">
                            <TrendingUp className="h-4 w-4" />
                            <span>Raised: {formatCurrency(project.amountRaised || 0)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Progress value={calculateProgress(project.amountRaised || 0, project.targetAmount)} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{calculateProgress(project.amountRaised || 0, project.targetAmount).toFixed(1)}% funded</span>
                            <span>{formatCurrency(project.targetAmount - (project.amountRaised || 0))} remaining</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                          onClick={() => {
                            setSelectedProject(project)
                            document.getElementById('donation-form')?.scrollIntoView({ 
                              behavior: 'smooth',
                              block: 'start'
                            })
                          }}
                        >
                          Donate to Project
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Donation Form Section */}
        <section id="donation-form" className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                  <Heart className="h-4 w-4" />
                  <span>Make a Donation</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Support Our Mission</h2>
                {selectedProject ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                    <p className="text-primary font-medium mb-2">✨ Donating to: {selectedProject.name}</p>
                    <p className="text-gray-600 text-sm">{selectedProject.description}</p>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="text-primary text-sm hover:underline mt-2"
                    >
                      Change to general donation
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Your generous contribution helps us continue our work in the community and spread God's love to those
                    who need it most.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Donation Amount Selection */}
                  <div>
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Choose Donation Amount</h3>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[5000, 10000, 25000, 50000, 100000, 250000].map((amount) => (
                        <button
                          key={amount}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedAmount === amount.toString()
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAmount(amount.toString())}
                        >
                          {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium text-gray-900">₦5,000 can provide</h4>
                          <p className="text-sm text-gray-600">School supplies for 5 children</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Building className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium text-gray-900">₦25,000 can provide</h4>
                          <p className="text-sm text-gray-600">Building materials for construction</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div>
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Donor Information</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <Input 
                          placeholder="Enter your full name" 
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <Input 
                          type="tel" 
                          placeholder="Enter your phone number" 
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                        <Textarea 
                          placeholder="Leave a message or prayer request" 
                          className="min-h-[100px]"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="anonymous" 
                          className="rounded"
                          checked={formData.isAnonymous}
                          onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                        />
                        <label htmlFor="anonymous" className="text-sm text-gray-600">
                          Make this donation anonymous
                        </label>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3"
                      onClick={() => handleDonationSubmit()}
                      disabled={isSubmitting}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Processing..." : "Complete Donation"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Your donation is secure and tax-deductible. You will receive a receipt via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                <div className="text-3xl md:text-4xl font-bold mb-2">₦50M</div>
                <div className="text-white/80">Total Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">25</div>
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