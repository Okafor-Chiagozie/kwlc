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
import ProtectedRoute from "@/components/admin/protected-route"
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

// Local form state type to keep structured date/time in UI
type EventFormState = {
  id: number | null
  name: string
  date: DateOnly
  startTime: TimeOnly
  closeTime: TimeOnly
  branchId: number | null
  eventTypeId: number
  fee: number | null
  maxAttendance: number | null
  description: string
  location: string
  address: string
}

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
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
  const [newEvent, setNewEvent] = useState<EventFormState>({
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
  const [imageCategoryId, setImageCategoryId] = useState<string>("CarouselImage")
  const [uploadingImages, setUploadingImages] = useState(false)
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])

  // Edit States
  const [editingEvent, setEditingEvent] = useState<EventFormState | null>(null)
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
        getAllBranches({ pageSize: 100, pageNumber: 1, searchParams: {} })
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
        const upRaw: any = upcomingData.value
        const upcomingEventsArray = Array.isArray(upRaw?.data) ? upRaw.data : (Array.isArray(upRaw) ? upRaw : [])
        setUpcomingEvents(upcomingEventsArray)
        console.log('Upcoming events loaded:', upcomingEventsArray)
      } else {
        console.error('Failed to load upcoming events:', upcomingData)
        setUpcomingEvents([])
      }

      // Handle featured events (single item)
      if (featuredData.status === 'fulfilled') {
        const feRaw: any = featuredData.value
        const feList = feRaw?.data ? [feRaw.data] : []
        setFeaturedEvents(feList)
        console.log('Featured events loaded:', feList)
      } else {
        console.error('Failed to load featured events:', featuredData)
      }

      // Handle event types
      if (eventTypesData.status === 'fulfilled' && eventTypesData.value.isSuccessful) {
        setEventTypes(Array.isArray(eventTypesData.value.data) ? eventTypesData.value.data : [])
        console.log('Event types loaded:', eventTypesData.value.data)
      } else {
        console.error('Failed to load event types:', eventTypesData)
        setEventTypes([])
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
      setIsSearching(true)
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
      setIsSearching(false)
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

      // Map state into required payload shape
      const payload: CreateOrUpdateEventRequest = {
        id: newEvent.id ?? null,
        name: newEvent.name,
        date: typeof newEvent.date === 'string' 
          ? newEvent.date 
          : formatDateOnlyToISO(newEvent.date),
        startTime: typeof newEvent.startTime === 'string' 
          ? newEvent.startTime 
          : formatTimeOnlyToHMS(newEvent.startTime),
        closeTime: typeof newEvent.closeTime === 'string' 
          ? newEvent.closeTime 
          : formatTimeOnlyToHMS(newEvent.closeTime),
        branchId: newEvent.branchId ?? null,
        eventTypeId: newEvent.eventTypeId,
        fee: newEvent.fee ?? 0,
        maxAttendance: newEvent.maxAttendance ?? null,
        description: newEvent.description,
        location: newEvent.location,
        address: newEvent.address
      }

      const response = await createOrUpdateEvent(payload)

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

      // Map editing state into required payload shape
      const payload: CreateOrUpdateEventRequest = {
        id: editingEvent.id ?? null,
        name: editingEvent.name,
        date: typeof editingEvent.date === 'string'
          ? editingEvent.date
          : formatDateOnlyToISO(editingEvent.date),
        startTime: typeof editingEvent.startTime === 'string'
          ? editingEvent.startTime
          : formatTimeOnlyToHMS(editingEvent.startTime),
        closeTime: typeof editingEvent.closeTime === 'string'
          ? editingEvent.closeTime
          : formatTimeOnlyToHMS(editingEvent.closeTime),
        branchId: editingEvent.branchId ?? null,
        eventTypeId: editingEvent.eventTypeId,
        fee: editingEvent.fee ?? 0,
        maxAttendance: editingEvent.maxAttendance ?? null,
        description: editingEvent.description,
        location: editingEvent.location,
        address: editingEvent.address
      }

      const response = await createOrUpdateEvent(payload)

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
        setEventImages([])
        setSelectedEventForImages(eventId)
      }
    } catch (err: any) {
      console.error('Error loading event images:', err)
      setEventImages([])
      setSelectedEventForImages(eventId)
    }
  }

  const handleUploadEventImages = async () => {
    try {
      if (!selectedEventForImages || filesToUpload.length === 0) {
        toast.error('Select files to upload')
        return
      }

      setUploadingImages(true)
      const payload: CreateOrUpdateEventImageRequest = {
        eventId: selectedEventForImages,
        file: filesToUpload,
        imageCategoryId: imageCategoryId as any
      }

      const resp = await createOrUpdateEventImage(payload)
      if (resp && resp.isSuccessful !== false) {
        toast.success('Images uploaded successfully!')
        setFilesToUpload([])
        await loadEventImages(selectedEventForImages)
      } else {
        toast.error('Failed to upload images')
      }
    } catch (err: any) {
      console.error('Error uploading images:', err)
      toast.error('Failed to upload images')
    } finally {
      setUploadingImages(false)
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
      startTime: parseTime(String(event.startTime || '00:00')),
      closeTime: parseTime(String(event.closeTime || '00:00')),
      branchId: (event.branchId ?? null) as number | null,
      eventTypeId: Number(event.eventTypeId ?? 1),
      fee: (event.fee ?? null) as number | null,
      maxAttendance: (event.maxAttendance ?? null) as number | null,
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

  // Helpers to format structured date/time to API string shapes
  const formatDateOnlyToISO = (date: DateOnly): string => {
    const y = date.year
    const m = String(date.month).padStart(2, '0')
    const d = String(date.day).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const formatTimeOnlyToHMS = (time: TimeOnly): string => {
    const hh = String(time.hour).padStart(2, '0')
    const mm = String(time.minute).padStart(2, '0')
    const ss = String(time.second ?? 0).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  }

  // Detect if a string is likely a URL (e.g., Google Maps link)
  const isLikelyUrl = (value: string | null | undefined): boolean => {
    if (!value) return false
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const normalizeText = (s?: string | null) => (s || '').toLowerCase().trim()
  const addressesEqual = (a?: string | null, b?: string | null) => {
    const na = normalizeText(a)
    const nb = normalizeText(b)
    return na !== '' && na === nb
  }

  const getBranchName = (branchId: number | null | undefined): string => {
    if (!branchId) return 'No Branch'
    const branch = branches.find(b => b.id === branchId)
    return branch ? branch.name : `Branch ID: ${branchId}`
  }

  // Get full branch object by id for address and map link usage
  const getBranchById = (branchId: number | null | undefined) => {
    if (!branchId) return null
    return branches.find(b => b.id === branchId) || null
  }

  // Calculate statistics
  const totalEvents = events.length
  const activeEvents = events.filter(e => !e.isDeleted).length
  const totalAttendees = events.reduce((sum, event) => sum + (event.attendanceCount || 0), 0)

  if (isLoading) {
    return (
      <ProtectedRoute>
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading events information...</span>
          </div>
        </div>
      </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Events Management</h1>
          <Button 
            onClick={loadEventsData} 
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            Refresh Data
          </Button>
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
              <div className="text-2xl font-bold text-blue-600">{upcomingEvents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Scheduled events</p>
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
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger value="all-events" className="text-xs sm:text-sm">All Events</TabsTrigger>
            <TabsTrigger value="create-event" className="text-xs sm:text-sm">Create Event</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Upcoming</TabsTrigger>
            <TabsTrigger value="featured" className="text-xs sm:text-sm">Featured</TabsTrigger>
            <TabsTrigger value="event-types" className="text-xs sm:text-sm">Event Types</TabsTrigger>
          </TabsList>

          <TabsContent value="all-events" className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Search Events</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleSearchEvents()
                }}>
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
                        type="submit"
                        disabled={isSearching}
                      className="w-full"
                    >
                        {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        'Search Events'
                      )}
                    </Button>
                  </div>
                </div>
                </form>
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
                      <div key={event.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg w-full max-w-full overflow-hidden">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-20 h-14 md:w-28 md:h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {event.imageUrl ? (
                              <img 
                                src={event.imageUrl} 
                                alt={event.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Calendar className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                            <h3 className="font-semibold break-words whitespace-normal">{event.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-[70ch] break-words whitespace-normal">{event.description}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.startTime} - {event.closeTime}
                              </div>
                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[40ch] break-words whitespace-normal">
                                {event.address
                                  ? event.address
                                  : (event.location && !isLikelyUrl(event.location) ? event.location : 'No location')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="truncate max-w-[32ch]">{getBranchName(event.branchId)}</span>
                                {(() => {
                                  const branch = getBranchById(event.branchId)
                                  if (!branch) return null
                                  const eventDisplayedAddress = event.address || (event.location && !isLikelyUrl(event.location) ? event.location : '')
                                  const showBranchAddress = branch.address && !addressesEqual(branch.address, eventDisplayedAddress)
                                  return showBranchAddress ? (
                                    <span className="text-muted-foreground truncate max-w-[260px]">• {branch.address}</span>
                                  ) : null
                                })()}
                                {(() => { const branch = getBranchById(event.branchId); return branch && branch.location ? (
                                  <a href={branch.location} target="_blank" rel="noopener noreferrer" className="text-primary underline">Get directions</a>
                                ) : null })()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2 flex-shrink-0 w-40 md:w-48">
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
                      <div>
                      <Label htmlFor="event-date">Event Date *</Label>
                        <Input
                        id="event-date"
                        type="date"
                        value={`${newEvent.date.year}-${String(newEvent.date.month).padStart(2, '0')}-${String(newEvent.date.day).padStart(2, '0')}`}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value)
                          setNewEvent({
                            ...newEvent,
                            date: {
                              year: selectedDate.getFullYear(),
                              month: selectedDate.getMonth() + 1,
                              day: selectedDate.getDate(),
                              dayOfWeek: Object.values(DayOfWeek)[selectedDate.getDay()],
                              dayOfYear: Math.floor((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)),
                              dayNumber: selectedDate.getDate()
                            }
                          })
                        }}
                      />
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
                      <Label>Event Type</Label>
                      <Select 
                        value={newEvent.eventTypeId?.toString() || "1"} 
                        onValueChange={(value) => setNewEvent({ 
                          ...newEvent, 
                          eventTypeId: Number(value) || 1 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((eventType) => (
                            <SelectItem key={eventType.id} value={eventType.id?.toString() || "1"}>
                              {eventType.name || `Event Type ${eventType.id}`}
                            </SelectItem>
                          ))}
                          {eventTypes.length === 0 && (
                            <SelectItem value="1">Default Event Type</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
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
                      <Label>Event Location</Label>
                      <Input
                        placeholder="Event location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Event Address</Label>
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
                      <div key={event.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg w-full max-w-full overflow-hidden">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-20 h-14 md:w-28 md:h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {event.imageUrl ? (
                              <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Calendar className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                            <h3 className="font-semibold break-words whitespace-normal">{event.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-[70ch] break-words whitespace-normal">{event.description}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(event.date)}
                        </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.startTime} - {event.closeTime}
                              </div>
                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[40ch] break-words whitespace-normal">
                                  {event.address
                                    ? event.address
                                    : (event.location && !isLikelyUrl(event.location) ? event.location : 'No location')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="truncate max-w-[32ch]">{getBranchName(event.branchId)}</span>
                                {(() => {
                                  const branch = getBranchById(event.branchId)
                                  if (!branch) return null
                                  const eventDisplayedAddress = event.address || (event.location && !isLikelyUrl(event.location) ? event.location : '')
                                  const showBranchAddress = branch.address && !addressesEqual(branch.address, eventDisplayedAddress)
                                  return showBranchAddress ? (
                                    <span className="text-muted-foreground truncate max-w-[260px]">• {branch.address}</span>
                                  ) : null
                                })()}
                                {(() => { const branch = getBranchById(event.branchId); return branch && branch.location ? (
                                  <a href={branch.location} target="_blank" rel="noopener noreferrer" className="text-primary underline">Get directions</a>
                                ) : null })()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2 flex-shrink-0 w-40 md:w-48">
                          <div className="flex items-center gap-2">
                          <Badge variant="outline">Upcoming</Badge>
                            <span className="text-sm font-semibold">
                            {event.fee ? `₦${event.fee.toLocaleString()}` : "Free"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.attendanceCount || 0} attendees
                            {event.maxAttendance && ` / ${event.maxAttendance} max`}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditEvent(event)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => loadEventImages(event.id)}>
                              <Image className="h-3 w-3 mr-1" />
                              Images
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteEvent(event.id)}>
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
                      <div key={event.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg w-full max-w-full overflow-hidden">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-20 h-14 md:w-28 md:h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {event.imageUrl ? (
                              <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Calendar className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                            <h3 className="font-semibold break-words whitespace-normal">{event.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-[70ch] break-words whitespace-normal">{event.description}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(event.date)}
                        </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.startTime} - {event.closeTime}
                              </div>
                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[40ch] break-words whitespace-normal">
                                  {event.address
                                    ? event.address
                                    : (event.location && !isLikelyUrl(event.location) ? event.location : 'No location')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="truncate max-w-[32ch]">{getBranchName(event.branchId)}</span>
                                {(() => {
                                  const branch = getBranchById(event.branchId)
                                  if (!branch) return null
                                  const eventDisplayedAddress = event.address || (event.location && !isLikelyUrl(event.location) ? event.location : '')
                                  const showBranchAddress = branch.address && !addressesEqual(branch.address, eventDisplayedAddress)
                                  return showBranchAddress ? (
                                    <span className="text-muted-foreground truncate max-w-[260px]">• {branch.address}</span>
                                  ) : null
                                })()}
                                {(() => { const branch = getBranchById(event.branchId); return branch && branch.location ? (
                                  <a href={branch.location} target="_blank" rel="noopener noreferrer" className="text-primary underline">Get directions</a>
                                ) : null })()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2 flex-shrink-0 w-40 md:w-48">
                          <div className="flex items-center gap-2">
                          <Badge variant="default">Featured</Badge>
                            <span className="text-sm font-semibold">
                            {event.fee ? `₦${event.fee.toLocaleString()}` : "Free"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.attendanceCount || 0} attendees
                            {event.maxAttendance && ` / ${event.maxAttendance} max`}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditEvent(event)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => loadEventImages(event.id)}>
                              <Image className="h-3 w-3 mr-1" />
                              Images
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteEvent(event.id)}>
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
        {selectedEventForImages && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0">
            <Card className="w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto">
              <CardHeader>
                <CardTitle>Event Images</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Images for {events.find(e => e.id === selectedEventForImages)?.name || `Event #${selectedEventForImages}`}
                </p>
                <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={imageCategoryId} onValueChange={(v) => setImageCategoryId(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CarouselImage">Carousel</SelectItem>
                        <SelectItem value="GalleryImages">Gallery</SelectItem>
                        <SelectItem value="PreviewImage">Preview</SelectItem>
                        <SelectItem value="ThumbnailImage">Thumbnail</SelectItem>
                        <SelectItem value="Headshots">Headshots</SelectItem>
                        <SelectItem value="TicketImage">Ticket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Files</Label>
                    <Input type="file" multiple onChange={(e) => setFilesToUpload(Array.from(e.target.files || []))} />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleUploadEventImages} disabled={uploadingImages || filesToUpload.length === 0} className="w-full">
                      {uploadingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {eventImages.length > 0 ? (
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
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No images yet. Upload to get started.
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedEventForImages(null)
                      setEventImages([])
                      setFilesToUpload([])
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0">
            <Card className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
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
                    <Label>Event Location</Label>
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
                  <Label>Event Address</Label>
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
    </ProtectedRoute>
  )
}