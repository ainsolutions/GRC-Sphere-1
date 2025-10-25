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
import {
  Shield,
  Building,
  Users,
  Server,
  Eye,
  Edit,
  Trash2,
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NESAUAERemediationTracker } from "./nesa-uae-remediation-tracker"
import { NESAUAESelfAssessment } from "./nesa-uae-self-assessment"
import OwnerSelectInput from "@/components/owner-search-input"
import DepartmentSelectInput from "@/components/department-search-input"
import { ActionButtons } from "./ui/action-buttons"

interface NESAAssessment {
  id: number
  assessment_name: string
  organization_id: number
  assessment_type: string
  scope: string
  critical_infrastructure_type: string
  assessment_methodology: string
  assessment_date: string
  assessor_name: string
  assessor_organization: string
  status: string
  overall_maturity_level: string
  compliance_percentage: number
  risk_rating: string
  findings_summary: string
  recommendations: string
  next_assessment_date: string
  nesa_approval_status: string
}

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

export function NESAUAEComplianceAssessment() {
  const [assessments, setAssessments] = useState<NESAAssessment[]>([])
  const [requirements, setRequirements] = useState<NESARequirement[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<NESAAssessment | null>(null)
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false)
  const [isAssessmentDetailOpen, setIsAssessmentDetailOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const [newAssessment, setNewAssessment] = useState({
    assessment_name: "",
    organization_id: 1,
    assessment_type: "Initial",
    scope: "",
    critical_infrastructure_type: "",
    assessment_methodology: "Self-Assessment",
    assessor_name: "",
    assessor_organization: "",
  })

  useEffect(() => {
    fetchAssessments()
    fetchNESARequirements()
  }, [])

  const fetchAssessments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/nesa-uae-assessments")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error("Failed to fetch NESA UAE assessments:", error)
      toast({
        title: "Error",
        description: "Failed to load NESA UAE assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchNESARequirements = async () => {
    try {
      const response = await fetch("/api/nesa-uae/requirements")
      if (response.ok) {
        const data = await response.json()
        setRequirements(data)
      }
    } catch (error) {
      console.error("Failed to fetch NESA UAE requirements:", error)
    }
  }

  const createAssessment = async () => {
    try {
      const response = await fetch("/api/nesa-uae-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssessment),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "NESA UAE assessment created successfully",
        })
        setIsNewAssessmentOpen(false)
        setNewAssessment({
          assessment_name: "",
          organization_id: 1,
          assessment_type: "Initial",
          scope: "",
          critical_infrastructure_type: "",
          assessment_methodology: "Self-Assessment",
          assessor_name: "",
          assessor_organization: "",
        })
        fetchAssessments()
      } else {
        throw new Error("Failed to create assessment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create NESA UAE assessment",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-blue-500 text-white"
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Draft":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      case "Under Review":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Critical":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case "Basic":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Intermediate":
        return "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
      case "Advanced":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Under Review":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Rejected":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
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
    switch (status) {
      case "Implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Partially Implemented":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Not Implemented":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Not Applicable":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.critical_infrastructure_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessor_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const criticalInfrastructureTypes = [
    { value: "banking-finance", label: "Banking and Finance" },
    { value: "telecommunications", label: "Telecommunications" },
    { value: "energy-utilities", label: "Energy and Utilities" },
    { value: "transportation", label: "Transportation" },
    { value: "healthcare", label: "Healthcare" },
    { value: "government-services", label: "Government Services" },
    { value: "water-wastewater", label: "Water and Wastewater" },
    { value: "food-agriculture", label: "Food and Agriculture" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "information-technology", label: "Information Technology" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-black bg-clip-text text-transparent">
            NESA UAE Compliance Assessment
          </h2>
          <p className="text-muted-foreground">
            UAE National Electronic Security Authority cybersecurity controls for critical infrastructure
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchAssessments}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isNewAssessmentOpen} onOpenChange={setIsNewAssessmentOpen}>
            <DialogTrigger asChild>
              <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="New NESA Assessment" />
              {/* <Button>
                <Plus className="mr-2 h-4 w-4" />
                New NESA Assessment
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                  Create New NESA UAE Assessment
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="assessment_type">Assessment Type</Label>
                    <Select
                      value={newAssessment.assessment_type}
                      onValueChange={(value) => setNewAssessment((prev) => ({ ...prev, assessment_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial">Initial Assessment</SelectItem>
                        <SelectItem value="annual">Annual Review</SelectItem>
                        <SelectItem value="triggered">Triggered Assessment</SelectItem>
                        <SelectItem value="follow-up">Follow-up Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="critical_infrastructure_type">Critical Infrastructure Type *</Label>
                    <Select
                      value={newAssessment.critical_infrastructure_type}
                      onValueChange={(value) =>
                        setNewAssessment((prev) => ({ ...prev, critical_infrastructure_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select infrastructure type" />
                      </SelectTrigger>
                      <SelectContent>
                        {criticalInfrastructureTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment_methodology">Assessment Methodology</Label>
                    <Select
                      value={newAssessment.assessment_methodology}
                      onValueChange={(value) =>
                        setNewAssessment((prev) => ({ ...prev, assessment_methodology: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self-assessment">Self-Assessment</SelectItem>
                        <SelectItem value="third-party-assessment">Third-Party Assessment</SelectItem>
                        <SelectItem value="nesa-audit">NESA Audit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessor_name">Assessor Name</Label>
                    <OwnerSelectInput 
                      formData={newAssessment} 
                      setFormData={setNewAssessment} 
                      fieldName="assessor_name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessor_organization">Assessor Department</Label>
                    <DepartmentSelectInput 
                      formData={newAssessment} 
                      setFormData={setNewAssessment} 
                      fieldName="assessor_organization"
                      onDepartmentSelected={(department) => {
                        // Optionally handle additional logic when department is selected
                        console.log("Selected department:", department);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scope">Assessment Scope</Label>
                  <Textarea
                    id="scope"
                    value={newAssessment.scope}
                    onChange={(e) => setNewAssessment((prev) => ({ ...prev, scope: e.target.value }))}
                    placeholder="Describe the scope of this NESA UAE assessment"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewAssessmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={createAssessment}
                    disabled={!newAssessment.assessment_name || !newAssessment.critical_infrastructure_type}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Total Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{assessments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              NESA Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assessments.filter((a) => a.nesa_approval_status === "Approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {assessments.filter((a) => a.status === "In Progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              High Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {assessments.filter((a) => a.risk_rating === "High" || a.risk_rating === "Critical").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assessments" className="w-full">


        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                NESA UAE Assessments
              </CardTitle>
              <CardDescription>Manage and track NESA UAE cybersecurity compliance assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm border-red-200 focus:border-green-400"
                />
              </div>

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
                        <TableHead>Infrastructure Type</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Maturity Level</TableHead>
                        <TableHead>Compliance %</TableHead>
                        <TableHead>Risk Rating</TableHead>
                        <TableHead>NESA Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssessments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No NESA UAE assessments found. Create your first assessment to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAssessments.map((assessment) => (
                          <TableRow
                            key={assessment.id}
                            className="hover:bg-gradient-to-r hover:from-red-50/30 hover:via-green-50/30 hover:to-gray-50/30"
                          >
                            <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
                            <TableCell>{assessment.critical_infrastructure_type}</TableCell>
                            <TableCell>{assessment.assessment_type}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getMaturityColor(assessment.overall_maturity_level)}>
                                {assessment.overall_maturity_level || "Not Assessed"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={assessment.compliance_percentage || 0} className="w-16 h-2" />
                                <span className="text-sm">{assessment.compliance_percentage || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRiskColor(assessment.risk_rating)}>
                                {assessment.risk_rating || "Not Assessed"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getApprovalStatusColor(assessment.nesa_approval_status)}>
                                {assessment.nesa_approval_status || "Not Submitted"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <ActionButtons isTableAction={true}
                                  onView={() => {
                                    setSelectedAssessment(assessment)
                                    setIsAssessmentDetailOpen(true)
                                  }}
                                  onEdit={() => { }}
                                  onDelete={() => { }}
                                actionObj={assessment}
                                //deleteDialogTitle={}                                
                                />
                                {/* <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-100"
                                  onClick={() => {
                                    setSelectedAssessment(assessment)
                                    setIsAssessmentDetailOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="hover:bg-green-100">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="hover:bg-red-100">
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
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                NESA UAE Cybersecurity Controls
              </CardTitle>
              <CardDescription>
                Comprehensive cybersecurity controls framework for critical infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Cybersecurity Governance",
                  "Asset Management",
                  "Human Resources Security",
                  "Physical and Environmental Security",
                  "Communications and Operations Management",
                  "Access Control",
                  "Systems Development and Maintenance",
                  "Incident Management",
                  "Business Continuity Management",
                  "Compliance",
                ].map((domain) => (
                  <Card key={domain}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {getDomainIcon(domain)}
                        <span>{domain}</span>
                        <Badge variant="outline" className="ml-auto">
                          {requirements.filter((r) => r.domain === domain).length} controls
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {requirements
                          .filter((req) => req.domain === domain)
                          .slice(0, 3)
                          .map((requirement) => (
                            <div
                              key={requirement.id}
                              className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                            >
                              <div className="flex-shrink-0 mt-1">
                                {getImplementationStatusIcon(requirement.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {requirement.control_id}
                                  </Badge>
                                  <h4 className="font-medium text-sm">{requirement.control_name}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{requirement.description}</p>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Badge
                                  className={
                                    requirement.control_type === "Mandatory"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {requirement.control_type}
                                </Badge>
                                <Badge className={getMaturityColor(requirement.maturity_level)}>
                                  {requirement.maturity_level}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        {requirements.filter((req) => req.domain === domain).length > 3 && (
                          <div className="text-center pt-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              View all {requirements.filter((req) => req.domain === domain).length} controls
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="self-assessment" className="space-y-4">
          <NESAUAESelfAssessment />
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <NESAUAERemediationTracker assessmentId={selectedAssessment?.id} />
        </TabsContent>
      </Tabs>

      {/* Assessment Detail Dialog */}
      <Dialog open={isAssessmentDetailOpen} onOpenChange={setIsAssessmentDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              NESA UAE Assessment Details
            </DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Assessment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedAssessment.assessment_name}
                    </div>
                    <div>
                      <strong>Type:</strong> {selectedAssessment.assessment_type}
                    </div>
                    <div>
                      <strong>Infrastructure Type:</strong> {selectedAssessment.critical_infrastructure_type}
                    </div>
                    <div>
                      <strong>Methodology:</strong> {selectedAssessment.assessment_methodology}
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <Badge className={`ml-2 ${getStatusColor(selectedAssessment.status)}`}>
                        {selectedAssessment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Assessment Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Maturity Level:</strong>
                      <Badge className={`ml-2 ${getMaturityColor(selectedAssessment.overall_maturity_level)}`}>
                        {selectedAssessment.overall_maturity_level || "Not Assessed"}
                      </Badge>
                    </div>
                    <div>
                      <strong>Risk Rating:</strong>
                      <Badge className={`ml-2 ${getRiskColor(selectedAssessment.risk_rating)}`}>
                        {selectedAssessment.risk_rating || "Not Assessed"}
                      </Badge>
                    </div>
                    <div>
                      <strong>NESA Status:</strong>
                      <Badge className={`ml-2 ${getApprovalStatusColor(selectedAssessment.nesa_approval_status)}`}>
                        {selectedAssessment.nesa_approval_status || "Not Submitted"}
                      </Badge>
                    </div>
                    <div>
                      <strong>Compliance Score:</strong>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={selectedAssessment.compliance_percentage || 0} className="flex-1 h-2" />
                        <span>{selectedAssessment.compliance_percentage || 0}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Assessor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Assessor:</strong> {selectedAssessment.assessor_name || "Not assigned"}
                    </div>
                    <div>
                      <strong>Organization:</strong> {selectedAssessment.assessor_organization || "Not provided"}
                    </div>
                    <div>
                      <strong>Assessment Date:</strong>{" "}
                      {new Date(selectedAssessment.assessment_date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Next Assessment:</strong>{" "}
                      {selectedAssessment.next_assessment_date
                        ? new Date(selectedAssessment.next_assessment_date).toLocaleDateString()
                        : "Not scheduled"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Assessment Scope</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAssessment.scope || "No scope defined"}</p>
                  </CardContent>
                </Card>
              </div>

              {selectedAssessment.findings_summary && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Findings Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAssessment.findings_summary}</p>
                  </CardContent>
                </Card>
              )}

              {selectedAssessment.recommendations && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAssessment.recommendations}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
