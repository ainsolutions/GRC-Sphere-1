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
  Shield,
  Building,
  Users,
  Server,
  Eye,
  Edit,
  Plus,
  Search,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Globe,
  Lock,
  Zap,
  Save,
  Target,
  BarChart3,
  User,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ActionButtons } from "./ui/action-buttons"

interface NESARequirement {
  id: number
  domain: string
  control_id: string
  control_name: string
  description: string
  control_type: string
  maturity_level: string
  status: string
  implementation_guidance: string
}

interface SelfAssessmentControl {
  id: number
  assessment_id: number
  requirement_id: number
  control_id: string
  control_name: string
  domain: string
  current_maturity_level: string
  target_maturity_level: string
  implementation_status: string
  existing_controls: string
  target_controls: string
  action_owner: string
  action_owner_email: string
  target_completion_date: string
  evidence_provided: string
  gaps_identified: string
  remediation_actions: string
  business_justification: string
  estimated_cost: number
  estimated_effort_hours: number
  priority: string
  compliance_percentage: number
  last_reviewed_date: string
  next_review_date: string
  reviewer_name: string
  reviewer_comments: string
  approval_status: string
  approved_by: string
  approval_date: string
  created_at: string
  updated_at: string
}

interface SelfAssessment {
  id: number
  assessment_name: string
  organization_id: number
  assessment_scope: string
  assessment_period_start: string
  assessment_period_end: string
  assessor_name: string
  assessor_title: string
  assessor_email: string
  status: string
  overall_maturity_score: number
  compliance_percentage: number
  total_controls: number
  implemented_controls: number
  partially_implemented_controls: number
  not_implemented_controls: number
  not_applicable_controls: number
  high_priority_gaps: number
  medium_priority_gaps: number
  low_priority_gaps: number
  executive_summary: string
  key_findings: string
  recommendations: string
  next_assessment_date: string
  created_at: string
  updated_at: string
}

interface AssessmentAuditLog {
  id: number
  assessment_id: number
  control_id: string
  action_type: string
  field_changed: string
  old_value: string
  new_value: string
  changed_by: string
  change_reason: string
  timestamp: string
}

