"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import AssetSelectInput from "@/components/asset-search-input"
import OwnerSelectInput from "@/components/owner-search-input"
import {
    Plus,
    Edit,
    Trash2,
    FileText,
    Target,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    Download,
    Shield,
    RefreshCw,
    Status,
    Clock,
    AlertCircle,
    X,
    Eye,
    BarChart3
  } from "lucide-react"

interface ComplianceAssessment {
  id: number
  assessment_id: string
  assessment_name: string
  regulatory_framework: string
  assessment_type: string
  status: string
  overall_compliance_score: number | string | null
  total_controls: number
  gap_count: number
  assets: string[]
  assessor_name: string
  created_at: string
  assessed_controls_count?: number
  open_gaps_count?: number
}

interface ComplianceAssessmentCreationProps {
  onAssessmentCreated: (assessmentId: number) => void
  onAssessmentSelected: (assessmentId: number) => void
  onStatsUpdate: () => void
}

export default function ComplianceAssessmentCreation({
  onAssessmentCreated,
  onAssessmentSelected,
  onStatsUpdate,
}: ComplianceAssessmentCreationProps) {
  const [assessments, setAssessments] = useState<ComplianceAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<ComplianceAssessment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newAssessment, setNewAssessment] = useState({
    assessment_name: "",
    regulatory_framework: "",
    assessment_type: "Initial",
    assessment_scope: "",
    assessment_objective: "",
    assessment_period_start: "",
    assessment_period_end: "",
    assessor_name: "",
    assessor_organization: "",
    assessor_email: "",
    reviewer_name: "",
    status: "Planning",
  })

  const [assets, setAssets] = useState<string[]>([])
  const [assetSearchTerm, setAssetSearchTerm] = useState("")

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/compliance-assessments")
      const result = await response.json()

      if (result.success) {
        setAssessments(result.data)
      } else {
        toast.error("Failed to load assessments")
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
      toast.error("Failed to load assessments")
    } finally {
      setLoading(false)
    }
  }

  const addAsset = (assetText: string) => {
    const trimmedAsset = assetText.trim()
    if (trimmedAsset && !assets.includes(trimmedAsset)) {
      setAssets([...assets, trimmedAsset])
      setAssetSearchTerm("")
    }
  }

  const removeAsset = (assetToRemove: string) => {
    setAssets(assets.filter((asset) => asset !== assetToRemove))
  }

  const handleCreateAssessment = async () => {
    if (!newAssessment.assessment_name || !newAssessment.regulatory_framework) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/compliance-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAssessment,
          assets: assets,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Compliance assessment created successfully!")
        setIsCreateDialogOpen(false)
        fetchAssessments()
        onStatsUpdate()
        
        // Reset form
        setNewAssessment({
          assessment_name: "",
          regulatory_framework: "",
          assessment_type: "Initial",
          assessment_scope: "",
          assessment_objective: "",
          assessment_period_start: "",
          assessment_period_end: "",
          assessor_name: "",
          assessor_organization: "",
          assessor_email: "",
          reviewer_name: "",
          status: "Planning",
        })
        setAssets([])

        // Notify parent and auto-select the new assessment
        if (result.data?.id) {
          onAssessmentCreated(result.data.id)
        }
      } else {
        toast.error(result.error || "Failed to create assessment")
      }
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast.error("Failed to create assessment")
    }
  }

  const handleViewAssessment = (assessment: ComplianceAssessment) => {
    setSelectedAssessment(assessment)
    setIsViewDialogOpen(true)
  }

  const handleSelectAssessment = (assessmentId: number) => {
    onAssessmentSelected(assessmentId)
    toast.success("Assessment selected. You can now add controls and track gaps.")
  }

  const handleDeleteAssessment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this assessment? This will also delete all associated controls and gaps.")) {
      return
    }

    try {
      const response = await fetch(`/api/compliance-assessments/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Assessment deleted successfully")
        fetchAssessments()
        onStatsUpdate()
      } else {
        toast.error("Failed to delete assessment")
      }
    } catch (error) {
      console.error("Error deleting assessment:", error)
      toast.error("Failed to delete assessment")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Planning":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Under Review":
      case "Planning":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Assessment Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Compliance Assessments</h2>
          <p>Create and manage regulatory compliance assessments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Compliance Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Compliance Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_name">Assessment Name *</Label>
                  <Input
                    id="assessment_name"
                    value={newAssessment.assessment_name}
                    onChange={(e) =>
                      setNewAssessment({ ...newAssessment, assessment_name: e.target.value })
                    }
                    placeholder="e.g., Regulatory Compliance 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regulatory_framework">Regulatory Framework *</Label>
                  <Select
                    value={newAssessment.regulatory_framework}
                    onValueChange={(value) =>
                      setNewAssessment({ ...newAssessment, regulatory_framework: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                      <SelectItem value="NIST CSF">NIST CSF</SelectItem>
                      <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                      <SelectItem value="HIPAA">HIPAA</SelectItem>
                      <SelectItem value="SOC 2">SOC 2</SelectItem>
                      <SelectItem value="GDPR">GDPR</SelectItem>
                      <SelectItem value="NESA UAE">NESA UAE</SelectItem>
                      <SelectItem value="MAS TRM">MAS TRM</SelectItem>
                      <SelectItem value="DORA">DORA</SelectItem>
                      <SelectItem value="NIS2">NIS2</SelectItem>
                      <SelectItem value="SAMA Cybersecurity">SAMA Cybersecurity</SelectItem>
                      <SelectItem value="CIS Controls">CIS Controls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_type">Assessment Type</Label>
                  <Select
                    value={newAssessment.assessment_type}
                    onValueChange={(value) =>
                      setNewAssessment({ ...newAssessment, assessment_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Initial">Initial</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="Ad-hoc">Ad-hoc</SelectItem>
                      <SelectItem value="Re-assessment">Re-assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAssessment.status}
                    onValueChange={(value) => setNewAssessment({ ...newAssessment, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_period_start">Assessment Period Start</Label>
                  <Input
                    id="assessment_period_start"
                    type="date"
                    value={newAssessment.assessment_period_start}
                    onChange={(e) =>
                      setNewAssessment({ ...newAssessment, assessment_period_start: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessment_period_end">Assessment Period End</Label>
                  <Input
                    id="assessment_period_end"
                    type="date"
                    value={newAssessment.assessment_period_end}
                    onChange={(e) =>
                      setNewAssessment({ ...newAssessment, assessment_period_end: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment_objective">Assessment Objective</Label>
                <Textarea
                  id="assessment_objective"
                  value={newAssessment.assessment_objective}
                  onChange={(e) =>
                    setNewAssessment({ ...newAssessment, assessment_objective: e.target.value })
                  }
                  placeholder="Define the objectives of this compliance assessment"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment_scope">Assessment Scope</Label>
                <Textarea
                  id="assessment_scope"
                  value={newAssessment.assessment_scope}
                  onChange={(e) =>
                    setNewAssessment({ ...newAssessment, assessment_scope: e.target.value })
                  }
                  placeholder="Define the scope and boundaries of this assessment"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessor_name">Assessor Name</Label>
                  <OwnerSelectInput
                    formData={newAssessment}
                    setFormData={setNewAssessment}
                    fieldName="assessor_name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessor_organization">Assessor Organization</Label>
                  <Input
                    id="assessor_organization"
                    value={newAssessment.assessor_organization}
                    onChange={(e) =>
                      setNewAssessment({ ...newAssessment, assessor_organization: e.target.value })
                    }
                    placeholder="Organization conducting the assessment"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessor_email">Assessor Email</Label>
                  <Input
                    id="assessor_email"
                    type="email"
                    value={newAssessment.assessor_email}
                    onChange={(e) =>
                      setNewAssessment({ ...newAssessment, assessor_email: e.target.value })
                    }
                    placeholder="assessor@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewer_name">Reviewer Name</Label>
                  <OwnerSelectInput
                    formData={newAssessment}
                    setFormData={setNewAssessment}
                    fieldName="reviewer_name"
                  />
                </div>
              </div>

              {/* Assets Section */}
              <div className="space-y-2">
                <Label>Associated Assets</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {assets.map((asset) => (
                    <Badge key={asset} variant="secondary" className="flex items-center gap-1">
                      {asset}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAsset(asset)} />
                    </Badge>
                  ))}
                </div>
                <AssetSelectInput
                  formData={{ asset: assetSearchTerm }}
                  setFormData={(data) => setAssetSearchTerm(data.asset)}
                  fieldName="asset"
                  onAssetSelected={(selectedAsset) => {
                    const assetText = `${selectedAsset.asset_name} (${selectedAsset.asset_id})`
                    addAsset(assetText)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Add assets that will be included in this compliance assessment
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAssessment}
                  variant="outline"
                >
                  Create Assessment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Compliance Assessments</CardTitle>
          <CardDescription>View and manage your regulatory compliance assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assessments Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first compliance assessment to get started
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Assessment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Controls</TableHead>
                    <TableHead>Gaps</TableHead>
                    <TableHead>Assets</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-mono text-xs">
                        {assessment.assessment_id}
                      </TableCell>
                      <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{assessment.regulatory_framework}</Badge>
                      </TableCell>
                      <TableCell>{assessment.assessment_type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(assessment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(assessment.status)}
                            {assessment.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assessment.overall_compliance_score ? (
                          <div className="flex items-center gap-2">
                            <Progress
                              value={Number(assessment.overall_compliance_score)}
                              className="w-20"
                            />
                            <span className="text-sm font-medium">
                              {Number(assessment.overall_compliance_score).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not assessed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {assessment.assessed_controls_count || 0} / {assessment.total_controls || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={assessment.open_gaps_count && assessment.open_gaps_count > 0 ? "destructive" : "secondary"}
                        >
                          {assessment.open_gaps_count || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {Array.isArray(assessment.assets) ? assessment.assets.length : 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAssessment(assessment)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectAssessment(assessment.id)}
                            title="Select for control assessment"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssessment(assessment.id)}
                            title="Delete assessment"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* View Assessment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Assessment ID</Label>
                  <p className="font-mono text-sm">{selectedAssessment.assessment_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Framework</Label>
                  <p>{selectedAssessment.regulatory_framework}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p>{selectedAssessment.assessment_type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(selectedAssessment.status)}>
                    {selectedAssessment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Compliance Score</Label>
                  <p className="text-lg font-bold text-green-600">
                    {selectedAssessment.overall_compliance_score
                      ? `${Number(selectedAssessment.overall_compliance_score).toFixed(1)}%`
                      : "Not calculated"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Controls / Gaps</Label>
                  <p>
                    {selectedAssessment.total_controls || 0} controls,{" "}
                    {selectedAssessment.gap_count || 0} gaps
                  </p>
                </div>
              </div>

              {selectedAssessment.assets && Array.isArray(selectedAssessment.assets) && selectedAssessment.assets.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2">Associated Assets</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssessment.assets.map((asset, index) => (
                      <Badge key={index} variant="secondary">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Assessor</Label>
                <p>{selectedAssessment.assessor_name || "Not assigned"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p>{new Date(selectedAssessment.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

