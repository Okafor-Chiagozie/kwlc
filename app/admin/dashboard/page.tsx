"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, DollarSign, Calendar, ShoppingCart } from "lucide-react"
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

// Sample data for charts
const attendanceData = [
  { month: "Jan", attendance: 850 },
  { month: "Feb", attendance: 920 },
  { month: "Mar", attendance: 780 },
  { month: "Apr", attendance: 1050 },
  { month: "May", attendance: 980 },
  { month: "Jun", attendance: 1200 },
  { month: "Jul", attendance: 1100 },
  { month: "Aug", attendance: 950 },
  { month: "Sep", attendance: 1080 },
  { month: "Oct", attendance: 1150 },
  { month: "Nov", attendance: 1300 },
  { month: "Dec", attendance: 1400 },
]

const financeData = [
  { month: "Jan", offering: 2500000, tithe: 800000 },
  { month: "Feb", offering: 2800000, tithe: 900000 },
  { month: "Mar", offering: 2200000, tithe: 750000 },
  { month: "Apr", offering: 3200000, tithe: 1100000 },
  { month: "May", offering: 2900000, tithe: 950000 },
  { month: "Jun", offering: 3500000, tithe: 1200000 },
]

const blogReachData = [
  { country: "Nigeria", views: 12500, fill: "hsl(var(--chart-1))" },
  { country: "Ghana", views: 8200, fill: "hsl(var(--chart-2))" },
  { country: "USA", views: 6800, fill: "hsl(var(--chart-3))" },
  { country: "UK", views: 4500, fill: "hsl(var(--chart-4))" },
  { country: "Others", views: 3200, fill: "hsl(var(--chart-5))" },
]

const eventTicketsData = [
  { event: "Youth Emp.", sold: 120, available: 80 },
  { event: "Women Conf.", sold: 200, available: 50 },
  { event: "Men's Retreat", sold: 85, available: 115 },
  { event: "Kids Camp", sold: 150, available: 100 },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234,240</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">33,344</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">65</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Church Workers</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Ministers:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Choir:</span>
                  <span className="font-semibold">34</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ushers:</span>
                  <span className="font-semibold">15</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Offering</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦34,234,240</div>
              <div className="text-sm text-green-600 mt-1">+12% from last month</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Tithe</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦4,234,240</div>
              <div className="text-sm text-green-600 mt-1">+8% from last month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Church Attendance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Church Attendance
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

          {/* Finance Report */}
          <Card>
            <CardHeader>
              <CardTitle>Church Finance</CardTitle>
              <p className="text-sm text-gray-600">Today, 20th April</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Church Development Project</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Target: ₦70,000</span>
                  <span>Target: ₦100,000</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm">Offering:</span>
                  <span className="font-semibold">₦34,234,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tithe:</span>
                  <span className="font-semibold">₦4,234,240</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Finance Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Finance Trends</CardTitle>
              <p className="text-sm text-gray-600">Monthly Offering vs Tithe</p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  offering: {
                    label: "Offering",
                    color: "hsl(var(--chart-1))",
                  },
                  tithe: {
                    label: "Tithe",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="offering" fill="var(--color-offering)" />
                    <Bar dataKey="tithe" fill="var(--color-tithe)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Website Reach */}
          <Card>
            <CardHeader>
              <CardTitle>Website Reach by Country</CardTitle>
              <p className="text-sm text-gray-600">Total views: 35,200</p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  views: {
                    label: "Views",
                  },
                  Nigeria: {
                    label: "Nigeria",
                    color: "hsl(var(--chart-1))",
                  },
                  Ghana: {
                    label: "Ghana",
                    color: "hsl(var(--chart-2))",
                  },
                  USA: {
                    label: "USA",
                    color: "hsl(var(--chart-3))",
                  },
                  UK: {
                    label: "UK",
                    color: "hsl(var(--chart-4))",
                  },
                  Others: {
                    label: "Others",
                    color: "hsl(var(--chart-5))",
                  },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie data={blogReachData} cx="50%" cy="50%" outerRadius={80} dataKey="views">
                      {blogReachData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {blogReachData.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill.replace("hsl(var(--chart-", "hsl(").replace("))", ")") }}
                      />
                      {item.country}
                    </span>
                    <span className="font-medium">{item.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Tickets Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Event Ticket Sales</CardTitle>
              <p className="text-sm text-gray-600">Current events performance</p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sold: {
                    label: "Sold",
                    color: "hsl(var(--chart-1))",
                  },
                  available: {
                    label: "Available",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventTicketsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="event" type="category" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sold" fill="var(--color-sold)" />
                    <Bar dataKey="available" fill="var(--color-available)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Store Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Store Activities</CardTitle>
              <Badge variant="outline">Weekly</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Events</h4>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">Youth Empowerment Program</p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>120 Tickets Sold</span>
                    <span>200 Available</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Store</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Number of goods available:</span>
                    <span className="font-semibold">345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sold goods:</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Awaiting delivery:</span>
                    <span className="font-semibold">2</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
