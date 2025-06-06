"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/main-layout"

const pastors = [
  {
    id: "senior-pastor-john",
    name: "Pastor John Adebayo",
    title: "Senior Pastor",
    branch: "Main Campus - Victoria Island",
    role: "Lead Pastor",
    image: "/placeholder.svg?height=400&width=400",
    phone: "+234 70 433 2832",
    email: "pastor.john@kwlc.org",
    experience: "15+ Years",
    specialization: ["Leadership", "Church Planting", "Biblical Teaching"],
    description: "Leading the church with vision and passion for over 15 years.",
    members: "2,500+",
  },
  {
    id: "pastor-grace",
    name: "Pastor Grace Okafor",
    title: "Associate Pastor",
    branch: "Lekki Branch",
    role: "Branch Pastor",
    image: "/placeholder.svg?height=400&width=400",
    phone: "+234 80 123 4567",
    email: "pastor.grace@kwlc.org",
    experience: "8+ Years",
    specialization: ["Women's Ministry", "Youth Development", "Counseling"],
    description: "Passionate about empowering women and youth in their faith journey.",
    members: "800+",
  },
  {
    id: "pastor-david",
    name: "Pastor David Ogundimu",
    title: "Youth Pastor",
    branch: "Ikeja Branch",
    role: "Youth & Young Adults",
    image: "/placeholder.svg?height=400&width=400",
    phone: "+234 90 876 5432",
    email: "pastor.david@kwlc.org",
    experience: "5+ Years",
    specialization: ["Youth Ministry", "Music", "Digital Evangelism"],
    description: "Connecting with the next generation through innovative ministry approaches.",
    members: "600+",
  },
  {
    id: "pastor-mary",
    name: "Pastor Mary Akinola",
    title: "Children's Pastor",
    branch: "Surulere Branch",
    role: "Children & Family Ministry",
    image: "/placeholder.svg?height=400&width=400",
    phone: "+234 70 234 5678",
    email: "pastor.mary@kwlc.org",
    experience: "10+ Years",
    specialization: ["Children's Ministry", "Family Counseling", "Education"],
    description: "Nurturing young hearts and building strong family foundations.",
    members: "400+",
  },
  {
    id: "pastor-samuel",
    name: "Pastor Samuel Eze",
    title: "Missions Pastor",
    branch: "Abuja Branch",
    role: "Missions & Outreach",
    image: "/placeholder.svg?height=400&width=400",
    phone: "+234 81 345 6789",
    email: "pastor.samuel@kwlc.org",
    experience: "12+ Years",
    specialization: ["Missions", "Church Planting", "Community Outreach"],
    description: "Expanding God's kingdom through strategic missions and outreach programs.",
    members: "1,200+",
  },
  {
    id: "pastor-esther",
    name: "Pastor Esther Balogun",
    title: "Worship Pastor",
    branch: "Main Campus - Victoria Island",
    role: "Worship & Arts Ministry",
    image: "/placeholder.svg?height=400&width=400",
    phone: "+234 70 456 7890",
    email: "pastor.esther@kwlc.org",
    experience: "7+ Years",
    specialization: ["Worship Leading", "Music Ministry", "Creative Arts"],
    description: "Leading the congregation into powerful worship experiences.",
    members: "300+",
  },
]

const branches = [
  "All Branches",
  "Main Campus - Victoria Island",
  "Lekki Branch",
  "Ikeja Branch",
  "Surulere Branch",
  "Abuja Branch",
]

export default function PastorsPage() {
  const [selectedBranch, setSelectedBranch] = useState("All Branches")

  const filteredPastors =
    selectedBranch === "All Branches" ? pastors : pastors.filter((pastor) => pastor.branch === selectedBranch)

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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">Our Pastors</h1>
          <p className="text-xl md:text-2xl opacity-90 animate-slide-up animation-delay-200">
            Meet the dedicated leaders shepherding our community with love, wisdom, and faith
          </p>
        </div>
      </section>

      {/* Branch Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {branches.map((branch) => (
              <Button
                key={branch}
                variant={selectedBranch === branch ? "default" : "outline"}
                onClick={() => setSelectedBranch(branch)}
                className={`${
                  selectedBranch === branch ? "bg-primary text-white" : "text-gray-600 hover:text-primary"
                }`}
              >
                {branch}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Pastors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPastors.map((pastor, index) => (
              <Card
                key={pastor.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={pastor.image || "/placeholder.svg"}
                    alt={pastor.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-primary/90 text-white mb-2">{pastor.title}</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {pastor.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{pastor.branch}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">{pastor.role}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pastor.description}</p>

                  <div className="flex items-center justify-end">
                    <Link href={`/pastors/${pastor.id}`}>
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
        </div>
      </section>
    </MainLayout>
  )
}
