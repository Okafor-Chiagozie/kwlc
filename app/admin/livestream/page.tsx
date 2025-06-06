"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Play, Pause, Settings, Users, Eye, Calendar, Plus } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

export default function LivestreamPage() {
  const [isLive, setIsLive] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")
  const [streamUrl, setStreamUrl] = useState("")

  const upcomingStreams = [
    {
      id: 1,
      title: "Sunday Morning Service",
      date: "2024-04-07",
      time: "09:00 AM",
      status: "scheduled",
    },
    {
      id: 2,
      title: "Wednesday Bible Study",
      date: "2024-04-10",
      time: "07:00 PM",
      status: "scheduled",
    },
    {
      id: 3,
      title: "Youth Service",
      date: "2024-04-12",
      time: "06:00 PM",
      status: "scheduled",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Livestream Management</h1>
          <div className="flex items-center gap-2">
            <Badge variant={isLive ? "default" : "secondary"}>{isLive ? "LIVE" : "OFFLINE"}</Badge>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Stream
            </Button>
          </div>
        </div>

        {/* Live Stream Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Current Stream Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="live-toggle">Go Live</Label>
                  <Switch id="live-toggle" checked={isLive} onCheckedChange={setIsLive} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Viewers:</span>
                    <span className="font-semibold">{isLive ? "1,234" : "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="font-semibold">{isLive ? "45:32" : "00:00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Quality:</span>
                    <span className="font-semibold">1080p</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="stream-title">Stream Title</Label>
                  <Input
                    id="stream-title"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="Enter stream title"
                  />
                </div>
                <div>
                  <Label htmlFor="stream-description">Description</Label>
                  <Textarea
                    id="stream-description"
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    placeholder="Enter stream description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList>
            <TabsTrigger value="manage">Manage Streams</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stream Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stream-url">Stream URL/Key</Label>
                      <Input
                        id="stream-url"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        placeholder="rtmp://live.youtube.com/live2/..."
                        type="password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backup-url">Backup Stream URL</Label>
                      <Input id="backup-url" placeholder="Backup stream URL" />
                    </div>
                    <div>
                      <Label htmlFor="chat-moderation">Chat Moderation</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="chat-moderation" />
                        <span className="text-sm">Enable chat moderation</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Stream Preview</Label>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        {isLive ? (
                          <div className="text-center">
                            <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-muted-foreground">Live Stream Active</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Pause className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-muted-foreground">Stream Offline</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Settings
                  </Button>
                  <Button variant="outline">Test Stream</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Streams</CardTitle>
                <p className="text-sm text-muted-foreground">Manage scheduled livestreams</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingStreams.map((stream) => (
                    <div key={stream.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {stream.date} at {stream.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{stream.status}</Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stream Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Video Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Resolution</Label>
                        <Input defaultValue="1920x1080" />
                      </div>
                      <div>
                        <Label>Frame Rate</Label>
                        <Input defaultValue="30 fps" />
                      </div>
                      <div>
                        <Label>Bitrate</Label>
                        <Input defaultValue="4500 kbps" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Audio Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Audio Quality</Label>
                        <Input defaultValue="128 kbps" />
                      </div>
                      <div>
                        <Label>Sample Rate</Label>
                        <Input defaultValue="44.1 kHz" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="audio-monitoring" />
                        <Label htmlFor="audio-monitoring">Enable audio monitoring</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                  <div className="text-2xl font-bold">45,678</div>
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
                  <div className="text-2xl font-bold">2,345</div>
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
                  <div className="text-2xl font-bold">156</div>
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
      </div>
    </AdminLayout>
  )
}
