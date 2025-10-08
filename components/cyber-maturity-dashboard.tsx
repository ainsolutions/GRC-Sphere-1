"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Import CRUD Forms
import {
  CRIControlForm,
  MaturityAssessmentForm,
  GapAnalysisForm,
  RemediationTrackingForm
} from "./cyber-maturity/crud-forms"

// Types
interface CRIControl {
  id: number
  control_id: string
  control_name: string
  domain: string
  control_objective: string
  maturity_level_1?: string
  maturity_level_2?: string
  maturity_level_3?: string
  maturity_level_4?: string
  maturity_level_5?: string
  created_at: string
  updated_at: string
}

interface CyberMaturityAssessment {
  id: number
  assessment_name: string
  description: string
  assessment_date: string
  assessor_name: string
  department: string
  status: 'draft' | 'in_progress' | 'completed' | 'approved'
  created_at: string
  updated_at: string
}

interface MaturityAssessment {
  id: number
  assessment_id: number
  control_id: number
  current_maturity_level: number
  target_maturity_level: number
  assessment_date: string
  assessor_comments?: string
  evidence?: string
  created_at: string
  updated_at: string
  control_name?: string
  assessment_name?: string
}

interface GapAnalysis {
  id: number
  assessment_id: number
  control_id: number
  gap_description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimated_effort?: string
  recommended_actions?: string
  created_at: string
  updated_at: string
  control_name?: string
  assessment_name?: string
}

interface RemediationTracking {
  id: number
  gap_id: number
  remediation_plan: string
  assigned_to: string
  due_date: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  actual_completion_date?: string
  notes?: string
  created_at: string
  updated_at: string
  gap_description?: string
  control_name?: string
}

