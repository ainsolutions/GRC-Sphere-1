"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Edit,
  Trash2,
  CalendarIcon,
  FileText,
  TrendingUp,
  Target,
} from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

interface ControlAssessment {
  id: string
  controlId: string
  controlName: string
  controlType: "preventive" | "detective" | "corrective" | "compensating"
  implementationStatus: "implemented" | "partially_implemented" | "not_implemented" | "planned"
  effectivenessRating: number // 1-5 scale
  testingStatus: "passed" | "failed" | "not_tested" | "in_progress"
  lastTestDate?: Date
  nextTestDate?: Date
  testingFrequency: "monthly" | "quarterly" | "semi_annual" | "annual"
  controlOwner: string
  evidence: string
  gaps: string
  recommendations: string
  riskMitigation: number // 1-5 scale
  complianceFrameworks: string[]
  createdAt: Date
  updatedAt: Date
}

interface ControlAssessmentModuleProps {
  riskId: string
  currentAssessment?: string
  onAssessmentUpdate: (assessment: string) => void
  readOnly?: boolean
}

const controlTypes = [
  { value: "preventive", label: "Preventive", icon: Shield, color: "bg-blue-100 text-blue-800" },
  { value: "detective", label: "Detective", icon: Target, color: "bg-yellow-100 text-yellow-800" },
  { value: "corrective", label: "Corrective", icon: TrendingUp, color: "bg-green-100 text-green-800" },
  { value: "compensating", label: "Compensating", icon: FileText, color: "bg-purple-100 text-purple-800" },
]

const implementationStatuses = [
  { value: "implemented", label: "Implemented", color: "bg-green-100 text-green-800" },
  { value: "partially_implemented", label: "Partially Implemented", color: "bg-yellow-100 text-yellow-800" },
  { value: "not_implemented", label: "Not Implemented", color: "bg-red-100 text-red-800" },
  { value: "planned", label: "Planned", color: "bg-blue-100 text-blue-800" },
]

