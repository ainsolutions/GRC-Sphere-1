"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AssetSelectInput from "@/components/asset-search-input"
import OwnerSelectInput from "@/components/owner-search-input"
import { Upload, Plus, Search, ClipboardList, Settings, FileUp } from "lucide-react"

interface ChangeRequest {
  id: number
  change_id: string
  title: string
  description: string
  asset_id?: number
  asset_type?: string
  cia_confidentiality?: number
  cia_integrity?: number
  cia_availability?: number
  change_type: string
  change_category: string
  risk_level?: string
  risk_analysis?: string
  impact_analysis?: string
  implementation_plan?: string
  rollback_plan?: string
  testing_plan?: string
  testing_results?: string
  post_implementation_review?: string
  document_links?: string
  initiator?: string
  reviewer?: string
  approver?: string
  planned_start_date?: string
  planned_end_date?: string
  actual_end_date?: string
  status: string
  created_at: string
}

export default function ChangeManagementPage() {
  const [items, setItems] = useState<ChangeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [incidents, setIncidents] = useState<any[]>([])
  const [isoRisks, setIsoRisks] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    asset_display: "",
    asset_id: undefined,
    change_type: "normal",
    change_category: "configuration",
    risk_level: "medium",
    risk_analysis: "",
    impact_analysis: "",
    implementation_plan: "",
    rollback_plan: "",
    testing_plan: "",
    testing_results: "",
    post_implementation_review: "",
    document_links: "",
    initiator: "",
    reviewer: "",
    approver: "",
    planned_start_date: "",
    planned_end_date: "",
    actual_end_date: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (open) {
      fetchIncidents()
      fetchIsoRisks()
      fetchAssessments()
    }
  }, [open])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/technology-change-requests")
      const data = await res.json()
      setItems(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleAssetSelected = (asset: any) => {
    setFormData((prev: any) => ({
      ...prev,
      asset_id: asset.id,
      asset_display: `${asset.asset_name} (${asset.asset_id})`,
      cia_confidentiality: asset.confidentiality_level ?? prev.cia_confidentiality,
      cia_integrity: asset.integrity_level ?? prev.cia_integrity,
      cia_availability: asset.availability_level ?? prev.cia_availability,
    }))
  }

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`/api/incidents?limit=100`)
      const data = await res.json()
      setIncidents(Array.isArray(data.data) ? data.data : [])
    } catch {
      setIncidents([])
    }
  }

  const fetchIsoRisks = async () => {
    try {
      const res = await fetch(`/api/iso27001-risks`)
      const data = await res.json()
      setIsoRisks(Array.isArray(data.data) ? data.data : [])
    } catch {
      setIsoRisks([])
    }
  }

  const fetchAssessments = async () => {
    try {
      const res = await fetch(`/api/assessments`)
      const data = await res.json()
      setAssessments(Array.isArray(data) ? data : [])
    } catch {
      setAssessments([])
    }
  }

  const submit = async () => {
    const payload = { ...formData }
    delete payload.asset_display
    const res = await fetch("/api/technology-change-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setOpen(false)
      setFormData((f: any) => ({ ...f, title: "", description: "" }))
      fetchData()
    }
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ClipboardList className="mr-3 h-8 w-8 text-blue-600" />
              Technology Change Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">COBIT-aligned process for managing technology changes</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Change
            </Button>
          </div>
        </div>

        <Tabs defaultValue="changes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="changes">Change Requests</TabsTrigger>
            <TabsTrigger value="register">Change Register</TabsTrigger>
          </TabsList>

          <TabsContent value="changes">
            <Card>
              <CardHeader>
                <CardTitle>Changes</CardTitle>
                <CardDescription>Planned and in-progress changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by ID, title or description" onChange={() => {}} />
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Planned Window</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell className="font-medium">{it.change_id}</TableCell>
                          <TableCell>{it.title}</TableCell>
                          <TableCell><Badge variant="outline">{it.change_type}</Badge></TableCell>
                          <TableCell><Badge variant="outline">{it.change_category}</Badge></TableCell>
                          <TableCell><Badge variant="outline">{it.risk_level || "-"}</Badge></TableCell>
                          <TableCell>{it.asset_type || "-"}</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {it.planned_start_date ? new Date(it.planned_start_date).toLocaleString() : "-"} → {it.planned_end_date ? new Date(it.planned_end_date).toLocaleString() : "-"}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline">{it.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No changes found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Change Management Register</CardTitle>
                <CardDescription>Comprehensive log of changes with approvals and outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Asset Type</TableHead>
                        <TableHead>C</TableHead>
                        <TableHead>I</TableHead>
                        <TableHead>A</TableHead>
                        <TableHead>Initiator</TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead>Approver</TableHead>
                        <TableHead>Planned Start</TableHead>
                        <TableHead>Planned End</TableHead>
                        <TableHead>Actual End</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell className="font-medium">{it.change_id}</TableCell>
                          <TableCell>{it.title}</TableCell>
                          <TableCell>{it.change_type}</TableCell>
                          <TableCell>{it.change_category}</TableCell>
                          <TableCell>{it.risk_level || "-"}</TableCell>
                          <TableCell>{it.asset_type || "-"}</TableCell>
                          <TableCell>{it.cia_confidentiality ?? "-"}</TableCell>
                          <TableCell>{it.cia_integrity ?? "-"}</TableCell>
                          <TableCell>{it.cia_availability ?? "-"}</TableCell>
                          <TableCell className="text-xs">{it.initiator || "-"}</TableCell>
                          <TableCell className="text-xs">{it.reviewer || "-"}</TableCell>
                          <TableCell className="text-xs">{it.approver || "-"}</TableCell>
                          <TableCell className="text-xs">{it.planned_start_date ? new Date(it.planned_start_date).toLocaleString() : "-"}</TableCell>
                          <TableCell className="text-xs">{it.planned_end_date ? new Date(it.planned_end_date).toLocaleString() : "-"}</TableCell>
                          <TableCell className="text-xs">{it.actual_end_date ? new Date(it.actual_end_date).toLocaleString() : "-"}</TableCell>
                          <TableCell><Badge variant="outline">{it.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">No entries in register.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Change Request</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="sra">Security Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Title</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>

                  <div>
                    <Label>Affected Asset</Label>
                    <AssetSelectInput
                      formData={formData}
                      setFormData={setFormData}
                      fieldName="asset_display"
                      onAssetSelected={handleAssetSelected}
                    />
                  </div>

                  <div>
                    <Label>Asset CIA (auto)</Label>
                    <div className="text-xs text-muted-foreground">
                      C:{formData.cia_confidentiality || "-"} I:{formData.cia_integrity || "-"} A:{formData.cia_availability || "-"}
                    </div>
                  </div>

                  <div>
                    <Label>Change Type</Label>
                    <Select value={formData.change_type} onValueChange={(v) => setFormData({ ...formData, change_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Change Category</Label>
                    <Select value={formData.change_category} onValueChange={(v) => setFormData({ ...formData, change_category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="configuration">Configuration</SelectItem>
                        <SelectItem value="patch">Patch</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Risk Level</Label>
                    <Select value={formData.risk_level} onValueChange={(v) => setFormData({ ...formData, risk_level: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Risk Analysis</Label>
                    <Textarea rows={3} value={formData.risk_analysis} onChange={(e) => setFormData({ ...formData, risk_analysis: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Impact Analysis</Label>
                    <Textarea rows={3} value={formData.impact_analysis} onChange={(e) => setFormData({ ...formData, impact_analysis: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Implementation Plan</Label>
                    <Textarea rows={3} value={formData.implementation_plan} onChange={(e) => setFormData({ ...formData, implementation_plan: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Rollback Plan</Label>
                    <Textarea rows={3} value={formData.rollback_plan} onChange={(e) => setFormData({ ...formData, rollback_plan: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Testing Plan</Label>
                    <Textarea rows={3} value={formData.testing_plan} onChange={(e) => setFormData({ ...formData, testing_plan: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Testing Results</Label>
                    <Textarea rows={3} value={formData.testing_results} onChange={(e) => setFormData({ ...formData, testing_results: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Post Implementation Review</Label>
                    <Textarea rows={3} value={formData.post_implementation_review} onChange={(e) => setFormData({ ...formData, post_implementation_review: e.target.value })} />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Document Links</Label>
                    <Input placeholder="Comma-separated URLs or storage keys" value={formData.document_links} onChange={(e) => setFormData({ ...formData, document_links: e.target.value })} />
                  </div>

                  <div>
                    <Label>Initiator</Label>
                    <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="initiator" />
                  </div>
                  <div>
                    <Label>Reviewer</Label>
                    <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="reviewer" />
                  </div>
                  <div>
                    <Label>Approver</Label>
                    <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="approver" />
                  </div>

                  <div>
                    <Label>Planned Start</Label>
                    <Input type="datetime-local" value={formData.planned_start_date} onChange={(e) => setFormData({ ...formData, planned_start_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Planned End</Label>
                    <Input type="datetime-local" value={formData.planned_end_date} onChange={(e) => setFormData({ ...formData, planned_end_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Actual End</Label>
                    <Input type="datetime-local" value={formData.actual_end_date} onChange={(e) => setFormData({ ...formData, actual_end_date: e.target.value })} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sra">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Related Incident</Label>
                    <Select value={formData.related_incident_id?.toString() || ""} onValueChange={(v) => setFormData({ ...formData, related_incident_id: Number(v) })}>
                      <SelectTrigger><SelectValue placeholder="Select incident" /></SelectTrigger>
                      <SelectContent>
                        {incidents.map((i) => (
                          <SelectItem key={i.id} value={i.id.toString()}>{i.incident_title || i.incident_id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Related ISO 27001 Risk</Label>
                    <Select value={formData.related_risk_id?.toString() || ""} onValueChange={(v) => setFormData({ ...formData, related_risk_id: Number(v) })}>
                      <SelectTrigger><SelectValue placeholder="Select risk" /></SelectTrigger>
                      <SelectContent>
                        {isoRisks.map((r) => (
                          <SelectItem key={r.id} value={r.id.toString()}>{r.risk_id || r.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Related Assessment</Label>
                    <Select
                      value={formData.related_assessment_id?.toString() || ""}
                      onValueChange={(v) => {
                        const a = assessments.find((x) => x.id?.toString() === v)
                        setFormData({
                          ...formData,
                          related_assessment_id: Number(v),
                          related_assessment_findings: a?.findings_count ?? formData.related_assessment_findings,
                        })
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select assessment" /></SelectTrigger>
                      <SelectContent>
                        {assessments.map((a) => (
                          <SelectItem key={a.id} value={a.id?.toString()}>{a.assessment_name || a.assessment_id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Assessment Findings</Label>
                    <Input readOnly value={formData.related_assessment_findings || "0"} />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Security Remarks</Label>
                    <Textarea rows={3} value={formData.security_remarks || ""} onChange={(e) => setFormData({ ...formData, security_remarks: e.target.value })} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit}><FileUp className="h-4 w-4 mr-2" /> Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}


