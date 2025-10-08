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
import { CalendarIcon, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { createFinding, getAssessments, type FindingFormData } from "@/lib/actions/findings-actions"
import { toast } from "sonner"
import OwnerSelectInput from "@/components/owner-search-input"
import { setFips } from "crypto"

interface Assessment {
  id: number
  assessment_id: string
  assessment_name: string
  type?: string
  status?: string
  organization_name?: string
  department_name?: string
}

interface FindingFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<FindingFormData>
}

export function FindingForm({ onSuccess, onCancel, initialData }: FindingFormProps) {
  const [formData, setFormData] = useState<FindingFormData>({
    assessment_id: initialData?.assessment_id || 0,
    finding_title: initialData?.finding_title || "",
    finding_description: initialData?.finding_description || "",
    severity: initialData?.severity || "Medium",
    category: initialData?.category || "",
    recommendation: initialData?.recommendation || "",
    status: initialData?.status || "Open",
    assigned_to: initialData?.assigned_to || "",
    due_date: initialData?.due_date || "",
  })

  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)

  useEffect(() => {
    loadAssessments()
  }, [])

  useEffect(() => {
    if (formData.assessment_id && assessments.length > 0) {
      const assessment = assessments.find((a) => a.id === formData.assessment_id)
      setSelectedAssessment(assessment || null)
    }
  }, [formData.assessment_id, assessments])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.assessment_id) {
      toast.error("Please select an assessment")
      return
    }

    if (!formData.finding_title.trim()) {
      toast.error("Please enter a finding title")
      return
    }

    if (!formData.finding_description.trim()) {
      toast.error("Please enter a finding description")
      return
    }

    setIsLoading(true)

    try {
      const result = await createFinding(formData)

      if (result.success) {
        toast.success("Finding created successfully!")

        // Reset form
        setFormData({
          assessment_id: 0,
          finding_title: "",
          finding_description: "",
          severity: "Medium",
          category: "",
          recommendation: "",
          status: "Open",
          assigned_to: "",
          due_date: "",
        })
        setSelectedAssessment(null)

        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(result.error || "Failed to create finding")
      }
    } catch (error) {
      console.error("Error creating finding:", error)
      toast.error("Failed to create finding")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FindingFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Create New Finding</h1>
        <p className="text-blue-400">Add a new security finding to an assessment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assessment Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Assessment Selection
            </CardTitle>
            <CardDescription>Select the assessment this finding belongs to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="assessment">Assessment *</Label>
              <Select
                value={formData.assessment_id.toString()}
                onValueChange={(value) => handleInputChange("assessment_id", Number.parseInt(value))}
                disabled={isLoadingAssessments}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingAssessments ? "Loading assessments..." : "Select an assessment"} />
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
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Selected Assessment</h4>
                <div className="flex flex-wrap gap-2">
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
                <p className="text-sm text-blue-700 mt-2">
                  {selectedAssessment.organization_name} • {selectedAssessment.department_name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Finding Details */}
        <Card>
          <CardHeader>
            <CardTitle>Finding Details</CardTitle>
            <CardDescription>Provide detailed information about the security finding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="finding_title">Finding Title *</Label>
              <Input
                id="finding_title"
                value={formData.finding_title}
                onChange={(e) => handleInputChange("finding_title", e.target.value)}
                placeholder="Enter a clear, descriptive title for the finding"
                required
              />
            </div>

            <div>
              <Label htmlFor="finding_description">Finding Description *</Label>
              <Textarea
                id="finding_description"
                value={formData.finding_description}
                onChange={(e) => handleInputChange("finding_description", e.target.value)}
                placeholder="Provide a detailed description of the security finding, including what was observed and why it's a concern"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity">Severity *</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
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
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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

            <div>
              <Label htmlFor="recommendation">Recommendation</Label>
              <Textarea
                id="recommendation"
                value={formData.recommendation}
                onChange={(e) => handleInputChange("recommendation", e.target.value)}
                placeholder="Provide specific recommendations to address this finding"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Management Information */}
        <Card>
          <CardHeader>
            <CardTitle>Management Information</CardTitle>
            <CardDescription>Assignment and tracking details for the finding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
                <Label htmlFor="assigned_to">Assigned To</Label>
                <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="assigned_to"/>
                {/* <Input
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => handleInputChange("assigned_to", e.target.value)}
                  placeholder="Team or person responsible"
                /> */}
              </div>
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange("due_date", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {formData.finding_title && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Preview of how your finding will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{formData.finding_title}</h3>
                  <Badge className={getSeverityColor(formData.severity)}>
                    {getSeverityIcon(formData.severity)}
                    {formData.severity}
                  </Badge>
                  <Badge className={getStatusColor(formData.status)}>{formData.status}</Badge>
                </div>
                {formData.category && <Badge variant="outline">{formData.category}</Badge>}
                {formData.finding_description && <p className="text-gray-700">{formData.finding_description}</p>}
                {formData.recommendation && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Recommendation:</h4>
                    <p className="text-sm text-gray-600">{formData.recommendation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading || !formData.assessment_id}>
            {isLoading ? "Creating..." : "Create Finding"}
          </Button>
        </div>
      </form>
    </div>
  )
}
