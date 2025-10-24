"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Church, 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Save, 
  Edit, 
  Plus, 
  Trash2, 
  Loader2,
  Upload,
  Image as ImageIcon,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import ProtectedRoute from "@/components/admin/protected-route"
import { toast } from "sonner"
import { 
  getHomePage,
  createOrUpdateChurchDetails, 
  createOrUpdateServiceScheduleDetails,
  getAllServiceSchedules,
  createOrUpdateChurchdayDetails,
  getAllChurchdays,
  deleteServiceSchedule,
  deleteChurchDay,
  getChurchImages,
  createChurchImage,
  deleteChurchImage
} from "@/services/homepage"
import { getAllBranches } from "@/services/branch"
import { 
  CreateOrUpdateChurchDetailsRequest,
  CreateOrUpdateServiceScheduleDetailsRequest,
  CreateOrUpdateChurchdayDetailsRequest,
  AddChurchdayViewModel,
  ChurchImageCategory
} from "@/types/homepage"
import { DayOfWeek, TimeOnly } from "@/types/branch"

export default function ChurchInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  // Church Information State
  const [churchInfo, setChurchInfo] = useState<CreateOrUpdateChurchDetailsRequest>({
    id: null,
    name: "",
    email: "",
    address: "",
    location: "",
    phoneNumber: "",
    welcomeAddress: ""
  })

  // Social Media State
  const [socialMedia, setSocialMedia] = useState({
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: ""
  })

  // Track if church info has been loaded/set before
  const [hasChurchInfo, setHasChurchInfo] = useState(false)

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

  // Images State
  const [churchImages, setChurchImages] = useState<any>({})
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [deletingImageIds, setDeletingImageIds] = useState<number[]>([])
  const [selectedImageCategory, setSelectedImageCategory] = useState<ChurchImageCategory>(ChurchImageCategory.CarouselImage)

  const categoryLabels: Record<number, string> = {
    [ChurchImageCategory.CarouselImage]: 'Carousel Images',
    [ChurchImageCategory.FellowshipImage]: 'Fellowship Image',
    [ChurchImageCategory.BibleStudyImage]: 'Bible Study Image',
    [ChurchImageCategory.CommunityImage]: 'Community Image',
    [ChurchImageCategory.ChurchEventImage]: 'Church Event Image',
    [ChurchImageCategory.ChurchServiceImage]: 'Church Service Image',
    [ChurchImageCategory.ChurchWeddingImage]: 'Church Wedding Image',
    [ChurchImageCategory.ChurchLiveStreamImage]: 'Church Livestream Image'
  }

  // Load initial data
  useEffect(() => {
    console.log('useEffect triggered - calling loadChurchData')
    loadChurchData()
  }, [])

  const loadChurchData = async () => {
    try {
      console.log('loadChurchData started')
      setIsLoading(true)
      setError(null)

      // Load all data in parallel
      const [homePageData, branchesData, serviceSchedulesData, churchDaysData, imagesData] = await Promise.allSettled([
        getHomePage(),
        getAllBranches({ pageSize: 100, pageNumber: 1 }),
        getAllServiceSchedules(),
        getAllChurchdays(),
        getChurchImages()
      ])

      // Handle homepage data
      if (homePageData.status === 'fulfilled' && homePageData.value.isSuccessful) {
        const homeData = homePageData.value.data
        console.log('Homepage data:', homeData)
        
        if (homeData) {
          const churchData = Array.isArray(homeData) ? homeData[0] : homeData
          
          if (churchData && typeof churchData === 'object') {
            setChurchInfo({
              id: churchData.id || null,
              name: churchData.name || "",
              email: churchData.email || "",
              address: churchData.address || "",
              location: churchData.location || "",
              phoneNumber: churchData.phoneNumber || "",
              welcomeAddress: churchData.welcomeAddress || ""
            })
            setHasChurchInfo(true)
          }
        }
      } else {
        console.error('Failed to load homepage data:', homePageData)
      }

      // Handle branches data
      if (branchesData.status === 'fulfilled' && branchesData.value.isSuccessful) {
        setBranches(branchesData.value.data || [])
      }

      // Handle service schedules
      if (serviceSchedulesData.status === 'fulfilled' && serviceSchedulesData.value.isSuccessful) {
        setServiceSchedules(serviceSchedulesData.value.data || [])
      }

      // Handle church days
      if (churchDaysData.status === 'fulfilled' && churchDaysData.value.isSuccessful) {
        setChurchDays(churchDaysData.value.data || [])
      }

      // Handle church images
      if (imagesData.status === 'fulfilled' && imagesData.value.isSuccessful) {
        console.log('Church images API response:', imagesData.value)
        console.log('Church images data:', imagesData.value.data)
        setChurchImages(imagesData.value.data || {})
      } else {
        console.log('Church images API failed:', imagesData)
        setChurchImages({}) // Ensure it's always an object
      }

      // Load social media data from localStorage
      const savedSocialMedia = localStorage.getItem('churchSocialMedia')
      if (savedSocialMedia) {
        try {
          const parsedSocialMedia = JSON.parse(savedSocialMedia)
          setSocialMedia(parsedSocialMedia)
          console.log('Loaded social media from localStorage:', parsedSocialMedia)
        } catch (e) {
          console.error('Error parsing saved social media data:', e)
        }
      }

    } catch (err: any) {
      console.error('Error loading church data:', err)
      setError('Failed to load church information')
      toast.error('Failed to load church information')
    } finally {
      console.log('loadChurchData completed')
      setIsLoading(false)
    }
  }

  const handleSaveChurchInfo = async () => {
    try {
      console.log('Save button clicked - handleSaveChurchInfo called')
      console.log('Current church info:', churchInfo)
      
      if (!churchInfo.name.trim()) {
        toast.error("Church name is required")
        return
      }
      if (!churchInfo.email.trim()) {
        toast.error("Church email is required")
        return
      }

      setIsSaving(true)
      setError(null)

      // Prepare payload with ChurchDays if API requires it
      const payload = {
        ...churchInfo,
        id: 1,
        // Add empty ChurchDays array if API requires it
        ChurchDays: []
      }
      
      console.log('Making API call to createOrUpdateChurchDetails...')
      console.log('Payload:', payload)
      const response = await createOrUpdateChurchDetails(payload as any)
      console.log('API Response:', response)

      if (response.isSuccessful) {
        toast.success("Church information updated successfully!")
        setIsEditing(false)
        
        // Save social media links (for now, store locally - extend with API later)
        localStorage.setItem('churchSocialMedia', JSON.stringify(socialMedia))
        console.log('Social media links saved locally:', socialMedia)
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const updatedInfo = response.data[0] as any
          if (updatedInfo && typeof updatedInfo === 'object') {
            setChurchInfo({
              id: updatedInfo.id || churchInfo.id,
              name: updatedInfo.name || churchInfo.name,
              email: updatedInfo.email || churchInfo.email,
              address: updatedInfo.address || churchInfo.address,
              location: updatedInfo.location || churchInfo.location,
              phoneNumber: updatedInfo.phoneNumber || churchInfo.phoneNumber,
              welcomeAddress: updatedInfo.welcomeAddress || churchInfo.welcomeAddress
            })
          }
        }
        setHasChurchInfo(true)
        // Refetch to ensure latest values
        await loadChurchData()
        
        // Reset error state
        setError(null)
        
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage || 'Failed to update church information'
        throw new Error(errorMessage)
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

      // Ensure we have at least one church day (API requirement)
      const scheduleToSave = {
        ...newServiceSchedule,
        churchDays: (newServiceSchedule.churchDays.length > 0 
          ? newServiceSchedule.churchDays 
          : [{ id: null, day: DayOfWeek.Sunday, startTime: { hour: 9, minute: 0 }, closeTime: { hour: 12, minute: 0 } }]
        )
      }

      console.log('Creating service schedule with payload:', scheduleToSave)
      setIsSaving(true)
      const response = await createOrUpdateServiceScheduleDetails(scheduleToSave as any)

      if (response.isSuccessful) {
        toast.success("Service schedule added successfully!" + 
          (newServiceSchedule.churchDays.length === 0 ? " (Default Sunday service created)" : ""))
        setNewServiceSchedule({ name: "", churchDays: [] })
        loadChurchData()
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
      const payload = [{
        ...newChurchDay,
        startTime: `${String((newChurchDay as any).startTime.hour ?? 0).padStart(2,'0')}:${String((newChurchDay as any).startTime.minute ?? 0).padStart(2,'0')}:00`,
        closeTime: `${String((newChurchDay as any).closeTime.hour ?? 0).padStart(2,'0')}:${String((newChurchDay as any).closeTime.minute ?? 0).padStart(2,'0')}:00`
      }]
      const response = await createOrUpdateChurchdayDetails(payload as any)

      if (response.isSuccessful) {
        toast.success("Church day added successfully!")
        setNewChurchDay({
          id: null,
          day: DayOfWeek.Sunday,
          startTime: { hour: 9, minute: 0 },
          closeTime: { hour: 12, minute: 0 }
        })
        loadChurchData()
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

  const handleImagesUpload = async (files: File[], category: ChurchImageCategory) => {
    try {
      setIsUploadingImage(true)
      
      // Debug the category value before conversion
      console.log('Raw category value:', category)
      console.log('Category type:', typeof category)
      console.log('Category === undefined:', category === undefined)
      console.log('Category === null:', category === null)
      
      // Ensure category is a valid number - with better fallback
      let categoryId: number
      
      if (category === undefined || category === null) {
        console.warn('Category is undefined/null, defaulting to CarouselImage (1)')
        categoryId = 1 // Default to CarouselImage
      } else {
        categoryId = Number(category)
        console.log('Converted categoryId:', categoryId)
      }
      
      // Additional validation
      if (isNaN(categoryId) || categoryId < 1 || categoryId > 8) {
        console.error('Invalid category ID after conversion:', categoryId, 'Original category:', category)
        categoryId = 1 // Default to CarouselImage if invalid
        console.log('Using fallback categoryId:', categoryId)
      }
      
      console.log('Final categoryId being sent:', categoryId)

      const response = await createChurchImage({
        File: files,
        ImageCategoryId: categoryId
      })
      
      console.log('Image upload response:', response)

      if (response.isSuccessful) {
        toast.success("Image uploaded successfully!")
        loadChurchData() // Reload to get updated images
      } else {
        throw new Error(response.responseMessage || 'Failed to upload image')
      }
    } catch (err: any) {
      console.error('Error uploading image:', err)
      console.error('Full error object:', err)
      console.error('Error response data:', err.response?.data)
      console.error('Error status:', err.response?.status)
      
      // Try to extract validation errors if they exist
      if (err.response?.data?.validationErrors || err.response?.data?.errors) {
        const validationErrors = err.response.data.validationErrors || err.response.data.errors
        console.error('Validation errors:', validationErrors)
        toast.error(`Validation error: ${JSON.stringify(validationErrors)}`)
      } else {
        toast.error(err.message || 'Failed to upload image')
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      setDeletingImageIds(prev => Array.from(new Set([ ...prev, imageId ])))
      const response = await deleteChurchImage(imageId)
      if (response.isSuccessful) {
        // Optimistically update UI without full reload
        setChurchImages((prev: any) => {
          const updated: any = { ...prev }
          if (Array.isArray(prev?.carouselImages)) {
            updated.carouselImages = prev.carouselImages.filter((img: any) => img?.id !== imageId)
          }
          const singleKeys = [
            'bibleStudyImage',
            'communityImage',
            'fellowshipImage',
            'weddingImage',
            'churchLivestreamImage',
            'churchEventImage',
            'churchServiceImage',
            'churchLiveStreamImage'
          ]
          singleKeys.forEach((key) => {
            if (prev?.[key]?.id === imageId) {
              updated[key] = null
            }
          })
          return updated
        })
        toast.success("Image deleted successfully!", { position: "top-right" })
      } else {
        throw new Error(response.responseMessage || 'Failed to delete image')
      }
    } catch (err: any) {
      console.error('Error deleting image:', err)
      toast.error(err.message || 'Failed to delete image')
    } finally {
      setDeletingImageIds(prev => prev.filter(id => id !== imageId))
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

  const handleInputChange = (field: keyof CreateOrUpdateChurchDetailsRequest, value: string) => {
    setChurchInfo(prev => ({ ...prev, [field]: value }))
    if (error) {
      setError(null)
    }
  }

  const handleSocialMediaChange = (field: keyof typeof socialMedia, value: string) => {
    setSocialMedia(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading church information...</span>
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
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Church Information</h1>
              <p className="text-gray-600 mt-1">Manage your church details, schedules, and settings</p>
            </div>
          <Button 
                onClick={() => {
                  console.log('Button clicked - isEditing:', isEditing)
                  if (isEditing) {
                    console.log('Calling handleSaveChurchInfo...')
                    handleSaveChurchInfo()
                  } else {
                    console.log('Entering edit mode...')
                    setIsEditing(true)
                  }
                }}
            disabled={isSaving}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto flex-shrink-0"
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

          {/* Status Message */}
          {hasChurchInfo && !isEditing && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Church Information Configured</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your church details are set up and will be displayed across the platform.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
          </div>
        )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
              <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
              <TabsTrigger value="social" className="text-xs sm:text-sm">Social</TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs sm:text-sm">Schedule</TabsTrigger>
              <TabsTrigger value="church-days" className="text-xs sm:text-sm">Days</TabsTrigger>
              <TabsTrigger value="images" className="text-xs sm:text-sm">Images</TabsTrigger>
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          </TabsList>

            {/* General Information Tab */}
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
                    <Label htmlFor="churchName">Church Name *</Label>
                    <Input
                      id="churchName"
                      value={churchInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter church name"
                      required
                        className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={churchInfo.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter church location"
                        className="mt-1"
                    />
                  </div>
                  <div>
                      <Label htmlFor="welcomeAddress">Welcome Message</Label>
                    <Textarea
                      id="welcomeAddress"
                      value={churchInfo.welcomeAddress}
                      onChange={(e) => handleInputChange('welcomeAddress', e.target.value)}
                      disabled={!isEditing}
                        placeholder="Enter welcome message for visitors"
                        rows={4}
                        className="mt-1"
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
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                        placeholder="Enter full church address"
                      rows={3}
                        className="mt-1"
                    />
                  </div>
                  <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      value={churchInfo.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                          className="pl-10 mt-1"
                    />
                      </div>
                  </div>
                  <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      value={churchInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter email address"
                      type="email"
                      required
                          className="pl-10 mt-1"
                    />
                      </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Social Media & Online Presence
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Add your church's social media links and website to help members connect with you online.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="website"
                          value={socialMedia.website}
                          onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                          disabled={!isEditing}
                          placeholder="https://yourchurch.com"
                          className="pl-10 mt-1"
                        />
                    </div>
                    </div>

                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <div className="relative">
                        <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="facebook"
                          value={socialMedia.facebook}
                          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                          disabled={!isEditing}
                          placeholder="https://facebook.com/yourchurch"
                          className="pl-10 mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="instagram"
                          value={socialMedia.instagram}
                          onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                          disabled={!isEditing}
                          placeholder="https://instagram.com/yourchurch"
                          className="pl-10 mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <div className="relative">
                        <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="youtube"
                          value={socialMedia.youtube}
                          onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                          disabled={!isEditing}
                          placeholder="https://youtube.com/@yourchurch"
                          className="pl-10 mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="twitter">Twitter/X</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="twitter"
                          value={socialMedia.twitter}
                          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                          disabled={!isEditing}
                          placeholder="https://twitter.com/yourchurch"
                          className="pl-10 mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="linkedin"
                          value={socialMedia.linkedin}
                          onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                          disabled={!isEditing}
                          placeholder="https://linkedin.com/company/yourchurch"
                          className="pl-10 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>

            {/* Service Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Service Schedules
                </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure your church service schedules and timings.
                  </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Service Schedule */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3">Add New Service Schedule</h4>
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">
                          💡 A default Sunday service (9:00 AM - 12:00 PM) will be created. You can edit church days later.
                        </p>
                      </div>
                    <div className="flex gap-2">
                      <Input
                          placeholder="Service name (e.g., First Service, Evening Service)"
                        value={newServiceSchedule.name}
                        onChange={(e) => setNewServiceSchedule({
                          ...newServiceSchedule,
                          name: e.target.value
                        })}
                          className="flex-1"
                      />
                      <Button 
                        onClick={handleAddServiceSchedule}
                          disabled={isSaving || !newServiceSchedule.name.trim()}
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
                      <div className="space-y-3">
                        {serviceSchedules.map((schedule, index) => (
                          <div key={schedule.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-semibold">{schedule.name || schedule.eventName || `Service ${index + 1}`}</h3>
                          <p className="text-sm text-muted-foreground">
                            {schedule.email || 'No additional details'}
                          </p>
                        </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => schedule.id && handleDeleteServiceSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No service schedules configured</p>
                        <p className="text-sm">Add your first service schedule above</p>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

            {/* Church Days Tab */}
          <TabsContent value="church-days" className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Church Operating Days
                </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Set the days and times when your church is open for services and activities.
                  </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Church Day */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3">Add New Church Day</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div>
                          <Label htmlFor="day">Day</Label>
                      <select
                        value={newChurchDay.day}
                        onChange={(e) => setNewChurchDay({
                          ...newChurchDay,
                          day: e.target.value as DayOfWeek
                        })}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                      >
                        {Object.values(DayOfWeek).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                        </div>
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        type="time"
                        value={formatTime(newChurchDay.startTime)}
                        onChange={(e) => setNewChurchDay({
                          ...newChurchDay,
                          startTime: parseTime(e.target.value)
                        })}
                            className="mt-1"
                      />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                      <Input
                        type="time"
                        value={formatTime(newChurchDay.closeTime)}
                        onChange={(e) => setNewChurchDay({
                          ...newChurchDay,
                          closeTime: parseTime(e.target.value)
                        })}
                            className="mt-1"
                      />
                        </div>
                        <div className="flex items-end">
                      <Button 
                        onClick={handleAddChurchDay}
                        disabled={isSaving}
                            className="w-full"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                        </div>
                    </div>
                  </div>

                  {/* Existing Church Days */}
                  {churchDays.length > 0 ? (
                      <div className="space-y-3">
                        {churchDays.map((day, index) => (
                          <div key={day.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-semibold">{day.day}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(day.startTime)} - {formatTime(day.closeTime)}
                          </p>
                        </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => day.id && handleDeleteChurchDay(day.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No church days configured</p>
                        <p className="text-sm">Add your church operating hours above</p>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Church Images
                </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload and manage images for your church website and promotional materials.
                  </p>
              </CardHeader>
              <CardContent>
                  <div className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Church Images</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Add high-quality images to showcase your church and activities
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end mb-4 text-left">
                        <div className="sm:col-span-2">
                          <Label htmlFor="imageCategory">Category</Label>
                          <select
                            id="imageCategory"
                            value={selectedImageCategory}
                            onChange={(e) => setSelectedImageCategory(Number(e.target.value) as ChurchImageCategory)}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          >
                            <option value={ChurchImageCategory.CarouselImage}>{categoryLabels[ChurchImageCategory.CarouselImage]}</option>
                            <option value={ChurchImageCategory.FellowshipImage}>{categoryLabels[ChurchImageCategory.FellowshipImage]}</option>
                            <option value={ChurchImageCategory.BibleStudyImage}>{categoryLabels[ChurchImageCategory.BibleStudyImage]}</option>
                            <option value={ChurchImageCategory.CommunityImage}>{categoryLabels[ChurchImageCategory.CommunityImage]}</option>
                            <option value={ChurchImageCategory.ChurchEventImage}>{categoryLabels[ChurchImageCategory.ChurchEventImage]}</option>
                            <option value={ChurchImageCategory.ChurchServiceImage}>{categoryLabels[ChurchImageCategory.ChurchServiceImage]}</option>
                            <option value={ChurchImageCategory.ChurchWeddingImage}>{categoryLabels[ChurchImageCategory.ChurchWeddingImage]}</option>
                            <option value={ChurchImageCategory.ChurchLiveStreamImage}>{categoryLabels[ChurchImageCategory.ChurchLiveStreamImage]}</option>
                          </select>
                        </div>
                        <div>
                      <Button
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={isUploadingImage}
                        variant="outline"
                            className="w-full"
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Images
                          </>
                        )}
                      </Button>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mb-4">
                        {selectedImageCategory === ChurchImageCategory.CarouselImage
                          ? '📷 You can select multiple files for Carousel Images'
                          : `📷 Uploading to "${categoryLabels[selectedImageCategory]}" (single image)`}
                      </p>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple={selectedImageCategory === ChurchImageCategory.CarouselImage}
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            const selectedCategory = selectedImageCategory
                            const filesArray = selectedCategory === ChurchImageCategory.CarouselImage
                              ? Array.from(files)
                              : [files[0]]
                            handleImagesUpload(filesArray, selectedCategory)
                          }
                        }}
                      />
                    </div>

                    {/* Existing Images (by category) */}
                    {churchImages && (churchImages.carouselImages?.length > 0 || churchImages.bibleStudyImage || churchImages.communityImage || churchImages.fellowshipImage || churchImages.weddingImage || churchImages.churchLivestreamImage || churchImages.churchEventImage) ? (
                      <div className="space-y-8">
                        {/* Carousel Images */}
                        {Array.isArray(churchImages.carouselImages) && churchImages.carouselImages.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Carousel Images</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {churchImages.carouselImages.map((image: any, index: number) => (
                                <div key={image.id || index} className="relative group border rounded-lg overflow-hidden">
                                  <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded z-10">#{index + 1}</div>
                                  <img
                                    src={image.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                                    alt={image.imageName || `Carousel image ${index + 1}`}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => image.id && handleDeleteImage(image.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      disabled={!!(image.id && deletingImageIds.includes(image.id))}
                                    >
                                      {image.id && deletingImageIds.includes(image.id) ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                      <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                    <p className="text-white text-xs truncate">{image.imageName || `Carousel Image ${index + 1}`}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Single Images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { key: 'bibleStudyImage', label: 'Bible Study Image' },
                            { key: 'communityImage', label: 'Community Image' },
                            { key: 'fellowshipImage', label: 'Fellowship Image' },
                            { key: 'weddingImage', label: 'Wedding Image' },
                            { key: 'churchLivestreamImage', label: 'Church Livestream Image' },
                            { key: 'churchEventImage', label: 'Church Event Image' },
                          ].map(({ key, label }) => {
                            const img = churchImages?.[key]
                            if (!img) return null
                            return (
                              <div key={key} className="relative group border rounded-lg overflow-hidden">
                                <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded z-10">{label}</div>
                                <img
                                  src={img.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"}
                                  alt={img.imageName || label}
                                  className="w-full h-48 object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => img.id && handleDeleteImage(img.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    disabled={!!(img.id && deletingImageIds.includes(img.id))}
                                  >
                                    {img.id && deletingImageIds.includes(img.id) ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                    <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                  <p className="text-white text-xs truncate">{img.imageName || label}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No images uploaded yet</p>
                        <p className="text-sm">Upload your first image above</p>
                      </div>
                    )}
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Church Images</CardTitle>
                    <ImageIcon className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {(() => {
                        console.log('Rendering church images count:', churchImages)
                        
                        if (!churchImages) return 0
                        
                        // Calculate total images from all categories
                        let totalCount = 0
                        
                        // Count carousel images (array)
                        if (churchImages.carouselImages && Array.isArray(churchImages.carouselImages)) {
                          totalCount += churchImages.carouselImages.length
                        }
                        
                        // Count individual images (non-null values)
                        const singleImageFields = [
                          'bibleStudyImage', 'communityImage', 'fellowshipImage', 
                          'weddingImage', 'churchEventImage', 'churchServiceImage', 
                          'churchLiveStreamImage'
                        ]
                        
                        singleImageFields.forEach(field => {
                          if (churchImages[field]) {
                            totalCount += 1
                          }
                        })
                        
                        console.log('Total image count calculated:', totalCount)
                        return totalCount
                      })()}
            </div>
                    <p className="text-xs text-muted-foreground">Images uploaded</p>
                  </CardContent>
                </Card>
              </div>

              {/* Branches Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Church className="h-5 w-5" />
                    Church Branches Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {branches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {branches.map((branch, index) => (
                        <div key={branch.id || index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{branch.name}</h3>
                            <Badge variant={branch.isDeleted ? "destructive" : "default"}>
                              {branch.isDeleted ? "Inactive" : "Active"}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {branch.address}
                            </p>
                            <p className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {branch.email}
                            </p>
                            <p className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {branch.phoneNumber}
                            </p>
                            <p className="text-xs">
                              {branch.state}, {branch.country}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Church className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No branches found</p>
                      <p className="text-sm">Add branches through the branches management page</p>
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  )
}