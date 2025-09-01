"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Video, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  Eye, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Youtube,
  ExternalLink,
  Save
} from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import ProtectedRoute from "@/components/admin/protected-route"
import { toast } from "sonner"
import { useApi } from "@/hooks/useApi"
import {
  getAllAvailableStreams,
  getCompletedStreams,
  getUpcomingStreams,
  deleteStream
} from "@/services/livestream"
import { LivestreamViewModel } from "@/types/livestream"

export default function LivestreamPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedStream, setSelectedStream] = useState<LivestreamViewModel | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  // Stream form state
  const [streamForm, setStreamForm] = useState({
    title: "",
    description: "",
    streamUrl: "",
    streamDate: "",
    startTime: "",
    thumbnailUrl: ""
  })

  // API hooks for data fetching
  const { 
    data: allStreams, 
    loading: loadingAllStreams, 
    error: allStreamsError,
    refetch: refetchAllStreams 
  } = useApi(() => getAllAvailableStreams({ pageSize: 50, pageNumber: 1 }))

  const { 
    data: completedStreams, 
    loading: loadingCompleted, 
    error: completedError,
    refetch: refetchCompleted 
  } = useApi(() => getCompletedStreams({ pageSize: 20, pageNumber: 1 }))

  const { 
    data: upcomingStreams, 
    loading: loadingUpcoming, 
    error: upcomingError,
    refetch: refetchUpcoming 
  } = useApi(() => getUpcomingStreams({ pageSize: 20, pageNumber: 1 }))

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  // Handle stream deletion
  const handleDeleteStream = async (streamId: string) => {
    if (!confirm("Are you sure you want to delete this stream?")) return
    
    try {
      const response = await deleteStream(parseInt(streamId))
      if (response.isSuccessful) {
        toast.success("Stream deleted successfully!")
        refetchAllStreams()
        refetchCompleted()
        refetchUpcoming()
      } else {
        throw new Error(response.responseMessage || "Failed to delete stream")
      }
    } catch (error: any) {
      console.error("Error deleting stream:", error)
      toast.error(error.message || "Failed to delete stream")
    }
  }

  // Handle stream form submission (placeholder for future API)
  const handleStreamSubmit = async () => {
    try {
      if (!streamForm.title.trim()) {
        toast.error("Stream title is required")
        return
      }
      if (!streamForm.streamUrl.trim()) {
        toast.error("Stream URL is required")
        return
      }

      // TODO: Implement create/update stream API call when available
      console.log("Stream form data:", streamForm)
      toast.success("Stream configuration saved locally (API integration pending)")
      
      setIsCreateDialogOpen(false)
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Error saving stream:", error)
      toast.error("Failed to save stream configuration")
    }
  }

  const resetForm = () => {
    setStreamForm({
      title: "",
      description: "",
      streamUrl: "",
      streamDate: "",
      startTime: "",
      thumbnailUrl: ""
    })
    setSelectedStream(null)
  }

  const openEditDialog = (stream: LivestreamViewModel) => {
    setSelectedStream(stream)
    setStreamForm({
      title: stream.title || "",
      description: stream.description || "",
      streamUrl: stream.streamUrl || "",
      streamDate: stream.streamDate ? stream.streamDate.split('T')[0] : "",
      startTime: stream.startTime || "",
      thumbnailUrl: stream.thumbnailUrl || ""
    })
    setIsEditDialogOpen(true)
  }

  // Get stats
  const totalStreams = allStreams?.data?.length || 0
  const liveStreams = allStreams?.data?.filter(s => s.isLive)?.length || 0
  const totalViews = allStreams?.data?.reduce((sum, stream) => sum + (stream.viewCount || 0), 0) || 0
  const avgViews = totalStreams > 0 ? Math.round(totalViews / totalStreams) : 0

  return (
    <ProtectedRoute>
    <AdminLayout>
      <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Livestream Management</h1>
              <p className="text-gray-600 mt-1">Manage your church livestreams and broadcasting</p>
            </div>
          <div className="flex items-center gap-2">
              <Badge variant={liveStreams > 0 ? "default" : "secondary"} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${liveStreams > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                {liveStreams > 0 ? `${liveStreams} LIVE` : "OFFLINE"}
              </Badge>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Schedule Stream</span>
                    <span className="sm:hidden">Add</span>
            </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Schedule New Stream</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Stream Title *</Label>
                        <Input
                          id="title"
                          value={streamForm.title}
                          onChange={(e) => setStreamForm({...streamForm, title: e.target.value})}
                          placeholder="Sunday Morning Service"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="streamUrl">YouTube URL *</Label>
                        <Input
                          id="streamUrl"
                          value={streamForm.streamUrl}
                          onChange={(e) => setStreamForm({...streamForm, streamUrl: e.target.value})}
                          placeholder="https://youtube.com/watch?v=..."
                        />
          </div>
        </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="streamDate">Stream Date</Label>
                        <Input
                          id="streamDate"
                          type="date"
                          value={streamForm.streamDate}
                          onChange={(e) => setStreamForm({...streamForm, streamDate: e.target.value})}
                        />
                </div>
                <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={streamForm.startTime}
                          onChange={(e) => setStreamForm({...streamForm, startTime: e.target.value})}
                        />
                </div>
              </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                  <Textarea
                        id="description"
                        value={streamForm.description}
                        onChange={(e) => setStreamForm({...streamForm, description: e.target.value})}
                        placeholder="Stream description..."
                    rows={3}
                  />
                </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
                      <Input
                        id="thumbnailUrl"
                        value={streamForm.thumbnailUrl}
                        onChange={(e) => setStreamForm({...streamForm, thumbnailUrl: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleStreamSubmit} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Stream
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Error Display */}
          {(allStreamsError || completedError || upcomingError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">
                  Failed to load streams: {allStreamsError || completedError || upcomingError}
                </span>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="manage" className="text-xs sm:text-sm">All Streams</TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs sm:text-sm">Upcoming</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
                    <Video className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{totalStreams}</div>
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
                    <div className="text-2xl font-bold text-green-600">{totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">All streams</p>
          </CardContent>
        </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Views</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{avgViews}</div>
                    <p className="text-xs text-muted-foreground">Per stream</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Streams */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Streams
                  </CardTitle>
              </CardHeader>
                <CardContent>
                  {loadingCompleted ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading recent streams...</span>
                    </div>
                  ) : completedStreams?.data && completedStreams.data.length > 0 ? (
                    <div className="space-y-3">
                      {completedStreams.data.slice(0, 5).map((stream, index) => (
                        <div key={stream.streamId || index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                              {stream.thumbnailUrl ? (
                                <img 
                                  src={stream.thumbnailUrl} 
                                  alt={stream.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                  <Video className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                    </div>
                    <div>
                              <h3 className="font-medium text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                                {stream.title || 'Untitled Stream'}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{stream.viewCount || 0} views</span>
                                <span>•</span>
                                <span>{stream.duration || 'N/A'}</span>
                    </div>
                  </div>
                          </div>
                          <Badge variant={stream.isLive ? "default" : "secondary"}>
                            {stream.isLive ? "Live" : "Ended"}
                          </Badge>
                        </div>
                      ))}
                          </div>
                        ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No recent streams found</p>
                          </div>
                        )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Streams Tab */}
            <TabsContent value="manage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Available Streams</CardTitle>
                  <p className="text-sm text-muted-foreground">Manage all streams in the system</p>
                </CardHeader>
                <CardContent>
                  {loadingAllStreams ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading streams...</span>
                      </div>
                  ) : allStreams?.data && allStreams.data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              URL
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allStreams.data.map((stream) => (
                            <tr key={stream.streamId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {stream.title || 'Untitled Stream'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <a href={stream.streamUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {stream.streamUrl}
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {stream.streamDate ? new Date(stream.streamDate).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Badge variant={stream.isLive ? "default" : "secondary"}>
                                  {stream.isLive ? "Live" : "Ended"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(stream)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteStream(stream.streamId || '')} className="ml-2">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No streams found. Add a new one!</p>
                  </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

            {/* Upcoming Streams Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Streams</CardTitle>
                <p className="text-sm text-muted-foreground">Manage scheduled livestreams</p>
              </CardHeader>
              <CardContent>
                  {loadingUpcoming ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading upcoming streams...</span>
                    </div>
                  ) : upcomingStreams?.data && upcomingStreams.data.length > 0 ? (
                <div className="space-y-4">
                      {upcomingStreams.data.map((stream) => (
                        <div key={stream.streamId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground">
                                {stream.streamDate ? new Date(stream.streamDate).toLocaleDateString() : 'N/A'} at {stream.startTime || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                            <Badge variant="outline">{stream.isLive ? "Live" : "Scheduled"}</Badge>
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(stream)}>
                              <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteStream(stream.streamId || '')} className="ml-2">
                              <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No upcoming streams scheduled. Add one!</p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

            {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingAllStreams ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        totalViews.toLocaleString()
                      )}
                    </div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Peak Viewers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingAllStreams ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        allStreams?.data?.reduce((max, stream) => Math.max(max, stream.peakViewers || 0), 0) || 0
                      )}
                    </div>
                  <p className="text-sm text-muted-foreground">Last Sunday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Stream Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingAllStreams ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        allStreams?.data?.reduce((sum, stream) => sum + (stream.duration || 0), 0) || 0
                      )}
                    </div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Viewer Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <Eye className="h-8 w-8 mx-auto mb-2" />
                    <p>Viewer Analytics Chart</p>
                    <p className="text-sm">Peak times and engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Stream</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Stream Title *</Label>
                    <Input
                      id="edit-title"
                      value={streamForm.title}
                      onChange={(e) => setStreamForm({...streamForm, title: e.target.value})}
                      placeholder="Sunday Morning Service"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-streamUrl">YouTube URL *</Label>
                    <Input
                      id="edit-streamUrl"
                      value={streamForm.streamUrl}
                      onChange={(e) => setStreamForm({...streamForm, streamUrl: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-streamDate">Stream Date</Label>
                    <Input
                      id="edit-streamDate"
                      type="date"
                      value={streamForm.streamDate}
                      onChange={(e) => setStreamForm({...streamForm, streamDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-startTime">Start Time</Label>
                    <Input
                      id="edit-startTime"
                      type="time"
                      value={streamForm.startTime}
                      onChange={(e) => setStreamForm({...streamForm, startTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={streamForm.description}
                    onChange={(e) => setStreamForm({...streamForm, description: e.target.value})}
                    placeholder="Stream description..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-thumbnailUrl">Thumbnail URL (Optional)</Label>
                  <Input
                    id="edit-thumbnailUrl"
                    value={streamForm.thumbnailUrl}
                    onChange={(e) => setStreamForm({...streamForm, thumbnailUrl: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleStreamSubmit} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  )
}
