"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Edit, Trash2, CheckCircle, Save, X } from "lucide-react"
import { toast } from "sonner"
import OwnerSelectInput from "@/components/owner-search-input"

interface NESAControl {
  id: string
  control_name: string
  control_reference: string
  sub_control_name?: string
  sub_control_reference?: string
  control_description: string
  sub_control_description?: string
  priority: "P1" | "P2" | "P3"
  implementation_guidance?: string
}

interface GapAnalysisEntry {
  id: string
  nesa_control_id: string
  existing_control?: string
  control_owner?: string
  political_procedure_control?: string
  initial_control_maturity: "Not Implemented" | "Ad Hoc" | "Repeatable" | "Defined" | "Managed" | "Optimized"
  gap_description?: string
  financial_action?: string
  target_control_maturity: "Not Implemented" | "Ad Hoc" | "Repeatable" | "Defined" | "Managed" | "Optimized"
  action_owner?: string
  reviewer?: string
  status: "Not Started" | "In Progress" | "Under Review" | "Completed" | "On Hold"
  notes?: string
  created_at: string
  updated_at: string
  nesa_control?: NESAControl
}

const maturityLevels = ["Not Implemented", "Ad Hoc", "Repeatable", "Defined", "Managed", "Optimized"]

const statusOptions = ["Not Started", "In Progress", "Under Review", "Completed", "On Hold"]

const priorityColors = {
  P1: "bg-red-100 text-red-800",
  P2: "bg-yellow-100 text-yellow-800",
  P3: "bg-green-100 text-green-800",
}

const statusColors = {
  "Not Started": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Under Review": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  "On Hold": "bg-red-100 text-red-800",
}

const maturityColors = {
  "Not Implemented": "bg-red-100 text-red-800",
  "Ad Hoc": "bg-orange-100 text-orange-800",
  Repeatable: "bg-yellow-100 text-yellow-800",
  Defined: "bg-blue-100 text-blue-800",
  Managed: "bg-green-100 text-green-800",
  Optimized: "bg-emerald-100 text-emerald-800",
}

