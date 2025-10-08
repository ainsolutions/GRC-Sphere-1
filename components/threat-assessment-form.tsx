"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { createThreatAssessment } from "@/lib/actions/threat-assessment-actions"
import { useToast } from "@/hooks/use-toast"

interface ThreatAssessmentFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function ThreatAssessmentForm({ onSuccess, onCancel }: ThreatAssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessmentDate, setAssessmentDate] = useState<Date>()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    assessment_name: "",
    threat_id: "",
    asset_id: "",
    likelihood: "",
    impact: "",
    risk_level: "",
    mitigation_status: "pending",
    assessor: "",
    notes: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.assessment_name.trim()) {
      newErrors.assessment_name = "Assessment name is required"
    }
    if (!formData.threat_id.trim()) {
      newErrors.threat_id = "Threat ID is required"
    }
    if (!formData.asset_id.trim()) {
      newErrors.asset_id = "Asset ID is required"
    }
    if (!formData.likelihood) {
      newErrors.likelihood = "Likelihood is required"
    }
    if (!formData.impact) {
      newErrors.impact = "Impact is required"
    }
    if (!formData.risk_level) {
      newErrors.risk_level = "Risk level is required"
    }
    if (!formData.assessor.trim()) {
      newErrors.assessor = "Assessor is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Submitting threat assessment with data:", {
        ...formData,
        assessment_date: assessmentDate?.toISOString() || new Date().toISOString(),
      })

      const result = await createThreatAssessment({
        ...formData,
        assessment_date: assessmentDate?.toISOString() || new Date().toISOString(),
      })

      console.log("Threat assessment creation result:", result)

      if (result.success) {
        toast({
          title: "Success",
          description: "Threat assessment created successfully",
        })
        onSuccess()
      } else {
        console.error("Threat assessment creation failed:", result.error)
        toast({
          title: "Error",
          description: result.error || "Failed to create threat assessment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Unexpected error creating threat assessment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the threat assessment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Create Threat Assessment</CardTitle>
        <CardDescription className="text-slate-300">Add a new threat assessment to evaluate risks</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assessment_name" className="text-slate-200">
                Assessment Name *
              </Label>
              <Input
                id="assessment_name"
                value={formData.assessment_name}
                onChange={(e) => updateFormData("assessment_name", e.target.value)}
                placeholder="Enter assessment name"
                required
                className={cn(
                  "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                  errors.assessment_name && "border-red-500",
                )}
              />
              {errors.assessment_name && <p className="text-red-400 text-sm mt-1">{errors.assessment_name}</p>}
            </div>

            <div>
              <Label htmlFor="threat_id" className="text-slate-200">
                Threat ID *
              </Label>
              <Input
                id="threat_id"
                value={formData.threat_id}
                onChange={(e) => updateFormData("threat_id", e.target.value)}
                placeholder="Enter threat ID"
                required
                className={cn(
                  "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                  errors.threat_id && "border-red-500",
                )}
              />
              {errors.threat_id && <p className="text-red-400 text-sm mt-1">{errors.threat_id}</p>}
            </div>

            <div>
              <Label htmlFor="asset_id" className="text-slate-200">
                Asset ID *
              </Label>
              <Input
                id="asset_id"
                value={formData.asset_id}
                onChange={(e) => updateFormData("asset_id", e.target.value)}
                placeholder="Enter asset ID"
                required
                className={cn(
                  "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                  errors.asset_id && "border-red-500",
                )}
              />
              {errors.asset_id && <p className="text-red-400 text-sm mt-1">{errors.asset_id}</p>}
            </div>

            <div>
              <Label htmlFor="assessor" className="text-slate-200">
                Assessor *
              </Label>
              <Input
                id="assessor"
                value={formData.assessor}
                onChange={(e) => updateFormData("assessor", e.target.value)}
                placeholder="Enter assessor name"
                required
                className={cn(
                  "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                  errors.assessor && "border-red-500",
                )}
              />
              {errors.assessor && <p className="text-red-400 text-sm mt-1">{errors.assessor}</p>}
            </div>

            <div>
              <Label className="text-slate-200">Likelihood *</Label>
              <Select value={formData.likelihood} onValueChange={(value) => updateFormData("likelihood", value)}>
                <SelectTrigger
                  className={cn("bg-slate-800/50 border-slate-600 text-white", errors.likelihood && "border-red-500")}
                >
                  <SelectValue placeholder="Select likelihood" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="very low">Very Low (1)</SelectItem>
                  <SelectItem value="low">Low (2)</SelectItem>
                  <SelectItem value="medium">Medium (3)</SelectItem>
                  <SelectItem value="high">High (4)</SelectItem>
                  <SelectItem value="very high">Very High (5)</SelectItem>
                </SelectContent>
              </Select>
              {errors.likelihood && <p className="text-red-400 text-sm mt-1">{errors.likelihood}</p>}
            </div>

            <div>
              <Label className="text-slate-200">Impact *</Label>
              <Select value={formData.impact} onValueChange={(value) => updateFormData("impact", value)}>
                <SelectTrigger
                  className={cn("bg-slate-800/50 border-slate-600 text-white", errors.impact && "border-red-500")}
                >
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="very low">Very Low (1)</SelectItem>
                  <SelectItem value="low">Low (2)</SelectItem>
                  <SelectItem value="medium">Medium (3)</SelectItem>
                  <SelectItem value="high">High (4)</SelectItem>
                  <SelectItem value="very high">Very High (5)</SelectItem>
                </SelectContent>
              </Select>
              {errors.impact && <p className="text-red-400 text-sm mt-1">{errors.impact}</p>}
            </div>

            <div>
              <Label className="text-slate-200">Risk Level *</Label>
              <Select value={formData.risk_level} onValueChange={(value) => updateFormData("risk_level", value)}>
                <SelectTrigger
                  className={cn("bg-slate-800/50 border-slate-600 text-white", errors.risk_level && "border-red-500")}
                >
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="low">Low (2)</SelectItem>
                  <SelectItem value="medium">Medium (3)</SelectItem>
                  <SelectItem value="high">High (4)</SelectItem>
                  <SelectItem value="critical">Critical (5)</SelectItem>
                </SelectContent>
              </Select>
              {errors.risk_level && <p className="text-red-400 text-sm mt-1">{errors.risk_level}</p>}
            </div>

            <div>
              <Label className="text-slate-200">Mitigation Status</Label>
              <Select
                value={formData.mitigation_status}
                onValueChange={(value) => updateFormData("mitigation_status", value)}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not_required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label className="text-slate-200">Assessment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700",
                      !assessmentDate && "text-slate-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {assessmentDate ? format(assessmentDate, "PPP") : "Select assessment date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                  <Calendar
                    mode="single"
                    selected={assessmentDate}
                    onSelect={setAssessmentDate}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes" className="text-slate-200">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                placeholder="Enter additional notes..."
                rows={4}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Assessment"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
