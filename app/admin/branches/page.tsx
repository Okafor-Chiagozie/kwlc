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
import { MapPin, Plus, Edit, Trash2, Users, Phone, Calendar, Building, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"
import {
  createOrUpdateBranch,
  getAllBranches,
  getBranchDetails,
  deleteBranch,
  createOrUpdateWeeklyActivity,
  getWeeklyActivities,
  deleteWeeklyActivity
} from "@/services/branch"
import {
  CreateOrUpdateBranchRequest,
  GetAllBranchesRequest,
  CreateOrUpdateWeeklyActivityRequest,
  BranchViewModel,
  WeeklyActivityViewModel,
  DayOfWeek,
  TimeOnly,
  WeeklyActivityTypes
} from "@/types/branch"

export default function BranchesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Branches State
  const [branches, setBranches] = useState<BranchViewModel[]>([])
  
  // New Branch Form State
  const [newBranch, setNewBranch] = useState<CreateOrUpdateBranchRequest>({
    id: null,
    name: "",
    stateId: 1,
    lgaId: 1,
    countryId: 1,
    phoneNumber: "",
    email: "",
    address: "",
    location: "",
    welcomeAddress: ""
  })

  // Weekly Activities State
  const [weeklyActivities, setWeeklyActivities] = useState<WeeklyActivityViewModel[]>([])
  const [newWeeklyActivity, setNewWeeklyActivity] = useState<CreateOrUpdateWeeklyActivityRequest>({
    id: null,
    name: "",
    description: "",
    day: DayOfWeek.Sunday,
    startTime: { hour: 9, minute: 0 },
    closeTime: { hour: 12, minute: 0 },
    weeklyActivityTypeId: WeeklyActivityTypes.BibleStudy,
    branchId: 0
  })

  // Edit States
  const [editingBranch, setEditingBranch] = useState<CreateOrUpdateBranchRequest | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    loadBranchesData()
  }, [])

  const loadBranchesData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams: GetAllBranchesRequest = {
        pageSize: 100,
        pageNumber: 1,
        searchParams: {}
      }

      const response = await getAllBranches(searchParams)

      if (response.isSuccessful && response.data) {
        setBranches(response.data)
        console.log('Branches loaded:', response.data)
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to load branches')
      }

    } catch (err: any) {
      console.error('Error loading branches data:', err)
      setError('Failed to load branches information')
      toast.error('Failed to load branches information')
    } finally {
      setIsLoading(false)
    }
  }

  const loadWeeklyActivities = async (branchId: number) => {
    try {
      const response = await getWeeklyActivities(branchId)
      
      if (response.isSuccessful && response.data) {
        setWeeklyActivities(response.data)
        console.log('Weekly activities loaded for branch:', branchId, response.data)
      } else {
        console.error('Failed to load weekly activities:', response)
      }
    } catch (err: any) {
      console.error('Error loading weekly activities:', err)
    }
  }

  const handleCreateBranch = async () => {
    try {
      // Validate required fields
      if (!newBranch.name.trim() || !newBranch.address.trim() || !newBranch.email.trim()) {
        toast.error('Please fill in all required fields (Name, Address, Email)')
        return
      }

      setIsSaving(true)
      const response = await createOrUpdateBranch(newBranch)

      if (response.isSuccessful) {
        toast.success('Branch created successfully!')
        
        // Reset form
        setNewBranch({
          id: null,
          name: "",
          stateId: 1,
          lgaId: 1,
          countryId: 1,
          phoneNumber: "",
          email: "",
          address: "",
          location: "",
          welcomeAddress: ""
        })
        
        // Reload data
        loadBranchesData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to create branch')
      }
    } catch (err: any) {
      console.error('Error creating branch:', err)
      toast.error(err.message || 'Failed to create branch')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateBranch = async () => {
    try {
      if (!editingBranch) return

      setIsSaving(true)
      const response = await createOrUpdateBranch(editingBranch)

      if (response.isSuccessful) {
        toast.success('Branch updated successfully!')
        setIsEditDialogOpen(false)
        setEditingBranch(null)
        loadBranchesData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to update branch')
      }
    } catch (err: any) {
      console.error('Error updating branch:', err)
      toast.error(err.message || 'Failed to update branch')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBranch = async (branchId: number) => {
    try {
      if (!confirm('Are you sure you want to delete this branch?')) return

      const response = await deleteBranch(branchId)

      if (response.isSuccessful) {
        toast.success('Branch deleted successfully!')
        loadBranchesData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to delete branch')
      }
    } catch (err: any) {
      console.error('Error deleting branch:', err)
      toast.error(err.message || 'Failed to delete branch')
    }
  }

  const handleCreateWeeklyActivity = async () => {
    try {
      // Validate required fields
      if (!newWeeklyActivity.name.trim() || !newWeeklyActivity.branchId) {
        toast.error('Please fill in activity name and select a branch')
        return
      }

      setIsSaving(true)
      const response = await createOrUpdateWeeklyActivity(newWeeklyActivity)

      if (response.isSuccessful) {
        toast.success('Weekly activity created successfully!')
        
        // Reset form
        setNewWeeklyActivity({
          id: null,
          name: "",
          description: "",
          day: DayOfWeek.Sunday,
          startTime: { hour: 9, minute: 0 },
          closeTime: { hour: 12, minute: 0 },
          weeklyActivityTypeId: WeeklyActivityTypes.BibleStudy,
          branchId: 0
        })
        
        // Reload activities for the branch
        if (newWeeklyActivity.branchId) {
          loadWeeklyActivities(newWeeklyActivity.branchId)
        }
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to create weekly activity')
      }
    } catch (err: any) {
      console.error('Error creating weekly activity:', err)
      toast.error(err.message || 'Failed to create weekly activity')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteWeeklyActivity = async (branchId: number, activityId: number) => {
    try {
      if (!confirm('Are you sure you want to delete this activity?')) return

      // Note: API uses "imageId" parameter for activityId due to API quirk
      const response = await deleteWeeklyActivity(branchId, activityId)

      if (response.isSuccessful) {
        toast.success('Weekly activity deleted successfully!')
        loadWeeklyActivities(branchId)
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to delete weekly activity')
      }
    } catch (err: any) {
      console.error('Error deleting weekly activity:', err)
      toast.error(err.message || 'Failed to delete weekly activity')
    }
  }

  const startEditBranch = (branch: BranchViewModel) => {
    setEditingBranch({
      id: branch.id,
      name: branch.name,
      stateId: branch.stateId,
      lgaId: branch.lgaId,
      countryId: branch.countryId,
      phoneNumber: branch.phoneNumber,
      email: branch.email,
      address: branch.address,
      location: branch.location,
      welcomeAddress: branch.welcomeAddress
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

  const getDayOfWeekDisplay = (day: DayOfWeek): string => {
    return day
  }

  const getActivityTypeDisplay = (type: WeeklyActivityTypes): string => {
    const typeMap = {
      [WeeklyActivityTypes.BibleStudy]: 'Bible Study',
      [WeeklyActivityTypes.Fellowship]: 'Fellowship'
    }
    return typeMap[type] || type
  }

  // Calculate statistics
  const activeBranchesCount = branches.filter(b => !b.isDeleted).length
  const totalBranches = branches.length

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading branches information...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Branches Management</h1>
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
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <Building className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBranches}</div>
              <p className="text-xs text-muted-foreground">All branches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeBranchesCount}</div>
              <p className="text-xs text-muted-foreground">Operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">States Covered</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {new Set(branches.map(b => b.state)).size}
              </div>
              <p className="text-xs text-muted-foreground">Unique states</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <MapPin className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(branches.map(b => b.country)).size}
              </div>
              <p className="text-xs text-muted-foreground">Countries served</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-branches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-branches">All Branches</TabsTrigger>
            <TabsTrigger value="add-branch">Add Branch</TabsTrigger>
            <TabsTrigger value="activities">Weekly Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="all-branches" className="space-y-6">
            <div className="space-y-6">
              {branches.map((branch) => (
                <Card key={branch.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{branch.name}</h3>
                          <Badge variant={branch.isDeleted ? "secondary" : "default"}>
                            {branch.isDeleted ? "Inactive" : "Active"}
                          </Badge>
                          {branch.dateCreated && (
                            <Badge variant="outline">
                              Est. {new Date(branch.dateCreated).getFullYear()}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{branch.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{branch.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">📧 {branch.email}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {branch.lga}, {branch.state}, {branch.country}
                              </span>
                            </div>
                            {branch.location && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">📍 {branch.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {branch.welcomeAddress && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Welcome Message</h4>
                            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                              {branch.welcomeAddress}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditBranch(branch)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteBranch(branch.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadWeeklyActivities(branch.id)}
                      >
                        View Activities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {branches.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No branches found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="add-branch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Branch</CardTitle>
                <p className="text-sm text-muted-foreground">Create a new church branch location</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="branch-name">Branch Name *</Label>
                      <Input 
                        id="branch-name" 
                        placeholder="e.g., Lagos Main Branch"
                        value={newBranch.name}
                        onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch-address">Full Address *</Label>
                      <Textarea 
                        id="branch-address" 
                        placeholder="Enter complete address" 
                        rows={3}
                        value={newBranch.address}
                        onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch-location">Location</Label>
                      <Input 
                        id="branch-location" 
                        placeholder="e.g., Osapa London"
                        value={newBranch.location}
                        onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch-phone">Phone Number</Label>
                      <Input 
                        id="branch-phone" 
                        placeholder="+234 XXX XXX XXXX"
                        value={newBranch.phoneNumber}
                        onChange={(e) => setNewBranch({ ...newBranch, phoneNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch-email">Email Address *</Label>
                      <Input 
                        id="branch-email" 
                        type="email"
                        placeholder="branch@kwlc.org"
                        value={newBranch.email}
                        onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="state-id">State ID</Label>
                      <Input 
                        id="state-id" 
                        type="number"
                        placeholder="Enter state ID"
                        value={newBranch.stateId}
                        onChange={(e) => setNewBranch({ ...newBranch, stateId: Number(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lga-id">LGA ID</Label>
                      <Input 
                        id="lga-id" 
                        type="number"
                        placeholder="Enter LGA ID"
                        value={newBranch.lgaId}
                        onChange={(e) => setNewBranch({ ...newBranch, lgaId: Number(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country-id">Country ID</Label>
                      <Input 
                        id="country-id" 
                        type="number"
                        placeholder="Enter country ID"
                        value={newBranch.countryId}
                        onChange={(e) => setNewBranch({ ...newBranch, countryId: Number(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="welcome-address">Welcome Message</Label>
                      <Textarea 
                        id="welcome-address" 
                        placeholder="Welcome message for this branch" 
                        rows={4}
                        value={newBranch.welcomeAddress}
                        onChange={(e) => setNewBranch({ ...newBranch, welcomeAddress: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleCreateBranch}
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
                        Create Branch
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {/* Add New Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Add Weekly Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Create a new weekly activity for a branch</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Activity Name *</Label>
                    <Input
                      placeholder="e.g., Sunday Service"
                      value={newWeeklyActivity.name}
                      onChange={(e) => setNewWeeklyActivity({ ...newWeeklyActivity, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Branch *</Label>
                    <Select 
                      value={newWeeklyActivity.branchId?.toString() || undefined}
                      onValueChange={(value) => setNewWeeklyActivity({ ...newWeeklyActivity, branchId: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.filter(b => !b.isDeleted).map(branch => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Day of Week</Label>
                    <Select 
                      value={newWeeklyActivity.day}
                      onValueChange={(value) => setNewWeeklyActivity({ ...newWeeklyActivity, day: value as DayOfWeek })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DayOfWeek).map(day => (
                          <SelectItem key={day} value={day}>{getDayOfWeekDisplay(day)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Activity Type</Label>
                    <Select 
                      value={newWeeklyActivity.weeklyActivityTypeId}
                      onValueChange={(value) => setNewWeeklyActivity({ ...newWeeklyActivity, weeklyActivityTypeId: value as WeeklyActivityTypes })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(WeeklyActivityTypes).map(type => (
                          <SelectItem key={type} value={type}>{getActivityTypeDisplay(type)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={formatTime(newWeeklyActivity.startTime)}
                      onChange={(e) => setNewWeeklyActivity({ ...newWeeklyActivity, startTime: parseTime(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={formatTime(newWeeklyActivity.closeTime)}
                      onChange={(e) => setNewWeeklyActivity({ ...newWeeklyActivity, closeTime: parseTime(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Activity description"
                    value={newWeeklyActivity.description}
                    onChange={(e) => setNewWeeklyActivity({ ...newWeeklyActivity, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateWeeklyActivity} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Activities List */}
            {weeklyActivities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{activity.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getDayOfWeekDisplay(activity.day)} • {formatTime(activity.startTime)} - {formatTime(activity.closeTime)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getActivityTypeDisplay(activity.weeklyActivityTypeId)}
                          </p>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteWeeklyActivity(activity.branchId, activity.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Branch Dialog */}
        {isEditDialogOpen && editingBranch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Branch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Branch Name</Label>
                    <Input
                      value={editingBranch.name}
                      onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editingBranch.email}
                      onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editingBranch.phoneNumber}
                      onChange={(e) => setEditingBranch({ ...editingBranch, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={editingBranch.location}
                      onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>State ID</Label>
                    <Input
                      type="number"
                      value={editingBranch.stateId}
                      onChange={(e) => setEditingBranch({ ...editingBranch, stateId: Number(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <Label>LGA ID</Label>
                    <Input
                      type="number"
                      value={editingBranch.lgaId}
                      onChange={(e) => setEditingBranch({ ...editingBranch, lgaId: Number(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <Label>Country ID</Label>
                    <Input
                      type="number"
                      value={editingBranch.countryId}
                      onChange={(e) => setEditingBranch({ ...editingBranch, countryId: Number(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={editingBranch.address}
                    onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Welcome Message</Label>
                  <Textarea
                    value={editingBranch.welcomeAddress}
                    onChange={(e) => setEditingBranch({ ...editingBranch, welcomeAddress: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateBranch} disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Branch'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditingBranch(null)
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