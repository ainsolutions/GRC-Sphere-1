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
import { Progress } from "@/components/ui/progress"
import { Plus, Save, Edit, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import OwnerSelectInput from "@/components/owner-search-input"
import DepartmentSelectInput from "@/components/department-search-input"

interface SWIFTRemediationTrackerProps {
  assessmentId: number
}

export function SWIFTRemediationTracker({ assessmentId }: SWIFTRemediationTrackerProps) {
  const [gaps, setGaps] = useState<any[]>([])
  const [controls, setControls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGap, setEditingGap] = useState<any>(null)

  const [newGap, setNewGap] = useState({
    swift_assessment_id: assessmentId,
    swift_control_id: 0,
    gap_title: "",
    gap_description: "",
    gap_severity: "Medium",
    remediation_action: "",
    remediation_owner: "",
    remediation_department: "",
    assigned_to: "",
    remediation_status: "Open",
    priority: "Medium",
    due_date: "",
    progress_percentage: 0,
  })

  useEffect(() => {
    fetchGaps()
    fetchControls()
  }, [assessmentId])

  const fetchGaps = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/swift-gap-remediation?swift_assessment_id=${assessmentId}`)
      const result = await response.json()

      if (result.success) {
        setGaps(result.data)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchControls = async () => {
    try {
      const response = await fetch(`/api/swift-control-assessments?swift_assessment_id=${assessmentId}`)
      const result = await response.json()

      if (result.success) {
        const controlsWithGaps = result.data.filter((c: any) => c.remediation_required || c.gap_identified)
        setControls(controlsWithGaps)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleAddGap = async () => {
    if (!newGap.gap_title || newGap.swift_control_id === 0) {
      toast.error("Gap title and control selection are required")
      return
    }

    try {
      const response = await fetch("/api/swift-gap-remediation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newGap, swift_assessment_id: assessmentId }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Gap added successfully!")
        setIsAddDialogOpen(false)
        fetchGaps()
        resetForm()
      } else {
        toast.error(result.error || "Failed to add gap")
      }
    } catch (error) {
      toast.error("Failed to add gap")
    }
  }

  const handleUpdateGap = async () => {
    if (!editingGap?.id) return

    try {
      const response = await fetch(`/api/swift-gap-remediation/${editingGap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGap),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Gap updated successfully!")
        setEditingGap(null)
        fetchGaps()
      } else {
        toast.error(result.error || "Failed to update gap")
      }
    } catch (error) {
      toast.error("Failed to update gap")
    }
  }

  const handleDeleteGap = async (id: number) => {
    if (!confirm("Delete this gap?")) return

    try {
      const response = await fetch(`/api/swift-gap-remediation/${id}`, { method: "DELETE" })
      const result = await response.json()

      if (result.success) {
        toast.success("Gap deleted successfully")
        fetchGaps()
      }
    } catch (error) {
      toast.error("Failed to delete gap")
    }
  }

  const resetForm = () => {
    setNewGap({
      swift_assessment_id: assessmentId,
      swift_control_id: 0,
      gap_title: "",
      gap_description: "",
      gap_severity: "Medium",
      remediation_action: "",
      remediation_owner: "",
      remediation_department: "",
      assigned_to: "",
      remediation_status: "Open",
      priority: "Medium",
      due_date: "",
      progress_percentage: 0,
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-600 text-white"
      case "High": return "bg-orange-500 text-white"
      case "Medium": return "bg-yellow-500 text-white"
      case "Low": return "bg-green-500 text-white"
      default: return "bg-gray-400 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Closed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Open":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SWIFT Gap Remediation</h2>
          <p className="text-muted-foreground">Track and resolve SWIFT CSP compliance gaps</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={controls.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Gap
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Gap Remediation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Associated Control *</Label>
                <Select
                  value={newGap.swift_control_id.toString()}
                  onValueChange={(value) => setNewGap({ ...newGap, swift_control_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select control" />
                  </SelectTrigger>
                  <SelectContent>
                    {controls.map((control) => (
                      <SelectItem key={control.id} value={control.id.toString()}>
                        {control.control_id} - {control.control_objective}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gap Title *</Label>
                <Input
                  value={newGap.gap_title}
                  onChange={(e) => setNewGap({ ...newGap, gap_title: e.target.value })}
                  placeholder="Brief description of the gap"
                />
              </div>

              <div className="space-y-2">
                <Label>Gap Description</Label>
                <Textarea
                  value={newGap.gap_description}
                  onChange={(e) => setNewGap({ ...newGap, gap_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={newGap.gap_severity}
                    onValueChange={(value) => setNewGap({ ...newGap, gap_severity: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newGap.priority}
                    onValueChange={(value) => setNewGap({ ...newGap, priority: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Label>Remediation Action</Label>
                <Textarea
                  value={newGap.remediation_action}
                  onChange={(e) => setNewGap({ ...newGap, remediation_action: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Remediation Owner</Label>
                  <OwnerSelectInput
                    formData={newGap}
                    setFormData={setNewGap}
                    fieldName="remediation_owner"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Remediation Department</Label>
                  <DepartmentSelectInput
                    formData={newGap}
                    setFormData={setNewGap}
                    fieldName="remediation_department"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGap} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Gap
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SWIFT Gap Remediation Tracker</CardTitle>
          <CardDescription>{gaps.length} gap(s) identified</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading gaps...</div>
          ) : gaps.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Gaps Identified</h3>
              <p className="text-muted-foreground">
                {controls.length === 0
                  ? "Add controls in Self Assessment tab first"
                  : "Add gaps to track remediation"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gap ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gaps.map((gap) => (
                  <TableRow key={gap.id}>
                    <TableCell className="font-mono text-xs">{gap.gap_id}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{gap.gap_title}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(gap.gap_severity)}>{gap.gap_severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(gap.remediation_status)}>{gap.remediation_status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{gap.remediation_owner || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={gap.progress_percentage} className="w-16" />
                        <span className="text-xs">{gap.progress_percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {gap.due_date ? new Date(gap.due_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingGap(gap)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteGap(gap.id)}>
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

      {/* Edit Gap Dialog */}
      <Dialog open={!!editingGap} onOpenChange={(open) => !open && setEditingGap(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gap Remediation</DialogTitle>
          </DialogHeader>
          {editingGap && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gap ID</Label>
                <Input value={editingGap.gap_id} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Gap Title</Label>
                <Input
                  value={editingGap.gap_title}
                  onChange={(e) => setEditingGap({ ...editingGap, gap_title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={editingGap.gap_severity}
                    onValueChange={(value) => setEditingGap({ ...editingGap, gap_severity: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingGap.remediation_status}
                    onValueChange={(value) => setEditingGap({ ...editingGap, remediation_status: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Progress %</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editingGap.progress_percentage}
                    onChange={(e) => setEditingGap({ ...editingGap, progress_percentage: parseInt(e.target.value) || 0 })}
                  />
                  <Progress value={editingGap.progress_percentage} className="w-20" />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingGap(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateGap} variant="outline">
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

