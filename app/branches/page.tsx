"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Users, ChevronLeft, ExternalLink } from "lucide-react"
import Image from "next/image"
import MainLayout from "@/components/main-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea is available or will be added

const branches = [
  {
    id: 1,
    name: "Lagos Main Branch",
    address: "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road Jakande Bus Stop, Osapa London, Lagos",
    phone: "+234 70 433 2832",
    pastors: [
      {
        name: "Pastor Michael Blackson",
        role: "Lead Pastor",
        image: "/placeholder.svg?height=200&width=200&text=Pastor+Michael",
      },
      {
        name: "Pastor Jane Doe",
        role: "Associate Pastor",
        image: "/placeholder.svg?height=200&width=200&text=Pastor+Jane",
      },
    ],
    services: [
      { name: "Sunday Service", time: "9:00 AM - 12:00 PM" },
      { name: "Wednesday Bible Study", time: "7:00 PM - 9:00 PM" },
      { name: "Friday Night Service", time: "7:00 PM - 10:00 PM" },
    ],
    established: "2010",
    images: [
      "/placeholder.svg?height=300&width=400&text=Lagos+Branch+1",
      "/placeholder.svg?height=300&width=400&text=Lagos+Branch+2",
      "/placeholder.svg?height=300&width=400&text=Lagos+Branch+3",
    ],
  },
  {
    id: 2,
    name: "Abuja Branch",
    address: "Plot 123 Cadastral Zone A03, Garki District, Abuja FCT",
    phone: "+234 80 123 4567",
    pastors: [
      {
        name: "Pastor Sarah Johnson",
        role: "Lead Pastor",
        image: "/placeholder.svg?height=200&width=200&text=Pastor+Sarah",
      },
    ],
    services: [
      { name: "Sunday Service", time: "9:00 AM - 12:00 PM" },
      { name: "Tuesday Prayer Meeting", time: "6:00 PM - 8:00 PM" },
      { name: "Thursday Bible Study", time: "7:00 PM - 9:00 PM" },
    ],
    established: "2015",
    images: [
      "/placeholder.svg?height=300&width=400&text=Abuja+Branch+1",
      "/placeholder.svg?height=300&width=400&text=Abuja+Branch+2",
    ],
  },
  {
    id: 3,
    name: "Port Harcourt Branch",
    address: "15 Aba Road, GRA Phase 2, Port Harcourt, Rivers State",
    phone: "+234 84 567 8901",
    pastors: [
      {
        name: "Pastor David Emmanuel",
        role: "Lead Pastor",
        image: "/placeholder.svg?height=200&width=200&text=Pastor+David",
      },
      {
        name: "Pastor Emily White",
        role: "Youth Pastor",
        image: "/placeholder.svg?height=200&width=200&text=Pastor+Emily",
      },
    ],
    services: [
      { name: "Sunday Service", time: "8:30 AM - 11:30 AM" },
      { name: "Wednesday Power Service", time: "6:30 PM - 9:00 PM" },
      { name: "Saturday Youth Service", time: "5:00 PM - 8:00 PM" },
    ],
    established: "2018",
    images: ["/placeholder.svg?height=300&width=400&text=Port+Harcourt+Branch+1"],
  },
  {
    id: 4,
    name: "Kano Branch",
    address: "45 Ahmadu Bello Way, Nassarawa GRA, Kano State",
    phone: "+234 64 234 5678",
    pastors: [
      {
        name: "Pastor Grace Adamu",
        role: "Lead Pastor",
        image: "/placeholder.svg?height=200&width=200&text=Pastor+Grace",
      },
    ],
    services: [
      { name: "Sunday Service", time: "9:00 AM - 12:00 PM" },
      { name: "Wednesday Bible Study", time: "7:00 PM - 9:00 PM" },
      { name: "Friday Revival Service", time: "6:00 PM - 9:00 PM" },
    ],
    established: "2020",
    images: [
      "/placeholder.svg?height=300&width=400&text=Kano+Branch+1",
      "/placeholder.svg?height=300&width=400&text=Kano+Branch+2",
    ],
  },
]

export default function BranchesPage() {
  const [selectedBranch, setSelectedBranch] = useState<(typeof branches)[0] | null>(null)

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Branches</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Kingdom Ways Living Church has grown to serve communities across Nigeria, spreading the gospel and
              building strong faith communities.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{branches.length}</div>
                <div className="text-sm opacity-90">Branches</div>
              </div>
              <div>
                <div className="text-3xl font-bold">14</div>
                <div className="text-sm opacity-90">Years of Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* Branches Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {branches.map((branch) => (
                <Card
                  key={branch.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedBranch(branch)}
                >
                  <div className="relative h-48">
                    <Image
                      src={branch.images[0] || "/placeholder.svg"}
                      alt={branch.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white">Est. {branch.established}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{branch.name}</h3>
                        <div className="flex items-start gap-2 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <p className="text-sm">{branch.address}</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <Phone className="h-4 w-4" />
                          <p className="text-sm">{branch.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Lead Pastor */}
                    {branch.pastors.length > 0 && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <Image
                          src={branch.pastors[0].image || "/placeholder.svg"}
                          alt={branch.pastors[0].name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-sm">{branch.pastors[0].name}</p>
                          <p className="text-xs text-gray-600">{branch.pastors[0].role}</p>
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Service Times
                      </h4>
                      <div className="space-y-2">
                        {branch.services.map((service, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">{service.name}</span>
                            <span className="text-gray-600">{service.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => setSelectedBranch(branch)}>
                        View Details
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <a href={`tel:${branch.phone}`}>Contact</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Family</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Find a branch near you and become part of our vibrant community of believers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Find Nearest Branch
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Branch Details Dialog */}
      {selectedBranch && (
        <Dialog open={!!selectedBranch} onOpenChange={() => setSelectedBranch(null)}>
          <DialogContent className="sm:max-w-[800px] p-0">
            <ScrollArea className="max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 w-full">
                <Image
                  src={selectedBranch.images[0] || "/placeholder.svg"}
                  alt={selectedBranch.name}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 text-white bg-black/50 hover:bg-black/70"
                  onClick={() => setSelectedBranch(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-3xl font-bold">{selectedBranch.name}</DialogTitle>
                  <DialogDescription className="text-lg text-gray-600">
                    Established: {selectedBranch.established}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location & Contact */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Location & Contact
                    </h3>
                    <p className="text-gray-700">{selectedBranch.address}</p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {selectedBranch.phone}
                    </p>
                    <Button asChild>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Get Directions <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  {/* Service Times */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5" /> Service Times
                    </h3>
                    <div className="space-y-2">
                      {selectedBranch.services.map((service, index) => (
                        <div key={index} className="flex justify-between text-gray-700">
                          <span>{service.name}</span>
                          <span className="font-medium">{service.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pastors */}
                {selectedBranch.pastors.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" /> Our Pastors
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedBranch.pastors.map((pastor, index) => (
                        <Card key={index} className="flex flex-col items-center text-center p-4">
                          <Image
                            src={pastor.image || "/placeholder.svg"}
                            alt={pastor.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover mb-3"
                          />
                          <p className="font-semibold text-lg">{pastor.name}</p>
                          <p className="text-sm text-gray-600">{pastor.role}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {selectedBranch.images.length > 1 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedBranch.images.slice(1).map((img, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`${selectedBranch.name} image ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <Button className="flex-1">Visit Branch</Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`tel:${selectedBranch.phone}`}>Contact Branch</a>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  )
}
