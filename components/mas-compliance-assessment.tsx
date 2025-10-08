"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Plus, Search, Download, Eye, Edit, Trash2, TrendingUp, BarChart3 } from "lucide-react"

interface MASAssessment {
  id: string
  assessment_id: string
  entity_name: string
  entity_type: string
  license_type: string
  assessment_type: string
  assessment_date: string
  assessor_name: string
  status: string
  overall_score: number
  findings_count: number
  high_risk_findings: number
  medium_risk_findings: number
  low_risk_findings: number
  completion_date?: string
  next_assessment_date?: string
  mas_notification_status: string
  created_at: string
  updated_at: string
}

interface MASRequirement {
  id: string
  domain: string
  requirement_id: string
  title: string
  description: string
  category: string
  criticality: string
  applicable_entities: string[]
}

export function MASComplianceAssessment() {
  const [assessments, setAssessments] = useState<MASAssessment[]>([])
  const [requirements, setRequirements] = useState<MASRequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAssessment, setSelectedAssessment] = useState<MASAssessment | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newAssessment, setNewAssessment] = useState({
    entity_name: "",
    entity_type: "",
    license_type: "",
    assessment_type: "",
    assessor_name: "",
    mas_notification_status: "pending",
  })

  const entityTypes = [
    "Bank",
    "Finance Company",
    "Merchant Bank",
    "Insurance Company",
    "Insurance Broker",
    "Financial Adviser",
    "Fund Management Company",
    "Capital Markets Services License Holder",
    "Payment Service Provider",
    "Digital Payment Token Service Provider",
    "Money Changer",
    "Remittance Business",
  ]

  const licenseTypes = [
    "Full Bank License",
    "Wholesale Bank License",
    "Qualifying Full Bank License",
    "Finance Company License",
    "Merchant Bank License",
    "Direct Life Insurance License",
    "General Insurance License",
    "Reinsurance License",
    "Capital Markets Services License",
    "Fund Management Company License",
    "Financial Adviser License",
    "Payment Services License",
    "Digital Payment Token License",
    "Money-changing License",
    "Remittance License",
  ]

  const assessmentTypes = [
    "Initial Assessment",
    "Annual Review",
    "Compliance Assessment",
    "Follow-up Assessment",
    "Thematic Review",
    "Risk-based Assessment",
  ]

  useEffect(() => {
    fetchAssessments()
    fetchRequirements()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/mas-assessments")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error("Error fetching MAS assessments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch MAS assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRequirements = async () => {
    try {
      const response = await fetch("/api/mas/requirements")
      if (response.ok) {
        const data = await response.json()
        setRequirements(data)
      }
    } catch (error) {
      console.error("Error fetching MAS requirements:", error)
    }
  }

  const handleCreateAssessment = async () => {
    try {
      const assessmentData = {
        ...newAssessment,
        assessment_id: `MAS-${Date.now()}`,
        assessment_date: new Date().toISOString().split("T")[0],
        status: "draft",
        overall_score: 0,
        findings_count: 0,
        high_risk_findings: 0,
        medium_risk_findings: 0,
        low_risk_findings: 0,
      }

      const response = await fetch("/api/mas-assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "MAS assessment created successfully",
        })
        setIsCreateDialogOpen(false)
        setNewAssessment({
          entity_name: "",
          entity_type: "",
          license_type: "",
          assessment_type: "",
          assessor_name: "",
          mas_notification_status: "pending",
        })
        fetchAssessments()
      } else {
        throw new Error("Failed to create assessment")
      }
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast({
        title: "Error",
        description: "Failed to create MAS assessment",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      in_progress: { color: "bg-blue-100 text-blue-800", label: "In Progress" },
      under_review: { color: "bg-yellow-100 text-yellow-800", label: "Under Review" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getNotificationStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
      acknowledged: { color: "bg-green-100 text-green-800", label: "Acknowledged" },
      not_required: { color: "bg-gray-100 text-gray-800", label: "Not Required" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessment_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getComplianceStats = () => {
    const total = assessments.length
    const completed = assessments.filter((a) => a.status === "completed").length
    const inProgress = assessments.filter((a) => a.status === "in_progress").length
    const avgScore =
      assessments.length > 0 ? assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length : 0

    return { total, completed, inProgress, avgScore }
  }

  const stats = getComplianceStats()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Total Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all entities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Ready for submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently being assessed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.avgScore.toFixed(1)}%</div>
            <Progress value={stats.avgScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                MAS Compliance Assessments
              </CardTitle>
              <CardDescription>Manage Singapore MAS compliance assessments for financial institutions</CardDescription>
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
                  <DialogTitle>Create New MAS Assessment</DialogTitle>
                  <DialogDescription>
                    Create a new MAS compliance assessment for a financial institution
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entity_name">Entity Name</Label>
                    <Input
                      id="entity_name"
                      value={newAssessment.entity_name}
                      onChange={(e) => setNewAssessment({ ...newAssessment, entity_name: e.target.value })}
                      placeholder="Enter entity name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entity_type">Entity Type</Label>
                    <Select
                      value={newAssessment.entity_type}
                      onValueChange={(value) => setNewAssessment({ ...newAssessment, entity_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {entityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_type">License Type</Label>
                    <Select
                      value={newAssessment.license_type}
                      onValueChange={(value) => setNewAssessment({ ...newAssessment, license_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select license type" />
                      </SelectTrigger>
                      <SelectContent>
                        {licenseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment_type">Assessment Type</Label>
                    <Select
                      value={newAssessment.assessment_type}
                      onValueChange={(value) => setNewAssessment({ ...newAssessment, assessment_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assessmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="assessor_name">Assessor Name</Label>
                    <Input
                      id="assessor_name"
                      value={newAssessment.assessor_name}
                      onChange={(e) => setNewAssessment({ ...newAssessment, assessor_name: e.target.value })}
                      placeholder="Enter assessor name"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAssessment}
                  
                  >
                    Create Assessment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assessments" className="space-y-4">
            <TabsList className="bg-black/50 backdrop-blur-sm">
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="assessments" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Assessments Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment ID</TableHead>
                      <TableHead>Entity Name</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Assessment Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>MAS Notification</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.assessment_id}</TableCell>
                        <TableCell>{assessment.entity_name}</TableCell>
                        <TableCell>{assessment.entity_type}</TableCell>
                        <TableCell>{assessment.assessment_type}</TableCell>
                        <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={assessment.overall_score} className="w-16 h-2" />
                            <span className="text-sm font-medium">{assessment.overall_score}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {assessment.high_risk_findings > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                H: {assessment.high_risk_findings}
                              </Badge>
                            )}
                            {assessment.medium_risk_findings > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                M: {assessment.medium_risk_findings}
                              </Badge>
                            )}
                            {assessment.low_risk_findings > 0 && (
                              <Badge variant="outline" className="text-xs">
                                L: {assessment.low_risk_findings}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getNotificationStatusBadge(assessment.mas_notification_status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAssessment(assessment)
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
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requirements.map((requirement) => (
                  <Card key={requirement.id} className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {requirement.requirement_id}
                        </Badge>
                        <Badge
                          className={
                            requirement.criticality === "High"
                              ? "bg-red-100 text-red-800"
                              : requirement.criticality === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {requirement.criticality}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm">{requirement.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-muted-foreground">{requirement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{requirement.domain}</span>
                        <Badge variant="outline" className="text-xs">
                          {requirement.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Assessment Status Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["draft", "in_progress", "under_review", "completed", "approved"].map((status) => {
                        const count = assessments.filter((a) => a.status === status).length
                        const percentage = assessments.length > 0 ? (count / assessments.length) * 100 : 0
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{status.replace("_", " ")}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Compliance Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">Compliance trend analytics coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Assessment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
            <DialogDescription>Detailed view of MAS compliance assessment</DialogDescription>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Assessment ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssessment.assessment_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Entity Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssessment.entity_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Entity Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssessment.entity_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">License Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssessment.license_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assessment Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssessment.assessment_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedAssessment.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Overall Score</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={selectedAssessment.overall_score} className="w-24 h-2" />
                    <span className="text-sm font-medium">{selectedAssessment.overall_score}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">MAS Notification</Label>
                  <div className="mt-1">{getNotificationStatusBadge(selectedAssessment.mas_notification_status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{selectedAssessment.high_risk_findings}</div>
                  <p className="text-sm text-muted-foreground">High Risk Findings</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{selectedAssessment.medium_risk_findings}</div>
                  <p className="text-sm text-muted-foreground">Medium Risk Findings</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedAssessment.low_risk_findings}</div>
                  <p className="text-sm text-muted-foreground">Low Risk Findings</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
