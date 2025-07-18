"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar, Loader2, Upload } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"
import {
  createOrUpdateMinister,
  searchMinisters,
  getAllMinisters,
  deleteMinister
} from "@/services/minister"
import { getAllBranches } from "@/services/branch"
import {
  CreateOrUpdateMinisterRequest,
  SearchMinistersRequest,
  MinisterRole
} from "@/types/minister"

export default function PastorsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Ministers State
  const [ministers, setMinisters] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Branches State for dropdowns
  const [branches, setBranches] = useState<any[]>([])
  
  // Search State
  const [searchParams, setSearchParams] = useState<SearchMinistersRequest>({
    pageSize: 20,
    pageNumber: 1,
    searchParams: {}
  })
  
  // New Minister Form State
  const [newMinister, setNewMinister] = useState<CreateOrUpdateMinisterRequest>({
    id: null,
    email: "",
    branchId: null,
    lastName: "",
    biography: "",
    firstName: "",
    phoneNumber: "",
    middleName: "",
    imageFile: null,
    ministerRoleId: MinisterRole.Associate
  })
  
  // Edit Minister State
  const [editingMinister, setEditingMinister] = useState<CreateOrUpdateMinisterRequest | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    loadMinistersData()
  }, [])

  const loadMinistersData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load ministers and branches data
      const [ministersData, branchesData] = await Promise.allSettled([
        getAllMinisters(),
        getAllBranches({ pageSize: 100, pageNumber: 1 })
      ])

      // Handle ministers data
      if (ministersData.status === 'fulfilled' && ministersData.value.isSuccessful) {
        setMinisters(ministersData.value.data || [])
        console.log('Ministers loaded:', ministersData.value.data)
      } else {
        console.error('Failed to load ministers:', ministersData)
        toast.error('Failed to load ministers data')
      }

      // Handle branches data
      if (branchesData.status === 'fulfilled' && branchesData.value.isSuccessful) {
        setBranches(branchesData.value.data || [])
        console.log('Branches loaded for minister assignment:', branchesData.value.data)
      } else {
        console.error('Failed to load branches:', branchesData)
      }

    } catch (err: any) {
      console.error('Error loading ministers data:', err)
      setError('Failed to load ministers information')
      toast.error('Failed to load ministers information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchMinisters = async () => {
    try {
      setIsSearching(true)
      const response = await searchMinisters(searchParams)

      if (response.isSuccessful) {
        setSearchResults(response.data || [])
        console.log('Search results:', response.data)
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || 'Search failed'
        toast.error(errorMessage)
      }
    } catch (err: any) {
      console.error('Error searching ministers:', err)
      toast.error('Failed to search ministers')
    } finally {
      setIsSearching(false)
    }
  }

  const handleCreateMinister = async () => {
    try {
      // Validate required fields
      if (!newMinister.firstName.trim() || !newMinister.lastName.trim() || !newMinister.email.trim()) {
        toast.error('Please fill in all required fields (First Name, Last Name, Email)')
        return
      }

      setIsSaving(true)
      const response = await createOrUpdateMinister(newMinister)

      if (response) { // The API returns EventViewModel, so we check if response exists
        toast.success('Minister created successfully!')
        
        // Reset form
        setNewMinister({
          id: null,
          email: "",
          branchId: null,
          lastName: "",
          biography: "",
          firstName: "",
          phoneNumber: "",
          middleName: "",
          imageFile: null,
          ministerRoleId: MinisterRole.Associate
        })
        
        // Reload data
        loadMinistersData()
      } else {
        throw new Error('Failed to create minister')
      }
    } catch (err: any) {
      console.error('Error creating minister:', err)
      toast.error(err.message || 'Failed to create minister')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateMinister = async () => {
    try {
      if (!editingMinister) return

      setIsSaving(true)
      const response = await createOrUpdateMinister(editingMinister)

      if (response) {
        toast.success('Minister updated successfully!')
        setIsEditDialogOpen(false)
        setEditingMinister(null)
        loadMinistersData()
      } else {
        throw new Error('Failed to update minister')
      }
    } catch (err: any) {
      console.error('Error updating minister:', err)
      toast.error(err.message || 'Failed to update minister')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMinister = async (id: number) => {
    try {
      if (!confirm('Are you sure you want to delete this minister?')) return

      const response = await deleteMinister(id)

      if (response.isSuccessful) {
        toast.success('Minister deleted successfully!')
        loadMinistersData()
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || 'Delete failed'
        throw new Error(errorMessage)
      }
    } catch (err: any) {
      console.error('Error deleting minister:', err)
      toast.error(err.message || 'Failed to delete minister')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isEdit && editingMinister) {
        setEditingMinister({ ...editingMinister, imageFile: file })
      } else {
        setNewMinister({ ...newMinister, imageFile: file })
      }
    }
  }

  const getMinisterRoleDisplay = (role: MinisterRole): string => {
    const roleMap = {
      [MinisterRole.GeneralOverseer]: 'General Overseer',
      [MinisterRole.Lead]: 'Lead Pastor',
      [MinisterRole.Youth]: 'Youth Pastor',
      [MinisterRole.Associate]: 'Associate Pastor',
      [MinisterRole.Children]: 'Children Pastor',
      [MinisterRole.Missions]: 'Missions Pastor',
      [MinisterRole.Worship]: 'Worship Pastor'
    }
    return roleMap[role] || role
  }

  const getBranchName = (branchId: number | null): string => {
    if (!branchId) return 'No Branch Assigned'
    const branch = branches.find(b => b.id === branchId)
    return branch ? branch.name : `Branch ID: ${branchId}`
  }

  const startEditMinister = (minister: any) => {
    setEditingMinister({
      id: minister.id,
      email: minister.email || "",
      branchId: minister.branchId || null,
      lastName: minister.lastName || "",
      biography: minister.biography || "",
      firstName: minister.firstName || "",
      phoneNumber: minister.phoneNumber || "",
      middleName: minister.middleName || "",
      imageFile: null, // File will be uploaded separately
      ministerRoleId: minister.ministerRoleId || MinisterRole.Associate
    })
    setIsEditDialogOpen(true)
  }

  // Calculate statistics
  const activeMinistersCount = ministers.filter(m => !m.isDeleted).length
  const roleStats = ministers.reduce((acc, minister) => {
    const role = minister.ministerRoleId || MinisterRole.Associate
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {} as Record<MinisterRole, number>)

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading pastors information...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pastors Management</h1>
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
              <CardTitle className="text-sm font-medium">Total Pastors</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMinistersCount}</div>
              <p className="text-xs text-muted-foreground">Active ministers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">General Overseers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {roleStats[MinisterRole.GeneralOverseer] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Senior leadership</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lead Pastors</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {roleStats[MinisterRole.Lead] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Branch leaders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Associate Pastors</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {roleStats[MinisterRole.Associate] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Support ministry</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-pastors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-pastors">All Pastors</TabsTrigger>
            <TabsTrigger value="add-pastor">Add Pastor</TabsTrigger>
            <TabsTrigger value="search">Search Pastors</TabsTrigger>
          </TabsList>

          <TabsContent value="all-pastors" className="space-y-6">
            {ministers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ministers.map((minister) => (
                  <Card key={minister.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={minister.imageUrl || "/placeholder.svg"} alt={minister.name} />
                          <AvatarFallback>
                            {minister.firstName?.charAt(0)}{minister.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {minister.firstName} {minister.middleName} {minister.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getMinisterRoleDisplay(minister.ministerRoleId)}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {getBranchName(minister.branchId)}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {minister.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{minister.email}</span>
                          </div>
                        )}
                        {minister.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{minister.phoneNumber}</span>
                          </div>
                        )}
                        {minister.dateCreated && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Joined {new Date(minister.dateCreated).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {minister.biography && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {minister.biography}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => startEditMinister(minister)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteMinister(minister.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No pastors found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="add-pastor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Pastor</CardTitle>
                <p className="text-sm text-muted-foreground">Add a new pastor to the church leadership team</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newMinister.firstName}
                        onChange={(e) => setNewMinister({ ...newMinister, firstName: e.target.value })}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={newMinister.middleName}
                        onChange={(e) => setNewMinister({ ...newMinister, middleName: e.target.value })}
                        placeholder="Enter middle name (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newMinister.lastName}
                        onChange={(e) => setNewMinister({ ...newMinister, lastName: e.target.value })}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMinister.email}
                        onChange={(e) => setNewMinister({ ...newMinister, email: e.target.value })}
                        placeholder="pastor@kwlc.org"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newMinister.phoneNumber}
                        onChange={(e) => setNewMinister({ ...newMinister, phoneNumber: e.target.value })}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ministerRole">Ministry Role</Label>
                      <Select 
                        value={newMinister.ministerRoleId} 
                        onValueChange={(value) => setNewMinister({ ...newMinister, ministerRoleId: value as MinisterRole })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ministry role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(MinisterRole).map(role => (
                            <SelectItem key={role} value={role}>
                              {getMinisterRoleDisplay(role)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch Assignment</Label>
                      <Select 
                        value={newMinister.branchId?.toString() || ""} 
                        onValueChange={(value) => setNewMinister({ ...newMinister, branchId: value ? Number(value) : null })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Branch Assignment</SelectItem>
                          {branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="biography">Biography</Label>
                      <Textarea
                        id="biography"
                        value={newMinister.biography}
                        onChange={(e) => setNewMinister({ ...newMinister, biography: e.target.value })}
                        placeholder="Enter pastor's biography and ministry background"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Profile Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, false)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleCreateMinister} 
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
                        Add Pastor
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Pastors</CardTitle>
                <p className="text-sm text-muted-foreground">Search for pastors using various criteria</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Page Size</Label>
                    <Input
                      type="number"
                      value={searchParams.pageSize}
                      onChange={(e) => setSearchParams({ 
                        ...searchParams, 
                        pageSize: Number(e.target.value) || 20 
                      })}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <Label>Page Number</Label>
                    <Input
                      type="number"
                      value={searchParams.pageNumber}
                      onChange={(e) => setSearchParams({ 
                        ...searchParams, 
                        pageNumber: Number(e.target.value) || 1 
                      })}
                      min="1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSearchMinisters}
                      disabled={isSearching}
                      className="w-full"
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Search Results ({searchResults.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((minister, index) => (
                        <Card key={minister.id || index}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={minister.imageUrl} />
                                <AvatarFallback>
                                  {minister.firstName?.charAt(0)}{minister.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">
                                  {minister.firstName} {minister.lastName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {getMinisterRoleDisplay(minister.ministerRoleId)}
                                </p>
                                <p className="text-sm text-muted-foreground">{minister.email}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {isEditDialogOpen && editingMinister && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Pastor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={editingMinister.firstName}
                      onChange={(e) => setEditingMinister({ ...editingMinister, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={editingMinister.lastName}
                      onChange={(e) => setEditingMinister({ ...editingMinister, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editingMinister.email}
                      onChange={(e) => setEditingMinister({ ...editingMinister, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editingMinister.phoneNumber}
                      onChange={(e) => setEditingMinister({ ...editingMinister, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Ministry Role</Label>
                    <Select 
                      value={editingMinister.ministerRoleId} 
                      onValueChange={(value) => setEditingMinister({ ...editingMinister, ministerRoleId: value as MinisterRole })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MinisterRole).map(role => (
                          <SelectItem key={role} value={role}>
                            {getMinisterRoleDisplay(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Branch</Label>
                    <Select 
                      value={editingMinister.branchId?.toString() || ""} 
                      onValueChange={(value) => setEditingMinister({ ...editingMinister, branchId: value ? Number(value) : null })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Branch Assignment</SelectItem>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Biography</Label>
                  <Textarea
                    value={editingMinister.biography}
                    onChange={(e) => setEditingMinister({ ...editingMinister, biography: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Profile Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateMinister} disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Pastor'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditingMinister(null)
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