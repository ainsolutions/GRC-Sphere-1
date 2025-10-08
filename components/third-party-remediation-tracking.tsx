"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  TrendingUp,
  Search,
  Filter,
  Target,
  User,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RemediationItem {
  id: number
  remediation_id: string
  gap_analysis_id?: number
  evaluation_id?: number
  vendor_id?: number
  vendor_name?: string
  vendor_type?: string
  gap_title?: string
  gap_severity?: string
  remediation_title: string
  remediation_description?: string
  remediation_type?: string
  assigned_to?: string
  assigned_email?: string
  vendor_contact?: string
  vendor_contact_email?: string
  responsible_department?: string
  start_date?: string
  target_completion_date?: string
  actual_completion_date?: string
  progress_percentage: number
  status: string
  estimated_effort_hours?: number
  actual_effort_hours?: number
  estimated_cost?: number
  actual_cost?: number
  risk_before_remediation?: string
  risk_after_remediation?: string
  business_impact_assessment?: string
  success_criteria?: string
  verification_method?: string
  verification_status?: string
  verification_date?: string
  verified_by?: string
  verification_evidence?: string
  closure_notes?: string
  created_at: string
  updated_at: string
}

interface GapItem {
  id: number
  gap_id: string
  gap_title: string
  gap_description: string
  gap_severity: string
  vendor_id: number
  vendor_name: string
  target_completion_date?: string
  remediation_status: string
  estimated_cost?: number
}

interface RemediationStats {
  total_items: number
  completed: number
  in_progress: number
  open: number
  on_hold: number
  overdue: number
  avg_progress: number
  total_estimated_cost: number
  total_actual_cost: number
}

