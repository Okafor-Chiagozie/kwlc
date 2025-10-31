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
import { MapPin, Plus, Edit, Trash2, Users, Phone, Calendar, Building, Loader2, Image } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import ProtectedRoute from "@/components/admin/protected-route"
import { toast } from "sonner"
import {
  createOrUpdateBranch,
  getAllBranches,
  getBranchDetails,
  deleteBranch,
  createOrUpdateWeeklyActivity,
  getWeeklyActivities,
  deleteWeeklyActivity,
  createBranchImages,
  getBranchImages
} from "@/services/branch"

import {
  getCountries,
  getStatesByCountry,
  getLGAsByState
} from "@/services/countryStateLGA"
import {
  CreateOrUpdateBranchRequest,
  GetAllBranchesRequest,
  CreateOrUpdateWeeklyActivityRequest,
  BranchViewModel,
  WeeklyActivityViewModel,
  DayOfWeek,
  TimeOnly,
  WeeklyActivityTypes,
  ImageCategory
} from "@/types/branch"
import {
  Country,
  State,
  LGA
} from "@/types/countryStateLGA"

export default function BranchesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Branches State
  const [branches, setBranches] = useState<BranchViewModel[]>([])
  
  // Geographic Data State
  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [lgas, setLgas] = useState<LGA[]>([])
  
  // New Branch Form State
  const [newBranch, setNewBranch] = useState<CreateOrUpdateBranchRequest>({
    id: null,
    name: "",
    countryId: 0,
    stateId: 0,
    lgaId: 0,
    phoneNumber: "",
    email: "",
    address: "",
    location: "",
    welcomeAddress: ""
  })

  // Weekly Activities State
  const [weeklyActivities, setWeeklyActivities] = useState<WeeklyActivityViewModel[]>([])
  const [branchActivitiesMap, setBranchActivitiesMap] = useState<Record<number, WeeklyActivityViewModel[]>>({})
  const [selectedBranchForActivities, setSelectedBranchForActivities] = useState<number | null>(null)
  // Branch Images State
  const [selectedBranchForImages, setSelectedBranchForImages] = useState<number | null>(null)
  const [branchImages, setBranchImages] = useState<any[]>([])
  const [branchImageCategoryId, setBranchImageCategoryId] = useState<ImageCategory>(ImageCategory.CarouselImage)
  const [branchFilesToUpload, setBranchFilesToUpload] = useState<File[]>([])
  const [isUploadingBranchImages, setIsUploadingBranchImages] = useState(false)
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
  const [editingWeeklyActivity, setEditingWeeklyActivity] = useState<CreateOrUpdateWeeklyActivityRequest | null>(null)
  const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = useState(false)

  // Edit States
  const [editingBranch, setEditingBranch] = useState<CreateOrUpdateBranchRequest | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  // Delete States
  const [deleteBranchDialogOpen, setDeleteBranchDialogOpen] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null)
  const [deleteActivityDialogOpen, setDeleteActivityDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null)
  const [activityBranchIdToDelete, setActivityBranchIdToDelete] = useState<number | null>(null)

  const openDeleteActivityDialog = (branchId: number, activityId: number) => {
    setActivityBranchIdToDelete(branchId)
    setActivityToDelete(activityId)
    setDeleteActivityDialogOpen(true)
  }

  // Lock body scroll when any overlay is open
  useEffect(() => {
    const anyOpen = isEditDialogOpen || deleteBranchDialogOpen || deleteActivityDialogOpen || isEditActivityDialogOpen || !!selectedBranchForImages || !!selectedBranchForActivities
    if (anyOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isEditDialogOpen, deleteBranchDialogOpen, deleteActivityDialogOpen, isEditActivityDialogOpen, selectedBranchForImages, selectedBranchForActivities])

  // Load initial data
  useEffect(() => {
    loadBranchesData()
    loadCountries()
  }, [])

  // Load countries on component mount
  const loadCountries = async () => {
    try {
      const response = await getCountries()
      if (response.isSuccessful) {
        setCountries(response.data || [])
      }
    } catch (error) {
      console.error('Error loading countries:', error)
      toast.error('Failed to load countries')
    }
  }

  // Load states when country changes
  const loadStates = async (countryId: number) => {
    try {
      setStates([])
      setLgas([])
      if (countryId) {
        const response = await getStatesByCountry(countryId)
        if (response.isSuccessful) {
          setStates(response.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading states:', error)
      toast.error('Failed to load states')
    }
  }

  // Load LGAs when state changes
  const loadLGAs = async (countryId: number, stateId: number) => {
    try {
      setLgas([])
      if (countryId && stateId) {
        const response = await getLGAsByState({ countryId, stateId })
        if (response.isSuccessful) {
          setLgas(response.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading LGAs:', error)
      toast.error('Failed to load LGAs')
    }
  }

  // Handle country change
  const handleCountryChange = (countryId: number) => {
    setNewBranch({ 
      ...newBranch, 
      countryId, 
      stateId: 0, 
      lgaId: 0 
    })
    loadStates(countryId)
  }

  // Handle state change
  const handleStateChange = (stateId: number) => {
    setNewBranch({ 
      ...newBranch, 
      stateId, 
      lgaId: 0 
    })
    loadLGAs(newBranch.countryId, stateId)
  }

  // Handle LGA change
  const handleLGAChange = (lgaId: number) => {
    setNewBranch({ ...newBranch, lgaId })
  }



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
        const activities = (response.data as WeeklyActivityViewModel[]) || []
        setWeeklyActivities(activities)
        setBranchActivitiesMap(prev => ({ ...prev, [branchId]: activities }))
        console.log('Weekly activities loaded for branch:', branchId, response.data)
      } else {
        console.error('Failed to load weekly activities:', response)
      }
    } catch (err: any) {
      console.error('Error loading weekly activities:', err)
    }
  }
  
  const loadBranchImages = async (branchId: number) => {
    try {
      const response = await getBranchImages(branchId)
      if (response.isSuccessful && response.data) {
        setBranchImages(response.data)
      } else {
        setBranchImages([])
      }
      setSelectedBranchForImages(branchId)
    } catch (err) {
      console.error('Error loading branch images:', err)
      setBranchImages([])
      setSelectedBranchForImages(branchId)
    }
  }

  const handleUploadBranchImages = async () => {
    try {
      if (!selectedBranchForImages || branchFilesToUpload.length === 0) {
        toast.error('Select files to upload')
        return
      }
      setIsUploadingBranchImages(true)
      const payload = {
        branchId: selectedBranchForImages,
        file: branchFilesToUpload,
        categoryId: branchImageCategoryId
      }
      const resp = await createBranchImages(payload)
      if (resp && resp.isSuccessful !== false) {
        toast.success('Branch images uploaded!')
        setBranchFilesToUpload([])
        await loadBranchImages(selectedBranchForImages)
      } else {
        toast.error('Failed to upload branch images')
      }
    } catch (err) {
      console.error('Error uploading branch images:', err)
      toast.error('Failed to upload branch images')
    } finally {
      setIsUploadingBranchImages(false)
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
          countryId: 0,
          stateId: 0,
          lgaId: 0,
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


      const response = await deleteBranch(branchId)

      if (response.isSuccessful) {
        toast.success('Branch deleted successfully!')
        setDeleteBranchDialogOpen(false)
        setBranchToDelete(null)
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

  const openDeleteBranchDialog = (branchId: number) => {
    setBranchToDelete(branchId)
    setDeleteBranchDialogOpen(true)
  }

  const handleCreateWeeklyActivity = async () => {
    try {
      // Validate required fields
      if (!newWeeklyActivity.name.trim() || !newWeeklyActivity.branchId) {
        toast.error('Please fill in activity name and select a branch')
        return
      }

      setIsSaving(true)
      const payload = {
        ...newWeeklyActivity,
        startTime: formatTimeOnlyToHMS(newWeeklyActivity.startTime),
        closeTime: formatTimeOnlyToHMS(newWeeklyActivity.closeTime)
      }
      const response = await createOrUpdateWeeklyActivity(payload)

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

  const formatTime = (time: TimeOnly | string): string => {
    if (typeof time === 'string') {
      // Expecting HH:mm:ss or HH:mm
      return time.slice(0, 5)
    }
    const hour = time.hour.toString().padStart(2, '0')
    const minute = time.minute.toString().padStart(2, '0')
    return `${hour}:${minute}`
  }

  const parseTime = (timeString: string): TimeOnly => {
    const [hour, minute] = timeString.split(':').map(Number)
    return { hour: hour || 0, minute: minute || 0 }
  }

  // Format TimeOnly to HH:mm:ss for API payload
  const formatTimeOnlyToHMS = (time: TimeOnly | string): string => {
    if (typeof time === 'string') return time
    const hh = String(time.hour).padStart(2, '0')
    const mm = String(time.minute).padStart(2, '0')
    const ss = '00'
    return `${hh}:${mm}:${ss}`
  }

  const startEditWeeklyActivity = (activity: WeeklyActivityViewModel) => {
    setEditingWeeklyActivity({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      day: activity.day,
      startTime: activity.startTime,
      closeTime: activity.closeTime,
      weeklyActivityTypeId: activity.weeklyActivityTypeId,
      branchId: activity.branchId
    })
    setIsEditActivityDialogOpen(true)
  }

  const handleUpdateWeeklyActivity = async () => {
    try {
      if (!editingWeeklyActivity) return

      setIsSaving(true)
      const payload: CreateOrUpdateWeeklyActivityRequest = {
        ...editingWeeklyActivity,
        startTime: formatTimeOnlyToHMS(editingWeeklyActivity.startTime),
        closeTime: formatTimeOnlyToHMS(editingWeeklyActivity.closeTime)
      }

      const response = await createOrUpdateWeeklyActivity(payload)

      if (response.isSuccessful) {
        toast.success('Weekly activity updated successfully!')
        const branchId = editingWeeklyActivity.branchId
        setIsEditActivityDialogOpen(false)
        setEditingWeeklyActivity(null)
        if (branchId) {
          loadWeeklyActivities(branchId)
        }
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to update weekly activity')
      }
    } catch (err: any) {
      console.error('Error updating weekly activity:', err)
      toast.error(err.message || 'Failed to update weekly activity')
    } finally {
      setIsSaving(false)
    }
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
      <ProtectedRoute>
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading branches information...</span>
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
          <h1 className="text-xl sm:text-2xl font-bold">Branches Management</h1>
          <Button 
            onClick={loadBranchesData} 
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Building className="h-4 w-4 mr-2" />
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
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
            <TabsTrigger value="all-branches" className="text-xs sm:text-sm">All Branches</TabsTrigger>
            <TabsTrigger value="add-branch" className="text-xs sm:text-sm">Add Branch</TabsTrigger>
            <TabsTrigger value="activities" className="text-xs sm:text-sm">Weekly Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="all-branches" className="space-y-6">
            <div className="space-y-6">
              {branches.map((branch) => (
                <Card key={branch.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-4 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold truncate">{branch.name}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant={branch.isDeleted ? "destructive" : "default"}>
                            {branch.isDeleted ? "Inactive" : "Active"}
                          </Badge>
                          {branch.dateCreated && (
                            <Badge variant="outline">
                              Est. {new Date(branch.dateCreated).getFullYear()}
                            </Badge>
                          )}
                        </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-muted-foreground truncate">{branch.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{branch.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground truncate">📧 {branch.email}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground truncate">
                                {branch.lga}, {branch.state}, {branch.country}
                              </span>
                            </div>
                            {branch.location && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground truncate">📍 {branch.location}</span>
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
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditBranch(branch)}
                          className="w-full sm:w-auto"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => loadBranchImages(branch.id)}
                          className="w-full sm:w-auto"
                        >
                          <Image className="h-3 w-3 mr-1" />
                          Images
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                          onClick={() => openDeleteBranchDialog(branch.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={async () => { setSelectedBranchForActivities(branch.id); await loadWeeklyActivities(branch.id); }}
                        className="w-full sm:w-auto"
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
                      <Label htmlFor="branch-location">Google Location</Label>
                      <Input 
                        id="branch-location" 
                        placeholder="Paste Google Maps link"
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
                      <Label htmlFor="country">Country *</Label>
                      <Select 
                        value={newBranch.countryId ? newBranch.countryId.toString() : ""} 
                        onValueChange={(value) => handleCountryChange(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={newBranch.stateId ? newBranch.stateId.toString() : ""} 
                        onValueChange={(value) => handleStateChange(Number(value))}
                        disabled={!newBranch.countryId || states.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={states.length === 0 ? "Select country first" : "Select state"} />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map(state => (
                            <SelectItem key={state.id} value={state.id.toString()}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="lga">Local Government Area *</Label>
                      <Select 
                        value={newBranch.lgaId ? newBranch.lgaId.toString() : ""} 
                        onValueChange={(value) => handleLGAChange(Number(value))}
                        disabled={!newBranch.stateId || lgas.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={lgas.length === 0 ? "Select state first" : "Select LGA"} />
                        </SelectTrigger>
                        <SelectContent>
                          {lgas.map(lga => (
                            <SelectItem key={lga.id} value={lga.id.toString()}>
                              {lga.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

            {/* Weekly Activities grouped by Branch */}
              <Card>
                <CardHeader>
                <CardTitle>Weekly Activities by Branch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                  {branches.filter(b => !b.isDeleted).map((branch) => (
                    <div key={branch.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{branch.name}</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => loadWeeklyActivities(branch.id)}>Load Activities</Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {(branchActivitiesMap[branch.id] || []).length > 0 ? (
                          branchActivitiesMap[branch.id].map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                                <div className="font-medium">{activity.name}</div>
                                <div className="text-xs text-muted-foreground">{getDayOfWeekDisplay(activity.day)} • {formatTime(activity.startTime)} - {formatTime(activity.closeTime)} • {getActivityTypeDisplay(activity.weeklyActivityTypeId)}</div>
                                {activity.description && <div className="text-xs text-muted-foreground mt-1">{activity.description}</div>}
                        </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEditWeeklyActivity(activity)}>
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteActivityDialog(activity.branchId, activity.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">No activities loaded for this branch.</div>
                        )}
                      </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Branch Dialog */}
        {isEditDialogOpen && editingBranch && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0" onClick={() => { setIsEditDialogOpen(false); setEditingBranch(null) }}>
            <Card className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                    <Label>Google Location</Label>
                    <Input
                      placeholder="Paste Google Maps link"
                      value={editingBranch.location}
                      onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Select 
                      value={editingBranch.countryId ? editingBranch.countryId.toString() : ""}
                      onValueChange={async (value) => {
                        const cid = Number(value)
                        setEditingBranch({ ...editingBranch, countryId: cid, stateId: 0, lgaId: 0 })
                        await loadStates(cid)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>State</Label>
                    <Select 
                      value={editingBranch.stateId ? editingBranch.stateId.toString() : ""}
                      onValueChange={async (value) => {
                        const sid = Number(value)
                        setEditingBranch({ ...editingBranch, stateId: sid, lgaId: 0 })
                        await loadLGAs(editingBranch.countryId, sid)
                      }}
                      disabled={!editingBranch.countryId || states.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={states.length === 0 ? "Select country first" : "Select state"} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Local Government Area</Label>
                    <Select 
                      value={editingBranch.lgaId ? editingBranch.lgaId.toString() : ""}
                      onValueChange={(value) => setEditingBranch({ ...editingBranch, lgaId: Number(value) })}
                      disabled={!editingBranch.stateId || lgas.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={lgas.length === 0 ? "Select state first" : "Select LGA"} />
                      </SelectTrigger>
                      <SelectContent>
                        {lgas.map(lga => (
                          <SelectItem key={lga.id} value={lga.id.toString()}>
                            {lga.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

        {/* Delete Branch Confirmation Modal */}
        {deleteBranchDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 !mt-0" onClick={() => { setDeleteBranchDialogOpen(false); setBranchToDelete(null) }}>
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="text-red-600">Delete Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Are you sure you want to delete this branch? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteBranchDialogOpen(false)
                      setBranchToDelete(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (branchToDelete) {
                        handleDeleteBranch(branchToDelete)
                      }
                    }}
                  >
                    Delete Branch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Activity Confirmation Modal */}
        {deleteActivityDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 !mt-0" onClick={() => { setDeleteActivityDialogOpen(false); setActivityToDelete(null); setActivityBranchIdToDelete(null) }}>
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="text-red-600">Delete Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Are you sure you want to delete this weekly activity? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteActivityDialogOpen(false)
                      setActivityToDelete(null)
                      setActivityBranchIdToDelete(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (activityToDelete && activityBranchIdToDelete) {
                        await handleDeleteWeeklyActivity(activityBranchIdToDelete, activityToDelete)
                        setDeleteActivityDialogOpen(false)
                        setActivityToDelete(null)
                        setActivityBranchIdToDelete(null)
                      }
                    }}
                  >
                    Delete Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Weekly Activity Dialog */}
        {isEditActivityDialogOpen && editingWeeklyActivity && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0" onClick={() => { setIsEditActivityDialogOpen(false); setEditingWeeklyActivity(null) }}>
            <Card className="w-full max-w-xl max-h-[calc(100vh-2rem)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Edit Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Activity Name</Label>
                    <Input
                      value={editingWeeklyActivity.name}
                      onChange={(e) => setEditingWeeklyActivity({ ...editingWeeklyActivity, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Branch</Label>
                    <Select 
                      value={editingWeeklyActivity.branchId?.toString() || undefined}
                      onValueChange={(value) => setEditingWeeklyActivity({ ...editingWeeklyActivity, branchId: Number(value) })}
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
                      value={editingWeeklyActivity.day}
                      onValueChange={(value) => setEditingWeeklyActivity({ ...editingWeeklyActivity, day: value as DayOfWeek })}
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
                      value={editingWeeklyActivity.weeklyActivityTypeId}
                      onValueChange={(value) => setEditingWeeklyActivity({ ...editingWeeklyActivity, weeklyActivityTypeId: value as WeeklyActivityTypes })}
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
                      value={formatTime(editingWeeklyActivity.startTime)}
                      onChange={(e) => setEditingWeeklyActivity({ ...editingWeeklyActivity, startTime: parseTime(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={formatTime(editingWeeklyActivity.closeTime)}
                      onChange={(e) => setEditingWeeklyActivity({ ...editingWeeklyActivity, closeTime: parseTime(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingWeeklyActivity.description}
                    onChange={(e) => setEditingWeeklyActivity({ ...editingWeeklyActivity, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleUpdateWeeklyActivity} disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Activity'
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => { setIsEditActivityDialogOpen(false); setEditingWeeklyActivity(null) }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Branch Images Modal */}
        {selectedBranchForImages && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0" onClick={() => { setSelectedBranchForImages(null); setBranchImages([]); setBranchFilesToUpload([]) }}>
            <Card className="w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Branch Images</CardTitle>
                <p className="text-sm text-muted-foreground">Images for {branches.find(b => b.id === selectedBranchForImages)?.name || `Branch #${selectedBranchForImages}`}</p>
                <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={branchImageCategoryId} onValueChange={(v) => setBranchImageCategoryId(v as ImageCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ImageCategory.CarouselImage}>Carousel</SelectItem>
                        <SelectItem value={ImageCategory.GalleryImages}>Gallery</SelectItem>
                        <SelectItem value={ImageCategory.PreviewImage}>Preview</SelectItem>
                        <SelectItem value={ImageCategory.ThumbnailImage}>Thumbnail</SelectItem>
                        <SelectItem value={ImageCategory.Headshots}>Headshots</SelectItem>
                        <SelectItem value={ImageCategory.TicketImage}>Ticket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Files</Label>
                    <Input type="file" multiple onChange={(e) => setBranchFilesToUpload(Array.from(e.target.files || []))} />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleUploadBranchImages} disabled={isUploadingBranchImages || branchFilesToUpload.length === 0} className="w-full">
                      {isUploadingBranchImages ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</>) : 'Upload'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {branchImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branchImages.map((img, idx) => (
                      <div key={img.id || idx} className="relative">
                        <img src={img.imageUrl || "/placeholder.svg"} alt={img.imageName || 'Branch image'} className="w-full h-48 object-cover rounded-lg" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black/75 text-white p-2 rounded text-sm">
                            <p className="font-medium truncate">{img.imageName}</p>
                            <p className="text-xs opacity-75">{img.imageCategoryId}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No images yet. Upload to get started.</div>
                )}
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => { setSelectedBranchForImages(null); setBranchImages([]); setBranchFilesToUpload([]) }}>Close</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Branch Activities Modal */}
        {selectedBranchForActivities && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0" onClick={() => setSelectedBranchForActivities(null)}>
            <Card className="w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Weekly Activities</CardTitle>
                <p className="text-sm text-muted-foreground">{branches.find(b => b.id === selectedBranchForActivities)?.name || `Branch #${selectedBranchForActivities}`}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(branchActivitiesMap[selectedBranchForActivities] || []).length > 0 ? (
                    branchActivitiesMap[selectedBranchForActivities].map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{activity.name}</div>
                          <div className="text-xs text-muted-foreground">{getDayOfWeekDisplay(activity.day)} • {formatTime(activity.startTime)} - {formatTime(activity.closeTime)} • {getActivityTypeDisplay(activity.weeklyActivityTypeId)}</div>
                          {activity.description && <div className="text-xs text-muted-foreground mt-1">{activity.description}</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteActivityDialog(activity.branchId, activity.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No activities found.</div>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setSelectedBranchForActivities(null)}>Close</Button>
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