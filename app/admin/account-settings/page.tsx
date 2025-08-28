"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, Calendar, Shield, Lock, Save, Eye, EyeOff, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import ProtectedRoute from "@/components/admin/protected-route"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { changePassword } from "@/services/user"
import { ChangePasswordRequest } from "@/types/user"

export default function AccountSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { user: currentUser, isLoading: isLoadingUser } = useAuth()

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: ""
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || "",
        middleName: currentUser.middleName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        bio: "" // Assuming bio is not in current user type, can be added later
      })
    }
  }, [currentUser])

  const getDisplayName = () => {
    if (currentUser) {
      const fullName = [currentUser.firstName, currentUser.middleName, currentUser.lastName]
        .filter(Boolean)
        .join(" ")
      return fullName || currentUser.email || "Admin User"
    }
    return "Admin User"
  }

  const getInitials = () => {
    if (currentUser) {
      const firstInitial = currentUser.firstName?.charAt(0)?.toUpperCase() || ""
      const lastInitial = currentUser.lastName?.charAt(0)?.toUpperCase() || ""
      return firstInitial + lastInitial || currentUser.email?.charAt(0)?.toUpperCase() || "AU"
    }
    return "AU"
  }

  const getUserRole = () => {
    if (currentUser) {
      return currentUser.userTypeId === "Admin" ? "Administrator" : "User"
    }
    return "Administrator"
  }

  const getUserStatus = () => {
    if (currentUser) {
      return currentUser.isBanned ? "Suspended" : "Active"
    }
    return "Active"
  }

  const handleProfileSave = async () => {
    try {
      setIsSaving(true)
      
      // TODO: Implement profile update API call
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = "Password must contain uppercase, lowercase, and number"
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordChange = async () => {
    try {
      if (!validatePasswordForm()) {
        toast.error("Please fix the errors in the form")
        return
      }

      setIsSaving(true)

      const requestData: ChangePasswordRequest = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      }

      const response = await changePassword(requestData)

      if (response.isSuccessful) {
        toast.success("Password changed successfully!")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setPasswordErrors({})
      } else {
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map(error => error.description).join(", ")
          toast.error(errorMessages)
        } else {
          toast.error(response.responseMessage || "Failed to change password")
        }
      }
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value })
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: "" })
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field as keyof typeof showPasswords] })
  }

  if (isLoadingUser) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading account information...</span>
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
            <h1 className="text-xl sm:text-2xl font-bold">Account Settings</h1>
          </div>

          {/* Profile Overview Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div>
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold">{getDisplayName()}</h2>
                  <p className="text-muted-foreground">{currentUser?.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={getUserStatus() === "Active" ? "secondary" : "destructive"}
                    >
                      {getUserStatus()}
                    </Badge>
                    <Badge variant="outline">
                      {getUserRole()}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  {currentUser?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {currentUser.phoneNumber}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member since {currentUser ? new Date(currentUser.dateCreated).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-auto">
              <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile Information</TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
              <TabsTrigger value="preferences" className="text-xs sm:text-sm">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Update your personal details and contact information
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={profileData.middleName}
                        onChange={(e) => setProfileData({ ...profileData, middleName: e.target.value })}
                        placeholder="Enter your middle name (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="Enter your email address"
                        disabled // Usually email cannot be changed easily
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleProfileSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                          placeholder="Enter your current password"
                          className={passwordErrors.currentPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => togglePasswordVisibility("current")}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                          placeholder="Enter your new password"
                          className={passwordErrors.newPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm your new password"
                          className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Password Requirements:</p>
                        <ul className="mt-1 space-y-1 text-blue-700">
                          <li>• At least 8 characters long</li>
                          <li>• Contains uppercase and lowercase letters</li>
                          <li>• Contains at least one number</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handlePasswordChange} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Login Sessions</h4>
                        <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Customize your admin experience
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications about system events</p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Theme Settings</h4>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Language</h4>
                        <p className="text-sm text-muted-foreground">Select your preferred language</p>
                      </div>
                      <Badge>English</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 