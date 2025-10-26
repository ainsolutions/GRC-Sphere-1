"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ActionButtons } from "./ui/action-buttons"

interface HIPAARequirement {
  id: string
  section: string
  title: string
  description: string
  category: string
  priority: string
}

interface HIPAAAssessment {
  id: string
  assessment_id: string
  title: string
  description: string
  status: string
  start_date: string
  end_date: string | null
  assessor: string
  organization: string
  compliance_percentage: number
  created_at: string
  updated_at: string
}

interface AssessmentResult {
  id: string
  assessment_id: string
  requirement_id: string
  compliance_status: string
  evidence: string
  findings: string
  recommendations: string
  assessed_date: string
}

export function HIPAAComplianceAssessment() {
  const [assessments, setAssessments] = useState<HIPAAAssessment[]>([])
  const [requirements, setRequirements] = useState<HIPAARequirement[]>([])
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<HIPAAAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)

  // Form state for creating/editing assessments
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assessor: "",
    organization: "",
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    fetchAssessments()
    fetchRequirements()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/hipaa-assessments")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data.data || [])   // ✅ use data.data
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch HIPAA assessments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRequirements = async () => {
    try {
      const response = await fetch("/api/hipaa/requirements")
      if (response.ok) {
        const data = await response.json()
        setRequirements(data.requirements || [])
      }
    } catch (error) {
      console.error("Error fetching requirements:", error)
    }
  }

  const fetchAssessmentResults = async (assessmentId: string) => {
    try {
      const response = await fetch(`/api/hipaa/assessments/${assessmentId}/results`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error("Error fetching assessment results:", error)
    }
  }

  const handleCreateAssessment = async () => {
    try {
      const response = await fetch("/api/hipaa-assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "HIPAA assessment created successfully",
        })
        setShowCreateDialog(false)
        setFormData({
          title: "",
          description: "",
          assessor: "",
          organization: "",
          start_date: "",
          end_date: "",
        })
        fetchAssessments()
      } else {
        throw new Error("Failed to create assessment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create HIPAA assessment",
        variant: "destructive",
      })
    }
  }

  const handleEditAssessment = async () => {
    if (!selectedAssessment) return

    try {
      const response = await fetch(`/api/hipaa-assessments/${selectedAssessment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "HIPAA assessment updated successfully",
        })
        setShowEditDialog(false)
        setSelectedAssessment(null)
        fetchAssessments()
      } else {
        throw new Error("Failed to update assessment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update HIPAA assessment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      const response = await fetch(`/api/hipaa-assessments/${assessmentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "HIPAA assessment deleted successfully",
        })
        fetchAssessments()
      } else {
        throw new Error("Failed to delete assessment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete HIPAA assessment",
        variant: "destructive",
      })
    }
  }

  const handleViewAssessment = (assessment: HIPAAAssessment) => {
    setSelectedAssessment(assessment)
    fetchAssessmentResults(assessment.id)
    setShowViewDialog(true)
  }

  const openEditDialog = (assessment: HIPAAAssessment) => {
    setSelectedAssessment(assessment)
    setFormData({
      title: assessment.title,
      description: assessment.description,
      assessor: assessment.assessor,
      organization: assessment.organization,
      start_date: assessment.start_date,
      end_date: assessment.end_date || "",
    })
    setShowEditDialog(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, icon: Clock },
      "in-progress": { variant: "default" as const, icon: AlertTriangle },
      completed: { variant: "default" as const, icon: CheckCircle },
      "under-review": { variant: "outline" as const, icon: Eye },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    )
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading HIPAA assessments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            HIPAA Compliance Assessment
          </h2>
          <p className="text-muted-foreground mt-2">Manage and track HIPAA compliance assessments and requirements</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={()=>{}} btnAddText="New Assessment"/>
            {/* <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Assessment
            </Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create HIPAA Assessment</DialogTitle>
              <DialogDescription>Create a new HIPAA compliance assessment for your organization</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Assessment Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter assessment title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Assessor</label>
                  <Input
                    value={formData.assessor}
                    onChange={(e) => setFormData({ ...formData, assessor: e.target.value })}
                    placeholder="Enter assessor name"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Organization</label>
                <Input
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter assessment description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date (Optional)</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAssessment}>Create Assessment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle>HIPAA Assessments</CardTitle>
          <CardDescription>Overview of all HIPAA compliance assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Assessor</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{assessment.title}</p>
                      <p className="text-sm text-muted-foreground">{assessment.assessment_id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{assessment.assessor}</TableCell>
                  <TableCell>{assessment.organization}</TableCell>
                  <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={assessment.compliance_percentage} className="w-16" />
                      <span className={`text-sm font-medium ${getComplianceColor(assessment.compliance_percentage)}`}>
                        {assessment.compliance_percentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(assessment.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ActionButtons isTableAction={true} 
                                  onView={() => handleViewAssessment(assessment)} 
                                  onEdit={() => openEditDialog(assessment)} 
                                  onDelete={() => handleDeleteAssessment(assessment.id)}   
                                  deleteDialogTitle={assessment.title}      
                                actionObj={assessment}                          
                                  />
                      {/* <Button variant="outline" size="sm" onClick={() => handleViewAssessment(assessment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(assessment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this HIPAA assessment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAssessment(assessment.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit HIPAA Assessment</DialogTitle>
            <DialogDescription>Update the HIPAA compliance assessment details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Assessment Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter assessment title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Assessor</label>
                <Input
                  value={formData.assessor}
                  onChange={(e) => setFormData({ ...formData, assessor: e.target.value })}
                  placeholder="Enter assessor name"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Organization</label>
              <Input
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter assessment description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date (Optional)</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAssessment}>Update Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedAssessment?.title}
            </DialogTitle>
            <DialogDescription>Assessment ID: {selectedAssessment?.assessment_id}</DialogDescription>
          </DialogHeader>
          {selectedAssessment && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assessment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Assessor:</span> {selectedAssessment.assessor}
                      </div>
                      <div>
                        <span className="font-medium">Organization:</span> {selectedAssessment.organization}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {getStatusBadge(selectedAssessment.status)}
                      </div>
                      <div>
                        <span className="font-medium">Start Date:</span>{" "}
                        {new Date(selectedAssessment.start_date).toLocaleDateString()}
                      </div>
                      {selectedAssessment.end_date && (
                        <div>
                          <span className="font-medium">End Date:</span>{" "}
                          {new Date(selectedAssessment.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div
                          className={`text-4xl font-bold ${getComplianceColor(selectedAssessment.compliance_percentage)}`}
                        >
                          {selectedAssessment.compliance_percentage}%
                        </div>
                        <Progress value={selectedAssessment.compliance_percentage} className="mt-2" />
                        <p className="text-sm text-muted-foreground mt-2">Overall Compliance</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedAssessment.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="requirements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>HIPAA Requirements</CardTitle>
                    <CardDescription>Complete list of HIPAA compliance requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Section</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requirements.map((requirement) => (
                          <TableRow key={requirement.id}>
                            <TableCell className="font-mono text-sm">{requirement.section}</TableCell>
                            <TableCell>{requirement.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{requirement.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  requirement.priority === "High"
                                    ? "destructive"
                                    : requirement.priority === "Medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {requirement.priority}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Results</CardTitle>
                    <CardDescription>Detailed compliance results for each requirement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Requirement</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Evidence</TableHead>
                          <TableHead>Findings</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell>{result.requirement_id}</TableCell>
                            <TableCell>
                              <Badge variant={result.compliance_status === "Compliant" ? "default" : "destructive"}>
                                {result.compliance_status === "Compliant" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {result.compliance_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{result.evidence}</TableCell>
                            <TableCell className="max-w-xs truncate">{result.findings}</TableCell>
                            <TableCell>{new Date(result.assessed_date).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HIPAAComplianceAssessment
