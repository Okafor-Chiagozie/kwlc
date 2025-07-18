"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Church, MapPin, Clock, Users, Calendar, Save, Edit, Plus, Trash2, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"
import { 
  getHomePage,
  createOrUpdateChurchDetails, 
  createOrUpdateServiceScheduleDetails,
  getAllServiceSchedules,
  createOrUpdateChurchdayDetails,
  getAllChurchdays,
  deleteServiceSchedule,
  deleteChurchDay
} from "@/services/homepage"
import { getAllBranches } from "@/services/branch"
import { 
  CreateOrUpdateChurchDetailsRequest,
  CreateOrUpdateServiceScheduleDetailsRequest,
  CreateOrUpdateChurchdayDetailsRequest,
  AddChurchdayViewModel
} from "@/types/homepage"
import { DayOfWeek, TimeOnly } from "@/types/branch"

export default function ChurchInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Church Information State - Load from API
  const [churchInfo, setChurchInfo] = useState<CreateOrUpdateChurchDetailsRequest>({
    id: null,
    name: "",
    email: "",
    address: "",
    location: "",
    phoneNumber: "",
    welcomeAddress: ""
  })

  // Service Schedule State
  const [serviceSchedules, setServiceSchedules] = useState<any[]>([])
  const [newServiceSchedule, setNewServiceSchedule] = useState({
    name: "",
    churchDays: [] as AddChurchdayViewModel[]
  })

  // Church Days State
  const [churchDays, setChurchDays] = useState<AddChurchdayViewModel[]>([])
  const [newChurchDay, setNewChurchDay] = useState<AddChurchdayViewModel>({
    id: null,
    day: DayOfWeek.Sunday,
    startTime: { hour: 9, minute: 0 },
    closeTime: { hour: 12, minute: 0 }
  })

  // Branches State
  const [branches, setBranches] = useState<any[]>([])

  // Load initial data
  useEffect(() => {
    loadChurchData()
  }, [])

  const loadChurchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load all data in parallel - including homepage data
      const [homePageData, branchesData, serviceSchedulesData, churchDaysData] = await Promise.allSettled([
        getHomePage(),
        getAllBranches({ pageSize: 100, pageNumber: 1 }),
        getAllServiceSchedules(),
        getAllChurchdays()
      ])

      // Handle homepage data - this should contain church information
      if (homePageData.status === 'fulfilled' && homePageData.value.isSuccessful) {
        const homeData = homePageData.value.data
        console.log('Homepage data:', homeData)
        console.log('Homepage data type:', typeof homeData)
        console.log('Homepage data is array:', Array.isArray(homeData))
        
        // The API seems to return church data directly in the response
        if (homeData) {
          // If it's an array, take the first item
          const churchData = Array.isArray(homeData) ? homeData[0] : homeData
          
          if (churchData && typeof churchData === 'object') {
            console.log('Setting church data:', churchData)
            setChurchInfo({
              id: churchData.id || null,
              name: churchData.name || "",
              email: churchData.email || "",
              address: churchData.address || "",
              location: churchData.location || "",
              phoneNumber: churchData.phoneNumber || "",
              welcomeAddress: churchData.welcomeAddress || ""
            })
          }
        }
      } else {
        console.error('Failed to load homepage data:', homePageData)
      }

      // Handle branches data
      if (branchesData.status === 'fulfilled' && branchesData.value.isSuccessful) {
        setBranches(branchesData.value.data || [])
        console.log('Branches loaded:', branchesData.value.data)
      } else {
        console.error('Failed to load branches:', branchesData)
      }

      // Handle service schedules
      if (serviceSchedulesData.status === 'fulfilled' && serviceSchedulesData.value.isSuccessful) {
        setServiceSchedules(serviceSchedulesData.value.data || [])
        console.log('Service schedules loaded:', serviceSchedulesData.value.data)
      } else {
        console.error('Failed to load service schedules:', serviceSchedulesData)
      }

      // Handle church days
      if (churchDaysData.status === 'fulfilled' && churchDaysData.value.isSuccessful) {
        setChurchDays(churchDaysData.value.data || [])
        console.log('Church days loaded:', churchDaysData.value.data)
      } else {
        console.error('Failed to load church days:', churchDaysData)
      }

    } catch (err: any) {
      console.error('Error loading church data:', err)
      setError('Failed to load church information')
      toast.error('Failed to load church information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChurchInfo = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const response = await createOrUpdateChurchDetails(churchInfo)

      if (response.isSuccessful) {
        toast.success("Church information updated successfully!")
        setIsEditing(false)
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to update church information')
      }
    } catch (err: any) {
      console.error('Error saving church info:', err)
      setError(err.message || 'Failed to save church information')
      toast.error(err.message || 'Failed to save church information')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddServiceSchedule = async () => {
    try {
      if (!newServiceSchedule.name.trim()) {
        toast.error("Please enter a service name")
        return
      }

      setIsSaving(true)
      const response = await createOrUpdateServiceScheduleDetails(newServiceSchedule)

      if (response.isSuccessful) {
        toast.success("Service schedule added successfully!")
        setNewServiceSchedule({ name: "", churchDays: [] })
        loadChurchData() // Reload data
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to add service schedule')
      }
    } catch (err: any) {
      console.error('Error adding service schedule:', err)
      toast.error(err.message || 'Failed to add service schedule')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddChurchDay = async () => {
    try {
      setIsSaving(true)
      const response = await createOrUpdateChurchdayDetails([newChurchDay])

      if (response.isSuccessful) {
        toast.success("Church day added successfully!")
        setNewChurchDay({
          id: null,
          day: DayOfWeek.Sunday,
          startTime: { hour: 9, minute: 0 },
          closeTime: { hour: 12, minute: 0 }
        })
        loadChurchData() // Reload data
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to add church day')
      }
    } catch (err: any) {
      console.error('Error adding church day:', err)
      toast.error(err.message || 'Failed to add church day')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteServiceSchedule = async (id: number) => {
    try {
      const response = await deleteServiceSchedule(id)
      if (response.isSuccessful) {
        toast.success("Service schedule deleted successfully!")
        loadChurchData()
      } else {
        throw new Error(response.responseMessage || 'Failed to delete service schedule')
      }
    } catch (err: any) {
      console.error('Error deleting service schedule:', err)
      toast.error(err.message || 'Failed to delete service schedule')
    }
  }

  const handleDeleteChurchDay = async (id: number) => {
    try {
      const response = await deleteChurchDay(id)
      if (response.isSuccessful) {
        toast.success("Church day deleted successfully!")
        loadChurchData()
      } else {
        throw new Error(response.responseMessage || 'Failed to delete church day')
      }
    } catch (err: any) {
      console.error('Error deleting church day:', err)
      toast.error(err.message || 'Failed to delete church day')
    }
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading church information...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Church Information</h1>
          <Button 
            onClick={isEditing ? handleSaveChurchInfo : () => setIsEditing(!isEditing)}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isEditing ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Info"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="schedule">Service Schedule</TabsTrigger>
            <TabsTrigger value="church-days">Church Days</TabsTrigger>
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
                      placeholder="Enter church name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={churchInfo.location}
                      onChange={(e) => setChurchInfo({ ...churchInfo, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter church location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="welcomeAddress">Welcome Address</Label>
                    <Textarea
                      id="welcomeAddress"
                      value={churchInfo.welcomeAddress}
                      onChange={(e) => setChurchInfo({ ...churchInfo, welcomeAddress: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter welcome message"
                      rows={3}
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
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={churchInfo.phoneNumber}
                      onChange={(e) => setChurchInfo({ ...churchInfo, phoneNumber: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={churchInfo.email}
                      onChange={(e) => setChurchInfo({ ...churchInfo, email: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter email address"
                      type="email"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={handleSaveChurchInfo} 
                  disabled={isSaving}
                  className="mr-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Service Schedule */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3">Add New Service Schedule</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Service name (e.g., First Service)"
                        value={newServiceSchedule.name}
                        onChange={(e) => setNewServiceSchedule({
                          ...newServiceSchedule,
                          name: e.target.value
                        })}
                      />
                      <Button 
                        onClick={handleAddServiceSchedule}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Service Schedules */}
                  {serviceSchedules.length > 0 ? (
                    serviceSchedules.map((schedule, index) => (
                      <div key={schedule.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{schedule.name || schedule.eventName || `Service ${index + 1}`}</h3>
                          <p className="text-sm text-muted-foreground">
                            {schedule.email || 'No additional details'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => schedule.id && handleDeleteServiceSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No service schedules found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="church-days" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Church Days
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Church Day */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3">Add New Church Day</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <select
                        value={newChurchDay.day}
                        onChange={(e) => setNewChurchDay({
                          ...newChurchDay,
                          day: e.target.value as DayOfWeek
                        })}
                        className="px-3 py-2 border rounded-md"
                      >
                        {Object.values(DayOfWeek).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <Input
                        type="time"
                        value={formatTime(newChurchDay.startTime)}
                        onChange={(e) => setNewChurchDay({
                          ...newChurchDay,
                          startTime: parseTime(e.target.value)
                        })}
                      />
                      <Input
                        type="time"
                        value={formatTime(newChurchDay.closeTime)}
                        onChange={(e) => setNewChurchDay({
                          ...newChurchDay,
                          closeTime: parseTime(e.target.value)
                        })}
                      />
                      <Button 
                        onClick={handleAddChurchDay}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Church Days */}
                  {churchDays.length > 0 ? (
                    churchDays.map((day, index) => (
                      <div key={day.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{day.day}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(day.startTime)} - {formatTime(day.closeTime)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => day.id && handleDeleteChurchDay(day.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No church days found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Church className="h-5 w-5" />
                  Church Branches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {branches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {branches.map((branch, index) => (
                      <div key={branch.id || index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{branch.name}</h3>
                          <Badge variant={branch.isDeleted ? "secondary" : "default"}>
                            {branch.isDeleted ? "Inactive" : "Active"}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {branch.address}
                          </p>
                          <p>{branch.email}</p>
                          <p>{branch.phoneNumber}</p>
                          <p className="text-xs">
                            {branch.state}, {branch.country}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No branches found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                  <Church className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {branches.filter(b => !b.isDeleted).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Active branches</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Service Schedules</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{serviceSchedules.length}</div>
                  <p className="text-xs text-muted-foreground">Configured schedules</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Church Days</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{churchDays.length}</div>
                  <p className="text-xs text-muted-foreground">Days configured</p>
                </CardContent>
              </Card>
            </div>

            {/* 
            COMMENTED OUT: Mission & Vision section - No API endpoints found for these
            
            <Card>
              <CardHeader>
                <CardTitle>Mission & Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value="Preaching the word, teaching the principles of the kingdom and demonstrating the power of the kingdom."
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    value="To raise a generation of kingdom minded believers who will impact their world for Christ."
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            */}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}