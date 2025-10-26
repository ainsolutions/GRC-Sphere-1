"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Shield,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Building,
  Target,
  FileUp,
  Save,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createIncident, updateIncident, getIncidents, searchAssets, searchRisks } from "@/lib/actions/incident-actions"
import { IncidentChatbot } from "@/components/incident-chatbot"
import { IncidentDashboard } from "@/components/incident-dashboard"
import OwnerSelectInput from "@/components/owner-search-input"
import RiskSelectInput from "@/components/risk-search-input"
import StarBorder from "../StarBorder"
import { ActionButtons } from "@/components/ui/action-buttons"
import AssetSelectInput from "@/components/asset-search-input"

interface Incident {
  id: number
  incident_id: string
  incident_title: string
  incident_description: string
  incident_type: string
  severity: "Critical" | "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  reported_by: string
  assigned_to: string
  reported_date: string
  detected_date?: string
  related_asset_id?: number
  related_risk_id?: number
  asset_name?: string
  title?: string
  created_at: string
  updated_at: string
}

interface Asset {
  id: number
  asset_id: string
  asset_name: string
  asset_type: string
  criticality: string
}

interface Risk {
  id: number
  risk_id: string
  title: string
  description: string
  status: string
  risk_score: number
}

interface RemediationAction {
  id: number
  remediation_id: string
  incident_id: string
  remediation_title: string
  remediation_description: string
  remediation_type: string
  status: string
  priority: string
  assigned_to: string
  assigned_email?: string
  responsible_department: string
  responsible_manager?: string
  start_date: string
  target_completion_date: string
  actual_completion_date?: string
  progress_percentage: number
  estimated_effort_hours?: number
  actual_effort_hours?: number
  estimated_cost: string
  actual_cost?: string
  budget_approved: boolean
  budget_approval_date?: string
  risk_before_remediation: string
  risk_after_remediation?: string
  business_impact_assessment: string
  verification_status: string
  verification_date?: string
  verified_by?: string
  verification_method?: string
  verification_evidence?: string
  success_criteria: string
  effectiveness_rating?: number
  lessons_learned?: string
  last_update_date: string
  next_review_date?: string
  escalation_required: boolean
  escalation_date?: string
  escalation_reason?: string
  supporting_documents?: string
  evidence_files?: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by?: string
  // Joined fields from incidents table
  incident_identifier?: string
  incident_title?: string
  incident_type?: string
  incident_severity?: string
  is_overdue?: boolean
}

interface RemediationForm {
  incident_id: string
  action_taken: string
  action_date: string
  evidence_file?: File
  estimated_cost: string
  actual_cost: string
  target_resolution_date: string
  actual_resolution_date: string
  root_cause: string
  lessons_learned: string
  risk_id: string
  remediation_type: string
}

interface IncidentForm {
  incident_id: string
  incident_title: string
  incident_description: string
  incident_type: string
  severity: string
  status: string
  reported_by: string
  assigned_to: string
  reported_date: string
  detected_date: string
  related_asset_id: string
  related_risk_id: string
}

const severityColors = {
  Critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  Low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
}

const statusColors = {
  Open: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  Resolved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
}

const incidentTypes = [
  "Security Breach",
  "System Failure",
  "Phishing",
  "Malware",
  "Data Loss",
  "Performance",
  "Network",
  "Application Error",
  "Hardware Failure",
  "Unauthorized Access",
  "Other",
]

const severityLevels = ["Critical", "High", "Medium", "Low"]
const statusOptions = ["Open", "In Progress", "Resolved", "Closed"]

const remediationTypes = [
  "Root Cause Fix",
  "Process Improvement",
  "Control Enhancement",
  "Training",
  "Policy Update",
  "System Upgrade",
  "Monitoring Enhancement",
]

// Generate incremental incident ID
export function generateIncidentId(): string {
  const currentYear = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `INCT-${currentYear}-${timestamp}`
}

