"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Eye,
  RefreshCw,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  DollarSign,
  Clock,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DepartmentSelectInput from "@/components/department-search-input"
import UnitSelectInput from "@/components/unit-search-input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ActionButtons } from "./ui/action-buttons"

interface IncidentRemediation {
  id: number
  remediation_id: string
  incident_id: string
  incident_title: string
  incident_type: string
  incident_severity: string
  remediation_title: string
  remediation_description: string
  remediation_type: string
  status: string
  priority: string
  assigned_to: string
  assigned_email: string
  responsible_department: string
  responsible_manager: string
  start_date: string
  target_completion_date: string
  actual_completion_date: string
  progress_percentage: number
  estimated_effort_hours: number
  actual_effort_hours: number
  estimated_cost: number
  actual_cost: number
  risk_before_remediation: string
  risk_after_remediation: string
  business_impact_assessment: string
  verification_status: string
  verification_date: string
  verified_by: string
  success_criteria: string
  effectiveness_rating: number
  lessons_learned: string
  is_overdue: boolean
  created_at: string
  updated_at: string
}

interface RemediationStats {
  total_remediations: number
  open_remediations: number
  in_progress_remediations: number
  completed_remediations: number
  verified_remediations: number
  overdue_remediations: number
  pending_verification: number
  critical_priority: number
  high_priority: number
  escalated_remediations: number
  total_estimated_cost: number
  total_actual_cost: number
  avg_completion_percentage: number
  avg_effectiveness_rating: number
}

