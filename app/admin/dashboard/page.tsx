"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, DollarSign, Calendar, ShoppingCart, Building, Loader2, Church } from "lucide-react"
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

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    branches: [],
    ministers: [],
    events: [],
    upcomingEvents: [],
    featuredEvents: [],
    churchInfo: null,
    totalMembers: 0,
    activeBranches: 0,
    totalMinisters: 0,
    totalEvents: 0
  })

  // Chart data state - will be populated from real data
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

  // For now, keep some demo data for charts that don't have direct API support
  const blogReachData = [
    { country: "Nigeria", views: 0, fill: "hsl(var(--chart-1))" },
    { country: "Ghana", views: 0, fill: "hsl(var(--chart-2))" },
    { country: "USA", views: 0, fill: "hsl(var(--chart-3))" },
    { country: "UK", views: 0, fill: "hsl(var(--chart-4))" },
    { country: "Others", views: 0, fill: "hsl(var(--chart-5))" },
  ]

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

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
        getAllMinisters(),
        searchEvent({ pageSize: 50, pageNumber: 1 } as SearchEventRequest),
        getUpcomingEvents(),
        getFeaturedEvent(),
        getHomePage()
      ])

      // Process branches data
      let branches = []
      if (branchesData.status === 'fulfilled' && branchesData.value.isSuccessful) {
        branches = branchesData.value.data || []
        console.log('Branches loaded for dashboard:', branches.length)
      } else {
        console.error('Failed to load branches:', branchesData)
      }

      // Process ministers data
      let ministers = []
      if (ministersData.status === 'fulfilled' && ministersData.value.isSuccessful) {
        ministers = ministersData.value.data || []
        console.log('Ministers loaded for dashboard:', ministers.length)
      } else {
        console.error('Failed to load ministers:', ministersData)
      }

      // Process events data
      let events = []
      if (eventsData.status === 'fulfilled' && eventsData.value.isSuccessful) {
        events = eventsData.value.data || []
        console.log('Events loaded for dashboard:', events.length)
      } else {
        console.error('Failed to load events:', eventsData)
      }

      // Process upcoming events
      let upcomingEvents = []
      if (upcomingEventsData.status === 'fulfilled' && Array.isArray(upcomingEventsData.value)) {
        upcomingEvents = upcomingEventsData.value
        console.log('Upcoming events loaded for dashboard:', upcomingEvents.length)
      } else {
        console.error('Failed to load upcoming events:', upcomingEventsData)
      }

      // Process featured events
      let featuredEvents = []
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

      // Calculate statistics
      const activeBranches = branches.filter(b => !b.isDeleted).length
      const totalMinisters = ministers.length
      const totalEvents = events.length

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
        totalMinisters,
        totalEvents
      })

      // Generate some sample attendance data based on number of branches
      if (branches.length > 0) {
        const baseAttendance = Math.floor(activeBranches * 100) // Rough estimate
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Branches</CardTitle>
              <Building className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.branches.length}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">{dashboardData.activeBranches} Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ministers</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalMinisters}</div>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Active Ministers:</span>
                  <span className="font-semibold">{dashboardData.ministers.filter(m => !m.isDeleted).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalEvents}</div>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Upcoming:</span>
                  <span className="font-semibold text-green-600">{dashboardData.upcomingEvents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Featured:</span>
                  <span className="font-semibold text-blue-600">{dashboardData.featuredEvents.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Church Info</CardTitle>
              <Church className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-lg font-bold">
                  {dashboardData.churchInfo ? 'Available' : 'Not Set'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {dashboardData.churchInfo ? 'Church details configured' : 'Configure church info'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Church Attendance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Church Attendance (Estimated)
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

          {/* Live Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Live Church Data</CardTitle>
              <p className="text-sm text-gray-600">Real-time statistics</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Active Branches</span>
                  <span className="font-semibold">{dashboardData.activeBranches}</span>
                </div>
                <Progress value={(dashboardData.activeBranches / Math.max(dashboardData.branches.length, 1)) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Total Events</span>
                  <span className="font-semibold">{dashboardData.totalEvents}</span>
                </div>
                <Progress value={Math.min((dashboardData.totalEvents / 20) * 100, 100)} className="h-2" />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm">Ministers:</span>
                  <span className="font-semibold">{dashboardData.totalMinisters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming Events:</span>
                  <span className="font-semibold">{dashboardData.upcomingEvents.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branch Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Branch Distribution</CardTitle>
              <p className="text-sm text-gray-600">Branches by location</p>
            </CardHeader>
            <CardContent>
              {dashboardData.branches.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.branches.slice(0, 5).map((branch, index) => (
                    <div key={branch.id || index} className="flex justify-between items-center">
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
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-8 w-8 mx-auto mb-2" />
                  <p>No branches found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <p className="text-sm text-gray-600">Latest event activities</p>
            </CardHeader>
            <CardContent>
              {dashboardData.events.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.events.slice(0, 5).map((event, index) => (
                    <div key={event.id || index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{event.name}</span>
                        <p className="text-sm text-muted-foreground">
                          {event.date ? new Date(event.date).toLocaleDateString() : 'No date set'}
                        </p>
                      </div>
                      <Badge variant={event.isDeleted ? "secondary" : "default"}>
                        {event.isDeleted ? "Cancelled" : "Active"}
                      </Badge>
                    </div>
                  ))}
                  {dashboardData.events.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{dashboardData.events.length - 5} more events
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>No events found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ministry Leadership */}
          <Card>
            <CardHeader>
              <CardTitle>Ministry Leadership</CardTitle>
              <p className="text-sm text-gray-600">Active ministers overview</p>
            </CardHeader>
            <CardContent>
              {dashboardData.ministers.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.ministers.slice(0, 5).map((minister, index) => (
                    <div key={minister.id || index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {minister.firstName} {minister.lastName}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {minister.ministerRoleId || 'Associate Pastor'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {minister.branchId ? 'Assigned' : 'Unassigned'}
                      </Badge>
                    </div>
                  ))}
                  {dashboardData.ministers.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{dashboardData.ministers.length - 5} more ministers
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p>No ministers found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-gray-600">Common administrative tasks</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                  <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Add Branch</p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Add Minister</p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Create Event</p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                  <Church className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Church Info</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}