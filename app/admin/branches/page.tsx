"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Plus, Edit, Trash2, Users, Phone, Calendar, Building } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

export default function BranchesPage() {
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Lagos Main Branch",
      address: "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road Jakande Bus Stop, Osapa London, Lagos",
      phone: "+234 70 433 2832",
      leadPastor: "Pastor Michael Blackson",
      members: 2500,
      established: "2010",
      status: "active",
      services: [
        { name: "Sunday Service", time: "9:00 AM - 12:00 PM" },
        { name: "Wednesday Bible Study", time: "7:00 PM - 9:00 PM" },
        { name: "Friday Night Service", time: "7:00 PM - 10:00 PM" },
      ],
    },
    {
      id: 2,
      name: "Abuja Branch",
      address: "Plot 123 Cadastral Zone A03, Garki District, Abuja FCT",
      phone: "+234 80 123 4567",
      leadPastor: "Pastor Sarah Johnson",
      members: 800,
      established: "2015",
      status: "active",
      services: [
        { name: "Sunday Service", time: "9:00 AM - 12:00 PM" },
        { name: "Tuesday Prayer Meeting", time: "6:00 PM - 8:00 PM" },
        { name: "Thursday Bible Study", time: "7:00 PM - 9:00 PM" },
      ],
    },
    {
      id: 3,
      name: "Port Harcourt Branch",
      address: "15 Aba Road, GRA Phase 2, Port Harcourt, Rivers State",
      phone: "+234 84 567 8901",
      leadPastor: "Pastor David Emmanuel",
      members: 650,
      established: "2018",
      status: "active",
      services: [
        { name: "Sunday Service", time: "8:30 AM - 11:30 AM" },
        { name: "Wednesday Power Service", time: "6:30 PM - 9:00 PM" },
        { name: "Saturday Youth Service", time: "5:00 PM - 8:00 PM" },
      ],
    },
  ])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Branches Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <Building className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Across Nigeria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">4,400</div>
              <p className="text-xs text-muted-foreground">All branches combined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newest Branch</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Kano</div>
              <p className="text-xs text-muted-foreground">Established 2020</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">4</div>
              <p className="text-xs text-muted-foreground">All operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-branches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-branches">All Branches</TabsTrigger>
            <TabsTrigger value="add-branch">Add Branch</TabsTrigger>
            <TabsTrigger value="services">Service Times</TabsTrigger>
          </TabsList>

          <TabsContent value="all-branches" className="space-y-6">
            <div className="space-y-6">
              {branches.map((branch) => (
                <Card key={branch.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{branch.name}</h3>
                          <Badge variant="outline">Est. {branch.established}</Badge>
                          <Badge variant={branch.status === "active" ? "default" : "secondary"}>{branch.status}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{branch.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{branch.phone}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Lead Pastor: {branch.leadPastor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{branch.members} members</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Service Times</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {branch.services.map((service, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-sm">{service.name}</div>
                            <div className="text-xs text-muted-foreground">{service.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-branch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Branch</CardTitle>
                <p className="text-sm text-muted-foreground">Create a new church branch location</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="branch-name">Branch Name</Label>
                      <Input id="branch-name" placeholder="e.g., Lagos Main Branch" />
                    </div>
                    <div>
                      <Label htmlFor="branch-address">Full Address</Label>
                      <Textarea id="branch-address" placeholder="Enter complete address" rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="branch-phone">Phone Number</Label>
                      <Input id="branch-phone" placeholder="+234 XXX XXX XXXX" />
                    </div>
                    <div>
                      <Label htmlFor="lead-pastor">Lead Pastor</Label>
                      <Input id="lead-pastor" placeholder="Select or enter pastor name" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="established-date">Established Date</Label>
                      <Input id="established-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="initial-members">Initial Members</Label>
                      <Input id="initial-members" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="branch-description">Description</Label>
                      <Textarea id="branch-description" placeholder="Brief description of the branch" rows={4} />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Service Times</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="service-1">Service 1</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Service name" />
                        <Input placeholder="Time" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-2">Service 2</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Service name" />
                        <Input placeholder="Time" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-3">Service 3</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Service name" />
                        <Input placeholder="Time" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">Create Branch</Button>
                  <Button variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Times Management</CardTitle>
                <p className="text-sm text-muted-foreground">Manage service schedules across all branches</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {branches.map((branch) => (
                    <div key={branch.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">{branch.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {branch.services.map((service, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{service.name}</div>
                              <div className="text-xs text-muted-foreground">{service.time}</div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
