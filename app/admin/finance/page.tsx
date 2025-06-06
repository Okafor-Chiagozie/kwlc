"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, DollarSign, TrendingUp, Calendar, Eye } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { Textarea } from "@/components/ui/textarea"

export default function FinancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const reports = [
    {
      id: 1,
      title: "Monthly Financial Report - March 2024",
      branch: "Main Branch - Lagos",
      uploadDate: "2024-03-31",
      amount: "₦45,234,567",
      status: "approved",
    },
    {
      id: 2,
      title: "Weekly Service Report - Week 12",
      branch: "Abuja Branch",
      uploadDate: "2024-03-24",
      amount: "₦8,456,789",
      status: "pending",
    },
    {
      id: 3,
      title: "Special Event Collection - Easter",
      branch: "Port Harcourt Branch",
      uploadDate: "2024-03-31",
      amount: "₦12,345,678",
      status: "approved",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Finance Management</h1>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦65,036,034</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tithes</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₦34,234,240</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offerings</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₦28,456,789</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Special Gifts</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₦2,345,005</div>
              <p className="text-xs text-muted-foreground">Projects & Events</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
            <TabsTrigger value="upload">Upload Report</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branch Financial Reports</CardTitle>
                <p className="text-sm text-muted-foreground">View and manage financial reports from all branches</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">{report.branch}</p>
                          <p className="text-sm text-muted-foreground">Uploaded: {report.uploadDate}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-semibold text-lg">{report.amount}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={report.status === "approved" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Report Form</CardTitle>
                <p className="text-sm text-muted-foreground">Submit financial report for church service</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6">
                  {/* Header Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input id="branch" placeholder="Select branch" />
                    </div>
                    <div>
                      <Label htmlFor="service">Service</Label>
                      <Input id="service" placeholder="e.g., First Service, Bible Study" />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>

                  {/* Service Report Sheet */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Service Report Sheet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="topic">Topic</Label>
                        <Input id="topic" placeholder="Service topic" />
                      </div>
                      <div>
                        <Label htmlFor="text">Text</Label>
                        <Input id="text" placeholder="Bible text/reference" />
                      </div>
                      <div>
                        <Label htmlFor="preacher">Preacher</Label>
                        <Input id="preacher" placeholder="Name of preacher" />
                      </div>
                      <div>
                        <Label htmlFor="programme">Programme</Label>
                        <Input id="programme" placeholder="Service programme" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input id="venue" placeholder="Service venue" />
                      </div>
                    </div>
                  </div>

                  {/* Financial Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Financial Report</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 text-left">Subject</th>
                            <th className="border border-gray-300 p-2 text-center">Cash (₦)</th>
                            <th className="border border-gray-300 p-2 text-center">Cheque</th>
                            <th className="border border-gray-300 p-2 text-center">Foreign Currency</th>
                            <th className="border border-gray-300 p-2 text-center">Total (₦)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            "Normal Offering",
                            "Tithe Offering",
                            "Seed Faith",
                            "Testimony Offering",
                            "Special Thanksgiving",
                            "Child Dedication",
                            "Project Building",
                            "Others",
                          ].map((subject) => (
                            <tr key={subject}>
                              <td className="border border-gray-300 p-2 font-medium">{subject}</td>
                              <td className="border border-gray-300 p-1">
                                <Input className="border-0 text-center" placeholder="0.00" />
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input className="border-0 text-center" placeholder="0.00" />
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input className="border-0 text-center" placeholder="0.00" />
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input className="border-0 text-center" placeholder="0.00" readOnly />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-bold">
                            <td className="border border-gray-300 p-2">TOTAL</td>
                            <td className="border border-gray-300 p-1">
                              <Input className="border-0 text-center font-bold" readOnly />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input className="border-0 text-center font-bold" readOnly />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input className="border-0 text-center font-bold" readOnly />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input className="border-0 text-center font-bold" readOnly />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Amount in Words */}
                  <div>
                    <Label htmlFor="amountWords">Amount In Words</Label>
                    <Textarea id="amountWords" placeholder="Write total amount in words" rows={2} />
                  </div>

                  {/* Attendance */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Attendance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                      <div>
                        <Label htmlFor="men">Men</Label>
                        <Input id="men" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="women">Women</Label>
                        <Input id="women" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="teenagers">Teenagers</Label>
                        <Input id="teenagers" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="children">Children</Label>
                        <Input id="children" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="total">Total</Label>
                        <Input id="total" type="number" placeholder="0" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="visitors">Visitors</Label>
                        <Input id="visitors" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="newConverts">New Converts</Label>
                        <Input id="newConverts" type="number" placeholder="0" />
                      </div>
                    </div>
                  </div>

                  {/* Kingdom Light */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Kingdom Light</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="noSupplied">No Supplied</Label>
                        <Input id="noSupplied" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="amountPaid">Amount Paid</Label>
                        <Input id="amountPaid" placeholder="₦0.00" />
                      </div>
                      <div>
                        <Label htmlFor="evidencePayment">Evidence of Payment</Label>
                        <Input id="evidencePayment" placeholder="Receipt/Reference number" />
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Approval</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preparedBy">Prepared by</Label>
                        <Input id="preparedBy" placeholder="Name of preparer" />
                      </div>
                      <div>
                        <Label htmlFor="checkedBy">Checked by</Label>
                        <Input id="checkedBy" placeholder="Name of checker" />
                      </div>
                      <div>
                        <Label htmlFor="receivedBy">Received by</Label>
                        <Input id="receivedBy" placeholder="Name of receiver" />
                      </div>
                      <div>
                        <Label htmlFor="approvedBy">Approved by Resident Pastor</Label>
                        <Input id="approvedBy" placeholder="Pastor's name" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      Save as Draft
                    </Button>
                    <Button type="submit">Submit Report</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                      <p>Financial Trends Chart</p>
                      <p className="text-sm">Income vs Expenses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branch Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Lagos (Main)</span>
                      <span className="font-semibold">₦45,234,567</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Abuja</span>
                      <span className="font-semibold">₦12,456,789</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Port Harcourt</span>
                      <span className="font-semibold">₦8,345,678</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Kano</span>
                      <span className="font-semibold">₦5,234,567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
