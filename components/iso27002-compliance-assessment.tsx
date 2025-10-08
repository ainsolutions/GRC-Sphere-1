"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  Download,
  RefreshCw,
  Search,
  Eye,
  AlertCircle,
  Clock,
  Plus,
} from "lucide-react"

// Mock data for ISO 27002 controls
const mockAssessments = [
  {
    id: "iso27002-2024-001",
    title: "ISO 27002:2022 Annual Assessment",
    description: "Comprehensive assessment of information security controls based on ISO 27002:2022",
    status: "in_progress",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    assessor: "Security Team",
    overallScore: 78,
    totalControls: 93,
    assessedControls: 65,
    compliantControls: 51,
    partiallyCompliantControls: 14,
    nonCompliantControls: 0,
    notAssessedControls: 28,
    lastUpdated: "2024-11-30",
    categories: [
      {
        id: "5",
        name: "Organizational Controls",
        controlCount: 37,
        assessedCount: 25,
        score: 82,
        status: "in_progress",
      },
      {
        id: "6",
        name: "People Controls",
        controlCount: 8,
        assessedCount: 6,
        score: 75,
        status: "in_progress",
      },
      {
        id: "7",
        name: "Physical Controls",
        controlCount: 14,
        assessedCount: 10,
        score: 85,
        status: "in_progress",
      },
      {
        id: "8",
        name: "Technological Controls",
        controlCount: 34,
        assessedCount: 24,
        score: 72,
        status: "in_progress",
      },
    ],
    findings: [
      {
        id: "F001",
        controlId: "5.1.1",
        title: "Information security policy incomplete",
        severity: "medium",
        status: "open",
        description: "Information security policy does not cover all required areas",
      },
      {
        id: "F002",
        controlId: "8.2.1",
        title: "Privileged access management gaps",
        severity: "high",
        status: "open",
        description: "Privileged access rights are not properly managed and monitored",
      },
    ],
  },
  {
    id: "iso27002-2023-001",
    title: "ISO 27002:2022 Initial Assessment",
    description: "Initial baseline assessment following ISO 27002:2022 framework",
    status: "completed",
    startDate: "2023-10-01",
    endDate: "2023-12-15",
    assessor: "External Auditor",
    overallScore: 65,
    totalControls: 93,
    assessedControls: 93,
    compliantControls: 42,
    partiallyCompliantControls: 28,
    nonCompliantControls: 23,
    notAssessedControls: 0,
    lastUpdated: "2023-12-15",
    categories: [
      {
        id: "5",
        name: "Organizational Controls",
        controlCount: 37,
        assessedCount: 37,
        score: 68,
        status: "completed",
      },
      {
        id: "6",
        name: "People Controls",
        controlCount: 8,
        assessedCount: 8,
        score: 62,
        status: "completed",
      },
      {
        id: "7",
        name: "Physical Controls",
        controlCount: 14,
        assessedCount: 14,
        score: 71,
        status: "completed",
      },
      {
        id: "8",
        name: "Technological Controls",
        controlCount: 34,
        assessedCount: 34,
        score: 58,
        status: "completed",
      },
    ],
    findings: [],
  },
]

export function ISO27002ComplianceAssessment() {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/iso27002-assessments")
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setAssessments(data)
        } else {
          setAssessments(mockAssessments)
        }
      } else {
        setAssessments(mockAssessments)
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
      setAssessments(mockAssessments)
    } finally {
      setLoading(false)
    }
  }

  const createAssessment = async (assessmentData) => {
    try {
      const response = await fetch("/api/iso27002-assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      })

      if (response.ok) {
        const newAssessment = await response.json()
        setAssessments((prev) => [newAssessment, ...prev])
        toast.success("Assessment created successfully")
        return newAssessment
      } else {
        toast.error("Failed to create assessment")
      }
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast.error("Error creating assessment")
    }
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      !searchTerm ||
      assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "planned":
        return <Badge className="bg-blue-100 text-blue-800">Planned</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "planned":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  if (selectedAssessment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedAssessment(null)} className="mb-4">
            ← Back to Assessments
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Assessment Details */}
        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedAssessment.title}
                </CardTitle>
                <CardDescription className="mt-2">{selectedAssessment.description}</CardDescription>
                <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                  <span>ID: {selectedAssessment.id}</span>
                  <span>Assessor: {selectedAssessment.assessor}</span>
                  <span>
                    Period: {selectedAssessment.startDate} to {selectedAssessment.endDate}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(selectedAssessment.status)}
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{selectedAssessment.overallScore}%</div>
                  <p className="text-xs text-muted-foreground">Overall Score</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{selectedAssessment.compliantControls}</div>
                <p className="text-sm text-muted-foreground">Compliant</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {selectedAssessment.partiallyCompliantControls}
                </div>
                <p className="text-sm text-muted-foreground">Partially Compliant</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{selectedAssessment.nonCompliantControls}</div>
                <p className="text-sm text-muted-foreground">Non-Compliant</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{selectedAssessment.notAssessedControls}</div>
                <p className="text-sm text-muted-foreground">Not Assessed</p>
              </div>
            </div>

            <Progress
              value={(selectedAssessment.assessedControls / selectedAssessment.totalControls) * 100}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground text-center">
              {selectedAssessment.assessedControls} of {selectedAssessment.totalControls} controls assessed
            </p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="gradient-card-secondary border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Control Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedAssessment.categories.map((category) => (
                <Card key={category.id} className="border-gray-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {getStatusBadge(category.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={category.score} className="w-16 h-2" />
                          <span className="text-sm font-medium">{category.score}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm">
                          {category.assessedCount} / {category.controlCount}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full mt-3 bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        View Controls
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Findings */}
        {selectedAssessment.findings && selectedAssessment.findings.length > 0 && (
          <Card className="gradient-card-accent border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Key Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedAssessment.findings.map((finding) => (
                  <Card key={finding.id} className="border-gray-200/50 bg-black/50 backdrop-blur-sm">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">{finding.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {finding.controlId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{finding.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              finding.severity === "high"
                                ? "bg-red-100 text-red-800"
                                : finding.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {finding.severity}
                          </Badge>
                          <Badge variant="outline">{finding.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ISO 27002 Compliance Assessments
              </CardTitle>
              <CardDescription className="mt-2">
                Manage and track ISO 27002:2022 information security control assessments
              </CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assessments List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAssessments.map((assessment) => (
          <Card
            key={assessment.id}
            className="gradient-card-secondary border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedAssessment(assessment)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(assessment.status)}
                    <CardTitle className="text-xl">{assessment.title}</CardTitle>
                  </div>
                  <CardDescription>{assessment.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>ID: {assessment.id}</span>
                    <span>Assessor: {assessment.assessor}</span>
                    <span>
                      Period: {assessment.startDate} to {assessment.endDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(assessment.status)}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{assessment.overallScore}%</div>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{assessment.compliantControls}</div>
                    <p className="text-xs text-muted-foreground">Compliant</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-600">{assessment.partiallyCompliantControls}</div>
                    <p className="text-xs text-muted-foreground">Partial</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{assessment.nonCompliantControls}</div>
                    <p className="text-xs text-muted-foreground">Non-Compliant</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-600">{assessment.notAssessedControls}</div>
                    <p className="text-xs text-muted-foreground">Not Assessed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Assessment Progress</span>
                    <span>
                      {assessment.assessedControls} / {assessment.totalControls} controls
                    </span>
                  </div>
                  <Progress value={(assessment.assessedControls / assessment.totalControls) * 100} />
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Last updated: {assessment.lastUpdated}</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No assessments found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first ISO 27002 compliance assessment to get started.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
