"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Search,
  Eye,
  RefreshCw,
  FileText,
  Shield,
  AlertTriangle,
  Target,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Download,
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
import { getThreats } from "@/lib/actions/threat-actions"
import { getVulnerabilities } from "@/lib/actions/vulnerability-actions"

interface RiskTemplate {
  id: number
  template_id: string
  template_name: string
  risk_description: string
  function_id: number
  category_id: number
  default_likelihood: number
  default_impact: number
  risk_level: string
  residual_likelihood: number
  residual_impact: number
  residual_risk_level: string
  existing_controls: string[]
  control_references: number[]
  implementation_guidance: string
  compliance_requirements: number[]
  maturity_level: number
  risk_treatment: string
  threat_sources: string[]
  vulnerabilities: string[]
  asset_types: string[]
  nist_references: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  function_code: string
  function_name: string
  category_code: string
  category_name: string
}

interface CSFFunction {
  id: number
  function_code: string
  function_name: string
}

interface CSFCategory {
  id: number
  category_code: string
  category_name: string
  function_id: number
}

interface NISTReference {
  id: number
  reference_code: string
  reference_name: string
  reference_description: string
  reference_type: string
  category: string
  implementation_guidance: string
  compliance_requirement: string
}

interface ImplementationTier {
  id: number
  tier_level: number
  tier_name: string
  tier_description: string
}

// Mock user role - in real app, this would come from authentication context
const getCurrentUserRole = () => {
  // This would typically come from your auth context/session
  return "admin" // or "user"
}

