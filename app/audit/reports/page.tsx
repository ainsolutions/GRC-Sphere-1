"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, Plus, Eye, Edit, Trash2, AlertTriangle, CheckCircle, Clock, FileDown, FileUp, Printer, Share } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuditReport {
  id: number
  report_id: string
  engagement_id: string
  report_title: string
  report_type: string
  report_status: string
  report_period_start: string
  report_period_end: string
  report_date: string
  executive_summary: string
  scope_and_objectives: string
  methodology: string
  key_findings: string[]
  recommendations: string[]
  management_response: string
  overall_conclusion: string
  risk_assessment: string
  compliance_status: string
  next_steps: string
  distribution_list: string[]
  confidentiality_level: string
  version: string
  previous_version_id: string
  approval_status: string
  approved_by: string
  approval_date: string
  issued_by: string
  issued_date: string
  engagement_name: string
  engagement_type: string
  created_at: string
  updated_at: string
}

interface AuditFinding {
  id: number
  finding_id: string
  report_id: string
  finding_title: string
  finding_description: string
  finding_category: string
  risk_level: string
  impact_assessment: string
  root_cause: string
  affected_controls: string[]
  affected_processes: string[]
  affected_systems: string[]
  regulatory_implications: string[]
  business_impact: string
  recommendation: string
  management_response: string
  remediation_plan: string
  remediation_timeline: string
  responsible_party: string
  status: string
  priority: string
  evidence_references: string[]
  follow_up_required: boolean
  follow_up_date: string
  closure_criteria: string
  closure_evidence: string
  closed_by: string
  closed_date: string
  created_at: string
  updated_at: string
}

const mockReports: AuditReport[] = [
  {
    id: 1,
    report_id: "AR-2024-001",
    engagement_id: "AE-2024-001",
    report_title: "Customer Database System Audit Report",
    report_type: "final_report",
    report_status: "issued",
    report_period_start: "2024-01-15",
    report_period_end: "2024-03-15",
    report_date: "2024-03-20",
    executive_summary: "The audit of the Customer Database System identified several control deficiencies that require management attention. While the overall control environment is adequate, there are opportunities for improvement in access management and data protection controls.",
    scope_and_objectives: "The audit scope included user access management, data backup procedures, change management processes, and security controls for the Customer Database System.",
    methodology: "Risk-based audit approach using a combination of inquiry, observation, inspection, and reperformance testing procedures.",
    key_findings: ["Excessive user privileges", "Inadequate access reviews", "Missing backup verification"],
    recommendations: ["Implement quarterly access reviews", "Automate access provisioning", "Enhance backup testing"],
    management_response: "Management acknowledges the findings and has committed to implementing the recommended improvements within the specified timelines.",
    overall_conclusion: "The Customer Database System has adequate controls in place, but improvements are needed to strengthen the control environment and reduce risk exposure.",
    risk_assessment: "Medium risk due to control deficiencies identified during testing.",
    compliance_status: "Partially compliant with regulatory requirements.",
    next_steps: "Follow-up audit scheduled for Q3 2024 to assess implementation of recommendations.",
    distribution_list: ["CEO", "CFO", "IT Director", "Audit Committee"],
    confidentiality_level: "internal",
    version: "1.0",
    previous_version_id: "",
    approval_status: "approved",
    approved_by: "John Smith",
    approval_date: "2024-03-18",
    issued_by: "Sarah Johnson",
    issued_date: "2024-03-20",
    engagement_name: "Customer Database System Audit",
    engagement_type: "it",
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z"
  },
  {
    id: 2,
    report_id: "AR-2024-002",
    engagement_id: "AE-2024-002",
    report_title: "Financial Reporting Process Audit Report",
    report_type: "final_report",
    report_status: "draft",
    report_period_start: "2024-02-01",
    report_period_end: "2024-04-01",
    report_date: "2024-04-05",
    executive_summary: "The financial reporting process audit is currently in progress. Preliminary findings indicate strong controls in place with minor areas for improvement.",
    scope_and_objectives: "Audit of monthly financial statement preparation and review process including controls over journal entries, reconciliations, and management review.",
    methodology: "Compliance-focused audit approach with emphasis on SOX requirements and financial reporting accuracy.",
    key_findings: ["Strong reconciliation controls", "Adequate management review process"],
    recommendations: ["Enhance documentation", "Improve review timelines"],
    management_response: "",
    overall_conclusion: "",
    risk_assessment: "Low to medium risk based on preliminary assessment.",
    compliance_status: "Compliant with SOX requirements.",
    next_steps: "Complete fieldwork and finalize report.",
    distribution_list: ["CFO", "Controller", "External Auditors"],
    confidentiality_level: "confidential",
    version: "1.0",
    previous_version_id: "",
    approval_status: "pending",
    approved_by: "",
    approval_date: "",
    issued_by: "",
    issued_date: "",
    engagement_name: "Financial Reporting Process Audit",
    engagement_type: "financial",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z"
  }
]

