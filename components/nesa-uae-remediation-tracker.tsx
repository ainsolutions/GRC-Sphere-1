"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Edit, Eye, FileText, Plus, Search, Shield, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NESAUAEAnalyticsDashboard } from "./nesa-uae-analytics-dashboard"
import OwnerSelectInput from "@/components/owner-search-input"

interface RemediationAction {
  id: number
  assessment_id: number
  requirement_id: number
  finding_id: string
  finding_title: string
  finding_description: string
  finding_severity: string
  finding_category: string
  remediation_action: string
  remediation_priority: string
  remediation_status: string
  remediation_type: string
  assigned_to: string
  assigned_department: string
  responsible_manager: string
  target_completion_date: string
  actual_completion_date: string | null
  actual_cost: number | null
  estimated_effort_hours: number
  estimated_cost: number
  evidence_required: string
  risk_before_remediation: string
  risk_after_remediation: string
  business_impact: string
  requires_approval: boolean
  verification_method: string
  created_by: string
  created_at: string
  updated_at: string
  assessment_name?: string
  critical_infrastructure_type?: string
  control_name?: string
  domain?: string
  timeline_status?: string
}

interface RemediationStats {
  total_actions: number
  completed_actions: number
  overdue_actions: number
  in_progress_actions: number
  high_priority_actions: number
  total_estimated_cost: number
  total_actual_cost: number
  avg_completion_time: number
}

interface Assessment {
  id: number
  assessment_name: string
}

interface GapAnalysis {
  id: number
  gap_description: string
}

