"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Play, Search, Share2, Users, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useApi } from "@/hooks/useApi"
import { getLivestreamUrl, getCompletedStreams, getUpcomingStreams } from "@/services/livestream"
import { LivestreamViewModel } from "@/types/livestream"

const isNoRecordsError = (error: string | null) => {
  return error && (
    error.toLowerCase().includes('no record found') ||
    error.toLowerCase().includes('no records found') ||
    error.toLowerCase().includes('not found')
  )
}

// Loading State Component
const LoadingState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
)

// Error State Component
const ErrorState = ({ 
  error, 
  onRetry, 
  title = "Error Loading Content" 
}: { 
  error: string
  onRetry: () => void
  title?: string 
}) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{error}</p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      Try Again
    </button>
  </div>
)

// Empty State Component
const EmptyState = ({ message, icon: Icon }: { message: string, icon: any }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <Icon className="w-12 h-12 text-gray-500 mb-3" />
    <p className="text-gray-400">{message}</p>
  </div>
)

export default function LivestreamPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFallback, setShowFallback] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<LivestreamViewModel | null>(null)

  // Fallback timer to prevent infinite loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true)
    }, 10000) // Show fallback after 10 seconds

    return () => clearTimeout(timer)
  }, [])

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedVideo(null)
      }
    }

    if (selectedVideo) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [selectedVideo])

  // Fetch livestream URL
  const { 
    data: livestreamResponse, 
    loading: livestreamLoading, 
    error: livestreamError, 
    refetch: refetchLivestream 
  } = useApi(() => getLivestreamUrl(), [])

  // Fetch completed streams for Previous Sundays
  const { 
    data: completedStreamsResponse, 
    loading: completedLoading, 
    error: completedError, 
    refetch: refetchCompleted 
  } = useApi(() => getCompletedStreams({
    pageSize: 8,
    pageNumber: 1,
    searchParams: {}
  }), [])

  // Fetch upcoming streams
  const { 
    data: upcomingStreamsResponse, 
    loading: upcomingLoading, 
    error: upcomingError, 
    refetch: refetchUpcoming 
  } = useApi(() => getUpcomingStreams({
    pageSize: 6,
    pageNumber: 1,
    searchParams: {}
  }), [])

  const livestreamData = livestreamResponse?.data?.[0]
  const completedStreams = Array.isArray(completedStreamsResponse?.data) 
    ? completedStreamsResponse.data 
    : []
  const upcomingStreams = Array.isArray(upcomingStreamsResponse?.data) 
    ? upcomingStreamsResponse.data 
    : []

  // Check if all main data is loaded
  const isMainContentLoaded = !livestreamLoading

  // Filter streams based on search term
  const filteredStreams = completedStreams.filter((stream: LivestreamViewModel) =>
    stream.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stream.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Convert YouTube URL to embeddable format
  const getEmbeddableUrl = (url: string) => {
    if (!url) return null
    
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0&rel=0&modestbranding=1`
    }
    
    return url // Return original URL if not YouTube
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16 pt-16">
      {/* Live Stream Section */}
      <div className="relative aspect-video w-full max-h-[80vh] bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        
        {livestreamLoading && !showFallback ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <LoadingState message="Loading livestream..." />
          </div>
        ) : livestreamError && !isNoRecordsError(livestreamError) ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <ErrorState 
              error={livestreamError} 
              onRetry={refetchLivestream}
              title="Unable to Load Livestream"
            />
          </div>
        ) : !livestreamData || isNoRecordsError(livestreamError) ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <EmptyState message="No live stream available at the moment" icon={Play} />
          </div>
        ) : (
          <>
            {getEmbeddableUrl(livestreamData.streamUrl) ? (
              <iframe
                src={getEmbeddableUrl(livestreamData.streamUrl)!}
                title="Live Stream"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
        ) : (
          <>
            <Image
                  src={livestreamData.thumbnailUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
              alt="Live Stream"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                    className="group relative"
                    onClick={() => window.open(livestreamData.streamUrl, '_blank')}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                    </div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Watch Live
                    </div>
              </button>
            </div>
              </>
            )}
          </>
        )}

        {/* Live Stream Info Overlay */}
        {livestreamData && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30">
            <div className="container mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Live Stream Active</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white leading-tight">
                    {livestreamData.title || "Sunday Service"}
                  </h1>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Live Stream</span>
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">Worship</span>
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">Teaching</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {livestreamData.description || "Join us for a powerful time of worship and the Word. Experience the transforming presence of God as we gather together in faith and unity."}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
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
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Watch Live
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-300">Current Viewers</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {livestreamData.currentViewers || livestreamData.viewCount || "0"}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">watching live</p>
                </div>
              </div>
            </div>
          </div>
          )}
      </div>

      {/* Previous Sundays Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Previous Sundays</h2>
            <p className="text-gray-400">Catch up on services you might have missed</p>
          </div>
          <div className="mt-4 md:mt-0 md:w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
                type="text"
                placeholder="Search previous streams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
            </div>
          </div>
        </div>

        {completedLoading ? (
          <LoadingState message="Loading previous streams..." />
        ) : completedError && !isNoRecordsError(completedError) ? (
          <ErrorState 
            error={completedError} 
            onRetry={refetchCompleted}
            title="Unable to Load Previous Streams"
          />
        ) : filteredStreams.length === 0 ? (
          <EmptyState message="No previous streams found" icon={Play} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStreams.map((stream, index) => (
              <Card key={stream.streamId || index} className="bg-gray-800 border-gray-700 overflow-hidden group hover:bg-gray-750 transition-colors">
                  <div className="relative aspect-video">
                    <Image
                    src={stream.thumbnailUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                    alt={stream.title}
                    fill
                    className="object-cover"
                  />
                  {/* Always visible subtle overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  {/* Always visible play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 hover:scale-110 hover:bg-white/40 transition-all"
                      onClick={() => setSelectedVideo(stream)}
                    >
                      <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                    {stream.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {stream.title}
                    </h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {stream.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(stream.streamDate)}</span>
                    <span>{stream.viewCount} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
                      )}
                    </div>

      {/* Upcoming Streams Section */}
      <div className="container mx-auto px-6 py-16 border-t border-gray-800">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Upcoming Streams</h2>
          <p className="text-gray-400">Don't miss our upcoming services and events</p>
        </div>

        {upcomingLoading ? (
          <LoadingState message="Loading upcoming streams..." />
        ) : upcomingError && !isNoRecordsError(upcomingError) ? (
          <ErrorState 
            error={upcomingError} 
            onRetry={refetchUpcoming}
            title="Unable to Load Upcoming Streams"
          />
        ) : upcomingStreams.length === 0 ? (
          <EmptyState message="No upcoming streams scheduled" icon={Play} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingStreams.map((stream, index) => (
              <Card key={stream.streamId || index} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={stream.thumbnailUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                    alt={stream.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
                    UPCOMING
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {stream.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">{formatDate(stream.streamDate)}</span>
                    <span className="text-sm text-primary font-medium">{stream.startTime}</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    Set Reminder
                  </button>
                </CardContent>
              </Card>
              ))}
            </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="aspect-video">
              {getEmbeddableUrl(selectedVideo.streamUrl) ? (
                <iframe
                  src={getEmbeddableUrl(selectedVideo.streamUrl)!}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Video not available for embedding</p>
                    <button
                      onClick={() => window.open(selectedVideo.streamUrl, '_blank')}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Watch on YouTube
                    </button>
              </div>
              </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{formatDate(selectedVideo.streamDate)}</span>
                <span>{selectedVideo.viewCount} views • {selectedVideo.duration}</span>
              </div>
              
              {selectedVideo.description && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Description</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedVideo.description}</p>
              </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}