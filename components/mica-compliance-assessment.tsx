"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import {
  Plus,
  FileText,
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
} from "lucide-react"

interface MICAAssessment {
  id: string
  assessment_id: string
  assessment_name: string
  description: string
  assessment_type: string
  scope: string
  assessor_name: string
  assessor_email: string
  start_date: string
  target_completion_date: string
  status: string
  created_at: string
  updated_at: string
}

interface MICARequirement {
  id: string
  requirement_id: string
  title: string
  description: string
  category: string
  risk_level: string
  compliance_status: string
}

export function MICAComplianceAssessment() {
  const [assessments, setAssessments] = useState<MICAAssessment[]>([])
  const [requirements, setRequirements] = useState<MICARequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAssessment, setSelectedAssessment] = useState<MICAAssessment | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<MICAAssessment | null>(null)
  const [generatingId, setGeneratingId] = useState(false)
  const [creating, setCreating] = useState(false)

  const [newAssessment, setNewAssessment] = useState({
    assessment_id: "",
    assessment_name: "",
    description: "",
    assessment_type: "self_assessment",
    scope: "",
    assessor_name: "",
    assessor_email: "",
    start_date: "",
    target_completion_date: "",
    status: "draft",
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isCreateDialogOpen && !newAssessment.assessment_id) {
      generateAssessmentId()
    }
  }, [isCreateDialogOpen])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [assessmentResponse, requirementResponse] = await Promise.all([
        fetch("/api/mica-assessments"),
        fetch("/api/mica/requirements"),
      ])

      if (assessmentResponse.ok) {
        const assessmentData = await assessmentResponse.json()
        setAssessments(assessmentData)
      } else {
        console.error("Failed to fetch assessments:", await assessmentResponse.text())
        toast.error("Failed to load assessments")
      }

      if (requirementResponse.ok) {
        const requirementData = await requirementResponse.json()
        setRequirements(requirementData)
      } else {
        console.error("Failed to fetch requirements:", await requirementResponse.text())
        // Don't show error for requirements as it's not critical
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load assessment data")
    } finally {
      setLoading(false)
    }
  }

  const generateAssessmentId = async () => {
    try {
      setGeneratingId(true)
      const response = await fetch("/api/mica-assessments/generate-id")
      if (response.ok) {
        const data = await response.json()
        setNewAssessment((prev) => ({ ...prev, assessment_id: data.assessment_id }))
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to generate assessment ID")
      }
    } catch (error) {
      console.error("Error generating assessment ID:", error)
      toast.error("Failed to generate assessment ID")
    } finally {
      setGeneratingId(false)
    }
  }

  const handleCreateAssessment = async () => {
    try {
      if (!newAssessment.assessment_name.trim()) {
        toast.error("Assessment name is required")
        return
      }

      if (!newAssessment.assessment_id.trim()) {
        toast.error("Assessment ID is required")
        return
      }

      setCreating(true)

      const response = await fetch("/api/mica-assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssessment),
      })

      if (response.ok) {
        toast.success("MICA assessment created successfully")
        setIsCreateDialogOpen(false)
        setNewAssessment({
          assessment_id: "",
          assessment_name: "",
          description: "",
          assessment_type: "self_assessment",
          scope: "",
          assessor_name: "",
          assessor_email: "",
          start_date: "",
          target_completion_date: "",
          status: "draft",
        })
        fetchData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to create assessment")
      }
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast.error("Failed to create assessment")
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateAssessment = async () => {
    if (!editingAssessment) return

    try {
      const response = await fetch(`/api/mica-assessments/${editingAssessment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingAssessment),
      })

      if (response.ok) {
        toast.success("Assessment updated successfully")
        setEditingAssessment(null)
        fetchData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update assessment")
      }
    } catch (error) {
      console.error("Error updating assessment:", error)
      toast.error("Failed to update assessment")
    }
  }

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return

    try {
      const response = await fetch(`/api/mica-assessments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Assessment deleted successfully")
        fetchData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete assessment")
      }
    } catch (error) {
      console.error("Error deleting assessment:", error)
      toast.error("Failed to delete assessment")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", icon: FileText },
      "in-progress": { color: "bg-blue-100 text-blue-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "under-review": { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    )
  }

  const stats = {
    totalAssessments: assessments.length,
    completedAssessments: assessments.filter((a) => a.status === "completed").length,
    inProgressAssessments: assessments.filter((a) => a.status === "in-progress").length,
    draftAssessments: assessments.filter((a) => a.status === "draft").length,
  }

  if (loading) {
    return (
      <Card>
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
                MICA Compliance Assessment
              </CardTitle>
              <CardDescription>Manage and track Markets in Crypto-Assets (MICA) compliance assessments</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New MICA Assessment</DialogTitle>
                  <DialogDescription>
                    Set up a new MICA compliance assessment to evaluate regulatory requirements
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessment_id">Assessment ID</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="assessment_id"
                        value={newAssessment.assessment_id}
                        readOnly
                        className="bg-gray-50 font-mono flex-1"
                        placeholder={generatingId ? "Generating..." : "Auto-generated..."}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateAssessmentId}
                        disabled={generatingId}
                      >
                        {generatingId ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Assessment ID is automatically generated in format MICA-AS-YYYY-XX
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment_name">Assessment Name *</Label>
                    <Input
                      id="assessment_name"
                      value={newAssessment.assessment_name}
                      onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessment_name: e.target.value }))}
                      placeholder="Q1 2024 MICA Compliance Assessment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAssessment.description}
                      onChange={(e) => setNewAssessment((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Comprehensive assessment of MICA regulatory requirements..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessment_type">Assessment Type</Label>
                      <Select
                        value={newAssessment.assessment_type}
                        onValueChange={(value) => setNewAssessment((prev) => ({ ...prev, assessment_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self_assessment">Self Assessment</SelectItem>
                          <SelectItem value="internal_audit">Internal Audit</SelectItem>
                          <SelectItem value="external_audit">External Audit</SelectItem>
                          <SelectItem value="regulatory_review">Regulatory Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newAssessment.status}
                        onValueChange={(value) => setNewAssessment((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="under-review">Under Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope</Label>
                    <Textarea
                      id="scope"
                      value={newAssessment.scope}
                      onChange={(e) => setNewAssessment((prev) => ({ ...prev, scope: e.target.value }))}
                      placeholder="All MICA requirements across trading, custody, and operational areas..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessor_name">Assessor Name</Label>
                      <Input
                        id="assessor_name"
                        value={newAssessment.assessor_name}
                        onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessor_name: e.target.value }))}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assessor_email">Assessor Email</Label>
                      <Input
                        id="assessor_email"
                        type="email"
                        value={newAssessment.assessor_email}
                        onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessor_email: e.target.value }))}
                        placeholder="jane.doe@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newAssessment.start_date}
                        onChange={(e) => setNewAssessment((prev) => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target_completion_date">Target Completion Date</Label>
                      <Input
                        id="target_completion_date"
                        type="date"
                        value={newAssessment.target_completion_date}
                        onChange={(e) =>
                          setNewAssessment((prev) => ({ ...prev, target_completion_date: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAssessment}
                    disabled={!newAssessment.assessment_name.trim() || !newAssessment.assessment_id.trim() || creating}
                  >
                    {creating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Assessment"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Total Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalAssessments}</div>
            <p className="text-xs text-muted-foreground">Active assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedAssessments}</div>
            <Progress
              value={(stats.completedAssessments / Math.max(stats.totalAssessments, 1)) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgressAssessments}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              Draft
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draftAssessments}</div>
            <p className="text-xs text-muted-foreground">Pending start</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Requirements
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Assessment Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { status: "completed", count: stats.completedAssessments, color: "bg-green-500" },
                    { status: "in-progress", count: stats.inProgressAssessments, color: "bg-blue-500" },
                    { status: "draft", count: stats.draftAssessments, color: "bg-gray-500" },
                  ].map(({ status, count, color }) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="capitalize">{status.replace("-", " ")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(count / Math.max(stats.totalAssessments, 1)) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

              <Card>
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Recent Assessment Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessments.slice(0, 5).map((assessment) => (
                    <div key={assessment.id} className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{assessment.assessment_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.assessment_id} • {new Date(assessment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                  ))}
                  {assessments.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No assessments yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MICA Assessments
              </CardTitle>
              <CardDescription>Manage your MICA compliance assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assessor</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-mono text-sm">{assessment.assessment_id}</TableCell>
                        <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{assessment.assessment_type?.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                        <TableCell>{assessment.assessor_name || "Not assigned"}</TableCell>
                        <TableCell>{new Date(assessment.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => setSelectedAssessment(assessment)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingAssessment(assessment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteAssessment(assessment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No assessments found</p>
                  <p className="text-sm text-muted-foreground">Create your first MICA assessment to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MICA Requirements
              </CardTitle>
              <CardDescription>Overview of MICA regulatory requirements</CardDescription>
            </CardHeader>
            <CardContent>
              {requirements.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requirement ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requirements.slice(0, 10).map((requirement) => (
                      <TableRow key={requirement.id}>
                        <TableCell className="font-mono text-sm">{requirement.requirement_id}</TableCell>
                        <TableCell className="font-medium">{requirement.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{requirement.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              requirement.risk_level === "critical"
                                ? "bg-red-100 text-red-800"
                                : requirement.risk_level === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : requirement.risk_level === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                            }
                          >
                            {requirement.risk_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              requirement.compliance_status === "compliant"
                                ? "bg-green-100 text-green-800"
                                : requirement.compliance_status === "non_compliant"
                                  ? "bg-red-100 text-red-800"
                                  : requirement.compliance_status === "partially_compliant"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {requirement.compliance_status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No requirements found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Assessment Analytics
              </CardTitle>
              <CardDescription>Detailed analytics and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Assessment Dialog */}
      {editingAssessment && (
        <Dialog open={!!editingAssessment} onOpenChange={() => setEditingAssessment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Assessment</DialogTitle>
              <DialogDescription>Update the assessment details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_assessment_id">Assessment ID</Label>
                <Input
                  id="edit_assessment_id"
                  value={editingAssessment.assessment_id}
                  readOnly
                  className="bg-gray-50 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_assessment_name">Assessment Name</Label>
                <Input
                  id="edit_assessment_name"
                  value={editingAssessment.assessment_name}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, assessment_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={editingAssessment.description}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_assessment_type">Assessment Type</Label>
                  <Select
                    value={editingAssessment.assessment_type}
                    onValueChange={(value) => setEditingAssessment({ ...editingAssessment, assessment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_assessment">Self Assessment</SelectItem>
                      <SelectItem value="internal_audit">Internal Audit</SelectItem>
                      <SelectItem value="external_audit">External Audit</SelectItem>
                      <SelectItem value="regulatory_review">Regulatory Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status</Label>
                  <Select
                    value={editingAssessment.status}
                    onValueChange={(value) => setEditingAssessment({ ...editingAssessment, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingAssessment(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAssessment}>Update Assessment</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
