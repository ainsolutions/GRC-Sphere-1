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
import { Plus, Shield,Eye, Edit, Trash2, RefreshCw, CheckCircle, Clock, AlertCircle, X } from "lucide-react"
import { toast } from "sonner"
import AssetSelectInput from "@/components/asset-search-input"
import OwnerSelectInput from "@/components/owner-search-input"

interface SWIFTAssessment {
  id: number
  assessment_id: string
  assessment_name: string
  assessment_type: string
  swift_community_version: string
  scope: string
  assessment_date: string
  assessor_name: string
  assessor_organization: string
  status: string
  overall_compliance_score: number | null
  total_controls: number
  mandatory_controls: number
  compliant_controls: number
  findings_count: number
  swift_bic_code: string
  attestation_status: string
  assets: string[]
  created_at: string
}

interface SWIFTComplianceAssessmentProps {
  onAssessmentSelected?: (assessmentId: number) => void
}

export function SWIFTComplianceAssessment({ onAssessmentSelected }: SWIFTComplianceAssessmentProps) {
  const [assessments, setAssessments] = useState<SWIFTAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<SWIFTAssessment | null>(null)

  const [newAssessment, setNewAssessment] = useState({
    assessment_name: "",
    assessment_type: "Annual",
    swift_community_version: "CSP v2024",
    scope: "",
    assessment_date: new Date().toISOString().split("T")[0],
    assessor_name: "",
    assessor_organization: "",
    assessor_email: "",
    reviewer_name: "",
    swift_bic_code: "",
    swift_environment: "Production",
    message_volume_category: "Medium",
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
      const response = await fetch("/api/swift-assessments")
      const result = await response.json()

      if (result.success) {
        setAssessments(result.data)
      } else {
        toast.error("Failed to load assessments")
      }
    } catch (error) {
      console.error("Error fetching SWIFT assessments:", error)
      toast.error("Failed to load SWIFT assessments")
    } finally {
      setLoading(false)
    }
  }

  const addAsset = (assetText: string) => {
    if (assetText && !assets.includes(assetText)) {
      setAssets([...assets, assetText])
      setAssetSearchTerm("")
    }
  }

  const removeAsset = (assetToRemove: string) => {
    setAssets(assets.filter((asset) => asset !== assetToRemove))
  }

  const handleCreateAssessment = async () => {
    if (!newAssessment.assessment_name || !newAssessment.swift_bic_code) {
      toast.error("Assessment name and SWIFT BIC code are required")
      return
    }

    try {
      const response = await fetch("/api/swift-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAssessment,
          assets: assets,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("SWIFT assessment created successfully!")
        setIsCreateDialogOpen(false)
        fetchAssessments()
        
        // Reset form
        setNewAssessment({
          assessment_name: "",
          assessment_type: "Annual",
          swift_community_version: "CSP v2024",
          scope: "",
          assessment_date: new Date().toISOString().split("T")[0],
          assessor_name: "",
          assessor_organization: "",
          assessor_email: "",
          reviewer_name: "",
          swift_bic_code: "",
          swift_environment: "Production",
          message_volume_category: "Medium",
          status: "Planning",
        })
        setAssets([])

        // Auto-select the created assessment
        if (result.data?.id && onAssessmentSelected) {
          onAssessmentSelected(result.data.id)
        }
      } else {
        toast.error(result.error || "Failed to create assessment")
      }
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast.error("Failed to create assessment")
    }
  }

  const handleViewAssessment = (assessment: SWIFTAssessment) => {
    setSelectedAssessment(assessment)
    setIsViewDialogOpen(true)
  }

  const handleSelectAssessment = (assessment: SWIFTAssessment) => {
    if (onAssessmentSelected) {
      onAssessmentSelected(assessment.id)
      toast.success(`Selected: ${assessment.assessment_name}`)
    }
  }

  const handleDeleteAssessment = async (id: number) => {
    if (!confirm("Are you sure? This will delete all controls and gaps.")) return

    try {
      const response = await fetch(`/api/swift-assessments/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Assessment deleted successfully")
        fetchAssessments()
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
      case "Submitted":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Planning":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAttestationColor = (status: string) => {
    switch (status) {
      case "Validated":
        return "bg-green-100 text-green-800"
      case "Submitted":
        return "bg-blue-100 text-blue-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Assessment Dialog */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SWIFT CSP Assessments</h2>
          <p className="text-muted-foreground">Manage SWIFT Customer Security Programme compliance assessments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New SWIFT Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New SWIFT CSP Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_name">Assessment Name *</Label>
                  <Input
                    id="assessment_name"
                    value={newAssessment.assessment_name}
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessment_name: e.target.value })}
                    placeholder="e.g., SWIFT CSP Annual Assessment 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="swift_bic_code">SWIFT BIC Code *</Label>
                  <Input
                    id="swift_bic_code"
                    value={newAssessment.swift_bic_code}
                    onChange={(e) => setNewAssessment({ ...newAssessment, swift_bic_code: e.target.value.toUpperCase() })}
                    placeholder="e.g., ABNANL2A"
                    maxLength={11}
                  />
                  <p className="text-xs text-muted-foreground">8 or 11 character Bank Identifier Code</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_type">Assessment Type</Label>
                  <Select
                    value={newAssessment.assessment_type}
                    onValueChange={(value) => setNewAssessment({ ...newAssessment, assessment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annual">Annual Attestation</SelectItem>
                      <SelectItem value="Pre-audit">Pre-audit Assessment</SelectItem>
                      <SelectItem value="Post-incident">Post-incident Review</SelectItem>
                      <SelectItem value="Ad-hoc">Ad-hoc Assessment</SelectItem>
                      <SelectItem value="Internal">Internal Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="swift_community_version">SWIFT CSP Version</Label>
                  <Select
                    value={newAssessment.swift_community_version}
                    onValueChange={(value) => setNewAssessment({ ...newAssessment, swift_community_version: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSP v2024">CSP v2024</SelectItem>
                      <SelectItem value="CSP v2023">CSP v2023</SelectItem>
                      <SelectItem value="CSP v2022">CSP v2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="swift_environment">SWIFT Environment</Label>
                  <Select
                    value={newAssessment.swift_environment}
                    onValueChange={(value) => setNewAssessment({ ...newAssessment, swift_environment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Test">Test</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message_volume_category">Message Volume</Label>
                  <Select
                    value={newAssessment.message_volume_category}
                    onValueChange={(value) => setNewAssessment({ ...newAssessment, message_volume_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low (&lt; 1,000/day)</SelectItem>
                      <SelectItem value="Medium">Medium (1,000-10,000/day)</SelectItem>
                      <SelectItem value="High">High (&gt; 10,000/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Assessment Scope</Label>
                <Textarea
                  id="scope"
                  value={newAssessment.scope}
                  onChange={(e) => setNewAssessment({ ...newAssessment, scope: e.target.value })}
                  placeholder="Define the scope of the SWIFT CSP assessment"
                  rows={3}
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
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessor_organization: e.target.value })}
                    placeholder="Internal Team or External Auditor"
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
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessor_email: e.target.value })}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_date">Assessment Date</Label>
                  <Input
                    id="assessment_date"
                    type="date"
                    value={newAssessment.assessment_date}
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessment_date: e.target.value })}
                  />
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
                      <SelectItem value="Submitted">Submitted</SelectItem>
                    </SelectContent>
                  </Select>
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
                  Add SWIFT-related assets (Alliance Access, SWIFTNet Link, etc.)
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssessment} variant="outline">
                  Create SWIFT Assessment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle>SWIFT CSP Assessments</CardTitle>
          <CardDescription>All SWIFT Customer Security Programme compliance assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading SWIFT assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No SWIFT Assessments</h3>
              <p className="text-muted-foreground mb-4">
                Create your first SWIFT CSP compliance assessment
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
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
                    <TableHead>BIC Code</TableHead>
                    <TableHead>CSP Version</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Controls</TableHead>
                    <TableHead>Findings</TableHead>
                    <TableHead>Attestation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>{assessment.assessment_id}</TableCell>
                      <TableCell>{assessment.assessment_name}</TableCell>
                      <TableCell>{assessment.swift_bic_code}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{assessment.swift_community_version}</Badge>
                      </TableCell>
                      <TableCell>{assessment.assessment_type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {assessment.overall_compliance_score ? (
                          <div className="flex items-center gap-2">
                            <Progress value={assessment.overall_compliance_score} className="w-20" />
                            <span className="text-sm font-medium">
                              {assessment.overall_compliance_score.toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not assessed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {assessment.compliant_controls || 0} / {assessment.total_controls || 0}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {assessment.mandatory_controls || 0} mandatory
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={assessment.findings_count > 0 ? "destructive" : "secondary"}>
                          {assessment.findings_count || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAttestationColor(assessment.attestation_status)}>
                          {assessment.attestation_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewAssessment(assessment)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectAssessment(assessment)}
                            className="text-blue-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssessment(assessment.id)}
                            className="text-red-600"
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
            <DialogTitle>SWIFT Assessment Details</DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Assessment ID</Label>
                  <p className="font-mono">{selectedAssessment.assessment_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">BIC Code</Label>
                  <p className="font-mono">{selectedAssessment.swift_bic_code}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CSP Version</Label>
                  <p>{selectedAssessment.swift_community_version}</p>
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
                      ? `${selectedAssessment.overall_compliance_score.toFixed(1)}%`
                      : "Not calculated"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Attestation Status</Label>
                  <Badge className={getAttestationColor(selectedAssessment.attestation_status)}>
                    {selectedAssessment.attestation_status}
                  </Badge>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

