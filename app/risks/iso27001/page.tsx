"use client"

//#region Imports
import { useState, useEffect } from "react"

import { ISO27001RiskHeatmap } from "@/components/iso27001-risk-heatmap"
import { ISO27001TreatmentTracker } from "@/components/iso27001-treatment-tracker"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"

import {
  AlertTriangle,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Shield,
  TrendingUp,
  TrendingDown,
  Star,
  Loader2,
  X,
  Save,
  DeleteIcon as Cancel,
  FileText,
  Paperclip,
  Settings,
  UserCheck,
  Lock,
} from "lucide-react"
import { toast } from "sonner"
import {
  getISO27001Risks,
  createISO27001Risk,
  deleteISO27001Risk,
  updateISO27001Risk,
  type ISO27001Risk, importISO27001Risks, exportISO27001Risks
} from "@/lib/actions/iso27001-actions"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import OwnerSelectInput from "@/components/owner-search-input"
import ThreatSelectInput from "@/components/threat-search-input"
import ControlSelectInput from "@/components/control-search-input"
import StarBorder from "@/app/StarBorder"
import ExportButton from "@/components/export-button"
import { ActionButtons } from "@/components/ui/action-buttons"

//#endregion

//#region Interface
interface ControlEffectiveness {
  controlId: string
  effectiveness: number // 1-5 rating
}

interface Evidence {
  id: number
  risk_id: number
  control_id?: string
  file_name: string
  file_type: string
  file_size: number
  description?: string
  uploaded_by: string
  created_at: string
}

interface ValidationRules {
  require_evidence_for_mitigated: boolean
  require_evidence_for_accepted: boolean
}

interface FrontendRisk {
  id: string
  riskId: string
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  riskScore: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Mitigated" | "Accepted"
  owner: string
  threat?: string
  treatmentPlan?: string
  residualLikelihood: number
  residualImpact: number
  residualRisk: number
  lastReviewed: string
  nextReview: string
  controls: string[]
  controlEffectiveness: ControlEffectiveness[]
  assets: string[]
  controlAssessment?: string
  existingControls?: string
  riskTreatment?: string
  reviewDate?: string
  evidence?: Evidence[]
}
//#endregion

const riskCategories = [
  "Access Control",
  "Asset Management",
  "Cryptography",
  "Physical Security",
  "Operations Security",
  "Communications Security",
  "System Acquisition",
  "Supplier Relationships",
  "Incident Management",
  "Business Continuity",
  "Compliance",
]

const riskTreatmentStrategies = [
  "Mitigate - Reduce likelihood/impact",
  "Transfer - Share or transfer risk",
  "Accept - Accept the risk as is",
  "Avoid - Eliminate the risk source",
]

const iso27001Controls = [
  "A.5.1.1 - Information Security Policies",
  "A.5.1.2 - Review of Information Security Policies",
  "A.6.1.1 - Information Security Roles and Responsibilities",
  "A.6.1.2 - Segregation of Duties",
  "A.6.1.3 - Contact with Authorities",
  "A.6.1.4 - Contact with Special Interest Groups",
  "A.6.1.5 - Information Security in Project Management",
  "A.6.2.1 - Mobile Device Policy",
  "A.6.2.2 - Teleworking",
  "A.7.1.1 - Screening",
  "A.7.1.2 - Terms and Conditions of Employment",
  "A.7.2.1 - Management Responsibilities",
  "A.7.2.2 - Information Security Awareness, Education and Training",
  "A.7.2.3 - Disciplinary Process",
  "A.7.3.1 - Termination or Change of Employment Responsibilities",
  "A.8.1.1 - Inventory of Assets",
  "A.8.1.2 - Ownership of Assets",
  "A.8.1.3 - Acceptable Use of Assets",
  "A.8.1.4 - Return of Assets",
  "A.8.2.1 - Classification of Information",
  "A.8.2.2 - Labelling of Information",
  "A.8.2.3 - Handling of Assets",
  "A.8.3.1 - Management of Removable Media",
  "A.8.3.2 - Disposal of Media",
  "A.8.3.3 - Physical Media Transfer",
  "A.9.1.1 - Access Control Policy",
  "A.9.1.2 - Access to Networks and Network Services",
  "A.9.2.1 - User Registration and De-registration",
  "A.9.2.2 - User Access Provisioning",
  "A.9.2.3 - Management of Privileged Access Rights",
  "A.9.2.4 - Management of Secret Authentication Information of Users",
  "A.9.2.5 - Review of User Access Rights",
  "A.9.2.6 - Removal or Adjustment of Access Rights",
  "A.9.3.1 - Use of Secret Authentication Information",
  "A.9.4.1 - Information Access Restriction",
  "A.9.4.2 - Secure Log-on Procedures",
  "A.9.4.3 - Password Management System",
  "A.9.4.4 - Use of Privileged Utility Programs",
  "A.9.4.5 - Access Control to Program Source Code",
  "A.10.1.1 - Policy on the Use of Cryptographic Controls",
  "A.10.1.2 - Key Management",
  "A.11.1.1 - Physical Security Perimeter",
  "A.11.1.2 - Physical Entry Controls",
  "A.11.1.3 - Protection Against Environmental Threats",
  "A.11.1.4 - Working in Secure Areas",
  "A.11.1.5 - Protecting Against Environmental Threats",
  "A.11.1.6 - Working in Secure Areas",
  "A.11.2.1 - Equipment Siting and Protection",
  "A.11.2.2 - Supporting Utilities",
  "A.11.2.3 - Cabling Security",
  "A.11.2.4 - Equipment Maintenance",
  "A.11.2.5 - Removal of Assets",
  "A.11.2.6 - Security of Equipment and Assets Off-premises",
  "A.11.2.7 - Secure Disposal or Reuse of Equipment",
  "A.11.2.8 - Unattended User Equipment",
  "A.11.2.9 - Clear Desk and Clear Screen Policy",
  "A.12.1.1 - Operational Procedures and Responsibilities",
  "A.12.1.2 - Change Management",
  "A.12.1.3 - Capacity Management",
  "A.12.1.4 - Separation of Development, Testing and Operational Environments",
  "A.12.2.1 - Controls Against Malware",
  "A.12.3.1 - Information Backup",
  "A.12.4.1 - Event Logging",
  "A.12.4.2 - Protection of Log Information",
  "A.12.4.3 - Administrator and Operator Logs",
  "A.12.4.4 - Clock Synchronisation",
  "A.12.5.1 - Installation of Software on Operational Systems",
  "A.12.6.1 - Management of Technical Vulnerabilities",
  "A.12.6.2 - Restrictions on Software Installation",
  "A.12.7.1 - Information Systems Audit Controls",
  "A.13.1.1 - Network Security Management",
  "A.13.1.2 - Security of Network Services",
  "A.13.1.3 - Segregation in Networks",
  "A.13.2.1 - Information Transfer Policies and Procedures",
  "A.13.2.2 - Agreements on Information Transfer",
  "A.13.2.3 - Electronic Messaging",
  "A.13.2.4 - Confidentiality or Non-disclosure Agreements",
  "A.14.1.1 - Information Security Requirements Analysis and Specification",
  "A.14.1.2 - Securing Application Services on Public Networks",
  "A.14.1.3 - Protecting Application Services Transactions",
  "A.14.2.1 - Secure Development Policy",
  "A.14.2.2 - System Change Control Procedures",
  "A.14.2.3 - Technical Review of Applications after Operating Platform Changes",
  "A.14.2.4 - Restrictions on Changes to Software Packages",
  "A.14.2.5 - Secure System Engineering Principles",
  "A.14.2.6 - Secure Development Environment",
  "A.14.2.7 - Outsourced Development",
  "A.14.2.8 - System Security Testing",
  "A.14.2.9 - System Acceptance Testing",
  "A.14.3.1 - Protection of Test Data",
  "A.15.1.1 - Information Security Policy for Supplier Relationships",
  "A.15.1.2 - Addressing Security within Supplier Agreements",
  "A.15.1.3 - Information and Communication Technology Supply Chain",
  "A.15.2.1 - Monitoring and Review of Supplier Services",
  "A.15.2.2 - Managing Changes to Supplier Services",
  "A.16.1.1 - Responsibilities and Procedures",
  "A.16.1.2 - Reporting Information Security Events",
  "A.16.1.3 - Reporting Information Security Weaknesses",
  "A.16.1.4 - Assessment of and Decision on Information Security Events",
  "A.16.1.5 - Response to Information Security Incidents",
  "A.16.1.6 - Learning from Information Security Incidents",
  "A.16.1.7 - Collection of Evidence",
  "A.17.1.1 - Planning Information Security Continuity",
  "A.17.1.2 - Implementing Information Security Continuity",
  "A.17.1.3 - Verify, Review and Evaluate Information Security Continuity",
  "A.17.2.1 - Availability of Information Processing Facilities",
  "A.18.1.1 - Identification of Applicable Legislation and Contractual Requirements",
  "A.18.1.2 - Intellectual Property Rights",
  "A.18.1.3 - Protection of Records",
  "A.18.1.4 - Privacy and Protection of Personally Identifiable Information",
  "A.18.1.5 - Regulation of Cryptographic Controls",
  "A.18.2.1 - Independent Review of Information Security",
  "A.18.2.2 - Compliance with Security Policies and Standards",
  "A.18.2.3 - Technical Compliance Review",
]

// Transform database risk to frontend format
function transformRisk(dbRisk: ISO27001Risk): FrontendRisk {
  return {
    id: dbRisk.id.toString(),
    riskId: dbRisk.risk_id,
    title: dbRisk.title,
    description: dbRisk.description,
    category: dbRisk.category,
    likelihood: dbRisk.likelihood,
    impact: dbRisk.impact,
    riskScore: dbRisk.risk_score,
    riskLevel: dbRisk.risk_level,
    status: dbRisk.status,
    owner: dbRisk.owner || "",
    threat: dbRisk.threat || "",
    treatmentPlan: dbRisk.treatment_plan || "",
    residualLikelihood: dbRisk.residual_likelihood || 1,
    residualImpact: dbRisk.residual_impact || 1,
    residualRisk: dbRisk.residual_risk || 1,
    lastReviewed: dbRisk.last_reviewed,
    nextReview: dbRisk.next_review || "",
    controls: dbRisk.controls,
    controlEffectiveness: [], // Will be populated separately
    assets: dbRisk.assets,
    existingControls: dbRisk.existing_controls || "",
    riskTreatment: dbRisk.risk_treatment || "",
    reviewDate: dbRisk.next_review || "",
    evidence: [], // Will be populated separately
  }
}