export function CyberMaturityDashboard() {
  const [activeTab, setActiveTab] = useState("planning")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Data states
  const [assessments, setAssessments] = useState<CyberMaturityAssessment[]>([])
  const [criControls, setCriControls] = useState<CRIControl[]>([])
  const [maturityAssessments, setMaturityAssessments] = useState<MaturityAssessment[]>([])
  const [gapAnalyses, setGapAnalyses] = useState<GapAnalysis[]>([])
  const [remediationTrackings, setRemediationTrackings] = useState<RemediationTracking[]>([])

  // Dialog states
  const [criControlDialog, setCriControlDialog] = useState(false)
  const [maturityDialog, setMaturityDialog] = useState(false)
  const [gapDialog, setGapDialog] = useState(false)
  const [remediationDialog, setRemediationDialog] = useState(false)
  const [quickAssessmentDialog, setQuickAssessmentDialog] = useState(false)

  // Edit states
  const [editingCriControl, setEditingCriControl] = useState<CRIControl | null>(null)
  const [editingMaturityAssessment, setEditingMaturityAssessment] = useState<MaturityAssessment | null>(null)
  const [editingGapAnalysis, setEditingGapAnalysis] = useState<GapAnalysis | null>(null)
  const [editingRemediationTracking, setEditingRemediationTracking] = useState<RemediationTracking | null>(null)

  // Assessment state
  const [assessingControl, setAssessingControl] = useState<CRIControl | null>(null)

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null)
  const [selectedControl, setSelectedControl] = useState<number | null>(null)

  const { toast } = useToast()

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)

      // Load assessments
      const assessmentResponse = await fetch("/api/cyber-maturity")
      const assessmentData = await assessmentResponse.json()
      if (assessmentData.success) {
        setAssessments(assessmentData.data)
      }

      // Load CRI controls
      const controlsResponse = await fetch("/api/cyber-maturity/cri-controls")
      const controlsData = await controlsResponse.json()
      if (controlsData.success) {
        setCriControls(controlsData.data)
      }

      // Load maturity assessments
      const maturityResponse = await fetch("/api/cyber-maturity/maturity-assessments")
      const maturityData = await maturityResponse.json()
      if (maturityData.success) {
        setMaturityAssessments(maturityData.data)
      }

      // Load gap analyses
      const gapResponse = await fetch("/api/cyber-maturity/gaps-analysis")
      const gapData = await gapResponse.json()
      if (gapData.success) {
        setGapAnalyses(gapData.data)
      }

      // Load remediation tracking
      const remediationResponse = await fetch("/api/cyber-maturity/remediation-tracking")
      const remediationData = await remediationResponse.json()
      if (remediationData.success) {
        setRemediationTrackings(remediationData.data)
      }

    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  // Seed CRI controls
  const handleSeedControls = async () => {
    try {
      const response = await fetch("/api/cyber-maturity/seed-controls", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "CRI controls seeded successfully",
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed CRI controls",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding CRI controls:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Helper functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'approved': return 'text-purple-600 bg-purple-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRemediationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'not_started': return 'text-gray-600 bg-gray-100'
      case 'on_hold': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Filter data based on search and filters
  const filteredAssessments = assessments.filter(assessment =>
    assessment.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredControls = criControls.filter(control =>
    control.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMaturityAssessments = maturityAssessments.filter(assessment =>
    (!selectedAssessment || assessment.assessment_id === selectedAssessment) &&
    (!selectedControl || assessment.control_id === selectedControl)
  )

  const filteredGaps = gapAnalyses.filter(gap =>
    (!selectedAssessment || gap.assessment_id === selectedAssessment) &&
    (!selectedControl || gap.control_id === selectedControl) &&
    (gap.gap_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     gap.recommended_actions?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredRemediations = remediationTrackings.filter(remediation =>
    remediation.remediation_plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    remediation.assigned_to.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Cyber Maturity Assessment
          </h2>
          <p className="text-slate-300">Comprehensive cyber maturity management and tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Planning Assessment
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Framework Controls
          </TabsTrigger>
          <TabsTrigger value="gaps" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Gaps Analysis
          </TabsTrigger>
          <TabsTrigger value="remediation" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Remediation Tracking
          </TabsTrigger>
        </TabsList>

        {/* Planning Assessment Tab */}
        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Maturity Assessments
                  </CardTitle>
                  <CardDescription>
                    Create and manage cyber maturity assessments
                  </CardDescription>
                </div>
                <Dialog open={maturityDialog} onOpenChange={setMaturityDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Assessment
                    </Button>
                  </DialogTrigger>
                  <MaturityAssessmentForm
                    assessment={editingMaturityAssessment}
                    assessments={assessments}
                    controls={criControls}
                    onClose={() => {
                      setMaturityDialog(false)
                      setEditingMaturityAssessment(null)
                    }}
                    onSuccess={() => {
                      loadData()
                      setMaturityDialog(false)
                      setEditingMaturityAssessment(null)
                    }}
                  />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assessments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select
                    value={selectedAssessment?.toString() || ""}
                    onValueChange={(value) => setSelectedAssessment(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by assessment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Assessments</SelectItem>
                      {assessments.map((assessment) => (
                        <SelectItem key={assessment.id} value={assessment.id.toString()}>
                          {assessment.assessment_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Maturity Assessments Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Control</TableHead>
                      <TableHead>Current Level</TableHead>
                      <TableHead>Target Level</TableHead>
                      <TableHead>Assessment Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaturityAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>{assessment.assessment_name}</TableCell>
                        <TableCell>{assessment.control_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Level {assessment.current_maturity_level}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Level {assessment.target_maturity_level}</Badge>
                        </TableCell>
                        <TableCell>{new Date(assessment.assessment_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingMaturityAssessment(assessment)
                                setMaturityDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Framework Controls Tab */}
        <TabsContent value="controls" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    CRI Controls
                  </CardTitle>
                  <CardDescription>
                    Manage Cyber Readiness Institute controls and maturity levels
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleSeedControls} variant="outline">
                    Seed Controls
                  </Button>
                  <Dialog open={criControlDialog} onOpenChange={setCriControlDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Control
                      </Button>
                    </DialogTrigger>
                    <CRIControlForm
                      control={editingCriControl}
                      onClose={() => {
                        setCriControlDialog(false)
                        setEditingCriControl(null)
                      }}
                      onSuccess={() => {
                        loadData()
                        setCriControlDialog(false)
                        setEditingCriControl(null)
                      }}
                    />
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search controls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>

                {/* Controls Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Control ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Objective</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredControls.map((control) => (
                      <TableRow key={control.id}>
                        <TableCell className="font-mono">{control.control_id}</TableCell>
                        <TableCell>{control.control_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{control.domain}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {control.control_objective}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAssessingControl(control)
                                setQuickAssessmentDialog(true)
                              }}
                              title="Assess Control Maturity"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCriControl(control)
                                setCriControlDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gaps Analysis Tab */}
        <TabsContent value="gaps" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Gaps Analysis
                  </CardTitle>
                  <CardDescription>
                    Identify and track maturity gaps requiring remediation
                  </CardDescription>
                </div>
                <Dialog open={gapDialog} onOpenChange={setGapDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Gap Analysis
                    </Button>
                  </DialogTrigger>
                  <GapAnalysisForm
                    gap={editingGapAnalysis}
                    assessments={assessments}
                    controls={criControls}
                    onClose={() => {
                      setGapDialog(false)
                      setEditingGapAnalysis(null)
                    }}
                    onSuccess={() => {
                      loadData()
                      setGapDialog(false)
                      setEditingGapAnalysis(null)
                    }}
                  />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search gaps..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select
                    value={selectedAssessment?.toString() || ""}
                    onValueChange={(value) => setSelectedAssessment(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by assessment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Assessments</SelectItem>
                      {assessments.map((assessment) => (
                        <SelectItem key={assessment.id} value={assessment.id.toString()}>
                          {assessment.assessment_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gaps Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Control</TableHead>
                      <TableHead>Gap Description</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGaps.map((gap) => (
                      <TableRow key={gap.id}>
                        <TableCell>{gap.assessment_name}</TableCell>
                        <TableCell>{gap.control_name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {gap.gap_description}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(gap.severity)}>
                            {gap.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(gap.priority)}>
                            {gap.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingGapAnalysis(gap)
                                setGapDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Remediation Tracking Tab */}
        <TabsContent value="remediation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Remediation Tracking
                  </CardTitle>
                  <CardDescription>
                    Track remediation plans and progress for identified gaps
                  </CardDescription>
                </div>
                <Dialog open={remediationDialog} onOpenChange={setRemediationDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Remediation
                    </Button>
                  </DialogTrigger>
                  <RemediationTrackingForm
                    remediation={editingRemediationTracking}
                    gaps={gapAnalyses}
                    onClose={() => {
                      setRemediationDialog(false)
                      setEditingRemediationTracking(null)
                    }}
                    onSuccess={() => {
                      loadData()
                      setRemediationDialog(false)
                      setEditingRemediationTracking(null)
                    }}
                  />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search remediations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>

                {/* Remediation Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gap Description</TableHead>
                      <TableHead>Remediation Plan</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRemediations.map((remediation) => (
                      <TableRow key={remediation.id}>
                        <TableCell className="max-w-xs truncate">
                          {remediation.gap_description}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {remediation.remediation_plan}
                        </TableCell>
                        <TableCell>{remediation.assigned_to}</TableCell>
                        <TableCell>{new Date(remediation.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getRemediationStatusColor(remediation.status)}>
                            {remediation.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingRemediationTracking(remediation)
                                setRemediationDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Assessment Dialog */}
        <Dialog open={quickAssessmentDialog} onOpenChange={setQuickAssessmentDialog}>
          <QuickAssessmentDialog
            control={assessingControl}
            assessments={assessments}
            onClose={() => {
              setQuickAssessmentDialog(false)
              setAssessingControl(null)
            }}
            onSuccess={() => {
              loadData()
              setQuickAssessmentDialog(false)
              setAssessingControl(null)
            }}
          />
        </Dialog>
      </Tabs>
    </div>
  )
}

// Quick Assessment Dialog Component
function QuickAssessmentDialog({
  control,
  assessments,
  onClose,
  onSuccess
}: {
  control: CRIControl | null
  assessments: CyberMaturityAssessment[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [selectedAssessment, setSelectedAssessment] = useState<string>("")
  const [currentLevel, setCurrentLevel] = useState<string>("1")
  const [targetLevel, setTargetLevel] = useState<string>("3")
  const [assessmentDate, setAssessmentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [comments, setComments] = useState<string>("")
  const [evidence, setEvidence] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [newAssessmentName, setNewAssessmentName] = useState<string>("")
  const [showNewAssessment, setShowNewAssessment] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!control) return

    setLoading(true)

    try {
      let assessmentId = selectedAssessment

      // If creating a new assessment
      if (showNewAssessment && newAssessmentName.trim()) {
        const newAssessmentResponse = await fetch("/api/cyber-maturity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessment_name: newAssessmentName.trim(),
            description: `Assessment for control ${control.control_id}`,
            assessment_date: assessmentDate,
            assessor_name: "Current User", // This should come from auth context
            department: "",
            status: "in_progress"
          }),
        })

        const newAssessmentData = await newAssessmentResponse.json()
        if (newAssessmentData.success) {
          assessmentId = newAssessmentData.data.id.toString()
        } else {
          throw new Error(newAssessmentData.error || "Failed to create assessment")
        }
      }

      // Create the maturity assessment
      const response = await fetch("/api/cyber-maturity/maturity-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: parseInt(assessmentId),
          control_id: control.id,
          current_maturity_level: parseInt(currentLevel),
          target_maturity_level: parseInt(targetLevel),
          assessment_date: assessmentDate,
          assessor_comments: comments,
          evidence: evidence
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Maturity assessment created for control ${control.control_id}`,
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create maturity assessment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating maturity assessment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!control) return null

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Assess Control: {control.control_id}
        </DialogTitle>
        <DialogDescription>
          Create a maturity assessment for {control.control_name}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Control Information */}
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Control Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Control ID:</span>
              <span className="ml-2 font-mono">{control.control_id}</span>
            </div>
            <div>
              <span className="text-slate-400">Domain:</span>
              <span className="ml-2">{control.domain}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-slate-400">Objective:</span>
            <p className="mt-1 text-sm text-slate-200">{control.control_objective}</p>
          </div>
        </div>

        {/* Assessment Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assessment Framework</label>
          <div className="flex items-center gap-2">
            <Select
              value={selectedAssessment}
              onValueChange={(value) => {
                setSelectedAssessment(value)
                setShowNewAssessment(value === "new")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select existing assessment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ Create New Assessment</SelectItem>
                {assessments.map((assessment) => (
                  <SelectItem key={assessment.id} value={assessment.id.toString()}>
                    {assessment.assessment_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showNewAssessment && (
            <div className="space-y-2">
              <label className="text-sm font-medium">New Assessment Name</label>
              <Input
                value={newAssessmentName}
                onChange={(e) => setNewAssessmentName(e.target.value)}
                placeholder="Enter assessment name"
                required
              />
            </div>
          )}
        </div>

        {/* Maturity Levels */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Maturity Level</label>
            <Select value={currentLevel} onValueChange={setCurrentLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Maturity Level</label>
            <Select value={targetLevel} onValueChange={setTargetLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assessment Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assessment Date</label>
          <Input
            type="date"
            value={assessmentDate}
            onChange={(e) => setAssessmentDate(e.target.value)}
            required
          />
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assessor Comments</label>
          <textarea
            className="w-full p-2 border border-slate-600 rounded-md bg-slate-800 text-white placeholder:text-slate-400 focus:border-blue-400"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter assessment comments and observations"
            rows={3}
          />
        </div>

        {/* Evidence */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Evidence</label>
          <textarea
            className="w-full p-2 border border-slate-600 rounded-md bg-slate-800 text-white placeholder:text-slate-400 focus:border-blue-400"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Enter supporting evidence and documentation"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !selectedAssessment}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Assessment...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Assess Control
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
