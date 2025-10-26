"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Plus, FileText, CheckCircle, AlertTriangle, Clock, TrendingUp, BarChart3, Target, Star } from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

interface MICASelfAssessment {
  id: string
  assessment_name: string
  description: string
  assessment_period: string
  business_unit: string
  assessor_name: string
  assessor_role: string
  status: "draft" | "in_progress" | "completed" | "under_review"
  total_controls?: number
  avg_maturity_level?: number
  implemented_count?: number
  partially_implemented_count?: number
  not_implemented_count?: number
  created_at: string
  updated_at: string
}

interface MICAControl {
  id: string
  assessment_id: string
  control_id: string
  control_title: string
  control_description: string
  category: string
  maturity_level: number
  implementation_status: "implemented" | "partially_implemented" | "not_implemented"
  evidence_provided: string
  gaps_identified: string
  improvement_recommendations: string
  target_maturity_level: number
  estimated_effort: string
  responsible_party: string
  target_completion_date: string
}

export function MICASelfAssessment() {
  const [assessments, setAssessments] = useState<MICASelfAssessment[]>([])
  const [controls, setControls] = useState<MICAControl[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState<MICASelfAssessment | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [newAssessment, setNewAssessment] = useState({
    assessment_name: "",
    description: "",
    assessment_period: "",
    business_unit: "",
    assessor_name: "",
    assessor_role: "",
  })

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/mica-self-assessment")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error("Error fetching MICA self-assessments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch MICA self-assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createAssessment = async () => {
    try {
      const response = await fetch("/api/mica-self-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssessment),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "MICA self-assessment created successfully",
        })
        setIsCreateDialogOpen(false)
        setNewAssessment({
          assessment_name: "",
          description: "",
          assessment_period: "",
          business_unit: "",
          assessor_name: "",
          assessor_role: "",
        })
        fetchAssessments()
      } else {
        throw new Error("Failed to create self-assessment")
      }
    } catch (error) {
      console.error("Error creating self-assessment:", error)
      toast({
        title: "Error",
        description: "Failed to create MICA self-assessment",
        variant: "destructive",
      })
    }
  }

  const getMaturityLevelBadge = (level: number) => {
    const maturityConfig = {
      0: { color: "bg-gray-100 text-gray-800", label: "Not Implemented" },
      1: { color: "bg-red-100 text-red-800", label: "Initial" },
      2: { color: "bg-orange-100 text-orange-800", label: "Developing" },
      3: { color: "bg-yellow-100 text-yellow-800", label: "Defined" },
      4: { color: "bg-blue-100 text-blue-800", label: "Managed" },
      5: { color: "bg-green-100 text-green-800", label: "Optimized" },
    }

    const config = maturityConfig[level as keyof typeof maturityConfig] || maturityConfig[0]

    return (
      <Badge className={config.color}>
        <Star className="w-3 h-3 mr-1" />
        Level {level} - {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      implemented: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      partially_implemented: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      not_implemented: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
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

  // Sample radar chart data
  const radarData = [
    { category: "Authorization", current: 3.2, target: 4.5 },
    { category: "Operational", current: 2.8, target: 4.0 },
    { category: "Custody", current: 3.5, target: 4.5 },
    { category: "Market Abuse", current: 2.5, target: 4.0 },
    { category: "Transparency", current: 3.0, target: 4.2 },
    { category: "Consumer Protection", current: 2.7, target: 4.0 },
  ]

  if (loading) {
    return (
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MICA Self-Assessment
          </h2>
          <p className="text-muted-foreground mt-1">Evaluate your organization's MICA compliance maturity</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={()=>{}} btnAddText="New Self Assessment"/>
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Self-Assessment
            </Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New MICA Self-Assessment</DialogTitle>
              <DialogDescription>
                Set up a new MICA self-assessment to evaluate your organization's compliance maturity.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_name">Assessment Name</Label>
                  <Input
                    id="assessment_name"
                    value={newAssessment.assessment_name}
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessment_name: e.target.value })}
                    placeholder="Q1 2024 MICA Self-Assessment"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment_period">Assessment Period</Label>
                  <Input
                    id="assessment_period"
                    value={newAssessment.assessment_period}
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessment_period: e.target.value })}
                    placeholder="Q1 2024"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAssessment.description}
                  onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                  placeholder="Comprehensive self-assessment of MICA compliance maturity..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_unit">Business Unit</Label>
                  <Input
                    id="business_unit"
                    value={newAssessment.business_unit}
                    onChange={(e) => setNewAssessment({ ...newAssessment, business_unit: e.target.value })}
                    placeholder="Crypto Trading Division"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessor_role">Assessor Role</Label>
                  <Input
                    id="assessor_role"
                    value={newAssessment.assessor_role}
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessor_role: e.target.value })}
                    placeholder="Compliance Manager"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessor_name">Assessor Name</Label>
                <Input
                  id="assessor_name"
                  value={newAssessment.assessor_name}
                  onChange={(e) => setNewAssessment({ ...newAssessment, assessor_name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createAssessment}>Create Self-Assessment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Average Maturity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3.2</div>
            <Progress value={64} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Level 3 - Defined</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-secondary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Active Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {assessments.filter((a) => a.status === "in_progress").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {assessments.filter((a) => a.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card-accent border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Controls Assessed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">156</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-warning border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Improvement Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">23</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="maturity" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Maturity Model
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="gradient-card-primary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Maturity Radar Chart
                </CardTitle>
                <CardDescription>Current vs Target maturity levels by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="gradient-card-secondary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Implementation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Implemented</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={65} className="w-20 h-2" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Partially Implemented</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="w-20 h-2" />
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Not Implemented</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={10} className="w-20 h-2" />
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card className="gradient-card-primary border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MICA Self-Assessments
              </CardTitle>
              <CardDescription>Manage and track your MICA compliance self-assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment Name</TableHead>
                    <TableHead>Business Unit</TableHead>
                    <TableHead>Assessor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Avg Maturity</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
                      <TableCell>{assessment.business_unit}</TableCell>
                      <TableCell>{assessment.assessor_name}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            assessment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : assessment.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : assessment.status === "under_review"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }
                        >
                          {assessment.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{getMaturityLevelBadge(Math.round(assessment.avg_maturity_level || 0))}</TableCell>
                      <TableCell>{new Date(assessment.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maturity" className="space-y-4">
          <Card className="gradient-card-primary border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MICA Maturity Model
              </CardTitle>
              <CardDescription>Understanding the 6-level maturity framework for MICA compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    level: 0,
                    title: "Not Implemented",
                    description: "No processes or controls in place",
                    color: "bg-gray-100 text-gray-800",
                  },
                  {
                    level: 1,
                    title: "Initial",
                    description: "Ad-hoc processes, reactive approach",
                    color: "bg-red-100 text-red-800",
                  },
                  {
                    level: 2,
                    title: "Developing",
                    description: "Basic processes defined, some documentation",
                    color: "bg-orange-100 text-orange-800",
                  },
                  {
                    level: 3,
                    title: "Defined",
                    description: "Documented processes, consistent implementation",
                    color: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    level: 4,
                    title: "Managed",
                    description: "Monitored processes, metrics-driven",
                    color: "bg-blue-100 text-blue-800",
                  },
                  {
                    level: 5,
                    title: "Optimized",
                    description: "Continuous improvement, industry leading",
                    color: "bg-green-100 text-green-800",
                  },
                ].map((maturity) => (
                  <div
                    key={maturity.level}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-blue-200/50"
                  >
                    <Badge className={maturity.color}>
                      <Star className="w-3 h-3 mr-1" />
                      Level {maturity.level}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold">{maturity.title}</h4>
                      <p className="text-sm text-muted-foreground">{maturity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="gradient-card-primary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Maturity Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">Maturity progression analytics coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card-secondary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Benchmark Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">Industry benchmark comparison coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
