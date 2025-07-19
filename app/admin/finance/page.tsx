"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, DollarSign, TrendingUp, Calendar, Eye, Loader2, Save, Plus } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  createBranchReport,
  updateBranchReport,
  getBranchReports,
  getBranchReport,
  deleteBranchReport
} from "@/services/branch"
import { getAllBranches } from "@/services/branch"
import {
  CreateBranchReportRequest,
  UpdateBranchReportRequest,
  GetBranchReportsRequest,
  PaymentMethod,
  PaymentChannel,
  PaymentType
} from "@/types/branch"

export default function FinancePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data States
  const [branches, setBranches] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)

  // Report Form State
  const [reportForm, setReportForm] = useState<CreateBranchReportRequest>({
    id: null,
    branchId: 0,
    preacher: "",
    topic: "",
    programme: "",
    venue: "",
    reportWeek: new Date().toISOString(),
    recordUpdatedBy: "",
    attendance: {
      id: 0,
      branchReportId: 0,
      totalCount: 0,
      menCount: 0,
      womenCount: 0,
      childrenCount: 0,
      teenagersCount: 0,
      recordedBy: ""
    },
    financialRecord: {
      id: null,
      branchReportId: 0,
      totalAmount: 0,
      branchId: 0,
      paymentMethodId: PaymentMethod.Cash,
      paymentChannelId: PaymentChannel.Fincra,
      paymentTypeId: PaymentType.NormalOffering,
      recordedBy: "",
      normalOffering: 0,
      testimonyOffering: 0,
      titheOffering: 0,
      seedFaith: 0,
      specialThanksgiving: 0,
      childDedication: 0,
      others: 0,
      lga: "",
      state: "",
      branch: "",
      address: "",
      country: "",
      isDeleted: false,
      updatedBy: "",
      dateDeleted: undefined
    }
  })

  // Load initial data
  useEffect(() => {
    loadFinanceData()
  }, [])

  // Load reports when branch is selected
  useEffect(() => {
    if (selectedBranch) {
      loadBranchReports(selectedBranch)
    }
  }, [selectedBranch])

  const loadFinanceData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load branches
      const branchesData = await getAllBranches({ pageSize: 100, pageNumber: 1 })

      if (branchesData.isSuccessful) {
        setBranches(branchesData.data || [])
        console.log('Branches loaded:', branchesData.data)
        
        // Auto-select first branch if available
        if (branchesData.data && branchesData.data.length > 0) {
          setSelectedBranch(branchesData.data[0].id)
        }
      } else {
        console.error('Failed to load branches:', branchesData)
        toast.error('Failed to load branches data')
      }

    } catch (err: any) {
      console.error('Error loading finance data:', err)
      setError('Failed to load finance information')
      toast.error('Failed to load finance information')
    } finally {
      setIsLoading(false)
    }
  }

  const loadBranchReports = async (branchId: number) => {
    try {
      const searchFilter: GetBranchReportsRequest = {
        pageSize: 50,
        pageNumber: 1,
        searchParams: {}
      }

      const response = await getBranchReports(branchId, searchFilter)

      if (response.isSuccessful) {
        setReports(response.data || [])
        console.log('Branch reports loaded:', response.data)
      } else {
        console.error('Failed to load branch reports:', response)
        toast.error('Failed to load branch reports')
      }
    } catch (err: any) {
      console.error('Error loading branch reports:', err)
      toast.error('Failed to load branch reports')
    }
  }

  const handleCreateReport = async () => {
    try {
      // Validate required fields
      if (!reportForm.branchId || !reportForm.preacher.trim() || !reportForm.topic.trim()) {
        toast.error('Please fill in all required fields (Branch, Preacher, Topic)')
        return
      }

      setIsSaving(true)

      // Calculate totals
      const financialRecord = {
        ...reportForm.financialRecord,
        branchId: reportForm.branchId,
        totalAmount: 
          reportForm.financialRecord.normalOffering +
          reportForm.financialRecord.testimonyOffering +
          reportForm.financialRecord.titheOffering +
          reportForm.financialRecord.seedFaith +
          reportForm.financialRecord.specialThanksgiving +
          reportForm.financialRecord.childDedication +
          reportForm.financialRecord.others
      }

      const attendance = {
        ...reportForm.attendance,
        totalCount: 
          reportForm.attendance.menCount +
          reportForm.attendance.womenCount +
          reportForm.attendance.childrenCount +
          reportForm.attendance.teenagersCount
      }

      const reportData: CreateBranchReportRequest = {
        ...reportForm,
        financialRecord,
        attendance
      }

      const response = await createBranchReport(reportData)

      if (response.isSuccessful) {
        toast.success('Financial report created successfully!')
        
        // Reset form
        setReportForm({
          id: null,
          branchId: 0,
          preacher: "",
          topic: "",
          programme: "",
          venue: "",
          reportWeek: new Date().toISOString(),
          recordUpdatedBy: "",
          attendance: {
            id: 0,
            branchReportId: 0,
            totalCount: 0,
            menCount: 0,
            womenCount: 0,
            childrenCount: 0,
            teenagersCount: 0,
            recordedBy: ""
          },
          financialRecord: {
            id: null,
            branchReportId: 0,
            totalAmount: 0,
            branchId: 0,
            paymentMethodId: PaymentMethod.Cash,
            paymentChannelId: PaymentChannel.Fincra,
            paymentTypeId: PaymentType.NormalOffering,
            recordedBy: "",
            normalOffering: 0,
            testimonyOffering: 0,
            titheOffering: 0,
            seedFaith: 0,
            specialThanksgiving: 0,
            childDedication: 0,
            others: 0,
            lga: "",
            state: "",
            branch: "",
            address: "",
            country: "",
            isDeleted: false,
            updatedBy: "",
            dateDeleted: undefined
          }
        })
        
        // Reload reports
        if (selectedBranch) {
          loadBranchReports(selectedBranch)
        }
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to create report')
      }
    } catch (err: any) {
      console.error('Error creating report:', err)
      toast.error(err.message || 'Failed to create financial report')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteReport = async (branchId: number, reportId: number) => {
    try {
      if (!confirm('Are you sure you want to delete this financial report?')) return

      const response = await deleteBranchReport(branchId, reportId)

      if (response.isSuccessful) {
        toast.success('Financial report deleted successfully!')
        if (selectedBranch) {
          loadBranchReports(selectedBranch)
        }
      } else {
        const errorMessage = response.errors?.map(e => e.description).join(', ') || response.responseMessage
        throw new Error(errorMessage || 'Failed to delete report')
      }
    } catch (err: any) {
      console.error('Error deleting report:', err)
      toast.error(err.message || 'Failed to delete financial report')
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const calculateTotalIncome = (): number => {
    return reports.reduce((total, report) => {
      return total + (report.financialRecord?.totalAmount || 0)
    }, 0)
  }

  const calculateTithes = (): number => {
    return reports.reduce((total, report) => {
      return total + (report.financialRecord?.titheOffering || 0)
    }, 0)
  }

  const calculateOfferings = (): number => {
    return reports.reduce((total, report) => {
      return total + (report.financialRecord?.normalOffering || 0) + (report.financialRecord?.testimonyOffering || 0)
    }, 0)
  }

  const calculateSpecialGifts = (): number => {
    return reports.reduce((total, report) => {
      return total + (report.financialRecord?.seedFaith || 0) + 
             (report.financialRecord?.specialThanksgiving || 0) + 
             (report.financialRecord?.childDedication || 0) + 
             (report.financialRecord?.others || 0)
    }, 0)
  }

  const getBranchName = (branchId: number): string => {
    const branch = branches.find(b => b.id === branchId)
    return branch ? branch.name : `Branch ID: ${branchId}`
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading finance information...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Finance Management</h1>
          <div className="flex gap-2">
            <Select value={selectedBranch?.toString() || undefined} onValueChange={(value) => setSelectedBranch(Number(value))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotalIncome())}</div>
              <p className="text-xs text-muted-foreground">All reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tithes</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(calculateTithes())}</div>
              <p className="text-xs text-muted-foreground">Tithe offerings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offerings</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(calculateOfferings())}</div>
              <p className="text-xs text-muted-foreground">Regular & testimony</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Special Gifts</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(calculateSpecialGifts())}</div>
              <p className="text-xs text-muted-foreground">Projects & special</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
            <TabsTrigger value="upload">Create Report</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branch Financial Reports</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and manage financial reports from {selectedBranch ? getBranchName(selectedBranch) : 'all branches'}
                </p>
              </CardHeader>
              <CardContent>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{report.topic || 'Service Report'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Preacher: {report.preacher} | Programme: {report.programme}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Date: {new Date(report.reportWeek).toLocaleDateString()} | Venue: {report.venue}
                            </p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                              <span>Attendance: {report.attendance?.totalCount || 0}</span>
                              <span>Men: {report.attendance?.menCount || 0}</span>
                              <span>Women: {report.attendance?.womenCount || 0}</span>
                              <span>Children: {report.attendance?.childrenCount || 0}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="font-semibold text-lg">
                            {formatCurrency(report.financialRecord?.totalAmount || 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Tithes: {formatCurrency(report.financialRecord?.titheOffering || 0)}</div>
                            <div>Offerings: {formatCurrency((report.financialRecord?.normalOffering || 0) + (report.financialRecord?.testimonyOffering || 0))}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Submitted</Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteReport(report.branchId, report.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No financial reports found</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBranch ? 'Create a new report to get started' : 'Select a branch to view reports'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Financial Report</CardTitle>
                <p className="text-sm text-muted-foreground">Submit financial report for church service</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {/* Header Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="branch">Branch *</Label>
                      <Select 
                        value={reportForm.branchId?.toString() || undefined} 
                        onValueChange={(value) => setReportForm({ ...reportForm, branchId: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="programme">Programme *</Label>
                      <Input 
                        id="programme" 
                        placeholder="e.g., First Service, Bible Study"
                        value={reportForm.programme}
                        onChange={(e) => setReportForm({ ...reportForm, programme: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reportWeek">Date *</Label>
                      <Input 
                        id="reportWeek" 
                        type="date"
                        value={reportForm.reportWeek.split('T')[0]}
                        onChange={(e) => setReportForm({ ...reportForm, reportWeek: e.target.value + 'T00:00:00.000Z' })}
                      />
                    </div>
                  </div>

                  {/* Service Report Sheet */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Service Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="topic">Topic *</Label>
                        <Input 
                          id="topic" 
                          placeholder="Service topic"
                          value={reportForm.topic}
                          onChange={(e) => setReportForm({ ...reportForm, topic: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="preacher">Preacher *</Label>
                        <Input 
                          id="preacher" 
                          placeholder="Name of preacher"
                          value={reportForm.preacher}
                          onChange={(e) => setReportForm({ ...reportForm, preacher: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input 
                          id="venue" 
                          placeholder="Service venue"
                          value={reportForm.venue}
                          onChange={(e) => setReportForm({ ...reportForm, venue: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Financial Report</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { key: 'normalOffering', label: 'Normal Offering' },
                        { key: 'titheOffering', label: 'Tithe Offering' },
                        { key: 'seedFaith', label: 'Seed Faith' },
                        { key: 'testimonyOffering', label: 'Testimony Offering' },
                        { key: 'specialThanksgiving', label: 'Special Thanksgiving' },
                        { key: 'childDedication', label: 'Child Dedication' },
                        { key: 'others', label: 'Others' }
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <Label htmlFor={key}>{label}</Label>
                          <Input
                            id={key}
                            type="number"
                            placeholder="0.00"
                            value={reportForm.financialRecord[key as keyof typeof reportForm.financialRecord] || ''}
                            onChange={(e) => setReportForm({
                              ...reportForm,
                              financialRecord: {
                                ...reportForm.financialRecord,
                                [key]: Number(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="font-semibold">
                        Total Amount: {formatCurrency(
                          reportForm.financialRecord.normalOffering +
                          reportForm.financialRecord.titheOffering +
                          reportForm.financialRecord.seedFaith +
                          reportForm.financialRecord.testimonyOffering +
                          reportForm.financialRecord.specialThanksgiving +
                          reportForm.financialRecord.childDedication +
                          reportForm.financialRecord.others
                        )}
                      </Label>
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Attendance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { key: 'menCount', label: 'Men' },
                        { key: 'womenCount', label: 'Women' },
                        { key: 'teenagersCount', label: 'Teenagers' },
                        { key: 'childrenCount', label: 'Children' }
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <Label htmlFor={key}>{label}</Label>
                          <Input
                            id={key}
                            type="number"
                            placeholder="0"
                            value={reportForm.attendance[key as keyof typeof reportForm.attendance] || ''}
                            onChange={(e) => setReportForm({
                              ...reportForm,
                              attendance: {
                                ...reportForm.attendance,
                                [key]: Number(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                      ))}
                      <div>
                        <Label>Total</Label>
                        <Input
                          type="number"
                          value={
                            reportForm.attendance.menCount +
                            reportForm.attendance.womenCount +
                            reportForm.attendance.teenagersCount +
                            reportForm.attendance.childrenCount
                          }
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Record Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="recordedBy">Recorded By</Label>
                        <Input
                          id="recordedBy"
                          placeholder="Name of person recording"
                          value={reportForm.attendance.recordedBy}
                          onChange={(e) => setReportForm({
                            ...reportForm,
                            attendance: { ...reportForm.attendance, recordedBy: e.target.value },
                            financialRecord: { ...reportForm.financialRecord, recordedBy: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="recordUpdatedBy">Report Updated By</Label>
                        <Input
                          id="recordUpdatedBy"
                          placeholder="Name of person updating report"
                          value={reportForm.recordUpdatedBy}
                          onChange={(e) => setReportForm({ ...reportForm, recordUpdatedBy: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button 
                      onClick={handleCreateReport}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Income</span>
                      <span className="font-semibold">{formatCurrency(calculateTotalIncome())}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tithes</span>
                      <span className="font-semibold">{formatCurrency(calculateTithes())}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Offerings</span>
                      <span className="font-semibold">{formatCurrency(calculateOfferings())}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Special Gifts</span>
                      <span className="font-semibold">{formatCurrency(calculateSpecialGifts())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branch Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Branches</span>
                      <span className="font-semibold">{branches.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Reports</span>
                      <span className="font-semibold">{reports.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Branch</span>
                      <span className="font-semibold">{selectedBranch ? getBranchName(selectedBranch) : 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average per Report</span>
                      <span className="font-semibold">
                        {reports.length > 0 ? formatCurrency(calculateTotalIncome() / reports.length) : formatCurrency(0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Branch Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Branch Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Financial performance by branch</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map(branch => {
                    const branchReports = reports.filter(r => r.branchId === branch.id)
                    const branchTotal = branchReports.reduce((total, report) => {
                      return total + (report.financialRecord?.totalAmount || 0)
                    }, 0)
                    
                    return (
                      <div key={branch.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{branch.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {branchReports.length} report{branchReports.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(branchTotal)}</div>
                          <p className="text-sm text-muted-foreground">
                            Avg: {branchReports.length > 0 ? formatCurrency(branchTotal / branchReports.length) : formatCurrency(0)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}