export function NESAUAEGapAnalysis() {
  const [nesaControls, setNesaControls] = useState<NESAControl[]>([])
  const [gapEntries, setGapEntries] = useState<GapAnalysisEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<GapAnalysisEntry | null>(null)
  const [selectedControl, setSelectedControl] = useState<NESAControl | null>(null)
  const [activeTab, setActiveTab] = useState("controls")

  // Form state
  const [formData, setFormData] = useState({
    nesa_control_id: "",
    existing_control: "",
    control_owner: "",
    political_procedure_control: "",
    initial_control_maturity: "Not Implemented" as const,
    gap_description: "",
    financial_action: "",
    target_control_maturity: "Defined" as const,
    action_owner: "",
    reviewer: "",
    status: "Not Started" as const,
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch NESA controls
      const controlsResponse = await fetch("/api/nesa-uae/requirements")
      if (controlsResponse.ok) {
        const controlsData = await controlsResponse.json()
        setNesaControls(Array.isArray(controlsData) ? controlsData : [])
      } else {
        console.error("Failed to fetch NESA controls")
        setNesaControls([])
      }

      // Fetch gap analysis entries
      const gapResponse = await fetch("/api/nesa-uae-gap-analysis")
      if (gapResponse.ok) {
        const gapData = await gapResponse.json()
        setGapEntries(Array.isArray(gapData) ? gapData : [])
      } else {
        console.error("Failed to fetch gap analysis entries")
        setGapEntries([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
      setNesaControls([])
      setGapEntries([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingEntry ? `/api/nesa-uae-gap-analysis/${editingEntry.id}` : "/api/nesa-uae-gap-analysis"
      const method = editingEntry ? "PUT" : "POST"

      console.log("Submitting gap analysis data:", formData)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()
      console.log("API response:", responseData)

      if (response.ok) {
        toast.success(editingEntry ? "Gap analysis updated successfully" : "Gap analysis created successfully")
        setIsDialogOpen(false)
        resetForm()
        fetchData()
      } else {
        console.error("API error:", responseData)
        throw new Error(responseData.error || "Failed to save gap analysis")
      }
    } catch (error) {
      console.error("Error saving gap analysis:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save gap analysis")
    }
  }

  const handleEdit = (entry: GapAnalysisEntry) => {
    setEditingEntry(entry)
    setFormData({
      nesa_control_id: entry.nesa_control_id,
      existing_control: entry.existing_control || "",
      control_owner: entry.control_owner || "",
      political_procedure_control: entry.political_procedure_control || "",
      initial_control_maturity: entry.initial_control_maturity,
      gap_description: entry.gap_description || "",
      financial_action: entry.financial_action || "",
      target_control_maturity: entry.target_control_maturity,
      action_owner: entry.action_owner || "",
      reviewer: entry.reviewer || "",
      status: entry.status,
      notes: entry.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gap analysis entry?")) {
      return
    }

    try {
      const response = await fetch(`/api/nesa-uae-gap-analysis/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Gap analysis deleted successfully")
        fetchData()
      } else {
        throw new Error("Failed to delete gap analysis")
      }
    } catch (error) {
      console.error("Error deleting gap analysis:", error)
      toast.error("Failed to delete gap analysis")
    }
  }

  const resetForm = () => {
    setFormData({
      nesa_control_id: "",
      existing_control: "",
      control_owner: "",
      political_procedure_control: "",
      initial_control_maturity: "Not Implemented",
      gap_description: "",
      financial_action: "",
      target_control_maturity: "Defined",
      action_owner: "",
      reviewer: "",
      status: "Not Started",
      notes: "",
    })
    setEditingEntry(null)
    setSelectedControl(null)
  }

  const openNewEntryDialog = (control?: NESAControl) => {
    resetForm()
    if (control) {
      setSelectedControl(control)
      setFormData((prev) => ({ ...prev, nesa_control_id: control.id }))
    }
    setIsDialogOpen(true)
  }

  // Filter functions
  const filteredControls = nesaControls.filter((control) => {
    const matchesSearch =
      control.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.control_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (control.sub_control_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesPriority = priorityFilter === "all" || control.priority === priorityFilter

    return matchesSearch && matchesPriority
  })

  const filteredGapEntries = gapEntries.filter((entry) => {
    const matchesSearch =
      entry.nesa_control?.control_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.existing_control?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.control_owner?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || entry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Statistics
  const stats = {
    totalControls: nesaControls.length,
    analyzedControls: gapEntries.length,
    completedEntries: gapEntries.filter((e) => e.status === "Completed").length,
    inProgressEntries: gapEntries.filter((e) => e.status === "In Progress").length,
    averageMaturity:
      gapEntries.length > 0
        ? gapEntries.reduce((acc, entry) => {
            const maturityIndex = maturityLevels.indexOf(entry.initial_control_maturity)
            return acc + maturityIndex
          }, 0) / gapEntries.length
        : 0,
  }

  if (loading) {
    return (
      <Card className="gradient-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading gap analysis data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NESA UAE Gap Analysis
          </h2>
          <p className="text-muted-foreground">Analyze gaps between existing controls and NESA UAE requirements</p>
        </div>
        <Button
          onClick={() => openNewEntryDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Gap Analysis
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalControls}</div>
            <p className="text-xs text-muted-foreground">NESA UAE controls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.analyzedControls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalControls > 0 ? Math.round((stats.analyzedControls / stats.totalControls) * 100) : 0}% coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgressEntries}</div>
            <p className="text-xs text-muted-foreground">active remediation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Avg Maturity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageMaturity.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">maturity level</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="controls">NESA Controls</TabsTrigger>
          <TabsTrigger value="gap-entries">Gap Analysis Entries</TabsTrigger>
          <TabsTrigger value="matrix">Gap Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    NESA UAE Controls
                  </CardTitle>
                  <CardDescription>Select controls to perform gap analysis</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search controls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="P1">P1</SelectItem>
                      <SelectItem value="P2">P2</SelectItem>
                      <SelectItem value="P3">P3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredControls.map((control) => {
                    const hasGapEntry = gapEntries.some((entry) => entry.nesa_control_id === control.id)

                    return (
                      <Card key={control.id} className="border-blue-200/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={priorityColors[control.priority]}>{control.priority}</Badge>
                                <Badge variant="outline">{control.control_reference}</Badge>
                                {control.sub_control_reference && (
                                  <Badge variant="outline">{control.sub_control_reference}</Badge>
                                )}
                                {hasGapEntry && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Analyzed
                                  </Badge>
                                )}
                              </div>

                              <h3 className="font-semibold text-lg mb-1">{control.control_name}</h3>

                              {control.sub_control_name && (
                                <h4 className="font-medium text-base text-blue-600 mb-2">{control.sub_control_name}</h4>
                              )}

                              <p className="text-sm text-muted-foreground mb-2">{control.control_description}</p>

                              {control.sub_control_description && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Sub-control:</strong> {control.sub_control_description}
                                </p>
                              )}

                              {control.implementation_guidance && (
                                <div className="mt-2 p-2 bg-blue-50 rounded-md">
                                  <p className="text-xs text-blue-700">
                                    <strong>Implementation Guidance:</strong> {control.implementation_guidance}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              <Button
                                onClick={() => openNewEntryDialog(control)}
                                size="sm"
                                variant={hasGapEntry ? "outline" : "default"}
                                className={hasGapEntry ? "" : ""}
                              >
                                {hasGapEntry ? (
                                  <>
                                    <Edit className="mr-1 h-3 w-3" />
                                    Update
                                  </>
                                ) : (
                                  <>
                                    <Plus className="mr-1 h-3 w-3" />
                                    Analyze
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gap-entries" className="space-y-4">
          <Card className="gradient-card-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gap Analysis Entries
                  </CardTitle>
                  <CardDescription>Manage and track gap analysis progress</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Control</TableHead>
                      <TableHead>Existing Control</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Initial Maturity</TableHead>
                      <TableHead>Target Maturity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGapEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.nesa_control?.control_reference || "N/A"}</div>
                            <div className="text-sm text-muted-foreground">
                              {entry.nesa_control?.control_name || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{entry.existing_control || "Not specified"}</div>
                            {entry.political_procedure_control && (
                              <div className="text-sm text-muted-foreground">{entry.political_procedure_control}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.control_owner || "Unassigned"}</div>
                            {entry.action_owner && entry.action_owner !== entry.control_owner && (
                              <div className="text-sm text-muted-foreground">Action: {entry.action_owner}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={maturityColors[entry.initial_control_maturity]}>
                            {entry.initial_control_maturity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={maturityColors[entry.target_control_maturity]}>
                            {entry.target_control_maturity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[entry.status]}>{entry.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
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
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card className="gradient-card-primary">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gap Analysis Matrix
              </CardTitle>
              <CardDescription>Visual overview of control maturity and gaps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Maturity Distribution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Maturity Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {maturityLevels.map((level, index) => {
                      const count = gapEntries.filter((entry) => entry.initial_control_maturity === level).length
                      const percentage = gapEntries.length > 0 ? (count / gapEntries.length) * 100 : 0

                      return (
                        <Card key={level} className="text-center">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold mb-2">{count}</div>
                            <div className="text-sm font-medium mb-2">{level}</div>
                            <Progress value={percentage} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}%</div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Status Distribution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {statusOptions.map((status) => {
                      const count = gapEntries.filter((entry) => entry.status === status).length
                      const percentage = gapEntries.length > 0 ? (count / gapEntries.length) * 100 : 0

                      return (
                        <Card key={status} className="text-center">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold mb-2">{count}</div>
                            <Badge className={statusColors[status]} variant="secondary">
                              {status}
                            </Badge>
                            <Progress value={percentage} className="h-2 mt-2" />
                            <div className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}%</div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Gap Analysis Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Gap Analysis" : "New Gap Analysis"}</DialogTitle>
            <DialogDescription>
              {selectedControl && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <div className="font-medium">
                    {selectedControl.control_reference}: {selectedControl.control_name}
                  </div>
                  {selectedControl.sub_control_name && (
                    <div className="text-sm text-blue-600 mt-1">
                      {selectedControl.sub_control_reference}: {selectedControl.sub_control_name}
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NESA Control Selection */}
              {!selectedControl && (
                <div className="md:col-span-2">
                  <Label htmlFor="nesa_control_id">NESA Control *</Label>
                  <Select
                    value={formData.nesa_control_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, nesa_control_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select NESA control" />
                    </SelectTrigger>
                    <SelectContent>
                      {nesaControls.map((control) => (
                        <SelectItem key={control.id} value={control.id}>
                          {control.control_reference}: {control.control_name}
                          {control.sub_control_name && ` - ${control.sub_control_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Existing Control */}
              <div className="md:col-span-2">
                <Label htmlFor="existing_control">Existing Control</Label>
                <Textarea
                  id="existing_control"
                  value={formData.existing_control}
                  onChange={(e) => setFormData((prev) => ({ ...prev, existing_control: e.target.value }))}
                  placeholder="Describe your existing control implementation..."
                  rows={3}
                />
              </div>

              {/* Control Owner */}
              <div>
                <Label htmlFor="control_owner">Control Owner</Label>
                <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="control_owner"/>                            

                {/* <Input
                  id="control_owner"
                  value={formData.control_owner}
                  onChange={(e) => setFormData((prev) => ({ ...prev, control_owner: e.target.value }))}
                  placeholder="e.g., IT Security Team"
                /> */}
              </div>

              {/* Political/Procedure Control */}
              <div>
                <Label htmlFor="political_procedure_control">Political/Procedure Control</Label>
                <Input
                  id="political_procedure_control"
                  value={formData.political_procedure_control}
                  onChange={(e) => setFormData((prev) => ({ ...prev, political_procedure_control: e.target.value }))}
                  placeholder="e.g., Policy XYZ, Procedure ABC"
                />
              </div>

              {/* Initial Control Maturity */}
              <div>
                <Label htmlFor="initial_control_maturity">Initial Control Maturity *</Label>
                <Select
                  value={formData.initial_control_maturity}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, initial_control_maturity: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {maturityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Control Maturity */}
              <div>
                <Label htmlFor="target_control_maturity">Target Control Maturity *</Label>
                <Select
                  value={formData.target_control_maturity}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, target_control_maturity: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {maturityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gap Description */}
              <div className="md:col-span-2">
                <Label htmlFor="gap_description">Gap Description</Label>
                <Textarea
                  id="gap_description"
                  value={formData.gap_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gap_description: e.target.value }))}
                  placeholder="Describe the identified gaps and deficiencies..."
                  rows={3}
                />
              </div>

              {/* Financial Action */}
              <div className="md:col-span-2">
                <Label htmlFor="financial_action">Financial Action</Label>
                <Textarea
                  id="financial_action"
                  value={formData.financial_action}
                  onChange={(e) => setFormData((prev) => ({ ...prev, financial_action: e.target.value }))}
                  placeholder="Describe required financial investments or budget considerations..."
                  rows={2}
                />
              </div>

              {/* Action Owner */}
              <div>
                <Label htmlFor="action_owner">Action Owner</Label>
                <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="action_owner" />                                            
                {/* <Input
                  id="action_owner"
                  value={formData.action_owner}
                  onChange={(e) => setFormData((prev) => ({ ...prev, action_owner: e.target.value }))}
                  placeholder="e.g., Security Manager"
                /> */}
              </div>

              {/* Reviewer */}
              <div>
                <Label htmlFor="reviewer">Reviewer</Label>
                <Input
                  id="reviewer"
                  value={formData.reviewer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reviewer: e.target.value }))}
                  placeholder="e.g., CISO"
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes and comments..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                
              >
                <Save className="mr-2 h-4 w-4" />
                {editingEntry ? "Update" : "Create"} Gap Analysis
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
