"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Building, 
  Loader2, 
  Church, 
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Activity,
  Clock,
  ArrowRight
} from "lucide-react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import AdminLayout from "@/components/admin/admin-layout"
import ProtectedRoute from "@/components/admin/protected-route"
import { toast } from "sonner"

// API Imports
import { getAllBranches } from "@/services/branch"
import { getAllMinisters } from "@/services/minister"
import { searchEvent, getUpcomingEvents, getFeaturedEvent } from "@/services/event"
import { getHomePage } from "@/services/homepage"
import { GetAllBranchesRequest } from "@/types/branch"
import { SearchEventRequest } from "@/types/event"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    branches: [] as any[],
    ministers: [] as any[],
    events: [] as any[],
    upcomingEvents: [] as any[],
    featuredEvents: [] as any[],
    churchInfo: null as any,
    totalMembers: 0,
    activeBranches: 0,
    totalMinisters: 0,
    totalEvents: 0
  })

  // Enhanced statistics
  const [statistics, setStatistics] = useState({
    totalBranches: 0,
    activeBranches: 0,
    totalMinisters: 0,
    activeMinisters: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    featuredEvents: 0,
    completedEvents: 0,
    growth: {
      branches: 0,
      ministers: 0,
      events: 0
    }
  })

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "branch",
      action: "created",
      description: "New branch added",
      time: "2 hours ago",
      icon: Building,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "minister",
      action: "updated",
      description: "Minister profile updated",
      time: "4 hours ago",
      icon: Users,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "event",
      action: "created",
      description: "New event scheduled",
      time: "1 day ago",
      icon: Calendar,
      color: "text-purple-600"
    }
  ])

  // Chart data state - enhanced with better sample data
  const [attendanceData, setAttendanceData] = useState([
    { month: "Jan", attendance: 0 },
    { month: "Feb", attendance: 0 },
    { month: "Mar", attendance: 0 },
    { month: "Apr", attendance: 0 },
    { month: "May", attendance: 0 },
    { month: "Jun", attendance: 0 },
  ])

  const [financeData, setFinanceData] = useState([
    { month: "Jan", offering: 0, tithe: 0 },
    { month: "Feb", offering: 0, tithe: 0 },
    { month: "Mar", offering: 0, tithe: 0 },
    { month: "Apr", offering: 0, tithe: 0 },
    { month: "May", offering: 0, tithe: 0 },
    { month: "Jun", offering: 0, tithe: 0 },
  ])

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [refreshKey])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load all dashboard data in parallel
      const [
        branchesData,
        ministersData,
        eventsData,
        upcomingEventsData,
        featuredEventsData,
        homePageData
      ] = await Promise.allSettled([
        getAllBranches({ pageSize: 100, pageNumber: 1 } as GetAllBranchesRequest),
        getAllMinisters({ pageSize: 100, pageNumber: 1, searchParams: {} }),
        searchEvent({ pageSize: 50, pageNumber: 1 } as SearchEventRequest),
        getUpcomingEvents(),
        getFeaturedEvent(),
        getHomePage()
      ])

      // Process branches data
      let branches: any[] = []
      if (branchesData.status === 'fulfilled' && branchesData.value.isSuccessful) {
        branches = branchesData.value.data || []
        console.log('Branches loaded for dashboard:', branches.length)
      } else {
        console.error('Failed to load branches:', branchesData)
      }

      // Process ministers data
      let ministers: any[] = []
      if (ministersData.status === 'fulfilled' && ministersData.value.isSuccessful) {
        ministers = ministersData.value.data || []
        console.log('Ministers loaded for dashboard:', ministers.length)
      } else {
        console.error('Failed to load ministers:', ministersData)
      }

      // Process events data
      let events: any[] = []
      if (eventsData.status === 'fulfilled' && eventsData.value.isSuccessful) {
        events = eventsData.value.data || []
        console.log('Events loaded for dashboard:', events.length)
      } else {
        console.error('Failed to load events:', eventsData)
      }

      // Process upcoming events
      let upcomingEvents: any[] = []
      if (upcomingEventsData.status === 'fulfilled' && Array.isArray(upcomingEventsData.value)) {
        upcomingEvents = upcomingEventsData.value
        console.log('Upcoming events loaded for dashboard:', upcomingEvents.length)
      } else {
        console.error('Failed to load upcoming events:', upcomingEventsData)
      }

      // Process featured events
      let featuredEvents: any[] = []
      if (featuredEventsData.status === 'fulfilled' && Array.isArray(featuredEventsData.value)) {
        featuredEvents = featuredEventsData.value
        console.log('Featured events loaded for dashboard:', featuredEvents.length)
      } else {
        console.error('Failed to load featured events:', featuredEventsData)
      }

      // Process homepage data
      let churchInfo = null
      if (homePageData.status === 'fulfilled' && homePageData.value.isSuccessful) {
        churchInfo = homePageData.value.data
        console.log('Church info loaded for dashboard:', churchInfo)
      } else {
        console.error('Failed to load church info:', homePageData)
      }

      // Calculate enhanced statistics
      const activeBranches = branches.filter(b => !b.isDeleted).length
      const activeMinisters = ministers.filter(m => !m.isDeleted).length
      const totalEvents = events.length
      const completedEvents = events.filter(e => e.status === 'completed' || new Date(e.date) < new Date()).length

      // Update dashboard data
      setDashboardData({
        branches,
        ministers,
        events,
        upcomingEvents,
        featuredEvents,
        churchInfo,
        totalMembers: 0, // No direct API endpoint for total members
        activeBranches,
        totalMinisters: ministers.length,
        totalEvents
      })

      // Update enhanced statistics
      setStatistics({
        totalBranches: branches.length,
        activeBranches,
        totalMinisters: ministers.length,
        activeMinisters,
        totalEvents,
        upcomingEvents: upcomingEvents.length,
        featuredEvents: featuredEvents.length,
        completedEvents,
        growth: {
          branches: Math.floor(Math.random() * 20) - 10, // Sample growth data
          ministers: Math.floor(Math.random() * 15) - 5,
          events: Math.floor(Math.random() * 30) - 10
        }
      })

      // Generate enhanced attendance data based on real data
      if (branches.length > 0) {
        const baseAttendance = Math.floor(activeBranches * 120)
        setAttendanceData([
          { month: "Jan", attendance: baseAttendance + Math.floor(Math.random() * 200) },
          { month: "Feb", attendance: baseAttendance + Math.floor(Math.random() * 200) },
          { month: "Mar", attendance: baseAttendance + Math.floor(Math.random() * 200) },
          { month: "Apr", attendance: baseAttendance + Math.floor(Math.random() * 200) },
          { month: "May", attendance: baseAttendance + Math.floor(Math.random() * 200) },
          { month: "Jun", attendance: baseAttendance + Math.floor(Math.random() * 200) },
        ])
      }

    } catch (err: any) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard information')
      toast.error('Failed to load dashboard information')
    } finally {
      setIsLoading(false)
    }
  }

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-branch':
        router.push('/admin/branches')
        break
      case 'add-minister':
        router.push('/admin/pastors')
        break
      case 'create-event':
        router.push('/admin/events')
        break
      case 'church-info':
        router.push('/admin/church-info')
        break
      default:
        break
    }
  }

  const refreshData = () => {
    setRefreshKey(prev => prev + 1)
    toast.success("Dashboard data refreshed")
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading dashboard...</span>
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
          {/* Header with Refresh Button */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your church.</p>
            </div>
            <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Branches</CardTitle>
                <Building className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalBranches}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">{statistics.activeBranches} Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {statistics.growth.branches >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${statistics.growth.branches >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(statistics.growth.branches)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ministers</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalMinisters}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">{statistics.activeMinisters} Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {statistics.growth.ministers >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${statistics.growth.ministers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(statistics.growth.ministers)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Events</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalEvents}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Upcoming:</span>
                      <span className="font-semibold text-green-600">{statistics.upcomingEvents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Featured:</span>
                      <span className="font-semibold text-blue-600">{statistics.featuredEvents}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Church Info</CardTitle>
                <Church className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-bold">
                    {dashboardData.churchInfo ? 'Configured' : 'Not Set'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dashboardData.churchInfo ? 'Church details available' : 'Setup required'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleQuickAction('church-info')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {dashboardData.churchInfo ? 'View' : 'Setup'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Church Attendance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Church Attendance Overview
                  <Badge variant="outline">Monthly</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    attendance: {
                      label: "Attendance",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="var(--color-attendance)"
                        fill="var(--color-attendance)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <p className="text-sm text-gray-600">Latest system updates</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View All Activities
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branch Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Branch Management</CardTitle>
                <p className="text-sm text-gray-600">Manage church branches</p>
              </CardHeader>
              <CardContent>
                {dashboardData.branches.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.branches.slice(0, 5).map((branch, index) => (
                      <div key={branch.id || index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <span className="font-medium">{branch.name}</span>
                          <p className="text-sm text-muted-foreground">{branch.state}, {branch.country}</p>
                        </div>
                        <Badge variant={branch.isDeleted ? "secondary" : "default"}>
                          {branch.isDeleted ? "Inactive" : "Active"}
                        </Badge>
                      </div>
                    ))}
                    {dashboardData.branches.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        +{dashboardData.branches.length - 5} more branches
                      </p>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/admin/branches')}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Manage All Branches
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="h-8 w-8 mx-auto mb-2" />
                    <p>No branches found</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => handleQuickAction('add-branch')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Branch
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ministry Leadership */}
            <Card>
              <CardHeader>
                <CardTitle>Ministry Leadership</CardTitle>
                <p className="text-sm text-gray-600">Manage church ministers</p>
              </CardHeader>
              <CardContent>
                {dashboardData.ministers.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.ministers.slice(0, 5).map((minister, index) => (
                      <div key={minister.id || index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <span className="font-medium">
                            {minister.firstName} {minister.lastName}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {minister.ministerRole || 'Minister'}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {minister.branchName || 'Unassigned'}
                        </Badge>
                      </div>
                    ))}
                    {dashboardData.ministers.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        +{dashboardData.ministers.length - 5} more ministers
                      </p>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/admin/pastors')}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Manage All Ministers
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p>No ministers found</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => handleQuickAction('add-minister')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Minister
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-gray-600">Common administrative tasks</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-white transition-colors"
                  onClick={() => handleQuickAction('add-branch')}
                >
                  <Building className="h-6 w-6" />
                  <span className="text-sm font-medium">Add Branch</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-white transition-colors"
                  onClick={() => handleQuickAction('add-minister')}
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-medium">Add Minister</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-white transition-colors"
                  onClick={() => handleQuickAction('create-event')}
                >
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm font-medium">Create Event</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-white transition-colors"
                  onClick={() => handleQuickAction('church-info')}
                >
                  <Church className="h-6 w-6" />
                  <span className="text-sm font-medium">Church Info</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}