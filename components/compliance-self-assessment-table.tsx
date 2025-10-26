"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Save, Edit, Trash2, X, FileCheck, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import OwnerSelectInput from "@/components/owner-search-input"
import ControlSelectInput from "@/components/control-search-input"

interface ControlAssessmentForm extends Omit<ControlAssessment, 'existing_controls'> {
  existing_controls: string[]
}

interface ControlAssessment {
  id?: number
  compliance_assessment_id: number
  control_id: string
  control_name: string
  control_description: string
  control_category: string
  control_domain: string
  regulatory_reference: string
  control_objective: string
  implementation_status: string
  compliance_level: string
  evidence_collected: string
  assessment_method: string
  findings: string
  gap_description: string
  gap_severity: string
  risk_rating: string
  current_maturity_level: string
  target_maturity_level: string
  remediation_required: boolean
  remediation_priority: string
  control_owner: string
  assessor_notes: string
  assessed_date: string
  assessed_by: string
  existing_controls?: string
}

interface ComplianceSelfAssessmentTableProps {
  complianceAssessmentId: number
  onStatsUpdate: () => void
}

export default function ComplianceSelfAssessmentTable({
  complianceAssessmentId,
  onStatsUpdate,
}: ComplianceSelfAssessmentTableProps) {
  const [controls, setControls] = useState<ControlAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false)
  const [editingControl, setEditingControl] = useState<ControlAssessmentForm | null>(null)
  const [existingControlInput, setExistingControlInput] = useState("")
  const [editExistingControlInput, setEditExistingControlInput] = useState("")

  const [newControl, setNewControl] = useState<Partial<ControlAssessmentForm>>({
    compliance_assessment_id: complianceAssessmentId,
    control_id: "",
    control_name: "",
    control_description: "",
    control_category: "",
    control_domain: "",
    regulatory_reference: "",
    control_objective: "",
    implementation_status: "Not Assessed",
    compliance_level: "None",
    evidence_collected: "",
    assessment_method: "Document Review",
    findings: "",
    gap_description: "",
    gap_severity: "None",
    risk_rating: "Low",
    current_maturity_level: "Initial",
    target_maturity_level: "Managed",
    remediation_required: false,
    remediation_priority: "Medium",
    control_owner: "",
    assessor_notes: "",
    assessed_date: new Date().toISOString().split("T")[0],
    assessed_by: "",
    existing_controls: [],
  })

  // Bulk add state
  const [bulkControls, setBulkControls] = useState<Partial<ControlAssessment>[]>([
    {
      compliance_assessment_id: complianceAssessmentId,
      control_id: "",
      control_name: "",
      regulatory_reference: "",
      implementation_status: "Not Assessed",
      gap_severity: "None",
      remediation_required: false,
    },
  ])

  useEffect(() => {
    if (complianceAssessmentId) {
      fetchControls()
    }
  }, [complianceAssessmentId])

  // Helper function to parse existing_controls from string to array
  const parseExistingControls = (controlsString?: string): string[] => {
    if (!controlsString) return []
    try {
      // Try parsing as JSON array first
      return JSON.parse(controlsString)
    } catch {
      // If not JSON, split by comma
      return controlsString.split(',').map(c => c.trim()).filter(c => c)
    }
  }

  // Helper function to convert array to string for database
  const stringifyExistingControls = (controlsArray: string[]): string => {
    return JSON.stringify(controlsArray)
  }

  const fetchControls = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/compliance-control-assessments?compliance_assessment_id=${complianceAssessmentId}`
      )
      const result = await response.json()

      if (result.success) {
        setControls(result.data)
      } else {
        toast.error("Failed to load controls")
      }
    } catch (error) {
      console.error("Error fetching controls:", error)
      toast.error("Failed to load controls")
    } finally {
      setLoading(false)
    }
  }

  const handleAddControl = async () => {
    if (!newControl.control_id || !newControl.control_name) {
      toast.error("Control ID and Name are required")
      return
    }

    try {
      // Convert existing_controls array to string for database
      const controlData = {
        ...newControl,
        existing_controls: stringifyExistingControls(newControl.existing_controls || []),
        compliance_assessment_id: complianceAssessmentId,
      }

      const response = await fetch("/api/compliance-control-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(controlData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Control assessment added successfully!")
        setIsAddDialogOpen(false)
        fetchControls()
        onStatsUpdate()
        resetNewControl()
        setExistingControlInput("")
      } else {
        toast.error(result.error || "Failed to add control")
      }
    } catch (error) {
      console.error("Error adding control:", error)
      toast.error("Failed to add control")
    }
  }

  const handleBulkAdd = async () => {
    const validControls = bulkControls.filter(
      (c) => c.control_id && c.control_id.trim() !== "" && c.control_name && c.control_name.trim() !== ""
    )

    if (validControls.length === 0) {
      toast.error("Please add at least one valid control")
      return
    }

    try {
      const response = await fetch("/api/compliance-control-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          validControls.map((c) => ({
            ...c,
            compliance_assessment_id: complianceAssessmentId,
          }))
        ),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`${validControls.length} control(s) added successfully!`)
        setIsBulkAddOpen(false)
        fetchControls()
        onStatsUpdate()
        resetBulkControls()
      } else {
        toast.error(result.error || "Failed to add controls")
      }
    } catch (error) {
      console.error("Error adding controls:", error)
      toast.error("Failed to add controls")
    }
  }

  const handleUpdateControl = async () => {
    if (!editingControl || !editingControl.id) return

    try {
      // Convert existing_controls array to string for database
      const controlData = {
        ...editingControl,
        existing_controls: stringifyExistingControls(editingControl.existing_controls || []),
      }

      const response = await fetch(`/api/compliance-control-assessments/${editingControl.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(controlData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Control updated successfully!")
        setEditingControl(null)
        setEditExistingControlInput("")
        fetchControls()
        onStatsUpdate()
      } else {
        toast.error(result.error || "Failed to update control")
      }
    } catch (error) {
      console.error("Error updating control:", error)
      toast.error("Failed to update control")
    }
  }

  const handleDeleteControl = async (id: number) => {
    if (!confirm("Are you sure you want to delete this control assessment?")) return

    try {
      const response = await fetch(`/api/compliance-control-assessments/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Control deleted successfully")
        fetchControls()
        onStatsUpdate()
      } else {
        toast.error("Failed to delete control")
      }
    } catch (error) {
      console.error("Error deleting control:", error)
      toast.error("Failed to delete control")
    }
  }

  const resetNewControl = () => {
    setNewControl({
      compliance_assessment_id: complianceAssessmentId,
      control_id: "",
      control_name: "",
      control_description: "",
      control_category: "",
      control_domain: "",
      regulatory_reference: "",
      control_objective: "",
      implementation_status: "Not Assessed",
      compliance_level: "None",
      evidence_collected: "",
      assessment_method: "Document Review",
      findings: "",
      gap_description: "",
      gap_severity: "None",
      risk_rating: "Low",
      current_maturity_level: "Initial",
      target_maturity_level: "Managed",
      remediation_required: false,
      remediation_priority: "Medium",
      control_owner: "",
      assessor_notes: "",
      assessed_date: new Date().toISOString().split("T")[0],
      assessed_by: "",
      existing_controls: [],
    })
    setExistingControlInput("")
  }

  const resetBulkControls = () => {
    setBulkControls([
      {
        compliance_assessment_id: complianceAssessmentId,
        control_id: "",
        control_name: "",
        regulatory_reference: "",
        implementation_status: "Not Assessed",
        gap_severity: "None",
        remediation_required: false,
      },
    ])
  }

  const addBulkRow = () => {
    setBulkControls([
      ...bulkControls,
      {
        compliance_assessment_id: complianceAssessmentId,
        control_id: "",
        control_name: "",
        regulatory_reference: "",
        implementation_status: "Not Assessed",
        gap_severity: "None",
        remediation_required: false,
      },
    ])
  }

  const removeBulkRow = (index: number) => {
    if (bulkControls.length > 1) {
      setBulkControls(bulkControls.filter((_, i) => i !== index))
    }
  }

  const updateBulkControl = (index: number, field: string, value: any) => {
    const updated = [...bulkControls]
    updated[index] = { ...updated[index], [field]: value }
    setBulkControls(updated)
  }

  // Helper functions for managing existing controls
  const addExistingControl = (controlText: string) => {
    if (!newControl.existing_controls?.includes(controlText)) {
      setNewControl({
        ...newControl,
        existing_controls: [...(newControl.existing_controls || []), controlText]
      })
    }
  }

  const removeExistingControl = (index: number) => {
    const updated = [...(newControl.existing_controls || [])]
    updated.splice(index, 1)
    setNewControl({ ...newControl, existing_controls: updated })
  }

  const addEditExistingControl = (controlText: string) => {
    if (editingControl && !editingControl.existing_controls?.includes(controlText)) {
      setEditingControl({
        ...editingControl,
        existing_controls: [...(editingControl.existing_controls || []), controlText]
      })
    }
  }

  const removeEditExistingControl = (index: number) => {
    if (editingControl) {
      const updated = [...(editingControl.existing_controls || [])]
      updated.splice(index, 1)
      setEditingControl({ ...editingControl, existing_controls: updated })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800 border-green-200"
      case "Partially Compliant":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Non-Compliant":
        return "bg-red-100 text-red-800 border-red-200"
      case "Not Applicable":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Control Assessment</h2>
          <p className="text-muted-foreground">Evaluate and document compliance control implementation</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isBulkAddOpen} onOpenChange={setIsBulkAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Bulk Add Controls
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Bulk Add Control Assessments</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Control ID *</TableHead>
                        <TableHead>Control Name *</TableHead>
                        <TableHead>Regulatory Ref</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk Rating</TableHead>
                        <TableHead>Remediation</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkControls.map((control, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              value={control.control_id}
                              onChange={(e) => updateBulkControl(index, "control_id", e.target.value)}
                              placeholder="A.5.1"
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={control.control_name}
                              onChange={(e) => updateBulkControl(index, "control_name", e.target.value)}
                              placeholder="Control name"
                              className="min-w-[200px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={control.regulatory_reference}
                              onChange={(e) => updateBulkControl(index, "regulatory_reference", e.target.value)}
                              placeholder="ISO 27001:2022"
                              className="w-40"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={control.implementation_status}
                              onValueChange={(value) => updateBulkControl(index, "implementation_status", value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Compliant">Compliant</SelectItem>
                                <SelectItem value="Partially Compliant">Partially Compliant</SelectItem>
                                <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                <SelectItem value="Not Assessed">Not Assessed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={control.risk_rating}
                              onValueChange={(value) => updateBulkControl(index, "risk_rating", value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={control.remediation_required}
                              onCheckedChange={(checked) =>
                                updateBulkControl(index, "remediation_required", checked)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBulkRow(index)}
                              disabled={bulkControls.length <= 1}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={addBulkRow}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsBulkAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={handleBulkAdd}>
                      <Save className="h-4 w-4 mr-2" />
                      Save All Controls
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Control
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Control Assessment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="control_id">Control ID *</Label>
                    <Input
                      id="control_id"
                      value={newControl.control_id}
                      onChange={(e) => setNewControl({ ...newControl, control_id: e.target.value })}
                      placeholder="e.g., A.5.1, CC6.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regulatory_reference">Regulatory Reference</Label>
                    <Input
                      id="regulatory_reference"
                      value={newControl.regulatory_reference}
                      onChange={(e) =>
                        setNewControl({ ...newControl, regulatory_reference: e.target.value })
                      }
                      placeholder="e.g., ISO 27001:2022 A.5.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="control_name">Control Name *</Label>
                  <Input
                    id="control_name"
                    value={newControl.control_name}
                    onChange={(e) => setNewControl({ ...newControl, control_name: e.target.value })}
                    placeholder="Enter control name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="control_description">Control Description</Label>
                  <Textarea
                    id="control_description"
                    value={newControl.control_description}
                    onChange={(e) =>
                      setNewControl({ ...newControl, control_description: e.target.value })
                    }
                    placeholder="Describe the control requirements"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="control_category">Control Category</Label>
                    <Input
                      id="control_category"
                      value={newControl.control_category}
                      onChange={(e) =>
                        setNewControl({ ...newControl, control_category: e.target.value })
                      }
                      placeholder="e.g., Access Control, Data Protection"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="control_domain">Control Domain</Label>
                    <Input
                      id="control_domain"
                      value={newControl.control_domain}
                      onChange={(e) => setNewControl({ ...newControl, control_domain: e.target.value })}
                      placeholder="e.g., Technical, Administrative"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="control_objective">Control Objective</Label>
                  <Textarea
                    id="control_objective"
                    value={newControl.control_objective}
                    onChange={(e) =>
                      setNewControl({ ...newControl, control_objective: e.target.value })
                    }
                    placeholder="What is the objective of this control?"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="implementation_status">Implementation Status *</Label>
                    <Select
                      value={newControl.implementation_status}
                      onValueChange={(value) =>
                        setNewControl({ ...newControl, implementation_status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Compliant">Compliant</SelectItem>
                        <SelectItem value="Partially Compliant">Partially Compliant</SelectItem>
                        <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        <SelectItem value="Not Assessed">Not Assessed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compliance_level">Compliance Level</Label>
                    <Select
                      value={newControl.compliance_level}
                      onValueChange={(value) => setNewControl({ ...newControl, compliance_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full">Full</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assessment_method">Assessment Method</Label>
                    <Select
                      value={newControl.assessment_method}
                      onValueChange={(value) =>
                        setNewControl({ ...newControl, assessment_method: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Document Review">Document Review</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Observation">Observation</SelectItem>
                        <SelectItem value="Sampling">Sampling</SelectItem>
                        <SelectItem value="Walkthrough">Walkthrough</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_maturity_level">Current Maturity</Label>
                    <Select
                      value={newControl.current_maturity_level}
                      onValueChange={(value) =>
                        setNewControl({ ...newControl, current_maturity_level: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Initial">Initial</SelectItem>
                        <SelectItem value="Managed">Managed</SelectItem>
                        <SelectItem value="Defined">Defined</SelectItem>
                        <SelectItem value="Quantitatively Managed">Quantitatively Managed</SelectItem>
                        <SelectItem value="Optimizing">Optimizing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_maturity_level">Target Maturity</Label>
                    <Select
                      value={newControl.target_maturity_level}
                      onValueChange={(value) =>
                        setNewControl({ ...newControl, target_maturity_level: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Initial">Initial</SelectItem>
                        <SelectItem value="Managed">Managed</SelectItem>
                        <SelectItem value="Defined">Defined</SelectItem>
                        <SelectItem value="Quantitatively Managed">Quantitatively Managed</SelectItem>
                        <SelectItem value="Optimizing">Optimizing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk_rating">Risk Rating</Label>
                    <Select
                      value={newControl.risk_rating}
                      onValueChange={(value) => setNewControl({ ...newControl, risk_rating: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence_collected">Evidence Collected</Label>
                  <Textarea
                    id="evidence_collected"
                    value={newControl.evidence_collected}
                    onChange={(e) =>
                      setNewControl({ ...newControl, evidence_collected: e.target.value })
                    }
                    placeholder="Document evidence collected during assessment"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existing_controls">Existing Controls</Label>
                  <div className="space-y-2">
                    <ControlSelectInput
                      formData={{ controlSearch: existingControlInput }}
                      setFormData={(data) => setExistingControlInput(data.controlSearch || "")}
                      fieldName="controlSearch"
                      onControlSelected={(control) => {
                        const controlText = `${control.control_id} - ${control.name}`
                        addExistingControl(controlText)
                        setExistingControlInput("")
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Search and select controls from your governance controls database
                    </p>
                  </div>
                  {newControl.existing_controls && newControl.existing_controls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newControl.existing_controls.map((control, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                          {control}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-blue-900" 
                            onClick={() => removeExistingControl(index)} 
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="control_owner">Control Owner</Label>
                    <OwnerSelectInput
                      formData={newControl}
                      setFormData={setNewControl}
                      fieldName="control_owner"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assessed_by">Assessed By</Label>
                    <OwnerSelectInput
                      formData={newControl}
                      setFormData={setNewControl}
                      fieldName="assessed_by"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessed_date">Assessment Date</Label>
                  <Input
                    id="assessed_date"
                    type="date"
                    value={newControl.assessed_date}
                    onChange={(e) => setNewControl({ ...newControl, assessed_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessor_notes">Assessor Notes</Label>
                  <Textarea
                    id="assessor_notes"
                    value={newControl.assessor_notes}
                    onChange={(e) => setNewControl({ ...newControl, assessor_notes: e.target.value })}
                    placeholder="Additional notes from the assessor"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remediation_required"
                    checked={newControl.remediation_required}
                    onCheckedChange={(checked) =>
                      setNewControl({ ...newControl, remediation_required: checked as boolean })
                    }
                  />
                  <Label htmlFor="remediation_required" className="cursor-pointer">
                    Remediation Required
                  </Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={handleAddControl}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Control
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Controls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Control Assessments</CardTitle>
          <CardDescription>
            {controls.length} control(s) assessed for this compliance assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading controls...</div>
          ) : controls.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Controls Added</h3>
              <p className="text-muted-foreground mb-4">
                Add controls to begin the compliance assessment
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Control
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control ID</TableHead>
                    <TableHead>Control Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Implementation Status</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Maturity</TableHead>
                    <TableHead>Remediation</TableHead>
                    <TableHead>Existing Controls</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {controls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-mono text-xs">{control.control_id}</TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {control.control_name}
                      </TableCell>
                      <TableCell>{control.control_category || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(control.implementation_status)}>
                          {control.implementation_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{control.compliance_level}</Badge>
                      </TableCell>
                      <TableCell>
                        {control.gap_severity !== "None" ? (
                          <Badge className={getSeverityColor(control.gap_severity)}>
                            {control.gap_severity}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {control.current_maturity_level?.substring(0, 3)}
                      </TableCell>
                      <TableCell>
                        {control.remediation_required ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {control.existing_controls ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {parseExistingControls(control.existing_controls).slice(0, 2).map((ctrl, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {ctrl.length > 20 ? ctrl.substring(0, 20) + '...' : ctrl}
                              </Badge>
                            ))}
                            {parseExistingControls(control.existing_controls).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{parseExistingControls(control.existing_controls).length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{control.control_owner || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Parse existing_controls from string to array for editing
                              setEditingControl({
                                ...control,
                                existing_controls: parseExistingControls(control.existing_controls)
                              })
                              setEditExistingControlInput("")
                            }}
                            title="Edit control"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => control.id && handleDeleteControl(control.id)}
                            title="Delete control"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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
      <Dialog open={!!editingControl} onOpenChange={(open) => !open && setEditingControl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Control Assessment</DialogTitle>
          </DialogHeader>
          {editingControl && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Control ID</Label>
                  <Input value={editingControl.control_id} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_regulatory_reference">Regulatory Reference</Label>
                  <Input
                    id="edit_regulatory_reference"
                    value={editingControl.regulatory_reference}
                    onChange={(e) =>
                      setEditingControl({ ...editingControl, regulatory_reference: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_control_name">Control Name</Label>
                <Input
                  id="edit_control_name"
                  value={editingControl.control_name}
                  onChange={(e) =>
                    setEditingControl({ ...editingControl, control_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_control_description">Control Description</Label>
                <Textarea
                  id="edit_control_description"
                  value={editingControl.control_description}
                  onChange={(e) =>
                    setEditingControl({ ...editingControl, control_description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_implementation_status">Implementation Status</Label>
                  <Select
                    value={editingControl.implementation_status}
                    onValueChange={(value) =>
                      setEditingControl({ ...editingControl, implementation_status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compliant">Compliant</SelectItem>
                      <SelectItem value="Partially Compliant">Partially Compliant</SelectItem>
                      <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                      <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      <SelectItem value="Not Assessed">Not Assessed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_gap_severity">Risk Rating</Label>
                  <Select
                    value={editingControl.risk_rating}
                    onValueChange={(value) => setEditingControl({ ...editingControl, risk_rating: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_risk_rating">Risk Rating</Label>
                  <Select
                    value={editingControl.risk_rating}
                    onValueChange={(value) =>
                      setEditingControl({ ...editingControl, risk_rating: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

           

              <div className="space-y-2">
                <Label htmlFor="edit_existing_controls">Existing Controls</Label>
                <div className="space-y-2">
                  <ControlSelectInput
                    formData={{ controlSearch: editExistingControlInput }}
                    setFormData={(data) => setEditExistingControlInput(data.controlSearch || "")}
                    fieldName="controlSearch"
                    onControlSelected={(control) => {
                      const controlText = `${control.control_id} - ${control.name}`
                      addEditExistingControl(controlText)
                      setEditExistingControlInput("")
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Search and select controls from your governance controls database
                  </p>
                </div>
                {editingControl.existing_controls && editingControl.existing_controls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingControl.existing_controls.map((control, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                        {control}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-blue-900" 
                          onClick={() => removeEditExistingControl(index)} 
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_control_owner">Control Owner</Label>
                  <OwnerSelectInput
                    formData={editingControl}
                    setFormData={setEditingControl}
                    fieldName="control_owner"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_assessed_by">Assessed By</Label>
                  <OwnerSelectInput
                    formData={editingControl}
                    setFormData={setEditingControl}
                    fieldName="assessed_by"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_remediation_required"
                  checked={editingControl.remediation_required}
                  onCheckedChange={(checked) =>
                    setEditingControl({ ...editingControl, remediation_required: checked as boolean })
                  }
                />
                <Label htmlFor="edit_remediation_required" className="cursor-pointer">
                  Remediation Required
                </Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingControl(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateControl}>
                  <Save className="h-4 w-4 mr-2" />
                  Update Control
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

