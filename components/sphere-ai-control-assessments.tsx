"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Target,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Calendar,
} from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

interface ControlAssessment {
  id: number
  controlId: string
  controlName: string
  category: string
  riskArea: string
  assessmentType: string
  status: string
  effectiveness: number
  lastAssessed: string
  nextAssessment: string
  assessor: string
  findings: string[]
  recommendations: string[]
  evidence: string[]
  complianceStatus: string
}

export function SphereAiControlAssessments() {
  const [assessments, setAssessments] = useState<ControlAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Mock data - in real implementation, fetch from API
    const mockAssessments: ControlAssessment[] = [
      {
        id: 1,
        controlId: "AC-001",
        controlName: "Access Control Management",
        category: "Access Control",
        riskArea: "Infrastructure Security",
        assessmentType: "Annual",
        status: "Completed",
        effectiveness: 85,
        lastAssessed: "2024-01-15",
        nextAssessment: "2025-01-15",
        assessor: "Security Team",
        findings: [
          "Strong password policies implemented",
          "Multi-factor authentication deployed",
          "Minor gaps in privileged access monitoring",
        ],
        recommendations: [
          "Implement privileged access management (PAM) solution",
          "Enhance monitoring of administrative activities",
          "Regular access reviews quarterly",
        ],
        evidence: ["Access control policy document", "MFA implementation screenshots", "User access audit logs"],
        complianceStatus: "Compliant",
      },
      {
        id: 2,
        controlId: "SC-002",
        controlName: "System and Communications Protection",
        category: "System Protection",
        riskArea: "Infrastructure Security",
        assessmentType: "Quarterly",
        status: "In Progress",
        effectiveness: 78,
        lastAssessed: "2023-10-15",
        nextAssessment: "2024-02-15",
        assessor: "Network Team",
        findings: [
          "Firewall rules properly configured",
          "Network segmentation partially implemented",
          "Encryption in transit needs improvement",
        ],
        recommendations: [
          "Complete network segmentation project",
          "Upgrade encryption protocols to TLS 1.3",
          "Implement network monitoring tools",
        ],
        evidence: ["Firewall configuration files", "Network topology diagrams", "Encryption assessment report"],
        complianceStatus: "Partially Compliant",
      },
      {
        id: 3,
        controlId: "AU-003",
        controlName: "Audit and Accountability",
        category: "Audit",
        riskArea: "Compliance",
        assessmentType: "Semi-Annual",
        status: "Overdue",
        effectiveness: 65,
        lastAssessed: "2023-06-15",
        nextAssessment: "2023-12-15",
        assessor: "Compliance Team",
        findings: [
          "Audit logs collected from most systems",
          "Log retention policy needs update",
          "Automated log analysis not implemented",
        ],
        recommendations: [
          "Implement SIEM solution for log analysis",
          "Update log retention policy",
          "Establish automated alerting for critical events",
        ],
        evidence: ["Audit log samples", "Log retention policy document", "System inventory for logging"],
        complianceStatus: "Non-Compliant",
      },
      {
        id: 4,
        controlId: "IA-004",
        controlName: "Identification and Authentication",
        category: "Identity Management",
        riskArea: "Data Security",
        assessmentType: "Annual",
        status: "Scheduled",
        effectiveness: 90,
        lastAssessed: "2023-03-15",
        nextAssessment: "2024-03-15",
        assessor: "Identity Team",
        findings: [
          "Strong authentication mechanisms in place",
          "Identity lifecycle management automated",
          "Regular access certifications conducted",
        ],
        recommendations: [
          "Implement risk-based authentication",
          "Enhance identity analytics capabilities",
          "Integrate with additional applications",
        ],
        evidence: [
          "Identity management system reports",
          "Authentication policy documents",
          "Access certification reports",
        ],
        complianceStatus: "Compliant",
      },
    ]

    setAssessments(mockAssessments)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800 border-green-200"
      case "Partially Compliant":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Non-Compliant":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return "text-green-600"
    if (effectiveness >= 75) return "text-yellow-600"
    if (effectiveness >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const overallEffectiveness = Math.round(
    assessments.reduce((sum, assessment) => sum + assessment.effectiveness, 0) / assessments.length,
  )

  const complianceStats = {
    compliant: assessments.filter((a) => a.complianceStatus === "Compliant").length,
    partiallyCompliant: assessments.filter((a) => a.complianceStatus === "Partially Compliant").length,
    nonCompliant: assessments.filter((a) => a.complianceStatus === "Non-Compliant").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading control assessments...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Controls</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Effectiveness</p>
                <p className={`text-2xl font-bold ${getEffectivenessColor(overallEffectiveness)}`}>
                  {overallEffectiveness}%
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">{complianceStats.compliant}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {assessments.filter((a) => a.status === "Overdue").length}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Shield className="h-6 w-6 text-blue-600" />
              Control Assessments
            </CardTitle>
            <CardDescription className="text-gray-600">
              Monitor and evaluate security control effectiveness
            </CardDescription>
          </div>
          <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="New Assessment" />
          {/* <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button> */}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="assessments"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
              >
                Assessments
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
              >
                Compliance
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                Schedule
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Effectiveness Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Control Effectiveness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessments.map((assessment) => (
                        <div key={assessment.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{assessment.controlName}</span>
                            <span
                              className={`text-sm font-semibold ${getEffectivenessColor(assessment.effectiveness)}`}
                            >
                              {assessment.effectiveness}%
                            </span>
                          </div>
                          <Progress value={assessment.effectiveness} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Compliant</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{complianceStats.compliant}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium text-yellow-900">Partially Compliant</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{complianceStats.partiallyCompliant}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-600" />
                          <span className="font-medium text-red-900">Non-Compliant</span>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{complianceStats.nonCompliant}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assessments" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Control</TableHead>
                      <TableHead className="font-semibold text-gray-900">Category</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900">Effectiveness</TableHead>
                      <TableHead className="font-semibold text-gray-900">Compliance</TableHead>
                      <TableHead className="font-semibold text-gray-900">Last Assessed</TableHead>
                      <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{assessment.controlId}</div>
                            <div className="text-sm text-gray-600">{assessment.controlName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {assessment.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getStatusColor(assessment.status)}`}>{assessment.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${getEffectivenessColor(assessment.effectiveness)}`}>
                              {assessment.effectiveness}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getComplianceColor(assessment.complianceStatus)}`}>
                            {assessment.complianceStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{formatDate(assessment.lastAssessed)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ActionButtons isTableAction={true}
                              onView={() => { }}
                              onEdit={() => { }}
                                actionObj={assessment}
                            // onDelete={() => {}}   
                            // deleteDialogTitle={}                                
                            />
                            {/* <Button variant="outline" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <Card key={assessment.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900">
                              {assessment.controlId} - {assessment.controlName}
                            </h3>
                            <p className="text-sm text-gray-600">{assessment.category}</p>
                          </div>
                          <Badge className={`${getComplianceColor(assessment.complianceStatus)}`}>
                            {assessment.complianceStatus}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Findings</h4>
                            <ul className="space-y-1">
                              {assessment.findings.map((finding, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  {finding}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Recommendations</h4>
                            <ul className="space-y-1">
                              {assessment.recommendations.map((recommendation, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  {recommendation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Evidence</h4>
                          <div className="flex flex-wrap gap-2">
                            {assessment.evidence.map((evidence, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {evidence}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Control</TableHead>
                      <TableHead className="font-semibold text-gray-900">Assessment Type</TableHead>
                      <TableHead className="font-semibold text-gray-900">Last Assessed</TableHead>
                      <TableHead className="font-semibold text-gray-900">Next Assessment</TableHead>
                      <TableHead className="font-semibold text-gray-900">Assessor</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{assessment.controlId}</div>
                            <div className="text-sm text-gray-600">{assessment.controlName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {assessment.assessmentType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{formatDate(assessment.lastAssessed)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{formatDate(assessment.nextAssessment)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{assessment.assessor}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getStatusColor(assessment.status)}`}>{assessment.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
