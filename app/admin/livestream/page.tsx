"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  Play, 
  
  Eye, 
  
  Loader2,
  AlertCircle,
  Clock,
  
} from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import ProtectedRoute from "@/components/admin/protected-route"
import { toast } from "sonner"
import { useApi } from "@/hooks/useApi"
import {
  getCompletedStreams,
  getLivestreamUrl,
  getNormalUploads,
} from "@/services/livestream"
import { LivestreamViewModel } from "@/types/livestream"

export default function LivestreamPage() {
  const [selectedVideo, setSelectedVideo] = useState<LivestreamViewModel | null>(null)
  const [activeTab, setActiveTab] = useState("previous")
  const [pageNumber, setPageNumber] = useState(1)
  const [uploadsPageNumber, setUploadsPageNumber] = useState(1)

  // Live stream URL (for live indicator)
  const {
    data: liveUrls,
    loading: loadingLiveUrl,
    error: liveUrlError,
    refetch: refetchLiveUrl
  } = useApi(() => getLivestreamUrl(), [])

  // Completed streams with pagination (reuse user endpoints)
  const {
    data: completedStreamsResponse,
    loading: loadingCompleted,
    error: completedError,
    refetch: refetchCompleted
  } = useApi(() => getCompletedStreams({ pageSize: 9, pageNumber, searchParams: {} }), [pageNumber])

  const completedStreams = Array.isArray(completedStreamsResponse?.data)
    ? completedStreamsResponse.data
    : []
  const liveStreams = (liveUrls as any)?.data?.liveStreamUrl ? 1 : 0

  // Uploaded videos with pagination
  const {
    data: uploadsResponse,
    loading: uploadsLoading,
    error: uploadsError,
    refetch: refetchUploads
  } = useApi(() => getNormalUploads({ pageSize: 9, pageNumber: uploadsPageNumber, searchParams: {} }), [uploadsPageNumber])
  const uploads = Array.isArray(uploadsResponse?.data) ? uploadsResponse.data : []

  // All-time totals (fetch larger pages to compute counts)
  const {
    data: completedAllResponse,
    loading: loadingCompletedAll,
    error: completedAllError,
  } = useApi(() => getCompletedStreams({ pageSize: 1000, pageNumber: 1, searchParams: {} }), [])

  const {
    data: uploadsAllResponse,
    loading: loadingUploadsAll,
    error: uploadsAllError,
  } = useApi(() => getNormalUploads({ pageSize: 1000, pageNumber: 1, searchParams: {} }), [])

  const completedAll = Array.isArray(completedAllResponse?.data) ? completedAllResponse.data : []
  const uploadsAll = Array.isArray(uploadsAllResponse?.data) ? uploadsAllResponse.data : []
  const totalsLoading = loadingCompletedAll || loadingUploadsAll
  const totalServicesAll = completedAll.length
  const totalUploadsAll = uploadsAll.length
  const totalViewsAll = completedAll.concat(uploadsAll).reduce((s, v) => s + (Number(v.viewCount) || 0), 0)

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getEmbeddableUrl = (url: string) => {
    if (!url) return null
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0&mute=1&rel=0&modestbranding=1`
    }
    return url
  }

  

  return (
    <ProtectedRoute>
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Livestream</h1>
            <p className="text-gray-600 mt-1">Browse previous services and watch recordings</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={liveStreams > 0 ? "default" : "secondary"} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${liveStreams > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
              {liveStreams > 0 ? `LIVE` : "OFFLINE"}
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Video className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalsLoading ? <span className="inline-flex items-center"><Loader2 className="h-4 w-4 animate-spin" /></span> : totalServicesAll}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uploaded Videos</CardTitle>
              <Video className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {totalsLoading ? <span className="inline-flex items-center"><Loader2 className="h-4 w-4 animate-spin" /></span> : totalUploadsAll}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Now</CardTitle>
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{liveStreams}</div>
              <p className="text-xs text-muted-foreground">Active streams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalsLoading ? <span className="inline-flex items-center"><Loader2 className="h-4 w-4 animate-spin" /></span> : totalViewsAll.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="previous" className="text-xs sm:text-sm">Previous Services</TabsTrigger>
            <TabsTrigger value="uploads" className="text-xs sm:text-sm">Uploaded Videos</TabsTrigger>
          </TabsList>

          {/* Previous Services Tab */}
          <TabsContent value="previous" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Previous Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingCompleted ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading streams...</span>
                  </div>
                ) : completedError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{completedError}</span>
                  </div>
                ) : completedStreams.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No previous services found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedStreams.map((stream, index) => (
                      <Card key={stream.streamId || index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedVideo(stream)}>
                        <div className="relative aspect-video">
                          <img
                            src={stream.thumbnailUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                            alt={stream.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg" }}
                          />
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/40 border border-white/40 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                            {stream.duration || 'N/A'}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-2">{stream.title || 'Untitled Stream'}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{stream.description || 'No description available'}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{formatDate(stream.streamDate)}</span>
                            <span>{stream.viewCount || 0} views</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {completedStreams.length > 0 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <Button variant="outline" onClick={() => setPageNumber((p) => Math.max(1, p - 1))} disabled={pageNumber === 1 || loadingCompleted}>Previous</Button>
                    <span className="text-sm text-gray-600">Page {pageNumber}</span>
                    <Button variant="outline" onClick={() => setPageNumber((p) => p + 1)} disabled={loadingCompleted}>Next</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Uploaded Videos Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Videos</CardTitle>
              </CardHeader>
              <CardContent>
                {uploadsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading uploaded videos...</span>
                  </div>
                ) : uploadsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{uploadsError}</span>
                  </div>
                ) : uploads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No uploaded videos found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploads.map((stream, index) => (
                      <Card key={stream.streamId || index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedVideo(stream)}>
                        <div className="relative aspect-video">
                          <img
                            src={stream.thumbnailUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                            alt={stream.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg" }}
                          />
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/40 border border-white/40 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-2">{stream.title || 'Untitled Stream'}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{stream.description || 'No description available'}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{formatDate(stream.streamDate)}</span>
                            <span>{stream.viewCount || 0} views</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {uploads.length > 0 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <Button variant="outline" onClick={() => setUploadsPageNumber((p) => Math.max(1, p - 1))} disabled={uploadsPageNumber === 1 || uploadsLoading}>Previous</Button>
                    <span className="text-sm text-gray-600">Page {uploadsPageNumber}</span>
                    <Button variant="outline" onClick={() => setUploadsPageNumber((p) => p + 1)} disabled={uploadsLoading}>Next</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Video Modal */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
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
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Video not available for embedding</p>
                      <Button onClick={() => window.open(selectedVideo.streamUrl, '_blank')} className="mt-2">Watch on YouTube</Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{formatDate(selectedVideo.streamDate)}</span>
                  <span>{selectedVideo.viewCount} views • {selectedVideo.duration}</span>
                </div>
                {selectedVideo.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedVideo.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
    </ProtectedRoute>
  )
}