const mockFindings: AuditFinding[] = [
  {
    id: 1,
    finding_id: "AF-2024-001",
    report_id: "AR-2024-001",
    finding_title: "Excessive User Privileges",
    finding_description: "Three users were found to have administrative privileges that exceed their job requirements, creating unnecessary risk exposure.",
    finding_category: "control_deficiency",
    risk_level: "high",
    impact_assessment: "High risk of unauthorized access to sensitive customer data",
    root_cause: "Inadequate access review process and lack of role-based access controls",
    affected_controls: ["CTRL-001", "CTRL-002"],
    affected_processes: ["User Access Management", "Privileged Access Review"],
    affected_systems: ["Customer Database", "Admin Portal"],
    regulatory_implications: ["GDPR", "SOX"],
    business_impact: "Potential data breach and regulatory non-compliance",
    recommendation: "Implement quarterly access reviews and role-based access controls",
    management_response: "Will implement quarterly access reviews starting Q2 2024",
    remediation_plan: "Review and revoke excessive privileges, implement automated access provisioning",
    remediation_timeline: "2024-06-30",
    responsible_party: "IT Security Manager",
    status: "open",
    priority: "high",
    evidence_references: ["EV-2024-001", "EV-2024-002"],
    follow_up_required: true,
    follow_up_date: "2024-07-31",
    closure_criteria: "All excessive privileges revoked and quarterly review process implemented",
    closure_evidence: "",
    closed_by: "",
    closed_date: "",
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z"
  },
  {
    id: 2,
    finding_id: "AF-2024-002",
    report_id: "AR-2024-001",
    finding_title: "Inadequate Access Reviews",
    finding_description: "Access reviews are not performed on a regular basis, and there is no formal process for identifying and revoking unnecessary access.",
    finding_category: "process_weakness",
    risk_level: "medium",
    impact_assessment: "Medium risk of unauthorized access due to stale user accounts",
    root_cause: "Lack of formal access review process and automated tools",
    affected_controls: ["CTRL-001"],
    affected_processes: ["User Access Management"],
    affected_systems: ["Customer Database"],
    regulatory_implications: ["SOX"],
    business_impact: "Potential unauthorized access and audit findings",
    recommendation: "Establish quarterly access review process with automated reporting",
    management_response: "Will establish quarterly access review process",
    remediation_plan: "Develop access review procedures and implement automated reporting",
    remediation_timeline: "2024-05-31",
    responsible_party: "IT Security Manager",
    status: "open",
    priority: "medium",
    evidence_references: ["EV-2024-003"],
    follow_up_required: true,
    follow_up_date: "2024-06-30",
    closure_criteria: "Quarterly access review process implemented and documented",
    closure_evidence: "",
    closed_by: "",
    closed_date: "",
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z"
  }
]

