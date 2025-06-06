"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Users, Shield, Plus, Edit, Trash2, Eye, Settings, UserPlus, Key } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"

export default function RolesPage() {
  const [users] = useState([
    {
      id: 1,
      name: "Michael Blackson",
      email: "michael@kwlc.org",
      role: "Super Admin",
      branch: "All Branches",
      status: "active",
      lastLogin: "2024-06-06 10:30 AM",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@kwlc.org",
      role: "Branch Admin",
      branch: "Abuja Branch",
      status: "active",
      lastLogin: "2024-06-05 2:15 PM",
    },
    {
      id: 3,
      name: "David Wilson",
      email: "david@kwlc.org",
      role: "Finance Manager",
      branch: "Port Harcourt",
      status: "active",
      lastLogin: "2024-06-04 9:45 AM",
    },
    {
      id: 4,
      name: "Grace Adamu",
      email: "grace@kwlc.org",
      role: "Pastor",
      branch: "Kano Branch",
      status: "inactive",
      lastLogin: "2024-06-01 11:20 AM",
    },
  ])

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

  const handleCreateUser = () => {
    toast.success("User created successfully!")
  }

  const handleCreateRole = () => {
    toast.success("Role created successfully!")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Roles & Access Management</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Full Name</Label>
                    <Input id="userName" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input id="userEmail" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="userRole">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="branch_admin">Branch Admin</SelectItem>
                        <SelectItem value="finance_manager">Finance Manager</SelectItem>
                        <SelectItem value="pastor">Pastor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="userBranch">Branch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="lagos">Lagos (Main)</SelectItem>
                        <SelectItem value="abuja">Abuja Branch</SelectItem>
                        <SelectItem value="portharcourt">Port Harcourt</SelectItem>
                        <SelectItem value="kano">Kano Branch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateUser} className="w-full">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Last login: {user.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant={user.role === "Super Admin" ? "default" : "secondary"}>{user.role}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">{user.branch}</p>
                        </div>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Role Management
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Role</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="roleName">Role Name</Label>
                          <Input id="roleName" placeholder="Enter role name" />
                        </div>
                        <div>
                          <Label htmlFor="roleDescription">Description</Label>
                          <Input id="roleDescription" placeholder="Enter role description" />
                        </div>
                        <Button onClick={handleCreateRole} className="w-full">
                          Create Role
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{role.name}</h3>
                        <Badge>{role.userCount} users</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Permission Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Role</th>
                        <th className="text-center p-2">Dashboard</th>
                        <th className="text-center p-2">Finance</th>
                        <th className="text-center p-2">Events</th>
                        <th className="text-center p-2">Pastors</th>
                        <th className="text-center p-2">Branches</th>
                        <th className="text-center p-2">Users</th>
                        <th className="text-center p-2">Settings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role.id} className="border-b">
                          <td className="p-2 font-medium">{role.name}</td>
                          <td className="p-2 text-center">
                            <Switch checked={role.permissions.dashboard} />
                          </td>
                          <td className="p-2 text-center">
                            <Switch checked={role.permissions.finance} />
                          </td>
                          <td className="p-2 text-center">
                            <Switch checked={role.permissions.events} />
                          </td>
                          <td className="p-2 text-center">
                            <Switch checked={role.permissions.pastors} />
                          </td>
                          <td className="p-2 text-center">
                            <Switch checked={role.permissions.branches} />
                          </td>
                          <td className="p-2 text-center">
                            <Switch checked={role.permissions.users} />
                          </td>
                          <td className="p-2 text-center">
                            <Switch checked={role.permissions.settings} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
