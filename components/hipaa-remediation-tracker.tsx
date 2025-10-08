"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  User,
  DollarSign,
  Target,
  AlertCircle,
  XCircle,
  FileText,
  Users,
  BarChart3,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import OwnerSelectInput from "@/components/owner-search-input"

interface HIPAARemediationAction {
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
  actual_completion_date: string
  estimated_effort_hours: number
  actual_effort_hours: number
  estimated_cost: number
  actual_cost: number
  progress_percentage: number
  evidence_required: string
  evidence_provided: string
  risk_before_remediation: string
  risk_after_remediation: string
  business_impact: string
  requires_approval: boolean
  verification_status: string
  verification_comments: string
  timeline_status: string
  assessment_name: string
  hipaa_section: string
  control_name: string
  created_at: string
  updated_at: string
}

interface HIPAARemediationUpdate {
  id: number
  remediation_action_id: number
  update_type: string
  update_description: string
  previous_status: string
  new_status: string
  previous_progress: number
  new_progress: number
  update_by: string
  update_date: string
}

interface HIPAARemediationStats {
  overall: {
    total_actions: number
    open_actions: number
    in_progress_actions: number
    completed_actions: number
    closed_actions: number
    deferred_actions: number
    overdue_actions: number
    due_soon_actions: number
    avg_progress: number
    total_estimated_cost: number
    total_actual_cost: number
  }
  by_priority: Array<{
    remediation_priority: string
    count: number
    completed_count: number
    avg_progress: number
  }>
  by_severity: Array<{
    finding_severity: string
    count: number
    completed_count: number
    avg_progress: number
  }>
  by_department: Array<{
    assigned_department: string
    count: number
    completed_count: number
    avg_progress: number
  }>
}

interface HIPAARemediationTrackerProps {
  assessmentId?: number
}

