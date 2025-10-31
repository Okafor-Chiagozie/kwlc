"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Users, Shield, Plus, Edit, Trash2, Eye, Settings, UserPlus, Key, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"
import { getAllUsers, blockUser, unblockUser, updateUser, registration, getRoles } from "@/services/user"
import { getAllBranches } from "@/services/branch"
import { GetAllUsersRequest, UserViewModel, UpdateUserRequest, RegistrationRequest, RoleViewModel } from "@/types/user"
import type { Branch } from "@/types/branch"

export default function RolesPage() {
  // Users state (API-backed)
  const [users, setUsers] = useState<UserViewModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [busyUserId, setBusyUserId] = useState<number | null>(null)

  // Block/Unblock confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmUserId, setConfirmUserId] = useState<number | null>(null)
  const [confirmAction, setConfirmAction] = useState<"block" | "unblock">("block")

  // Add User (Registration) dialog state
  const [addOpen, setAddOpen] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [regForm, setRegForm] = useState<RegistrationRequest>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    password: "",
    phoneNumber: "",
    roleId: 0,
    branchId: 0,
  })
  const [rolesApi, setRolesApi] = useState<RoleViewModel[]>([])
  const [branchesApi, setBranchesApi] = useState<Branch[]>([])

  // Mock roles (kept as-is)
  const [roles] = useState([
    {
      id: 1,
      name: "Super Admin",
      description: "Full access to all features and branches",
      permissions: {
        dashboard: true,
        finance: true,
        events: true,
        pastors: true,
        branches: true,
        users: true,
        settings: true,
      },
      userCount: 1,
    },
    {
      id: 2,
      name: "Branch Admin",
      description: "Full access to specific branch operations",
      permissions: {
        dashboard: true,
        finance: true,
        events: true,
        pastors: true,
        branches: false,
        users: false,
        settings: false,
      },
      userCount: 3,
    },
    {
      id: 3,
      name: "Finance Manager",
      description: "Access to financial reports and management",
      permissions: {
        dashboard: true,
        finance: true,
        events: false,
        pastors: false,
        branches: false,
        users: false,
        settings: false,
      },
      userCount: 2,
    },
    {
      id: 4,
      name: "Pastor",
      description: "Access to pastoral and event management",
      permissions: {
        dashboard: true,
        finance: false,
        events: true,
        pastors: true,
        branches: false,
        users: false,
        settings: false,
      },
      userCount: 4,
    },
  ])

  const handleCreateUser = async () => {
    // Minimal validation
    if (!regForm.firstName || !regForm.lastName || !regForm.email || !regForm.password) {
      toast.error("Please fill in first name, last name, email and password")
      return
    }
    if (!regForm.roleId || !regForm.branchId) {
      toast.error("Please select role and branch")
      return
    }
    try {
      setIsRegistering(true)
      const resp = await registration(regForm)
      if (resp.isSuccessful) {
        toast.success("User registered successfully")
        setAddOpen(false)
        // reset form
        setRegForm({ firstName: "", lastName: "", middleName: "", email: "", password: "", phoneNumber: "", roleId: 0, branchId: 0 })
        await loadUsers()
      } else {
        toast.error(resp.responseMessage || "Registration failed")
      }
    } catch (err: any) {
      toast.error(err?.message || "Registration error")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleCreateRole = () => {
    toast.success("Role created successfully!")
  }

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const payload: GetAllUsersRequest = { pageSize: 100, pageNumber: 1, searchParams: {} }
      const response = await getAllUsers(payload)
      if (response.isSuccessful && Array.isArray(response.data)) {
        setUsers(response.data)
      } else {
        setUsers([])
      }
    } catch (err) {
      console.error("Failed to load users", err)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    ;(async () => {
      try {
        const resp = await getRoles()
        if (resp?.isSuccessful && Array.isArray(resp.data)) {
          setRolesApi(resp.data.filter(r => !r.isDeleted))
        }
      } catch {}
      try {
        const branches = await getAllBranches({ pageSize: 100, pageNumber: 1, searchParams: {} })
        if (branches?.isSuccessful && Array.isArray(branches.data)) {
          setBranchesApi(branches.data)
        }
      } catch {}
    })()
  }, [])

  const openConfirm = (userId: number, action: "block" | "unblock") => {
    setConfirmUserId(userId)
    setConfirmAction(action)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!confirmUserId) return
    try {
      setBusyUserId(confirmUserId)
      if (confirmAction === "block") {
        const resp = await blockUser({ userId: confirmUserId })
        if (!resp.isSuccessful) throw new Error(resp.responseMessage || "Block failed")
        toast.success("User blocked")
      } else {
        const resp = await unblockUser({ userId: confirmUserId })
        if (!resp.isSuccessful) throw new Error(resp.responseMessage || "Unblock failed")
        toast.success("User unblocked")
      }
      setConfirmOpen(false)
      setConfirmUserId(null)
      await loadUsers()
    } catch (err: any) {
      console.error("Action failed", err)
      toast.error(err.message || "Action failed")
    } finally {
      setBusyUserId(null)
    }
  }

  const getRoleLabel = (userTypeId: any) => {
    if (typeof userTypeId === "string") return userTypeId
    return String(userTypeId)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Roles & Access Management</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={regForm.firstName} onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })} placeholder="First name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={regForm.lastName} onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })} placeholder="Last name" />
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input id="middleName" value={regForm.middleName} onChange={(e) => setRegForm({ ...regForm, middleName: e.target.value })} placeholder="Middle name (optional)" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={regForm.phoneNumber} onChange={(e) => setRegForm({ ...regForm, phoneNumber: e.target.value })} placeholder="Phone number" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} placeholder="Email address" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} placeholder="Set a password" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Role</Label>
                      <Select value={regForm.roleId ? String(regForm.roleId) : undefined} onValueChange={(v) => setRegForm({ ...regForm, roleId: Number(v) })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesApi.map((r) => (
                            <SelectItem key={r.roleId} value={String(r.roleId)}>{r.role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Branch</Label>
                      <Select value={regForm.branchId ? String(regForm.branchId) : undefined} onValueChange={(v) => setRegForm({ ...regForm, branchId: Number(v) })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branchesApi.map((b) => (
                            <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleCreateUser} className="w-full" disabled={isRegistering}>
                    {isRegistering ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Registering...</span> : "Register User"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading users...
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge>{getRoleLabel(user.userTypeId)}</Badge>
                        <div className="mt-1">
                          <Badge variant="outline" className={user.isBanned ? "text-red-600" : "text-green-600"}>
                            {user.isBanned ? "inactive" : "active"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {user.isBanned ? (
                          <Button variant="outline" size="sm" disabled={busyUserId === user.id} onClick={() => openConfirm(user.id, "unblock")}>
                            {busyUserId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unblock"}
                          </Button>
                        ) : (
                          <Button variant="destructive" size="sm" disabled={busyUserId === user.id} onClick={() => openConfirm(user.id, "block")}>
                            {busyUserId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Block"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">No users found</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Block/Unblock Confirmation */}
      {confirmOpen && confirmUserId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={() => setConfirmOpen(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{confirmAction === "block" ? "Block User" : "Unblock User"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {confirmAction === "block" ? "Are you sure you want to block this user?" : "Are you sure you want to unblock this user?"}
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button variant={confirmAction === "block" ? "destructive" : "default"} onClick={handleConfirm} disabled={busyUserId === confirmUserId}>
                  {busyUserId === confirmUserId ? <Loader2 className="h-4 w-4 animate-spin" /> : (confirmAction === "block" ? "Block" : "Unblock")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}
