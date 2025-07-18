"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Edit, Trash2, Users, MapPin, Clock, DollarSign, Loader2, Image } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"
import {
  searchEvent,
  createOrUpdateEvent,
  getEventDetail,
  getEvent,
  getUpcomingEvents,
  getFeaturedEvent,
  updateAttendees,
  deleteEvent,
  createOrUpdateEventType,
  getEventTypes,
  deleteEventType,
  createOrUpdateEventImage,
  getEventImages,
  deleteEventImage,
  createOrUpdateEventSchedule,
  getEventSchedules,
  deleteEventSchedule,
  addOrUpdateEventSpeaker,
  getEventSpeakers,
  deleteEventSpeaker
} from "@/services/event"
import { getAllBranches } from "@/services/branch"
import {
  CreateOrUpdateEventRequest,
  SearchEventRequest,
  EventViewModel,
  EventResponseViewModel,
  CreateOrUpdateEventTypeRequest,
  CreateOrUpdateEventImageRequest,
  CreateOrUpdateEventScheduleRequest,
  AddOrUpdateEventSpeakerRequest,
  DayOfWeek,
  TimeOnly,
  DateOnly,
  SpeakerRole
} from "@/types/event"

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Events State
  const [events, setEvents] = useState<EventViewModel[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<EventViewModel[]>([])
  const [featuredEvents, setFeaturedEvents] = useState<EventViewModel[]>([])
  const [eventTypes, setEventTypes] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])

  // Search State
  const [searchParams, setSearchParams] = useState<SearchEventRequest>({
    pageSize: 20,
    pageNumber: 1,
    searchParams: {}
  })

  // New Event Form State
  const [newEvent, setNewEvent] = useState<CreateOrUpdateEventRequest>({
    id: null,
    name: "",
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      dayOfWeek: DayOfWeek.Sunday,
      dayOfYear: 1,
      dayNumber: 1
    },
    startTime: { hour: 9, minute: 0 },
    closeTime: { hour: 12, minute: 0 },
    branchId: null,
    eventTypeId: 1,
    fee: null,
    maxAttendance: null,
    description: "",
    location: "",
    address: ""
  })

  // New Event Type State
  const [newEventType, setNewEventType] = useState<CreateOrUpdateEventTypeRequest>({
    id: null,
    name: ""
  })

  // Event Images State
  const [selectedEventForImages, setSelectedEventForImages] = useState<number | null>(null)
  const [eventImages, setEventImages] = useState<any[]>([])

  // Edit States
  const [editingEvent, setEditingEvent] = useState<CreateOrUpdateEventRequest | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    loadEventsData()
  }, [])

  const loadEventsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load events, event types, and branches data
      const [eventsData, upcomingData, featuredData, eventTypesData, branchesData] = await Promise.allSettled([
        searchEvent(searchParams),
        getUpcomingEvents(),
        getFeaturedEvent(),
        getEventTypes(),
        getAllBranches({ pageSize: 100, pageNumber: 1 })
      ])

      // Handle events data
      if (eventsData.status === 'fulfilled' && eventsData.value.isSuccessful) {
        setEvents(eventsData.value.data || [])
        console.log('Events loaded:', eventsData.value.data)
      } else {
        console.error('Failed to load events:', eventsData)
      }

      // Handle upcoming events
      if (upcomingData.status === 'fulfilled') {
        setUpcomingEvents(upcomingData.value || [])
        console.log('Upcoming events loaded:', upcomingData.value)
      } else {
        console.error('Failed to load upcoming events:', upcomingData)
      }

      // Handle featured events
      if (featuredData.status === 'fulfilled') {
        setFeaturedEvents(featuredData.value || [])
        console.log('Featured events loaded:', featuredData.value)
      } else {
        console.error('Failed to load featured events:', featuredData)
      }

      // Handle event types
      if (eventTypesData.status === 'fulfilled' && eventTypesData.value.isSuccessful) {
        setEventTypes([eventTypesData.value.data] || [])
        console.log('Event types loaded:', eventTypesData.value.data)
      } else {
        console.error('Failed to load event types:', eventTypesData)
      }

      // Handle branches data
      if (branchesData.status === 'fulfilled' && branchesData.value.isSuccessful) {
        setBranches(branchesData.value.data || [])
        console.log('Branches loaded for events:', branchesData.value.data)
      } else {
        console.error('Failed to load branches:', branchesData)
      }

    } catch (err: any) {
      console.error('Error loading events data:', err)
      setError('Failed to load events information')
      toast.error('Failed to load events information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await searchEvent(searchParams)

      if (response.isSuccessful) {
        setEvents(response.data || [])
        console.log('Search results:', response.data)
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || 'Search failed'
        toast.error(errorMessage)
      }
    } catch (err: any) {
      console.error('Error searching events:', err)
      toast.error('Failed to search events')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    try {
      // Validate required fields
      if (!newEvent.name.trim() || !newEvent.description.trim()) {
        toast.error('Please fill in all required fields (Name, Description)')
        return
      }

      setIsSaving(true)
      const response = await createOrUpdateEvent(newEvent)

      if (response) { // The API returns EventViewModel directly
        toast.success('Event created successfully!')
        
        // Reset form
        setNewEvent({
          id: null,
          name: "",
          date: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            dayOfWeek: DayOfWeek.Sunday,
            dayOfYear: 1,
            dayNumber: 1
          },
          startTime: { hour: 9, minute: 0 },
          closeTime: { hour: 12, minute: 0 },
          branchId: null,
          eventTypeId: 1,
          fee: null,
          maxAttendance: null,
          description: "",
          location: "",
          address: ""
        })
        
        // Reload data
        loadEventsData()
      } else {
        throw new Error('Failed to create event')
      }
    } catch (err: any) {
      console.error('Error creating event:', err)
      toast.error(err.message || 'Failed to create event')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateEvent = async () => {
    try {
      if (!editingEvent) return

      setIsSaving(true)
      const response = await createOrUpdateEvent(editingEvent)

      if (response) {
        toast.success('Event updated successfully!')
        setIsEditDialogOpen(false)
        setEditingEvent(null)
        loadEventsData()
      } else {
        throw new Error('Failed to update event')
      }
    } catch (err: any) {
      console.error('Error updating event:', err)
      toast.error(err.message || 'Failed to update event')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    try {
      if (!confirm('Are you sure you want to delete this event?')) return

      const response = await deleteEvent(eventId)

      if (response.isSuccessful) {
        toast.success('Event deleted successfully!')
        loadEventsData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || 'Delete failed'
        throw new Error(errorMessage)
      }
    } catch (err: any) {
      console.error('Error deleting event:', err)
      toast.error(err.message || 'Failed to delete event')
    }
  }

  const handleCreateEventType = async () => {
    try {
      if (!newEventType.name.trim()) {
        toast.error('Please enter event type name')
        return
      }

      setIsSaving(true)
      const response = await createOrUpdateEventType(newEventType)

      if (response.isSuccessful) {
        toast.success('Event type created successfully!')
        setNewEventType({ id: null, name: "" })
        loadEventsData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to create event type')
      }
    } catch (err: any) {
      console.error('Error creating event type:', err)
      toast.error(err.message || 'Failed to create event type')
    } finally {
      setIsSaving(false)
    }
  }

  const loadEventImages = async (eventId: number) => {
    try {
      const response = await getEventImages(eventId)
      
      if (response.isSuccessful && response.data) {
        setEventImages(response.data)
        setSelectedEventForImages(eventId)
        console.log('Event images loaded for event:', eventId, response.data)
      } else {
        console.error('Failed to load event images:', response)
      }
    } catch (err: any) {
      console.error('Error loading event images:', err)
    }
  }

  const startEditEvent = (event: EventViewModel) => {
    const eventDate = new Date(event.date)
    setEditingEvent({
      id: event.id,
      name: event.name,
      date: {
        year: eventDate.getFullYear(),
        month: eventDate.getMonth() + 1,
        day: eventDate.getDate(),
        dayOfWeek: DayOfWeek.Sunday, // Will be calculated by API
        dayOfYear: 1,
        dayNumber: 1
      },
      startTime: parseTime(event.startTime),
      closeTime: parseTime(event.closeTime),
      branchId: event.branchId,
      eventTypeId: event.eventTypeId,
      fee: event.fee,
      maxAttendance: event.maxAttendance,
      description: event.description,
      location: event.location,
      address: event.address
    })
    setIsEditDialogOpen(true)
  }

  const formatTime = (time: TimeOnly): string => {
    const hour = time.hour.toString().padStart(2, '0')
    const minute = time.minute.toString().padStart(2, '0')
    return `${hour}:${minute}`
  }

  const parseTime = (timeString: string): TimeOnly => {
    const [hour, minute] = timeString.split(':').map(Number)
    return { hour: hour || 0, minute: minute || 0 }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  }

  const getBranchName = (branchId: number | null): string => {
    if (!branchId) return 'No Branch'
    const branch = branches.find(b => b.id === branchId)
    return branch ? branch.name : `Branch ID: ${branchId}`
  }

  // Calculate statistics
  const totalEvents = events.length
  const activeEvents = events.filter(e => !e.isDeleted).length
  const totalAttendees = events.reduce((sum, event) => sum + (event.attendanceCount || 0), 0)

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading events information...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Events Management</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">All events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeEvents}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalAttendees}</div>
              <p className="text-xs text-muted-foreground">All events</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-events">All Events</TabsTrigger>
            <TabsTrigger value="create-event">Create Event</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="featured">Featured Events</TabsTrigger>
            <TabsTrigger value="event-types">Event Types</TabsTrigger>
          </TabsList>

          <TabsContent value="all-events" className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Search Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Page Size</Label>
                    <Input
                      type="number"
                      value={searchParams.pageSize}
                      onChange={(e) => setSearchParams({ 
                        ...searchParams, 
                        pageSize: Number(e.target.value) || 20 
                      })}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <Label>Page Number</Label>
                    <Input
                      type="number"
                      value={searchParams.pageNumber}
                      onChange={(e) => setSearchParams({ 
                        ...searchParams, 
                        pageNumber: Number(e.target.value) || 1 
                      })}
                      min="1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSearchEvents}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        'Search Events'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Event List</CardTitle>
                <p className="text-sm text-muted-foreground">Manage all church events and registrations</p>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {event.imageUrl ? (
                              <img 
                                src={event.imageUrl} 
                                alt={event.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Calendar className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold">{event.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.startTime} - {event.closeTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location || 'No location'}
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{getBranchName(event.branchId)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={event.isDeleted ? "secondary" : "default"}>
                              {event.isDeleted ? "Inactive" : "Active"}
                            </Badge>
                            <span className="text-sm font-semibold">
                              {event.fee ? `₦${event.fee.toLocaleString()}` : "Free"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.attendanceCount || 0} attendees
                            {event.maxAttendance && ` / ${event.maxAttendance} max`}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditEvent(event)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => loadEventImages(event.id)}
                            >
                              <Image className="h-3 w-3 mr-1" />
                              Images
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No events found</p>
                  </div>
                )}
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
                      <Label htmlFor="event-title">Event Title *</Label>
                      <Input 
                        id="event-title" 
                        placeholder="Enter event title"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-description">Description *</Label>
                      <Textarea 
                        id="event-description" 
                        placeholder="Enter event description" 
                        rows={4}
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={newEvent.date.year}
                          onChange={(e) => setNewEvent({
                            ...newEvent,
                            date: { ...newEvent.date, year: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Month</Label>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={newEvent.date.month}
                          onChange={(e) => setNewEvent({
                            ...newEvent,
                            date: { ...newEvent.date, month: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Day</Label>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          value={newEvent.date.day}
                          onChange={(e) => setNewEvent({
                            ...newEvent,
                            date: { ...newEvent.date, day: Number(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={formatTime(newEvent.startTime)}
                          onChange={(e) => setNewEvent({ 
                            ...newEvent, 
                            startTime: parseTime(e.target.value) 
                          })}
                        />
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={formatTime(newEvent.closeTime)}
                          onChange={(e) => setNewEvent({ 
                            ...newEvent, 
                            closeTime: parseTime(e.target.value) 
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Branch</Label>
                      <Select 
                        value={newEvent.branchId?.toString() || undefined}
                        onValueChange={(value) => setNewEvent({ 
                          ...newEvent, 
                          branchId: value ? Number(value) : null 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Event Type ID</Label>
                      <Input
                        type="number"
                        value={newEvent.eventTypeId}
                        onChange={(e) => setNewEvent({ 
                          ...newEvent, 
                          eventTypeId: Number(e.target.value) || 1 
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Fee (₦)</Label>
                        <Input
                          type="number"
                          placeholder="0 for free"
                          value={newEvent.fee || ""}
                          onChange={(e) => setNewEvent({ 
                            ...newEvent, 
                            fee: e.target.value ? Number(e.target.value) : null 
                          })}
                        />
                      </div>
                      <div>
                        <Label>Max Attendance</Label>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          value={newEvent.maxAttendance || ""}
                          onChange={(e) => setNewEvent({ 
                            ...newEvent, 
                            maxAttendance: e.target.value ? Number(e.target.value) : null 
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        placeholder="Event location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Textarea
                        placeholder="Full address"
                        value={newEvent.address}
                        onChange={(e) => setNewEvent({ ...newEvent, address: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleCreateEvent}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <p className="text-sm text-muted-foreground">Events scheduled for the future</p>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{event.name}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>📅 {formatDate(event.date)}</span>
                            <span>🕐 {event.startTime}</span>
                            <span>📍 {event.location || 'TBD'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Upcoming</Badge>
                          <div className="text-sm font-semibold mt-1">
                            {event.fee ? `₦${event.fee.toLocaleString()}` : "Free"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No upcoming events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Events</CardTitle>
                <p className="text-sm text-muted-foreground">Highlighted events for promotion</p>
              </CardHeader>
              <CardContent>
                {featuredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {featuredEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                        <div>
                          <h3 className="font-semibold">{event.name}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>📅 {formatDate(event.date)}</span>
                            <span>🕐 {event.startTime}</span>
                            <span>📍 {event.location || 'TBD'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">Featured</Badge>
                          <div className="text-sm font-semibold mt-1">
                            {event.fee ? `₦${event.fee.toLocaleString()}` : "Free"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No featured events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="event-types" className="space-y-6">
            {/* Create Event Type */}
            <Card>
              <CardHeader>
                <CardTitle>Create Event Type</CardTitle>
                <p className="text-sm text-muted-foreground">Add new event categories</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Event type name (e.g., Conference, Workshop)"
                    value={newEventType.name}
                    onChange={(e) => setNewEventType({ ...newEventType, name: e.target.value })}
                    className="flex-1"
                  />
                  <Button onClick={handleCreateEventType} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Type
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Event Types List */}
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
                <p className="text-sm text-muted-foreground">Manage event categories</p>
              </CardHeader>
              <CardContent>
                {eventTypes.length > 0 ? (
                  <div className="space-y-2">
                    {eventTypes.map((type, index) => (
                      <div key={type.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{type.name}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => type.id && deleteEventType(type.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No event types found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Event Images Modal */}
        {selectedEventForImages && eventImages.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Event Images</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Images for Event ID: {selectedEventForImages}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventImages.map((image, index) => (
                    <div key={image.id || index} className="relative">
                      <img 
                        src={image.imageUrl || "/placeholder.svg"} 
                        alt={image.imageName || 'Event image'}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/75 text-white p-2 rounded text-sm">
                          <p className="font-medium truncate">{image.imageName}</p>
                          <p className="text-xs opacity-75">{image.imageCategoryId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedEventForImages(null)
                      setEventImages([])
                    }}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Event Dialog */}
        {isEditDialogOpen && editingEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Event Name</Label>
                    <Input
                      value={editingEvent.name}
                      onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Fee</Label>
                    <Input
                      type="number"
                      value={editingEvent.fee || ""}
                      onChange={(e) => setEditingEvent({ 
                        ...editingEvent, 
                        fee: e.target.value ? Number(e.target.value) : null 
                      })}
                    />
                  </div>
                  <div>
                    <Label>Max Attendance</Label>
                    <Input
                      type="number"
                      value={editingEvent.maxAttendance || ""}
                      onChange={(e) => setEditingEvent({ 
                        ...editingEvent, 
                        maxAttendance: e.target.value ? Number(e.target.value) : null 
                      })}
                    />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={formatTime(editingEvent.startTime)}
                      onChange={(e) => setEditingEvent({ 
                        ...editingEvent, 
                        startTime: parseTime(e.target.value) 
                      })}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={formatTime(editingEvent.closeTime)}
                      onChange={(e) => setEditingEvent({ 
                        ...editingEvent, 
                        closeTime: parseTime(e.target.value) 
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={editingEvent.address}
                    onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateEvent} disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Event'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditingEvent(null)
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}