export function NESAUAESelfAssessment() {
  const [requirements, setRequirements] = useState<NESARequirement[]>([])
  const [selfAssessments, setSelfAssessments] = useState<SelfAssessment[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<SelfAssessment | null>(null)
  const [assessmentControls, setAssessmentControls] = useState<SelfAssessmentControl[]>([])
  const [auditLogs, setAuditLogs] = useState<AssessmentAuditLog[]>([])
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false)
  const [isControlDetailOpen, setIsControlDetailOpen] = useState(false)
  const [selectedControl, setSelectedControl] = useState<SelfAssessmentControl | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [domainFilter, setDomainFilter] = useState("")
  const [maturityFilter, setMaturityFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const { toast } = useToast()

  const [newAssessment, setNewAssessment] = useState({
    assessment_name: "",
    organization_id: 1,
    assessment_scope: "",
    assessment_period_start: "",
    assessment_period_end: "",
    assessor_name: "",
    assessor_title: "",
    assessor_email: "",
  })

  const [controlUpdate, setControlUpdate] = useState({
    current_maturity_level: "",
    target_maturity_level: "",
    implementation_status: "",
    existing_controls: "",
    target_controls: "",
    action_owner: "",
    action_owner_email: "",
    target_completion_date: "",
    evidence_provided: "",
    gaps_identified: "",
    remediation_actions: "",
    business_justification: "",
    estimated_cost: "",
    estimated_effort_hours: "",
    priority: "",
    compliance_percentage: "",
  })

  // Helper function to safely convert to number and format
  const safeToFixed = (value: any, decimals = 1): string => {
    const num = Number(value)
    return isNaN(num) ? "0" : num.toFixed(decimals)
  }

  // Helper function to safely get numeric value
  const safeNumber = (value: any): number => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  useEffect(() => {
    fetchNESARequirements()
    fetchSelfAssessments()
  }, [])

  useEffect(() => {
    if (selectedAssessment) {
      fetchAssessmentControls(selectedAssessment.id)
      fetchAuditLogs(selectedAssessment.id)
    }
  }, [selectedAssessment])

  const fetchNESARequirements = async () => {
    try {
      const response = await fetch("/api/nesa-uae/requirements")
      if (response.ok) {
        const data = await response.json()
        setRequirements(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to fetch NESA requirements:", error)
      setRequirements([])
    }
  }

  const fetchSelfAssessments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/nesa-uae-self-assessment")
      if (response.ok) {
        const data = await response.json()
        setSelfAssessments(Array.isArray(data) ? data : [])
      } else {
        setSelfAssessments([])
      }
    } catch (error) {
      console.error("Failed to fetch self assessments:", error)
      setSelfAssessments([])
      toast({
        title: "Error",
        description: "Failed to load self assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAssessmentControls = async (assessmentId: number) => {
    try {
      const response = await fetch(`/api/nesa-uae-self-assessment/controls?assessment_id=${assessmentId}`)
      if (response.ok) {
        const data = await response.json()
        setAssessmentControls(Array.isArray(data) ? data : [])
      } else {
        setAssessmentControls([])
      }
    } catch (error) {
      console.error("Failed to fetch assessment controls:", error)
      setAssessmentControls([])
    }
  }

  const fetchAuditLogs = async (assessmentId: number) => {
    try {
      const response = await fetch(`/api/nesa-uae-self-assessment/audit?assessment_id=${assessmentId}`)
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(Array.isArray(data) ? data : [])
      } else {
        setAuditLogs([])
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
      setAuditLogs([])
    }
  }

  const createSelfAssessment = async () => {
    try {
      const response = await fetch("/api/nesa-uae-self-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAssessment,
          status: "Draft",
          created_by: "Current User", // Replace with actual user
        }),
      })

      if (response.ok) {
        const createdAssessment = await response.json()
        toast({
          title: "Success",
          description: "Self assessment created successfully",
        })
        setIsNewAssessmentOpen(false)
        resetNewAssessmentForm()
        fetchSelfAssessments()

        // Initialize controls for the new assessment
        await initializeAssessmentControls(createdAssessment.id)
      } else {
        throw new Error("Failed to create assessment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create self assessment",
        variant: "destructive",
      })
    }
  }

  const initializeAssessmentControls = async (assessmentId: number) => {
    try {
      const response = await fetch("/api/nesa-uae-self-assessment/controls/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: assessmentId,
          created_by: "Current User",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to initialize controls")
      }
    } catch (error) {
      console.error("Failed to initialize assessment controls:", error)
    }
  }

  const updateAssessmentControl = async () => {
    if (!selectedControl) return

    try {
      const response = await fetch("/api/nesa-uae-self-assessment/controls", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedControl.id,
          ...controlUpdate,
          estimated_cost: Number.parseFloat(controlUpdate.estimated_cost) || 0,
          estimated_effort_hours: Number.parseInt(controlUpdate.estimated_effort_hours) || 0,
          compliance_percentage: Number.parseInt(controlUpdate.compliance_percentage) || 0,
          updated_by: "Current User",
          change_reason: "Control assessment update",
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Control assessment updated successfully",
        })
        setIsControlDetailOpen(false)
        resetControlUpdateForm()
        if (selectedAssessment) {
          fetchAssessmentControls(selectedAssessment.id)
          fetchAuditLogs(selectedAssessment.id)
        }
      } else {
        throw new Error("Failed to update control")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update control assessment",
        variant: "destructive",
      })
    }
  }

  const resetNewAssessmentForm = () => {
    setNewAssessment({
      assessment_name: "",
      organization_id: 1,
      assessment_scope: "",
      assessment_period_start: "",
      assessment_period_end: "",
      assessor_name: "",
      assessor_title: "",
      assessor_email: "",
    })
  }

  const resetControlUpdateForm = () => {
    setControlUpdate({
      current_maturity_level: "",
      target_maturity_level: "",
      implementation_status: "",
      existing_controls: "",
      target_controls: "",
      action_owner: "",
      action_owner_email: "",
      target_completion_date: "",
      evidence_provided: "",
      gaps_identified: "",
      remediation_actions: "",
      business_justification: "",
      estimated_cost: "",
      estimated_effort_hours: "",
      priority: "",
      compliance_percentage: "",
    })
  }

  const getMaturityColor = (maturity: string) => {
    switch (maturity?.toLowerCase()) {
      case "advanced":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "intermediate":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "basic":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "not implemented":
      case "not-implemented":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "implemented":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "partially implemented":
      case "partially-implemented":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "not implemented":
      case "not-implemented":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white"
      case "not applicable":
      case "not-applicable":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Cybersecurity Governance":
        return <Shield className="h-4 w-4" />
      case "Asset Management":
        return <Server className="h-4 w-4" />
      case "Human Resources Security":
        return <Users className="h-4 w-4" />
      case "Physical and Environmental Security":
        return <Building className="h-4 w-4" />
      case "Communications and Operations Management":
        return <Globe className="h-4 w-4" />
      case "Access Control":
        return <Lock className="h-4 w-4" />
      case "Systems Development and Maintenance":
        return <Zap className="h-4 w-4" />
      case "Incident Management":
        return <AlertTriangle className="h-4 w-4" />
      case "Business Continuity Management":
        return <RefreshCw className="h-4 w-4" />
      case "Compliance":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getImplementationStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partially implemented":
      case "partially-implemented":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "not implemented":
      case "not-implemented":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "not applicable":
      case "not-applicable":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredControls = Array.isArray(assessmentControls)
    ? assessmentControls.filter((control) => {
      const matchesSearch =
        control.control_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.control_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.domain?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDomain = !domainFilter || control.domain === domainFilter
      const matchesMaturity = !maturityFilter || control.current_maturity_level === maturityFilter
      const matchesStatus = !statusFilter || control.implementation_status === statusFilter

      return matchesSearch && matchesDomain && matchesMaturity && matchesStatus
    })
    : []

  const uniqueDomains = Array.from(new Set(assessmentControls.map((c) => c.domain).filter(Boolean)))
  const uniqueMaturityLevels = Array.from(
    new Set(assessmentControls.map((c) => c.current_maturity_level).filter(Boolean)),
  )
  const uniqueStatuses = Array.from(new Set(assessmentControls.map((c) => c.implementation_status).filter(Boolean)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-black bg-clip-text text-transparent">
            NESA UAE Self Assessment
          </h2>
          <p className="text-muted-foreground">
            Conduct comprehensive self-assessment against NESA UAE cybersecurity controls
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchSelfAssessments}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isNewAssessmentOpen} onOpenChange={setIsNewAssessmentOpen}>
            <DialogTrigger asChild>
              <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="new Self Assessment" />
              {/* <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Self Assessment
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                  Create New Self Assessment
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_name">Assessment Name *</Label>
                  <Input
                    id="assessment_name"
                    value={newAssessment.assessment_name}
                    onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessment_name: e.target.value }))}
                    placeholder="Enter assessment name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessment_scope">Assessment Scope</Label>
                  <Textarea
                    id="assessment_scope"
                    value={newAssessment.assessment_scope}
                    onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessment_scope: e.target.value }))}
                    placeholder="Describe the scope of this self assessment"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessment_period_start">Assessment Period Start</Label>
                    <Input
                      id="assessment_period_start"
                      type="date"
                      value={newAssessment.assessment_period_start}
                      onChange={(e) =>
                        setNewAssessment((prev) => ({ ...prev, assessment_period_start: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment_period_end">Assessment Period End</Label>
                    <Input
                      id="assessment_period_end"
                      type="date"
                      value={newAssessment.assessment_period_end}
                      onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessment_period_end: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessor_name">Assessor Name</Label>
                    <Input
                      id="assessor_name"
                      value={newAssessment.assessor_name}
                      onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessor_name: e.target.value }))}
                      placeholder="Enter assessor name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessor_title">Assessor Title</Label>
                    <Input
                      id="assessor_title"
                      value={newAssessment.assessor_title}
                      onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessor_title: e.target.value }))}
                      placeholder="Enter assessor title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessor_email">Assessor Email</Label>
                  <Input
                    id="assessor_email"
                    type="email"
                    value={newAssessment.assessor_email}
                    onChange={(e) => setNewAssessment((prev) => ({ ...prev, assessor_email: e.target.value }))}
                    placeholder="Enter assessor email"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewAssessmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={createSelfAssessment}
                    disabled={!newAssessment.assessment_name}

                  >
                    Create Assessment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      {selectedAssessment && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Total Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{safeNumber(selectedAssessment.total_controls)}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Implemented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {safeNumber(selectedAssessment.implemented_controls)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Partial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {safeNumber(selectedAssessment.partially_implemented_controls)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Not Implemented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {safeNumber(selectedAssessment.not_implemented_controls)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Compliance %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {safeToFixed(selectedAssessment.compliance_percentage)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="controls">Control Assessment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-4">
          <Card className="gradient-card-primary">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                Self Assessments
              </CardTitle>
              <CardDescription>Manage NESA UAE self-assessment projects</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-red-600" />
                  <span className="ml-2">Loading assessments...</span>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden border border-red-200/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-red-100/50 via-green-100/50 to-gray-100/50">
                        <TableHead>Assessment Name</TableHead>
                        <TableHead>Assessor</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Compliance %</TableHead>
                        <TableHead>Maturity Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selfAssessments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No self assessments found. Create your first assessment to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        selfAssessments.map((assessment) => (
                          <TableRow
                            key={assessment.id}
                            className={`hover:bg-gradient-to-r hover:from-red-50/30 hover:via-green-50/30 hover:to-gray-50/30 cursor-pointer ${selectedAssessment?.id === assessment.id ? "bg-blue-50/50" : ""
                              }`}
                            onClick={() => setSelectedAssessment(assessment)}
                          >
                            <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
                            <TableCell>{assessment.assessor_name || "Not assigned"}</TableCell>
                            <TableCell>
                              {assessment.assessment_period_start && assessment.assessment_period_end
                                ? `${new Date(assessment.assessment_period_start).toLocaleDateString()} - ${new Date(assessment.assessment_period_end).toLocaleDateString()}`
                                : "Not set"}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={safeNumber(assessment.compliance_percentage)} className="w-16 h-2" />
                                <span className="text-sm">{safeToFixed(assessment.compliance_percentage)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getMaturityColor("intermediate")}>
                                {safeToFixed(assessment.overall_maturity_score)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <div className="flex space-x-2">
                                  <ActionButtons isTableAction={true}
                                    onView={() => { }}
                                    onEdit={() => { }}
                                actionObj={assessment}
                                  //onDelete={() =>{} }   
                                  //deleteDialogTitle={}                                
                                  />
                                  {/* <Button variant="outline" size="sm" className="hover:bg-red-100">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="hover:bg-green-100">
                                  <Edit className="h-4 w-4" />
                                </Button> */}
                                  <Button variant="outline" size="sm" className="hover:bg-blue-100">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
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

        <TabsContent value="controls" className="space-y-4">
          {selectedAssessment ? (
            <Card className="gradient-card-primary">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                  Control Assessment - {selectedAssessment.assessment_name}
                </CardTitle>
                <CardDescription>Assess individual NESA UAE controls for maturity and implementation</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search controls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm border-red-200 focus:border-green-400"
                    />
                  </div>
                  <Select value={domainFilter} onValueChange={setDomainFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Domains</SelectItem>
                      {uniqueDomains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={maturityFilter} onValueChange={setMaturityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Maturity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Maturity</SelectItem>
                      {uniqueMaturityLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg overflow-hidden border border-red-200/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-red-100/50 via-green-100/50 to-gray-100/50">
                        <TableHead>Control ID</TableHead>
                        <TableHead>Control Name</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Current Maturity</TableHead>
                        <TableHead>Target Maturity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action Owner</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredControls.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            {selectedAssessment
                              ? "No controls found for this assessment."
                              : "Select an assessment to view controls."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredControls.map((control) => (
                          <TableRow
                            key={control.id}
                            className="hover:bg-gradient-to-r hover:from-red-50/30 hover:via-green-50/30 hover:to-gray-50/30"
                          >
                            <TableCell className="font-medium">{control.control_id}</TableCell>
                            <TableCell className="max-w-xs truncate">{control.control_name}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {getDomainIcon(control.domain)}
                                <span className="text-sm">{control.domain}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getMaturityColor(control.current_maturity_level)}>
                                {control.current_maturity_level || "Not Assessed"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getMaturityColor(control.target_maturity_level)}>
                                {control.target_maturity_level || "Not Set"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {getImplementationStatusIcon(control.implementation_status)}
                                <Badge className={getStatusColor(control.implementation_status)}>
                                  {control.implementation_status || "Not Assessed"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{control.action_owner || "Unassigned"}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={safeNumber(control.compliance_percentage)} className="w-16 h-2" />
                                <span className="text-sm">{safeNumber(control.compliance_percentage)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <div className="flex space-x-2">
                                  <ActionButtons isTableAction={true}
                                    //onView={() => {}} 
                                    onEdit={() => {
                                      setSelectedControl(control)
                                      setControlUpdate({
                                        current_maturity_level: control.current_maturity_level || "",
                                        target_maturity_level: control.target_maturity_level || "",
                                        implementation_status: control.implementation_status || "",
                                        existing_controls: control.existing_controls || "",
                                        target_controls: control.target_controls || "",
                                        action_owner: control.action_owner || "",
                                        action_owner_email: control.action_owner_email || "",
                                        target_completion_date: control.target_completion_date || "",
                                        evidence_provided: control.evidence_provided || "",
                                        gaps_identified: control.gaps_identified || "",
                                        remediation_actions: control.remediation_actions || "",
                                        business_justification: control.business_justification || "",
                                        estimated_cost: safeNumber(control.estimated_cost).toString(),
                                        estimated_effort_hours: safeNumber(control.estimated_effort_hours).toString(),
                                        priority: control.priority || "",
                                        compliance_percentage: safeNumber(control.compliance_percentage).toString(),
                                      })
                                      setIsControlDetailOpen(true)
                                    }}
                                actionObj={control}
                                  //onDelete={() => {}}   
                                  //deleteDialogTitle={}                                
                                  />
                                  </div>
                                  {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-red-100"
                                  onClick={() => {
                                    setSelectedControl(control)
                                    setControlUpdate({
                                      current_maturity_level: control.current_maturity_level || "",
                                      target_maturity_level: control.target_maturity_level || "",
                                      implementation_status: control.implementation_status || "",
                                      existing_controls: control.existing_controls || "",
                                      target_controls: control.target_controls || "",
                                      action_owner: control.action_owner || "",
                                      action_owner_email: control.action_owner_email || "",
                                      target_completion_date: control.target_completion_date || "",
                                      evidence_provided: control.evidence_provided || "",
                                      gaps_identified: control.gaps_identified || "",
                                      remediation_actions: control.remediation_actions || "",
                                      business_justification: control.business_justification || "",
                                      estimated_cost: safeNumber(control.estimated_cost).toString(),
                                      estimated_effort_hours: safeNumber(control.estimated_effort_hours).toString(),
                                      priority: control.priority || "",
                                      compliance_percentage: safeNumber(control.compliance_percentage).toString(),
                                    })
                                    setIsControlDetailOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button> */}
                                </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="gradient-card-primary">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Assessment Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select an assessment from the Assessments tab to view and manage controls.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {selectedAssessment ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                    Maturity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Advanced", "Intermediate", "Basic", "Not Implemented"].map((level) => {
                      const count = assessmentControls.filter((c) => c.current_maturity_level === level).length
                      const percentage = assessmentControls.length > 0 ? (count / assessmentControls.length) * 100 : 0
                      return (
                        <div key={level} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getMaturityColor(level)}>{level}</Badge>
                            <span className="text-sm">{count} controls</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={percentage} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">{safeToFixed(percentage)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                    Implementation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Implemented", "Partially Implemented", "Not Implemented", "Not Applicable"].map((status) => {
                      const count = assessmentControls.filter((c) => c.implementation_status === status).length
                      const percentage = assessmentControls.length > 0 ? (count / assessmentControls.length) * 100 : 0
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(status)}>{status}</Badge>
                            <span className="text-sm">{count} controls</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={percentage} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">{safeToFixed(percentage)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                    Domain Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uniqueDomains.slice(0, 5).map((domain) => {
                      const domainControls = assessmentControls.filter((c) => c.domain === domain)
                      const implementedCount = domainControls.filter(
                        (c) => c.implementation_status === "Implemented",
                      ).length
                      const percentage =
                        domainControls.length > 0 ? (implementedCount / domainControls.length) * 100 : 0
                      return (
                        <div key={domain} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getDomainIcon(domain)}
                            <span className="text-sm font-medium truncate max-w-32">{domain}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={percentage} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {implementedCount}/{domainControls.length}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card-primary">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                    Priority Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["High", "Medium", "Low"].map((priority) => {
                      const count = assessmentControls.filter((c) => c.priority === priority).length
                      const completedCount = assessmentControls.filter(
                        (c) => c.priority === priority && c.implementation_status === "Implemented",
                      ).length
                      const percentage = count > 0 ? (completedCount / count) * 100 : 0
                      return (
                        <div key={priority} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                            <span className="text-sm">{count} actions</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={percentage} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {completedCount}/{count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="gradient-card-primary">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Assessment Selected</h3>
                  <p className="text-sm text-muted-foreground">Select an assessment to view analytics and insights.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          {selectedAssessment ? (
            <Card className="gradient-card-primary">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                  Audit Trail - {selectedAssessment.assessment_name}
                </CardTitle>
                <CardDescription>Complete audit log of all changes made to this assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {auditLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No audit logs found for this assessment.
                      </div>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                          <div className="flex-shrink-0 mt-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {log.action_type}
                              </Badge>
                              <span className="text-sm font-medium">{log.control_id}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">
                              <strong>{log.field_changed}:</strong> {log.old_value} → {log.new_value}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">by {log.changed_by}</span>
                              {log.change_reason && (
                                <span className="text-xs text-muted-foreground">• {log.change_reason}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="gradient-card-primary">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Assessment Selected</h3>
                  <p className="text-sm text-muted-foreground">Select an assessment to view its audit trail.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Control Detail Dialog */}
      <Dialog open={isControlDetailOpen} onOpenChange={setIsControlDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Control Assessment Details
            </DialogTitle>
          </DialogHeader>
          {selectedControl && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    {getDomainIcon(selectedControl.domain)}
                    <span>
                      {selectedControl.control_id} - {selectedControl.control_name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <strong>Domain:</strong> {selectedControl.domain}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_maturity_level">Current Maturity Level</Label>
                  <Select
                    value={controlUpdate.current_maturity_level}
                    onValueChange={(value) => setControlUpdate((prev) => ({ ...prev, current_maturity_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select current maturity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-implemented">Not Implemented</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_maturity_level">Target Maturity Level</Label>
                  <Select
                    value={controlUpdate.target_maturity_level}
                    onValueChange={(value) => setControlUpdate((prev) => ({ ...prev, target_maturity_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target maturity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="implementation_status">Implementation Status</Label>
                  <Select
                    value={controlUpdate.implementation_status}
                    onValueChange={(value) => setControlUpdate((prev) => ({ ...prev, implementation_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-implemented">Not Implemented</SelectItem>
                      <SelectItem value="partially-implemented">Partially Implemented</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                      <SelectItem value="not-applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={controlUpdate.priority}
                    onValueChange={(value) => setControlUpdate((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="existing_controls">Existing Controls</Label>
                <Textarea
                  id="existing_controls"
                  value={controlUpdate.existing_controls}
                  onChange={(e) => setControlUpdate((prev) => ({ ...prev, existing_controls: e.target.value }))}
                  placeholder="Describe existing controls and measures in place"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_controls">Target Controls</Label>
                <Textarea
                  id="target_controls"
                  value={controlUpdate.target_controls}
                  onChange={(e) => setControlUpdate((prev) => ({ ...prev, target_controls: e.target.value }))}
                  placeholder="Describe target controls and measures to be implemented"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="action_owner">Action Owner</Label>
                  <Input
                    id="action_owner"
                    value={controlUpdate.action_owner}
                    onChange={(e) => setControlUpdate((prev) => ({ ...prev, action_owner: e.target.value }))}
                    placeholder="Person responsible for implementation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action_owner_email">Action Owner Email</Label>
                  <Input
                    id="action_owner_email"
                    type="email"
                    value={controlUpdate.action_owner_email}
                    onChange={(e) => setControlUpdate((prev) => ({ ...prev, action_owner_email: e.target.value }))}
                    placeholder="Email of action owner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_completion_date">Target Completion Date</Label>
                  <Input
                    id="target_completion_date"
                    type="date"
                    value={controlUpdate.target_completion_date}
                    onChange={(e) => setControlUpdate((prev) => ({ ...prev, target_completion_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Estimated Cost</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={controlUpdate.estimated_cost}
                    onChange={(e) => setControlUpdate((prev) => ({ ...prev, estimated_cost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_effort_hours">Estimated Hours</Label>
                  <Input
                    id="estimated_effort_hours"
                    type="number"
                    value={controlUpdate.estimated_effort_hours}
                    onChange={(e) => setControlUpdate((prev) => ({ ...prev, estimated_effort_hours: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gaps_identified">Gaps Identified</Label>
                <Textarea
                  id="gaps_identified"
                  value={controlUpdate.gaps_identified}
                  onChange={(e) => setControlUpdate((prev) => ({ ...prev, gaps_identified: e.target.value }))}
                  placeholder="Describe identified gaps and deficiencies"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remediation_actions">Remediation Actions</Label>
                <Textarea
                  id="remediation_actions"
                  value={controlUpdate.remediation_actions}
                  onChange={(e) => setControlUpdate((prev) => ({ ...prev, remediation_actions: e.target.value }))}
                  placeholder="Describe specific actions to address gaps"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence_provided">Evidence Provided</Label>
                <Textarea
                  id="evidence_provided"
                  value={controlUpdate.evidence_provided}
                  onChange={(e) => setControlUpdate((prev) => ({ ...prev, evidence_provided: e.target.value }))}
                  placeholder="Describe evidence supporting the assessment"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_justification">Business Justification</Label>
                <Textarea
                  id="business_justification"
                  value={controlUpdate.business_justification}
                  onChange={(e) => setControlUpdate((prev) => ({ ...prev, business_justification: e.target.value }))}
                  placeholder="Business justification for implementation approach"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compliance_percentage">Compliance Percentage</Label>
                <Input
                  id="compliance_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={controlUpdate.compliance_percentage}
                  onChange={(e) => setControlUpdate((prev) => ({ ...prev, compliance_percentage: e.target.value }))}
                  placeholder="0-100"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsControlDetailOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={updateAssessmentControl}
                  className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Assessment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