export function IncidentRemediationTracking() {
  const [remediations, setRemediations] = useState<IncidentRemediation[]>([])
  const [stats, setStats] = useState<RemediationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedRemediation, setSelectedRemediation] = useState<IncidentRemediation | null>(null)
  const [formData, setFormData] = useState({
    incident_id: "",
    remediation_title: "",
    remediation_description: "",
    remediation_type: "Root Cause Fix",
    priority: "Medium",
    assigned_to: "",
    assigned_email: "",
    responsible_department: "",
    department_unit: "",
    departmental_unit: "",
    responsible_manager: "",
    start_date: "",
    target_completion_date: "",
    estimated_effort_hours: "",
    estimated_cost: "",
    risk_before_remediation: "Medium",
    business_impact_assessment: "",
    success_criteria: "",
  })
  const { toast } = useToast()

  const fetchRemediations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      if (statusFilter !== "all") params.append("status", statusFilter)
      if (priorityFilter !== "all") params.append("priority", priorityFilter)
      if (departmentFilter !== "all") params.append("department", departmentFilter)
      if (verificationFilter !== "all") params.append("verification", verificationFilter)

      const response = await fetch(`/api/incident-remediation?${params}`)
      const data = await response.json()

      if (data.success) {
        setRemediations(data.data.remediations || [])
        setTotalItems(data.data.pagination?.total || 0)
        setTotalPages(data.data.pagination?.totalPages || 1)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching incident remediations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch incident remediation data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/incident-remediation/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error("Error fetching remediation stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRemediations()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, priorityFilter, departmentFilter, verificationFilter, currentPage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = selectedRemediation
        ? `/api/incident-remediation/${selectedRemediation.id}`
        : "/api/incident-remediation"
      const method = selectedRemediation ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          created_by: "Current User", // Replace with actual user context
          updated_by: "Current User", // Replace with actual user context
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Incident remediation ${selectedRemediation ? "updated" : "created"} successfully`,
        })
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setSelectedRemediation(null)
        resetFormData()
        fetchRemediations()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving incident remediation:", error)
      toast({
        title: "Error",
        description: `Failed to ${selectedRemediation ? "update" : "create"} incident remediation`,
        variant: "destructive",
      })
    }
  }

  const resetFormData = () => {
    setFormData({
      incident_id: "",
      remediation_title: "",
      remediation_description: "",
      remediation_type: "Root Cause Fix",
      priority: "Medium",
      assigned_to: "",
      assigned_email: "",
      responsible_department: "",
      department_unit: "",
      departmental_unit: "",
      responsible_manager: "",
      start_date: "",
      target_completion_date: "",
      estimated_effort_hours: "",
      estimated_cost: "",
      risk_before_remediation: "Medium",
      business_impact_assessment: "",
      success_criteria: "",
    })
  }

  const handleDelete = async (remediationId: number) => {
    try {
      const response = await fetch(`/api/incident-remediation/${remediationId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Incident remediation deleted successfully",
        })
        fetchRemediations()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting incident remediation:", error)
      toast({
        title: "Error",
        description: "Failed to delete incident remediation",
        variant: "destructive",
      })
    }
  }

  const handleView = (remediation: IncidentRemediation) => {
    setSelectedRemediation(remediation)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (remediation: IncidentRemediation) => {
    setSelectedRemediation(remediation)
    setFormData({
      incident_id: remediation.incident_id,
      remediation_title: remediation.remediation_title,
      remediation_description: remediation.remediation_description,
      remediation_type: remediation.remediation_type,
      priority: remediation.priority,
      assigned_to: remediation.assigned_to,
      assigned_email: remediation.assigned_email,
      responsible_department: remediation.responsible_department,
      department_unit: "",
      departmental_unit: "",
      responsible_manager: remediation.responsible_manager || "",
      start_date: remediation.start_date ? remediation.start_date.split("T")[0] : "",
      target_completion_date: remediation.target_completion_date
        ? remediation.target_completion_date.split("T")[0]
        : "",
      estimated_effort_hours: remediation.estimated_effort_hours?.toString() || "",
      estimated_cost: remediation.estimated_cost?.toString() || "",
      risk_before_remediation: remediation.risk_before_remediation,
      business_impact_assessment: remediation.business_impact_assessment || "",
      success_criteria: remediation.success_criteria || "",
    })
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Verified":
        return "bg-emerald-100 text-emerald-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
        return "bg-purple-100 text-purple-800"
      case "Open":
        return "bg-yellow-100 text-yellow-800"
      case "On Hold":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Not Required":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Incident Remediation Tracking
              </CardTitle>
              <CardDescription>Track and manage remediation activities for security incidents</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="Add Remediation" />
                {/* <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Remediation
                </Button> */}
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Incident Remediation</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="incident_id">Incident ID</Label>
                      <Input
                        id="incident_id"
                        value={formData.incident_id}
                        onChange={(e) => setFormData({ ...formData, incident_id: e.target.value })}
                        placeholder="e.g., INC-001"
                        required
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
                          <SelectItem value="Root Cause Fix">Root Cause Fix</SelectItem>
                          <SelectItem value="Process Improvement">Process Improvement</SelectItem>
                          <SelectItem value="Control Enhancement">Control Enhancement</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Policy Update">Policy Update</SelectItem>
                          <SelectItem value="System Upgrade">System Upgrade</SelectItem>
                          <SelectItem value="Monitoring Enhancement">Monitoring Enhancement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="remediation_title">Remediation Title</Label>
                    <Input
                      id="remediation_title"
                      value={formData.remediation_title}
                      onChange={(e) => setFormData({ ...formData, remediation_title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="remediation_description">Description</Label>
                    <Textarea
                      id="remediation_description"
                      value={formData.remediation_description}
                      onChange={(e) => setFormData({ ...formData, remediation_description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
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
                      <Label htmlFor="risk_before_remediation">Risk Level Before</Label>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assigned_to">Assigned To</Label>
                      <Input
                        id="assigned_to"
                        value={formData.assigned_to}
                        onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="assigned_email">Assigned Email</Label>
                      <Input
                        id="assigned_email"
                        type="email"
                        value={formData.assigned_email}
                        onChange={(e) => setFormData({ ...formData, assigned_email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="responsible_department">Remediation Department</Label>
                      <DepartmentSelectInput
                        formData={formData}
                        setFormData={setFormData}
                        fieldName="responsible_department"
                        onDepartmentSelected={(department) => {
                          setFormData({
                            ...formData,
                            responsible_department: department.name
                          });
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Search and select department from the organization
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="responsible_manager">Manager</Label>
                      <Input
                        id="responsible_manager"
                        value={formData.responsible_manager}
                        onChange={(e) => setFormData({ ...formData, responsible_manager: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departmental_unit">Remediation Departmental Unit</Label>
                      <UnitSelectInput
                        formData={formData}
                        setFormData={setFormData}
                        fieldName="departmental_unit"
                        onUnitSelected={(unit) => {
                          setFormData({
                            ...formData,
                            departmental_unit: unit.department_unit || unit.name
                          });
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Search and select departmental unit or sub-department
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="target_completion_date">Target Completion</Label>
                      <Input
                        id="target_completion_date"
                        type="date"
                        value={formData.target_completion_date}
                        onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimated_effort_hours">Estimated Hours</Label>
                      <Input
                        id="estimated_effort_hours"
                        type="number"
                        min="0"
                        value={formData.estimated_effort_hours}
                        onChange={(e) => setFormData({ ...formData, estimated_effort_hours: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated_cost">Estimated Cost</Label>
                      <Input
                        id="estimated_cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.estimated_cost}
                        onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="business_impact_assessment">Business Impact</Label>
                    <Textarea
                      id="business_impact_assessment"
                      value={formData.business_impact_assessment}
                      onChange={(e) => setFormData({ ...formData, business_impact_assessment: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="success_criteria">Success Criteria</Label>
                    <Textarea
                      id="success_criteria"
                      value={formData.success_criteria}
                      onChange={(e) => setFormData({ ...formData, success_criteria: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Remediation</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Total Remediations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{stats.total_remediations}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.in_progress_remediations} in progress, {stats.completed_remediations} completed
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.avg_completion_percentage?.toFixed(1) || 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">{stats.verified_remediations} verified</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    Overdue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.overdue_remediations}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.critical_priority + stats.high_priority} high priority
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    Budget Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    ${(stats.total_actual_cost / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of ${(stats.total_estimated_cost / 1000).toFixed(0)}K estimated
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search remediations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
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
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verification</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Not Required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchRemediations} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading incident remediations...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Remediation ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Incident</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remediations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No incident remediations found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    remediations.map((remediation) => (
                      <TableRow key={remediation.id}>
                        <TableCell className="font-mono text-sm">{remediation.remediation_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{remediation.remediation_title}</div>
                            <div className="text-sm text-muted-foreground">{remediation.remediation_type}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{remediation.incident_id}</div>
                            <div className="text-xs text-muted-foreground">{remediation.incident_title}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(remediation.priority)}>{remediation.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(remediation.status)}>{remediation.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={remediation.progress_percentage || 0} className="w-16" />
                            <div className="text-xs text-muted-foreground">{remediation.progress_percentage || 0}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {remediation.target_completion_date ? (
                            <div className="space-y-1">
                              <div className="text-sm">
                                {new Date(remediation.target_completion_date).toLocaleDateString()}
                              </div>
                              {remediation.is_overdue && (
                                <Badge variant="destructive" className="text-xs">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <ActionButtons isTableAction={true}
                              onView={() => handleView(remediation)}
                              onEdit={() => handleEdit(remediation)}
                              onDelete={() => handleDelete(remediation.id)}
                              deleteDialogTitle={remediation.incident_title}
                                actionObj={remediation}
                            />
                            {/* <Button variant="outline" size="sm" onClick={() => handleView(remediation)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(remediation)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Remediation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the remediation "{remediation.remediation_title}"?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(remediation.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {remediations.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Incident Remediation Details</DialogTitle>
          </DialogHeader>
          {selectedRemediation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Remediation ID</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedRemediation.remediation_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Incident</label>
                  <p className="text-sm font-semibold">
                    {selectedRemediation.incident_id} - {selectedRemediation.incident_title}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(selectedRemediation.status)}>{selectedRemediation.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <Badge className={getPriorityColor(selectedRemediation.priority)}>
                    {selectedRemediation.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Progress</label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedRemediation.progress_percentage || 0} className="flex-1" />
                    <span className="text-sm">{selectedRemediation.progress_percentage || 0}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="text-sm font-semibold">{selectedRemediation.remediation_title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedRemediation.remediation_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                  <p className="text-sm">{selectedRemediation.assigned_to}</p>
                  {selectedRemediation.assigned_email && (
                    <p className="text-xs text-muted-foreground">{selectedRemediation.assigned_email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <p className="text-sm">{selectedRemediation.responsible_department || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <p className="text-sm">
                    {selectedRemediation.start_date
                      ? new Date(selectedRemediation.start_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target Completion</label>
                  <p className="text-sm">
                    {selectedRemediation.target_completion_date
                      ? new Date(selectedRemediation.target_completion_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedRemediation.business_impact_assessment && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Impact</label>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRemediation.business_impact_assessment}</p>
                </div>
              )}

              {selectedRemediation.success_criteria && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Success Criteria</label>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRemediation.success_criteria}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar structure to Add Dialog but with pre-filled data */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Incident Remediation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as Add Dialog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_incident_id">Incident ID</Label>
                <Input
                  id="edit_incident_id"
                  value={formData.incident_id}
                  onChange={(e) => setFormData({ ...formData, incident_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_remediation_type">Remediation Type</Label>
                <Select
                  value={formData.remediation_type}
                  onValueChange={(value) => setFormData({ ...formData, remediation_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Root Cause Fix">Root Cause Fix</SelectItem>
                    <SelectItem value="Process Improvement">Process Improvement</SelectItem>
                    <SelectItem value="Control Enhancement">Control Enhancement</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Policy Update">Policy Update</SelectItem>
                    <SelectItem value="System Upgrade">System Upgrade</SelectItem>
                    <SelectItem value="Monitoring Enhancement">Monitoring Enhancement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit_remediation_title">Remediation Title</Label>
              <Input
                id="edit_remediation_title"
                value={formData.remediation_title}
                onChange={(e) => setFormData({ ...formData, remediation_title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit_remediation_description">Description</Label>
              <Textarea
                id="edit_remediation_description"
                value={formData.remediation_description}
                onChange={(e) => setFormData({ ...formData, remediation_description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Remediation</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
