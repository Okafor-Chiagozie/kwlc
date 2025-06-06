"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Edit, Trash2, Users, MapPin, Clock, DollarSign } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

export default function EventsPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Youth Empowerment Program",
      description: "A transformative program designed to empower young minds with spiritual and practical life skills.",
      date: "2024-04-15",
      time: "10:00 AM",
      venue: "Main Auditorium",
      price: 5000,
      capacity: 500,
      registered: 320,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Youth+Event",
    },
    {
      id: 2,
      title: "Marriage Enrichment Seminar",
      description: "Strengthening marriages through biblical principles and practical wisdom.",
      date: "2024-04-22",
      time: "2:00 PM",
      venue: "Conference Hall",
      price: 8000,
      capacity: 200,
      registered: 145,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Marriage+Seminar",
    },
    {
      id: 3,
      title: "Easter Celebration",
      description: "Join us for a special Easter celebration with worship, fellowship, and communion.",
      date: "2024-03-31",
      time: "9:00 AM",
      venue: "Main Sanctuary",
      price: 0,
      capacity: 1000,
      registered: 856,
      status: "completed",
      image: "/placeholder.svg?height=200&width=300&text=Easter+Event",
    },
  ])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Events Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">3</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1,321</div>
              <p className="text-xs text-muted-foreground">All events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₦4.2M</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-events">All Events</TabsTrigger>
            <TabsTrigger value="create-event">Create Event</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all-events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event List</CardTitle>
                <p className="text-sm text-muted-foreground">Manage all church events and registrations</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.venue}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              event.status === "active"
                                ? "default"
                                : event.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {event.status}
                          </Badge>
                          <span className="text-sm font-semibold">
                            {event.price === 0 ? "Free" : `₦${event.price.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.registered}/{event.capacity} registered
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-event" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <p className="text-sm text-muted-foreground">Add a new event to the church calendar</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input id="event-title" placeholder="Enter event title" />
                    </div>
                    <div>
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea id="event-description" placeholder="Enter event description" rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-date">Date</Label>
                        <Input id="event-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="event-time">Time</Label>
                        <Input id="event-time" type="time" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="event-venue">Venue</Label>
                      <Input id="event-venue" placeholder="Event venue" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-price">Price (₦)</Label>
                        <Input id="event-price" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="event-capacity">Capacity</Label>
                        <Input id="event-capacity" type="number" placeholder="100" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="event-category">Category</Label>
                      <Input id="event-category" placeholder="e.g., Conference, Workshop, Service" />
                    </div>
                    <div>
                      <Label htmlFor="event-image">Event Image</Label>
                      <Input id="event-image" type="file" accept="image/*" />
                    </div>
                    <div>
                      <Label htmlFor="registration-deadline">Registration Deadline</Label>
                      <Input id="registration-deadline" type="date" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">Create Event</Button>
                  <Button variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <Calendar className="h-8 w-8 mx-auto mb-2" />
                      <p>Event Analytics Chart</p>
                      <p className="text-sm">Registration trends over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Youth Empowerment Program</span>
                      <span className="font-semibold">320 registrations</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Marriage Enrichment Seminar</span>
                      <span className="font-semibold">145 registrations</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Easter Celebration</span>
                      <span className="font-semibold">856 registrations</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Christmas Concert</span>
                      <span className="font-semibold">234 registrations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