// Helper function to format date for input fields
function formatDateForInput(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return ""

  try {
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return ""

    // Format as YYYY-MM-DD for input[type="date"]
    return date.toISOString().split("T")[0]
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [assets, setAssets] = useState<Asset[]>([])
  const [risks, setRisks] = useState<Risk[]>([])
  const [assetSearchTerm, setAssetSearchTerm] = useState("")
  const [riskSearchTerm, setRiskSearchTerm] = useState("")
  const [remediationActions, setRemediationActions] = useState<RemediationAction[]>([])
  const [isRemediationDialogOpen, setIsRemediationDialogOpen] = useState(false)
  const [iso27001Risks, setIso27001Risks] = useState<Risk[]>([])
  const [remediationForm, setRemediationForm] = useState<RemediationForm>({
    incident_id: "",
    action_taken: "",
    action_date: new Date().toISOString().split("T")[0],
    estimated_cost: "",
    actual_cost: "",
    target_resolution_date: "",
    actual_resolution_date: "",
    root_cause: "",
    lessons_learned: "",
    risk_id: "",
    remediation_type: "Root Cause Fix",
  })
  const [formData, setFormData] = useState<IncidentForm>({
    incident_id: "",
    incident_title: "",
    incident_description: "",
    incident_type: "",
    severity: "",
    status: "Open",
    reported_by: "",
    assigned_to: "",
    reported_date: new Date().toISOString().split("T")[0],
    detected_date: "",
    related_asset_id: "",
    related_risk_id: "",
  })

  const loadRemediationActions = async () => {
    try {
      const response = await fetch("/api/incident-remediation")
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setRemediationActions(Array.isArray(result.data) ? result.data : [])
        } else {
          console.error("Failed to load remediation actions: Invalid response format")
          setRemediationActions([])
        }
      } else {
        console.error("Failed to load remediation actions: HTTP", response.status)
        setRemediationActions([])
      }
    } catch (error) {
      console.error("Failed to load remediation actions:", error)
      setRemediationActions([])
    }
  }

  const loadIso27001Risks = async () => {
    try {
      const response = await fetch("/api/iso27001-risks");
      if (response.ok) {
        const { success, data } = await response.json();
        if (success && Array.isArray(data)) {
          setIso27001Risks(data);
        } else {
          setIso27001Risks([]); // fallback to empty array
        }
      }
    } catch (error) {
      console.error("Failed to load ISO27001 risks:", error);
      setIso27001Risks([]);
    }
  };

  // Load incidents on component mount
  useEffect(() => {
    loadIncidents()
    loadRemediationActions()
    loadIso27001Risks()
  }, [])

  useEffect(() => {
    async function loadDropdownData() {
      try {
        const [assetsRes, risksRes] = await Promise.all([
          fetch("/api/assets/lookup", { cache: "no-store" }),
          fetch("/api/risks/lookup", { cache: "no-store" }),
        ]);

        if (!assetsRes.ok || !risksRes.ok) {
          console.error("Failed to fetch one or more dropdown sources");
          return;
        }

        const assetsJson = await assetsRes.json();
        const risksJson = await risksRes.json();

        // Normalize in case backend wraps data
        const assetsArray = Array.isArray(assetsJson.data)
          ? assetsJson.data
          : Array.isArray(assetsJson)
          ? assetsJson
          : [];
        const risksArray = Array.isArray(risksJson.data)
          ? risksJson.data
          : Array.isArray(risksJson)
          ? risksJson
          : [];

        setAssets(assetsArray);
        setRisks(risksArray);

        console.log("Assets loaded:", assetsArray.length);
        console.log("Risks loaded:", risksArray.length);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    }

    loadDropdownData();
  }, []);



  // Filter incidents based on search and filters
  useEffect(() => {
    let filtered = incidents

    if (searchTerm) {
      filtered = filtered.filter(
        (incident) =>
          incident.incident_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.incident_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.incident_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((incident) => incident.severity === severityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((incident) => incident.status === statusFilter)
    }

    setFilteredIncidents(filtered)
  }, [incidents, searchTerm, severityFilter, statusFilter])

  const loadIncidents = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/incidents")
      if (!res.ok) throw new Error("Failed to load incidents")

      // ---- UNWRAP BOTH LAYERS ----
      const json = await res.json()
      const incidentsArray = json?.data?.data ?? []

      // Now incidentsArray is a real array
      setIncidents(incidentsArray)

    } catch (error) {
      console.error("Error loading incidents:", error)
      toast({
        title: "Error",
        description: "Failed to load incidents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  const handleAssetSearch = async (searchTerm: string) => {
    if (searchTerm.length > 2) {
      try {
        const result = await searchAssets(searchTerm)
        if (result.success) {
          setAssets(result.data)
        }
      } catch (error) {
        console.error("Failed to search assets:", error)
      }
    } else {
      setAssets([])
    }
  }

  const handleRiskSearch = async (searchTerm: string) => {
    if (searchTerm.length > 2) {
      try {
        const result = await searchRisks(searchTerm)
        if (result.success) {
          setRisks(result.data)
        }
      } catch (error) {
        console.error("Failed to search risks:", error)
      }
    } else {
      setRisks([])
    }
  }

  const resetForm = () => {
    setFormData({
      incident_id: generateIncidentId(),
      incident_title: "",
      incident_description: "",
      incident_type: "",
      severity: "",
      status: "Open",
      reported_by: "",
      assigned_to: "",
      reported_date: new Date().toISOString().split("T")[0],
      detected_date: "",
      related_asset_id: "",
      related_risk_id: "",
    })
  }

  const handleCreateIncident = async () => {
    try {
      const result = await createIncident(formData) // send JSON directly
      if (result.success) {
        toast({ title: "Success", description: "Incident created successfully" })
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    }
    catch (error) {
      toast({
        title: "Error",
        description: "Failed to create incident",
        variant: "destructive",
      })
    }
  }

  const handleEditIncident = async () => {
    if (!selectedIncident) return

    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value.toString())
      })

      const result = await updateIncident(selectedIncident.id, form)
      if (result.success) {
        setIsEditDialogOpen(false)
        setSelectedIncident(null)
        resetForm()
        loadIncidents()
        toast({
          title: "Success",
          description: "Incident updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update incident",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update incident",
        variant: "destructive",
      })
    }
  }

  const handleCreateRemediationAction = async () => {
    try {
      const formDataToSend = new FormData()
      Object.entries(remediationForm).forEach(([key, value]) => {
        if (key === "evidence_file" && value instanceof File) {
          formDataToSend.append(key, value)
        } else if (value) {
          formDataToSend.append(key, value.toString())
        }
      })

      const response = await fetch("/api/incident-remediation", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        setIsRemediationDialogOpen(false)
        resetRemediationForm()
        loadRemediationActions()
        toast({
          title: "Success",
          description: "Remediation action created successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to create remediation action",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create remediation action",
        variant: "destructive",
      })
    }
  }

  const resetRemediationForm = () => {
    setRemediationForm({
      incident_id: "",
      action_taken: "",
      action_date: new Date().toISOString().split("T")[0],
      estimated_cost: "",
      actual_cost: "",
      target_resolution_date: "",
      actual_resolution_date: "",
      root_cause: "",
      lessons_learned: "",
      risk_id: "",
      remediation_type: "Root Cause Fix",
    })
  }

  const openRemediationDialog = () => {
    resetRemediationForm()
    setIsRemediationDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (incident: Incident) => {
    setSelectedIncident(incident)
    setFormData({
      incident_id: incident.incident_id,
      incident_title: incident.incident_title,
      incident_description: incident.incident_description,
      incident_type: incident.incident_type,
      severity: incident.severity,
      status: incident.status,
      reported_by: incident.reported_by,
      assigned_to: incident.assigned_to,
      reported_date: formatDateForInput(incident.reported_date),
      detected_date: formatDateForInput(incident.detected_date),
      related_asset_id: incident.related_asset_id?.toString() || "",
      related_risk_id: incident.related_risk_id?.toString() || "",
    })
    setIsEditDialogOpen(true)
  }

  const totalIncidents = incidents.length
  const openIncidents = incidents.filter((i) => i.status === "Open").length
  const criticalIncidents = incidents.filter((i) => i.severity === "Critical").length
  const inProgressIncidents = incidents.filter((i) => i.status === "In Progress").length

  if (loading) {
    return (

      <main className="flex-1 overflow-y-auto space-y-4 p-4 md:p-8 pt-6 bg-transparent backdrop-blur-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading incidents...</p>
          </div>

        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="flex-1 overflow-y-auto space-y-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold">
              Incident Management</h1>
            <p className="text-muted-foreground">Track and manage security incidents across your organization</p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" onClick={openCreateDialog}>
                  Report Incident
                </Button>

              </DialogTrigger>
              <DialogContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Report New Incident</DialogTitle>
                  <DialogDescription>
                    Create a new security incident report to track and manage the response.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="incident_id">Incident ID</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="incident_id"
                            value={formData.incident_id}
                            onChange={(e) => setFormData({ ...formData, incident_id: e.target.value })}
                            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                            placeholder="INCT-YYYY-XXXXXX"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setFormData({ ...formData, incident_id: generateIncidentId() })}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incident_title">Incident Title *</Label>
                        <Input
                          id="incident_title"
                          value={formData.incident_title}
                          onChange={(e) => setFormData({ ...formData, incident_title: e.target.value })}
                          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                          placeholder="Brief incident title"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incident_description">Description *</Label>
                      <Textarea
                        id="incident_description"
                        value={formData.incident_description}
                        onChange={(e) => setFormData({ ...formData, incident_description: e.target.value })}
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                        placeholder="Detailed incident description"
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Classification</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="incident_type">Incident Type *</Label>
                        <Select
                          value={formData.incident_type}
                          onValueChange={(value) => setFormData({ ...formData, incident_type: value })}
                        >
                          <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                            {incidentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity">Severity *</Label>
                        <Select
                          value={formData.severity}
                          onValueChange={(value) => setFormData({ ...formData, severity: value })}
                        >
                          <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                            {severityLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Assignment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reported_by">Reported By *</Label>
                        <Input
                          id="reported_by"
                          value={formData.reported_by}
                          onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                          placeholder="Reporter name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assigned_to">Assigned To *</Label>
                        <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="assigned_to" />
                        {/* <Input
                            id="assigned_to"
                            value={formData.assigned_to}
                            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                            placeholder="Assignee name"
                            required
                          /> */}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Timeline</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reported_date">Reported Date *</Label>
                        <Input
                          id="reported_date"
                          type="date"
                          value={formData.reported_date}
                          onChange={(e) => setFormData({ ...formData, reported_date: e.target.value })}
                          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detected_date">Detected Date</Label>
                        <Input
                          id="detected_date"
                          type="date"
                          value={formData.detected_date}
                          onChange={(e) => setFormData({ ...formData, detected_date: e.target.value })}
                          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Related Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Related Items</h3>
                    <div className="grid grid-cols-2 gap-4">

                      {/* Related Asset Dropdown */}
                      <div className="space-y-2">
                        <Label htmlFor="related_asset">Related Asset</Label>
                        <AssetSelectInput formData={formData} setFormData={setFormData} fieldName="related_asset_id" />
                        {/* <Select
                          value={formData.related_asset_id}
                          onValueChange={(value) => setFormData({ ...formData, related_asset_id: value })}
                        >
                          <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20 max-h-64 overflow-y-auto">
                            {assets.length > 0 ? (
                              assets.map((asset) => (
                                <SelectItem key={asset.id} value={asset.id.toString()}>
                                  {asset.asset_name} ({asset.asset_id}) – {asset.asset_type}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No assets available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select> */}
                      </div>

                      {/* Related Risk Search */}
                      <div className="space-y-2">
                        <Label htmlFor="related_risk">Related Risk</Label>
                        <RiskSelectInput
                          formData={formData}
                          setFormData={setFormData}
                          fieldName="related_risk_id"
                          onRiskSelected={(risk) => {
                            // Store the risk ID for backend
                            setFormData({ 
                              ...formData, 
                              related_risk_id: risk.id 
                            });
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Search across ISO27001, NIST CSF, and FAIR risks
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateIncident}
                  >
                    Create Incident
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Total Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidents}</div>
              <p className="text-xs text-muted-foreground">All reported incidents</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Open Incidents</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openIncidents}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Critical Incidents</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalIncidents}</div>
              <p className="text-xs text-muted-foreground">High priority incidents</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressIncidents}</div>
              <p className="text-xs text-muted-foreground">Being investigated</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <IncidentDashboard incidents={incidents} />
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>Search, filter, and manage security incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search incidents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      {severityLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Incidents Table */}
            <Card>
              <CardHeader>
                <CardTitle>Incidents ({filteredIncidents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Reported Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                          >
                            {incident.incident_id}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{incident.incident_title}</div>
                            <div className="text-sm text-muted-foreground">
                              {incident.incident_description.substring(0, 60)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                          >
                            {incident.incident_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={severityColors[incident.severity]}>{incident.severity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[incident.status]}>{incident.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <User className="mr-1 h-3 w-3" />
                            {incident.assigned_to}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(incident.reported_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <ActionButtons isTableAction={true}
                              onView={() => { }}
                              onEdit={() => openEditDialog(incident)}
                              onDelete={() => { }}
                                actionObj={incident}
                              deleteDialogTitle={incident.asset_name}
                            />
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openEditDialog(incident)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remediation" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Remediation Tracking</CardTitle>
                    <CardDescription>Track remediation actions and progress for incidents</CardDescription>
                  </div>
                  <Dialog open={isRemediationDialogOpen} onOpenChange={setIsRemediationDialogOpen}>
                    <DialogTrigger asChild>
                      <ActionButtons isTableAction={false} onAdd={openRemediationDialog} btnAddText="Add Remediation Action" />
                      {/* <Button
                        variant="outline"
                        onClick={openRemediationDialog}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Remediation Action
                      </Button> */}
                    </DialogTrigger>
                    <DialogContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Remediation Action</DialogTitle>
                        <DialogDescription>Create a new remediation action for an incident</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        {/* Incident Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Incident Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="incident_select">Incident *</Label>
                              <Select
                                value={remediationForm.incident_id}
                                onValueChange={(value) => {
                                  const incident = incidents.find((i) => i.incident_id === value)
                                  setRemediationForm({
                                    ...remediationForm,
                                    incident_id: value,
                                  })
                                }}
                              >
                                <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                                  <SelectValue placeholder="Select incident" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                                  {incidents.map((incident) => (
                                    <SelectItem key={incident.id} value={incident.incident_id}>
                                      {incident.incident_id} - {incident.incident_title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="risk_id">Related Risk</Label>
                              <RiskSelectInput
                                formData={remediationForm}
                                setFormData={setRemediationForm}
                                fieldName="risk_id"
                                onRiskSelected={(risk) => {
                                  // Store the risk ID for backend
                                  setRemediationForm({ 
                                    ...remediationForm, 
                                    risk_id: risk.id 
                                  });
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Search across ISO27001, NIST CSF, and FAIR risks
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Remediation Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Remediation Details</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="action_taken">Action Taken *</Label>
                              <Textarea
                                id="action_taken"
                                value={remediationForm.action_taken}
                                onChange={(e) =>
                                  setRemediationForm({ ...remediationForm, action_taken: e.target.value })
                                }
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                placeholder="Describe the remediation action taken"
                                rows={3}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="action_date">Action Date *</Label>
                                <Input
                                  id="action_date"
                                  type="date"
                                  value={remediationForm.action_date}
                                  onChange={(e) =>
                                    setRemediationForm({ ...remediationForm, action_date: e.target.value })
                                  }
                                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="evidence_file">Evidence Upload</Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id="evidence_file"
                                    type="file"
                                    onChange={(e) =>
                                      setRemediationForm({
                                        ...remediationForm,
                                        evidence_file: e.target.files?.[0],
                                      })
                                    }
                                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  />
                                  <FileUp className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cost and Timeline */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Cost and Timeline</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="estimated_cost">Estimated Cost</Label>
                              <Input
                                id="estimated_cost"
                                type="number"
                                step="0.01"
                                value={remediationForm.estimated_cost}
                                onChange={(e) =>
                                  setRemediationForm({ ...remediationForm, estimated_cost: e.target.value })
                                }
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                placeholder="0.00"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="actual_cost">Actual Cost</Label>
                              <Input
                                id="actual_cost"
                                type="number"
                                step="0.01"
                                value={remediationForm.actual_cost}
                                onChange={(e) =>
                                  setRemediationForm({ ...remediationForm, actual_cost: e.target.value })
                                }
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                placeholder="0.00"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="target_resolution_date">Target Resolution Date *</Label>
                              <Input
                                id="target_resolution_date"
                                type="date"
                                value={remediationForm.target_resolution_date}
                                onChange={(e) =>
                                  setRemediationForm({ ...remediationForm, target_resolution_date: e.target.value })
                                }
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="actual_resolution_date">Actual Resolution Date</Label>
                              <Input
                                id="actual_resolution_date"
                                type="date"
                                value={remediationForm.actual_resolution_date}
                                onChange={(e) =>
                                  setRemediationForm({ ...remediationForm, actual_resolution_date: e.target.value })
                                }
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Analysis */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Analysis</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="root_cause">Root Cause *</Label>
                              <Textarea
                                id="root_cause"
                                value={remediationForm.root_cause}
                                onChange={(e) =>
                                  setRemediationForm({ ...remediationForm, root_cause: e.target.value })
                                }
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                placeholder="Describe the root cause of the incident"
                                rows={3}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lessons_learned">Lessons Learned *</Label>
                              <Textarea
                                id="lessons_learned"
                                value={remediationForm.lessons_learned}
                                onChange={(e) =>
                                  setRemediationForm({ ...remediationForm, lessons_learned: e.target.value })
                                }
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                                placeholder="Document lessons learned from this incident"
                                rows={3}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        {/* Remediation Type */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Remediation Type</h3>
                          <div className="space-y-2">
                            <Label htmlFor="remediation_type">Remediation Type *</Label>
                            <Select
                              value={remediationForm.remediation_type}
                              onValueChange={(value) =>
                                setRemediationForm({ ...remediationForm, remediation_type: value })
                              }
                            >
                              <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                                <SelectValue placeholder="Select remediation type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                                {remediationTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsRemediationDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateRemediationAction}
                          variant="outline"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Remediation Action
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident ID</TableHead>
                      <TableHead>Remediation Title</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Target Completion</TableHead>
                      <TableHead>Actual Completion</TableHead>
                      <TableHead>Cost (Est/Actual)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remediationActions.map((action) => {
                      const isCompleted = action.actual_completion_date
                      const isOverdue = action.is_overdue || (!isCompleted && new Date(action.target_completion_date) < new Date())

                      return (
                        <TableRow key={action.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                            >
                              {action.incident_identifier || action.incident_id || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium truncate">{action.remediation_title}</div>
                              <div className="text-sm text-muted-foreground">
                                {action.remediation_description.substring(0, 50)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(action.start_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Target className="mr-1 h-3 w-3" />
                              {new Date(action.target_completion_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {action.actual_completion_date ? (
                              <div className="flex items-center text-sm text-green-600">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(action.actual_completion_date).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>${parseFloat(action.estimated_cost || "0").toLocaleString()}</div>
                              <div className="text-muted-foreground">
                                ${parseFloat(action.actual_cost || "0").toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                isCompleted
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : isOverdue
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }
                            >
                              {isCompleted ? "Completed" : isOverdue ? "Overdue" : action.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <ActionButtons isTableAction={true}
                                onView={() => { }}
                                onEdit={() => {}}
                                actionObj={action}
                                //onDelete={() => {}}
                                //deleteDialogTitle={action.incident_title}
                              />
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog - Similar structure to Create Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Incident</DialogTitle>
              <DialogDescription>Update the incident details and status.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Same form structure as create dialog but with edit data */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_incident_id">Incident ID</Label>
                    <Input
                      id="edit_incident_id"
                      value={formData.incident_id}
                      onChange={(e) => setFormData({ ...formData, incident_id: e.target.value })}
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                      placeholder="INCT-YYYY-XXXXXX"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_incident_title">Incident Title *</Label>
                    <Input
                      id="edit_incident_title"
                      value={formData.incident_title}
                      onChange={(e) => setFormData({ ...formData, incident_title: e.target.value })}
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_incident_description">Description *</Label>
                  <Textarea
                    id="edit_incident_description"
                    value={formData.incident_description}
                    onChange={(e) => setFormData({ ...formData, incident_description: e.target.value })}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Classification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Classification</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_incident_type">Incident Type *</Label>
                    <Select
                      value={formData.incident_type}
                      onValueChange={(value) => setFormData({ ...formData, incident_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                        {incidentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_severity">Severity *</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value) => setFormData({ ...formData, severity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                        {severityLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20">
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Assignment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_reported_by">Reported By *</Label>
                    <Input
                      id="edit_reported_by"
                      value={formData.reported_by}
                      onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_assigned_to">Assigned To *</Label>
                    <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="assigned_to" />
                    {/* <Input
                        id="edit_assigned_to"
                        value={formData.assigned_to}
                        onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                        required
                      /> */}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Timeline</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_reported_date">Reported Date *</Label>
                    <Input
                      id="edit_reported_date"
                      type="date"
                      value={formData.reported_date}
                      onChange={(e) => setFormData({ ...formData, reported_date: e.target.value })}
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_detected_date">Detected Date</Label>
                    <Input
                      id="edit_detected_date"
                      type="date"
                      value={formData.detected_date}
                      onChange={(e) => setFormData({ ...formData, detected_date: e.target.value })}
                      className=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditIncident}>
                Update Incident
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      {/* Incident Chatbot */}
      <IncidentChatbot onIncidentCreated={loadIncidents} />
    </div>
  )
}