export function NISTCSFRiskTemplatesList() {
  const [templates, setTemplates] = useState<RiskTemplate[]>([])
  const [functions, setFunctions] = useState<CSFFunction[]>([])
  const [categories, setCategories] = useState<CSFCategory[]>([])
  const [nistReferences, setNistReferences] = useState<NISTReference[]>([])
  const [implementationTiers, setImplementationTiers] = useState<ImplementationTier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [functionFilter, setFunctionFilter] = useState("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<RiskTemplate | null>(null)
  const [formData, setFormData] = useState({
    template_name: "",
    risk_description: "",
    function_id: "",
    category_id: "",
    default_likelihood: 1,
    default_impact: 1,
    risk_level: "Low",
    residual_likelihood: 1,
    residual_impact: 1,
    residual_risk_level: "Low",
    existing_controls: [] as string[],
    control_references: [] as number[],
    implementation_guidance: "",
    compliance_requirements: [] as number[],
    maturity_level: 1,
    risk_treatment: "Mitigate",
    threat_sources: [] as string[],
    vulnerabilities: [] as string[],
    asset_types: [] as string[],
    nist_references: [] as string[],
  })
  const [threatSourceInput, setThreatSourceInput] = useState("")
  const [vulnerabilityInput, setVulnerabilityInput] = useState("")
  const [threats, setThreats] = useState([])
  const [assets, setAssets] = useState([])
  const [vulnerabilities, setVulnerabilities] = useState([])

  const [assetTypeInput, setAssetTypeInput] = useState("")
  const [nistReferenceInput, setNistReferenceInput] = useState("")
  const [existingControlInput, setExistingControlInput] = useState("")
  const [controlReferenceSearch, setControlReferenceSearch] = useState("")
  const [complianceRequirementSearch, setComplianceRequirementSearch] = useState("")
  const [filteredControlReferences, setFilteredControlReferences] = useState<NISTReference[]>([])
  const [filteredComplianceRequirements, setFilteredComplianceRequirements] = useState<NISTReference[]>([])
  const { toast } = useToast()

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importResults, setImportResults] = useState<{ imported: number; errors: string[] } | null>(null)

  const userRole = getCurrentUserRole()
  const isAdmin = userRole === "admin"

  const [selectedThreats, setSelectedThreats] = useState<string[]>([])
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [selectedNISTRefs, setSelectedNISTRefs] = useState<string[]>([])

  const toggleItems = (Item: string, type: string) => {
    if (type === "threat_sources") {
    setSelectedThreats((prev) => {
      if (prev.includes(Item)) {
        // remove
        removeArrayItem("threat_sources", prev.indexOf(Item))
        return prev.filter((f) => f !== Item)
      } else {
        // add
        addArrayItem("threat_sources", Item, setThreatSourceInput)
        return [...prev, Item]
        }
      })
    } else if (type == 'vulnerabilities') {
      setSelectedVulnerabilities((prev) =>
        prev.includes(Item)
          ? prev.filter((f) => f !== Item)
          : [...prev, Item]
      )
      addArrayItem("vulnerabilities", Item, setVulnerabilityInput)
      selectedVulnerabilities.map((v, index) => {
        if (v == Item) {
          removeArrayItem("vulnerabilities", index)
        }
      })
    }
    else if (type == 'asset_types') {
      setSelectedAssets((prev) =>
        prev.includes(Item)
          ? prev.filter((f) => f !== Item)
          : [...prev, Item]
      )
      addArrayItem("asset_types", Item, setAssetTypeInput)
      selectedAssets.map((a, index) => {
        if (a == Item) {
          removeArrayItem("asset_types", index)
        }
      })
    } else if (type == 'nist_references') {
      setSelectedNISTRefs((prev) =>
        prev.includes(Item)
          ? prev.filter((f) => f !== Item)
          : [...prev, Item]
      )
      addArrayItem("nist_references", Item, setNistReferenceInput)
      selectedNISTRefs.map((n, index) => {
        if (n == Item) {
          removeArrayItem("nist_references", index)
        }
      })
    }
  }

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      if (functionFilter !== "all") {
        params.append("functionId", functionFilter)
      }
      if (riskLevelFilter !== "all") {
        params.append("riskLevel", riskLevelFilter)
      }

      const response = await fetch(`/api/nist-csf-risk-templates?${params}`)
      const data = await response.json()

      if (data.success) {
        setTemplates(data.data.templates)
        setTotalItems(data.data.pagination.total)
        setTotalPages(data.data.pagination.totalPages)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching risk templates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch risk templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchFunctions = async () => {
    try {
      const response = await fetch("/api/nist-csf-functions")
      const data = await response.json()

      if (data.success) {
        setFunctions(data.data)
      }
    } catch (error) {
      console.error("Error fetching NIST CSF functions:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/nist-csf-categories")
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Error fetching NIST CSF categories:", error)
    }
  }

  const fetchNISTReferences = async () => {
    try {
      const response = await fetch("/api/nist-references?limit=100")
      const data = await response.json()

      if (data.success) {
        setNistReferences(data.data)
      }
    } catch (error) {
      console.error("Error fetching NIST references:", error)
    }
  }

  const fetchImplementationTiers = async () => {
    try {
      const response = await fetch("/api/nist-csf-implementation-tiers")
      const data = await response.json()

      if (data.success) {
        setImplementationTiers(data.data)
      }
    } catch (error) {
      console.error("Error fetching implementation tiers:", error)
    }
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

    const fetchThreats = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/threats")
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setThreats(data.data)
        } else {
          setThreats([])
        }
      } catch (err) {
        console.error("Failed to load threats:", err)
        setThreats([])
      } finally {
        setLoading(false)
      }
    }
  
    const fetchVulnerabilities = async () => {
      try {
        setLoading(true)
        const result = await getVulnerabilities({
          limit: 1000,
        })
        if (result.success && Array.isArray(result.data)) {
          setVulnerabilities(result.data)
        } else {
          setVulnerabilities([])
        }
      } catch (error) {
        console.error("Failed to load vulnerabilities:", error)
        setVulnerabilities([])
      } finally {
        setLoading(false)
      }


    }

  useEffect(() => {
    fetchFunctions()
    fetchCategories()
    fetchNISTReferences()
    fetchImplementationTiers()
    fetchThreats()
    fetchAssets()
    fetchVulnerabilities()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTemplates()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, functionFilter, riskLevelFilter, currentPage])

  // Filter control references based on search
  useEffect(() => {
    if (controlReferenceSearch) {
      const filtered = nistReferences.filter(
        (ref) =>
          ref.reference_type === "control" &&
          (ref.reference_code.toLowerCase().includes(controlReferenceSearch.toLowerCase()) ||
            ref.reference_name.toLowerCase().includes(controlReferenceSearch.toLowerCase())),
      )
      setFilteredControlReferences(filtered.slice(0, 10))
    } else {
      setFilteredControlReferences([])
    }
  }, [controlReferenceSearch, nistReferences])

  // Filter compliance requirements based on search
  useEffect(() => {
    if (complianceRequirementSearch) {
      const filtered = nistReferences.filter(
        (ref) =>
          ref.reference_type === "compliance" &&
          (ref.reference_code.toLowerCase().includes(complianceRequirementSearch.toLowerCase()) ||
            ref.reference_name.toLowerCase().includes(complianceRequirementSearch.toLowerCase())),
      )
      setFilteredComplianceRequirements(filtered.slice(0, 10))
    } else {
      setFilteredComplianceRequirements([])
    }
  }, [complianceRequirementSearch, nistReferences])

  const resetForm = () => {
    setFormData({
      template_name: "",
      risk_description: "",
      function_id: "",
      category_id: "",
      default_likelihood: 1,
      default_impact: 1,
      risk_level: "Low",
      residual_likelihood: 1,
      residual_impact: 1,
      residual_risk_level: "Low",
      existing_controls: [],
      control_references: [],
      implementation_guidance: "",
      compliance_requirements: [],
      maturity_level: 1,
      risk_treatment: "Mitigate",
      threat_sources: [],
      vulnerabilities: [],
      asset_types: [],
      nist_references: [],
    })
    setThreatSourceInput("")
    setVulnerabilityInput("")
    setAssetTypeInput("")
    setNistReferenceInput("")
    setExistingControlInput("")
    setControlReferenceSearch("")
    setComplianceRequirementSearch("")
    setSelectedThreats([])
    setSelectedVulnerabilities([])
    setSelectedAssets([])
    setSelectedNISTRefs([])
  }

  const calculateRiskLevel = (likelihood: number, impact: number) => {
    const score = likelihood * impact
    if (score >= 20) return "Critical"
    if (score >= 15) return "High"
    if (score >= 8) return "Medium"
    return "Low"
  }

  const handleLikelihoodChange = (value: number, isResidual = false) => {
    const field = isResidual ? "residual_likelihood" : "default_likelihood"
    const impactField = isResidual ? "residual_impact" : "default_impact"
    const riskLevelField = isResidual ? "residual_risk_level" : "risk_level"

    const newFormData = { ...formData, [field]: value }
    newFormData[riskLevelField] = calculateRiskLevel(value, formData[impactField])
    setFormData(newFormData)
  }

  const handleImpactChange = (value: number, isResidual = false) => {
    const field = isResidual ? "residual_impact" : "default_impact"
    const likelihoodField = isResidual ? "residual_likelihood" : "default_likelihood"
    const riskLevelField = isResidual ? "residual_risk_level" : "risk_level"

    const newFormData = { ...formData, [field]: value }
    newFormData[riskLevelField] = calculateRiskLevel(formData[likelihoodField], value)
    setFormData(newFormData)
  }

  const addArrayItem = (field: keyof typeof formData, value: string, inputSetter: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[]
      if (!currentArray.includes(value.trim())) {
        setFormData({
          ...formData,
          [field]: [...currentArray, value.trim()],
        })
      }
      inputSetter("")
    }
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const currentArray = formData[field] as string[]
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index),
    })
    if (field == 'threat_sources') {
      setSelectedThreats((prev) => prev.filter((f, i) => index !== i))
    } else if (field == 'vulnerabilities') {
      setSelectedVulnerabilities((prev) => prev.filter((f, i) => index !== i))
    } else if (field == 'asset_types') {
      setSelectedAssets((prev) => prev.filter((f, i) => index !== i))
    } else if (field == 'nist_references') {
      setSelectedNISTRefs((prev) => prev.filter((f, i) => index !== i))
    }
  }

  const addControlReference = (reference: NISTReference) => {
    if (!formData.control_references.includes(reference.id)) {
      setFormData({
        ...formData,
        control_references: [...formData.control_references, reference.id],
        implementation_guidance: reference.implementation_guidance || formData.implementation_guidance,
      })
    }
    setControlReferenceSearch("")
  }

  const removeControlReference = (referenceId: number) => {
    setFormData({
      ...formData,
      control_references: formData.control_references.filter((id) => id !== referenceId),
    })
  }

  const addComplianceRequirement = (reference: NISTReference) => {
    if (!formData.compliance_requirements.includes(reference.id)) {
      setFormData({
        ...formData,
        compliance_requirements: [...formData.compliance_requirements, reference.id],
      })
    }
    setComplianceRequirementSearch("")
  }

  const removeComplianceRequirement = (referenceId: number) => {
    setFormData({
      ...formData,
      compliance_requirements: formData.compliance_requirements.filter((id) => id !== referenceId),
    })
  }

  const handleSubmit = async (isEdit = false) => {
    try {
      const url = isEdit ? `/api/nist-csf-risk-templates/${selectedTemplate?.id}` : "/api/nist-csf-risk-templates"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Risk template ${isEdit ? "updated" : "created"} successfully`,
        })
        fetchTemplates()
        if (isEdit) {
          setIsEditDialogOpen(false)
        } else {
          setIsAddDialogOpen(false)
        }
        resetForm()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} risk template:`, error)
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} risk template`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (templateId: number) => {
    try {
      const response = await fetch(`/api/nist-csf-risk-templates/${templateId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Risk template deleted successfully",
        })
        fetchTemplates()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting risk template:", error)
      toast({
        title: "Error",
        description: "Failed to delete risk template",
        variant: "destructive",
      })
    }
  }

  const handleView = (template: RiskTemplate) => {
    setSelectedTemplate(template)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (template: RiskTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      template_name: template.template_name,
      risk_description: template.risk_description,
      function_id: template.function_id.toString(),
      category_id: template.category_id?.toString() || "",
      default_likelihood: template.default_likelihood,
      default_impact: template.default_impact,
      risk_level: template.risk_level,
      residual_likelihood: template.residual_likelihood || template.default_likelihood,
      residual_impact: template.residual_impact || template.default_impact,
      residual_risk_level: template.residual_risk_level || template.risk_level,
      existing_controls: template.existing_controls || [],
      control_references: template.control_references || [],
      implementation_guidance: template.implementation_guidance || "",
      compliance_requirements: template.compliance_requirements || [],
      maturity_level: template.maturity_level || 1,
      risk_treatment: template.risk_treatment || "Mitigate",
      threat_sources: template.threat_sources || [],
      vulnerabilities: template.vulnerabilities || [],
      asset_types: template.asset_types || [],
      nist_references: template.nist_references || [],
    })
    setIsEditDialogOpen(true)
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

  const getFunctionIcon = (functionCode: string) => {
    switch (functionCode) {
      case "ID":
        return <Search className="h-4 w-4" />
      case "PR":
        return <Shield className="h-4 w-4" />
      case "DE":
        return <Eye className="h-4 w-4" />
      case "RS":
        return <AlertTriangle className="h-4 w-4" />
      case "RC":
        return <Target className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredCategories = categories.filter(
    (cat) => formData.function_id === "" || cat.function_id.toString() === formData.function_id,
  )

  const getSelectedControlReferences = () => {
    return nistReferences.filter((ref) => formData.control_references.includes(ref.id))
  }

  const getSelectedComplianceRequirements = () => {
    return nistReferences.filter((ref) => formData.compliance_requirements.includes(ref.id))
  }

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

      const response = await fetch("/api/nist-csf-risk-templates/import", {
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
          description: `Imported ${data.imported} templates with ${data.errors.length} errors`,
        })
        fetchTemplates()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error importing templates:", error)
      toast({
        title: "Import Failed",
        description: "Failed to import risk templates",
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

      if (functionFilter !== "all") {
        params.append("functionId", functionFilter)
      }
      if (riskLevelFilter !== "all") {
        params.append("riskLevel", riskLevelFilter)
      }

      const response = await fetch(`/api/nist-csf-risk-templates/export?${params}`)
      const data = await response.json()

      if (data.success) {
        const csvContent = convertToCSV(data.data)
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `nist-csf-risk-templates-${format}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Export Successful",
          description: `Exported ${data.data.length} templates`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error exporting templates:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export risk templates",
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

  const renderFormDialog = (isEdit = false) => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit" : "Add New"} NIST CSF Risk Template</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template_name">Template Name *</Label>
                <Input
                  id="template_name"
                  value={formData.template_name}
                  onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                  placeholder="Enter template name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="function_id">NIST Function *</Label>
                <Select
                  value={formData.function_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, function_id: value, category_id: "" })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select function" />
                  </SelectTrigger>
                  <SelectContent>
                    {functions.map((func) => (
                      <SelectItem key={func.id} value={func.id.toString()}>
                        {func.function_code} - {func.function_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_id">NIST Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  disabled={!formData.function_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.category_code} - {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="risk_treatment">Risk Treatment *</Label>
                <Select
                  value={formData.risk_treatment}
                  onValueChange={(value) => setFormData({ ...formData, risk_treatment: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mitigate">Mitigate</SelectItem>
                    <SelectItem value="Avoidance">Avoidance</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Eliminate">Eliminate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="risk_description">Risk Description *</Label>
              <Textarea
                id="risk_description"
                value={formData.risk_description}
                onChange={(e) => setFormData({ ...formData, risk_description: e.target.value })}
                placeholder="Detailed description of the cybersecurity risk..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Inherent Risk */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Inherent Risk</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Likelihood (1-5) *</Label>
                    <Select
                      value={formData.default_likelihood.toString()}
                      onValueChange={(value) => handleLikelihoodChange(Number.parseInt(value), false)}
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
                  <div>
                    <Label>Impact (1-5) *</Label>
                    <Select
                      value={formData.default_impact.toString()}
                      onValueChange={(value) => handleImpactChange(Number.parseInt(value), false)}
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
                <div>
                  <Label>Risk Level</Label>
                  <div className="mt-2">
                    <Badge variant="outline" className={getRiskLevelColor(formData.risk_level)}>{formData.risk_level}</Badge>
                    <span className="text-sm text-muted-foreground ml-2">
                      Score: {formData.default_likelihood * formData.default_impact}
                    </span>
                  </div>
                </div>
              </div>

              {/* Residual Risk */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Residual Risk</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Residual Likelihood (1-5)</Label>
                    <Select
                      value={formData.residual_likelihood.toString()}
                      onValueChange={(value) => handleLikelihoodChange(Number.parseInt(value), true)}
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
                  <div>
                    <Label>Residual Impact (1-5)</Label>
                    <Select
                      value={formData.residual_impact.toString()}
                      onValueChange={(value) => handleImpactChange(Number.parseInt(value), true)}
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
                <div>
                  <Label>Residual Risk Level</Label>
                  <div className="mt-2">
                    <Badge variant="outline" className={getRiskLevelColor(formData.residual_risk_level)}>
                      {formData.residual_risk_level}
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">
                      Score: {formData.residual_likelihood * formData.residual_impact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="maturity_level">Maturity Level</Label>
              <Select
                value={formData.maturity_level.toString()}
                onValueChange={(value) => setFormData({ ...formData, maturity_level: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {implementationTiers.map((tier) => (
                    <SelectItem key={tier.tier_level} value={tier.tier_level.toString()}>
                      Tier {tier.tier_level} - {tier.tier_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Controls and References */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Controls and References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Controls */}
            <div>
              <Label>Existing Controls</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={existingControlInput}
                  onChange={(e) => setExistingControlInput(e.target.value)}
                  placeholder="Add existing control"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addArrayItem("existing_controls", existingControlInput, setExistingControlInput)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem("existing_controls", existingControlInput, setExistingControlInput)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.existing_controls.map((control, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {control}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem("existing_controls", index)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Control References */}
            <div>
              <Label>Control References</Label>
              <div className="relative">
                <Input
                  value={controlReferenceSearch}
                  onChange={(e) => setControlReferenceSearch(e.target.value)}
                  placeholder="Search control references..."
                />
                {filteredControlReferences.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredControlReferences.map((ref) => (
                      <div
                        key={ref.id}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        onClick={() => addControlReference(ref)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{ref.reference_code}</span>
                          <span className="text-xs text-gray-500 truncate">{ref.reference_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {getSelectedControlReferences().map((ref) => (
                  <Badge key={ref.id} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700">
                    {ref.reference_code}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeControlReference(ref.id)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Implementation Guidance */}
            <div>
              <Label htmlFor="implementation_guidance">Implementation Guidance</Label>
              <Textarea
                id="implementation_guidance"
                value={formData.implementation_guidance}
                onChange={(e) => setFormData({ ...formData, implementation_guidance: e.target.value })}
                placeholder="Implementation guidance and recommendations..."
                rows={3}
              />
            </div>

            {/* Compliance Requirements */}
            <div>
              <Label>Compliance Requirements</Label>
              <div className="relative">
                <Input
                  value={complianceRequirementSearch}
                  onChange={(e) => setComplianceRequirementSearch(e.target.value)}
                  placeholder="Search compliance requirements..."
                />
                {filteredComplianceRequirements.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredComplianceRequirements.map((req) => (
                      <div
                        key={req.id}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        onClick={() => addComplianceRequirement(req)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{req.reference_code}</span>
                          <span className="text-xs text-gray-500 truncate">{req.reference_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {getSelectedComplianceRequirements().map((req) => (
                  <Badge key={req.id} variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700">
                    {req.reference_code}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeComplianceRequirement(req.id)} />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Threat Sources */}
            <div>
              <Label>Threat Sources</Label>
              <div className="flex gap-2 mt-2 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex border rounded px-4 py-2 w-full border-input bg-background text-muted-foreground text-sm">
                    {"Select Threat Sources"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {threats.map((threat: any) => (
                      <DropdownMenuCheckboxItem
                        key={threat.threat_id}
                        checked={formData.threat_sources.includes(threat.name)}
                        onCheckedChange={() => toggleItems(threat.name, "threat_sources")}
                      >
                        {threat.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 m-4">
                {formData.threat_sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {source}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem("threat_sources", index)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Vulnerabilities */}
            <div>
              <Label>Vulnerabilities</Label>
              <div className="flex gap-2 mt-2 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex border rounded px-4 py-2 w-full border-input bg-background text-muted-foreground text-sm">
                    {"Select Vulnerabilities"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {vulnerabilities.map((vul: any) => (
                      <DropdownMenuCheckboxItem
                        key={vul.id}
                        checked={selectedVulnerabilities.includes(vul.name)}
                        onCheckedChange={() => {
                          toggleItems(vul.name, 'vulnerabilities')
                        }}
                      >
                        {vul.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 m-4">
                {formData.vulnerabilities.map((vuln, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700">
                    {vuln}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem("vulnerabilities", index)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Asset Types */}
            <div>
              <Label>Asset Types</Label>
              <div className="flex gap-2 mt-2 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex border rounded px-4 py-2 w-full border-input bg-background text-muted-foreground text-sm">
                    {"Select Asset Types"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {assets.map((asset: any) => (
                      <DropdownMenuCheckboxItem
                        key={asset.asset_id}
                        checked={selectedAssets.includes(asset.asset_name)}
                        onCheckedChange={() => {
                          toggleItems(asset.asset_name, 'asset_types')
                        }}
                      >
                        {asset.asset_name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 m-4">
                {formData.asset_types.map((asset, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700">
                    {asset}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem("asset_types", index)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* NIST References */}
            <div>
              <Label>NIST References</Label>
              <div className="flex gap-2 mt-2 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex border rounded px-4 py-2 w-full border-input bg-background text-muted-foreground text-sm">
                    {"Select NIST References"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {nistReferences.map((nist: any) => (
                      <DropdownMenuCheckboxItem
                        key={nist.id}
                        checked={selectedNISTRefs.includes(nist.reference_code)}
                        onCheckedChange={() => {
                          toggleItems(nist.reference_code, 'nist_references')
                        }}
                      >
                        {nist.reference_code}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 m-4">
                {formData.nist_references.map((ref, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700">
                    {ref}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem("nist_references", index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              if (isEdit) {
                setIsEditDialogOpen(false)
              } else {
                setIsAddDialogOpen(false)
              }
              resetForm()
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(isEdit)}>
            <Save className="mr-2 h-4 w-4" />
            {isEdit ? "Update" : "Create"} Template
          </Button>
        </div>
      </div>
    </DialogContent>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                NIST CSF Risk Register
                {isAdmin && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Admin Access
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Standardized risk assessment aligned with NIST Cybersecurity Framework
              </CardDescription>
            </div>
            {isAdmin && (
              <div className="flex space-x-2">
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      Import
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Risk Templates</DialogTitle>
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
                        <Button variant="outline" onClick={() => handleExport("template")}>
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
                      <DialogTitle>Export Risk Templates</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Export will include all templates matching your current filters.
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

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                   <Button onClick={resetForm}>
                      Add New Risk
                    </Button>
                  </DialogTrigger>
                  {renderFormDialog(false)}
                </Dialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={functionFilter} onValueChange={setFunctionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by function" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Functions</SelectItem>
                  {functions.map((func) => (
                    <SelectItem key={func.id} value={func.id.toString()}>
                      {func.function_code} - {func.function_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
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
            <Button variant="outline" onClick={fetchTemplates} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Total Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{totalItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Critical Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {templates.filter((t) => t.risk_level === "Critical").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  High Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {templates.filter((t) => t.risk_level === "High").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Active Functions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{functions.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading risk templates...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="truncate">Template ID</TableHead>
                    <TableHead className="truncate">Template Name</TableHead>
                    <TableHead className="truncate">Function</TableHead>
                    <TableHead className="truncate">Risk Level</TableHead>
                    <TableHead className="truncate">Residual Risk</TableHead>
                    <TableHead className="truncate">Treatment</TableHead>
                    <TableHead className="truncate">Maturity</TableHead>
                    <TableHead className="truncate">Created</TableHead>
                    <TableHead className="truncate text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No risk templates found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-mono text-sm truncate">{template.template_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{template.template_name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {template.risk_description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFunctionIcon(template.function_code)}
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{template.function_code}</div>
                              <div className="text-xs text-muted-foreground">{template.function_name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge  variant="outline" className={getRiskLevelColor(template.risk_level)}>{template.risk_level}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge  variant="outline" className={getRiskLevelColor(template.residual_risk_level || template.risk_level)}>
                            {template.residual_risk_level || template.risk_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.risk_treatment || "Mitigate"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="text-sm font-medium">Tier {template.maturity_level || 1}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(template.created_at).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(template)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" 
                                    className="text-red-400 hover:bg-red-900/20 hover:text-red-300">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Risk Template</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{template.template_name}"? This action cannot
                                        be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(template.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
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
          {templates.length > 0 && totalPages > 1 && (
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
            <DialogTitle>Risk Template Details</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Template ID</Label>
                  <p className="text-sm mt-1 font-mono p-3 rounded">{selectedTemplate.template_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Template Name</Label>
                  <p className="text-sm mt-1 p-3 rounded font-semibold">{selectedTemplate.template_name}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Risk Description</Label>
                <p className="text-sm mt-1 p-3 rounded">{selectedTemplate.risk_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">NIST Function</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getFunctionIcon(selectedTemplate.function_code)}
                    <div>
                      <div className="font-medium text-sm">{selectedTemplate.function_code}</div>
                      <div className="text-xs text-muted-foreground">{selectedTemplate.function_name}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Risk Treatment</Label>
                  <div className="space-y-2 mt-1">
                    <Badge variant="outline" className="mt-1">
                      {selectedTemplate.risk_treatment || "Mitigate"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Maturity Level</Label>
                  <div className="text-sm font-semibold mt-1">Tier {selectedTemplate.maturity_level || 1}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Inherent Risk</Label>
                  <div className="space-y-2 mt-1">
                    <Badge variant="outline" className={getRiskLevelColor(selectedTemplate.risk_level)}>
                      {selectedTemplate.risk_level}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Likelihood: {selectedTemplate.default_likelihood}, Impact: {selectedTemplate.default_impact}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Residual Risk</Label>
                  <div className="space-y-2 mt-1">
                    <Badge
                      variant="outline"
                      className={getRiskLevelColor(selectedTemplate.residual_risk_level || selectedTemplate.risk_level)}
                    >
                      {selectedTemplate.residual_risk_level || selectedTemplate.risk_level}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Likelihood: {selectedTemplate.residual_likelihood || selectedTemplate.default_likelihood}, Impact:{" "}
                      {selectedTemplate.residual_impact || selectedTemplate.default_impact}
                    </div>
                  </div>
                </div>
              </div>

              {selectedTemplate.existing_controls && selectedTemplate.existing_controls.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Existing Controls</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTemplate.existing_controls.map((control, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                        {control}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate.implementation_guidance && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Implementation Guidance</Label>
                  <p className="text-sm mt-1 bg-gray-50 p-3 rounded">{selectedTemplate.implementation_guidance}</p>
                </div>
              )}

              {selectedTemplate.threat_sources && selectedTemplate.threat_sources.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Threat Sources</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTemplate.threat_sources.map((source, index) => (
                      <Badge key={index} variant="outline">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate.vulnerabilities && selectedTemplate.vulnerabilities.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Vulnerabilities</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTemplate.vulnerabilities.map((vuln, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                        {vuln}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate.asset_types && selectedTemplate.asset_types.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Affected Asset Types</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTemplate.asset_types.map((asset, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm">{new Date(selectedTemplate.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">{new Date(selectedTemplate.updated_at).toLocaleDateString()}</p>
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
    </div>
  )
}
