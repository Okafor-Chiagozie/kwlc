"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, Target, TrendingUp, Building, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import MainLayout from "@/components/main-layout"

const donationProjects = [
  {
    id: 1,
    title: "Build church school",
    description: "Help us build a modern educational facility for our community children",
    target: 23000000,
    raised: 130000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png",
    category: "Education",
  },
  {
    id: 2,
    title: "Build church school",
    description: "Support the construction of classrooms and learning facilities",
    target: 23000000,
    raised: 130000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-2-U32r6iEgfd2Lfx6ankMMHQVltVVlpX.png",
    category: "Education",
  },
  {
    id: 3,
    title: "Church Building Project",
    description: "Expanding our main sanctuary to accommodate our growing congregation",
    target: 50000000,
    raised: 2500000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-3-0cWkRXuoGw3r8yqCXIqVL0agA5oU4R.png",
    category: "Infrastructure",
  },
]

const projectGallery = [
  "/placeholder.svg?height=200&width=300&text=Architectural+Plans",
  "/placeholder.svg?height=200&width=300&text=Blueprint+1",
  "/placeholder.svg?height=200&width=300&text=Blueprint+2",
  "/placeholder.svg?height=200&width=300&text=Blueprint+3",
  "/placeholder.svg?height=200&width=300&text=Blueprint+4",
]

export default function DonationsPage() {
  const [selectedAmount, setSelectedAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")

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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Project Image */}
              <div className="relative">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/placeholder.svg?height=500&width=600&text=Church+Building+Construction"
                    alt="Church building construction project"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                  <Building className="h-4 w-4" />
                  <span>Infrastructure Project</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Church building project</h2>

                <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                  <p>
                    We are embarking on an ambitious project to expand our church facilities to better serve our growing
                    congregation and community. This project will include a new sanctuary, fellowship hall, and
                    educational wings.
                  </p>

                  <p>
                    The new building will accommodate up to 2,000 worshippers and will feature modern amenities
                    including air conditioning, advanced sound systems, and accessibility features for all members of
                    our community.
                  </p>

                  <p>
                    This expansion represents our commitment to providing a welcoming space where people can encounter
                    God's love and grow in their faith journey. Every contribution, no matter the size, brings us closer
                    to completing this vision.
                  </p>

                  <p>
                    The project also includes dedicated spaces for youth programs, children's ministry, and community
                    outreach initiatives that will serve the broader Lagos community for generations to come.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
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
              {projectGallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Project image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Donations */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Latest Donation Projects</h2>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                View All Projects
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {donationProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-gray-700">{project.category}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Target className="h-4 w-4" />
                          <span>Target: {formatCurrency(project.target)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <TrendingUp className="h-4 w-4" />
                          <span>Raised: {formatCurrency(project.raised)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Progress value={calculateProgress(project.raised, project.target)} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{calculateProgress(project.raised, project.target).toFixed(1)}% funded</span>
                          <span>{formatCurrency(project.target - project.raised)} remaining</span>
                        </div>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">Donate to Project</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                  <Heart className="h-4 w-4" />
                  <span>Make a Donation</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Support Our Mission</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Your generous contribution helps us continue our work in the community and spread God's love to those
                  who need it most.
                </p>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <Input placeholder="Enter your full name" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <Input type="email" placeholder="Enter your email" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <Input type="tel" placeholder="Enter your phone number" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                        <Textarea placeholder="Leave a message or prayer request" className="min-h-[100px]" />
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="anonymous" className="rounded" />
                        <label htmlFor="anonymous" className="text-sm text-gray-600">
                          Make this donation anonymous
                        </label>
                      </div>
                    </div>

                    <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3">
                      <Heart className="h-4 w-4 mr-2" />
                      Complete Donation
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
