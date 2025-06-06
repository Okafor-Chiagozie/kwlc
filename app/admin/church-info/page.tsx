"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Church, MapPin, Clock, Users, Calendar, Save, Edit, Plus, Trash2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"

export default function ChurchInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [churchInfo, setChurchInfo] = useState({
    name: "Kingdom Ways Living Church International",
    mission: "Preaching the word, teaching the principles of the kingdom and demonstrating the power of the kingdom.",
    vision: "To raise a generation of kingdom minded believers who will impact their world for Christ.",
    address: "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road Jakande Bus Stop, Osapa London, Lagos",
    phone: "+234 803 123 4567",
    email: "info@kwlc.org",
    website: "www.kwlc.org",
    founded: "2010",
    pastor: "Pastor Michael Blackson",
  })

  const [serviceSchedule, setServiceSchedule] = useState([
    { day: "Sunday", service: "First Service", time: "7:00 AM - 9:00 AM" },
    { day: "Sunday", service: "Second Service", time: "9:30 AM - 11:30 AM" },
    { day: "Wednesday", service: "Bible Study", time: "6:00 PM - 8:00 PM" },
    { day: "Friday", service: "Prayer Meeting", time: "6:00 PM - 8:00 PM" },
  ])

  const [branches] = useState([
    {
      name: "Lagos (Main)",
      address: "24 Prince Ibrahim Eletu Avenue, Lagos",
      pastor: "Pastor Michael Blackson",
      members: 2500,
    },
    {
      name: "Abuja Branch",
      address: "Plot 123 Central Business District, Abuja",
      pastor: "Pastor Sarah Johnson",
      members: 800,
    },
    {
      name: "Port Harcourt",
      address: "15 Trans Amadi Road, Port Harcourt",
      pastor: "Pastor David Wilson",
      members: 600,
    },
    { name: "Kano Branch", address: "45 Ahmadu Bello Way, Kano", pastor: "Pastor Grace Adamu", members: 400 },
  ])

  const handleSave = () => {
    toast.success("Church information updated successfully!")
    setIsEditing(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Church Information</h1>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? "Save Changes" : "Edit Info"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="schedule">Service Schedule</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Church className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="churchName">Church Name</Label>
                    <Input
                      id="churchName"
                      value={churchInfo.name}
                      onChange={(e) => setChurchInfo({ ...churchInfo, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pastor">Senior Pastor</Label>
                    <Input
                      id="pastor"
                      value={churchInfo.pastor}
                      onChange={(e) => setChurchInfo({ ...churchInfo, pastor: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="founded">Year Founded</Label>
                    <Input
                      id="founded"
                      value={churchInfo.founded}
                      onChange={(e) => setChurchInfo({ ...churchInfo, founded: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={churchInfo.address}
                      onChange={(e) => setChurchInfo({ ...churchInfo, address: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={churchInfo.phone}
                      onChange={(e) => setChurchInfo({ ...churchInfo, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={churchInfo.email}
                      onChange={(e) => setChurchInfo({ ...churchInfo, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={churchInfo.website}
                      onChange={(e) => setChurchInfo({ ...churchInfo, website: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mission & Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={churchInfo.mission}
                    onChange={(e) => setChurchInfo({ ...churchInfo, mission: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    value={churchInfo.vision}
                    onChange={(e) => setChurchInfo({ ...churchInfo, vision: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex justify-end">
                <Button onClick={handleSave} className="mr-2">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Service Schedule
                  </span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceSchedule.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{schedule.service}</h3>
                        <p className="text-sm text-muted-foreground">{schedule.day}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{schedule.time}</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Church className="h-5 w-5" />
                    Church Branches
                  </span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Branch
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches.map((branch, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{branch.name}</h3>
                        <Badge>{branch.members} members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{branch.address}</p>
                      <p className="text-sm font-medium">{branch.pastor}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">4,300</div>
                  <p className="text-xs text-muted-foreground">Across all branches</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
                  <Church className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <p className="text-xs text-muted-foreground">Operating branches</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Years of Ministry</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">14</div>
                  <p className="text-xs text-muted-foreground">Since 2010</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