export function ThirdPartyRemediationTracking() {
  const [remediations, setRemediations] = useState<RemediationItem[]>([])
  const [gaps, setGaps] = useState<GapItem[]>([])
  const [stats, setStats] = useState<RemediationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<RemediationItem | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    gap_analysis_id: "",
    remediation_title: "",
    remediation_description: "",
    remediation_type: "Process Improvement",
    assigned_to: "",
    assigned_email: "",
    vendor_contact: "",
    vendor_contact_email: "",
    responsible_department: "",
    start_date: "",
    target_completion_date: "",
    estimated_effort_hours: "",
    estimated_cost: "",
    risk_before_remediation: "High",
    business_impact_assessment: "",
    success_criteria: "",
    verification_method: "",
  })

  useEffect(() => {
    fetchRemediations()
    fetchGaps()
    fetchStats()
  }, [currentPage, statusFilter, priorityFilter, departmentFilter])

  const fetchRemediations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      })

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (priorityFilter !== "all") {
        params.append("priority", priorityFilter)
      }
      if (departmentFilter !== "all") {
        params.append("department", departmentFilter)
      }

      const response = await fetch(`/api/third-party-risk-remediation-tracking?${params}`)
      const data = await response.json()

      if (data.success) {
        setRemediations(data.data.remediations || [])
        setTotalItems(data.data.pagination?.total || 0)
        setTotalPages(data.data.pagination?.totalPages || 1)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching remediations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch remediation data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchGaps = async () => {
    try {
      const response = await fetch("/api/third-party-gap-analysis")
      const data = await response.json()

      if (data.success) {
        setGaps(data.data.gaps || [])
      }
    } catch (error) {
      console.error("Error fetching gaps:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/third-party-risk-remediation-tracking/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.gap_analysis_id || !formData.remediation_title) {
      toast({
        title: "Error",
        description: "Please select a gap and enter a remediation title",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/third-party-risk-remediation-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          gap_analysis_id: Number.parseInt(formData.gap_analysis_id),
          estimated_effort_hours: formData.estimated_effort_hours ? Number.parseInt(formData.estimated_effort_hours) : null,
          estimated_cost: formData.estimated_cost ? Number.parseFloat(formData.estimated_cost) : null,
          created_by: "Current User", // This should come from auth context
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Remediation created successfully",
        })
        setIsCreateDialogOpen(false)
        setFormData({
          gap_analysis_id: "",
          remediation_title: "",
          remediation_description: "",
          remediation_type: "Process Improvement",
          assigned_to: "",
          assigned_email: "",
          vendor_contact: "",
          vendor_contact_email: "",
          responsible_department: "",
          start_date: "",
          target_completion_date: "",
          estimated_effort_hours: "",
          estimated_cost: "",
          risk_before_remediation: "High",
          business_impact_assessment: "",
          success_criteria: "",
          verification_method: "",
        })
        fetchRemediations()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error creating remediation:", error)
      toast({
        title: "Error",
        description: "Failed to create remediation",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Open":
        return "bg-gray-100 text-gray-800"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "Open":
        return <Clock className="h-4 w-4 text-gray-600" />
      case "On Hold":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const selectedGap = gaps.find(gap => gap.id.toString() === formData.gap_analysis_id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400" id="third-party-risk-remediation-tracking">Third-Party Risk Remediation Tracking</h2>
          <p className="text-gray-600">Track and manage remediation activities for third-party risk gaps</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add Remediation
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-cyan-400">Total Remediations</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_items}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completed} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-cyan-400">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.in_progress}</div>
              <p className="text-xs text-muted-foreground">
                {stats.open} open
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-cyan-400">Average Progress</CardTitle>
              <Progress className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avg_progress}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.overdue} overdue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-cyan-400">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_estimated_cost.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${stats.total_actual_cost.toLocaleString()} actual
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search remediations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Remediations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Remediation Activities</CardTitle>
          <CardDescription>
            Track and manage remediation activities for identified gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading remediations...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {remediations.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-cyan-400 mb-2">No remediations found</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by creating your first remediation activity.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Add Remediation
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Remediation ID</TableHead>
                      <TableHead>Gap</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Target Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remediations.map((remediation) => (
                      <TableRow key={remediation.id}>
                        <TableCell className="font-medium">{remediation.remediation_id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{remediation.gap_title}</div>
                            <Badge variant="outline" className="text-xs">
                              {remediation.gap_severity}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{remediation.vendor_name}</div>
                            <div className="text-sm text-gray-500">{remediation.vendor_type}</div>
                          </div>
                        </TableCell>
                        <TableCell>{remediation.remediation_title}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{remediation.assigned_to}</div>
                            <div className="text-sm text-gray-500">{remediation.assigned_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(remediation.status)}
                            <Badge className={getStatusColor(remediation.status)}>
                              {remediation.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={remediation.progress_percentage} className="w-16" />
                            <span className="text-sm">{remediation.progress_percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {remediation.target_completion_date
                            ? new Date(remediation.target_completion_date).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(remediation)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Remediation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Remediation</DialogTitle>
            <DialogDescription>
              Create a new remediation activity linked to a gap from the gap register.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gap Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="gap_analysis_id">Select Gap *</Label>
                <Select
                  value={formData.gap_analysis_id}
                  onValueChange={(value) => setFormData({ ...formData, gap_analysis_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gap to remediate" />
                  </SelectTrigger>
                  <SelectContent>
                    {gaps.map((gap) => (
                      <SelectItem key={gap.id} value={gap.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{gap.gap_title}</span>
                          <span className="text-sm text-gray-500">
                            {gap.vendor_name} • {gap.gap_severity}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedGap && (
                <Card className="p-4 bg-blue-50">
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900">Selected Gap Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Gap ID:</span> {selectedGap.gap_id}
                      </div>
                      <div>
                        <span className="font-medium">Severity:</span> {selectedGap.gap_severity}
                      </div>
                      <div>
                        <span className="font-medium">Vendor:</span> {selectedGap.vendor_name}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {selectedGap.remediation_status}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Description:</span> {selectedGap.gap_description}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Remediation Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="remediation_title">Remediation Title *</Label>
                <Input
                  id="remediation_title"
                  value={formData.remediation_title}
                  onChange={(e) => setFormData({ ...formData, remediation_title: e.target.value })}
                  placeholder="Enter remediation title"
                />
              </div>
              <div>
                <Label htmlFor="remediation_type">Remediation Type</Label>
                <Select
                  value={formData.remediation_type}
                  onValueChange={(value) => setFormData({ ...formData, remediation_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Process Improvement">Process Improvement</SelectItem>
                    <SelectItem value="Technology Implementation">Technology Implementation</SelectItem>
                    <SelectItem value="Policy Update">Policy Update</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Contract Amendment">Contract Amendment</SelectItem>
                    <SelectItem value="Control Implementation">Control Implementation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="remediation_description">Remediation Description</Label>
              <Textarea
                id="remediation_description"
                value={formData.remediation_description}
                onChange={(e) => setFormData({ ...formData, remediation_description: e.target.value })}
                placeholder="Describe the remediation activities in detail"
                rows={3}
              />
            </div>

            {/* Assignment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assigned_to">Action Owner *</Label>
                <Input
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="Enter action owner name"
                />
              </div>
              <div>
                <Label htmlFor="assigned_email">Action Owner Email</Label>
                <Input
                  id="assigned_email"
                  type="email"
                  value={formData.assigned_email}
                  onChange={(e) => setFormData({ ...formData, assigned_email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor_contact">Vendor Contact</Label>
                <Input
                  id="vendor_contact"
                  value={formData.vendor_contact}
                  onChange={(e) => setFormData({ ...formData, vendor_contact: e.target.value })}
                  placeholder="Enter vendor contact name"
                />
              </div>
              <div>
                <Label htmlFor="vendor_contact_email">Vendor Contact Email</Label>
                <Input
                  id="vendor_contact_email"
                  type="email"
                  value={formData.vendor_contact_email}
                  onChange={(e) => setFormData({ ...formData, vendor_contact_email: e.target.value })}
                  placeholder="Enter vendor contact email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="responsible_department">Responsible Department</Label>
              <Select
                value={formData.responsible_department}
                onValueChange={(value) => setFormData({ ...formData, responsible_department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="target_completion_date">Target Resolution Date *</Label>
                <Input
                  id="target_completion_date"
                  type="date"
                  value={formData.target_completion_date}
                  onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
                />
              </div>
            </div>

            {/* Cost and Effort */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated_effort_hours">Estimated Effort (Hours)</Label>
                <Input
                  id="estimated_effort_hours"
                  type="number"
                  value={formData.estimated_effort_hours}
                  onChange={(e) => setFormData({ ...formData, estimated_effort_hours: e.target.value })}
                  placeholder="Enter estimated hours"
                />
              </div>
              <div>
                <Label htmlFor="estimated_cost">Estimated Cost *</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  step="0.01"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                  placeholder="Enter estimated cost"
                />
              </div>
            </div>

            {/* Risk Assessment */}
            <div>
              <Label htmlFor="risk_before_remediation">Risk Before Remediation</Label>
              <Select
                value={formData.risk_before_remediation}
                onValueChange={(value) => setFormData({ ...formData, risk_before_remediation: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="business_impact_assessment">Business Impact Assessment</Label>
              <Textarea
                id="business_impact_assessment"
                value={formData.business_impact_assessment}
                onChange={(e) => setFormData({ ...formData, business_impact_assessment: e.target.value })}
                placeholder="Describe the business impact of this remediation"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="success_criteria">Success Criteria</Label>
              <Textarea
                id="success_criteria"
                value={formData.success_criteria}
                onChange={(e) => setFormData({ ...formData, success_criteria: e.target.value })}
                placeholder="Define the criteria for successful remediation"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="verification_method">Verification Method</Label>
              <Textarea
                id="verification_method"
                value={formData.verification_method}
                onChange={(e) => setFormData({ ...formData, verification_method: e.target.value })}
                placeholder="Describe how the remediation will be verified"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Remediation</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Remediation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Remediation Details</DialogTitle>
            <DialogDescription>
              View detailed information about the remediation activity.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Remediation ID</Label>
                  <p>{selectedItem.remediation_id}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedItem.status)}
                    <Badge className={getStatusColor(selectedItem.status)}>
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-medium">Title</Label>
                <p>{selectedItem.remediation_title}</p>
              </div>

              {selectedItem.remediation_description && (
                <div>
                  <Label className="font-medium">Description</Label>
                  <p>{selectedItem.remediation_description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Assigned To</Label>
                  <p>{selectedItem.assigned_to}</p>
                </div>
                <div>
                  <Label className="font-medium">Department</Label>
                  <p>{selectedItem.responsible_department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Target Completion</Label>
                  <p>
                    {selectedItem.target_completion_date
                      ? new Date(selectedItem.target_completion_date).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Progress</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedItem.progress_percentage} className="w-32" />
                    <span>{selectedItem.progress_percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Estimated Cost</Label>
                  <p>${selectedItem.estimated_cost?.toLocaleString() || "Not set"}</p>
                </div>
                <div>
                  <Label className="font-medium">Actual Cost</Label>
                  <p>${selectedItem.actual_cost?.toLocaleString() || "Not set"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

