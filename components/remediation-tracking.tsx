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

export function RemediationTracking() {
  const [remediations, setRemediations] = useState<RemediationItem[]>([])
  const [stats, setStats] = useState<RemediationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<RemediationItem | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchRemediations()
    fetchStats()
  }, [currentPage, statusFilter, priorityFilter, departmentFilter, verificationFilter])

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
      if (verificationFilter !== "all") {
        params.append("verification", verificationFilter)
      }

      console.log("[v0] Fetching remediations with params:", params.toString())

      const response = await fetch(`/api/third-party-risk-remediation-tracking?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Remediation API response:", data)

      if (data.success) {
        setRemediations(data.data.remediations || [])
        setTotalItems(data.data.pagination?.total || 0)
        setTotalPages(data.data.pagination?.totalPages || 1)
      } else {
        throw new Error(data.error || "Failed to fetch remediations")
      }
    } catch (error) {
      console.error("[v0] Error fetching remediations:", error)
      toast({
        title: "Error",
        description: "Failed to load remediation data. Please try again.",
        variant: "destructive",
      })
      // Set empty state on error
      setRemediations([])
      setTotalItems(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      console.log("[v0] Fetching remediation stats")
      const response = await fetch("/api/third-party-risk-remediation-tracking/stats")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Stats API response:", data)

      if (data.success) {
        setStats(data.data.overview)
      } else {
        throw new Error(data.error || "Failed to fetch stats")
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
      // Set default stats on error
      setStats({
        total_items: 0,
        completed: 0,
        in_progress: 0,
        open: 0,
        on_hold: 0,
        overdue: 0,
        avg_progress: 0,
        total_estimated_cost: 0,
        total_actual_cost: 0,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Open":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Third-Party Risk Remediation Tracking</h2>
          <p className="text-gray-600">Track and manage remediation activities for third-party risk gaps</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Remediation
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total_items}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.avg_progress || 0)}%</div>
              <Progress value={stats.avg_progress || 0} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Est. Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${((stats.total_estimated_cost || 0) / 1000).toFixed(0)}K
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Actual Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${((stats.total_actual_cost || 0) / 1000).toFixed(0)}K
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search remediations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label>Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label>Priority:</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label>Verification:</Label>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remediation Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Remediation Items</CardTitle>
          <CardDescription>
            Showing {remediations.length} of {totalItems} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading remediation items...</span>
            </div>
          ) : remediations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No remediation items found</h3>
              <p>There are no remediation items matching your current filters.</p>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remediations.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          <div>
                            <div className="font-medium">{item.remediation_id}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.remediation_title}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.vendor_name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{item.vendor_type || ""}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.progress_percentage}%</span>
                          </div>
                          <Progress value={item.progress_percentage} className="w-20" />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.assigned_to || "Unassigned"}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.target_completion_date
                            ? new Date(item.target_completion_date).toLocaleDateString()
                            : "No due date"}
                          {item.target_completion_date &&
                            new Date(item.target_completion_date) < new Date() &&
                            item.status !== "Completed" && <div className="text-xs text-red-600">Overdue</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                            <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Remediation Item Details</DialogTitle>
            <DialogDescription>
              {selectedItem?.remediation_id} - {selectedItem?.remediation_title}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Item Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Title:</strong> {selectedItem.remediation_title}
                      </div>
                      <div>
                        <strong>Type:</strong> {selectedItem.remediation_type || "N/A"}
                      </div>
                      <div>
                        <strong>Vendor:</strong> {selectedItem.vendor_name || "N/A"}
                      </div>
                      <div>
                        <strong>Department:</strong> {selectedItem.responsible_department || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Start Date:</strong>{" "}
                        {selectedItem.start_date ? new Date(selectedItem.start_date).toLocaleDateString() : "N/A"}
                      </div>
                      <div>
                        <strong>Due Date:</strong>{" "}
                        {selectedItem.target_completion_date
                          ? new Date(selectedItem.target_completion_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {selectedItem.actual_completion_date && (
                        <div>
                          <strong>Completion Date:</strong>{" "}
                          {new Date(selectedItem.actual_completion_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Progress & Status</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Status:</strong>{" "}
                        <Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge>
                      </div>
                      <div>
                        <strong>Progress:</strong> {selectedItem.progress_percentage}%
                      </div>
                      <Progress value={selectedItem.progress_percentage} className="mt-2" />
                      <div>
                        <strong>Assigned To:</strong> {selectedItem.assigned_to || "Unassigned"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Cost Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Estimated Cost:</strong> ${(selectedItem.estimated_cost || 0).toLocaleString()}
                      </div>
                      <div>
                        <strong>Actual Cost:</strong> ${(selectedItem.actual_cost || 0).toLocaleString()}
                      </div>
                      <div>
                        <strong>Variance:</strong> $
                        {((selectedItem.actual_cost || 0) - (selectedItem.estimated_cost || 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {selectedItem.remediation_description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedItem.remediation_description}</p>
                </div>
              )}
              {selectedItem.business_impact_assessment && (
                <div>
                  <h3 className="font-semibold mb-2">Business Impact</h3>
                  <p className="text-sm text-gray-600">{selectedItem.business_impact_assessment}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
