"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// Types
interface CRIControl {
  id?: number
  control_id: string
  control_name: string
  domain: string
  control_objective: string
  maturity_level_1?: string
  maturity_level_2?: string
  maturity_level_3?: string
  maturity_level_4?: string
  maturity_level_5?: string
}

interface MaturityAssessment {
  id?: number
  assessment_id: number
  control_id: number
  current_maturity_level: number
  target_maturity_level: number
  assessment_date: string
  assessor_comments?: string
  evidence?: string
}

interface GapAnalysis {
  id?: number
  assessment_id: number
  control_id: number
  gap_description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimated_effort?: string
  recommended_actions?: string
}

interface RemediationTracking {
  id?: number
  gap_id: number
  remediation_plan: string
  assigned_to: string
  due_date: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  actual_completion_date?: string
  notes?: string
}

// CRI Control CRUD Component
export function CRIControlForm({ control, onClose, onSuccess }: {
  control?: CRIControl | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<CRIControl>({
    control_id: "",
    control_name: "",
    domain: "",
    control_objective: "",
    maturity_level_1: "",
    maturity_level_2: "",
    maturity_level_3: "",
    maturity_level_4: "",
    maturity_level_5: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (control) {
      setFormData(control)
    }
  }, [control])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = control?.id ? "PUT" : "POST"
      const url = control?.id
        ? `/api/cyber-maturity/cri-controls/${control.id}`
        : "/api/cyber-maturity/cri-controls"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `CRI control ${control?.id ? "updated" : "created"} successfully`,
        })
        onSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save CRI control",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving CRI control:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!control?.id) return

    try {
      const response = await fetch(`/api/cyber-maturity/cri-controls/${control.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "CRI control deleted successfully",
        })
        onSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete CRI control",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting CRI control:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {control?.id ? "Edit CRI Control" : "Add New CRI Control"}
        </DialogTitle>
        <DialogDescription>
          {control?.id ? "Update the CRI control details" : "Create a new CRI control"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="control_id">Control ID *</Label>
            <Input
              id="control_id"
              value={formData.control_id}
              onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
              placeholder="e.g., CRI-GOV-001"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Select
              value={formData.domain}
              onValueChange={(value) => setFormData({ ...formData, domain: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Governance">Governance</SelectItem>
                <SelectItem value="Information Security">Information Security</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                <SelectItem value="People">People</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="control_name">Control Name *</Label>
          <Input
            id="control_name"
            value={formData.control_name}
            onChange={(e) => setFormData({ ...formData, control_name: e.target.value })}
            placeholder="Enter control name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="control_objective">Control Objective *</Label>
          <Textarea
            id="control_objective"
            value={formData.control_objective}
            onChange={(e) => setFormData({ ...formData, control_objective: e.target.value })}
            placeholder="Describe the control objective"
            rows={3}
            required
          />
        </div>

        {/* Maturity Levels */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Maturity Levels</Label>
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="space-y-2">
              <Label htmlFor={`maturity_level_${level}`}>Level {level}</Label>
              <Textarea
                id={`maturity_level_${level}`}
                value={formData[`maturity_level_${level}` as keyof CRIControl] as string || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  [`maturity_level_${level}`]: e.target.value
                })}
                placeholder={`Describe maturity level ${level} requirements`}
                rows={2}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          {control?.id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="mr-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete CRI Control</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this CRI control? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {control?.id ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {control?.id ? "Update" : "Create"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

// Maturity Assessment CRUD Component
export function MaturityAssessmentForm({ assessment, assessments, controls, onClose, onSuccess }: {
  assessment?: MaturityAssessment | null
  assessments: any[]
  controls: any[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<MaturityAssessment>({
    assessment_id: 0,
    control_id: 0,
    current_maturity_level: 1,
    target_maturity_level: 3,
    assessment_date: new Date().toISOString().split('T')[0],
    assessor_comments: "",
    evidence: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (assessment) {
      setFormData(assessment)
    }
  }, [assessment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = assessment?.id ? "PUT" : "POST"
      const url = assessment?.id
        ? `/api/cyber-maturity/maturity-assessments/${assessment.id}`
        : "/api/cyber-maturity/maturity-assessments"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Maturity assessment ${assessment?.id ? "updated" : "created"} successfully`,
        })
        onSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save maturity assessment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving maturity assessment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {assessment?.id ? "Edit Maturity Assessment" : "Add Maturity Assessment"}
        </DialogTitle>
        <DialogDescription>
          {assessment?.id ? "Update the maturity assessment" : "Create a new maturity assessment"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assessment_id">Assessment *</Label>
            <Select
              value={formData.assessment_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, assessment_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessments.map((assessment) => (
                  <SelectItem key={assessment.id} value={assessment.id.toString()}>
                    {assessment.assessment_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="control_id">Control *</Label>
            <Select
              value={formData.control_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, control_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select control" />
              </SelectTrigger>
              <SelectContent>
                {controls.map((control) => (
                  <SelectItem key={control.id} value={control.id.toString()}>
                    {control.control_id} - {control.control_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_maturity_level">Current Level *</Label>
            <Select
              value={formData.current_maturity_level.toString()}
              onValueChange={(value) => setFormData({ ...formData, current_maturity_level: parseInt(value) })}
            >
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
            <Label htmlFor="target_maturity_level">Target Level *</Label>
            <Select
              value={formData.target_maturity_level.toString()}
              onValueChange={(value) => setFormData({ ...formData, target_maturity_level: parseInt(value) })}
            >
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

        <div className="space-y-2">
          <Label htmlFor="assessment_date">Assessment Date *</Label>
          <Input
            id="assessment_date"
            type="date"
            value={formData.assessment_date}
            onChange={(e) => setFormData({ ...formData, assessment_date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessor_comments">Assessor Comments</Label>
          <Textarea
            id="assessor_comments"
            value={formData.assessor_comments}
            onChange={(e) => setFormData({ ...formData, assessor_comments: e.target.value })}
            placeholder="Enter assessor comments"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="evidence">Evidence</Label>
          <Textarea
            id="evidence"
            value={formData.evidence}
            onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
            placeholder="Enter evidence and supporting documentation"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {assessment?.id ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {assessment?.id ? "Update" : "Create"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

// Gap Analysis CRUD Component
export function GapAnalysisForm({ gap, assessments, controls, onClose, onSuccess }: {
  gap?: GapAnalysis | null
  assessments: any[]
  controls: any[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<GapAnalysis>({
    assessment_id: 0,
    control_id: 0,
    gap_description: "",
    severity: "medium",
    priority: "medium",
    estimated_effort: "",
    recommended_actions: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (gap) {
      setFormData(gap)
    }
  }, [gap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = gap?.id ? "PUT" : "POST"
      const url = gap?.id
        ? `/api/cyber-maturity/gaps-analysis/${gap.id}`
        : "/api/cyber-maturity/gaps-analysis"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Gap analysis ${gap?.id ? "updated" : "created"} successfully`,
        })
        onSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save gap analysis",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving gap analysis:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {gap?.id ? "Edit Gap Analysis" : "Add Gap Analysis"}
        </DialogTitle>
        <DialogDescription>
          {gap?.id ? "Update the gap analysis details" : "Create a new gap analysis"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assessment_id">Assessment *</Label>
            <Select
              value={formData.assessment_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, assessment_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessments.map((assessment) => (
                  <SelectItem key={assessment.id} value={assessment.id.toString()}>
                    {assessment.assessment_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="control_id">Control *</Label>
            <Select
              value={formData.control_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, control_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select control" />
              </SelectTrigger>
              <SelectContent>
                {controls.map((control) => (
                  <SelectItem key={control.id} value={control.id.toString()}>
                    {control.control_id} - {control.control_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gap_description">Gap Description *</Label>
          <Textarea
            id="gap_description"
            value={formData.gap_description}
            onChange={(e) => setFormData({ ...formData, gap_description: e.target.value })}
            placeholder="Describe the identified gap"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="severity">Severity *</Label>
            <Select
              value={formData.severity}
              onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
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
          <Label htmlFor="estimated_effort">Estimated Effort</Label>
          <Input
            id="estimated_effort"
            value={formData.estimated_effort}
            onChange={(e) => setFormData({ ...formData, estimated_effort: e.target.value })}
            placeholder="e.g., 2 weeks, 3 months"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommended_actions">Recommended Actions</Label>
          <Textarea
            id="recommended_actions"
            value={formData.recommended_actions}
            onChange={(e) => setFormData({ ...formData, recommended_actions: e.target.value })}
            placeholder="Describe recommended actions to address the gap"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {gap?.id ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {gap?.id ? "Update" : "Create"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

// Remediation Tracking CRUD Component
export function RemediationTrackingForm({ remediation, gaps, onClose, onSuccess }: {
  remediation?: RemediationTracking | null
  gaps: any[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<RemediationTracking>({
    gap_id: 0,
    remediation_plan: "",
    assigned_to: "",
    due_date: "",
    status: "not_started",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (remediation) {
      setFormData(remediation)
    }
  }, [remediation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = remediation?.id ? "PUT" : "POST"
      const url = remediation?.id
        ? `/api/cyber-maturity/remediation-tracking/${remediation.id}`
        : "/api/cyber-maturity/remediation-tracking"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Remediation tracking ${remediation?.id ? "updated" : "created"} successfully`,
        })
        onSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save remediation tracking",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving remediation tracking:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'not_started': return 'text-gray-600 bg-gray-100'
      case 'on_hold': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {remediation?.id ? "Edit Remediation Tracking" : "Add Remediation Tracking"}
        </DialogTitle>
        <DialogDescription>
          {remediation?.id ? "Update the remediation tracking" : "Create new remediation tracking"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gap_id">Gap Analysis *</Label>
          <Select
            value={formData.gap_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, gap_id: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gap analysis" />
            </SelectTrigger>
            <SelectContent>
              {gaps.map((gap) => (
                <SelectItem key={gap.id} value={gap.id.toString()}>
                  {gap.gap_description.substring(0, 50)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remediation_plan">Remediation Plan *</Label>
          <Textarea
            id="remediation_plan"
            value={formData.remediation_plan}
            onChange={(e) => setFormData({ ...formData, remediation_plan: e.target.value })}
            placeholder="Describe the remediation plan"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assigned_to">Assigned To *</Label>
            <Input
              id="assigned_to"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              placeholder="Enter assignee name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date *</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.status === 'completed' && (
          <div className="space-y-2">
            <Label htmlFor="actual_completion_date">Actual Completion Date</Label>
            <Input
              id="actual_completion_date"
              type="date"
              value={formData.actual_completion_date}
              onChange={(e) => setFormData({ ...formData, actual_completion_date: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes and progress updates"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {remediation?.id ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {remediation?.id ? "Update" : "Create"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
