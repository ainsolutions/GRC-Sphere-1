"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Eye,
  RefreshCw,
  Plus,
  Target,
  Calendar,
  DollarSign,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Upload,
  FileText,
  Download,
  X,
  Shield,
  AlertTriangleIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import React from "react"
import OwnerSelectInput from "@/components/owner-search-input"

interface MitigationPlan {
  id: number
  plan_id: string
  plan_name: string
  template_id: number | null
  mitigation_strategy: string
  status: string
  progress_percentage: number
  assigned_owner: string
  start_date: string | null
  due_date: string | null
  investment_amount: number
  residual_risk_level: string
  priority: string
  notes: string
  created_at: string
  updated_at: string
  template_name?: string
  risk_template_id?: string
  risk_level?: string
  function_code?: string
  function_name?: string
}

interface RiskTemplate {
  id: number
  template_id: string
  template_name: string
  risk_description: string
  risk_level: string
  function_code: string
  function_name: string
}

interface Evidence {
  id: number
  evidence_id: string
  plan_id: number
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  upload_date: string
  uploaded_by: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function NISTCSFMitigationRegister() {
  const [plans, setPlans] = useState<MitigationPlan[]>([])
  const [riskTemplates, setRiskTemplates] = useState<RiskTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [templateFilter, setTemplateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<MitigationPlan | null>(null)
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([])
  const [evidenceLoading, setEvidenceLoading] = useState(false)
  const [newPlan, setNewPlan] = useState({
    plan_name: "",
    template_id: "none",
    mitigation_strategy: "",
    assigned_owner: "",
    start_date: "",
    due_date: "",
    investment_amount: 0,
    priority: "Medium",
    notes: "",
  })
  const { toast } = useToast()

  const [userRole, setUserRole] = useState<string>("user")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MitigationPlan | null>(null)
  const [uploadingEvidence, setUploadingEvidence] = useState(false)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [evidenceDescription, setEvidenceDescription] = useState("")

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importResults, setImportResults] = useState<{ imported: number; errors: string[] } | null>(null)
  const [isIncompletWithEvidence, setIncompleteWithEvidence] = useState(false)
  const [error, setError] = useState("")

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (priorityFilter !== "all") {
        params.append("priority", priorityFilter)
      }
      if (templateFilter !== "all") {
        params.append("templateId", templateFilter)
      }

      const response = await fetch(`/api/nist-csf-mitigation-plans?${params}`)
      const data = await response.json()

      if (data.success) {
        console.log("******************", data, "*********************")


        const plansData = data.data?.plans || data.plans || data.data || []
        setPlans(Array.isArray(plansData) ? plansData : [])
        setTotalItems(data.data?.pagination?.total || data.total || 0)
        setTotalPages(data.data?.pagination?.totalPages || data.totalPages || 1)
      } else {
        setPlans([])
        setTotalItems(0)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error fetching mitigation plans:", error)
      toast({
        title: "Error",
        description: "Failed to fetch mitigation plans",
        variant: "destructive",
      })
      setPlans([])
      setTotalItems(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const fetchRiskTemplates = async () => {
    setTemplatesLoading(true)
    try {
      const response = await fetch("/api/nist-csf-risk-templates?limit=100&includeInactive=false")
      const data = await response.json()

      if (data.success) {
        const templatesData = data.data?.templates || data.templates || data.data || []
        setRiskTemplates(Array.isArray(templatesData) ? templatesData : [])
      } else {
        setRiskTemplates([])
        toast({
          title: "Error",
          description: "Failed to fetch risk templates",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching risk templates:", error)
      setRiskTemplates([])
      toast({
        title: "Error",
        description: "Failed to fetch risk templates",
        variant: "destructive",
      })
    } finally {
      setTemplatesLoading(false)
    }
  }

  const fetchEvidence = async (planId: number) => {
    setEvidenceLoading(true)
    try {
      const response = await fetch(`/api/nist-csf-mitigation-plans/${planId}/evidence`)
      const data = await response.json()

      if (data.success) {
        setEvidenceList(data.data || [])
      } else {
        setEvidenceList([])
        toast({
          title: "Error",
          description: "Failed to fetch evidence",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching evidence:", error)
      setEvidenceList([])
      toast({
        title: "Error",
        description: "Failed to fetch evidence",
        variant: "destructive",
      })
    } finally {
      setEvidenceLoading(false)
    }
  }

  useEffect(() => {
    fetchRiskTemplates()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPlans()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, priorityFilter, templateFilter, currentPage])

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setUserRole("admin")
      } catch (error) {
        console.error("Error fetching user role:", error)
        setUserRole("user")
      }
    }
    fetchUserRole()
  }, [])

  const handleView = (plan: MitigationPlan) => {
    setSelectedPlan(plan)
    setIsViewDialogOpen(true)
  }

  const handleViewEvidence = (plan: MitigationPlan) => {
    setSelectedPlan(plan)
    fetchEvidence(plan.id)
    setIsEvidenceDialogOpen(true)
  }

  const resetForm = () => {
    setNewPlan({
      plan_name: "",
      template_id: "none",
      mitigation_strategy: "",
      assigned_owner: "",
      start_date: "",
      due_date: "",
      investment_amount: 0,
      priority: "Medium",
      notes: "",
    })
  }

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/nist-csf-mitigation-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPlan,
          template_id: newPlan.template_id === "none" ? null : Number(newPlan.template_id),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Mitigation plan created successfully",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchPlans()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error creating mitigation plan:", error)
      toast({
        title: "Error",
        description: "Failed to create mitigation plan",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (plan: MitigationPlan) => {
    setEditingPlan(plan)
    setNewPlan({
      plan_name: plan.plan_name,
      template_id: plan.template_id?.toString() || "none",
      mitigation_strategy: plan.mitigation_strategy,
      assigned_owner: plan.assigned_owner,
      start_date: plan.start_date ? plan.start_date.split("T")[0] : "",
      due_date: plan.due_date ? plan.due_date.split("T")[0] : "",
      investment_amount: plan.investment_amount,
      priority: plan.priority,
      notes: plan.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    setLoading(true);
    if (!editingPlan) return

    try {
      const response = await fetch(`/api/nist-csf-mitigation-plans/${editingPlan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPlan,
          template_id: newPlan.template_id === "none" ? null : Number(newPlan.template_id),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Mitigation plan updated successfully",
        })
        setIsEditDialogOpen(false)
        setEditingPlan(null)
        resetForm()
        fetchPlans()
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error("Error updating mitigation plan:", error)
      toast({
        title: "Error",
        description: "Failed to update mitigation plan",
        variant: "destructive",
      })
    }
    setLoading(false);
  }

  const handleStatusChange = async (plan: MitigationPlan, newStatus: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/nist-csf-mitigation-plans/${plan.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Status updated successfully",
        })
        fetchPlans()
      } else {
        if (data.requiresEvidence) {
          setIncompleteWithEvidence(true);
          toast({
            title: "Evidence Required",
            description: data.error,
            variant: "destructive",
          })
        } else {
          throw new Error(data.error)
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleEvidenceUpload = async () => {
    if (!evidenceFile || !selectedPlan) return

    setUploadingEvidence(true)
    try {
      const mockFilePath = `/uploads/evidence/nist/${selectedPlan.plan_id}/${evidenceFile.name}`

      const response = await fetch(`/api/nist-csf-mitigation-plans/${selectedPlan.id}/evidence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_name: evidenceFile.name,
          file_path: mockFilePath,
          file_size: evidenceFile.size,
          file_type: evidenceFile.type,
          uploaded_by: "Current User",
          description: evidenceDescription,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Evidence uploaded successfully",
        })
        setEvidenceFile(null)
        setEvidenceDescription("")
        fetchEvidence(selectedPlan.id)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error uploading evidence:", error)
      toast({
        title: "Error",
        description: "Failed to upload evidence",
        variant: "destructive",
      })
    } finally {
      setUploadingEvidence(false)
    }
  }

  const handleDeleteEvidence = async (evidenceId: number) => {
    if (!selectedPlan) return

    try {
      const response = await fetch(`/api/nist-csf-mitigation-plans/${selectedPlan.id}/evidence/${evidenceId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Evidence deleted successfully",
        })
        fetchEvidence(selectedPlan.id)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting evidence:", error)
      toast({
        title: "Error",
        description: "Failed to delete evidence",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (plan: MitigationPlan) => {
    if (userRole !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete mitigation plans",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/nist-csf-mitigation-plans/${plan.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Mitigation plan deleted successfully",
        })
        fetchPlans()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting mitigation plan:", error)
      toast({
        title: "Error",
        description: "Failed to delete mitigation plan",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-600 text-white"
      case "In Progress":
        return "bg-blue-600 text-white"
      case "Planning":
        return "bg-purple-600 text-white"
      case "On Hold":
        return "bg-gray-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-700"
      case "High":
        return "text-orange-500"
      case "Medium":
        return "text-yellow-500"
      case "Low":
        return "text-purple-500"
      default:
        return "text-blue-500"
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-700"
      case "High":
        return "text-orange-500"
      case "Medium":
        return "text-yellow-500"
      case "Low":
        return "text-purple-500"
      default:
        return "text-blue-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Planning":
        return <Target className="h-4 w-4" />
      case "On Hold":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const safePlans = Array.isArray(plans) ? plans : []

  const renderFormDialog = (isEdit = false) => (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit" : "Create New"} Mitigation Plan</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="plan_name">Plan Name *</Label>
          <Input
            id="plan_name"
            value={newPlan.plan_name}
            onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
            placeholder="Enter plan name"
            required
          />
        </div>

        <div>
          <Label htmlFor="template_id">Associated Risk Title</Label>
          <Select
            value={newPlan.template_id}
            onValueChange={(value) => {
              setNewPlan({ ...newPlan, template_id: value })
              // Auto-populate mitigation strategy if template is selected
              if (value !== "none") {
                const selectedTemplate = riskTemplates.find((t) => t.id.toString() === value)
                if (selectedTemplate && !newPlan.mitigation_strategy) {
                  setNewPlan((prev) => ({
                    ...prev,
                    template_id: value,
                    mitigation_strategy: `Mitigation plan for: ${selectedTemplate.template_name}`,
                  }))
                }
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Select a risk template"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No template selected</SelectItem>
              {riskTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{template.template_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.function_code} • {template.risk_level} Risk
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {newPlan.template_id !== "none" && (
            <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-900 rounded-md">
              {(() => {
                const selectedTemplate = riskTemplates.find((t) => t.id.toString() === newPlan.template_id)
                return selectedTemplate ? (
                  <div className="text-sm">
                    <div className="font-medium">{selectedTemplate.template_name}</div>
                    <div className="text-muted-foreground">{selectedTemplate.risk_description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getRiskLevelColor(selectedTemplate.risk_level)}>
                        {selectedTemplate.risk_level}
                      </Badge>
                      <span className="text-xs">
                        {selectedTemplate.function_code} - {selectedTemplate.function_name}
                      </span>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="mitigation_strategy">Mitigation Strategy *</Label>
          <Textarea
            id="mitigation_strategy"
            value={newPlan.mitigation_strategy}
            onChange={(e) => setNewPlan({ ...newPlan, mitigation_strategy: e.target.value })}
            placeholder="Describe the mitigation strategy"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assigned_owner">Action Owner *</Label>
                        <OwnerSelectInput formData={newPlan} setFormData={setNewPlan} fieldName="assigned_owner"/>                                            

            {/* <Input
              id="action_owner"
              value={newPlan.action_owner}
              onChange={(e) => setNewPlan({ ...newPlan, action_owner: e.target.value })}
>>>>>>> 92baca0 (Functionality -> Search from User Table for field like Action Owner, Asset Owner, Assigned_to)
              placeholder="Enter owner name"
              required
            /> */}
          </div>
          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={newPlan.priority} onValueChange={(value) => setNewPlan({ ...newPlan, priority: value })}>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={newPlan.start_date}
              onChange={(e) => setNewPlan({ ...newPlan, start_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={newPlan.due_date}
              onChange={(e) => setNewPlan({ ...newPlan, due_date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="investment_amount">Investment Amount ($)</Label>
            <Input
              id="investment_amount"
              type="number"
              value={newPlan.investment_amount}
              onChange={(e) => setNewPlan({ ...newPlan, investment_amount: Number(e.target.value) })}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={newPlan.notes}
            onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
            placeholder="Additional notes or comments"
            rows={2}
          />
        </div>

        {error !== "" &&
        <div className="flex mt-2 p-2 bg-red-900 rounded-md">
          <AlertTriangle className="mt-1 h-4 w-4 text-white-600" />
          <div className="pl-2" >{error}</div>
        </div>}


        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              if (isEdit) {
                setIsEditDialogOpen(false)
              } else {
                setIsCreateDialogOpen(false)
              }
              resetForm()
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={isEdit ? handleUpdate : handleCreate} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {isEdit ? "Update" : "Create"} Plan</Button>


        </div>
      </div>
    </DialogContent>
  )

  const handleImport = async () => {
    if (!importFile) return

    setImporting(true)
    try {
      const text = await importFile.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      const csvData = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        return row
      })

      const response = await fetch("/api/nist-csf-mitigation-plans/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvData }),
      })

      const data = await response.json()

      if (data.success) {
        setImportResults({ imported: data.imported, errors: data.errors })
        toast({
          title: "Import Successful",
          description: `Imported ${data.imported} plans with ${data.errors.length} errors`,
        })
        fetchPlans()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error importing plans:", error)
      toast({
        title: "Import Failed",
        description: "Failed to import mitigation plans",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async (format: "csv" | "template" = "csv") => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        format,
        search: searchTerm,
      })

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (priorityFilter !== "all") {
        params.append("priority", priorityFilter)
      }
      if (templateFilter !== "all") {
        params.append("templateId", templateFilter)
      }

      const response = await fetch(`/api/nist-csf-mitigation-plans/export?${params}`)
      const data = await response.json()

      if (data.success) {
        const csvContent = convertToCSV(data.data)
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `nist-csf-mitigation-plans-${format}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Export Successful",
          description: `Exported ${data.data.length} plans`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error exporting plans:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export mitigation plans",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
      setIsExportDialogOpen(false)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ]

    return csvRows.join("\n")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                NIST CSF Mitigation Plans
              </CardTitle>
              <CardDescription>Track and manage cybersecurity risk mitigation initiatives</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">
                If the mitigation is completed, please upload evidence to mark the status complete.
              </p>
            </div>
            <Badge variant={userRole === "admin" ? "default" : "secondary"}>
              {userRole === "admin" ? "Admin Access" : "User Access"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={templateFilter} onValueChange={setTemplateFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Risk Title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  {riskTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.template_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={fetchPlans} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
               
              </Button>

              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                      Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Mitigation Plans</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="import-file">Select CSV File</Label>
                      <Input
                        id="import-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button onClick={() => handleExport("template")}>
                        Download Template
                      </Button>
                      <Button onClick={handleImport} disabled={!importFile || importing}>
                        {importing ? "Importing..." : "Import"}
                      </Button>
                    </div>
                    {importResults && (
                      <div className="mt-4 p-4 bg-gray-50 rounded">
                        <p className="font-medium">Import Results:</p>
                        <p>Successfully imported: {importResults.imported}</p>
                        <p>Errors: {importResults.errors.length}</p>
                        {importResults.errors.length > 0 && (
                          <div className="mt-2 max-h-32 overflow-y-auto">
                            {importResults.errors.map((error, index) => (
                              <p key={index} className="text-sm text-red-600">
                                {error}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Mitigation Plans</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Export will include all plans matching your current filters.
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button onClick={() => setIsExportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleExport("csv")} disabled={exporting}>
                        {exporting ? "Exporting..." : "Export CSV"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    New Plan
                  </Button>
                </DialogTrigger>
                {renderFormDialog(false)}
              </Dialog>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Total Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{totalItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {safePlans.filter((p) => p.status === "In Progress").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {safePlans.filter((p) => p.status === "Completed").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  Total Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ${safePlans.reduce((sum, p) => sum + Number(p.investment_amount), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2">Loading mitigation plans...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="truncate">Plan ID</TableHead>
                    <TableHead className="truncate">Plan Name</TableHead>
                    <TableHead className="truncate">Risk Title</TableHead>
                    <TableHead className="truncate">Status</TableHead>
                    <TableHead className="truncate">Priority</TableHead>
                    <TableHead className="truncate">Progress</TableHead>
                    <TableHead className="truncate">Owner</TableHead>
                    <TableHead className="truncate">Start Date</TableHead>
                    <TableHead className="truncate">Due Date</TableHead>
                    <TableHead className="truncate">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safePlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No mitigation plans found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    safePlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-mono text-sm truncate">{plan.plan_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{plan.plan_name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {plan.mitigation_strategy}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {plan.template_name ? (
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{plan.template_name}</div>
                              <div className="flex items-center gap-2 truncate">
                                {plan.risk_level && (
                                  <Badge className={getRiskLevelColor(plan.risk_level)} variant="outline">
                                    {plan.risk_level}
                                  </Badge>
                                )}
                                {plan.function_code && (
                                  <span className="text-xs text-muted-foreground">{plan.function_code}</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No template</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(plan.status)}
                            <Select value={plan.status} onValueChange={(value) => handleStatusChange(plan, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue>
                                  <Badge className={`${getStatusColor(plan.status)} truncate`}>{plan.status}</Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Planning">Planning</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="truncate">
                          <Badge variant="outline" className={getPriorityColor(plan.priority)}>{plan.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={plan.progress_percentage} className="w-16" />
                            <div className="text-xs text-muted-foreground">{plan.progress_percentage}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-xs">{plan.assigned_owner}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {plan.start_date ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{new Date(plan.start_date).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No Start date</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {plan.due_date ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{new Date(plan.due_date).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No due date</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(plan)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewEvidence(plan)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(plan)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {userRole === "admin" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                      variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Mitigation Plan</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{plan.plan_name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(plan)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {safePlans.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mitigation Plan Details</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Plan ID</Label>
                  <p className="text-sm bg-gray-900 font-mono p-2 rounded">{selectedPlan.plan_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Plan Name</Label>
                  <p className="text-sm bg-gray-900 font-semibold p-2">{selectedPlan.plan_name}</p>
                </div>
              </div>

              {selectedPlan.template_name && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Associated Risk Title</Label>
                  <div className="mt-1 bg-gray-900 p-3 rounded-lg">
                    <div className="font-medium">{selectedPlan.template_name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedPlan.risk_level && (
                        <Badge variant="outline" className={getRiskLevelColor(selectedPlan.risk_level)}>{selectedPlan.risk_level}</Badge>
                      )}
                      {selectedPlan.function_code && (
                        <span className="text-sm text-muted-foreground">
                          {selectedPlan.function_code} - {selectedPlan.function_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Mitigation Strategy</Label>
                <p className="text-sm bg-gray-900 mt-1 p-3 rounded">{selectedPlan.mitigation_strategy}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2 mt-1 p-3">
                    {getStatusIcon(selectedPlan.status)}
                    <Badge className={getStatusColor(selectedPlan.status)}>{selectedPlan.status}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                  <div className="flex items-center p-2">
                    <Badge variant="outline" className={`mt-1 ${getPriorityColor(selectedPlan.priority)}`}>{selectedPlan.priority}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
                  <div className="mt-1 p-3">
                    <Progress value={selectedPlan.progress_percentage} className="w-full" />
                    <div className="text-sm text-muted-foreground mt-1">{selectedPlan.progress_percentage}%</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Investment Amount</Label>
                  <div className="text-sm font-semibold mt-1">${selectedPlan.investment_amount.toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Residual Risk Level</Label>
                  <div>
                    <Badge variant="outline" className={`mt-1 ${getRiskLevelColor(selectedPlan.residual_risk_level)}`}>
                      {selectedPlan.residual_risk_level}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Action Owner</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{selectedPlan.assigned_owner}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                  {selectedPlan.start_date ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(selectedPlan.start_date).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center p-2 mb-2">
                      <span className="text-sm text-muted-foreground mt-1">No start date set</span>
                    </div>
                  )}

                  <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
                  {selectedPlan.due_date ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(selectedPlan.due_date).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground mt-1">No due date set</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedPlan.notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                  <p className="text-sm mt-1 bg-gray-900 p-3 rounded">{selectedPlan.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm">{new Date(selectedPlan.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">{new Date(selectedPlan.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {renderFormDialog(true)}
      </Dialog>

      {/* Evidence Dialog */}
      <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Evidence Management - {selectedPlan?.plan_name}
            </DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-6">
              {selectedPlan.status !== "Completed" && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    If the mitigation is completed, please upload evidence to mark the status complete.
                  </AlertDescription>
                </Alert>
              )}

              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Evidence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="evidence-file">Select File</Label>
                    <Input
                      id="evidence-file"
                      type="file"
                      onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                  </div>
                  <div>
                    <Label htmlFor="evidence-description">Description</Label>
                    <Textarea
                      id="evidence-description"
                      value={evidenceDescription}
                      onChange={(e) => setEvidenceDescription(e.target.value)}
                      placeholder="Describe the evidence..."
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleEvidenceUpload}
                    disabled={!evidenceFile || uploadingEvidence}
                    className="w-full"
                  >
                    {uploadingEvidence ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Evidence
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Evidence List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded Evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  {evidenceLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
                      <span className="ml-2">Loading evidence...</span>
                    </div>
                  ) : evidenceList.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No evidence uploaded yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {evidenceList.map((evidence) => (
                        <div key={evidence.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                              <div className="font-medium">{evidence.file_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatFileSize(evidence.file_size)} • {evidence.file_type}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Uploaded by {evidence.uploaded_by} on{" "}
                                {new Date(evidence.upload_date).toLocaleDateString()}
                              </div>
                              {evidence.description && (
                                <div className="text-sm text-muted-foreground mt-1">{evidence.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 bg-transparent"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Evidence</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{evidence.file_name}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEvidence(evidence.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isIncompletWithEvidence} onOpenChange={setIncompleteWithEvidence}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
                Upload Evidence
              </DialogTitle>
          </DialogHeader>
          If the mitigation is completed, please upload evidence to mark the status complete.
        </DialogContent>
      </Dialog>
    </div>
  )
}
