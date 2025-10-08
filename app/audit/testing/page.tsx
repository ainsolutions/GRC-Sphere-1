"use client"

import { useState, useEffect, useRef } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, FileImage, FileVideo, FileAudio } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    RefreshCw,
    BarChart3,
    Database,
    Shield,
    TrendingUp,
    Network,
    Target,
    CheckCircle,
    Clock,
    AlertTriangle,
    Upload,
    Download,
  } from "lucide-react"

interface TestingPlan {
  id: number
  plan_id: string
  engagement_id: string
  plan_name: string
  testing_period_start: string
  testing_period_end: string
  plan_status: string
  testing_objective: string
  sampling_methodology: string
  sample_size: number
  population_size: number
  confidence_level: number
  tolerable_error_rate: number
  expected_error_rate: number
  testing_approach: string
  deliverables: string[]
  approval_status: string
  approved_by: string
  approval_date: string
  engagement_name: string
  engagement_type: string
  created_at: string
  updated_at: string
}

interface TestingResult {
  id: number
  result_id: string
  procedure_id: string
  test_date: string
  tested_by: string
  test_result: string
  exceptions_found: number
  exceptions_description: string
  root_cause_analysis: string
  management_response: string
  remediation_plan: string
  remediation_timeline: string
  follow_up_required: boolean
  follow_up_date: string
  testing_notes: string
  conclusion: string
  recommendations: string[]
  risk_implications: string
  procedure_name: string
  control_id: string
  control_name: string
  control_category: string
  created_at: string
  updated_at: string
}

interface Evidence {
  id: number
  evidence_id: string
  result_id: string
  evidence_type: string
  evidence_name: string
  evidence_description: string
  file_path: string
  file_size: number
  file_type: string
  upload_date: string
  uploaded_by: string
  evidence_source: string
  reliability_rating: string
  relevance_rating: string
  sufficiency_rating: string
  confidentiality_level: string
  retention_period: number
  tags: string[]
  test_date: string
  tested_by: string
  test_result: string
  created_at: string
  updated_at: string
}

const mockTestingPlans: TestingPlan[] = [
  {
    id: 1,
    plan_id: "TP-2024-001",
    engagement_id: "AE-2024-001",
    plan_name: "Customer Database Controls Testing",
    testing_period_start: "2024-01-15",
    testing_period_end: "2024-03-15",
    plan_status: "in-progress",
    testing_objective: "Test effectiveness of access controls and data protection measures",
    sampling_methodology: "Statistical sampling with 95% confidence level",
    sample_size: 50,
    population_size: 200,
    confidence_level: 95,
    tolerable_error_rate: 5,
    expected_error_rate: 2,
    testing_approach: "Risk-based testing approach focusing on high-risk areas",
    deliverables: ["Testing Report", "Exception Report", "Management Letter"],
    approval_status: "approved",
    approved_by: "Sarah Johnson",
    approval_date: "2024-01-10",
    engagement_name: "Customer Database System Audit",
    engagement_type: "it",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z"
  }
]

const mockTestingResults: TestingResult[] = [
  {
    id: 1,
    result_id: "TR-2024-001",
    procedure_id: "PROC-001",
    test_date: "2024-01-20",
    tested_by: "Mike Wilson",
    test_result: "effective",
    exceptions_found: 0,
    exceptions_description: "",
    root_cause_analysis: "",
    management_response: "",
    remediation_plan: "",
    remediation_timeline: "",
    follow_up_required: false,
    follow_up_date: "",
    testing_notes: "All tested controls operating effectively",
    conclusion: "Controls are operating as designed",
    recommendations: ["Continue current monitoring"],
    risk_implications: "Low risk exposure",
    procedure_name: "User Access Review",
    control_id: "CTRL-001",
    control_name: "User Access Management",
    control_category: "preventive",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    result_id: "TR-2024-002",
    procedure_id: "PROC-002",
    test_date: "2024-01-25",
    tested_by: "Lisa Brown",
    test_result: "ineffective",
    exceptions_found: 3,
    exceptions_description: "Three users had excessive access privileges",
    root_cause_analysis: "Inadequate access review process",
    management_response: "Will implement quarterly access reviews",
    remediation_plan: "Review and revoke excessive privileges",
    remediation_timeline: "2024-02-15",
    follow_up_required: true,
    follow_up_date: "2024-02-15",
    testing_notes: "Control not operating effectively",
    conclusion: "Control needs improvement",
    recommendations: ["Implement quarterly access reviews", "Automate access provisioning"],
    risk_implications: "Medium risk exposure",
    procedure_name: "Privileged Access Review",
    control_id: "CTRL-002",
    control_name: "Privileged Access Management",
    control_category: "preventive",
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z"
  }
]

