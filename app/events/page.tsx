"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Search, ChevronRight, Filter, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/main-layout"
import { useApi } from "@/hooks/useApi"
import { searchEvents, getFeaturedEvents } from "@/services/event"
import { getAllBranches } from "@/services/branch"
import { Event } from "@/types/event"
import { Branch } from "@/types/branch"

export default function EventsPage() {
  const [viewMode, setViewMode] = useState("list") // list, calendar, day
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  // Helper function to check if error is "No Record found."
  const isNoRecordsError = (error: string | null) => {
    return error && error.toLowerCase().includes("no record found")
  }

  // API calls
  const {
    data: eventsResponse,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents
  } = useApi(() => searchEvents({
    pageSize: 10,
    pageNumber: 1,
    searchParams: searchQuery ? { search: searchQuery } : undefined
  }), [searchQuery])

  const {
    data: branchesResponse,
    loading: branchesLoading,
    error: branchesError,
    refetch: refetchBranches
  } = useApi(() => getAllBranches({
    pageSize: 100,
    pageNumber: 1
  }), [])

  // Featured events API call
  const {
    data: featuredEventsResponse,
    loading: featuredEventsLoading,
    error: featuredEventsError,
    refetch: refetchFeaturedEvents
  } = useApi(() => getFeaturedEvents(), [])

  // Extract data from API responses
  const events = eventsResponse?.data || []
  const branches = branchesResponse?.data || []
  const featuredEvents = Array.isArray(featuredEventsResponse) ? featuredEventsResponse : []

  // Create a map of branch ID to branch name for easy lookup
  const branchMap = branches.reduce((acc: Record<number, string>, branch: Branch) => {
    acc[branch.id] = branch.name
    return acc
  }, {})

  // Filter events based on search and date
  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch = searchQuery
      ? event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesDate = selectedDate
      ? event.date === selectedDate
      : true

    return matchesSearch && matchesDate
  })

  const handleSearch = () => {
    refetchEvents()
  }

  // Get the first featured event (or null if none available)
  const featuredEvent = featuredEvents.length > 0 ? featuredEvents[0] : null

  // Check if we should show empty state instead of error
  const shouldShowEventsError = eventsError && !isNoRecordsError(eventsError)
  const shouldShowFeaturedError = featuredEventsError && !isNoRecordsError(featuredEventsError)

  // Loading State Component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Loading events...</p>
    </div>
  )

  return (
    <MainLayout>
      <div className="min-h-screen pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-900 to-primary/90 pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png')] bg-cover bg-center"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-primary/40"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Upcoming Events & Programs
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8">
                Join us for transformative experiences that will strengthen your faith and build community
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div
            className="absolute bottom-0 left-0 w-full h-20 bg-white"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
          ></div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-32 relative z-20 border border-gray-100">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="pl-10 py-6 border-gray-300 rounded-xl focus:ring-primary focus:border-primary w-full"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search events..."
                      className="pl-10 py-6 border-gray-300 rounded-xl focus:ring-primary focus:border-primary w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button 
                    className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-xl"
                    onClick={handleSearch}
                    disabled={eventsLoading}
                  >
                    {eventsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Searching...
                      </>
                    ) : (
                      "Find Events"
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">View as:</span>
                </div>

                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === "calendar" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setViewMode("calendar")}
                  >
                    Month
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === "day" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setViewMode("day")}
                  >
                    Day
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Listing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              <div className="text-sm text-gray-500">
                {eventsLoading ? "Loading..." : `Showing ${filteredEvents.length} events`}
              </div>
            </div>

            {/* Error State - Only show for real errors, not "No Record found." */}
            {shouldShowEventsError && (
              <div className="mb-12">
                <div className="text-center max-w-md mx-auto">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Unable to Load Events</h3>
                  <p className="text-gray-600 mb-4">{eventsError}</p>
                  <Button onClick={refetchEvents}>Try Again</Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {eventsLoading && <LoadingState />}

            {/* Events List */}
            {!eventsLoading && !shouldShowEventsError && (
              <div className="space-y-8">
                {filteredEvents.map((event: Event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group"
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="relative h-64 md:h-auto overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <Image
                          src={event.imageUrl || "/placeholder.svg"}
                          alt={event.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md z-20">
                          <div className="text-xs font-semibold text-gray-500">PRICE</div>
                          <div className="text-lg font-bold text-primary">
                            {event.price || `₦${event.fee.toLocaleString()}`}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:p-8 md:col-span-2 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                            {event.name}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-0.5">Date</p>
                                <p className="font-medium text-gray-900">
                                  {new Date(event.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-0.5">Time</p>
                                <p className="font-medium text-gray-900">
                                  {event.startTime} - {event.closeTime}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 md:col-span-2">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-0.5">Location</p>
                                <p className="font-medium text-gray-900">
                                  {branchMap[event.branchId] || event.location}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{event.address}</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-6">{event.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Link
                            href={`/events/${event.id}`}
                            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                          >
                            READ MORE
                            <ChevronRight className="h-4 w-4" />
                          </Link>

                          <Button className="bg-primary hover:bg-primary/90 text-white">
                            Register Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty state - shows for both no events and "No Record found." error */}
                {filteredEvents.length === 0 && (
                  <div className="text-center py-16">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
                    <p className="text-gray-500">
                      {searchQuery || selectedDate 
                        ? "Try adjusting your search criteria" 
                        : "No upcoming events at the moment"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!eventsLoading && !shouldShowEventsError && filteredEvents.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Load More Events
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Featured Event Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-tr-[100px]"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Don't Miss Out</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Featured Event
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Join us for our special featured event with exciting programs and activities
              </p>
            </div>

            {/* Featured Event Loading State */}
            {featuredEventsLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-gray-600">Loading featured event...</p>
              </div>
            )}

            {/* Featured Event Error State - Only show for real errors */}
            {shouldShowFeaturedError && (
              <div className="text-center max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unable to Load Featured Event</h3>
                <p className="text-gray-600 mb-4">{featuredEventsError}</p>
                <Button onClick={refetchFeaturedEvents}>Try Again</Button>
              </div>
            )}

            {/* Featured Event Content */}
            {!featuredEventsLoading && !shouldShowFeaturedError && featuredEvent && (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={featuredEvent.imageUrl || "/placeholder.svg"}
                      alt={featuredEvent.name}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                <div>
                  {featuredEvent.maxAttendance && featuredEvent.attendanceCount && 
                   featuredEvent.attendanceCount / featuredEvent.maxAttendance > 0.8 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full text-red-600 font-medium text-sm mb-6">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Limited Seats Available</span>
                    </div>
                  )}

                  <h3 className="text-3xl font-bold mb-6">{featuredEvent.name}</h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(featuredEvent.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">
                          {featuredEvent.startTime} - {featuredEvent.closeTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">
                          {branchMap[featuredEvent.branchId] || featuredEvent.location}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{featuredEvent.address}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-8">{featuredEvent.description}</p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Register Now
                    </Button>
                    <Link href={`/events/${featuredEvent.id}`}>
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 w-full">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* No Featured Event State - shows for both no events and "No Record found." error */}
            {!featuredEventsLoading && !shouldShowFeaturedError && !featuredEvent && (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Event</h3>
                <p className="text-gray-500">Check back soon for our next featured event!</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-4-6G003aSifHweV8WyppEggse9XDXGwg.png')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Stay Updated with Our Events</h2>
              <p className="text-white/80 text-lg mb-8">
                Subscribe to our newsletter to receive updates about upcoming events, programs, and special
                announcements
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-white focus:border-white py-6"
                />
                <Button className="bg-white text-primary hover:bg-white/90 whitespace-nowrap py-6">
                  Subscribe Now
                </Button>
              </div>

              <p className="text-white/60 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}