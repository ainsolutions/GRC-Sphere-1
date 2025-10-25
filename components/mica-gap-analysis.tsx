"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle, Clock, Users, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { ActionButtons } from "./ui/action-buttons"

interface MICAAssessment {
  id: string
  assessment_name: string
  status: string
  created_at: string
}

interface MICARequirement {
  id: string
  title: string
  description: string
  category: string
}

interface MICAGapAnalysisItem {
  id: string
  assessment_id: string
  assessment_name: string
  requirement_id: string
  requirement_title: string
  current_maturity_level: number
  existing_controls: string
  document_reference: string
  gap_description: string
  action_plan: string
  action_owner: string
  priority: string
  status: string
  target_completion_date: string
  created_at: string
  updated_at: string
}

interface BulkGapForm {
  assessment_id: string
  requirements: string[]
  current_maturity_level: number
  existing_controls: string
  document_reference: string
  gap_description: string
  action_plan: string
  action_owner: string
  priority: string
  target_completion_date: string
}

export function MICAGapAnalysis() {
  const [gapAnalyses, setGapAnalyses] = useState<MICAGapAnalysisItem[]>([])
  const [assessments, setAssessments] = useState<MICAAssessment[]>([])
  const [requirements, setRequirements] = useState<MICARequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MICAGapAnalysisItem | null>(null)

  const [newGap, setNewGap] = useState({
    assessment_id: "",
    requirement_id: "",
    current_maturity_level: 0,
    existing_controls: "",
    document_reference: "",
    gap_description: "",
    action_plan: "",
    action_owner: "",
    priority: "medium",
    target_completion_date: "",
  })

  const [bulkGapForm, setBulkGapForm] = useState<BulkGapForm>({
    assessment_id: "",
    requirements: [],
    current_maturity_level: 0,
    existing_controls: "",
    document_reference: "",
    gap_description: "",
    action_plan: "",
    action_owner: "",
    priority: "medium",
    target_completion_date: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [gapResponse, assessmentResponse, requirementResponse] = await Promise.all([
        fetch("/api/mica-gap-analysis"),
        fetch("/api/mica-assessments"),
        fetch("/api/mica/requirements"),
      ])

      if (gapResponse.ok) {
        const gapData = await gapResponse.json()
        setGapAnalyses(gapData)
      }

      if (assessmentResponse.ok) {
        const assessmentData = await assessmentResponse.json()
        setAssessments(assessmentData)
      }

      if (requirementResponse.ok) {
        const requirementData = await requirementResponse.json()
        setRequirements(requirementData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGap = async () => {
    try {
      const response = await fetch("/api/mica-gap-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGap),
      })

      if (response.ok) {
        toast.success("Gap analysis created successfully")
        setIsCreateDialogOpen(false)
        setNewGap({
          assessment_id: "",
          requirement_id: "",
          current_maturity_level: 0,
          existing_controls: "",
          document_reference: "",
          gap_description: "",
          action_plan: "",
          action_owner: "",
          priority: "medium",
          target_completion_date: "",
        })
        fetchData()
      } else {
        toast.error("Failed to create gap analysis")
      }
    } catch (error) {
      console.error("Error creating gap analysis:", error)
      toast.error("Failed to create gap analysis")
    }
  }

  const handleBulkCreateGaps = async () => {
    try {
      const response = await fetch("/api/mica-gap-analysis/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bulkGapForm),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`${result.created} gap analyses created successfully`)
        setIsBulkCreateDialogOpen(false)
        setBulkGapForm({
          assessment_id: "",
          requirements: [],
          current_maturity_level: 0,
          existing_controls: "",
          document_reference: "",
          gap_description: "",
          action_plan: "",
          action_owner: "",
          priority: "medium",
          target_completion_date: "",
        })
        fetchData()
      } else {
        toast.error("Failed to create bulk gap analyses")
      }
    } catch (error) {
      console.error("Error creating bulk gap analyses:", error)
      toast.error("Failed to create bulk gap analyses")
    }
  }

  const handleUpdateGap = async () => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/mica-gap-analysis/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingItem),
      })

      if (response.ok) {
        toast.success("Gap analysis updated successfully")
        setEditingItem(null)
        fetchData()
      } else {
        toast.error("Failed to update gap analysis")
      }
    } catch (error) {
      console.error("Error updating gap analysis:", error)
      toast.error("Failed to update gap analysis")
    }
  }

  const handleDeleteGap = async (id: string) => {
    try {
      const response = await fetch(`/api/mica-gap-analysis/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Gap analysis deleted successfully")
        fetchData()
      } else {
        toast.error("Failed to delete gap analysis")
      }
    } catch (error) {
      console.error("Error deleting gap analysis:", error)
      toast.error("Failed to delete gap analysis")
    }
  }

  const filteredGapAnalyses = gapAnalyses.filter((gap) => {
    const matchesSearch =
      gap.requirement_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gap.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gap.action_owner.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || gap.status === statusFilter
    const matchesPriority = priorityFilter === "all" || gap.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      "in-progress": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
      critical: "bg-purple-100 text-purple-800",
    }

    return (
      <Badge className={priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const handleRequirementToggle = (requirementId: string, checked: boolean) => {
    setBulkGapForm((prev) => ({
      ...prev,
      requirements: checked
        ? [...prev.requirements, requirementId]
        : prev.requirements.filter((id) => id !== requirementId),
    }))
  }

  if (loading) {
    return (
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MICA Gap Analysis
              </CardTitle>
              <CardDescription>Identify and track gaps in MICA compliance requirements</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <ActionButtons isTableAction={false} onAdd={() => {}} btnAddText="New Gap Analysis" />
                  {/* <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Gap Analysis
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Gap Analysis</DialogTitle>
                    <DialogDescription>Add a new gap analysis for MICA compliance requirements</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessment">Assessment</Label>
                      <Select
                        value={newGap.assessment_id}
                        onValueChange={(value) => setNewGap({ ...newGap, assessment_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assessment" />
                        </SelectTrigger>
                        <SelectContent>
                          {assessments.map((assessment) => (
                            <SelectItem key={assessment.id} value={assessment.id}>
                              {assessment.assessment_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirement">Requirement</Label>
                      <Select
                        value={newGap.requirement_id}
                        onValueChange={(value) => setNewGap({ ...newGap, requirement_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select requirement" />
                        </SelectTrigger>
                        <SelectContent>
                          {requirements.map((requirement) => (
                            <SelectItem key={requirement.id} value={requirement.id}>
                              {requirement.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maturity">Current Maturity Level</Label>
                      <Select
                        value={newGap.current_maturity_level.toString()}
                        onValueChange={(value) =>
                          setNewGap({ ...newGap, current_maturity_level: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select maturity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Level 0 - Non-existent</SelectItem>
                          <SelectItem value="1">Level 1 - Initial</SelectItem>
                          <SelectItem value="2">Level 2 - Repeatable</SelectItem>
                          <SelectItem value="3">Level 3 - Defined</SelectItem>
                          <SelectItem value="4">Level 4 - Managed</SelectItem>
                          <SelectItem value="5">Level 5 - Optimized</SelectItem>
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
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="existing_controls">Existing Controls</Label>
                      <Textarea
                        id="existing_controls"
                        placeholder="Describe current controls in place..."
                        value={newGap.existing_controls}
                        onChange={(e) => setNewGap({ ...newGap, existing_controls: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="document_reference" className="flex items-center gap-1">
                              Document Reference
                              <HelpCircle className="h-3 w-3" />
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Policy, procedure reference</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input
                        id="document_reference"
                        placeholder="e.g., POL-001, PROC-SEC-001"
                        value={newGap.document_reference}
                        onChange={(e) => setNewGap({ ...newGap, document_reference: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="gap_description">Gap Description</Label>
                      <Textarea
                        id="gap_description"
                        placeholder="Describe the identified gap..."
                        value={newGap.gap_description}
                        onChange={(e) => setNewGap({ ...newGap, gap_description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="action_plan">Action Plan</Label>
                      <Textarea
                        id="action_plan"
                        placeholder="Describe the remediation plan..."
                        value={newGap.action_plan}
                        onChange={(e) => setNewGap({ ...newGap, action_plan: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="action_owner">Action Owner</Label>
                      <Input
                        id="action_owner"
                        placeholder="Responsible person"
                        value={newGap.action_owner}
                        onChange={(e) => setNewGap({ ...newGap, action_owner: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_date">Target Completion Date</Label>
                      <Input
                        id="target_date"
                        type="date"
                        value={newGap.target_completion_date}
                        onChange={(e) => setNewGap({ ...newGap, target_completion_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGap}>Create Gap Analysis</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isBulkCreateDialogOpen} onOpenChange={setIsBulkCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Bulk Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Bulk Create Gap Analyses</DialogTitle>
                    <DialogDescription>
                      Create multiple gap analyses for selected requirements against one assessment
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Assessment Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="bulk_assessment">Assessment</Label>
                      <Select
                        value={bulkGapForm.assessment_id}
                        onValueChange={(value) => setBulkGapForm({ ...bulkGapForm, assessment_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assessment" />
                        </SelectTrigger>
                        <SelectContent>
                          {assessments.map((assessment) => (
                            <SelectItem key={assessment.id} value={assessment.id}>
                              {assessment.assessment_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Requirements Selection */}
                    <div className="space-y-2">
                      <Label>Requirements ({bulkGapForm.requirements.length} selected)</Label>
                      <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {requirements.map((requirement) => (
                            <div key={requirement.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={requirement.id}
                                checked={bulkGapForm.requirements.includes(requirement.id)}
                                onCheckedChange={(checked) =>
                                  handleRequirementToggle(requirement.id, checked as boolean)
                                }
                              />
                              <Label htmlFor={requirement.id} className="text-sm flex-1 cursor-pointer">
                                <div className="font-medium">{requirement.title}</div>
                                <div className="text-xs text-muted-foreground">{requirement.category}</div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Common Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bulk_maturity">Current Maturity Level</Label>
                        <Select
                          value={bulkGapForm.current_maturity_level.toString()}
                          onValueChange={(value) =>
                            setBulkGapForm({ ...bulkGapForm, current_maturity_level: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select maturity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Level 0 - Non-existent</SelectItem>
                            <SelectItem value="1">Level 1 - Initial</SelectItem>
                            <SelectItem value="2">Level 2 - Repeatable</SelectItem>
                            <SelectItem value="3">Level 3 - Defined</SelectItem>
                            <SelectItem value="4">Level 4 - Managed</SelectItem>
                            <SelectItem value="5">Level 5 - Optimized</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulk_priority">Priority</Label>
                        <Select
                          value={bulkGapForm.priority}
                          onValueChange={(value) => setBulkGapForm({ ...bulkGapForm, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bulk_existing_controls">Existing Controls</Label>
                        <Textarea
                          id="bulk_existing_controls"
                          placeholder="Describe current controls in place..."
                          value={bulkGapForm.existing_controls}
                          onChange={(e) => setBulkGapForm({ ...bulkGapForm, existing_controls: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Label htmlFor="bulk_document_reference" className="flex items-center gap-1">
                                Document Reference
                                <HelpCircle className="h-3 w-3" />
                              </Label>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Policy, procedure reference</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Input
                          id="bulk_document_reference"
                          placeholder="e.g., POL-001, PROC-SEC-001"
                          value={bulkGapForm.document_reference}
                          onChange={(e) => setBulkGapForm({ ...bulkGapForm, document_reference: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bulk_gap_description">Gap Description</Label>
                        <Textarea
                          id="bulk_gap_description"
                          placeholder="Describe the identified gap..."
                          value={bulkGapForm.gap_description}
                          onChange={(e) => setBulkGapForm({ ...bulkGapForm, gap_description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bulk_action_plan">Action Plan</Label>
                        <Textarea
                          id="bulk_action_plan"
                          placeholder="Describe the remediation plan..."
                          value={bulkGapForm.action_plan}
                          onChange={(e) => setBulkGapForm({ ...bulkGapForm, action_plan: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulk_action_owner">Action Owner</Label>
                        <Input
                          id="bulk_action_owner"
                          placeholder="Responsible person"
                          value={bulkGapForm.action_owner}
                          onChange={(e) => setBulkGapForm({ ...bulkGapForm, action_owner: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulk_target_date">Target Completion Date</Label>
                        <Input
                          id="bulk_target_date"
                          type="date"
                          value={bulkGapForm.target_completion_date}
                          onChange={(e) => setBulkGapForm({ ...bulkGapForm, target_completion_date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsBulkCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBulkCreateGaps}
                      disabled={bulkGapForm.requirements.length === 0 || !bulkGapForm.assessment_id}
                    >
                      Create {bulkGapForm.requirements.length} Gap Analyses
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search gap analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gap Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gap Analysis Results ({filteredGapAnalyses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Maturity Level</TableHead>
                  <TableHead>Gap</TableHead>
                  <TableHead>Action Owner</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGapAnalyses.map((gap) => (
                  <TableRow key={gap.id}>
                    <TableCell className="font-medium">{gap.assessment_name}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{gap.requirement_title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Level {gap.current_maturity_level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={gap.gap_description}>
                        {gap.gap_description}
                      </div>
                    </TableCell>
                    <TableCell>{gap.action_owner}</TableCell>
                    <TableCell>{getPriorityBadge(gap.priority)}</TableCell>
                    <TableCell>{getStatusBadge(gap.status)}</TableCell>
                    <TableCell>
                      {gap.target_completion_date
                        ? new Date(gap.target_completion_date).toLocaleDateString()
                        : "Not set"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <ActionButtons isTableAction={true}
                          //onView={() => {}} 
                          onEdit={() => setEditingItem(gap)}
                          onDelete={() => handleDeleteGap(gap.id)}
                          deleteDialogTitle={gap.assessment_name}
                                actionObj={gap}
                        />
                        {/* <Button variant="outline" size="sm" onClick={() => setEditingItem(gap)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGap(gap.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Gap Analysis</DialogTitle>
              <DialogDescription>Update the gap analysis details</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_maturity">Current Maturity Level</Label>
                <Select
                  value={editingItem.current_maturity_level.toString()}
                  onValueChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      current_maturity_level: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select maturity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Level 0 - Non-existent</SelectItem>
                    <SelectItem value="1">Level 1 - Initial</SelectItem>
                    <SelectItem value="2">Level 2 - Repeatable</SelectItem>
                    <SelectItem value="3">Level 3 - Defined</SelectItem>
                    <SelectItem value="4">Level 4 - Managed</SelectItem>
                    <SelectItem value="5">Level 5 - Optimized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={editingItem.status}
                  onValueChange={(value) => setEditingItem({ ...editingItem, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit_existing_controls">Existing Controls</Label>
                <Textarea
                  id="edit_existing_controls"
                  value={editingItem.existing_controls}
                  onChange={(e) => setEditingItem({ ...editingItem, existing_controls: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="edit_document_reference" className="flex items-center gap-1">
                        Document Reference
                        <HelpCircle className="h-3 w-3" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Policy, procedure reference</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  id="edit_document_reference"
                  value={editingItem.document_reference}
                  onChange={(e) => setEditingItem({ ...editingItem, document_reference: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit_gap_description">Gap Description</Label>
                <Textarea
                  id="edit_gap_description"
                  value={editingItem.gap_description}
                  onChange={(e) => setEditingItem({ ...editingItem, gap_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit_action_plan">Action Plan</Label>
                <Textarea
                  id="edit_action_plan"
                  value={editingItem.action_plan}
                  onChange={(e) => setEditingItem({ ...editingItem, action_plan: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_action_owner">Action Owner</Label>
                <Input
                  id="edit_action_owner"
                  value={editingItem.action_owner}
                  onChange={(e) => setEditingItem({ ...editingItem, action_owner: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_target_date">Target Completion Date</Label>
                <Input
                  id="edit_target_date"
                  type="date"
                  value={editingItem.target_completion_date}
                  onChange={(e) => setEditingItem({ ...editingItem, target_completion_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGap}>Update Gap Analysis</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