export function HIPAARemediationTracker({ assessmentId }: HIPAARemediationTrackerProps) {
  const [remediationActions, setRemediationActions] = useState<HIPAARemediationAction[]>([])
  const [stats, setStats] = useState<HIPAARemediationStats | null>(null)
  const [selectedAction, setSelectedAction] = useState<HIPAARemediationAction | null>(null)
  const [actionUpdates, setActionUpdates] = useState<HIPAARemediationUpdate[]>([])
  const [isNewActionOpen, setIsNewActionOpen] = useState(false)
  const [isActionDetailOpen, setIsActionDetailOpen] = useState(false)
  const [isUpdateActionOpen, setIsUpdateActionOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [assignedToFilter, setAssignedToFilter] = useState("")
  const { toast } = useToast()

  const [newAction, setNewAction] = useState({
    assessment_id: assessmentId || 1,
    requirement_id: "",
    finding_id: "",
    finding_title: "",
    finding_description: "",
    finding_severity: "medium",
    finding_category: "technical",
    remediation_action: "",
    remediation_priority: "medium",
    remediation_type: "short-term",
    assigned_to: "",
    assigned_department: "",
    responsible_manager: "",
    target_completion_date: "",
    estimated_effort_hours: "",
    estimated_cost: "",
    evidence_required: "",
    risk_before_remediation: "medium",
    risk_after_remediation: "low",
    business_impact: "",
    requires_approval: false,
    verification_method: "",
  })

  const [actionUpdate, setActionUpdate] = useState({
    remediation_status: "",
    progress_percentage: "",
    update_comment: "",
    evidence_provided: "",
    verification_status: "",
    verification_comments: "",
  })

  useEffect(() => {
    fetchRemediationActions()
    fetchStats()
  }, [assessmentId, statusFilter, priorityFilter, assignedToFilter])

  const fetchRemediationActions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (assessmentId) params.append("assessment_id", assessmentId.toString())
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)
      if (priorityFilter && priorityFilter !== "all") params.append("priority", priorityFilter)
      if (assignedToFilter) params.append("assigned_to", assignedToFilter)

      const response = await fetch(`/api/hipaa-remediation?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRemediationActions(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch HIPAA remediation actions:", response.statusText)
        setRemediationActions([])
        toast({
          title: "Error",
          description: "Failed to load HIPAA remediation actions",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch HIPAA remediation actions:", error)
      setRemediationActions([])
      toast({
        title: "Error",
        description: "Failed to load HIPAA remediation actions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams()
      if (assessmentId) params.append("assessment_id", assessmentId.toString())

      const response = await fetch(`/api/hipaa-remediation/stats?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error("Failed to fetch HIPAA remediation stats:", response.statusText)
      }
    } catch (error) {
      console.error("Failed to fetch HIPAA remediation stats:", error)
    }
  }

  const fetchActionUpdates = async (actionId: number) => {
    try {
      const response = await fetch(`/api/hipaa-remediation/updates?remediation_action_id=${actionId}`)
      if (response.ok) {
        const data = await response.json()
        setActionUpdates(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch action updates:", response.statusText)
        setActionUpdates([])
      }
    } catch (error) {
      console.error("Failed to fetch action updates:", error)
      setActionUpdates([])
    }
  }

  const createRemediationAction = async () => {
    try {
      const response = await fetch("/api/hipaa-remediation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAction,
          estimated_effort_hours: Number.parseInt(newAction.estimated_effort_hours) || 0,
          estimated_cost: Number.parseFloat(newAction.estimated_cost) || 0,
          created_by: "Current User", // Replace with actual user
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "HIPAA remediation action created successfully",
        })
        setIsNewActionOpen(false)
        resetNewActionForm()
        fetchRemediationActions()
        fetchStats()
      } else {
        const errorData = await response.text()
        console.error("Failed to create HIPAA remediation action:", errorData)
        throw new Error("Failed to create HIPAA remediation action")
      }
    } catch (error) {
      console.error("Error creating HIPAA remediation action:", error)
      toast({
        title: "Error",
        description: "Failed to create HIPAA remediation action",
        variant: "destructive",
      })
    }
  }

  const updateRemediationAction = async () => {
    if (!selectedAction) return

    try {
      const response = await fetch("/api/hipaa-remediation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAction.id,
          remediation_status: actionUpdate.remediation_status || selectedAction.remediation_status,
          progress_percentage: Number.parseInt(actionUpdate.progress_percentage) || selectedAction.progress_percentage,
          evidence_provided: actionUpdate.evidence_provided || selectedAction.evidence_provided,
          verification_status: actionUpdate.verification_status || selectedAction.verification_status,
          verification_comments: actionUpdate.verification_comments || selectedAction.verification_comments,
          updated_by: "Current User", // Replace with actual user
          update_comment: actionUpdate.update_comment,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "HIPAA remediation action updated successfully",
        })
        setIsUpdateActionOpen(false)
        resetUpdateForm()
        fetchRemediationActions()
        fetchStats()
        if (selectedAction) {
          fetchActionUpdates(selectedAction.id)
        }
      } else {
        const errorData = await response.text()
        console.error("Failed to update HIPAA remediation action:", errorData)
        throw new Error("Failed to update HIPAA remediation action")
      }
    } catch (error) {
      console.error("Error updating HIPAA remediation action:", error)
      toast({
        title: "Error",
        description: "Failed to update HIPAA remediation action",
        variant: "destructive",
      })
    }
  }

  const resetNewActionForm = () => {
    setNewAction({
      assessment_id: assessmentId || 1,
      requirement_id: "",
      finding_id: "",
      finding_title: "",
      finding_description: "",
      finding_severity: "medium",
      finding_category: "technical",
      remediation_action: "",
      remediation_priority: "medium",
      remediation_type: "short-term",
      assigned_to: "",
      assigned_department: "",
      responsible_manager: "",
      target_completion_date: "",
      estimated_effort_hours: "",
      estimated_cost: "",
      evidence_required: "",
      risk_before_remediation: "medium",
      risk_after_remediation: "low",
      business_impact: "",
      requires_approval: false,
      verification_method: "",
    })
  }

  const resetUpdateForm = () => {
    setActionUpdate({
      remediation_status: "",
      progress_percentage: "",
      update_comment: "",
      evidence_provided: "",
      verification_status: "",
      verification_comments: "",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-gradient-to-r from-red-600 to-red-700 text-white"
      case "high":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-gradient-to-r from-red-600 to-red-700 text-white"
      case "high":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "in-progress":
      case "in progress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "under-review":
      case "under review":
        return "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
      case "open":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      case "closed":
        return "bg-gradient-to-r from-green-600 to-green-700 text-white"
      case "deferred":
        return "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getTimelineStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "overdue":
        return "bg-gradient-to-r from-red-600 to-red-700 text-white"
      case "due soon":
      case "due-soon":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "on track":
      case "on-track":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
      case "in progress":
        return <Clock className="h-4 w-4" />
      case "under-review":
      case "under review":
        return <Eye className="h-4 w-4" />
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      case "deferred":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredActions = Array.isArray(remediationActions)
    ? remediationActions.filter(
        (action) =>
          action.finding_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.finding_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.assigned_department?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            HIPAA Remediation Tracker
          </h2>
          <p className="text-muted-foreground">Track and manage remediation actions for HIPAA findings</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchRemediationActions}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isNewActionOpen} onOpenChange={setIsNewActionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Remediation Action
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Create New HIPAA Remediation Action
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finding_id">Finding ID *</Label>
                    <Input
                      id="finding_id"
                      value={newAction.finding_id}
                      onChange={(e) => setNewAction((prev) => ({ ...prev, finding_id: e.target.value }))}
                      placeholder="e.g., HIPAA-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finding_severity">Finding Severity</Label>
                    <Select
                      value={newAction.finding_severity}
                      onValueChange={(value) => setNewAction((prev) => ({ ...prev, finding_severity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finding_title">Finding Title *</Label>
                  <Input
                    id="finding_title"
                    value={newAction.finding_title}
                    onChange={(e) => setNewAction((prev) => ({ ...prev, finding_title: e.target.value }))}
                    placeholder="Brief description of the HIPAA finding"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finding_description">Finding Description</Label>
                  <Textarea
                    id="finding_description"
                    value={newAction.finding_description}
                    onChange={(e) => setNewAction((prev) => ({ ...prev, finding_description: e.target.value }))}
                    placeholder="Detailed description of the HIPAA compliance finding"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remediation_action">Remediation Action *</Label>
                  <Textarea
                    id="remediation_action"
                    value={newAction.remediation_action}
                    onChange={(e) => setNewAction((prev) => ({ ...prev, remediation_action: e.target.value }))}
                    placeholder="Detailed remediation action plan to address the HIPAA finding"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="remediation_priority">Priority</Label>
                    <Select
                      value={newAction.remediation_priority}
                      onValueChange={(value) => setNewAction((prev) => ({ ...prev, remediation_priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remediation_type">Type</Label>
                    <Select
                      value={newAction.remediation_type}
                      onValueChange={(value) => setNewAction((prev) => ({ ...prev, remediation_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="short-term">Short-term</SelectItem>
                        <SelectItem value="long-term">Long-term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finding_category">Category</Label>
                    <Select
                      value={newAction.finding_category}
                      onValueChange={(value) => setNewAction((prev) => ({ ...prev, finding_category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="physical">Physical</SelectItem>
                        <SelectItem value="privacy">Privacy</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Assigned To</Label>                    
                    <OwnerSelectInput formData={newAction} setFormData={setNewAction} fieldName="assigned_to"/>
                    {/* <Input
                      id="assigned_to"
                      value={newAction.assigned_to}
                      onChange={(e) => setNewAction((prev) => ({ ...prev, assigned_to: e.target.value }))}
                      placeholder="Person responsible"
                    /> */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_department">Department</Label>
                    <Input
                      id="assigned_department"
                      value={newAction.assigned_department}
                      onChange={(e) => setNewAction((prev) => ({ ...prev, assigned_department: e.target.value }))}
                      placeholder="Responsible department"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible_manager">Manager</Label>
                    <Input
                      id="responsible_manager"
                      value={newAction.responsible_manager}
                      onChange={(e) => setNewAction((prev) => ({ ...prev, responsible_manager: e.target.value }))}
                      placeholder="Responsible manager"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_completion_date">Target Date</Label>
                    <Input
                      id="target_completion_date"
                      type="date"
                      value={newAction.target_completion_date}
                      onChange={(e) => setNewAction((prev) => ({ ...prev, target_completion_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_effort_hours">Estimated Hours</Label>
                    <Input
                      id="estimated_effort_hours"
                      type="number"
                      value={newAction.estimated_effort_hours}
                      onChange={(e) => setNewAction((prev) => ({ ...prev, estimated_effort_hours: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_cost">Estimated Cost</Label>
                    <Input
                      id="estimated_cost"
                      type="number"
                      step="0.01"
                      value={newAction.estimated_cost}
                      onChange={(e) => setNewAction((prev) => ({ ...prev, estimated_cost: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_impact">Business Impact</Label>
                  <Textarea
                    id="business_impact"
                    value={newAction.business_impact}
                    onChange={(e) => setNewAction((prev) => ({ ...prev, business_impact: e.target.value }))}
                    placeholder="Describe the business impact of this HIPAA finding"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence_required">Evidence Required</Label>
                  <Textarea
                    id="evidence_required"
                    value={newAction.evidence_required}
                    onChange={(e) => setNewAction((prev) => ({ ...prev, evidence_required: e.target.value }))}
                    placeholder="Describe what evidence is required to verify HIPAA compliance"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewActionOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={createRemediationAction}
                    disabled={!newAction.finding_id || !newAction.finding_title || !newAction.remediation_action}
                  >
                    Create Action
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats?.overall && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.overall.total_actions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.overall.completed_actions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.overall.in_progress_actions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overall.overdue_actions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.overall.due_soon_actions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Avg Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.overall.avg_progress?.toFixed(1) || 0}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actions">Remediation Actions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <Card className="gradient-card-primary">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HIPAA Remediation Actions
              </CardTitle>
              <CardDescription>Track and manage HIPAA remediation actions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm border-blue-200 focus:border-purple-400"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="deferred">Deferred</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Assigned to..."
                  value={assignedToFilter}
                  onChange={(e) => setAssignedToFilter(e.target.value)}
                  className="max-w-sm border-blue-200 focus:border-purple-400"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("")
                    setPriorityFilter("")
                    setAssignedToFilter("")
                    setSearchTerm("")
                  }}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2">Loading HIPAA remediation actions...</span>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden border border-blue-200/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-blue-100/50">
                        <TableHead>Finding ID</TableHead>
                        <TableHead>Finding Title</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Target Date</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            No HIPAA remediation actions found. Create your first action to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredActions.map((action) => (
                          <TableRow
                            key={action.id}
                            className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-blue-50/30"
                          >
                            <TableCell className="font-medium">{action.finding_id}</TableCell>
                            <TableCell className="max-w-xs truncate">{action.finding_title}</TableCell>
                            <TableCell>
                              <Badge className={getSeverityColor(action.finding_severity)}>
                                {action.finding_severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(action.remediation_priority)}>
                                {action.remediation_priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(action.remediation_status)}
                                <Badge className={getStatusColor(action.remediation_status)}>
                                  {action.remediation_status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={action.progress_percentage || 0} className="w-16 h-2" />
                                <span className="text-sm">{action.progress_percentage || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{action.assigned_to || "Unassigned"}</TableCell>
                            <TableCell>
                              {action.target_completion_date
                                ? new Date(action.target_completion_date).toLocaleDateString()
                                : "Not set"}
                            </TableCell>
                            <TableCell>
                              <Badge className={getTimelineStatusColor(action.timeline_status)}>
                                {action.timeline_status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-blue-100"
                                  onClick={() => {
                                    setSelectedAction(action)
                                    fetchActionUpdates(action.id)
                                    setIsActionDetailOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-purple-100"
                                  onClick={() => {
                                    setSelectedAction(action)
                                    setActionUpdate({
                                      remediation_status: action.remediation_status,
                                      progress_percentage: action.progress_percentage.toString(),
                                      update_comment: "",
                                      evidence_provided: action.evidence_provided || "",
                                      verification_status: action.verification_status || "",
                                      verification_comments: action.verification_comments || "",
                                    })
                                    setIsUpdateActionOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Actions by Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.isArray(stats.by_priority) && stats.by_priority.length > 0 ? (
                      stats.by_priority.map((item) => (
                        <div key={item.remediation_priority} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(item.remediation_priority)}>
                              {item.remediation_priority}
                            </Badge>
                            <span className="text-sm">{item.count} actions</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={(item.completed_count / item.count) * 100} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {item.completed_count}/{item.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No priority data available</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Actions by Severity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.isArray(stats.by_severity) && stats.by_severity.length > 0 ? (
                      stats.by_severity.map((item) => (
                        <div key={item.finding_severity} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(item.finding_severity)}>{item.finding_severity}</Badge>
                            <span className="text-sm">{item.count} findings</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={(item.completed_count / item.count) * 100} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {item.completed_count}/{item.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No severity data available</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Actions by Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.isArray(stats.by_department) && stats.by_department.length > 0 ? (
                      stats.by_department.slice(0, 5).map((item) => (
                        <div key={item.assigned_department} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.assigned_department}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={(item.completed_count / item.count) * 100} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {item.completed_count}/{item.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No department data available</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Cost Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Estimated Cost</span>
                      </div>
                      <span className="font-medium">
                        ${(stats.overall?.total_estimated_cost || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Actual Cost</span>
                      </div>
                      <span className="font-medium">${(stats.overall?.total_actual_cost || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Variance</span>
                      </div>
                      <span
                        className={`font-medium ${
                          (stats.overall?.total_actual_cost || 0) > (stats.overall?.total_estimated_cost || 0)
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        $
                        {Math.abs(
                          (stats.overall?.total_actual_cost || 0) - (stats.overall?.total_estimated_cost || 0),
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading analytics...</span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="gradient-card-primary">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HIPAA Remediation Reports
              </CardTitle>
              <CardDescription>Generate comprehensive HIPAA remediation tracking reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <FileText className="h-6 w-6" />
                  <span>Executive Summary</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Progress Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Target className="h-6 w-6" />
                  <span>Overdue Actions</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Users className="h-6 w-6" />
                  <span>Department Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <DollarSign className="h-6 w-6" />
                  <span>Cost Analysis</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Shield className="h-6 w-6" />
                  <span>Compliance Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Detail Dialog */}
      <Dialog open={isActionDetailOpen} onOpenChange={setIsActionDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HIPAA Remediation Action Details
            </DialogTitle>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Finding Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Finding ID:</strong> {selectedAction.finding_id}
                    </div>
                    <div>
                      <strong>Title:</strong> {selectedAction.finding_title}
                    </div>
                    <div>
                      <strong>Severity:</strong>
                      <Badge className={`ml-2 ${getSeverityColor(selectedAction.finding_severity)}`}>
                        {selectedAction.finding_severity}
                      </Badge>
                    </div>
                    <div>
                      <strong>Category:</strong> {selectedAction.finding_category}
                    </div>
                    <div>
                      <strong>HIPAA Section:</strong> {selectedAction.hipaa_section}
                    </div>
                    <div>
                      <strong>Description:</strong>
                      <p className="mt-1 text-muted-foreground">{selectedAction.finding_description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Remediation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Priority:</strong>
                      <Badge className={`ml-2 ${getPriorityColor(selectedAction.remediation_priority)}`}>
                        {selectedAction.remediation_priority}
                      </Badge>
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <Badge className={`ml-2 ${getStatusColor(selectedAction.remediation_status)}`}>
                        {selectedAction.remediation_status}
                      </Badge>
                    </div>
                    <div>
                      <strong>Type:</strong> {selectedAction.remediation_type}
                    </div>
                    <div>
                      <strong>Progress:</strong>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={selectedAction.progress_percentage || 0} className="flex-1 h-2" />
                        <span>{selectedAction.progress_percentage || 0}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Remediation Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedAction.remediation_action}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Assignment & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Assigned To:</strong> {selectedAction.assigned_to || "Unassigned"}
                    </div>
                    <div>
                      <strong>Department:</strong> {selectedAction.assigned_department || "Not specified"}
                    </div>
                    <div>
                      <strong>Manager:</strong> {selectedAction.responsible_manager || "Not specified"}
                    </div>
                    <div>
                      <strong>Target Date:</strong>{" "}
                      {selectedAction.target_completion_date
                        ? new Date(selectedAction.target_completion_date).toLocaleDateString()
                        : "Not set"}
                    </div>
                    <div>
                      <strong>Timeline Status:</strong>
                      <Badge className={`ml-2 ${getTimelineStatusColor(selectedAction.timeline_status)}`}>
                        {selectedAction.timeline_status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Cost & Effort</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Estimated Hours:</strong> {selectedAction.estimated_effort_hours || 0}
                    </div>
                    <div>
                      <strong>Actual Hours:</strong> {selectedAction.actual_effort_hours || 0}
                    </div>
                    <div>
                      <strong>Estimated Cost:</strong> ${selectedAction.estimated_cost?.toLocaleString() || 0}
                    </div>
                    <div>
                      <strong>Actual Cost:</strong> ${selectedAction.actual_cost?.toLocaleString() || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedAction.business_impact && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Business Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAction.business_impact}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {actionUpdates.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">No activity updates found.</div>
                      ) : (
                        actionUpdates.map((update) => (
                          <div key={update.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                            <div className="flex-shrink-0 mt-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {update.update_type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(update.update_date).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{update.update_description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{update.update_by}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Action Dialog */}
      <Dialog open={isUpdateActionOpen} onOpenChange={setIsUpdateActionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Update HIPAA Remediation Action
            </DialogTitle>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="update_status">Status</Label>
                  <Select
                    value={actionUpdate.remediation_status}
                    onValueChange={(value) => setActionUpdate((prev) => ({ ...prev, remediation_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="deferred">Deferred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update_progress">Progress (%)</Label>
                  <Input
                    id="update_progress"
                    type="number"
                    min="0"
                    max="100"
                    value={actionUpdate.progress_percentage}
                    onChange={(e) => setActionUpdate((prev) => ({ ...prev, progress_percentage: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update_comment">Update Comment *</Label>
                <Textarea
                  id="update_comment"
                  value={actionUpdate.update_comment}
                  onChange={(e) => setActionUpdate((prev) => ({ ...prev, update_comment: e.target.value }))}
                  placeholder="Describe the progress or changes made"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence_provided">Evidence Provided</Label>
                <Textarea
                  id="evidence_provided"
                  value={actionUpdate.evidence_provided}
                  onChange={(e) => setActionUpdate((prev) => ({ ...prev, evidence_provided: e.target.value }))}
                  placeholder="Describe evidence of HIPAA compliance completion or progress"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="verification_status">Verification Status</Label>
                  <Select
                    value={actionUpdate.verification_status}
                    onValueChange={(value) => setActionUpdate((prev) => ({ ...prev, verification_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select verification status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {actionUpdate.verification_status && (
                <div className="space-y-2">
                  <Label htmlFor="verification_comments">Verification Comments</Label>
                  <Textarea
                    id="verification_comments"
                    value={actionUpdate.verification_comments}
                    onChange={(e) => setActionUpdate((prev) => ({ ...prev, verification_comments: e.target.value }))}
                    placeholder="Comments about the HIPAA compliance verification process"
                    rows={2}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUpdateActionOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={updateRemediationAction}
                  disabled={!actionUpdate.update_comment}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Update Action
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
