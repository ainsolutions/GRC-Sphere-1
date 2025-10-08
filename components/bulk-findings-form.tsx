"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Trash2,
  Copy,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  CalendarIcon,
  FileText,
  Target,
} from "lucide-react"
import { createBulkFindings, getAssessments, type FindingFormData } from "@/lib/actions/findings-actions"
import { toast } from "sonner"
import OwnerSelectInput from "@/components/owner-search-input"

interface Assessment {
  id: number
  assessment_id: string
  assessment_name: string
  type?: string
  status?: string
  organization_name?: string
  department_name?: string
}

interface BulkFindingData extends Omit<FindingFormData, "assessment_id"> {
  id: string // temporary ID for form management
}

interface BulkFindingsFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function BulkFindingsForm({ onSuccess, onCancel }: BulkFindingsFormProps) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number>(0)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [findings, setFindings] = useState<BulkFindingData[]>([
    {
      id: "1",
      finding_title: "",
      finding_description: "",
      severity: "Medium",
      category: "",
      recommendation: "",
      status: "Open",
      assigned_to: "",
      due_date: "",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)

  useEffect(() => {
    loadAssessments()
  }, [])

  useEffect(() => {
    if (selectedAssessmentId && assessments.length > 0) {
      const assessment = assessments.find((a) => a.id === selectedAssessmentId)
      setSelectedAssessment(assessment || null)
    }
  }, [selectedAssessmentId, assessments])

  const loadAssessments = async () => {
    try {
      setIsLoadingAssessments(true)
      const result = await getAssessments()
      if (result.success) {
        setAssessments(result.data)
      } else {
        toast.error("Failed to load assessments")
      }
    } catch (error) {
      console.error("Error loading assessments:", error)
      toast.error("Failed to load assessments")
    } finally {
      setIsLoadingAssessments(false)
    }
  }

  const addFinding = () => {
    const newFinding: BulkFindingData = {
      id: Date.now().toString(),
      finding_title: "",
      finding_description: "",
      severity: "Medium",
      category: "",
      recommendation: "",
      status: "Open",
      assigned_to: "",
      due_date: "",
    }
    setFindings([...findings, newFinding])
  }

  const removeFinding = (id: string) => {
    if (findings.length > 1) {
      setFindings(findings.filter((f) => f.id !== id))
    }
  }

  const duplicateFinding = (id: string) => {
    const findingToDuplicate = findings.find((f) => f.id === id)
    if (findingToDuplicate) {
      const duplicated: BulkFindingData = {
        ...findingToDuplicate,
        id: Date.now().toString(),
        finding_title: `${findingToDuplicate.finding_title} (Copy)`,
      }
      const index = findings.findIndex((f) => f.id === id)
      const newFindings = [...findings]
      newFindings.splice(index + 1, 0, duplicated)
      setFindings(newFindings)
    }
  }

  const updateFinding = (id: string, field: keyof Omit<BulkFindingData, "id">, value: string) => {
    setFindings(findings.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAssessmentId) {
      toast.error("Please select an assessment")
      return
    }

    // Validate all findings
    const invalidFindings = findings.filter((f) => !f.finding_title.trim() || !f.finding_description.trim())

    if (invalidFindings.length > 0) {
      toast.error(`Please complete all required fields for ${invalidFindings.length} finding(s)`)
      return
    }

    setIsLoading(true)

    try {
      const findingsToCreate = findings.map((f) => ({
        assessment_id: selectedAssessmentId,
        finding_title: f.finding_title,
        finding_description: f.finding_description,
        severity: f.severity,
        category: f.category,
        recommendation: f.recommendation,
        status: f.status,
        assigned_to: f.assigned_to,
        due_date: f.due_date,
      }))

      const result = await createBulkFindings(findingsToCreate)

      if (result.success) {
        toast.success(`Successfully created ${result.data.length} findings!`)

        // Reset form
        setSelectedAssessmentId(0)
        setSelectedAssessment(null)
        setFindings([
          {
            id: "1",
            finding_title: "",
            finding_description: "",
            severity: "Medium",
            category: "",
            recommendation: "",
            status: "Open",
            assigned_to: "",
            due_date: "",
          },
        ])

        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(result.error || "Failed to create findings")
      }
    } catch (error) {
      console.error("Error creating findings:", error)
      toast.error("Failed to create findings")
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "High":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "Medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Low":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Target className="h-6 w-6" />
          Bulk Findings Creation
        </h1>
        <p className="text-purple-100">Add multiple security findings to a single assessment efficiently</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assessment Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Target Assessment
            </CardTitle>
            <CardDescription>Select the assessment where all findings will be added</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="assessment">Assessment *</Label>
              <Select
                value={selectedAssessmentId.toString()}
                onValueChange={(value) => setSelectedAssessmentId(Number.parseInt(value))}
                disabled={isLoadingAssessments}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={isLoadingAssessments ? "Loading assessments..." : "Select target assessment"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{assessment.assessment_name}</span>
                        <span className="text-sm text-gray-500">
                          {assessment.assessment_id} • {assessment.type} • {assessment.status}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAssessment && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Target Assessment Selected
                </h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="bg-white">
                    {selectedAssessment.assessment_id}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {selectedAssessment.type}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {selectedAssessment.status}
                  </Badge>
                </div>
                <p className="text-sm text-purple-700">
                  {selectedAssessment.organization_name} • {selectedAssessment.department_name}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  All {findings.length} finding(s) will be added to this assessment
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Findings List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Findings ({findings.length})
                </CardTitle>
                <CardDescription>Add multiple findings using the same template</CardDescription>
              </div>
              <Button type="button" onClick={addFinding} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Finding
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {findings.map((finding, index) => (
                  <div key={finding.id} className="relative">
                    <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              Finding #{index + 1}
                            </Badge>
                            {finding.severity && (
                              <Badge className={getSeverityColor(finding.severity)}>
                                {getSeverityIcon(finding.severity)}
                                {finding.severity}
                              </Badge>
                            )}
                            {finding.status && (
                              <Badge className={getStatusColor(finding.status)}>{finding.status}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateFinding(finding.id)}
                              title="Duplicate this finding"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {findings.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFinding(finding.id)}
                                title="Remove this finding"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor={`title-${finding.id}`}>Finding Title *</Label>
                            <Input
                              id={`title-${finding.id}`}
                              value={finding.finding_title}
                              onChange={(e) => updateFinding(finding.id, "finding_title", e.target.value)}
                              placeholder="Enter a clear, descriptive title"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor={`severity-${finding.id}`}>Severity *</Label>
                            <Select
                              value={finding.severity}
                              onValueChange={(value) => updateFinding(finding.id, "severity", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Critical">
                                  <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    Critical
                                  </div>
                                </SelectItem>
                                <SelectItem value="High">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                    High
                                  </div>
                                </SelectItem>
                                <SelectItem value="Medium">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                    Medium
                                  </div>
                                </SelectItem>
                                <SelectItem value="Low">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-500" />
                                    Low
                                  </div>
                                </SelectItem>
                                <SelectItem value="Informational">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-gray-500" />
                                    Informational
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`category-${finding.id}`}>Category</Label>
                            <Select
                              value={finding.category}
                              onValueChange={(value) => updateFinding(finding.id, "category", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Access Control">Access Control</SelectItem>
                                <SelectItem value="Application Security">Application Security</SelectItem>
                                <SelectItem value="Data Protection">Data Protection</SelectItem>
                                <SelectItem value="Network Security">Network Security</SelectItem>
                                <SelectItem value="Vulnerability Management">Vulnerability Management</SelectItem>
                                <SelectItem value="Compliance">Compliance</SelectItem>
                                <SelectItem value="Risk Management">Risk Management</SelectItem>
                                <SelectItem value="Incident Management">Incident Management</SelectItem>
                                <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                                <SelectItem value="Physical Security">Physical Security</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <Label htmlFor={`description-${finding.id}`}>Finding Description *</Label>
                          <Textarea
                            id={`description-${finding.id}`}
                            value={finding.finding_description}
                            onChange={(e) => updateFinding(finding.id, "finding_description", e.target.value)}
                            placeholder="Provide detailed description of the security finding"
                            rows={3}
                            required
                          />
                        </div>

                        {/* Recommendation */}
                        <div>
                          <Label htmlFor={`recommendation-${finding.id}`}>Recommendation</Label>
                          <Textarea
                            id={`recommendation-${finding.id}`}
                            value={finding.recommendation}
                            onChange={(e) => updateFinding(finding.id, "recommendation", e.target.value)}
                            placeholder="Provide specific recommendations to address this finding"
                            rows={2}
                          />
                        </div>

                        {/* Management Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`status-${finding.id}`}>Status</Label>
                            <Select
                              value={finding.status}
                              onValueChange={(value) => updateFinding(finding.id, "status", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`assigned-${finding.id}`}>Assigned To</Label>                                             
                            <OwnerSelectInput formData={findings} setFormData={setFindings} fieldName="assigned_to" />
                            {/* <Input
                              id={`assigned-${finding.id}`}
                              value={finding.assigned_to}
                              onChange={(e) => {
                                
                                // updateFinding(finding.id, "assigned_to", e.target.value)
                                // (id: string, field: keyof Omit<BulkFindingData, "id">, value: string)
                                setFindings(findings.map((f) => (f.id === finding.id ? { ...f, ['assigned_to']: e.target.value } : f)))

                              }}
                              placeholder="Team or person"
                            /> */}
                          </div>

                          <div>
                            <Label htmlFor={`due-${finding.id}`}>Due Date</Label>
                            <Input
                              id={`due-${finding.id}`}
                              type="date"
                              value={finding.due_date}
                              onChange={(e) => updateFinding(finding.id, "due_date", e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {index < findings.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedAssessment && findings.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{findings.length}</div>
                  <div className="text-sm text-green-700">Total Findings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {findings.filter((f) => f.severity === "Critical").length}
                  </div>
                  <div className="text-sm text-red-700">Critical</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {findings.filter((f) => f.severity === "High").length}
                  </div>
                  <div className="text-sm text-orange-700">High</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {findings.filter((f) => f.finding_title.trim() && f.finding_description.trim()).length}
                  </div>
                  <div className="text-sm text-blue-700">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || !selectedAssessmentId || findings.length === 0}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
          >
            {isLoading ? "Creating..." : `Create ${findings.length} Finding${findings.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