const testingStatuses = [
  { value: "passed", label: "Passed", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", icon: XCircle, color: "bg-red-100 text-red-800" },
  { value: "not_tested", label: "Not Tested", icon: Clock, color: "bg-gray-100 text-gray-800" },
  { value: "in_progress", label: "In Progress", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800" },
]

const complianceFrameworks = ["ISO 27001", "NIST CSF", "SOC 2", "PCI DSS", "HIPAA", "GDPR", "SOX", "COBIT"]

export function ControlAssessmentModule({
  riskId,
  currentAssessment,
  onAssessmentUpdate,
  readOnly = false,
}: ControlAssessmentModuleProps) {
  const [controls, setControls] = useState<ControlAssessment[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingControl, setEditingControl] = useState<ControlAssessment | null>(null)
  const [newControl, setNewControl] = useState<Partial<ControlAssessment>>({
    controlType: "preventive",
    implementationStatus: "not_implemented",
    effectivenessRating: 1,
    testingStatus: "not_tested",
    testingFrequency: "quarterly",
    riskMitigation: 1,
    complianceFrameworks: [],
  })

  // Parse existing assessment data
  useEffect(() => {
    if (currentAssessment && currentAssessment.trim() !== "") {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(currentAssessment)
        if (Array.isArray(parsed)) {
          setControls(
            parsed.map((control) => ({
              ...control,
              lastTestDate: control.lastTestDate ? new Date(control.lastTestDate) : undefined,
              nextTestDate: control.nextTestDate ? new Date(control.nextTestDate) : undefined,
              createdAt: new Date(control.createdAt),
              updatedAt: new Date(control.updatedAt),
            })),
          )
        } else {
          // If it's not an array, reset to empty
          setControls([])
        }
      } catch (error) {
        console.log("Control assessment contains plain text, creating default control entry")
        const defaultControl: ControlAssessment = {
          id: `ctrl_${Date.now()}`,
          controlId: "CTRL-001",
          controlName: "Legacy Control Assessment",
          controlType: "preventive",
          implementationStatus: "not_implemented",
          effectivenessRating: 1,
          testingStatus: "not_tested",
          testingFrequency: "quarterly",
          controlOwner: "System",
          evidence: currentAssessment, // Store the plain text as evidence
          gaps: "",
          recommendations: "Migrate to structured control assessment format",
          riskMitigation: 1,
          complianceFrameworks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setControls([defaultControl])
      }
    } else {
      setControls([])
    }
  }, [currentAssessment])

  const updateAssessment = useCallback(() => {
    if (controls.length > 0) {
      const assessmentData = JSON.stringify(
        controls.map((control) => ({
          ...control,
          lastTestDate: control.lastTestDate?.toISOString(),
          nextTestDate: control.nextTestDate?.toISOString(),
          createdAt: control.createdAt.toISOString(),
          updatedAt: control.updatedAt.toISOString(),
        })),
      )
      onAssessmentUpdate(assessmentData)
    }
  }, [controls, onAssessmentUpdate])

  const addControl = () => {
    if (!newControl.controlName || !newControl.controlOwner) return

    const control: ControlAssessment = {
      id: `ctrl_${Date.now()}`,
      controlId: `CTRL-${String(controls.length + 1).padStart(3, "0")}`,
      controlName: newControl.controlName!,
      controlType: newControl.controlType as any,
      implementationStatus: newControl.implementationStatus as any,
      effectivenessRating: newControl.effectivenessRating!,
      testingStatus: newControl.testingStatus as any,
      lastTestDate: newControl.lastTestDate,
      nextTestDate: newControl.nextTestDate,
      testingFrequency: newControl.testingFrequency as any,
      controlOwner: newControl.controlOwner!,
      evidence: newControl.evidence || "",
      gaps: newControl.gaps || "",
      recommendations: newControl.recommendations || "",
      riskMitigation: newControl.riskMitigation!,
      complianceFrameworks: newControl.complianceFrameworks || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedControls = [...controls, control]
    setControls(updatedControls)

    setTimeout(() => {
      const assessmentData = JSON.stringify(
        updatedControls.map((control) => ({
          ...control,
          lastTestDate: control.lastTestDate?.toISOString(),
          nextTestDate: control.nextTestDate?.toISOString(),
          createdAt: control.createdAt.toISOString(),
          updatedAt: control.updatedAt.toISOString(),
        })),
      )
      onAssessmentUpdate(assessmentData)
    }, 0)

    setNewControl({
      controlType: "preventive",
      implementationStatus: "not_implemented",
      effectivenessRating: 1,
      testingStatus: "not_tested",
      testingFrequency: "quarterly",
      riskMitigation: 1,
      complianceFrameworks: [],
    })
    setShowAddDialog(false)
  }

  const updateControl = (updatedControl: ControlAssessment) => {
    const updatedControls = controls.map((control) =>
      control.id === updatedControl.id ? { ...updatedControl, updatedAt: new Date() } : control,
    )
    setControls(updatedControls)

    setTimeout(() => {
      const assessmentData = JSON.stringify(
        updatedControls.map((control) => ({
          ...control,
          lastTestDate: control.lastTestDate?.toISOString(),
          nextTestDate: control.nextTestDate?.toISOString(),
          createdAt: control.createdAt.toISOString(),
          updatedAt: control.updatedAt.toISOString(),
        })),
      )
      onAssessmentUpdate(assessmentData)
    }, 0)

    setEditingControl(null)
  }

  const deleteControl = (controlId: string) => {
    const updatedControls = controls.filter((control) => control.id !== controlId)
    setControls(updatedControls)

    setTimeout(() => {
      if (updatedControls.length > 0) {
        const assessmentData = JSON.stringify(
          updatedControls.map((control) => ({
            ...control,
            lastTestDate: control.lastTestDate?.toISOString(),
            nextTestDate: control.nextTestDate?.toISOString(),
            createdAt: control.createdAt.toISOString(),
            updatedAt: control.updatedAt.toISOString(),
          })),
        )
        onAssessmentUpdate(assessmentData)
      } else {
        onAssessmentUpdate("")
      }
    }, 0)
  }

  const getOverallEffectiveness = () => {
    if (controls.length === 0) return 0
    const total = controls.reduce((sum, control) => sum + control.effectivenessRating, 0)
    return Math.round((total / controls.length) * 20) // Convert to percentage
  }

  const getImplementationProgress = () => {
    if (controls.length === 0) return 0
    const implemented = controls.filter((c) => c.implementationStatus === "implemented").length
    const partial = controls.filter((c) => c.implementationStatus === "partially_implemented").length
    return Math.round(((implemented + partial * 0.5) / controls.length) * 100)
  }

  const getTestingCompliance = () => {
    if (controls.length === 0) return 0
    const tested = controls.filter((c) => c.testingStatus === "passed").length
    return Math.round((tested / controls.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Controls</p>
                <p className="text-2xl font-bold">{controls.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Effectiveness</p>
                <p className="text-2xl font-bold">{getOverallEffectiveness()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Implementation</p>
                <p className="text-2xl font-bold">{getImplementationProgress()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Testing Compliance</p>
                <p className="text-2xl font-bold">{getTestingCompliance()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Control Assessment Details</CardTitle>
              <CardDescription>Manage and assess individual controls for this technology risk</CardDescription>
            </div>
            {!readOnly && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <ActionButtons isTableAction={false} onAdd={() => {}} btnAddText="Add Control"/>
                  {/* <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Control
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Control</DialogTitle>
                    <DialogDescription>Define a new control for this technology risk assessment</DialogDescription>
                  </DialogHeader>
                  <ControlForm
                    control={newControl}
                    onChange={setNewControl}
                    onSave={addControl}
                    onCancel={() => setShowAddDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {controls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No controls defined yet</p>
              {!readOnly && <p className="text-sm">Click "Add Control" to get started</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Effectiveness</TableHead>
                    <TableHead>Testing</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {controls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{control.controlName}</p>
                          <p className="text-sm text-gray-500">{control.controlId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={controlTypes.find((t) => t.value === control.controlType)?.color}>
                          {controlTypes.find((t) => t.value === control.controlType)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            implementationStatuses.find((s) => s.value === control.implementationStatus)?.color
                          }
                        >
                          {implementationStatuses.find((s) => s.value === control.implementationStatus)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={control.effectivenessRating * 20} className="w-16" />
                          <span className="text-sm">{control.effectivenessRating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {React.createElement(
                            testingStatuses.find((s) => s.value === control.testingStatus)?.icon || Clock,
                            { className: "h-4 w-4" },
                          )}
                          <Badge className={testingStatuses.find((s) => s.value === control.testingStatus)?.color}>
                            {testingStatuses.find((s) => s.value === control.testingStatus)?.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{control.controlOwner}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {!readOnly && (
                            <>
                              <ActionButtons isTableAction={true} 
                                  //onView={() => {}} 
                                  onEdit={() => setEditingControl(control)} 
                                  onDelete={() => deleteControl(control.id)}   
                                  deleteDialogTitle={control.controlName}     
                                actionObj={control}                           
                                  />
                              {/* <Button variant="ghost" size="sm" onClick={() => setEditingControl(control)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteControl(control.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button> */}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Control Dialog */}
      {editingControl && (
        <Dialog open={!!editingControl} onOpenChange={() => setEditingControl(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Control</DialogTitle>
              <DialogDescription>Update control assessment details</DialogDescription>
            </DialogHeader>
            <ControlForm
              control={editingControl}
              onChange={setEditingControl}
              onSave={() => updateControl(editingControl)}
              onCancel={() => setEditingControl(null)}
              isEditing
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface ControlFormProps {
  control: Partial<ControlAssessment>
  onChange: (control: Partial<ControlAssessment>) => void
  onSave: () => void
  onCancel: () => void
  isEditing?: boolean
}

function ControlForm({ control, onChange, onSave, onCancel, isEditing = false }: ControlFormProps) {
  const [lastTestDate, setLastTestDate] = useState<Date | undefined>(control.lastTestDate)
  const [nextTestDate, setNextTestDate] = useState<Date | undefined>(control.nextTestDate)

  const handleSave = () => {
    onChange({
      ...control,
      lastTestDate,
      nextTestDate,
    })
    onSave()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="controlName">Control Name *</Label>
          <Input
            id="controlName"
            value={control.controlName || ""}
            onChange={(e) => onChange({ ...control, controlName: e.target.value })}
            placeholder="Enter control name"
          />
        </div>
        <div>
          <Label htmlFor="controlOwner">Control Owner *</Label>
          <Input
            id="controlOwner"
            value={control.controlOwner || ""}
            onChange={(e) => onChange({ ...control, controlOwner: e.target.value })}
            placeholder="Enter control owner"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="controlType">Control Type</Label>
          <Select
            value={control.controlType}
            onValueChange={(value) => onChange({ ...control, controlType: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {controlTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="implementationStatus">Implementation Status</Label>
          <Select
            value={control.implementationStatus}
            onValueChange={(value) => onChange({ ...control, implementationStatus: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {implementationStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="effectivenessRating">Effectiveness Rating (1-5)</Label>
          <Select
            value={control.effectivenessRating?.toString()}
            onValueChange={(value) => onChange({ ...control, effectivenessRating: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} -{" "}
                  {rating === 1
                    ? "Poor"
                    : rating === 2
                      ? "Fair"
                      : rating === 3
                        ? "Good"
                        : rating === 4
                          ? "Very Good"
                          : "Excellent"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="testingStatus">Testing Status</Label>
          <Select
            value={control.testingStatus}
            onValueChange={(value) => onChange({ ...control, testingStatus: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {testingStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="riskMitigation">Risk Mitigation (1-5)</Label>
          <Select
            value={control.riskMitigation?.toString()}
            onValueChange={(value) => onChange({ ...control, riskMitigation: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} -{" "}
                  {rating === 1
                    ? "Minimal"
                    : rating === 2
                      ? "Low"
                      : rating === 3
                        ? "Moderate"
                        : rating === 4
                          ? "High"
                          : "Very High"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="testingFrequency">Testing Frequency</Label>
          <Select
            value={control.testingFrequency}
            onValueChange={(value) => onChange({ ...control, testingFrequency: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="semi_annual">Semi-Annual</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Last Test Date</Label>
          <Input
            id="last_test_date"
            type="date"
            value={lastTestDate}
            onChange={(e) => setLastTestDate(e.target.value)}
          />

          
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {lastTestDate ? format(lastTestDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={lastTestDate} onSelect={setLastTestDate} initialFocus />
            </PopoverContent>
          </Popover> */}
        </div>
        <div>
          <Label>Next Test Date</Label>
          <Input
            id="next_test_date"
            type="date"
            value={nextTestDate}
            onChange={(e) => setNextTestDate(e.target.value)}
          />


          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {nextTestDate ? format(nextTestDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={nextTestDate} onSelect={setNextTestDate} initialFocus />
            </PopoverContent>
          </Popover> */}
        </div>
      </div>

      <div>
        <Label htmlFor="evidence">Evidence</Label>
        <Textarea
          id="evidence"
          value={control.evidence || ""}
          onChange={(e) => onChange({ ...control, evidence: e.target.value })}
          placeholder="Describe evidence of control implementation and effectiveness"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="gaps">Identified Gaps</Label>
        <Textarea
          id="gaps"
          value={control.gaps || ""}
          onChange={(e) => onChange({ ...control, gaps: e.target.value })}
          placeholder="Describe any gaps or weaknesses identified"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="recommendations">Recommendations</Label>
        <Textarea
          id="recommendations"
          value={control.recommendations || ""}
          onChange={(e) => onChange({ ...control, recommendations: e.target.value })}
          placeholder="Provide recommendations for improvement"
          rows={2}
        />
      </div>

      <div>
        <Label>Compliance Frameworks</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {complianceFrameworks.map((framework) => (
            <label key={framework} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={control.complianceFrameworks?.includes(framework) || false}
                onChange={(e) => {
                  const frameworks = control.complianceFrameworks || []
                  if (e.target.checked) {
                    onChange({ ...control, complianceFrameworks: [...frameworks, framework] })
                  } else {
                    onChange({ ...control, complianceFrameworks: frameworks.filter((f) => f !== framework) })
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">{framework}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!control.controlName || !control.controlOwner}>
          {isEditing ? "Update Control" : "Add Control"}
        </Button>
      </div>
    </div>
  )
}