export default function ISO27001RiskManagement() {
  const [risks, setRisks] = useState<FrontendRisk[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRisk, setSelectedRisk] = useState<FrontendRisk | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isValidationRulesDialogOpen, setIsValidationRulesDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [validationRules, setValidationRules] = useState<ValidationRules>({
    require_evidence_for_mitigated: true,
    require_evidence_for_accepted: true,
  })
  const [userRole, setUserRole] = useState("admin") // In real app, get from auth context
  const [newRisk, setNewRisk] = useState<Partial<FrontendRisk>>({
    category: "",
    likelihood: 1,
    impact: 1,
    status: "Open",
    controls: [],
    controlEffectiveness: [],
    assets: [],
    threat: "",
    treatmentPlan: "",
    controlAssessment: "",
    existingControls: "",
    riskTreatment: "",
    reviewDate: "",
    residualLikelihood: 1,
    residualImpact: 1,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDropdown, setShowDropdown] = useState(false)

  // Add these state variables after the existing pagination state declarations
  const [controlAssessmentPage, setControlAssessmentPage] = useState(1)
  const [controlAssessmentItemsPerPage, setControlAssessmentItemsPerPage] = useState(5)

  // Treatment data for enhanced dashboard
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [treatmentControls, setTreatmentControls] = useState<any[]>([])

  // Add these state variables after the existing state declarations
  const [editingRisk, setEditingRisk] = useState<string | null>(null)
  const [editingControls, setEditingControls] = useState<string | null>(null)
  const [uploadingEvidence, setUploadingEvidence] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    controlAssessment: string
    existingControls: string
    treatmentPlan: string
    riskTreatment: string
    status: string
    residualLikelihood: number
    residualImpact: number
    controls: string[]
  }>({
    controlAssessment: "",
    existingControls: "",
    treatmentPlan: "",
    riskTreatment: "",
    status: "Open",
    residualLikelihood: 1,
    residualImpact: 1,
    controls: [],
  })

  // Add new state variables for additional filters after the existing filter state:
  const [filterRiskLevel, setFilterRiskLevel] = useState("all")
  const [filterOwner, setFilterOwner] = useState("all")
  const [filterDateRange, setFilterDateRange] = useState("all")
  const [filterControlEffectiveness, setFilterControlEffectiveness] = useState("all")
  const [filterEvidenceStatus, setFilterEvidenceStatus] = useState("all")
  const [filterAssets, setFilterAssets] = useState("all") // New assets filter
  const [sortBy, setSortBy] = useState("riskScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [assetsSourceInput, setAssetsSourceInput] = useState("")
  const [assets, setAssets] = useState([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [existingControlInput, setExistingControlInput] = useState("")
  const [editExistingControlInput, setEditExistingControlInput] = useState("")

  // Helper functions to parse and stringify existingControls
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

  const stringifyExistingControls = (controlsArray: string[]): string => {
    return JSON.stringify(controlsArray)
  }

  // Helper functions for managing existing controls in new risk form
  const addExistingControl = (controlText: string) => {
    const currentControls = parseExistingControls(newRisk.existingControls)
    if (!currentControls.includes(controlText)) {
      setNewRisk({
        ...newRisk,
        existingControls: stringifyExistingControls([...currentControls, controlText])
      })
    }
  }

  const removeExistingControl = (index: number) => {
    const currentControls = parseExistingControls(newRisk.existingControls)
    currentControls.splice(index, 1)
    setNewRisk({ ...newRisk, existingControls: stringifyExistingControls(currentControls) })
  }

  // Helper functions for managing existing controls in edit form
  const addEditExistingControl = (controlText: string) => {
    const currentControls = parseExistingControls(editForm.existingControls)
    if (!currentControls.includes(controlText)) {
      setEditForm({
        ...editForm,
        existingControls: stringifyExistingControls([...currentControls, controlText])
      })
    }
  }

  const removeEditExistingControl = (index: number) => {
    const currentControls = parseExistingControls(editForm.existingControls)
    currentControls.splice(index, 1)
    setEditForm({ ...editForm, existingControls: stringifyExistingControls(currentControls) })
  }

  // Load risks from database
  useEffect(() => {
    async function loadRisks() {
      try {
        setLoading(true)

        // ✅ call the API route, not the server action
        const res = await fetch("/api/iso27001-risks")
        const json = await res.json()

        if (!json.success) {
          console.error("Failed to load risks:", json.error)
          toast.error("Failed to load risks")
          return
        }

        const dbRisks = json.data

        // Load control effectiveness and evidence for each risk
        const risksWithData = await Promise.all(
          dbRisks.map(async (risk: any) => {
            try {
              const [effectivenessResponse, evidenceResponse] = await Promise.all([
                fetch(`/api/iso27001-risks/${risk.id}/control-effectiveness`),
                fetch(`/api/iso27001-evidence?riskId=${risk.id}`),
              ])

              const effectivenessData = effectivenessResponse.ok
                ? await effectivenessResponse.json()
                : []
              const evidenceData = evidenceResponse.ok
                ? await evidenceResponse.json()
                : []

              const transformedRisk = transformRisk(risk)
              transformedRisk.controlEffectiveness = effectivenessData.map((ce: any) => ({
                controlId: ce.control_id,
                effectiveness: ce.effectiveness,
              }))
              transformedRisk.evidence = evidenceData

              return transformedRisk
            } catch (error) {
              console.error(`Error loading data for risk ${risk.id}:`, error)
              return transformRisk(risk)
            }
          })
        )

        setRisks(risksWithData)
      } catch (error) {
        console.error("Error loading risks:", error)
        toast.error("Failed to load risks")
      } finally {
        setLoading(false)
      }
    }

    loadRisks()
  }, [])

  // --- state for Import / Export ---
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importResults, setImportResults] = useState<{ imported: number; errors: string[] } | null>(null)

  // optional filters if you want to filter exports
  const [riskLevelFilter, setRiskLevelFilter] = useState("all")


  const handleExport = async (format: "csv" | "template" = "csv") => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        format,
        search: searchTerm,
      });

      if (riskLevelFilter !== "all") {
        params.append("riskLevel", riskLevelFilter);
      }

      // Call API directly (server action already uses absolute URL if needed)
      const res = await fetch(`/api/iso27001-risks/export?${params}`);

      if (!res.ok) {
        throw new Error("Failed to export");
      }

      if (format === "csv") {
        // ✅ Read raw text for CSV
        const csvContent = await res.text();

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `iso27001-risks-${new Date()
          .toISOString()
          .split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Export Successful",
          description: "CSV file downloaded",
        });
      } else {
        // If you later add JSON/template support
        const data = await res.json();
        toast({
          title: "Export Successful",
          description: `Exported ${data.data.length} risks`,
        });
      }
    } catch (err) {
      console.error("Error exporting ISO27001 risks:", err);
      toast({
        title: "Export Failed",
        description: "Failed to export ISO27001 risks",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
      setIsExportDialogOpen(false);
    }
  };



  const handleImport = async () => {
    if (!importFile) return
    setImporting(true)
    try {
      // 1️⃣ read the CSV locally
      const text = await importFile.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      const csvData = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
        const row: Record<string, string> = {}
        headers.forEach((header, idx) => {
          row[header] = values[idx] || ""
        })
        return row
      })

      // 2️⃣ send it to the ISO27001 import API
      const res = await fetch("/api/iso27001-risks/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData }),
      })

      const data = await res.json()

      if (data.success) {
        setImportResults({ imported: data.imported, errors: data.errors })
        toast({
          title: "Import Successful",
          description: `Imported ${data.imported} risks with ${data.errors.length} errors`,
        })
        // 🔹 re-load the risks table
        loadRisks()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      console.error("Error importing ISO27001 risks:", err)
      toast({
        title: "Import Failed",
        description: "Failed to import ISO27001 risks",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }



  // Load validation rules
  useEffect(() => {
    async function loadValidationRules() {
      try {
        const response = await fetch("/api/iso27001-validation-rules")
        if (response.ok) {
          const rules = await response.json()
          setValidationRules(rules)
        }
      } catch (error) {
        console.error("Error loading validation rules:", error)
      }
    }

    loadValidationRules()
  }, [])

  // Load treatment plans and controls for dashboard
  useEffect(() => {
    async function loadTreatmentData() {
      try {
        const [plansRes, controlsRes] = await Promise.all([
          fetch("/api/iso27001-treatment-plans"),
          fetch("/api/iso27001-treatment-controls"),
        ])
        if (plansRes.ok) {
          const plans = await plansRes.json()
          setTreatmentPlans(Array.isArray(plans) ? plans : plans?.data || [])
        }
        if (controlsRes.ok) {
          const ctrls = await controlsRes.json()
          setTreatmentControls(Array.isArray(ctrls) ? ctrls : ctrls?.data || [])
        }
      } catch (e) {
        console.error("Failed to load treatment data", e)
      }
    }
    loadTreatmentData()
  }, [])

  // Get unique owners for the owner filter dropdown:
  const uniqueOwners = Array.from(new Set(risks.map((r) => r.owner).filter(Boolean))).sort()

  // Get unique assets for the assets filter dropdown:
  const uniqueAssets = Array.from(new Set(risks.flatMap((r) => r.assets || []).filter(Boolean))).sort()

  // Update the filteredRisks calculation to include all new filters:
  const filteredRisks = risks
    .filter((risk) => {
      const matchesSearch =
        risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.riskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = filterCategory === "all" || risk.category === filterCategory
      const matchesStatus = filterStatus === "all" || risk.status === filterStatus
      const matchesRiskLevel = filterRiskLevel === "all" || risk.riskLevel === filterRiskLevel
      const matchesOwner = filterOwner === "all" || risk.owner === filterOwner

      // Assets filter
      const matchesAssets = filterAssets === "all" || (risk.assets && risk.assets.includes(filterAssets))

      // Date range filter
      let matchesDateRange = true
      if (filterDateRange !== "all") {
        const now = new Date()
        const riskDate = new Date(risk.lastReviewed)
        const daysDiff = Math.floor((now.getTime() - riskDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filterDateRange) {
          case "last7days":
            matchesDateRange = daysDiff <= 7
            break
          case "last30days":
            matchesDateRange = daysDiff <= 30
            break
          case "last90days":
            matchesDateRange = daysDiff <= 90
            break
          case "overdue":
            const nextReview = new Date(risk.nextReview || "")
            matchesDateRange = nextReview < now
            break
        }
      }

      // Control effectiveness filter
      let matchesControlEffectiveness = true
      if (filterControlEffectiveness !== "all") {
        const avgEffectiveness =
          risk.controlEffectiveness.length > 0
            ? risk.controlEffectiveness.reduce((sum, ce) => sum + ce.effectiveness, 0) /
            risk.controlEffectiveness.length
            : 0

        switch (filterControlEffectiveness) {
          case "high":
            matchesControlEffectiveness = avgEffectiveness >= 4
            break
          case "medium":
            matchesControlEffectiveness = avgEffectiveness >= 3 && avgEffectiveness < 4
            break
          case "low":
            matchesControlEffectiveness = avgEffectiveness > 0 && avgEffectiveness < 3
            break
          case "none":
            matchesControlEffectiveness = avgEffectiveness === 0
            break
        }
      }

      // Evidence status filter
      let matchesEvidenceStatus = true
      if (filterEvidenceStatus !== "all") {
        const hasEvidence = risk.evidence && risk.evidence.length > 0
        switch (filterEvidenceStatus) {
          case "with-evidence":
            matchesEvidenceStatus = hasEvidence
            break
          case "without-evidence":
            matchesEvidenceStatus = !hasEvidence
            break
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesRiskLevel &&
        matchesOwner &&
        matchesAssets &&
        matchesDateRange &&
        matchesControlEffectiveness &&
        matchesEvidenceStatus
      )
    })
    .sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "riskScore":
          aValue = a.riskScore
          bValue = b.riskScore
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "category":
          aValue = a.category
          bValue = b.category
          break
        case "owner":
          aValue = a.owner.toLowerCase()
          bValue = b.owner.toLowerCase()
          break
        case "lastReviewed":
          aValue = new Date(a.lastReviewed)
          bValue = new Date(b.lastReviewed)
          break
        case "nextReview":
          aValue = new Date(a.nextReview || "")
          bValue = new Date(b.nextReview || "")
          break
        case "controlEffectiveness":
          aValue =
            a.controlEffectiveness.length > 0
              ? a.controlEffectiveness.reduce((sum, ce) => sum + ce.effectiveness, 0) / a.controlEffectiveness.length
              : 0
          bValue =
            b.controlEffectiveness.length > 0
              ? b.controlEffectiveness.reduce((sum, ce) => sum + ce.effectiveness, 0) / b.controlEffectiveness.length
              : 0
          break
        default:
          aValue = a.riskScore
          bValue = b.riskScore
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

  // Pagination calculations
  const totalItems = filteredRisks.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRisks = filteredRisks.slice(startIndex, endIndex)

  // Control Assessment Pagination calculations
  const totalControlAssessmentItems = risks.length
  const totalControlAssessmentPages = Math.ceil(totalControlAssessmentItems / controlAssessmentItemsPerPage)
  const controlAssessmentStartIndex = (controlAssessmentPage - 1) * controlAssessmentItemsPerPage
  const controlAssessmentEndIndex = controlAssessmentStartIndex + controlAssessmentItemsPerPage
  const paginatedControlAssessmentRisks = risks.slice(controlAssessmentStartIndex, controlAssessmentEndIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
    setControlAssessmentPage(1)
  }, [
    searchTerm,
    filterCategory,
    filterStatus,
    filterRiskLevel,
    filterOwner,
    filterAssets, // Added assets filter to dependencies
    filterDateRange,
    filterControlEffectiveness,
    filterEvidenceStatus,
    sortBy,
    sortOrder,
  ])

  const riskStats = {
    total: risks.length,
    critical: risks.filter((r) => r.riskLevel === "Critical").length,
    high: risks.filter((r) => r.riskLevel === "High").length,
    medium: risks.filter((r) => r.riskLevel === "Medium").length,
    low: risks.filter((r) => r.riskLevel === "Low").length,
    open: risks.filter((r) => r.status === "Open").length,
    inProgress: risks.filter((r) => r.status === "In Progress").length,
    mitigated: risks.filter((r) => r.status === "Mitigated").length,
  }


  const getStatusColor = (priority: string) => {
    switch (priority) {
      case "Open":
        return "text-red-500"
      case "In Progress":
        return "text-orange-900"
      case "Mitigated":
        return "text-yellow-600"
      case "Accepted":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-500"
      case "High":
        return "text-orange-900"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  const getEffectivenessColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getEffectivenessLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Very Poor"
      case 2:
        return "Poor"
      case 3:
        return "Fair"
      case 4:
        return "Good"
      case 5:
        return "Excellent"
      default:
        return "Not Rated"
    }
  }

  const calculateRiskScore = (likelihood: number, impact: number) => {
    return likelihood * impact
  }

  const getRiskLevel = (score: number) => {
    if (score >= 15) return "Critical"
    if (score >= 10) return "High"
    if (score >= 5) return "Medium"
    return "Low"
  }

  const renderStars = (rating: number, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              } ${onRatingChange ? "cursor-pointer" : ""}`}
            onClick={() => onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  const updateControlEffectiveness = (controlId: string, effectiveness: number) => {
    const currentEffectiveness = newRisk.controlEffectiveness || []
    const existingIndex = currentEffectiveness.findIndex((ce) => ce.controlId === controlId)

    if (existingIndex >= 0) {
      const updated = [...currentEffectiveness]
      updated[existingIndex] = { controlId, effectiveness }
      setNewRisk({ ...newRisk, controlEffectiveness: updated })
    } else {
      setNewRisk({
        ...newRisk,
        controlEffectiveness: [...currentEffectiveness, { controlId, effectiveness }],
      })
    }
  }

  const getControlEffectiveness = (controlId: string) => {
    const effectiveness = newRisk.controlEffectiveness?.find((ce) => ce.controlId === controlId)
    return effectiveness?.effectiveness || 0
  }

  const calculateResidualRiskScore = (residualLikelihood: number, residualImpact: number) => {
    return residualLikelihood * residualImpact
  }

  // Helper function to check if risk has restrictions
  const hasStatusRestrictions = (risk: FrontendRisk) => {
    const isHighOrCritical = risk.riskLevel === "High" || risk.riskLevel === "Critical"
    const isOpen = risk.status === "Open"
    const avgEffectiveness =
      risk.controlEffectiveness.length > 0
        ? risk.controlEffectiveness.reduce((sum, ce) => sum + ce.effectiveness, 0) / risk.controlEffectiveness.length
        : 0
    const hasLowEffectiveness = avgEffectiveness < 3

    return isHighOrCritical && isOpen && hasLowEffectiveness
  }

  // Check if evidence is required for status change
  const requiresEvidence = (newStatus: string) => {
    if (newStatus === "Mitigated" && validationRules.require_evidence_for_mitigated) return true
    if (newStatus === "Accepted" && validationRules.require_evidence_for_accepted) return true
    return false
  }

  // Check if risk has sufficient evidence for status change
  const hasRequiredEvidence = (risk: FrontendRisk, newStatus: string) => {
    if (!requiresEvidence(newStatus)) return true
    return risk.evidence && risk.evidence.length > 0
  }

  // Get available status options based on restrictions
  const getAvailableStatusOptions = (risk: FrontendRisk) => {
    const allOptions = [
      { value: "Open", label: "Open" },
      { value: "In Progress", label: "In Progress" },
      { value: "Mitigated", label: "Mitigated" },
      { value: "Accepted", label: "Accepted" },
    ]

    if (hasStatusRestrictions(risk)) {
      // Only allow Transfer and Accept for restricted risks
      return [
        { value: "Open", label: "Open" },
        { value: "In Progress", label: "In Progress" },
        { value: "Accepted", label: "Accepted" },
      ]
    }

    return allOptions
  }

  // Evidence upload function
  const uploadEvidence = async (riskId: string, file: File, description: string, controlId?: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("riskId", riskId)
      formData.append("uploadedBy", "Current User") // In real app, get from auth context
      formData.append("description", description)
      if (controlId) formData.append("controlId", controlId)

      const response = await fetch("/api/iso27001-evidence", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const evidence = await response.json()

        // Update local state
        setRisks(
          risks.map((risk) => {
            if (risk.id === riskId) {
              return {
                ...risk,
                evidence: [...(risk.evidence || []), evidence],
              }
            }
            return risk
          }),
        )

        toast.success("Evidence uploaded successfully")
        return true
      } else {
        throw new Error("Failed to upload evidence")
      }
    } catch (error) {
      console.error("Error uploading evidence:", error)
      toast.error("Failed to upload evidence")
      return false
    }
  }

  // Download evidence function
  const downloadEvidence = async (evidenceId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/iso27001-evidence/${evidenceId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading evidence:", error)
      toast.error("Failed to download evidence")
    }
  }

  // Delete evidence function
  const deleteEvidence = async (evidenceId: number, riskId: string) => {
    try {
      const response = await fetch(`/api/iso27001-evidence/${evidenceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Update local state
        setRisks(
          risks.map((risk) => {
            if (risk.id === riskId) {
              return {
                ...risk,
                evidence: risk.evidence?.filter((e) => e.id !== evidenceId) || [],
              }
            }
            return risk
          }),
        )

        toast.success("Evidence deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting evidence:", error)
      toast.error("Failed to delete evidence")
    }
  }

  // Update validation rules
  const updateValidationRules = async (newRules: ValidationRules) => {
    try {
      const response = await fetch("/api/iso27001-validation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRules,
          updated_by: "Current User",
          user_role: userRole,
        }),
      })

      if (response.ok) {
        setValidationRules(newRules)
        toast.success("Validation rules updated successfully")
        setIsValidationRulesDialogOpen(false)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update validation rules")
      }
    } catch (error) {
      console.error("Error updating validation rules:", error)
      toast.error("Failed to update validation rules")
    }
  }

  // Add these functions after the existing helper functions
  const startEditingRisk = (risk: FrontendRisk) => {
    setEditingRisk(risk.id)
    setEditForm({
      controlAssessment: risk.controlAssessment || "",
      existingControls: risk.existingControls || "",
      treatmentPlan: risk.treatmentPlan || "",
      riskTreatment: risk.riskTreatment || "",
      status: risk.status,
      residualLikelihood: risk.residualLikelihood,
      residualImpact: risk.residualImpact,
      controls: [...(risk.controls || [])],
    })
    setEditExistingControlInput("")
  }

  const startEditingControls = (risk: FrontendRisk) => {
    setEditingControls(risk.id)
    setEditForm({
      controlAssessment: risk.controlAssessment || "",
      existingControls: risk.existingControls || "",
      treatmentPlan: risk.treatmentPlan || "",
      riskTreatment: risk.riskTreatment || "",
      status: risk.status,
      residualLikelihood: risk.residualLikelihood,
      residualImpact: risk.residualImpact,
      controls: [...(risk.controls || [])],
    })
    setEditExistingControlInput("")
  }

  const cancelEditing = () => {
    setEditingRisk(null)
    setEditingControls(null)
    setUploadingEvidence(null)
    setEditForm({
      controlAssessment: "",
      existingControls: "",
      treatmentPlan: "",
      riskTreatment: "",
      status: "Open",
      residualLikelihood: 1,
      residualImpact: 1,
      controls: [],
    })
    setEditExistingControlInput("")
  }

  const addControlToRisk = (controlId: string) => {
    if (!editForm.controls.includes(controlId)) {
      setEditForm({
        ...editForm,
        controls: [...editForm.controls, controlId],
      })
    }
  }

  const removeControlFromRisk = async (riskId: string, controlId: string) => {
    try {
      // Remove from edit form
      setEditForm({
        ...editForm,
        controls: editForm.controls.filter((c) => c !== controlId),
      })

      // Remove control effectiveness rating
      const response = await fetch(`/api/iso27001-risks/${riskId}/control-effectiveness?control_id=${controlId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Update local state
        setRisks(
          risks.map((risk) => {
            if (risk.id === riskId) {
              return {
                ...risk,
                controlEffectiveness: risk.controlEffectiveness?.filter((ce) => ce.controlId !== controlId) || [],
              }
            }
            return risk
          }),
        )
        toast.success("Control removed successfully")
      }
    } catch (error) {
      console.error("Error removing control:", error)
      toast.error("Failed to remove control")
    }
  }

  const saveRiskChanges = async (riskId: string) => {
    try {
      const risk = risks.find((r) => r.id === riskId)
      if (!risk) return

      // Check if status change is restricted
      if (hasStatusRestrictions(risk) && editForm.status === "Mitigated") {
        toast.error(
          "Control effectiveness has to be more than 03 towards the implementation for High and Critical risk",
        )
        return
      }

      // Check if evidence is required for status change
      if (requiresEvidence(editForm.status) && !hasRequiredEvidence(risk, editForm.status)) {
        toast.error(`Evidence is required when changing status to ${editForm.status}. Please upload evidence first.`)
        return
      }

      // Check if notes are required for restricted risks with Transfer/Accept status
      if (hasStatusRestrictions(risk) && editForm.status === "Accepted" && !editForm.controlAssessment.trim()) {
        toast.error(
          "Comments are required in the notes field when accepting high/critical risks with low control effectiveness",
        )
        return
      }

      const response = await fetch(`/api/iso27001-risks/${riskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existing_controls: editForm.existingControls,
          treatment_plan: editForm.treatmentPlan,
          risk_treatment: editForm.riskTreatment,
          status: editForm.status,
          residual_likelihood: editForm.residualLikelihood,
          residual_impact: editForm.residualImpact,
          controls: editForm.controls,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const updatedRisk = await response.json()

      // Update the risk in the local state
      setRisks(
        risks.map((r) => {
          if (r.id === riskId) {
            const transformed = transformRisk(updatedRisk)
            // Preserve existing control effectiveness data for controls that still exist
            transformed.controlEffectiveness =
              r.controlEffectiveness?.filter((ce) => editForm.controls.includes(ce.controlId)) || []
            // Preserve evidence
            transformed.evidence = r.evidence || []
            return transformed
          }
          return r
        }),
      )

      toast.success("Risk updated successfully")
      cancelEditing()
    } catch (error: any) {
      console.error("Error updating risk:", error)
      toast.error(`Failed to update risk: ${error.message}`)
    }
  }

  const updateControlEffectivenessRating = async (riskId: string, controlId: string, effectiveness: number) => {
    try {
      const response = await fetch(`/api/iso27001-risks/${riskId}/control-effectiveness`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          control_id: controlId,
          effectiveness,
          implementation_status:
            effectiveness >= 4
              ? "Implemented"
              : effectiveness >= 3
                ? "Partially Implemented"
                : effectiveness >= 1
                  ? "In Progress"
                  : "Not Started",
        }),
      })

      if (response.ok) {
        // Update the local state
        setRisks(
          risks.map((risk) => {
            if (risk.id === riskId) {
              const existingEffectiveness = risk.controlEffectiveness || []
              const existingIndex = existingEffectiveness.findIndex((ce) => ce.controlId === controlId)

              let updatedEffectiveness
              if (existingIndex >= 0) {
                updatedEffectiveness = [...existingEffectiveness]
                updatedEffectiveness[existingIndex] = { controlId, effectiveness }
              } else {
                updatedEffectiveness = [...existingEffectiveness, { controlId, effectiveness }]
              }

              return { ...risk, controlEffectiveness: updatedEffectiveness }
            }
            return risk
          }),
        )
        toast.success("Control effectiveness updated")
      } else {
        throw new Error("Failed to update control effectiveness")
      }
    } catch (error) {
      console.error("Error updating control effectiveness:", error)
      toast.error("Failed to update control effectiveness")
    }
  }
  const handleAddRisk = async () => {
    if (!newRisk.title || !newRisk.description || !newRisk.category || !newRisk.owner) {
      toast.error("Please fill in all required fields (Title, Description, Category, Owner)")
      return
    }

    try {
      setSubmitting(true)

    const res = await fetch("/api/iso27001-risks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newRisk.title,
        description: newRisk.description,
        category: newRisk.category,
        likelihood: newRisk.likelihood || 1,
        impact: newRisk.impact || 1,
        owner: newRisk.owner,
        threat: newRisk.threat,
        treatment_plan: newRisk.treatmentPlan,
        status: newRisk.status,
        controls: newRisk.controls,
        assets: newRisk.assets,
        existing_controls: newRisk.existingControls,
        risk_treatment: newRisk.riskTreatment,
        residual_likelihood: newRisk.residualLikelihood,
        residual_impact: newRisk.residualImpact,
        next_review: newRisk.reviewDate,
      }),
    });

      if (!res.ok) throw new Error("Failed to create risk");
      const dbRisk = await res.json();

      // update local state
      const transformedRisk = transformRisk(dbRisk);
      transformedRisk.controlEffectiveness = newRisk.controlEffectiveness || [];
      transformedRisk.evidence = [];

      setRisks([transformedRisk, ...risks]);
      resetAddRisk();
      toast.success("Risk added successfully");
    } catch (error) {
      console.error("Error adding risk:", error);
      toast.error("Failed to add risk");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRisk = async () => {
    if (
      !selectedRisk ||
      !selectedRisk.title ||
      !selectedRisk.description ||
      !selectedRisk.category ||
      !selectedRisk.owner
    ) {
      toast.error("Please fill in all required fields (Title, Description, Category, Owner)")
      return
    }

    try {
      setSubmitting(true)

    // 🔹 Call the API endpoint directly
    const res = await fetch(`/api/iso27001-risks/${selectedRisk.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: selectedRisk.title,
        description: selectedRisk.description,
        category: selectedRisk.category,
        likelihood: selectedRisk.likelihood,
        impact: selectedRisk.impact,
        owner: selectedRisk.owner,
        threat: selectedRisk.threat,
        treatment_plan: selectedRisk.treatmentPlan,
        status: selectedRisk.status,
        controls: selectedRisk.controls,
        assets: selectedRisk.assets,
        existing_controls: selectedRisk.existingControls,
        risk_treatment: selectedRisk.riskTreatment,
        residual_likelihood: selectedRisk.residualLikelihood,
        residual_impact: selectedRisk.residualImpact,
        next_review: selectedRisk.reviewDate,
      }),
    });

      if (!res.ok) throw new Error("Failed to update risk");
      const updatedRisk = await res.json();

      // update local state
      const transformedRisk = transformRisk(updatedRisk);
      transformedRisk.controlEffectiveness = selectedRisk.controlEffectiveness || [];
      transformedRisk.evidence = selectedRisk.evidence || [];

      setRisks(risks.map((r) => (r.id === selectedRisk.id ? transformedRisk : r)));
      setIsEditDialogOpen(false);
      setSelectedRisk(null);
      toast.success("Risk updated successfully");
    } catch (error) {
      console.error("Error updating risk:", error);
      toast.error("Failed to update risk");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRisk = async (riskId: string) => {
    try {
      const res = await fetch(`/api/iso27001-risks/${riskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete risk");

      // update UI
      setRisks((prev) => prev.filter((r) => r.id !== Number(riskId)));
      toast.success("Risk deleted successfully");
    } catch (error) {
      console.error("Error deleting risk:", error);
      toast.error("Failed to delete risk");
    }
  };


  const openEditDialog = (risk: FrontendRisk) => {
    setSelectedRisk({ ...risk })
    setIsEditDialogOpen(true)
  }


  const fetchAssets = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/assets")
      const data = await response.json()
      if (data.success) {
        setAssets(data.assets)
      } else {
        console.error("API error:", data.error)
        setAssets([])
        toast({
          title: "Error",
          description: data.error || "Failed to load assets",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error)
      setAssets([])
      toast({
        title: "Error",
        description: "Failed to load assets. Please check your database connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleItems = (Item: string, type: string) => {
    if (type == 'assets_add') {
      setSelectedAssets((prev) =>
        prev.includes(Item)
          ? prev.filter((f) => f !== Item)
          : [...prev, Item]
      )
    }

    if (selectedRisk && type == 'assets_edit') {
      selectedRisk?.assets.includes(Item) ?
        setSelectedRisk({ ...selectedRisk, assets: [...selectedRisk?.assets.filter((f) => f !== Item)] }) :
        setSelectedRisk({ ...selectedRisk, assets: [...selectedRisk?.assets, Item] })
    }
  }

  useEffect(() => {
    if (isAddDialogOpen) {
      setNewRisk({
        ...newRisk,
        assets: selectedAssets.map(item => item.trim())
      })
    }
  }, [selectedAssets]);

  useEffect(() => {
    fetchAssets()
  }, [isAddDialogOpen])


  const resetAddRisk = () => {
    setSelectedAssets([])
    setNewRisk({
      category: "",
      likelihood: 1,
      impact: 1,
      status: "Open",
      controls: [],
      controlEffectiveness: [],
      assets: [],
      existingControls: "",
      riskTreatment: "",
      reviewDate: "",
      residualLikelihood: 1,
      residualImpact: 1,
    })
    setIsAddDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-transparent">
        {/* {/* <Sidebar /> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* {/* <Header /> */}
          <main className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading risks...</span>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredControlAssetments =
    risks.length > 0
      ? risks.filter(
          (r) =>
            r.controlAssessment?.toLowerCase().includes(
              (newRisk.controlAssessment || "").toLowerCase()
            )
        )
      : [];

  const filteredTreatmentPlan =
    risks.length > 0
      ? risks.filter(
          (r) =>
            r.treatmentPlan?.toLowerCase().includes(
              (newRisk.treatmentPlan || "").toLowerCase()
            )
        )
      : [];

  const handleSelect = (value: any, type: string) => {
    if (type == 'tp') {
      setNewRisk({ ...newRisk, treatmentPlan: value });
    }

    if (type == 'ca') {
      setNewRisk({ ...newRisk, controlAssessment: value });
    }
    setShowDropdown(false); // hide dropdown after selection
  };


  return (
    <main className="flex-1">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold  animate-pulse">
            Risk Management - ISO 27001 Framework
          </h1>
          <p>Risk assessment and treatment planning</p>
        </div>
        {/* Stats Cards with Spotlight */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="spotlight">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Total Risks</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{riskStats.total}</div>
              <p className="text-xs text-muted-foreground">Active risk register</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">High/Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{riskStats.critical + riskStats.high}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{riskStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Being actively managed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Mitigated</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{riskStats.mitigated}</div>
              <p className="text-xs text-muted-foreground">Successfully addressed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="risks" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="risks">Risk Register</TabsTrigger>
              <TabsTrigger value="dashboard">Risk Dashboard</TabsTrigger>
              <TabsTrigger value="controls">Control Mapping</TabsTrigger>
              <TabsTrigger value="control-assessment">Controls Assessment</TabsTrigger>
              <TabsTrigger value="treatment">Risk Treatment</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              {userRole === "admin" && (
                <>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Admin Access
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setIsValidationRulesDialogOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Validation Rules
                  </Button>
                </>
              )}
              {userRole !== "admin" && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <Lock className="h-3 w-3 mr-1" />
                  User Access
                </Badge>
              )}
              {/* Import Button */}
              <input
                id="import-file"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImportFile(file);
                    await handleImport(); // ✅ trigger import immediately after selecting
                  }
                }}
              />
              <label htmlFor="import-file">
                <Button variant="outline" size="sm" disabled={importing}>
                  <Upload className="h-4 w-4 mr-2" />
                  {importing ? "Importing..." : "Import"}
                </Button>
              </label>

              {/* Export Button */}
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")} disabled={exporting}>
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Exporting..." : "Export"}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <ActionButtons isTableAction={false} onAdd={()=>{}} btnAddText="Add Risk" />
                  {/* <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Risk
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add New ISO 27001 Risk</DialogTitle>
                    <DialogDescription>Create a new information security risk entry</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Risk Title *</Label>
                        <Input
                          id="title"
                          value={newRisk.title || ""}
                          onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                          placeholder="Enter risk title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={newRisk.category}
                          onValueChange={(value) => setNewRisk({ ...newRisk, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {riskCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newRisk.description || ""}
                        onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                        placeholder="Describe the risk in detail"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                        <Select
                          value={String(newRisk.likelihood)}
                          onValueChange={(value) => setNewRisk({ ...newRisk, likelihood: Number.parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Very Low</SelectItem>
                            <SelectItem value="2">2 - Low</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4 - High</SelectItem>
                            <SelectItem value="5">5 - Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="impact">Impact (1-5)</Label>
                        <Select
                          value={String(newRisk.impact)}
                          onValueChange={(value) => setNewRisk({ ...newRisk, impact: Number.parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Very Low</SelectItem>
                            <SelectItem value="2">2 - Low</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4 - High</SelectItem>
                            <SelectItem value="5">5 - Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Risk Score</Label>
                        <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted">
                          {calculateRiskScore(newRisk.likelihood || 1, newRisk.impact || 1)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div id="divAssetOwner" className="space-y-2">
                        <Label htmlFor="owner">Risk Owner *</Label>
                        <OwnerSelectInput formData={newRisk} setFormData={setNewRisk} fieldName="owner" />
                      </div>
                      {/* <div className="space-y-2">
                            <Label htmlFor="owner">Risk Owner *</Label>
                            <Input
                              id="owner"
                              value={newRisk.owner || ""}
                              onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                              placeholder="Enter risk owner"
                            />
                          </div> */}
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newRisk.status}
                          onValueChange={(value) => setNewRisk({ ...newRisk, status: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Mitigated">Mitigated</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div id="divThreat" className="space-y-2">
                        <Label htmlFor="threat">Threat</Label>
                        <ThreatSelectInput formData={newRisk} setFormData={setNewRisk} fieldName="threat" />
                      </div>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="existingControls">Existing Controls</Label>
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
                      {parseExistingControls(newRisk.existingControls).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {parseExistingControls(newRisk.existingControls).map((control, index) => (
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

                    <div className="space-y-2">
                      <Label htmlFor="riskTreatment">Risk Treatment Strategy</Label>
                      {userRole === "admin" ? (
                        <Select
                          value={newRisk.riskTreatment}
                          onValueChange={(value) => setNewRisk({ ...newRisk, riskTreatment: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select treatment strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            {riskTreatmentStrategies.map((strategy) => (
                              <SelectItem key={strategy} value={strategy.split(" - ")[0]}>
                                {strategy}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                          {newRisk.riskTreatment || "Will be set by administrator"}
                        </div>
                      )}
                      {userRole !== "admin" && (
                        <p className="text-xs text-muted-foreground">
                          Risk treatment strategy can only be set by administrators
                        </p>
                      )}
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                      <Textarea
                        id="treatmentPlan"
                        value={newRisk.treatmentPlan || ""}
                        onChange={(e) => {
                          setNewRisk({ ...newRisk, treatmentPlan: e.target.value });
                          if (e.target.value.length > 0) {
                            setShowDropdown(true) // show dropdown on typing
                          } else {
                            setShowDropdown(false)
                          }
                        }}
                        placeholder="Describe the risk treatment plan"
                        rows={2}
                      />
                      {showDropdown && newRisk.treatmentPlan != "" && filteredTreatmentPlan.length > 0 && (
                        <div className="border rounded mt-1 max-h-40 overflow-y-auto">
                          {filteredTreatmentPlan.map((r, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelect(r.treatmentPlan, 'tp')}
                              className="cursor-pointer text-sm p-2 m-2 hover:bg-muted/100 rounded"
                            >
                              {r.treatmentPlan}
                            </div>
                          ))}
                        </div>
                      )}
                      {newRisk.treatmentPlan && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            setNewRisk({ ...newRisk, treatmentPlan: "" })
                          }
                          className="text-sm self-end"
                        >
                          Clear
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="residualLikelihood">Residual Likelihood (1-5)</Label>
                        <Select
                          value={String(newRisk.residualLikelihood || 1)}
                          onValueChange={(value) =>
                            setNewRisk({ ...newRisk, residualLikelihood: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Very Low</SelectItem>
                            <SelectItem value="2">2 - Low</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4 - High</SelectItem>
                            <SelectItem value="5">5 - Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="residualImpact">Residual Impact (1-5)</Label>
                        <Select
                          value={String(newRisk.residualImpact || 1)}
                          onValueChange={(value) =>
                            setNewRisk({ ...newRisk, residualImpact: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Very Low</SelectItem>
                            <SelectItem value="2">2 - Low</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4 - High</SelectItem>
                            <SelectItem value="5">5 - Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Residual Risk Score</Label>
                        <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted">
                          {calculateResidualRiskScore(newRisk.residualLikelihood || 1, newRisk.residualImpact || 1)}
                        </div>
                      </div>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="reviewDate">Next Review Date</Label>
                      <Input
                        id="reviewDate"
                        type="date"
                        value={newRisk.reviewDate || ""}
                        onChange={(e) => setNewRisk({ ...newRisk, reviewDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="controls">Associated Controls</Label>
                      <Select
                        value=""
                        onValueChange={(value) => {
                          const currentControls = newRisk.controls || []
                          if (!currentControls.includes(value)) {
                            setNewRisk({
                              ...newRisk,
                              controls: [...currentControls, value],
                            })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ISO 27001 controls" />
                        </SelectTrigger>
                        <SelectContent>
                          {iso27001Controls.map((control) => (
                            <SelectItem key={control} value={control.split(" - ")[0]}>
                              {control}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {newRisk.controls && newRisk.controls.length > 0 && (
                        <div className="space-y-3 mt-3">
                          <Label className="text-sm font-medium">Control Effectiveness Ratings</Label>
                          {newRisk.controls.map((controlId, index) => {
                            const controlName = iso27001Controls.find((c) => c.startsWith(controlId))
                            return (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{controlId}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {controlName?.split(" - ")[1] || ""}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="flex flex-col items-center">
                                    {renderStars(getControlEffectiveness(controlId), (rating) =>
                                      updateControlEffectiveness(controlId, rating),
                                    )}
                                    <span className="text-xs text-muted-foreground mt-1">
                                      {getEffectivenessLabel(getControlEffectiveness(controlId))}
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedControls = newRisk.controls?.filter((_, i) => i !== index) || []
                                      const updatedEffectiveness =
                                        newRisk.controlEffectiveness?.filter((ce) => ce.controlId !== controlId) ||
                                        []
                                      setNewRisk({
                                        ...newRisk,
                                        controls: updatedControls,
                                        controlEffectiveness: updatedEffectiveness,
                                      })
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assets">Affected Assets</Label>
                      <div className="flex gap-2 mt-2 w-full">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex border rounded px-4 py-2 w-full border-input bg-background text-muted-foreground text-sm">
                            {"Select Affected Assets"}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            {assets.map((assest: any) => (
                              <DropdownMenuCheckboxItem
                                key={assest.id}
                                checked={selectedAssets.includes(assest.asset_name)}
                                onCheckedChange={() => {
                                  toggleItems(assest.asset_name, 'assets_add')
                                }}
                              >
                                {assest.asset_name}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap gap-2 m-4">
                        {selectedAssets.map((asset, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700">
                            {asset}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => toggleItems(asset, 'assets_add')} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => resetAddRisk()}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRisk} disabled={submitting}>
                      {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Add Risk
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="risks" className="space-y-4">
            {/* Enhanced Filters */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search and Quick Filters Row */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search risks by title, ID, or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("")
                        setFilterCategory("all")
                        setFilterStatus("all")
                        setFilterRiskLevel("all")
                        setFilterOwner("all")
                        setFilterAssets("all")
                        setFilterDateRange("all")
                        setFilterControlEffectiveness("all")
                        setFilterEvidenceStatus("all")
                        setSortBy("riskScore")
                        setSortOrder("desc")
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>

                  {/* Filter Controls Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Category</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {riskCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Mitigated">Mitigated</SelectItem>
                          <SelectItem value="Accepted">Accepted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Risk Level</Label>
                      <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Owner</Label>
                      <Select value={filterOwner} onValueChange={setFilterOwner}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Owners</SelectItem>
                          {uniqueOwners.map((owner) => (
                            <SelectItem key={owner} value={owner}>
                              {owner}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Assets</Label>
                      <Select value={filterAssets} onValueChange={setFilterAssets}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Assets</SelectItem>
                          {uniqueAssets.map((asset) => (
                            <SelectItem key={asset} value={asset}>
                              {asset}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Date Range</Label>
                      <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Dates</SelectItem>
                          <SelectItem value="last7days">Last 7 Days</SelectItem>
                          <SelectItem value="last30days">Last 30 Days</SelectItem>
                          <SelectItem value="last90days">Last 90 Days</SelectItem>
                          <SelectItem value="overdue">Overdue Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Control Effectiveness</Label>
                      <Select value={filterControlEffectiveness} onValueChange={setFilterControlEffectiveness}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="high">High (4-5)</SelectItem>
                          <SelectItem value="medium">Medium (3-4)</SelectItem>
                          <SelectItem value="low">Low (1-3)</SelectItem>
                          <SelectItem value="none">Not Assessed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Evidence</Label>
                      <Select value={filterEvidenceStatus} onValueChange={setFilterEvidenceStatus}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="with-evidence">With Evidence</SelectItem>
                          <SelectItem value="without-evidence">No Evidence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center space-x-4 pt-2 border-t">
                    <Label className="text-sm font-medium">Sort by:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riskScore">Risk Score</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="lastReviewed">Last Reviewed</SelectItem>
                        <SelectItem value="nextReview">Next Review</SelectItem>
                        <SelectItem value="controlEffectiveness">Control Effectiveness</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="flex items-center space-x-1"
                    >
                      {sortOrder === "asc" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
                    </Button>
                  </div>

                  {/* Active Filters Summary */}
                  {(searchTerm ||
                    filterCategory !== "all" ||
                    filterStatus !== "all" ||
                    filterRiskLevel !== "all" ||
                    filterOwner !== "all" ||
                    filterAssets !== "all" ||
                    filterDateRange !== "all" ||
                    filterControlEffectiveness !== "all" ||
                    filterEvidenceStatus !== "all") && (
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <Label className="text-sm font-medium">Active Filters:</Label>
                        <div className="flex flex-wrap gap-2">
                          {searchTerm && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Search: "{searchTerm}"</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                            </Badge>
                          )}
                          {filterCategory !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Category: {filterCategory}</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterCategory("all")} />
                            </Badge>
                          )}
                          {filterStatus !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Status: {filterStatus}</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterStatus("all")} />
                            </Badge>
                          )}
                          {filterRiskLevel !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Level: {filterRiskLevel}</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterRiskLevel("all")} />
                            </Badge>
                          )}
                          {filterOwner !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Owner: {filterOwner}</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterOwner("all")} />
                            </Badge>
                          )}
                          {filterAssets !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Asset: {filterAssets}</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterAssets("all")} />
                            </Badge>
                          )}
                          {filterDateRange !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Date: {filterDateRange}</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterDateRange("all")} />
                            </Badge>
                          )}
                          {filterControlEffectiveness !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Controls: {filterControlEffectiveness}</span>
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setFilterControlEffectiveness("all")}
                              />
                            </Badge>
                          )}
                          {filterEvidenceStatus !== "all" && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <span>Evidence: {filterEvidenceStatus}</span>
                              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterEvidenceStatus("all")} />
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Results Summary */}
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredRisks.length} of {risks.length} risks
                    {filteredRisks.length !== risks.length && (
                      <span className="ml-2 text-blue-600">
                        ({risks.length - filteredRisks.length} filtered out)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Table */}
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            if (sortBy === "riskId") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy("riskId")
                              setSortOrder("asc")
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center space-x-4 truncate">
                            <div>Risk ID</div>
                            {sortBy === "riskId" &&
                              (sortOrder === "asc" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            if (sortBy === "title") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy("title")
                              setSortOrder("asc")
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center space-x-4 truncate">
                            <div>Title</div>
                            {sortBy === "title" &&
                              (sortOrder === "asc" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            if (sortBy === "category") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy("category")
                              setSortOrder("asc")
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center space-x-4 truncate">
                            <div>Category</div>
                            {sortBy === "category" &&
                              (sortOrder === "asc" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            if (sortBy === "riskScore") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy("riskScore")
                              setSortOrder("desc")
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center space-x-4 truncate">
                            <div>Risk Level</div>
                            {sortBy === "riskScore" &&
                              (sortOrder === "asc" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            if (sortBy === "owner") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy("owner")
                              setSortOrder("asc")
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center space-x-4 truncate">
                            <div>Owner</div>
                            {sortBy === "owner" &&
                              (sortOrder === "asc" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead>Assets</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            if (sortBy === "controlEffectiveness") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy("controlEffectiveness")
                              setSortOrder("desc")
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center space-x-4 truncate">
                            <div>Control Effectiveness</div>
                            {sortBy === "controlEffectiveness" &&
                              (sortOrder === "asc" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead>Evidence</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            if (sortBy === "nextReview") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy("nextReview")
                              setSortOrder("asc")
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center space-x-4 truncate">
                            <div>Next Review</div>
                            {sortBy === "nextReview" &&
                              (sortOrder === "asc" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRisks.map((risk) => {
                        const avgEffectiveness =
                          risk.controlEffectiveness.length > 0
                            ? risk.controlEffectiveness.reduce((sum, ce) => sum + ce.effectiveness, 0) /
                            risk.controlEffectiveness.length
                            : 0
                        const isOverdue = risk.nextReview && new Date(risk.nextReview) < new Date()

                        return (
                          <TableRow key={risk.id}>
                            <TableCell className="font-medium text-xs truncate">{risk.riskId}</TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium truncate">{risk.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{risk.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>{risk.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className={`${getRiskLevelColor(risk.riskLevel)}`}>
                                  {risk.riskLevel}
                                </Badge>
                                <span className="text-xs text-muted-foreground">({risk.riskScore})</span>
                              </div>
                            </TableCell>
                            <TableCell className="truncate">
                              <Badge variant="outline" className={getStatusColor(risk.status)}>
                                {risk.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-36">
                              <div className="truncate">{risk.owner}</div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                {risk.assets && risk.assets.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {risk.assets.slice(0, 2).map((asset, index) => (
                                      <Badge key={index} variant="outline" className="text-xs max-width-xs truncate">
                                        {asset}
                                      </Badge>
                                    ))}
                                    {risk.assets.length > 2 && (
                                      <Badge variant="outline" className="text-xs max-width-xs truncate">
                                        +{risk.assets.length - 2} more
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">No assets</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {renderStars(Math.round(avgEffectiveness))}
                                <span className={`text-sm ${getEffectivenessColor(avgEffectiveness)}`}>
                                  {avgEffectiveness > 0 ? avgEffectiveness.toFixed(1) : "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 truncate">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{risk.evidence?.length || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`text-sm text-center ${isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}
                              >
                                <div className="max-width-xs truncate">
                                  {formatDate(risk.nextReview)}
                                </div>
                                {isOverdue && (
                                  <Badge variant="destructive" className="m-2 text-xs">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <ActionButtons isTableAction={true}
                                  onView={() => {
                                    setSelectedRisk(risk)
                                    setIsViewDialogOpen(true)
                                  }}
                                  onEdit={() => openEditDialog(risk)}
                                  onDelete={() => handleDeleteRisk(risk.id)}
                                actionObj={risk}
                                  deleteDialogTitle={risk.title}
                                />
                                {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRisk(risk)
                                    setIsViewDialogOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {userRole === "admin" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditDialog(risk)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
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
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the risk "
                                            {risk.title}" and all associated data including evidence files.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteRisk(risk.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete Risk
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )} */}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                      </p>
                      <Select
                        value={String(itemsPerPage)}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value))
                          setCurrentPage(1)
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">per page</span>
                    </div>

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {/* First page */}
                        {currentPage > 3 && (
                          <>
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {currentPage > 4 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                          </>
                        )}

                        {/* Current page and surrounding pages */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                          if (pageNumber <= totalPages) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(pageNumber)}
                                  isActive={currentPage === pageNumber}
                                  className="cursor-pointer"
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          }
                          return null
                        })}

                        {/* Last page */}
                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={
                              currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Risk Heatmap */}
            <ISO27001RiskHeatmap risks={risks} />

            {/* Existing Dashboard Content */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical</span>
                      <span className="text-sm font-medium">{riskStats.critical}</span>
                    </div>
                    <Progress value={(riskStats.critical / riskStats.total) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">High</span>
                      <span className="text-sm font-medium">{riskStats.high}</span>
                    </div>
                    <Progress value={(riskStats.high / riskStats.total) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium</span>
                      <span className="text-sm font-medium">{riskStats.medium}</span>
                    </div>
                    <Progress value={(riskStats.medium / riskStats.total) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low</span>
                      <span className="text-sm font-medium">{riskStats.low}</span>
                    </div>
                    <Progress value={(riskStats.low / riskStats.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Open</span>
                      <span className="text-sm font-medium text-red-600">{riskStats.open}</span>
                    </div>
                    <Progress value={(riskStats.open / riskStats.total) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">In Progress</span>
                      <span className="text-sm font-medium text-yellow-600">{riskStats.inProgress}</span>
                    </div>
                    <Progress value={(riskStats.inProgress / riskStats.total) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mitigated</span>
                      <span className="text-sm font-medium text-green-600">{riskStats.mitigated}</span>
                    </div>
                    <Progress value={(riskStats.mitigated / riskStats.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ISO 27001 Existing Controls</CardTitle>
                <CardDescription>Map risks to ISO 27001 Annex A controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {iso27001Controls.map((control, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{control}</div>
                      </div>
                      <Badge variant="outline" className="text-red-500 text-md">{Math.floor(Math.random() * 3) + 1} risks</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="control-assessment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ISO 27001 Control Assessment</CardTitle>
                <CardDescription>
                  Assess and edit the effectiveness of ISO 27001 controls for each risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Control Assessment Interface */}
                  <div className="grid gap-4">
                    {paginatedControlAssessmentRisks.map((risk) => (
                      <Card key={risk.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {risk.riskId} - {risk.title}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Category: {risk.category} | Risk Level:
                                <Badge variant="outline" className={`ml-2 ${getRiskLevelColor(risk.riskLevel)} `}>
                                  {risk.riskLevel}
                                </Badge>
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getStatusColor(risk.status)}>
                                {risk.status}
                              </Badge>
                              {editingRisk === risk.id ? (
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={() => saveRiskChanges(risk.id)}>
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={cancelEditing}>
                                    <Cancel className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => startEditingRisk(risk)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              <strong>Description:</strong> {risk.description}
                            </div>

                            {/* Status Restriction Alert */}
                            {hasStatusRestrictions(risk) && editingRisk === risk.id && (
                              <Alert className="border-orange-200 bg-orange-50">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800">
                                  <strong>Status Change Restriction:</strong> Control effectiveness has to be more
                                  than 03 towards the implementation for High and Critical risk. Only Transfer or
                                  Accept options are available.
                                </AlertDescription>
                              </Alert>
                            )}

                            {/* Evidence Requirements Alert */}
                            {editingRisk === risk.id && (
                              <Alert className="space-y-1 bg-gradient-to-r from-green-600 to-cyan-600">
                                <FileText className="h-4 w-4 mt-1 mb-1" />
                                <AlertDescription className="text-white">
                                  <strong>Evidence Requirements:</strong>
                                  {validationRules.require_evidence_for_mitigated &&
                                    " Evidence required for Mitigated status."}
                                  {validationRules.require_evidence_for_accepted &&
                                    " Evidence required for Accepted status."}
                                  {!validationRules.require_evidence_for_mitigated &&
                                    !validationRules.require_evidence_for_accepted &&
                                    " No evidence requirements currently active."}
                                </AlertDescription>
                              </Alert>
                            )}

                            {/* Editable Risk Information */}
                            {editingRisk === risk.id && (
                              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                                <h4 className="font-medium text-sm">Edit Risk Information</h4>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                      value={editForm.status}
                                      onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getAvailableStatusOptions(risk).map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                            {requiresEvidence(option.value) &&
                                              !hasRequiredEvidence(risk, option.value) && (
                                                <span className="text-red-500 ml-2">*Evidence Required</span>
                                              )}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="riskTreatment">Risk Treatment Strategy</Label>
                                    {userRole === "admin" ? (
                                      <Select
                                        value={editForm.riskTreatment}
                                        onValueChange={(value) =>
                                          setEditForm({ ...editForm, riskTreatment: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select treatment strategy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {riskTreatmentStrategies.map((strategy) => (
                                            <SelectItem key={strategy} value={strategy.split(" - ")[0]}>
                                              {strategy}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                                        {editForm.riskTreatment || "Set by administrator"}
                                      </div>
                                    )}
                                    {userRole !== "admin" && (
                                      <p className="text-xs text-muted-foreground">
                                        Only administrators can modify risk treatment strategy
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="residualLikelihood">Residual Likelihood (1-5)</Label>
                                    <Select
                                      value={String(editForm.residualLikelihood)}
                                      onValueChange={(value) =>
                                        setEditForm({ ...editForm, residualLikelihood: Number.parseInt(value) })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">1 - Very Low</SelectItem>
                                        <SelectItem value="2">2 - Low</SelectItem>
                                        <SelectItem value="3">3 - Medium</SelectItem>
                                        <SelectItem value="4">4 - High</SelectItem>
                                        <SelectItem value="5">5 - Very High</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="residualImpact">Residual Impact (1-5)</Label>
                                    <Select
                                      value={String(editForm.residualImpact)}
                                      onValueChange={(value) =>
                                        setEditForm({ ...editForm, residualImpact: Number.parseInt(value) })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">1 - Very Low</SelectItem>
                                        <SelectItem value="2">2 - Low</SelectItem>
                                        <SelectItem value="3">3 - Medium</SelectItem>
                                        <SelectItem value="4">4 - High</SelectItem>
                                        <SelectItem value="5">5 - Very High</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                                  <Textarea
                                    id="treatmentPlan"
                                    value={editForm.treatmentPlan}
                                    onChange={(e) => setEditForm({ ...editForm, treatmentPlan: e.target.value })}
                                    placeholder="Describe the risk treatment plan"
                                    rows={3}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="controlAssessment">
                                    Control Assessment Notes
                                    {hasStatusRestrictions(risk) && editForm.status === "Accepted" && (
                                      <span className="text-red-500 ml-1">*</span>
                                    )}
                                  </Label>
                                  <Textarea
                                    id="controlAssessment"
                                    value={editForm.controlAssessment}
                                    onChange={(e) =>
                                      setEditForm({ ...editForm, controlAssessment: e.target.value })
                                    }
                                    placeholder={
                                      hasStatusRestrictions(risk) && editForm.status === "Accepted"
                                        ? "Comments are required when accepting high/critical risks with low control effectiveness"
                                        : "Assess the effectiveness of existing controls"
                                    }
                                    rows={3}
                                    className={
                                      hasStatusRestrictions(risk) &&
                                        editForm.status === "Accepted" &&
                                        !editForm.controlAssessment.trim()
                                        ? "border-red-300"
                                        : ""
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="existingControls">Existing Controls</Label>
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
                                  {parseExistingControls(editForm.existingControls).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {parseExistingControls(editForm.existingControls).map((control, index) => (
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
                              </div>
                            )}

                            {/* Evidence Section */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Evidence Files</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setUploadingEvidence(uploadingEvidence === risk.id ? null : risk.id)
                                  }
                                >
                                  <Paperclip className="h-4 w-4 mr-1" />
                                  Upload Evidence
                                </Button>
                              </div>

                              {/* Evidence Upload Form */}
                              {uploadingEvidence === risk.id && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
                                  <h4 className="font-medium text-sm mb-3">Upload Evidence</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <Label htmlFor="evidenceFile" className="text-sm">
                                        Select File
                                      </Label>
                                      <Input
                                        id="evidenceFile"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="evidenceDescription" className="text-sm">
                                        Description (Optional)
                                      </Label>
                                      <Textarea
                                        id="evidenceDescription"
                                        placeholder="Describe the evidence file"
                                        rows={2}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={async () => {
                                          const fileInput = document.getElementById(
                                            "evidenceFile",
                                          ) as HTMLInputElement
                                          const descriptionInput = document.getElementById(
                                            "evidenceDescription",
                                          ) as HTMLTextAreaElement

                                          if (fileInput.files && fileInput.files[0]) {
                                            const success = await uploadEvidence(
                                              risk.id,
                                              fileInput.files[0],
                                              descriptionInput.value,
                                            )
                                            if (success) {
                                              setUploadingEvidence(null)
                                              fileInput.value = ""
                                              descriptionInput.value = ""
                                            }
                                          } else {
                                            toast.error("Please select a file to upload")
                                          }
                                        }}
                                      >
                                        <Upload className="h-4 w-4 mr-1" />
                                        Upload
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setUploadingEvidence(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Evidence List */}
                              {risk.evidence && risk.evidence.length > 0 ? (
                                <div className="space-y-2">
                                  {risk.evidence.map((evidence) => (
                                    <div
                                      key={evidence.id}
                                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                          <div className="font-medium text-sm">{evidence.file_name}</div>
                                          <div className="text-xs text-muted-foreground">
                                            {formatFileSize(evidence.file_size)} • Uploaded by{" "}
                                            {evidence.uploaded_by} • {formatDate(evidence.created_at)}
                                          </div>
                                          {evidence.description && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {evidence.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => downloadEvidence(evidence.id, evidence.file_name)}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => deleteEvidence(evidence.id, risk.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">No evidence files uploaded</p>
                                </div>
                              )}
                            </div>

                            {/* Associated Controls Section */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Associated ISO 27001 Controls</Label>
                                {editingControls === risk.id ? (
                                  <div className="flex space-x-2">
                                    <Button size="sm" onClick={() => saveRiskChanges(risk.id)}>
                                      <Save className="h-4 w-4 mr-1" />
                                      Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                                      <Cancel className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => startEditingControls(risk)}>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit Controls
                                  </Button>
                                )}
                              </div>

                              {/* Add Control Dropdown (only when editing) */}
                              {editingControls === risk.id && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border">
                                  <Label className="text-sm font-medium">Add New Control</Label>
                                  <Select value="" onValueChange={(value) => addControlToRisk(value)}>
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="Select ISO 27001 control to add" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {iso27001Controls
                                        .filter((control) => !editForm.controls.includes(control.split(" - ")[0]))
                                        .map((control) => (
                                          <SelectItem key={control} value={control.split(" - ")[0]}>
                                            {control}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {/* Controls List */}
                              {(editingControls === risk.id ? editForm.controls : risk.controls) &&
                                (editingControls === risk.id ? editForm.controls : risk.controls).length > 0 && (
                                  <div className="grid gap-3">
                                    {(editingControls === risk.id ? editForm.controls : risk.controls).map(
                                      (controlId, index) => {
                                        const controlName = iso27001Controls.find((c) => c.startsWith(controlId))
                                        const effectiveness = risk.controlEffectiveness?.find(
                                          (ce) => ce.controlId === controlId,
                                        )

                                        return (
                                          <div
                                            key={index}
                                            className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                                          >
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                  <div className="font-medium text-sm">{controlId}</div>
                                                  {editingControls === risk.id && (
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => removeControlFromRisk(risk.id, controlId)}
                                                      className="text-red-500 hover:text-red-700"
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  )}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                  {controlName?.split(" - ")[1] ||
                                                    "Control description not available"}
                                                </div>
                                              </div>
                                              <div className="ml-4 text-right">
                                                <div className="flex items-center space-x-2 mb-2">
                                                  {renderStars(effectiveness?.effectiveness || 0, (rating) =>
                                                    updateControlEffectivenessRating(risk.id, controlId, rating),
                                                  )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {getEffectivenessLabel(effectiveness?.effectiveness || 0)}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Control Assessment Details */}
                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                              <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                  <span className="font-medium">Implementation Status:</span>
                                                  <Badge variant="outline" className="ml-2">
                                                    {effectiveness?.effectiveness >= 4
                                                      ? "Fully Implemented"
                                                      : effectiveness?.effectiveness >= 3
                                                        ? "Partially Implemented"
                                                        : effectiveness?.effectiveness >= 1
                                                          ? "Minimally Implemented"
                                                          : "Not Implemented"}
                                                  </Badge>
                                                </div>
                                                <div>
                                                  <span className="font-medium">Risk Mitigation:</span>
                                                  <span
                                                    className={`ml-2 ${getEffectivenessColor(effectiveness?.effectiveness || 0)}`}
                                                  >
                                                    {effectiveness?.effectiveness >= 4
                                                      ? "High"
                                                      : effectiveness?.effectiveness >= 3
                                                        ? "Medium"
                                                        : effectiveness?.effectiveness >= 1
                                                          ? "Low"
                                                          : "None"}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      },
                                    )}
                                  </div>
                                )}

                              {/* No Controls Message */}
                              {(!risk.controls || risk.controls.length === 0) && editingControls !== risk.id && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>No controls associated with this risk</p>
                                  <p className="text-sm">Click "Edit Controls" to add ISO 27001 controls</p>
                                </div>
                              )}
                            </div>

                            {/* Risk Assessment Summary */}
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Current Risk:</span>
                                  <div className="mt-1">
                                    <Badge variant="outline" className={`${getRiskLevelColor(risk.riskLevel)}`}>
                                      {risk.riskScore} ({risk.riskLevel})
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Residual Risk:</span>
                                  <div className="mt-1">
                                    <Badge
                                      variant="outline"
                                      className={`${getRiskLevelColor(getRiskLevel(editingRisk === risk.id ? editForm.residualLikelihood * editForm.residualImpact : risk.residualRisk))}`}
                                    >
                                      {editingRisk === risk.id
                                        ? editForm.residualLikelihood * editForm.residualImpact
                                        : risk.residualRisk}{" "}
                                      (
                                      {getRiskLevel(
                                        editingRisk === risk.id
                                          ? editForm.residualLikelihood * editForm.residualImpact
                                          : risk.residualRisk,
                                      )}
                                      )
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Risk Owner:</span>
                                  <div className="mt-1 text-muted-foreground">{risk.owner}</div>
                                </div>
                                <div>
                                  <span className="font-medium">Next Review:</span>
                                  <div className="mt-1 text-muted-foreground">{formatDate(risk.nextReview)}</div>
                                </div>
                              </div>
                            </div>

                            {/* Control Assessment Notes */}
                            {(risk.controlAssessment || editingRisk === risk.id) && (
                              <div className="mt-4">
                                <Label className="text-sm font-medium">Control Assessment Notes</Label>
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                                  {editingRisk === risk.id ? editForm.controlAssessment : risk.controlAssessment}
                                </div>
                              </div>
                            )}

                            {/* Treatment Plan */}
                            {(risk.treatmentPlan || editingRisk === risk.id) && (
                              <div className="mt-4">
                                <Label className="text-sm font-medium">Treatment Plan</Label>
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                                  {editingRisk === risk.id ? editForm.treatmentPlan : risk.treatmentPlan}
                                </div>
                              </div>
                            )}

                            {/* Existing Controls */}
                            {(risk.existingControls || editingRisk === risk.id) && parseExistingControls(editingRisk === risk.id ? editForm.existingControls : risk.existingControls).length > 0 && (
                              <div className="mt-4">
                                <Label className="text-sm font-medium">Existing Controls</Label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {parseExistingControls(editingRisk === risk.id ? editForm.existingControls : risk.existingControls).map((control, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {control}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Control Assessment Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Control Assessment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {
                              risks.filter((r) => r.controlEffectiveness?.some((ce) => ce.effectiveness >= 4))
                                .length
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">Risks with High Control Effectiveness</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {
                              risks.filter((r) =>
                                r.controlEffectiveness?.some((ce) => ce.effectiveness >= 3 && ce.effectiveness < 4),
                              ).length
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Risks with Medium Control Effectiveness
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {
                              risks.filter(
                                (r) =>
                                  !r.controlEffectiveness?.length ||
                                  r.controlEffectiveness?.some((ce) => ce.effectiveness < 3),
                              ).length
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Risks with Low/No Control Effectiveness
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            {/* Control Assessment Pagination Controls */}
            <div className="flex items-center justify-between space-x-2 py-4 mt-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing {controlAssessmentStartIndex + 1} to{" "}
                  {Math.min(controlAssessmentEndIndex, totalControlAssessmentItems)} of{" "}
                  {totalControlAssessmentItems} risks
                </p>
                <Select
                  value={String(controlAssessmentItemsPerPage)}
                  onValueChange={(value) => {
                    setControlAssessmentItemsPerPage(Number(value))
                    setControlAssessmentPage(1)
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setControlAssessmentPage(Math.max(1, controlAssessmentPage - 1))}
                      className={controlAssessmentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* First page */}
                  {controlAssessmentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => setControlAssessmentPage(1)} className="cursor-pointer">
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {controlAssessmentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* Current page and surrounding pages */}
                  {Array.from({ length: Math.min(5, totalControlAssessmentPages) }, (_, i) => {
                    const pageNumber =
                      Math.max(1, Math.min(totalControlAssessmentPages - 4, controlAssessmentPage - 2)) + i
                    if (pageNumber <= totalControlAssessmentPages) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setControlAssessmentPage(pageNumber)}
                            isActive={controlAssessmentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  {/* Last page */}
                  {controlAssessmentPage < totalControlAssessmentPages - 2 && (
                    <>
                      {controlAssessmentPage < totalControlAssessmentPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setControlAssessmentPage(totalControlAssessmentPages)}
                          className="cursor-pointer"
                        >
                          {totalControlAssessmentPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setControlAssessmentPage(Math.min(totalControlAssessmentPages, controlAssessmentPage + 1))
                      }
                      className={
                        controlAssessmentPage === totalControlAssessmentPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-4">
            <ISO27001TreatmentTracker />
          </TabsContent>
        </Tabs>

        {/* Admin Edit Risk Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Risk - {selectedRisk?.riskId}</DialogTitle>
              <DialogDescription>Modify risk details (Admin only)</DialogDescription>
            </DialogHeader>
            {selectedRisk && (
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editTitle">Risk Title *</Label>
                    <Input
                      id="editTitle"
                      value={selectedRisk.title}
                      onChange={(e) => setSelectedRisk({ ...selectedRisk, title: e.target.value })}
                      placeholder="Enter risk title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCategory">Category *</Label>
                    <Select
                      value={selectedRisk.category}
                      onValueChange={(value) => setSelectedRisk({ ...selectedRisk, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {riskCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description *</Label>
                  <Textarea
                    id="editDescription"
                    value={selectedRisk.description}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, description: e.target.value })}
                    placeholder="Describe the risk in detail"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLikelihood">Likelihood (1-5)</Label>
                    <Select
                      value={String(selectedRisk.likelihood)}
                      onValueChange={(value) =>
                        setSelectedRisk({ ...selectedRisk, likelihood: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Low</SelectItem>
                        <SelectItem value="2">2 - Low</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - High</SelectItem>
                        <SelectItem value="5">5 - Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editImpact">Impact (1-5)</Label>
                    <Select
                      value={String(selectedRisk.impact)}
                      onValueChange={(value) =>
                        setSelectedRisk({ ...selectedRisk, impact: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Low</SelectItem>
                        <SelectItem value="2">2 - Low</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - High</SelectItem>
                        <SelectItem value="5">5 - Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Risk Score</Label>
                    <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted">
                      {calculateRiskScore(selectedRisk.likelihood, selectedRisk.impact)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editOwner">Risk Owner *</Label>
                    <OwnerSelectInput formData={selectedRisk} setFormData={setSelectedRisk} fieldName="owner" />

                    {/* <Input
                          id="editOwner"
                          value={selectedRisk.owner}
                          onChange={(e) => setSelectedRisk({ ...selectedRisk, owner: e.target.value })}
                          placeholder="Enter risk owner"
                        /> */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">Status</Label>
                    <Select
                      value={selectedRisk.status}
                      onValueChange={(value) => setSelectedRisk({ ...selectedRisk, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Mitigated">Mitigated</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div id="divEditThreat" className="space-y-2">
                    <Label htmlFor="editThreat">Threat</Label>
                    <ThreatSelectInput formData={selectedRisk} setFormData={setSelectedRisk} fieldName="threat" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editTreatmentPlan">Treatment Plan</Label>
                  <Textarea
                    id="editTreatmentPlan"
                    value={selectedRisk.treatmentPlan}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, treatmentPlan: e.target.value })}
                    placeholder="Describe the risk treatment plan"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editControlAssessment">Control Assessment</Label>
                  <Textarea
                    id="editControlAssessment"
                    value={selectedRisk.controlAssessment || ""}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, controlAssessment: e.target.value })}
                    placeholder="Assess the effectiveness of existing controls"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editRiskTreatment">Risk Treatment Strategy</Label>
                  <Select
                    value={selectedRisk.riskTreatment}
                    onValueChange={(value) => setSelectedRisk({ ...selectedRisk, riskTreatment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskTreatmentStrategies.map((strategy) => (
                        <SelectItem key={strategy} value={strategy.split(" - ")[0]}>
                          {strategy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editResidualLikelihood">Residual Likelihood (1-5)</Label>
                    <Select
                      value={String(selectedRisk.residualLikelihood)}
                      onValueChange={(value) =>
                        setSelectedRisk({ ...selectedRisk, residualLikelihood: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Low</SelectItem>
                        <SelectItem value="2">2 - Low</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - High</SelectItem>
                        <SelectItem value="5">5 - Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editResidualImpact">Residual Impact (1-5)</Label>
                    <Select
                      value={String(selectedRisk.residualImpact)}
                      onValueChange={(value) =>
                        setSelectedRisk({ ...selectedRisk, residualImpact: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Low</SelectItem>
                        <SelectItem value="2">2 - Low</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - High</SelectItem>
                        <SelectItem value="5">5 - Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Residual Risk Score</Label>
                    <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted">
                      {calculateResidualRiskScore(selectedRisk.residualLikelihood, selectedRisk.residualImpact)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editReviewDate">Next Review Date</Label>
                  <Input
                    id="editReviewDate"
                    type="date"
                    value={selectedRisk.reviewDate || ""}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, reviewDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assets">Affected Assets</Label>
                  <div className="flex gap-2 mt-2 w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex border rounded px-4 py-2 w-full border-input bg-background text-muted-foreground text-sm">
                        {"Select Affected Assets"}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {assets.map((assest: any) => (
                          <DropdownMenuCheckboxItem
                            key={assest.id}
                            checked={selectedRisk.assets.includes(assest.asset_name)}
                            onCheckedChange={() => {
                              toggleItems(assest.asset_name, 'assets_edit')
                            }}
                          >
                            {assest.asset_name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap gap-2 m-4">
                    {selectedRisk.assets.map((asset, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700">
                        {asset}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleItems(asset, 'assets_edit')} />
                      </Badge>
                    ))}
                  </div>




                  {/* <Label htmlFor="editAssets">Affected Assets</Label>
                      <Input
                        id="editAssets"
                        value={selectedRisk.assets?.join(", ") || ""}
                        onChange={(e) =>
                          setSelectedRisk({
                            ...selectedRisk,
                            assets: e.target.value
                              .split(",")
                              .map((a) => a.trim())
                              .filter((a) => a.length > 0),
                          })
                        }
                        placeholder="Enter affected assets separated by commas"
                      /> */}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRisk} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Risk
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Risk Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Risk Details - {selectedRisk?.riskId}</DialogTitle>
              <DialogDescription>Detailed view of risk information and assessments</DialogDescription>
            </DialogHeader>
            {selectedRisk && (
              <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Title:</strong> {selectedRisk.title}
                      </div>
                      <div>
                        <strong>Category:</strong> {selectedRisk.category}
                      </div>
                      <div>
                        <strong>Owner:</strong> {selectedRisk.owner}
                      </div>
                      {selectedRisk.threat && (
                        <div>
                          <strong>Threat:</strong> {selectedRisk.threat}
                        </div>
                      )}
                      <div>
                        <strong>Status:</strong>
                        <Badge variant="outline" className={`ml-2 ${getStatusColor(selectedRisk.status)}`}>
                          {selectedRisk.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Risk Assessment</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Likelihood:</strong> {selectedRisk.likelihood}/5
                      </div>
                      <div>
                        <strong>Impact:</strong> {selectedRisk.impact}/5
                      </div>
                      <div>
                        <strong>Risk Score:</strong> {selectedRisk.riskScore}
                      </div>
                      <div>
                        <strong>Risk Level:</strong>
                        <Badge variant="outline" className={`ml-2 ${getRiskLevelColor(selectedRisk.riskLevel)}`}>
                          {selectedRisk.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedRisk.description}</p>
                </div>

                {selectedRisk.treatmentPlan && (
                  <div>
                    <h3 className="font-semibold mb-2">Treatment Plan</h3>
                    <p className="text-sm text-muted-foreground">{selectedRisk.treatmentPlan}</p>
                  </div>
                )}

                {selectedRisk.controlAssessment && (
                  <div>
                    <h3 className="font-semibold mb-2">Control Assessment</h3>
                    <p className="text-sm text-muted-foreground">{selectedRisk.controlAssessment}</p>
                  </div>
                )}

                {selectedRisk.existingControls && parseExistingControls(selectedRisk.existingControls).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Existing Controls</h3>
                    <div className="flex flex-wrap gap-2">
                      {parseExistingControls(selectedRisk.existingControls).map((control, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {control}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Residual Risk</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Residual Likelihood:</strong> {selectedRisk.residualLikelihood}/5
                      </div>
                      <div>
                        <strong>Residual Impact:</strong> {selectedRisk.residualImpact}/5
                      </div>
                      <div>
                        <strong>Residual Score:</strong> {selectedRisk.residualRisk}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Review Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Last Reviewed:</strong> {formatDate(selectedRisk.lastReviewed)}
                      </div>
                      <div>
                        <strong>Next Review:</strong> {formatDate(selectedRisk.nextReview)}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRisk.controls && selectedRisk.controls.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Associated Controls</h3>
                    <div className="space-y-2">
                      {selectedRisk.controls.map((controlId, index) => {
                        const controlName = iso27001Controls.find((c) => c.startsWith(controlId))
                        const effectiveness = selectedRisk.controlEffectiveness?.find(
                          (ce) => ce.controlId === controlId,
                        )
                        return (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium text-sm">{controlId}</div>
                              <div className="text-xs text-muted-foreground">
                                {controlName?.split(" - ")[1] || ""}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {renderStars(effectiveness?.effectiveness || 0)}
                              <span className="text-xs text-muted-foreground">
                                {getEffectivenessLabel(effectiveness?.effectiveness || 0)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedRisk.assets && selectedRisk.assets.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Affected Assets</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRisk.assets.map((asset, index) => (
                        <Badge key={index} variant="outline">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRisk.evidence && selectedRisk.evidence.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Evidence Files</h3>
                    <div className="space-y-2">
                      {selectedRisk.evidence.map((evidence) => (
                        <div key={evidence.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="font-medium text-sm">{evidence.file_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatFileSize(evidence.file_size)} • {formatDate(evidence.created_at)}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadEvidence(evidence.id, evidence.file_name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Validation Rules Dialog */}
        <Dialog open={isValidationRulesDialogOpen} onOpenChange={setIsValidationRulesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Evidence Validation Rules</DialogTitle>
              <DialogDescription>Configure when evidence is required for status changes</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireEvidenceForMitigated"
                  checked={validationRules.require_evidence_for_mitigated}
                  onChange={(e) =>
                    setValidationRules({
                      ...validationRules,
                      require_evidence_for_mitigated: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="requireEvidenceForMitigated">Require evidence for "Mitigated" status</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireEvidenceForAccepted"
                  checked={validationRules.require_evidence_for_accepted}
                  onChange={(e) =>
                    setValidationRules({
                      ...validationRules,
                      require_evidence_for_accepted: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="requireEvidenceForAccepted">Require evidence for "Accepted" status</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsValidationRulesDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => updateValidationRules(validationRules)}>Save Rules</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
