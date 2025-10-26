"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Save,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Target,
} from "lucide-react"
import { toast } from "sonner"
import OwnerSelectInput from "@/components/owner-search-input"
import DepartmentSelectInput from "@/components/department-search-input"

interface GapRemediation {
  id?: number
  compliance_assessment_id: number
  control_assessment_id: number
  gap_id: string
  gap_title: string
  gap_description: string
  control_reference: string
  regulatory_reference: string
  gap_category: string
  gap_severity: string
  risk_impact: string
  current_state: string
  target_state: string
  remediation_action: string
  remediation_plan: string
  remediation_owner: string
  remediation_department: string
  assigned_to: string
  remediation_status: string
  priority: string
  effort_estimate: string
  cost_estimate: number | null
  resources_required: string
  implementation_timeline: string
  start_date: string
  due_date: string
  completion_date: string
  progress_percentage: number
  dependencies: string
  implementation_notes: string
  created_at?: string
  updated_at?: string
}

interface ComplianceGapRemediationProps {
  complianceAssessmentId: number
  onStatsUpdate: () => void
}

export default function ComplianceGapRemediation({
  complianceAssessmentId,
  onStatsUpdate,
}: ComplianceGapRemediationProps) {
  const [gaps, setGaps] = useState<GapRemediation[]>([])
  const [controlAssessments, setControlAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGap, setEditingGap] = useState<GapRemediation | null>(null)
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterSeverity, setFilterSeverity] = useState("All")

  const [newGap, setNewGap] = useState<Partial<GapRemediation>>({
    compliance_assessment_id: complianceAssessmentId,
    control_assessment_id: 0,
    gap_title: "",
    gap_description: "",
    control_reference: "",
    regulatory_reference: "",
    gap_category: "",
    gap_severity: "Medium",
    risk_impact: "",
    current_state: "",
    target_state: "",
    remediation_action: "",
    remediation_plan: "",
    remediation_owner: "",
    remediation_department: "",
    assigned_to: "",
    remediation_status: "Open",
    priority: "Medium",
    effort_estimate: "Medium",
    cost_estimate: null,
    resources_required: "",
    implementation_timeline: "",
    start_date: "",
    due_date: "",
    progress_percentage: 0,
    dependencies: "",
    implementation_notes: "",
  })

  useEffect(() => {
    if (complianceAssessmentId) {
      fetchGaps()
      fetchControlAssessments()
    }
  }, [complianceAssessmentId])

  const fetchGaps = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/compliance-gap-remediation?compliance_assessment_id=${complianceAssessmentId}`
      )
      const result = await response.json()

      if (result.success) {
        setGaps(result.data)
      } else {
        toast.error("Failed to load gaps")
      }
    } catch (error) {
      console.error("Error fetching gaps:", error)
      toast.error("Failed to load gaps")
    } finally {
      setLoading(false)
    }
  }

  const fetchControlAssessments = async () => {
    try {
      const response = await fetch(
        `/api/compliance-control-assessments?compliance_assessment_id=${complianceAssessmentId}`
      )
      const result = await response.json()

      if (result.success) {
        // Only show controls that require remediation
        const controlsWithGaps = result.data.filter(
          (c: any) => c.remediation_required || c.gap_severity !== "None"
        )
        setControlAssessments(controlsWithGaps)
      }
    } catch (error) {
      console.error("Error fetching control assessments:", error)
    }
  }

  const handleAddGap = async () => {
    if (!newGap.gap_title || !newGap.control_assessment_id || newGap.control_assessment_id === 0) {
      toast.error("Gap title and control selection are required")
      return
    }

    try {
      const response = await fetch("/api/compliance-gap-remediation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGap,
          compliance_assessment_id: complianceAssessmentId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Gap remediation added successfully!")
        setIsAddDialogOpen(false)
        fetchGaps()
        onStatsUpdate()
        resetNewGap()
      } else {
        toast.error(result.error || "Failed to add gap")
      }
    } catch (error) {
      console.error("Error adding gap:", error)
      toast.error("Failed to add gap")
    }
  }

  const handleUpdateGap = async () => {
    if (!editingGap || !editingGap.id) return

    try {
      const response = await fetch(`/api/compliance-gap-remediation/${editingGap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGap),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Gap updated successfully!")
        setEditingGap(null)
        fetchGaps()
        onStatsUpdate()
      } else {
        toast.error(result.error || "Failed to update gap")
      }
    } catch (error) {
      console.error("Error updating gap:", error)
      toast.error("Failed to update gap")
    }
  }

  const handleDeleteGap = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gap remediation?")) return

    try {
      const response = await fetch(`/api/compliance-gap-remediation/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Gap deleted successfully")
        fetchGaps()
        onStatsUpdate()
      } else {
        toast.error("Failed to delete gap")
      }
    } catch (error) {
      console.error("Error deleting gap:", error)
      toast.error("Failed to delete gap")
    }
  }

  const resetNewGap = () => {
    setNewGap({
      compliance_assessment_id: complianceAssessmentId,
      control_assessment_id: 0,
      gap_title: "",
      gap_description: "",
      control_reference: "",
      regulatory_reference: "",
      gap_category: "",
      gap_severity: "Medium",
      risk_impact: "",
      current_state: "",
      target_state: "",
      remediation_action: "",
      remediation_plan: "",
      remediation_owner: "",
      remediation_department: "",
      assigned_to: "",
      remediation_status: "Open",
      priority: "Medium",
      effort_estimate: "Medium",
      cost_estimate: null,
      resources_required: "",
      implementation_timeline: "",
      start_date: "",
      due_date: "",
      progress_percentage: 0,
      dependencies: "",
      implementation_notes: "",
    })
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
        return "bg-green-500 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Closed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Open":
        return "bg-red-100 text-red-800 border-red-200"
      case "Deferred":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "Closed":
        return <CheckCircle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Open":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredGaps = gaps.filter((gap) => {
    if (filterStatus !== "All" && gap.remediation_status !== filterStatus) return false
    if (filterSeverity !== "All" && gap.gap_severity !== filterSeverity) return false
    return true
  })

  const stats = {
    total: gaps.length,
    open: gaps.filter((g) => g.remediation_status === "Open").length,
    inProgress: gaps.filter((g) => g.remediation_status === "In Progress").length,
    completed: gaps.filter((g) => g.remediation_status === "Completed" || g.remediation_status === "Closed").length,
    critical: gaps.filter((g) => g.gap_severity === "Critical").length,
    high: gaps.filter((g) => g.gap_severity === "High").length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gap Remediation Tracker</CardTitle>
              <CardDescription>Track and manage compliance gaps requiring remediation</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={controlAssessments.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gap
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Gap Remediation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="control_assessment_id">Associated Control *</Label>
                    <Select
                      value={newGap.control_assessment_id?.toString()}
                      onValueChange={(value) =>
                        setNewGap({ ...newGap, control_assessment_id: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select control" />
                      </SelectTrigger>
                      <SelectContent>
                        {controlAssessments.map((control) => (
                          <SelectItem key={control.id} value={control.id.toString()}>
                            {control.control_id} - {control.control_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {controlAssessments.length === 0 && (
                      <p className="text-xs text-muted-foreground text-red-500">
                        No controls with remediation requirements found. Please add controls in the Self Assessment tab first.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gap_title">Gap Title *</Label>
                    <Input
                      id="gap_title"
                      value={newGap.gap_title}
                      onChange={(e) => setNewGap({ ...newGap, gap_title: e.target.value })}
                      placeholder="Brief description of the gap"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gap_description">Gap Description</Label>
                    <Textarea
                      id="gap_description"
                      value={newGap.gap_description}
                      onChange={(e) => setNewGap({ ...newGap, gap_description: e.target.value })}
                      placeholder="Detailed description of the compliance gap"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gap_severity">Gap Severity *</Label>
                      <Select
                        value={newGap.gap_severity}
                        onValueChange={(value) => setNewGap({ ...newGap, gap_severity: value })}
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

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newGap.priority}
                        onValueChange={(value) => setNewGap({ ...newGap, priority: value })}
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

                    <div className="space-y-2">
                      <Label htmlFor="effort_estimate">Effort Estimate</Label>
                      <Select
                        value={newGap.effort_estimate}
                        onValueChange={(value) => setNewGap({ ...newGap, effort_estimate: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_state">Current State</Label>
                      <Textarea
                        id="current_state"
                        value={newGap.current_state}
                        onChange={(e) => setNewGap({ ...newGap, current_state: e.target.value })}
                        placeholder="Describe the current state"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_state">Target State</Label>
                      <Textarea
                        id="target_state"
                        value={newGap.target_state}
                        onChange={(e) => setNewGap({ ...newGap, target_state: e.target.value })}
                        placeholder="Describe the desired target state"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remediation_action">Remediation Action</Label>
                    <Textarea
                      id="remediation_action"
                      value={newGap.remediation_action}
                      onChange={(e) => setNewGap({ ...newGap, remediation_action: e.target.value })}
                      placeholder="What actions need to be taken?"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remediation_plan">Remediation Plan</Label>
                    <Textarea
                      id="remediation_plan"
                      value={newGap.remediation_plan}
                      onChange={(e) => setNewGap({ ...newGap, remediation_plan: e.target.value })}
                      placeholder="Detailed remediation plan"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="remediation_owner">Remediation Owner</Label>
                      <OwnerSelectInput
                        formData={newGap}
                        setFormData={setNewGap}
                        fieldName="remediation_owner"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remediation_department">Remediation Department</Label>
                      <DepartmentSelectInput
                        formData={newGap}
                        setFormData={setNewGap}
                        fieldName="remediation_department"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to">Assigned To</Label>
                      <OwnerSelectInput
                        formData={newGap}
                        setFormData={setNewGap}
                        fieldName="assigned_to"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remediation_status">Status</Label>
                      <Select
                        value={newGap.remediation_status}
                        onValueChange={(value) => setNewGap({ ...newGap, remediation_status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Deferred">Deferred</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newGap.start_date}
                        onChange={(e) => setNewGap({ ...newGap, start_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={newGap.due_date}
                        onChange={(e) => setNewGap({ ...newGap, due_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cost_estimate">Cost Estimate</Label>
                      <Input
                        id="cost_estimate"
                        type="number"
                        step="0.01"
                        value={newGap.cost_estimate || ""}
                        onChange={(e) =>
                          setNewGap({ ...newGap, cost_estimate: parseFloat(e.target.value) || null })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="progress_percentage">Progress %</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="progress_percentage"
                          type="number"
                          min="0"
                          max="100"
                          value={newGap.progress_percentage}
                          onChange={(e) =>
                            setNewGap({ ...newGap, progress_percentage: parseInt(e.target.value) || 0 })
                          }
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={handleAddGap}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Gap
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Deferred">Deferred</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gaps Table */}
          {loading ? (
            <div className="text-center py-8">Loading gaps...</div>
          ) : filteredGaps.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Gaps Found</h3>
              <p className="text-muted-foreground mb-4">
                {controlAssessments.length === 0
                  ? "No controls with remediation requirements. Add controls in the Self Assessment tab first."
                  : "Add gaps to track remediation efforts"}
              </p>
              {controlAssessments.length > 0 && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Gap
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gap ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Control Ref</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGaps.map((gap) => (
                    <TableRow key={gap.id}>
                      <TableCell className="font-mono text-xs">{gap.gap_id}</TableCell>
                      <TableCell className="font-medium max-w-xs truncate">{gap.gap_title}</TableCell>
                      <TableCell className="text-sm">{gap.control_reference || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(gap.gap_severity)}>{gap.gap_severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{gap.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(gap.remediation_status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(gap.remediation_status)}
                            {gap.remediation_status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{gap.remediation_owner || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={gap.progress_percentage} className="w-16" />
                          <span className="text-xs font-medium">{gap.progress_percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {gap.due_date ? new Date(gap.due_date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingGap(gap)}
                            title="Edit gap"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => gap.id && handleDeleteGap(gap.id)}
                            title="Delete gap"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Edit Gap Dialog */}
      <Dialog open={!!editingGap} onOpenChange={(open) => !open && setEditingGap(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gap Remediation</DialogTitle>
          </DialogHeader>
          {editingGap && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gap ID</Label>
                <Input value={editingGap.gap_id} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_gap_title">Gap Title</Label>
                <Input
                  id="edit_gap_title"
                  value={editingGap.gap_title}
                  onChange={(e) => setEditingGap({ ...editingGap, gap_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_gap_description">Gap Description</Label>
                <Textarea
                  id="edit_gap_description"
                  value={editingGap.gap_description}
                  onChange={(e) => setEditingGap({ ...editingGap, gap_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_gap_severity">Gap Severity</Label>
                  <Select
                    value={editingGap.gap_severity}
                    onValueChange={(value) => setEditingGap({ ...editingGap, gap_severity: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="edit_remediation_status">Status</Label>
                  <Select
                    value={editingGap.remediation_status}
                    onValueChange={(value) => setEditingGap({ ...editingGap, remediation_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Deferred">Deferred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_priority">Priority</Label>
                  <Select
                    value={editingGap.priority}
                    onValueChange={(value) => setEditingGap({ ...editingGap, priority: value })}
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

              <div className="space-y-2">
                <Label htmlFor="edit_remediation_action">Remediation Action</Label>
                <Textarea
                  id="edit_remediation_action"
                  value={editingGap.remediation_action}
                  onChange={(e) => setEditingGap({ ...editingGap, remediation_action: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_remediation_owner">Remediation Owner</Label>
                  <OwnerSelectInput
                    formData={editingGap}
                    setFormData={setEditingGap}
                    fieldName="remediation_owner"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_assigned_to">Assigned To</Label>
                  <OwnerSelectInput
                    formData={editingGap}
                    setFormData={setEditingGap}
                    fieldName="assigned_to"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_due_date">Due Date</Label>
                  <Input
                    id="edit_due_date"
                    type="date"
                    value={editingGap.due_date}
                    onChange={(e) => setEditingGap({ ...editingGap, due_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_progress_percentage">Progress %</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="edit_progress_percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={editingGap.progress_percentage}
                      onChange={(e) =>
                        setEditingGap({ ...editingGap, progress_percentage: parseInt(e.target.value) || 0 })
                      }
                    />
                    <Progress value={editingGap.progress_percentage} className="w-20" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_implementation_notes">Implementation Notes</Label>
                <Textarea
                  id="edit_implementation_notes"
                  value={editingGap.implementation_notes}
                  onChange={(e) =>
                    setEditingGap({ ...editingGap, implementation_notes: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingGap(null)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleUpdateGap}>
                  <Save className="h-4 w-4 mr-2" />
                  Update Gap
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