export function NESAUAERemediationTracker() {
  const [actions, setActions] = useState<RemediationAction[]>([])
  const [stats, setStats] = useState<RemediationStats | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [gapAnalyses, setGapAnalyses] = useState<GapAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<RemediationAction | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")
  const { toast } = useToast()

  const [newAction, setNewAction] = useState({
    assessment_id: 1,
    requirement_id: 1,
    finding_id: "",
    finding_title: "",
    finding_description: "",
    finding_severity: "Medium",
    finding_category: "Technical",
    remediation_action: "",
    remediation_priority: "Medium",
    remediation_status: "Open",
    remediation_type: "Short-term",
    assigned_to: "",
    assigned_department: "",
    responsible_manager: "",
    target_completion_date: "",
    estimated_effort_hours: 0,
    estimated_cost: 0,
    evidence_required: "",
    risk_before_remediation: "Medium",
    risk_after_remediation: "Low",
    business_impact: "",
    requires_approval: false,
    verification_method: "",
    created_by: "System",
  })

  useEffect(() => {
    fetchActions()
    fetchStats()
    fetchAssessments()
    fetchGapAnalyses()
  }, [])

  const generateFindingId = async () => {
    try {
      const response = await fetch("/api/nesa-uae-remediation")
      if (response.ok) {
        const data = await response.json()
        const existingActions = Array.isArray(data) ? data : []

        // Find the highest existing finding ID number
        let maxNumber = 0
        existingActions.forEach((action: RemediationAction) => {
          if (action.finding_id && action.finding_id.startsWith("NESA-FINDING-")) {
            const numberPart = action.finding_id.replace("NESA-FINDING-", "")
            const num = Number.parseInt(numberPart, 10)
            if (!isNaN(num) && num > maxNumber) {
              maxNumber = num
            }
          }
        })

        // Generate next ID with 6-digit padding
        const nextNumber = maxNumber + 1
        const paddedNumber = nextNumber.toString().padStart(6, "0")
        return `NESA-FINDING-${paddedNumber}`
      }
    } catch (error) {
      console.error("Error generating finding ID:", error)
    }

    // Fallback to timestamp-based ID if API call fails
    const timestamp = Date.now().toString().slice(-6)
    return `NESA-FINDING-${timestamp}`
  }

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/nesa-uae-assessments")
      if (response.ok) {
        const data = await response.json()
        setAssessments(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch assessments:", response.statusText)
        setAssessments([])
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
      setAssessments([])
    }
  }

  const fetchGapAnalyses = async () => {
    try {
      const response = await fetch("/api/nesa-uae-gap-analysis")
      if (response.ok) {
        const data = await response.json()
        setGapAnalyses(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch gap analyses:", response.statusText)
        setGapAnalyses([])
      }
    } catch (error) {
      console.error("Error fetching gap analyses:", error)
      setGapAnalyses([])
    }
  }

  const fetchActions = async () => {
    try {
      console.log("[v0] Fetching NESA remediation actions...")
      const response = await fetch("/api/nesa-uae-remediation")
      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Fetched data:", data)
        console.log("[v0] Data length:", Array.isArray(data) ? data.length : "Not an array")

        // Ensure data is an array
        setActions(Array.isArray(data) ? data : [])
      } else {
        console.error("[v0] Failed to fetch actions:", response.statusText)
        const errorText = await response.text()
        console.error("[v0] Error response:", errorText)
        setActions([])
        toast({
          title: "Error",
          description: "Failed to load remediation actions.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching remediation actions:", error)
      setActions([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load remediation actions.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      console.log("[v0] Fetching NESA remediation stats...")
      const response = await fetch("/api/nesa-uae-remediation/stats")
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Stats data:", data)
        setStats(data)
      } else {
        console.error("[v0] Failed to fetch stats:", response.statusText)
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

  const createRemediationAction = async () => {
    try {
      if (
        !newAction.assessment_id ||
        !newAction.finding_id ||
        !newAction.finding_title ||
        !newAction.remediation_action
      ) {
        toast({
          title: "Validation Error",
          description: "Assessment ID, finding ID, finding title, and remediation action are required.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/nesa-uae-remediation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAction),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Remediation action created successfully.",
        })
        setIsDialogOpen(false)
        resetForm()
        fetchActions()
        fetchStats()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create remediation action")
      }
    } catch (error) {
      console.error("Error creating remediation action:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create remediation action.",
        variant: "destructive",
      })
    }
  }

  const updateRemediationAction = async (id: number, updates: Partial<RemediationAction>) => {
    try {
      const response = await fetch("/api/nesa-uae-remediation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Remediation action updated successfully.",
        })
        fetchActions()
        fetchStats()
      }
    } catch (error) {
      console.error("Error updating remediation action:", error)
      toast({
        title: "Error",
        description: "Failed to update remediation action.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setNewAction({
      assessment_id: 1,
      requirement_id: 1,
      finding_id: "",
      finding_title: "",
      finding_description: "",
      finding_severity: "Medium",
      finding_category: "Technical",
      remediation_action: "",
      remediation_priority: "Medium",
      remediation_status: "Open",
      remediation_type: "Short-term",
      assigned_to: "",
      assigned_department: "",
      responsible_manager: "",
      target_completion_date: "",
      estimated_effort_hours: 0,
      estimated_cost: 0,
      evidence_required: "",
      risk_before_remediation: "Medium",
      risk_after_remediation: "Low",
      business_impact: "",
      requires_approval: false,
      verification_method: "",
      created_by: "System",
    })
  }

  const openDialog = async (mode: "create" | "edit" | "view", action?: RemediationAction) => {
    setDialogMode(mode)
    setSelectedAction(action || null)
    if (mode === "edit" && action) {
      setNewAction({
        assessment_id: action.assessment_id,
        requirement_id: action.requirement_id,
        finding_id: action.finding_id,
        finding_title: action.finding_title,
        finding_description: action.finding_description,
        finding_severity: action.finding_severity,
        finding_category: action.finding_category,
        remediation_action: action.remediation_action,
        remediation_priority: action.remediation_priority,
        remediation_status: action.remediation_status,
        remediation_type: action.remediation_type,
        assigned_to: action.assigned_to,
        assigned_department: action.assigned_department,
        responsible_manager: action.responsible_manager,
        target_completion_date: action.target_completion_date,
        estimated_effort_hours: action.estimated_effort_hours,
        estimated_cost: action.estimated_cost,
        evidence_required: action.evidence_required,
        risk_before_remediation: action.risk_before_remediation,
        risk_after_remediation: action.risk_after_remediation,
        business_impact: action.business_impact,
        requires_approval: action.requires_approval,
        verification_method: action.verification_method,
        created_by: action.created_by,
      })
    } else if (mode === "create") {
      const generatedId = await generateFindingId()
      setNewAction({
        assessment_id: 1,
        requirement_id: 1,
        finding_id: generatedId,
        finding_title: "",
        finding_description: "",
        finding_severity: "Medium",
        finding_category: "Technical",
        remediation_action: "",
        remediation_priority: "Medium",
        remediation_status: "Open",
        remediation_type: "Short-term",
        assigned_to: "",
        assigned_department: "",
        responsible_manager: "",
        target_completion_date: "",
        estimated_effort_hours: 0,
        estimated_cost: 0,
        evidence_required: "",
        risk_before_remediation: "Medium",
        risk_after_remediation: "Low",
        business_impact: "",
        requires_approval: false,
        verification_method: "",
        created_by: "System",
      })
    }
    setIsDialogOpen(true)
  }

  // Ensure actions is always an array before filtering
  const filteredActions = Array.isArray(actions)
    ? actions.filter((action) => {
        const matchesSearch =
          action.remediation_action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.finding_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.assigned_to.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || action.remediation_status === statusFilter
        const matchesPriority = priorityFilter === "all" || action.remediation_priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
      })
    : []

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
        return "bg-purple-100 text-purple-800"
      case "Deferred":
        return "bg-gray-100 text-gray-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Completed" || status === "Closed") return false
    return new Date(dueDate) < new Date()
  }

  const getProgressValue = (action: RemediationAction) => {
    switch (action.remediation_status) {
      case "Completed":
      case "Closed":
        return 100
      case "In Progress":
        return 60
      case "Under Review":
        return 80
      case "Open":
        return 10
      default:
        return 0
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading Remediation Actions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_actions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completed_actions} completed ({Math.round((stats.completed_actions / stats.total_actions) * 100)}
                %)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.in_progress_actions}</div>
              <p className="text-xs text-muted-foreground">{stats.overdue_actions} overdue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.high_priority_actions}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total_estimated_cost)}</div>
              <p className="text-xs text-muted-foreground">{formatCurrency(stats.total_actual_cost)} actual spend</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="actions" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
            <TabsTrigger value="actions">Remediation Actions</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog("create")}>
                <Plus className="h-4 w-4 mr-2" />
                New Action
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {dialogMode === "create" && "Create New Remediation Action"}
                  {dialogMode === "edit" && "Edit Remediation Action"}
                  {dialogMode === "view" && "View Remediation Action"}
                </DialogTitle>
                <DialogDescription>
                  {dialogMode === "create" && "Create a new NESA UAE compliance remediation action"}
                  {dialogMode === "edit" && "Update the remediation action details"}
                  {dialogMode === "view" && "View remediation action details"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finding_id">Finding ID</Label>
                    <Input
                      id="finding_id"
                      value={newAction.finding_id}
                      onChange={(e) => setNewAction({ ...newAction, finding_id: e.target.value })}
                      placeholder="e.g., NESA-FINDING-000001"
                      readOnly
                      disabled={dialogMode === "view"}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment_id">Assessment</Label>
                    <Select
                      value={newAction.assessment_id.toString()}
                      onValueChange={(value) => setNewAction({ ...newAction, assessment_id: Number.parseInt(value) })}
                      disabled={dialogMode === "view"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment" />
                      </SelectTrigger>
                      <SelectContent>
                        {assessments.map((assessment) => (
                          <SelectItem key={assessment.id} value={assessment.id.toString()}>
                            {assessment.assessment_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finding_title">Finding Title</Label>
                  <Select
                    value={newAction.finding_title}
                    onValueChange={(value) => setNewAction({ ...newAction, finding_title: value })}
                    disabled={dialogMode === "view"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select finding from gap analysis" />
                    </SelectTrigger>
                    <SelectContent>
                      {gapAnalyses.map((gap) => (
                        <SelectItem key={gap.id} value={gap.gap_description}>
                          {gap.gap_description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remediation_action">Remediation Action *</Label>
                  <Textarea
                    id="remediation_action"
                    value={newAction.remediation_action}
                    onChange={(e) => setNewAction({ ...newAction, remediation_action: e.target.value })}
                    placeholder="Describe the specific remediation action to be taken"
                    rows={3}
                    disabled={dialogMode === "view"}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finding_description">Finding Description</Label>
                  <Textarea
                    id="finding_description"
                    value={newAction.finding_description}
                    onChange={(e) => setNewAction({ ...newAction, finding_description: e.target.value })}
                    placeholder="Detailed description of the finding"
                    rows={2}
                    disabled={dialogMode === "view"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Assigned To</Label>
                                        <OwnerSelectInput formData={newAction} setFormData={setNewAction} fieldName="assigned_to"/>
                    {/* <Input
>>>>>>> 92baca0 (Functionality -> Search from User Table for field like Action Owner, Asset Owner, Assigned_to)
                      id="assigned_to"
                      value={newAction.assigned_to}
                      onChange={(e) => setNewAction({ ...newAction, assigned_to: e.target.value })}
                      placeholder="Enter assignee name"
                      disabled={dialogMode === "view"}
                    /> */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_department">Department</Label>
                    <Input
                      id="assigned_department"
                      value={newAction.assigned_department}
                      onChange={(e) => setNewAction({ ...newAction, assigned_department: e.target.value })}
                      placeholder="e.g., IT Security"
                      disabled={dialogMode === "view"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finding_severity">Severity</Label>
                    <Select
                      value={newAction.finding_severity}
                      onValueChange={(value) => setNewAction({ ...newAction, finding_severity: value })}
                      disabled={dialogMode === "view"}
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
                    <Label htmlFor="remediation_priority">Priority</Label>
                    <Select
                      value={newAction.remediation_priority}
                      onValueChange={(value) => setNewAction({ ...newAction, remediation_priority: value })}
                      disabled={dialogMode === "view"}
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
                    <Label htmlFor="remediation_status">Status</Label>
                    <Select
                      value={newAction.remediation_status}
                      onValueChange={(value) => setNewAction({ ...newAction, remediation_status: value })}
                      disabled={dialogMode === "view"}
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
                    <Label htmlFor="target_completion_date">Due Date</Label>
                    <Input
                      id="target_completion_date"
                      type="date"
                      value={newAction.target_completion_date}
                      onChange={(e) => setNewAction({ ...newAction, target_completion_date: e.target.value })}
                      disabled={dialogMode === "view"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="remediation_type">Type</Label>
                    <Select
                      value={newAction.remediation_type}
                      onValueChange={(value) => setNewAction({ ...newAction, remediation_type: value })}
                      disabled={dialogMode === "view"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">Immediate</SelectItem>
                        <SelectItem value="Short-term">Short-term</SelectItem>
                        <SelectItem value="Long-term">Long-term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finding_category">Category</Label>
                    <Select
                      value={newAction.finding_category}
                      onValueChange={(value) => setNewAction({ ...newAction, finding_category: value })}
                      disabled={dialogMode === "view"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                        <SelectItem value="Physical">Physical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_department">Department</Label>
                    <Input
                      id="assigned_department"
                      value={newAction.assigned_department}
                      onChange={(e) => setNewAction({ ...newAction, assigned_department: e.target.value })}
                      placeholder="e.g., IT Security"
                      disabled={dialogMode === "view"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimated_effort_hours">Estimated Effort (Hours)</Label>
                    <Input
                      id="estimated_effort_hours"
                      type="number"
                      value={newAction.estimated_effort_hours}
                      onChange={(e) =>
                        setNewAction({ ...newAction, estimated_effort_hours: Number.parseInt(e.target.value) || 0 })
                      }
                      disabled={dialogMode === "view"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_cost">Cost Estimate ($)</Label>
                    <Input
                      id="estimated_cost"
                      type="number"
                      value={newAction.estimated_cost}
                      onChange={(e) =>
                        setNewAction({ ...newAction, estimated_cost: Number.parseInt(e.target.value) || 0 })
                      }
                      disabled={dialogMode === "view"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_impact">Business Impact</Label>
                  <Textarea
                    id="business_impact"
                    value={newAction.business_impact}
                    onChange={(e) => setNewAction({ ...newAction, business_impact: e.target.value })}
                    placeholder="Describe the business impact if not remediated"
                    rows={2}
                    disabled={dialogMode === "view"}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {dialogMode === "view" ? "Close" : "Cancel"}
                </Button>
                {dialogMode !== "view" && (
                  <Button
                    onClick={() => {
                      if (dialogMode === "create") {
                        createRemediationAction()
                      } else if (dialogMode === "edit" && selectedAction) {
                        updateRemediationAction(selectedAction.id, newAction as any)
                        setIsDialogOpen(false)
                      }
                    }}
                  >
                    {dialogMode === "create" ? "Create Action" : "Update Action"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Deferred">Deferred</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NESA UAE Remediation Actions</CardTitle>
              <CardDescription>Track and manage compliance remediation activities</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredActions.length === 0 ? (
                <div className="text-center py-8">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading remediation actions...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground">No remediation actions found.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {actions.length === 0
                          ? "No data available in the database."
                          : `${actions.length} total actions, but none match current filters.`}
                      </p>
                      <Button onClick={() => openDialog("create")} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Action
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Finding ID</TableHead>
                      <TableHead>Finding Title</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell className="font-mono text-sm">{action.finding_id}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{action.finding_title}</div>
                            <div className="text-sm text-muted-foreground truncate">{action.remediation_action}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getSeverityColor(action.finding_severity)} text-white`}>
                            {action.finding_severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getSeverityColor(action.remediation_priority)} text-white`}>
                            {action.remediation_priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(action.remediation_status)}>
                            {action.remediation_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{action.assigned_to || "Unassigned"}</TableCell>
                        <TableCell>
                          <span
                            className={
                              isOverdue(action.target_completion_date, action.remediation_status)
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {formatDate(action.target_completion_date)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Progress value={getProgressValue(action)} className="w-full" />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openDialog("view", action)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openDialog("edit", action)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Monitor remediation progress and timelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActions.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{action.finding_title}</h4>
                        <p className="text-sm text-muted-foreground">{action.finding_id}</p>
                      </div>
                      <Badge className={getStatusColor(action.remediation_status)}>{action.remediation_status}</Badge>
                    </div>
                    <Progress value={getProgressValue(action)} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Assigned to: {action.assigned_to || "Unassigned"}</span>
                      <span>Due: {formatDate(action.target_completion_date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <NESAUAEAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