const mockEvidence: Evidence[] = [
  {
    id: 1,
    evidence_id: "EV-2024-001",
    result_id: "TR-2024-001",
    evidence_type: "document",
    evidence_name: "Access Review Report",
    evidence_description: "Quarterly access review report showing all users have appropriate access",
    file_path: "/uploads/evidence/access_review_report.pdf",
    file_size: 2048576,
    file_type: "application/pdf",
    upload_date: "2024-01-20T10:30:00Z",
    uploaded_by: "Mike Wilson",
    evidence_source: "IT Security System",
    reliability_rating: "high",
    relevance_rating: "high",
    sufficiency_rating: "high",
    confidentiality_level: "internal",
    retention_period: 7,
    tags: ["access-review", "quarterly"],
    test_date: "2024-01-20",
    tested_by: "Mike Wilson",
    test_result: "effective",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    evidence_id: "EV-2024-002",
    result_id: "TR-2024-002",
    evidence_type: "screenshot",
    evidence_name: "Excessive Privileges Screenshot",
    evidence_description: "Screenshot showing users with excessive privileges",
    file_path: "/uploads/evidence/excessive_privileges.png",
    file_size: 512000,
    file_type: "image/png",
    upload_date: "2024-01-25T14:15:00Z",
    uploaded_by: "Lisa Brown",
    evidence_source: "User Management System",
    reliability_rating: "high",
    relevance_rating: "high",
    sufficiency_rating: "medium",
    confidentiality_level: "confidential",
    retention_period: 7,
    tags: ["privileges", "exception"],
    test_date: "2024-01-25",
    tested_by: "Lisa Brown",
    test_result: "ineffective",
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z"
  }
]

