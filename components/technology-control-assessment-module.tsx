"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, FileText, Plus, Search, Shield, Target } from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

interface ControlAssessmentItem {
  id: number
  control_id: string
  control_name: string
  control_description: string
  control_type: "preventive" | "detective" | "corrective" | "compensating"
  control_category: string
  implementation_status: "not_implemented" | "partially_implemented" | "fully_implemented" | "not_applicable"
  effectiveness_rating: number
  testing_status: "not_tested" | "scheduled" | "in_progress" | "passed" | "failed" | "not_applicable"
  testing_frequency: string
  last_test_date: string
  next_test_date: string
  evidence_location: string
  gaps_identified: string
  recommendations: string
  responsible_party: string
  compliance_frameworks: string[]
}

interface ControlAssessment {
  id: number
  assessment_id: string
  assessment_name: string
  assessment_date: string
  assessor_name: string
  status: "draft" | "in_progress" | "completed" | "approved"
  overall_effectiveness_score: number
  total_controls: number
  implemented_controls: number
  partially_implemented_controls: number
  not_implemented_controls: number
  items: ControlAssessmentItem[]
}

interface TechnologyControlAssessmentModuleProps {
  technologyRiskId: string
  readOnly?: boolean
}

export default function TechnologyControlAssessmentModule({
  technologyRiskId,
  readOnly = false,
}: TechnologyControlAssessmentModuleProps) {
  const [assessments, setAssessments] = useState<ControlAssessment[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<ControlAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewAssessmentDialog, setShowNewAssessmentDialog] = useState(false)
  const [showControlDialog, setShowControlDialog] = useState(false)
  const [selectedControl, setSelectedControl] = useState<ControlAssessmentItem | null>(null)

  useEffect(() => {
    fetchAssessments()
  }, [technologyRiskId])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/technology-risks/${technologyRiskId}/control-assessments`)
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
        if (data.length > 0) {
          setSelectedAssessment(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching control assessments:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", icon: FileText },
      in_progress: { color: "bg-blue-100 text-blue-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      approved: { color: "bg-purple-100 text-purple-800", icon: Shield },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const getImplementationStatusBadge = (status: string) => {
    const statusConfig = {
      not_implemented: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      partially_implemented: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      fully_implemented: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      not_applicable: { color: "bg-gray-100 text-gray-800", icon: FileText },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_implemented
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const getEffectivenessColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredControls =
    selectedAssessment?.items.filter(
      (control) =>
        control.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.control_category.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Effectiveness</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.length > 0
                ? (assessments.reduce((sum, a) => sum + a.overall_effectiveness_score, 0) / assessments.length).toFixed(
                    1,
                  )
                : "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Controls</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.reduce((sum, a) => sum + a.total_controls, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implementation Rate</CardTitle>
            <Progress className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.length > 0
                ? Math.round(
                    (assessments.reduce((sum, a) => sum + a.implemented_controls, 0) /
                      assessments.reduce((sum, a) => sum + a.total_controls, 0)) *
                      100,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Tabs */}
      <Tabs defaultValue="assessments" className="w-full">
        <TabsList>
          <TabsTrigger value="assessments">Control Assessments</TabsTrigger>
          <TabsTrigger value="controls">Control Details</TabsTrigger>
          <TabsTrigger value="evidence">Evidence & Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Control Assessments</h3>
            {!readOnly && (
              <ActionButtons isTableAction={false} onAdd={()=>{setShowNewAssessmentDialog}} btnAddText="New Assessment"/>
              {/* <Button onClick={() => setShowNewAssessmentDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button> */}
            )}
          </div>

          <div className="grid gap-4">
            {assessments.map((assessment) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{assessment.assessment_name}</CardTitle>
                      <CardDescription>
                        Assessment ID: {assessment.assessment_id} | Date: {assessment.assessment_date}
                      </CardDescription>
                    </div>
                    {getStatusBadge(assessment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Assessor:</span>
                      <p>{assessment.assessor_name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Total Controls:</span>
                      <p>{assessment.total_controls}</p>
                    </div>
                    <div>
                      <span className="font-medium">Implemented:</span>
                      <p className="text-green-600">{assessment.implemented_controls}</p>
                    </div>
                    <div>
                      <span className="font-medium">Effectiveness:</span>
                      <p className={getEffectivenessColor(assessment.overall_effectiveness_score)}>
                        {assessment.overall_effectiveness_score}/5
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Implementation Progress</span>
                      <span>{Math.round((assessment.implemented_controls / assessment.total_controls) * 100)}%</span>
                    </div>
                    <Progress
                      value={(assessment.implemented_controls / assessment.total_controls) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Control Details</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search controls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              {!readOnly && (
                <ActionButtons isTableAction={false} onAdd={()=>{setShowControlDialog}} btnAddText="Add Control"/>
                {/* <Button onClick={() => setShowControlDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Control
                </Button> */}
              )}
            </div>
          </div>

          {selectedAssessment && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedAssessment.assessment_name} - Controls</CardTitle>
                <CardDescription>{filteredControls.length} controls found</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Control ID</TableHead>
                      <TableHead>Control Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Effectiveness</TableHead>
                      <TableHead>Testing</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredControls.map((control) => (
                      <TableRow key={control.id}>
                        <TableCell className="font-medium">{control.control_id}</TableCell>
                        <TableCell>{control.control_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{control.control_type}</Badge>
                        </TableCell>
                        <TableCell>{control.control_category}</TableCell>
                        <TableCell>{getImplementationStatusBadge(control.implementation_status)}</TableCell>
                        <TableCell>
                          <span className={getEffectivenessColor(control.effectiveness_rating)}>
                            {control.effectiveness_rating}/5
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={control.testing_status === "passed" ? "default" : "secondary"}>
                            {control.testing_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setSelectedControl(control)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Evidence & Documentation</h3>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evidence Repository</CardTitle>
              <CardDescription>Documentation and evidence supporting control assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>Evidence management functionality will be implemented here</p>
                <p className="text-sm">Upload and manage assessment evidence, test results, and documentation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Control Detail Dialog */}
      {selectedControl && (
        <Dialog open={!!selectedControl} onOpenChange={() => setSelectedControl(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedControl.control_name}</DialogTitle>
              <DialogDescription>Control ID: {selectedControl.control_id}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Control Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedControl.control_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-muted-foreground">{selectedControl.control_category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Implementation Status</Label>
                  <div className="mt-1">{getImplementationStatusBadge(selectedControl.implementation_status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Effectiveness Rating</Label>
                  <p className={`text-sm font-medium ${getEffectivenessColor(selectedControl.effectiveness_rating)}`}>
                    {selectedControl.effectiveness_rating}/5
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedControl.control_description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Testing Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedControl.testing_status === "passed" ? "default" : "secondary"}>
                      {selectedControl.testing_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Testing Frequency</Label>
                  <p className="text-sm text-muted-foreground">{selectedControl.testing_frequency}</p>
                </div>
              </div>

              {selectedControl.gaps_identified && (
                <div>
                  <Label className="text-sm font-medium">Gaps Identified</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedControl.gaps_identified}</p>
                </div>
              )}

              {selectedControl.recommendations && (
                <div>
                  <Label className="text-sm font-medium">Recommendations</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedControl.recommendations}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Compliance Frameworks</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedControl.compliance_frameworks.map((framework) => (
                    <Badge key={framework} variant="outline">
                      {framework}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
