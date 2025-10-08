"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  createAssessment,
  updateAssessment,
  getAssessmentTypes,
  getMethodologies,
} from "@/lib/actions/assessment-actions"
import { useToast } from "@/hooks/use-toast"
import { FileText, Target, AlertCircle } from "lucide-react"

// Generate assessment ID in format ASSESS-YYYY-XXXXXX
const generateAssessmentId = () => {
  const year = new Date().getFullYear()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ASSESS-${year}-${randomPart}`
}

interface AssessmentFormProps {
  assessment?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function AssessmentForm({ assessment, onSuccess, onCancel }: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessmentTypes, setAssessmentTypes] = useState<Array<{ value: string; label: string }>>([])
  const [methodologies, setMethodologies] = useState<Array<{ value: string; label: string }>>([])
  const { toast } = useToast()
  const [assessmentId, setAssessmentId] = useState(assessment?.assessment_id || generateAssessmentId())

  const isEditing = !!assessment

  useEffect(() => {
    const loadOptions = async () => {
      const [typesResult, methodsResult] = await Promise.all([getAssessmentTypes(), getMethodologies()])
      setAssessmentTypes(typesResult)
      setMethodologies(methodsResult)
    }
    loadOptions()
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      let result
      if (isEditing) {
        result = await updateAssessment(assessment.id, formData)
      } else {
        result = await createAssessment(formData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Assessment ${isEditing ? "updated" : "created"} successfully`,
        })
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>Core details about the assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assessment_id">Assessment ID *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="assessment_id"
                    name="assessment_id"
                    value={assessmentId}
                    onChange={(e) => setAssessmentId(e.target.value)}
                    placeholder="ASSESS-YYYY-XXXXXX"
                    required
                    pattern="^ASSESS-\d{4}-[A-Z0-9]{6}$"
                    title="Format: ASSESS-YYYY-XXXXXX (e.g., ASSESS-2024-ABC123)"
                    className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
                  />
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAssessmentId(generateAssessmentId())}
                      className="whitespace-nowrap"
                    >
                      Generate New
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">Format: ASSESS-YYYY-XXXXXX (automatically generated)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type *</Label>
                <Select name="type" defaultValue={assessment?.type || ""} required>
                  <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Assessment Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={assessment?.name || ""}
                placeholder="Enter assessment name"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={assessment?.description || ""}
                placeholder="Assessment description and objectives"
                rows={3}
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Textarea
                id="scope"
                name="scope"
                defaultValue={assessment?.scope || ""}
                placeholder="Define the assessment scope and boundaries"
                rows={3}
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Methodology & Execution */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Methodology & Execution</span>
            </CardTitle>
            <CardDescription>Assessment approach and execution details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="methodology">Methodology *</Label>
                <Select name="methodology" defaultValue={assessment?.methodology || ""} required>
                  <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                    <SelectValue placeholder="Select methodology" />
                  </SelectTrigger>
                  <SelectContent>
                    {methodologies.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessor">Assessor *</Label>
                <Input
                  id="assessor"
                  name="assessor"
                  defaultValue={assessment?.assessor || ""}
                  placeholder="Enter assessor name or organization"
                  required
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={assessment?.start_date?.split("T")[0] || ""}
                  required
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  defaultValue={assessment?.end_date?.split("T")[0] || ""}
                  required
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  defaultValue={assessment?.organization || ""}
                  placeholder="Organization being assessed"
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Results */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span>Status & Results</span>
            </CardTitle>
            <CardDescription>Current status and assessment outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={assessment?.status || "Planned"}>
                  <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue={assessment?.priority || "Medium"}>
                  <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk_rating">Risk Rating</Label>
                <Select name="risk_rating" defaultValue={assessment?.risk_rating || ""}>
                  <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                    <SelectValue placeholder="Select risk rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next_review_date">Next Review Date</Label>
                <Input
                  id="next_review_date"
                  name="next_review_date"
                  type="date"
                  defaultValue={assessment?.next_review_date?.split("T")[0] || ""}
                  className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_external" name="is_external" defaultChecked={assessment?.is_external || false} />
              <Label htmlFor="is_external">External Assessment</Label>
            </div>

            {isEditing && assessment?.findings_count > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    This assessment has {assessment.findings_count} associated findings
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white dark:from-blue-600 dark:via-blue-700 dark:to-blue-800"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Assessment" : "Create Assessment"}
        </Button>
      </div>
    </form>
  )
}