export default function ControlsTestingPage() {
  const [testingPlans, setTestingPlans] = useState<TestingPlan[]>(mockTestingPlans)
  const [testingResults, setTestingResults] = useState<TestingResult[]>(mockTestingResults)
  const [evidence, setEvidence] = useState<Evidence[]>(mockEvidence)
  const [activeTab, setActiveTab] = useState("plans")
  const [isCreatePlanDialogOpen, setIsCreatePlanDialogOpen] = useState(false)
  const [isCreateResultDialogOpen, setIsCreateResultDialogOpen] = useState(false)
  const [isUploadEvidenceDialogOpen, setIsUploadEvidenceDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [planFormData, setPlanFormData] = useState({
    plan_id: "",
    engagement_id: "",
    plan_name: "",
    testing_period_start: "",
    testing_period_end: "",
    testing_objective: "",
    sampling_methodology: "",
    sample_size: 0,
    population_size: 0,
    confidence_level: 95,
    tolerable_error_rate: 5,
    expected_error_rate: 2,
    testing_approach: "",
    deliverables: [] as string[]
  })

  const [resultFormData, setResultFormData] = useState({
    result_id: "",
    procedure_id: "",
    test_date: "",
    tested_by: "",
    test_result: "",
    exceptions_found: 0,
    exceptions_description: "",
    root_cause_analysis: "",
    management_response: "",
    remediation_plan: "",
    remediation_timeline: "",
    follow_up_required: false,
    follow_up_date: "",
    testing_notes: "",
    conclusion: "",
    recommendations: [] as string[],
    risk_implications: ""
  })

  const [evidenceFormData, setEvidenceFormData] = useState({
    evidence_id: "",
    result_id: "",
    evidence_type: "",
    evidence_name: "",
    evidence_description: "",
    evidence_source: "",
    reliability_rating: "medium",
    relevance_rating: "medium",
    sufficiency_rating: "medium",
    confidentiality_level: "internal",
    retention_period: 7,
    tags: [] as string[]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800"
      case "approved": return "bg-green-100 text-green-800"
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-purple-100 text-purple-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "effective": return "bg-green-100 text-green-800"
      case "ineffective": return "bg-red-100 text-red-800"
      case "partially-effective": return "bg-yellow-100 text-yellow-800"
      case "not-tested": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-4 w-4 text-blue-600" />
      case "screenshot": return <FileImage className="h-4 w-4 text-green-600" />
      case "email": return <FileText className="h-4 w-4 text-purple-600" />
      case "report": return <FileText className="h-4 w-4 text-orange-600" />
      case "interview_notes": return <FileText className="h-4 w-4 text-indigo-600" />
      default: return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // Add the uploaded file to evidence
          const newEvidence: Evidence = {
            id: evidence.length + 1,
            evidence_id: `EV-${Date.now()}`,
            result_id: evidenceFormData.result_id,
            evidence_type: evidenceFormData.evidence_type,
            evidence_name: file.name,
            evidence_description: evidenceFormData.evidence_description,
            file_path: `/uploads/evidence/${file.name}`,
            file_size: file.size,
            file_type: file.type,
            upload_date: new Date().toISOString(),
            uploaded_by: "Current User",
            evidence_source: evidenceFormData.evidence_source,
            reliability_rating: evidenceFormData.reliability_rating,
            relevance_rating: evidenceFormData.relevance_rating,
            sufficiency_rating: evidenceFormData.sufficiency_rating,
            confidentiality_level: evidenceFormData.confidentiality_level,
            retention_period: evidenceFormData.retention_period,
            tags: evidenceFormData.tags,
            test_date: new Date().toISOString().split('T')[0],
            tested_by: "Current User",
            test_result: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setEvidence([...evidence, newEvidence])
          setIsUploadEvidenceDialogOpen(false)
          resetEvidenceForm()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleCreatePlan = () => {
    const newPlan: TestingPlan = {
      id: testingPlans.length + 1,
      ...planFormData,
      deliverables: planFormData.deliverables,
      plan_status: "draft",
      approval_status: "pending",
      approved_by: "",
      approval_date: "",
      engagement_name: "Selected Engagement",
      engagement_type: "it",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setTestingPlans([...testingPlans, newPlan])
    setIsCreatePlanDialogOpen(false)
    resetPlanForm()
  }

  const handleCreateResult = () => {
    const newResult: TestingResult = {
      id: testingResults.length + 1,
      ...resultFormData,
      recommendations: resultFormData.recommendations,
      procedure_name: "Selected Procedure",
      control_id: "CTRL-001",
      control_name: "Selected Control",
      control_category: "preventive",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setTestingResults([...testingResults, newResult])
    setIsCreateResultDialogOpen(false)
    resetResultForm()
  }

  const resetPlanForm = () => {
    setPlanFormData({
      plan_id: "",
      engagement_id: "",
      plan_name: "",
      testing_period_start: "",
      testing_period_end: "",
      testing_objective: "",
      sampling_methodology: "",
      sample_size: 0,
      population_size: 0,
      confidence_level: 95,
      tolerable_error_rate: 5,
      expected_error_rate: 2,
      testing_approach: "",
      deliverables: []
    })
  }

  const resetResultForm = () => {
    setResultFormData({
      result_id: "",
      procedure_id: "",
      test_date: "",
      tested_by: "",
      test_result: "",
      exceptions_found: 0,
      exceptions_description: "",
      root_cause_analysis: "",
      management_response: "",
      remediation_plan: "",
      remediation_timeline: "",
      follow_up_required: false,
      follow_up_date: "",
      testing_notes: "",
      conclusion: "",
      recommendations: [],
      risk_implications: ""
    })
  }

  const resetEvidenceForm = () => {
    setEvidenceFormData({
      evidence_id: "",
      result_id: "",
      evidence_type: "",
      evidence_name: "",
      evidence_description: "",
      evidence_source: "",
      reliability_rating: "medium",
      relevance_rating: "medium",
      sufficiency_rating: "medium",
      confidentiality_level: "internal",
      retention_period: 7,
      tags: []
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Controls Testing
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Test controls and manage evidence collection
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Testing Plans</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testingPlans.length}</div>
                <p className="text-xs text-muted-foreground">Active plans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Results</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testingResults.length}</div>
                <p className="text-xs text-muted-foreground">Completed tests</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{evidence.length}</div>
                <p className="text-xs text-muted-foreground">Uploaded evidence</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exceptions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testingResults.reduce((sum, result) => sum + result.exceptions_found, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total exceptions</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plans">Testing Plans</TabsTrigger>
              <TabsTrigger value="results">Test Results</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
            </TabsList>

            {/* Testing Plans Tab */}
            <TabsContent value="plans" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Control Testing Plans</CardTitle>
                    <CardDescription>
                      Plan and manage control testing activities
                    </CardDescription>
                  </div>
                  <Dialog open={isCreatePlanDialogOpen} onOpenChange={setIsCreatePlanDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create Testing Plan</DialogTitle>
                        <DialogDescription>
                          Create a new control testing plan
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="plan_id">Plan ID</Label>
                            <Input
                              id="plan_id"
                              value={planFormData.plan_id}
                              onChange={(e) => setPlanFormData({ ...planFormData, plan_id: e.target.value })}
                              placeholder="TP-2024-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="plan_name">Plan Name</Label>
                            <Input
                              id="plan_name"
                              value={planFormData.plan_name}
                              onChange={(e) => setPlanFormData({ ...planFormData, plan_name: e.target.value })}
                              placeholder="Customer Database Controls Testing"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="testing_period_start">Testing Period Start</Label>
                            <Input
                              id="testing_period_start"
                              type="date"
                              value={planFormData.testing_period_start}
                              onChange={(e) => setPlanFormData({ ...planFormData, testing_period_start: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testing_period_end">Testing Period End</Label>
                            <Input
                              id="testing_period_end"
                              type="date"
                              value={planFormData.testing_period_end}
                              onChange={(e) => setPlanFormData({ ...planFormData, testing_period_end: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="testing_objective">Testing Objective</Label>
                          <Textarea
                            id="testing_objective"
                            value={planFormData.testing_objective}
                            onChange={(e) => setPlanFormData({ ...planFormData, testing_objective: e.target.value })}
                            placeholder="Describe the testing objective..."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sample_size">Sample Size</Label>
                            <Input
                              id="sample_size"
                              type="number"
                              value={planFormData.sample_size}
                              onChange={(e) => setPlanFormData({ ...planFormData, sample_size: parseInt(e.target.value) })}
                              placeholder="50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="population_size">Population Size</Label>
                            <Input
                              id="population_size"
                              type="number"
                              value={planFormData.population_size}
                              onChange={(e) => setPlanFormData({ ...planFormData, population_size: parseInt(e.target.value) })}
                              placeholder="200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confidence_level">Confidence Level (%)</Label>
                            <Input
                              id="confidence_level"
                              type="number"
                              value={planFormData.confidence_level}
                              onChange={(e) => setPlanFormData({ ...planFormData, confidence_level: parseFloat(e.target.value) })}
                              placeholder="95"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreatePlanDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePlan}>
                          Create Plan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan ID</TableHead>
                        <TableHead>Plan Name</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Testing Period</TableHead>
                        <TableHead>Sample Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Approval</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testingPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-mono text-sm">{plan.plan_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{plan.plan_name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {plan.testing_objective}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{plan.engagement_name}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(plan.testing_period_start).toLocaleDateString()} - {new Date(plan.testing_period_end).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {plan.sample_size}/{plan.population_size}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {plan.confidence_level}% confidence
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(plan.plan_status)}>
                              {plan.plan_status.replace('-', ' ').split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={plan.approval_status === 'approved' ? 'default' : 'secondary'}>
                              {plan.approval_status.charAt(0).toUpperCase() + plan.approval_status.slice(1)}
                            </Badge>
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

            {/* Test Results Tab */}
            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Control Testing Results</CardTitle>
                    <CardDescription>
                      View and manage control testing results
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateResultDialogOpen} onOpenChange={setIsCreateResultDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Result
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Testing Result</DialogTitle>
                        <DialogDescription>
                          Record a new control testing result
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="result_id">Result ID</Label>
                            <Input
                              id="result_id"
                              value={resultFormData.result_id}
                              onChange={(e) => setResultFormData({ ...resultFormData, result_id: e.target.value })}
                              placeholder="TR-2024-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="test_date">Test Date</Label>
                            <Input
                              id="test_date"
                              type="date"
                              value={resultFormData.test_date}
                              onChange={(e) => setResultFormData({ ...resultFormData, test_date: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tested_by">Tested By</Label>
                            <Input
                              id="tested_by"
                              value={resultFormData.tested_by}
                              onChange={(e) => setResultFormData({ ...resultFormData, tested_by: e.target.value })}
                              placeholder="Mike Wilson"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="test_result">Test Result</Label>
                            <Select value={resultFormData.test_result} onValueChange={(value) => setResultFormData({ ...resultFormData, test_result: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select result" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="effective">Effective</SelectItem>
                                <SelectItem value="ineffective">Ineffective</SelectItem>
                                <SelectItem value="partially-effective">Partially Effective</SelectItem>
                                <SelectItem value="not-tested">Not Tested</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="testing_notes">Testing Notes</Label>
                          <Textarea
                            id="testing_notes"
                            value={resultFormData.testing_notes}
                            onChange={(e) => setResultFormData({ ...resultFormData, testing_notes: e.target.value })}
                            placeholder="Describe the testing process and findings..."
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="conclusion">Conclusion</Label>
                          <Textarea
                            id="conclusion"
                            value={resultFormData.conclusion}
                            onChange={(e) => setResultFormData({ ...resultFormData, conclusion: e.target.value })}
                            placeholder="Testing conclusion..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateResultDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateResult}>
                          Add Result
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Result ID</TableHead>
                        <TableHead>Control</TableHead>
                        <TableHead>Test Date</TableHead>
                        <TableHead>Tested By</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Exceptions</TableHead>
                        <TableHead>Follow-up</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testingResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-mono text-sm">{result.result_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{result.control_name}</div>
                              <div className="text-sm text-muted-foreground">{result.control_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(result.test_date).toLocaleDateString()}</TableCell>
                          <TableCell>{result.tested_by}</TableCell>
                          <TableCell>
                            <Badge className={getResultColor(result.test_result)}>
                              {result.test_result.replace('-', ' ').split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{result.exceptions_found}</div>
                            {result.exceptions_found > 0 && (
                              <div className="text-xs text-red-600">Exceptions found</div>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.follow_up_required ? (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-orange-600" />
                                <span className="text-xs text-orange-600">Required</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600">Complete</span>
                              </div>
                            )}
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

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Testing Evidence</CardTitle>
                    <CardDescription>
                      Manage evidence collected during control testing
                    </CardDescription>
                  </div>
                  <Dialog open={isUploadEvidenceDialogOpen} onOpenChange={setIsUploadEvidenceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Evidence
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Upload Evidence</DialogTitle>
                        <DialogDescription>
                          Upload evidence for control testing
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="evidence_id">Evidence ID</Label>
                            <Input
                              id="evidence_id"
                              value={evidenceFormData.evidence_id}
                              onChange={(e) => setEvidenceFormData({ ...evidenceFormData, evidence_id: e.target.value })}
                              placeholder="EV-2024-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="result_id">Result ID</Label>
                            <Select value={evidenceFormData.result_id} onValueChange={(value) => setEvidenceFormData({ ...evidenceFormData, result_id: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select result" />
                              </SelectTrigger>
                              <SelectContent>
                                {testingResults.map(result => (
                                  <SelectItem key={result.result_id} value={result.result_id}>
                                    {result.result_id} - {result.control_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="evidence_type">Evidence Type</Label>
                            <Select value={evidenceFormData.evidence_type} onValueChange={(value) => setEvidenceFormData({ ...evidenceFormData, evidence_type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="document">Document</SelectItem>
                                <SelectItem value="screenshot">Screenshot</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="report">Report</SelectItem>
                                <SelectItem value="interview_notes">Interview Notes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="evidence_source">Evidence Source</Label>
                            <Input
                              id="evidence_source"
                              value={evidenceFormData.evidence_source}
                              onChange={(e) => setEvidenceFormData({ ...evidenceFormData, evidence_source: e.target.value })}
                              placeholder="IT Security System"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="evidence_description">Description</Label>
                          <Textarea
                            id="evidence_description"
                            value={evidenceFormData.evidence_description}
                            onChange={(e) => setEvidenceFormData({ ...evidenceFormData, evidence_description: e.target.value })}
                            placeholder="Describe the evidence..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="file_upload">File Upload</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              ref={fileInputRef}
                              type="file"
                              onChange={handleFileUpload}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                            />
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF, DOC, DOCX, TXT, PNG, JPG, JPEG, GIF (max 10MB)
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-4"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                            >
                              {isUploading ? "Uploading..." : "Choose File"}
                            </Button>
                          </div>
                          {isUploading && (
                            <div className="space-y-2">
                              <Progress value={uploadProgress} className="w-full" />
                              <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsUploadEvidenceDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evidence ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>File Size</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evidence.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.evidence_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.evidence_name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {item.evidence_description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEvidenceTypeIcon(item.evidence_type)}
                              <span className="text-sm capitalize">{item.evidence_type.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">{item.result_id}</div>
                              <div className="text-xs text-muted-foreground">{item.control_name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatFileSize(item.file_size)}</TableCell>
                          <TableCell>{item.uploaded_by}</TableCell>
                          <TableCell>{new Date(item.upload_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
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
