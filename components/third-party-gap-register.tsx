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
  Target,
  Plus,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Minus,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface GapAnalysis {
  id: number
  gap_register_id: string
  gap_id: string
  gap_title: string
  gap_description: string
  gap_category: string
  gap_severity: string
  vendor_id: number
  vendor_name: string
  evaluation_id: number
  current_state: string
  target_state: string
  business_impact: string
  priority_ranking: number
  remediation_status: string
  responsible_party: string
  target_completion_date: string
  actual_completion_date: string
  progress_percentage: number
  estimated_cost: number
  actual_cost: number
  aging_days: number
  aging_status: string
  escalation_level: number
  business_criticality: string
  regulatory_impact: string
  created_at: string
  updated_at: string
}

interface GapStats {
  total_gaps: number
  open_gaps: number
  closed_gaps: number
  overdue_gaps: number
  critical_gaps: number
  high_gaps: number
  medium_gaps: number
  low_gaps: number
  avg_aging_days: number
  total_budget_allocated: number
  total_budget_spent: number
  budget_utilization_percentage: number
}

export function ThirdPartyGapRegister() {
  const [gaps, setGaps] = useState<GapAnalysis[]>([])
  const [stats, setStats] = useState<GapStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [agingFilter, setAgingFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedGap, setSelectedGap] = useState<GapAnalysis | null>(null)
  const [formData, setFormData] = useState({
    gap_title: "",
    gap_description: "",
    gap_category: "",
    gap_severity: "Medium",
    vendor_id: "",
    current_state: "",
    target_state: "",
    business_impact: "",
    priority_ranking: "3",
    responsible_party: "",
    target_completion_date: "",
    estimated_cost: "",
    business_criticality: "Medium",
    regulatory_impact: "",
  })
  const { toast } = useToast()

  const fetchGaps = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      if (severityFilter !== "all") {
        params.append("severity", severityFilter)
      }
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (agingFilter !== "all") {
        params.append("aging", agingFilter)
      }

      const response = await fetch(`/api/third-party-gap-analysis?${params}`)
      const data = await response.json()

      if (data.success) {
        setGaps(data.data.gaps || [])
        setTotalItems(data.data.pagination?.total || 0)
        setTotalPages(data.data.pagination?.totalPages || 1)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching gaps:", error)
      toast({
        title: "Error",
        description: "Failed to fetch gap analysis data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/third-party-gap-analysis/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error("Error fetching gap stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchGaps()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, severityFilter, statusFilter, agingFilter, currentPage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = selectedGap ? `/api/third-party-gap-analysis/${selectedGap.id}` : "/api/third-party-gap-analysis"
      const method = selectedGap ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Gap ${selectedGap ? "updated" : "created"} successfully`,
        })
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setSelectedGap(null)
        setFormData({
          gap_title: "",
          gap_description: "",
          gap_category: "",
          gap_severity: "Medium",
          vendor_id: "",
          current_state: "",
          target_state: "",
          business_impact: "",
          priority_ranking: "3",
          responsible_party: "",
          target_completion_date: "",
          estimated_cost: "",
          business_criticality: "Medium",
          regulatory_impact: "",
        })
        fetchGaps()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving gap:", error)
      toast({
        title: "Error",
        description: `Failed to ${selectedGap ? "update" : "create"} gap`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (gapId: number) => {
    try {
      const response = await fetch(`/api/third-party-gap-analysis/${gapId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Gap deleted successfully",
        })
        fetchGaps()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting gap:", error)
      toast({
        title: "Error",
        description: "Failed to delete gap",
        variant: "destructive",
      })
    }
  }

  const handleView = (gap: GapAnalysis) => {
    setSelectedGap(gap)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (gap: GapAnalysis) => {
    setSelectedGap(gap)
    setFormData({
      gap_title: gap.gap_title,
      gap_description: gap.gap_description,
      gap_category: gap.gap_category,
      gap_severity: gap.gap_severity,
      vendor_id: gap.vendor_id.toString(),
      current_state: gap.current_state,
      target_state: gap.target_state,
      business_impact: gap.business_impact,
      priority_ranking: gap.priority_ranking.toString(),
      responsible_party: gap.responsible_party,
      target_completion_date: gap.target_completion_date ? gap.target_completion_date.split("T")[0] : "",
      estimated_cost: gap.estimated_cost?.toString() || "",
      business_criticality: gap.business_criticality,
      regulatory_impact: gap.regulatory_impact || "",
    })
    setIsEditDialogOpen(true)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Open":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAgingStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800"
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800"
      case "At Risk":
        return "bg-orange-100 text-orange-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      case "Stale":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAgingIcon = (status: string) => {
    switch (status) {
      case "On Track":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "Due Soon":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "At Risk":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "Overdue":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Stale":
        return <Minus className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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
                <Target className="h-5 w-5 text-cyan-600" />
                <h1 className="text-lg font-bold text-cyan-400">Gap Register</h1>
              </CardTitle>
              <CardDescription>
                Track and monitor gaps with aging functionality and remediation progress
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
               <Button onClick={() => setIsAddDialogOpen(true)}>
                  Add Gap
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Gap</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gap_title">Gap Title</Label>
                      <Input
                        id="gap_title"
                        value={formData.gap_title}
                        onChange={(e) => setFormData({ ...formData, gap_title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gap_category">Gap Category</Label>
                      <Select
                        value={formData.gap_category}
                        onValueChange={(value) => setFormData({ ...formData, gap_category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Compliance">Compliance</SelectItem>
                          <SelectItem value="Operational">Operational</SelectItem>
                          <SelectItem value="Financial">Financial</SelectItem>
                          <SelectItem value="Privacy">Privacy</SelectItem>
                          <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gap_description">Gap Description</Label>
                    <Textarea
                      id="gap_description"
                      value={formData.gap_description}
                      onChange={(e) => setFormData({ ...formData, gap_description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="gap_severity">Gap Severity</Label>
                      <Select
                        value={formData.gap_severity}
                        onValueChange={(value) => setFormData({ ...formData, gap_severity: value })}
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
                      <Label htmlFor="business_criticality">Business Criticality</Label>
                      <Select
                        value={formData.business_criticality}
                        onValueChange={(value) => setFormData({ ...formData, business_criticality: value })}
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
                      <Label htmlFor="priority_ranking">Priority Ranking (1-5)</Label>
                      <Select
                        value={formData.priority_ranking}
                        onValueChange={(value) => setFormData({ ...formData, priority_ranking: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Highest</SelectItem>
                          <SelectItem value="2">2 - High</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - Low</SelectItem>
                          <SelectItem value="5">5 - Lowest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vendor_id">Vendor ID</Label>
                      <Input
                        id="vendor_id"
                        value={formData.vendor_id}
                        onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="responsible_party">Responsible Party</Label>
                      <Input
                        id="responsible_party"
                        value={formData.responsible_party}
                        onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current_state">Current State</Label>
                      <Textarea
                        id="current_state"
                        value={formData.current_state}
                        onChange={(e) => setFormData({ ...formData, current_state: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="target_state">Target State</Label>
                      <Textarea
                        id="target_state"
                        value={formData.target_state}
                        onChange={(e) => setFormData({ ...formData, target_state: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="business_impact">Business Impact</Label>
                    <Textarea
                      id="business_impact"
                      value={formData.business_impact}
                      onChange={(e) => setFormData({ ...formData, business_impact: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target_completion_date">Target Completion Date</Label>
                      <Input
                        id="target_completion_date"
                        type="date"
                        value={formData.target_completion_date}
                        onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
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
                    <Label htmlFor="regulatory_impact">Regulatory Impact</Label>
                    <Textarea
                      id="regulatory_impact"
                      value={formData.regulatory_impact}
                      onChange={(e) => setFormData({ ...formData, regulatory_impact: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Gap</Button>
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
                    <Target className="h-4 w-4 text-blue-600" />
                    Total Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{stats.total_gaps}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.open_gaps} open, {stats.closed_gaps} closed
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Critical & High
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.critical_gaps + stats.high_gaps}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.critical_gaps} critical, {stats.high_gaps} high
                  </div>
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
                  <div className="text-2xl font-bold text-orange-600">{stats.overdue_gaps}</div>
                  <div className="text-xs text-muted-foreground">
                    Avg aging: {stats.avg_aging_days?.toFixed(0) || 0} days
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Budget Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.budget_utilization_percentage?.toFixed(1) || 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${(stats.total_budget_spent / 1000).toFixed(0)}K / $
                    {(stats.total_budget_allocated / 1000).toFixed(0)}K
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
                  placeholder="Search gaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={agingFilter} onValueChange={setAgingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Aging" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Aging</SelectItem>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="Due Soon">Due Soon</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Stale">Stale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchGaps} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading gaps...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gap ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Aging</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gaps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No gaps found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    gaps.map((gap) => (
                      <TableRow key={gap.id}>
                        <TableCell className="font-mono text-sm">{gap.gap_register_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{gap.gap_title}</div>
                            <div className="text-sm text-muted-foreground">{gap.gap_category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{gap.vendor_name || `Vendor ${gap.vendor_id}`}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getSeverityColor(gap.gap_severity)}>{gap.gap_severity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(gap.remediation_status)}>{gap.remediation_status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={gap.progress_percentage || 0} className="w-16" />
                            <div className="text-xs text-muted-foreground">{gap.progress_percentage || 0}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getAgingIcon(gap.aging_status)}
                            <div className="space-y-1">
                              <Badge variant="outline" className={getAgingStatusColor(gap.aging_status)}>{gap.aging_status}</Badge>
                              <div className="text-xs text-muted-foreground">{gap.aging_days} days</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleView(gap)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(gap)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Gap</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the gap "{gap.gap_title}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(gap.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
          {gaps.length > 0 && totalPages > 1 && (
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
            <DialogTitle>Gap Details</DialogTitle>
          </DialogHeader>
          {selectedGap && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gap ID</label>
                  <p className="text-sm font-mono bg-white dark:bg-gray-900 p-2 rounded">{selectedGap.gap_register_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gap Title</label>
                  <p className="text-sm font-semibold bg-white dark:bg-gray-900 p-2 rounded">{selectedGap.gap_title}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                  <div>
                    <Badge variant="outline" className={getSeverityColor(selectedGap.gap_severity)}>{selectedGap.gap_severity}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>
                    <Badge variant="outline" className={getStatusColor(selectedGap.remediation_status)}>
                      {selectedGap.remediation_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Progress</label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedGap.progress_percentage || 0} className="flex-1" />
                    <span className="text-sm">{selectedGap.progress_percentage || 0}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Gap Description</label>
                <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">{selectedGap.gap_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current State</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">{selectedGap.current_state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target State</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">{selectedGap.target_state}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Impact</label>
                <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">{selectedGap.business_impact}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority Ranking</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">{selectedGap.priority_ranking}/5</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Aging Days</label>
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-3 rounded">
                    {getAgingIcon(selectedGap.aging_status)}
                    <span className="text-sm">{selectedGap.aging_days} days</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Escalation Level</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">{selectedGap.escalation_level}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimated Cost</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">${selectedGap.estimated_cost?.toLocaleString() || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Actual Cost</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">${selectedGap.actual_cost?.toLocaleString() || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Responsible Party</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">{selectedGap.responsible_party}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target Completion</label>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded">
                    {selectedGap.target_completion_date
                      ? new Date(selectedGap.target_completion_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gap</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_gap_title">Gap Title</Label>
                <Input
                  id="edit_gap_title"
                  value={formData.gap_title}
                  onChange={(e) => setFormData({ ...formData, gap_title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_gap_category">Gap Category</Label>
                <Select
                  value={formData.gap_category}
                  onValueChange={(value) => setFormData({ ...formData, gap_category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Privacy">Privacy</SelectItem>
                    <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit_gap_description">Gap Description</Label>
              <Textarea
                id="edit_gap_description"
                value={formData.gap_description}
                onChange={(e) => setFormData({ ...formData, gap_description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit_gap_severity">Gap Severity</Label>
                <Select
                  value={formData.gap_severity}
                  onValueChange={(value) => setFormData({ ...formData, gap_severity: value })}
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
                <Label htmlFor="edit_business_criticality">Business Criticality</Label>
                <Select
                  value={formData.business_criticality}
                  onValueChange={(value) => setFormData({ ...formData, business_criticality: value })}
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
                <Label htmlFor="edit_priority_ranking">Priority Ranking (1-5)</Label>
                <Select
                  value={formData.priority_ranking}
                  onValueChange={(value) => setFormData({ ...formData, priority_ranking: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Highest</SelectItem>
                    <SelectItem value="2">2 - High</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - Low</SelectItem>
                    <SelectItem value="5">5 - Lowest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_vendor_id">Vendor ID</Label>
                <Input
                  id="edit_vendor_id"
                  value={formData.vendor_id}
                  onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_responsible_party">Responsible Party</Label>
                <Input
                  id="edit_responsible_party"
                  value={formData.responsible_party}
                  onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_current_state">Current State</Label>
                <Textarea
                  id="edit_current_state"
                  value={formData.current_state}
                  onChange={(e) => setFormData({ ...formData, current_state: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="edit_target_state">Target State</Label>
                <Textarea
                  id="edit_target_state"
                  value={formData.target_state}
                  onChange={(e) => setFormData({ ...formData, target_state: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_business_impact">Business Impact</Label>
              <Textarea
                id="edit_business_impact"
                value={formData.business_impact}
                onChange={(e) => setFormData({ ...formData, business_impact: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_target_completion_date">Target Completion Date</Label>
                <Input
                  id="edit_target_completion_date"
                  type="date"
                  value={formData.target_completion_date}
                  onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_estimated_cost">Estimated Cost</Label>
                <Input
                  id="edit_estimated_cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_regulatory_impact">Regulatory Impact</Label>
              <Textarea
                id="edit_regulatory_impact"
                value={formData.regulatory_impact}
                onChange={(e) => setFormData({ ...formData, regulatory_impact: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Gap</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
