"use client"

import { useState, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Share2, ChevronLeft, Users, Heart, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { getEvent, getUpcomingEvents } from "@/services/event"
import { DetailedEvent, Event } from "@/types/event"

const isNoRecordsError = (error: string | null) => {
  return error && error.toLowerCase().includes("no record found")
}

const LoadingState = () => (
  <div className="text-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading event details...</h1>
  </div>
)

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to Load Event</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  </section>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-40">
    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
    <h2 className="text-xl font-semibold mb-2">Event not found</h2>
    <p className="text-gray-600 mb-4">This event may have been removed or doesn't exist.</p>
    <Link href="/events">
      <Button variant="outline" className="border-primary bg-primary text-white hover:bg-primary/5">
        View All Events
      </Button>
    </Link>
  </div>
)

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState("details")
  const [selectedImage, setSelectedImage] = useState<string>("")

  // Unwrap the params Promise
  const { id } = use(params)
  const eventId = parseInt(id)

  // Fetch event details
  const { 
    data: eventResponse, 
    loading: eventLoading, 
    error: eventError, 
    refetch: refetchEvent 
  } = useApi(() => getEvent(eventId), [eventId])

  // Fetch related events (latest 3 upcoming events excluding current event)
  const { 
    data: upcomingEventsData, 
    loading: relatedLoading 
  } = useApi(() => getUpcomingEvents(), [])

  // Filter out current event and take only 3
  const relatedEvents = Array.isArray(upcomingEventsData) 
    ? upcomingEventsData.filter((e: Event) => e.id !== eventId).slice(0, 3) 
    : []

  const event = eventResponse?.data?.[0]

  // Set default selected image when event data loads
  useEffect(() => {
    if (event?.previewImages?.[0]) {
      setSelectedImage(event.previewImages[0])
    } else if (event?.carouselImages?.[0]) {
      setSelectedImage(event.carouselImages[0])
    }
  }, [event])

  // Handle loading state
  if (eventLoading) {
    return (
      <MainLayout>
        {/* <div className="min-h-screen">
          <LoadingState />
        </div> */}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingState />
        </div>
      </MainLayout>
    )
  }

  // Handle error state (but not "no records found")
  if (eventError && !isNoRecordsError(eventError)) {
    return (
      <MainLayout>
        <div className="min-h-screen">
          <ErrorState error={eventError} onRetry={refetchEvent} />
        </div>
      </MainLayout>
    )
  }

  // Handle empty state (no event found)
  if (!event || isNoRecordsError(eventError)) {
    return (
      <MainLayout>
        <div className="min-h-screen">
          <EmptyState />
        </div>
      </MainLayout>
    )
  }

  // Prepare image gallery (combine preview and carousel images)
  const galleryImages = [
    ...(event.previewImages || []),
    ...(event.carouselImages || [])
  ].filter(Boolean)

  // Use the first available image as default if selectedImage is not set
  const displayImage = selectedImage || galleryImages[0] || "/placeholder.svg"

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).replace(/\//g, '. ')
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const eventDate = formatDate(event.date)
  const eventTime = `${formatTime(event.startTime)} - ${formatTime(event.closeTime)}`

  return (
    <MainLayout>
      <div className="min-h-screen pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-900 to-primary/90 pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-05%20at%2015.18.44-mJzZTwiXSxvcHMxaFJMDRgkP5inAAO.png')] bg-cover bg-center"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-primary/40"></div>

          <div className="container mx-auto px-4 relative z-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Events</span>
            </Link>

            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  Event
                </div>
                <div className="h-1 w-1 bg-white/40 rounded-full"></div>
                <div className="text-white/80 text-sm">{eventDate}</div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {event.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3 text-white">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-white/70">Date</p>
                    <p className="font-medium">{eventDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-white/70">Time</p>
                    <p className="font-medium">{eventTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-white/70">Price</p>
                    <p className="font-medium">₦{event.price || '0'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-primary hover:bg-white/90">Register Now</Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Heart className="h-4 w-4 mr-2" />
                  Save Event
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div
            className="absolute bottom-0 left-0 w-full h-20 bg-white"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
          ></div>
        </section>

        {/* Event Content Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-8">
                  <div className="flex overflow-x-auto space-x-8">
                    <button
                      className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "details" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                      onClick={() => setActiveTab("details")}
                    >
                      Details
                    </button>
                    {event.schedule && event.schedule.length > 0 && (
                      <button
                        className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "schedule" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("schedule")}
                      >
                        Schedule
                      </button>
                    )}
                    {event.speakers && event.speakers.length > 0 && (
                      <button
                        className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "speakers" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("speakers")}
                      >
                        Speakers
                      </button>
                    )}
                    <button
                      className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "location" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                      onClick={() => setActiveTab("location")}
                    >
                      Location
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mb-12">
                  {activeTab === "details" && (
                    <div>
                      {galleryImages.length > 0 && (
                        <div className="mb-8">
                          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-6">
                            <Image
                              src={displayImage || "/placeholder.svg"}
                              alt={event.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                              {galleryImages.slice(0, 4).map((image, index) => (
                                <div
                                  key={index}
                                  className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === image ? "border-primary" : "border-transparent"}`}
                                  onClick={() => setSelectedImage(image)}
                                >
                                  <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                      <div className="prose prose-lg max-w-none text-gray-700">
                        <p>{event.description || "No description available for this event."}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "schedule" && event.schedule && event.schedule.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>

                      <div className="space-y-6">
                        {event.schedule.map((scheduleItem, index) => (
                          <div key={scheduleItem.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center text-primary shrink-0">
                                <span className="text-lg font-bold">
                                  {formatTime(scheduleItem.startTime).split(' ')[0]}
                                </span>
                                <span className="text-xs font-medium">
                                  {formatTime(scheduleItem.startTime).split(' ')[1]}
                                </span>
                              </div>

                              <div>
                                <h3 className="font-bold text-lg mb-1">{scheduleItem.name}</h3>
                                <p className="text-gray-600 mb-2">{scheduleItem.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {formatTime(scheduleItem.startTime)} - {formatTime(scheduleItem.endTime)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "speakers" && event.speakers && event.speakers.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Event Speakers</h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {event.speakers.map((speaker) => (
                          <div key={speaker.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 relative">
                              <Image
                                src={speaker.imageUrl || "/placeholder.svg"}
                                alt={speaker.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{speaker.name}</h3>
                            <p className="text-gray-600">{speaker.speakerRole}</p>
                            {speaker.description && (
                              <p className="text-sm text-gray-500 mt-2">{speaker.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "location" && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Event Location</h2>

                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">{event.location || "Location TBD"}</h3>
                            <p className="text-gray-600">{event.address || "Address will be provided soon"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-gray-500">Map will be displayed here</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Share and Social */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="font-bold text-lg mb-4">Share This Event</h3>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Event Details</h3>
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                      ₦{event.price || '0'}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">Date</p>
                        <p className="font-medium text-gray-900">{eventDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">Time</p>
                        <p className="font-medium text-gray-900">{eventTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">Location</p>
                        <p className="font-medium text-gray-900">{event.location || "TBD"}</p>
                        {event.address && (
                          <p className="text-sm text-gray-500 mt-1">{event.address}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white mb-3">
                    Register Now
                  </Button>

                  {event.price && event.price !== "0" && (
                    <p className="text-center text-sm text-gray-500">
                      Registration fee: ₦{event.price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Events Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Related Events</h2>

            {relatedLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : relatedEvents && relatedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.slice(0, 3).map((relatedEvent: Event) => (
                  <div
                    key={relatedEvent.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={relatedEvent.imageUrl || "/placeholder.svg"}
                        alt={relatedEvent.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm text-gray-500">
                          {formatDate(relatedEvent.date)}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg mb-2">{relatedEvent.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedEvent.description || "Join us for this exciting event"}
                      </p>

                      <Link
                        href={`/events/${relatedEvent.id}`}
                        className="text-primary font-medium hover:text-primary/80 transition-colors"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No related events available at this time.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}