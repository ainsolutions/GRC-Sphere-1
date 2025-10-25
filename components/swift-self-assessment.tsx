"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Save, Edit, Trash2, FileCheck } from "lucide-react"
import { toast } from "sonner"
import OwnerSelectInput from "@/components/owner-search-input"

interface SWIFTSelfAssessmentProps {
  assessmentId: number
}

export function SWIFTSelfAssessment({ assessmentId }: SWIFTSelfAssessmentProps) {
  const [controls, setControls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingControl, setEditingControl] = useState<any>(null)

  const [newControl, setNewControl] = useState({
    swift_assessment_id: assessmentId,
    control_id: "",
    control_objective: "",
    control_description: "",
    control_category: "Architecture Security",
    control_type: "Mandatory",
    implementation_status: "Not Assessed",
    compliance_level: "None",
    maturity_level: "Initial",
    effectiveness_rating: "Not Tested",
    evidence_collected: "",
    testing_method: "Document Review",
    gap_identified: false,
    gap_description: "",
    gap_severity: "Low",
    remediation_required: false,
    control_owner: "",
    assessed_by: "",
    assessed_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchControls()
  }, [assessmentId])

  const fetchControls = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/swift-control-assessments?swift_assessment_id=${assessmentId}`)
      const result = await response.json()

      if (result.success) {
        setControls(result.data)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddControl = async () => {
    if (!newControl.control_id || !newControl.control_objective) {
      toast.error("Control ID and Objective are required")
      return
    }

    try {
      const response = await fetch("/api/swift-control-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newControl, swift_assessment_id: assessmentId }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Control added successfully!")
        setIsAddDialogOpen(false)
        fetchControls()
        resetForm()
      } else {
        toast.error(result.error || "Failed to add control")
      }
    } catch (error) {
      toast.error("Failed to add control")
    }
  }

  const handleUpdateControl = async () => {
    if (!editingControl?.id) return

    try {
      const response = await fetch(`/api/swift-control-assessments/${editingControl.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingControl),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Control updated successfully!")
        setEditingControl(null)
        fetchControls()
      } else {
        toast.error(result.error || "Failed to update control")
      }
    } catch (error) {
      toast.error("Failed to update control")
    }
  }

  const handleDeleteControl = async (id: number) => {
    if (!confirm("Delete this control assessment?")) return

    try {
      const response = await fetch(`/api/swift-control-assessments/${id}`, { method: "DELETE" })
      const result = await response.json()

      if (result.success) {
        toast.success("Control deleted successfully")
        fetchControls()
      }
    } catch (error) {
      toast.error("Failed to delete control")
    }
  }

  const resetForm = () => {
    setNewControl({
      swift_assessment_id: assessmentId,
      control_id: "",
      control_objective: "",
      control_description: "",
      control_category: "Architecture Security",
      control_type: "Mandatory",
      implementation_status: "Not Assessed",
      compliance_level: "None",
      maturity_level: "Initial",
      effectiveness_rating: "Not Tested",
      evidence_collected: "",
      testing_method: "Document Review",
      gap_identified: false,
      gap_description: "",
      gap_severity: "Low",
      remediation_required: false,
      control_owner: "",
      assessed_by: "",
      assessed_date: new Date().toISOString().split("T")[0],
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800"
      case "Partially Compliant":
        return "bg-yellow-100 text-yellow-800"
      case "Non-Compliant":
        return "bg-red-100 text-red-800"
      case "Not Applicable":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SWIFT CSP Control Assessment</h2>
          <p className="text-muted-foreground">Evaluate SWIFT Customer Security Programme controls</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Control
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add SWIFT Control Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Control ID *</Label>
                  <Input
                    value={newControl.control_id}
                    onChange={(e) => setNewControl({ ...newControl, control_id: e.target.value })}
                    placeholder="e.g., 1.1, 2.3A"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Control Type</Label>
                  <Select
                    value={newControl.control_type}
                    onValueChange={(value) => setNewControl({ ...newControl, control_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mandatory">Mandatory</SelectItem>
                      <SelectItem value="Advisory">Advisory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Control Objective *</Label>
                <Input
                  value={newControl.control_objective}
                  onChange={(e) => setNewControl({ ...newControl, control_objective: e.target.value })}
                  placeholder="Control objective"
                />
              </div>

              <div className="space-y-2">
                <Label>Control Description</Label>
                <Textarea
                  value={newControl.control_description}
                  onChange={(e) => setNewControl({ ...newControl, control_description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newControl.control_category}
                    onValueChange={(value) => setNewControl({ ...newControl, control_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Architecture Security">Architecture Security</SelectItem>
                      <SelectItem value="Access Control">Access Control</SelectItem>
                      <SelectItem value="Operational Security">Operational Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Implementation Status</Label>
                  <Select
                    value={newControl.implementation_status}
                    onValueChange={(value) => setNewControl({ ...newControl, implementation_status: value })}
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
              </div>

              <div className="space-y-2">
                <Label>Evidence Collected</Label>
                <Textarea
                  value={newControl.evidence_collected}
                  onChange={(e) => setNewControl({ ...newControl, evidence_collected: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Control Owner</Label>
                  <OwnerSelectInput
                    formData={newControl}
                    setFormData={setNewControl}
                    fieldName="control_owner"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assessed By</Label>
                  <OwnerSelectInput
                    formData={newControl}
                    setFormData={setNewControl}
                    fieldName="assessed_by"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newControl.remediation_required}
                  onCheckedChange={(checked) => setNewControl({ ...newControl, remediation_required: checked as boolean })}
                />
                <Label>Remediation Required</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddControl} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Control
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SWIFT CSP Controls</CardTitle>
          <CardDescription>{controls.length} control(s) assessed</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading controls...</div>
          ) : controls.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Controls Added</h3>
              <p className="text-muted-foreground mb-4">
                Add SWIFT CSP controls to begin the assessment
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Control
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Control ID</TableHead>
                  <TableHead>Objective</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Remediation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell className="font-mono">{control.control_id}</TableCell>
                    <TableCell className="max-w-xs truncate">{control.control_objective}</TableCell>
                    <TableCell>{control.control_category}</TableCell>
                    <TableCell>
                      <Badge variant={control.control_type === "Mandatory" ? "default" : "secondary"}>
                        {control.control_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(control.implementation_status)}>
                        {control.implementation_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{control.compliance_level}</TableCell>
                    <TableCell>
                      {control.remediation_required ? (
                        <Badge variant="destructive">Required</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingControl(control)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteControl(control.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog - similar structure to add dialog */}
      <Dialog open={!!editingControl} onOpenChange={(open) => !open && setEditingControl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Control Assessment</DialogTitle>
          </DialogHeader>
          {editingControl && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Control ID</Label>
                <Input value={editingControl.control_id} disabled className="bg-muted" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Implementation Status</Label>
                  <Select
                    value={editingControl.implementation_status}
                    onValueChange={(value) => setEditingControl({ ...editingControl, implementation_status: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compliant">Compliant</SelectItem>
                      <SelectItem value="Partially Compliant">Partially Compliant</SelectItem>
                      <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                      <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Compliance Level</Label>
                  <Select
                    value={editingControl.compliance_level}
                    onValueChange={(value) => setEditingControl({ ...editingControl, compliance_level: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Full</SelectItem>
                      <SelectItem value="Substantial">Substantial</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Evidence Collected</Label>
                <Textarea
                  value={editingControl.evidence_collected}
                  onChange={(e) => setEditingControl({ ...editingControl, evidence_collected: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={editingControl.remediation_required}
                  onCheckedChange={(checked) =>
                    setEditingControl({ ...editingControl, remediation_required: checked as boolean })
                  }
                />
                <Label>Remediation Required</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingControl(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateControl} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