export default function AuditReportsPage() {
  const [reports, setReports] = useState<AuditReport[]>(mockReports)
  const [findings, setFindings] = useState<AuditFinding[]>(mockFindings)
  const [activeTab, setActiveTab] = useState("reports")
  const [isCreateReportDialogOpen, setIsCreateReportDialogOpen] = useState(false)
  const [isCreateFindingDialogOpen, setIsCreateFindingDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Form states
  const [reportFormData, setReportFormData] = useState({
    report_id: "",
    engagement_id: "",
    report_title: "",
    report_type: "",
    report_period_start: "",
    report_period_end: "",
    executive_summary: "",
    scope_and_objectives: "",
    methodology: "",
    key_findings: [] as string[],
    recommendations: [] as string[],
    management_response: "",
    overall_conclusion: "",
    risk_assessment: "",
    compliance_status: "",
    next_steps: "",
    distribution_list: [] as string[],
    confidentiality_level: "internal"
  })

  const [findingFormData, setFindingFormData] = useState({
    finding_id: "",
    report_id: "",
    finding_title: "",
    finding_description: "",
    finding_category: "",
    risk_level: "",
    impact_assessment: "",
    root_cause: "",
    affected_controls: [] as string[],
    affected_processes: [] as string[],
    affected_systems: [] as string[],
    regulatory_implications: [] as string[],
    business_impact: "",
    recommendation: "",
    management_response: "",
    remediation_plan: "",
    remediation_timeline: "",
    responsible_party: "",
    status: "open",
    priority: "medium",
    evidence_references: [] as string[],
    follow_up_required: true,
    follow_up_date: "",
    closure_criteria: ""
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800"
      case "review": return "bg-blue-100 text-blue-800"
      case "approved": return "bg-green-100 text-green-800"
      case "issued": return "bg-purple-100 text-purple-800"
      case "archived": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getFindingStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800"
      case "in-progress": return "bg-yellow-100 text-yellow-800"
      case "resolved": return "bg-blue-100 text-blue-800"
      case "closed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleExportReport = async (reportId: string, format: string) => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/audit/reports/export?reportId=${reportId}&format=${format}`, {
        method: 'GET'
      })
      const data = await response.json()
      
      if (data.success) {
        // In a real implementation, you would trigger the download
        alert(`Report exported successfully as ${format.toUpperCase()}`)
      } else {
        alert('Failed to export report')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCreateReport = () => {
    const newReport: AuditReport = {
      id: reports.length + 1,
      ...reportFormData,
      key_findings: reportFormData.key_findings,
      recommendations: reportFormData.recommendations,
      distribution_list: reportFormData.distribution_list,
      report_status: "draft",
      version: "1.0",
      previous_version_id: "",
      approval_status: "pending",
      approved_by: "",
      approval_date: "",
      issued_by: "",
      issued_date: "",
      engagement_name: "Selected Engagement",
      engagement_type: "it",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setReports([...reports, newReport])
    setIsCreateReportDialogOpen(false)
    resetReportForm()
  }

  const handleCreateFinding = () => {
    const newFinding: AuditFinding = {
      id: findings.length + 1,
      ...findingFormData,
      affected_controls: findingFormData.affected_controls,
      affected_processes: findingFormData.affected_processes,
      affected_systems: findingFormData.affected_systems,
      regulatory_implications: findingFormData.regulatory_implications,
      evidence_references: findingFormData.evidence_references,
      closure_evidence: "",
      closed_by: "",
      closed_date: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setFindings([...findings, newFinding])
    setIsCreateFindingDialogOpen(false)
    resetFindingForm()
  }

  const resetReportForm = () => {
    setReportFormData({
      report_id: "",
      engagement_id: "",
      report_title: "",
      report_type: "",
      report_period_start: "",
      report_period_end: "",
      executive_summary: "",
      scope_and_objectives: "",
      methodology: "",
      key_findings: [],
      recommendations: [],
      management_response: "",
      overall_conclusion: "",
      risk_assessment: "",
      compliance_status: "",
      next_steps: "",
      distribution_list: [],
      confidentiality_level: "internal"
    })
  }

  const resetFindingForm = () => {
    setFindingFormData({
      finding_id: "",
      report_id: "",
      finding_title: "",
      finding_description: "",
      finding_category: "",
      risk_level: "",
      impact_assessment: "",
      root_cause: "",
      affected_controls: [],
      affected_processes: [],
      affected_systems: [],
      regulatory_implications: [],
      business_impact: "",
      recommendation: "",
      management_response: "",
      remediation_plan: "",
      remediation_timeline: "",
      responsible_party: "",
      status: "open",
      priority: "medium",
      evidence_references: [],
      follow_up_required: true,
      follow_up_date: "",
      closure_criteria: ""
    })
  }

  const uniqueReportTypes = Array.from(new Set(reports.map(report => report.report_type)))
  const uniqueStatuses = Array.from(new Set(reports.map(report => report.report_status)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Audit Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create, manage, and export audit reports
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.length}</div>
                <p className="text-xs text-muted-foreground">Audit reports</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issued Reports</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.report_status === 'issued').length}
                </div>
                <p className="text-xs text-muted-foreground">Published reports</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{findings.length}</div>
                <p className="text-xs text-muted-foreground">Audit findings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Findings</CardTitle>
                <Clock className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {findings.filter(f => f.status === 'open').length}
                </div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports">Audit Reports</TabsTrigger>
              <TabsTrigger value="findings">Audit Findings</TabsTrigger>
            </TabsList>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Audit Reports</CardTitle>
                    <CardDescription>
                      Create and manage audit reports
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateReportDialogOpen} onOpenChange={setIsCreateReportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create Audit Report</DialogTitle>
                        <DialogDescription>
                          Create a new audit report
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="report_id">Report ID</Label>
                            <Input
                              id="report_id"
                              value={reportFormData.report_id}
                              onChange={(e) => setReportFormData({ ...reportFormData, report_id: e.target.value })}
                              placeholder="AR-2024-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="report_title">Report Title</Label>
                            <Input
                              id="report_title"
                              value={reportFormData.report_title}
                              onChange={(e) => setReportFormData({ ...reportFormData, report_title: e.target.value })}
                              placeholder="Customer Database System Audit Report"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="report_type">Report Type</Label>
                            <Select value={reportFormData.report_type} onValueChange={(value) => setReportFormData({ ...reportFormData, report_type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="executive_summary">Executive Summary</SelectItem>
                                <SelectItem value="detailed_report">Detailed Report</SelectItem>
                                <SelectItem value="interim_report">Interim Report</SelectItem>
                                <SelectItem value="final_report">Final Report</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confidentiality_level">Confidentiality Level</Label>
                            <Select value={reportFormData.confidentiality_level} onValueChange={(value) => setReportFormData({ ...reportFormData, confidentiality_level: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="internal">Internal</SelectItem>
                                <SelectItem value="confidential">Confidential</SelectItem>
                                <SelectItem value="restricted">Restricted</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="report_period_start">Report Period Start</Label>
                            <Input
                              id="report_period_start"
                              type="date"
                              value={reportFormData.report_period_start}
                              onChange={(e) => setReportFormData({ ...reportFormData, report_period_start: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="report_period_end">Report Period End</Label>
                            <Input
                              id="report_period_end"
                              type="date"
                              value={reportFormData.report_period_end}
                              onChange={(e) => setReportFormData({ ...reportFormData, report_period_end: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="executive_summary">Executive Summary</Label>
                          <Textarea
                            id="executive_summary"
                            value={reportFormData.executive_summary}
                            onChange={(e) => setReportFormData({ ...reportFormData, executive_summary: e.target.value })}
                            placeholder="Provide an executive summary of the audit findings..."
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scope_and_objectives">Scope and Objectives</Label>
                          <Textarea
                            id="scope_and_objectives"
                            value={reportFormData.scope_and_objectives}
                            onChange={(e) => setReportFormData({ ...reportFormData, scope_and_objectives: e.target.value })}
                            placeholder="Describe the audit scope and objectives..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="methodology">Methodology</Label>
                          <Textarea
                            id="methodology"
                            value={reportFormData.methodology}
                            onChange={(e) => setReportFormData({ ...reportFormData, methodology: e.target.value })}
                            placeholder="Describe the audit methodology used..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="overall_conclusion">Overall Conclusion</Label>
                          <Textarea
                            id="overall_conclusion"
                            value={reportFormData.overall_conclusion}
                            onChange={(e) => setReportFormData({ ...reportFormData, overall_conclusion: e.target.value })}
                            placeholder="Provide the overall audit conclusion..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateReportDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateReport}>
                          Create Report
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Report Date</TableHead>
                        <TableHead>Confidentiality</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-mono text-sm">{report.report_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.report_title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {report.executive_summary}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{report.engagement_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {report.report_type.replace('_', ' ').split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.report_status)}>
                              {report.report_status.charAt(0).toUpperCase() + report.report_status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {report.report_date ? new Date(report.report_date).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {report.confidentiality_level.charAt(0).toUpperCase() + report.confidentiality_level.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleExportReport(report.report_id, 'pdf')}
                                disabled={isExporting}
                              >
                                <FileDown className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleExportReport(report.report_id, 'docx')}
                                disabled={isExporting}
                              >
                                <FileUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Findings Tab */}
            <TabsContent value="findings" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Audit Findings</CardTitle>
                    <CardDescription>
                      Manage audit findings and recommendations
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateFindingDialogOpen} onOpenChange={setIsCreateFindingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Finding
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Audit Finding</DialogTitle>
                        <DialogDescription>
                          Create a new audit finding
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="finding_id">Finding ID</Label>
                            <Input
                              id="finding_id"
                              value={findingFormData.finding_id}
                              onChange={(e) => setFindingFormData({ ...findingFormData, finding_id: e.target.value })}
                              placeholder="AF-2024-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="finding_title">Finding Title</Label>
                            <Input
                              id="finding_title"
                              value={findingFormData.finding_title}
                              onChange={(e) => setFindingFormData({ ...findingFormData, finding_title: e.target.value })}
                              placeholder="Excessive User Privileges"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="finding_category">Finding Category</Label>
                            <Select value={findingFormData.finding_category} onValueChange={(value) => setFindingFormData({ ...findingFormData, finding_category: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="control_deficiency">Control Deficiency</SelectItem>
                                <SelectItem value="compliance_violation">Compliance Violation</SelectItem>
                                <SelectItem value="process_weakness">Process Weakness</SelectItem>
                                <SelectItem value="system_vulnerability">System Vulnerability</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="risk_level">Risk Level</Label>
                            <Select value={findingFormData.risk_level} onValueChange={(value) => setFindingFormData({ ...findingFormData, risk_level: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select risk level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="finding_description">Finding Description</Label>
                          <Textarea
                            id="finding_description"
                            value={findingFormData.finding_description}
                            onChange={(e) => setFindingFormData({ ...findingFormData, finding_description: e.target.value })}
                            placeholder="Describe the finding in detail..."
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="root_cause">Root Cause</Label>
                          <Textarea
                            id="root_cause"
                            value={findingFormData.root_cause}
                            onChange={(e) => setFindingFormData({ ...findingFormData, root_cause: e.target.value })}
                            placeholder="Identify the root cause of the finding..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recommendation">Recommendation</Label>
                          <Textarea
                            id="recommendation"
                            value={findingFormData.recommendation}
                            onChange={(e) => setFindingFormData({ ...findingFormData, recommendation: e.target.value })}
                            placeholder="Provide recommendations to address the finding..."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="responsible_party">Responsible Party</Label>
                            <Input
                              id="responsible_party"
                              value={findingFormData.responsible_party}
                              onChange={(e) => setFindingFormData({ ...findingFormData, responsible_party: e.target.value })}
                              placeholder="IT Security Manager"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="remediation_timeline">Remediation Timeline</Label>
                            <Input
                              id="remediation_timeline"
                              type="date"
                              value={findingFormData.remediation_timeline}
                              onChange={(e) => setFindingFormData({ ...findingFormData, remediation_timeline: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateFindingDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateFinding}>
                          Add Finding
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Finding ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Responsible Party</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {findings.map((finding) => (
                        <TableRow key={finding.id}>
                          <TableCell className="font-mono text-sm">{finding.finding_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{finding.finding_title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {finding.finding_description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(finding.risk_level)}>
                              {finding.risk_level.charAt(0).toUpperCase() + finding.risk_level.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(finding.priority)}>
                              {finding.priority.charAt(0).toUpperCase() + finding.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getFindingStatusColor(finding.status)}>
                              {finding.status.replace('-', ' ').split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{finding.responsible_party}</TableCell>
                          <TableCell>
                            {finding.remediation_timeline ? new Date(finding.remediation_timeline).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
