"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

export default function PastorsPage() {
  const [pastors, setPastors] = useState([
    {
      id: 1,
      name: "Pastor Michael Blackson",
      title: "Senior Pastor",
      branch: "Lagos Main",
      email: "michael@kwlc.org",
      phone: "+234 70 433 2832",
      bio: "Pastor Michael has been leading Kingdom Ways Living Church for over 15 years with a passion for teaching and community building.",
      joinDate: "2010-01-15",
      image: "/placeholder.svg?height=200&width=200&text=Pastor+Michael",
      status: "active",
    },
    {
      id: 2,
      name: "Pastor Sarah Johnson",
      title: "Lead Pastor",
      branch: "Abuja Branch",
      email: "sarah@kwlc.org",
      phone: "+234 80 123 4567",
      bio: "Pastor Sarah brings 10 years of ministry experience with a heart for youth and women's ministry.",
      joinDate: "2015-03-20",
      image: "/placeholder.svg?height=200&width=200&text=Pastor+Sarah",
      status: "active",
    },
    {
      id: 3,
      name: "Pastor David Emmanuel",
      title: "Lead Pastor",
      branch: "Port Harcourt",
      email: "david@kwlc.org",
      phone: "+234 84 567 8901",
      bio: "Pastor David is passionate about evangelism and has planted multiple churches across the Niger Delta region.",
      joinDate: "2018-06-10",
      image: "/placeholder.svg?height=200&width=200&text=Pastor+David",
      status: "active",
    },
  ])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pastors Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Pastor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pastors</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Across all branches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Senior Pastors</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1</div>
              <p className="text-xs text-muted-foreground">Main leadership</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lead Pastors</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">4</div>
              <p className="text-xs text-muted-foreground">Branch leaders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Associate Pastors</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <p className="text-xs text-muted-foreground">Support ministry</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-pastors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-pastors">All Pastors</TabsTrigger>
            <TabsTrigger value="add-pastor">Add Pastor</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="all-pastors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastors.map((pastor) => (
                <Card key={pastor.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={pastor.image || "/placeholder.svg"} alt={pastor.name} />
                        <AvatarFallback>
                          {pastor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{pastor.name}</h3>
                        <p className="text-sm text-muted-foreground">{pastor.title}</p>
                        <Badge variant="outline" className="mt-1">
                          {pastor.branch}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{pastor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{pastor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Joined {pastor.joinDate}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{pastor.bio}</p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-pastor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Pastor</CardTitle>
                <p className="text-sm text-muted-foreground">Add a new pastor to the church leadership team</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pastor-name">Full Name</Label>
                      <Input id="pastor-name" placeholder="Enter pastor's full name" />
                    </div>
                    <div>
                      <Label htmlFor="pastor-title">Title/Position</Label>
                      <Input id="pastor-title" placeholder="e.g., Senior Pastor, Lead Pastor" />
                    </div>
                    <div>
                      <Label htmlFor="pastor-branch">Branch Assignment</Label>
                      <Input id="pastor-branch" placeholder="Select branch" />
                    </div>
                    <div>
                      <Label htmlFor="pastor-email">Email Address</Label>
                      <Input id="pastor-email" type="email" placeholder="pastor@kwlc.org" />
                    </div>
                    <div>
                      <Label htmlFor="pastor-phone">Phone Number</Label>
                      <Input id="pastor-phone" placeholder="+234 XXX XXX XXXX" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pastor-bio">Biography</Label>
                      <Textarea
                        id="pastor-bio"
                        placeholder="Enter pastor's biography and ministry background"
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pastor-image">Profile Image</Label>
                      <Input id="pastor-image" type="file" accept="image/*" />
                    </div>
                    <div>
                      <Label htmlFor="join-date">Join Date</Label>
                      <Input id="join-date" type="date" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">Add Pastor</Button>
                  <Button variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ministry Assignments</CardTitle>
                <p className="text-sm text-muted-foreground">Manage pastor assignments and responsibilities</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastors.map((pastor) => (
                    <div key={pastor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={pastor.image || "/placeholder.svg"} alt={pastor.name} />
                          <AvatarFallback>
                            {pastor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{pastor.name}</h3>
                          <p className="text-sm text-muted-foreground">{pastor.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{pastor.branch}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {pastor.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Reassign
                          </Button>
                        </div>
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
