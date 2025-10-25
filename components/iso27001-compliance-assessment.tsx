"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Plus, Eye, Edit, Trash2, CalendarIcon, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ActionButtons } from "./ui/action-buttons"

interface ISO27001Assessment {
  id: number
  assessment_id: string
  assessment_name: string
  assessment_type: string
  scope: string
  certification_body: string
  lead_auditor: string
  assessment_date: string
  completion_date: string | null
  status: string
  overall_score: number
  maturity_level: string
  findings_count: number
  critical_findings: number
  major_findings: number
  minor_findings: number
  observations: number
  certification_status: string
  certificate_expiry: string | null
  next_surveillance: string | null
  created_at: string
  updated_at: string
}

export function ISO27001ComplianceAssessment() {
  const [assessments, setAssessments] = useState<ISO27001Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<ISO27001Assessment | null>(null)
  const [formData, setFormData] = useState({
    assessment_name: "",
    assessment_type: "",
    scope: "",
    certification_body: "",
    lead_auditor: "",
    assessment_date: new Date(),
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    setLoading(true)
    try {
      // Mock data for ISO 27001 assessments
      const mockAssessments: ISO27001Assessment[] = [
        {
          id: 1,
          assessment_id: "ISO-ASS-001",
          assessment_name: "Initial ISO 27001 Certification Assessment",
          assessment_type: "Initial Certification",
          scope: "Information Security Management System for entire organization",
          certification_body: "BSI Group",
          lead_auditor: "John Smith, CISSP",
          assessment_date: "2024-01-15",
          completion_date: "2024-01-18",
          status: "Completed",
          overall_score: 84,
          maturity_level: "Intermediate",
          findings_count: 12,
          critical_findings: 0,
          major_findings: 3,
          minor_findings: 6,
          observations: 3,
          certification_status: "Certified",
          certificate_expiry: "2027-01-15",
          next_surveillance: "2024-07-15",
          created_at: "2024-01-10T10:00:00Z",
          updated_at: "2024-01-18T16:30:00Z",
        },
        {
          id: 2,
          assessment_id: "ISO-ASS-002",
          assessment_name: "First Surveillance Audit",
          assessment_type: "Surveillance",
          scope: "ISMS effectiveness and continuous improvement",
          certification_body: "BSI Group",
          lead_auditor: "Sarah Johnson, CISA",
          assessment_date: "2024-07-15",
          completion_date: "2024-07-16",
          status: "Completed",
          overall_score: 88,
          maturity_level: "Intermediate",
          findings_count: 8,
          critical_findings: 0,
          major_findings: 1,
          minor_findings: 4,
          observations: 3,
          certification_status: "Maintained",
          certificate_expiry: "2027-01-15",
          next_surveillance: "2025-01-15",
          created_at: "2024-07-10T09:00:00Z",
          updated_at: "2024-07-16T15:45:00Z",
        },
        {
          id: 3,
          assessment_id: "ISO-ASS-003",
          assessment_name: "Internal Audit Q4 2024",
          assessment_type: "Internal Audit",
          scope: "Risk management and incident response processes",
          certification_body: "Internal Team",
          lead_auditor: "Michael Brown, CISM",
          assessment_date: "2024-12-01",
          completion_date: null,
          status: "In Progress",
          overall_score: 0,
          maturity_level: "TBD",
          findings_count: 0,
          critical_findings: 0,
          major_findings: 0,
          minor_findings: 0,
          observations: 0,
          certification_status: "N/A",
          certificate_expiry: null,
          next_surveillance: null,
          created_at: "2024-11-25T14:00:00Z",
          updated_at: "2024-12-01T10:00:00Z",
        },
      ]
      setAssessments(mockAssessments)
    } catch (error) {
      console.error("Failed to fetch ISO 27001 assessments:", error)
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssessment = async () => {
    try {
      const newAssessment: ISO27001Assessment = {
        id: assessments.length + 1,
        assessment_id: `ISO-ASS-${String(assessments.length + 1).padStart(3, "0")}`,
        assessment_name: formData.assessment_name,
        assessment_type: formData.assessment_type,
        scope: formData.scope,
        certification_body: formData.certification_body,
        lead_auditor: formData.lead_auditor,
        assessment_date: formData.assessment_date.toISOString().split("T")[0],
        completion_date: null,
        status: "Planned",
        overall_score: 0,
        maturity_level: "TBD",
        findings_count: 0,
        critical_findings: 0,
        major_findings: 0,
        minor_findings: 0,
        observations: 0,
        certification_status: "Pending",
        certificate_expiry: null,
        next_surveillance: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setAssessments([...assessments, newAssessment])
      setIsCreateDialogOpen(false)
      setFormData({
        assessment_name: "",
        assessment_type: "",
        scope: "",
        certification_body: "",
        lead_auditor: "",
        assessment_date: new Date(),
      })

      toast({
        title: "Success",
        description: "Assessment created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Planned":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Cancelled":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case "Certified":
        return "bg-gradient-to-r from-green-600 to-teal-600 text-white"
      case "Maintained":
        return "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
      case "Suspended":
        return "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
      case "Withdrawn":
        return "bg-gradient-to-r from-red-600 to-red-800 text-white"
      case "Pending":
        return "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getMaturityColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "text-green-600"
      case "Intermediate":
        return "text-blue-600"
      case "Basic":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getAssessmentStats = () => {
    const total = assessments.length
    const completed = assessments.filter((a) => a.status === "Completed").length
    const inProgress = assessments.filter((a) => a.status === "In Progress").length
    const planned = assessments.filter((a) => a.status === "Planned").length
    const avgScore =
      assessments.length > 0
        ? Math.round(assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length)
        : 0

    return { total, completed, inProgress, planned, avgScore }
  }

  const stats = getAssessmentStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            ISO 27001 Compliance Assessment
          </h2>
          <p className="text-muted-foreground">Manage ISO 27001 certification and surveillance assessments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="New Assessment" />
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New ISO 27001 Assessment</DialogTitle>
              <DialogDescription>Set up a new ISO 27001 compliance assessment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_name">Assessment Name</Label>
                  <Input
                    id="assessment_name"
                    value={formData.assessment_name}
                    onChange={(e) => setFormData({ ...formData, assessment_name: e.target.value })}
                    placeholder="Enter assessment name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment_type">Assessment Type</Label>
                  <Select
                    value={formData.assessment_type}
                    onValueChange={(value) => setFormData({ ...formData, assessment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Initial Certification">Initial Certification</SelectItem>
                      <SelectItem value="Surveillance">Surveillance</SelectItem>
                      <SelectItem value="Recertification">Recertification</SelectItem>
                      <SelectItem value="Internal Audit">Internal Audit</SelectItem>
                      <SelectItem value="Management Review">Management Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope">Assessment Scope</Label>
                <Textarea
                  id="scope"
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  placeholder="Define the scope of the assessment"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certification_body">Certification Body</Label>
                  <Select
                    value={formData.certification_body}
                    onValueChange={(value) => setFormData({ ...formData, certification_body: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select certification body" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BSI Group">BSI Group</SelectItem>
                      <SelectItem value="SGS">SGS</SelectItem>
                      <SelectItem value="Bureau Veritas">Bureau Veritas</SelectItem>
                      <SelectItem value="TUV SUD">TUV SUD</SelectItem>
                      <SelectItem value="DNV GL">DNV GL</SelectItem>
                      <SelectItem value="Internal Team">Internal Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead_auditor">Lead Auditor</Label>
                  <Input
                    id="lead_auditor"
                    value={formData.lead_auditor}
                    onChange={(e) => setFormData({ ...formData, lead_auditor: e.target.value })}
                    placeholder="Enter lead auditor name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assessment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.assessment_date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.assessment_date}
                      onSelect={(date) => date && setFormData({ ...formData, assessment_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssessment}>Create Assessment</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-700">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Planned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.planned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Avg Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.avgScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments Table */}
      <Card className="gradient-card-primary">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assessment History
          </CardTitle>
          <CardDescription>Track all ISO 27001 assessments and their outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading assessments...</span>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-blue-200/50">
              <Table>
                <TableHeader>
                  <TableRow className="text-md-white">
                    <TableHead>Assessment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Certification Body</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Findings</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No assessments found. Create your first assessment to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assessments.map((assessment) => (
                      <TableRow
                        key={assessment.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{assessment.assessment_id}</div>
                            <div className="text-sm text-muted-foreground">{assessment.assessment_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{assessment.assessment_type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{assessment.certification_body}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(assessment.assessment_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${getMaturityColor(assessment.maturity_level)}`}>
                              {assessment.overall_score}%
                            </span>
                            <span className="text-xs text-muted-foreground">({assessment.maturity_level})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center space-x-1">
                              <span className="text-red-600">{assessment.critical_findings}</span>
                              <span className="text-orange-600">{assessment.major_findings}</span>
                              <span className="text-yellow-600">{assessment.minor_findings}</span>
                              <span className="text-blue-600">{assessment.observations}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">C/M/m/O</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCertificationStatusColor(assessment.certification_status)}>
                            {assessment.certification_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <ActionButtons isTableAction={true}
                              onView={() => {
                                setSelectedAssessment(assessment)
                                setIsViewDialogOpen(true)
                              }}
                              onEdit={() => { }}
                              onDelete={() => { }}
                                actionObj={assessment}
                            //deleteDialogTitle={}                                
                            />
                            {/* <Button
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
                            </Button> */}
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

      {/* View Assessment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
            <DialogDescription>
              {selectedAssessment?.assessment_id} - {selectedAssessment?.assessment_name}
            </DialogDescription>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Assessment Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Type:</strong> {selectedAssessment.assessment_type}
                      </div>
                      <div>
                        <strong>Certification Body:</strong> {selectedAssessment.certification_body}
                      </div>
                      <div>
                        <strong>Lead Auditor:</strong> {selectedAssessment.lead_auditor}
                      </div>
                      <div>
                        <strong>Assessment Date:</strong>{" "}
                        {new Date(selectedAssessment.assessment_date).toLocaleDateString()}
                      </div>
                      {selectedAssessment.completion_date && (
                        <div>
                          <strong>Completion Date:</strong>{" "}
                          {new Date(selectedAssessment.completion_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Scope</h3>
                    <p className="text-sm text-muted-foreground">{selectedAssessment.scope}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Results</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Overall Score:</strong> {selectedAssessment.overall_score}%
                      </div>
                      <div>
                        <strong>Maturity Level:</strong> {selectedAssessment.maturity_level}
                      </div>
                      <div>
                        <strong>Total Findings:</strong> {selectedAssessment.findings_count}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <strong>Critical:</strong> {selectedAssessment.critical_findings}
                        </div>
                        <div>
                          <strong>Major:</strong> {selectedAssessment.major_findings}
                        </div>
                        <div>
                          <strong>Minor:</strong> {selectedAssessment.minor_findings}
                        </div>
                        <div>
                          <strong>Observations:</strong> {selectedAssessment.observations}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Certification Status</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Status:</strong> {selectedAssessment.certification_status}
                      </div>
                      {selectedAssessment.certificate_expiry && (
                        <div>
                          <strong>Certificate Expiry:</strong>{" "}
                          {new Date(selectedAssessment.certificate_expiry).toLocaleDateString()}
                        </div>
                      )}
                      {selectedAssessment.next_surveillance && (
                        <div>
                          <strong>Next Surveillance:</strong>{" "}
                          {new Date(selectedAssessment.next_surveillance).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
