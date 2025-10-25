"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TechnologyRiskForm } from "@/components/technology-risk-form"
import { TechnologyRiskChatbot } from "@/components/technology-risk-chatbot"

import { ControlAssessmentModule } from "@/components/control-assessment-module"
import { RemediationEditForm } from "@/components/remediation-edit-form"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Shield,
  Target,
  Cpu,
  Download,
  BarChart3,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import StarBorder from "@/app/StarBorder"
import { ActionButtons } from "@/components/ui/action-buttons"

interface TechnologyRisk {
  id: number
  risk_id: string
  title: string
  description: string
  technology_category: string
  technology_type: string
  asset_ids?: string | null
  asset_name: string
  risk_category: string
  likelihood: number
  impact: number
  risk_score: number
  risk_level: string
  residual_impact: number
  residual_likelihood: number
  residual_risk: number
  current_controls: string
  recommended_controls: string
  control_assessment: string
  risk_treatment: string
  treatment_state: string
  treatment_end_date: string
  action_owner: string
  owner: string
  status: string
  due_date: string
  created_at: string
  updated_at: string
  related_assets?: Asset[]
}

interface Asset {
  id: string
  asset_name: string
  asset_type: string
  classification: string
  owner: string
}

interface DashboardStats {
  total: number
  high: number
  medium: number
  low: number
  open: number
  inProgress: number
  mitigated: number
  overdue: number
  byCategory: Array<{ name: string; value: number; color: string }>
  byTreatment: Array<{ name: string; value: number }>
  trendData: Array<{ month: string; created: number; resolved: number }>
  recentActivity: Array<{ id: string; action: string; risk: string; date: string; user: string }>
}

export default function TechnologyRisksPage() {
  const [risks, setRisks] = useState<TechnologyRisk[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [assetsLoading, setAssetsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingRisk, setEditingRisk] = useState<TechnologyRisk | null>(null)
  const [viewingRisk, setViewingRisk] = useState<TechnologyRisk | null>(null)
  const [showDashboard, setShowDashboard] = useState(true)

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [treatmentFilter, setTreatmentFilter] = useState<string>("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all")

  const [editingControlAssessment, setEditingControlAssessment] = useState<any>(null)
  const [viewingControlAssessment, setViewingControlAssessment] = useState<any>(null)
  const [editingRemediation, setEditingRemediation] = useState<any>(null)
  const [viewingRemediation, setViewingRemediation] = useState<any>(null)

  // Pagination state for Technology Risks tab
  const [risksCurrentPage, setRisksCurrentPage] = useState(1)
  const [risksPageSize, setRisksPageSize] = useState(10)

  // Pagination state for Control Assessments tab
  const [controlsCurrentPage, setControlsCurrentPage] = useState(1)
  const [controlsPageSize, setControlsPageSize] = useState(10)

  // Pagination state for Risk Remediation tab
  const [remediationCurrentPage, setRemediationCurrentPage] = useState(1)
  const [remediationPageSize, setRemediationPageSize] = useState(10)

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    open: 0,
    inProgress: 0,
    mitigated: 0,
    overdue: 0,
    byCategory: [],
    byTreatment: [],
    trendData: [],
    recentActivity: [],
  })

  useEffect(() => {
    fetchRisks()
    fetchAssets()
  }, [])

  const fetchRisks = async () => {
    try {
      setLoading(true)
      console.log("Fetching technology risks...")
      const response = await fetch("/api/technology-risks")
      const data = await response.json()

      console.log("Technology risks response:", data)

      if (data.success) {
        const risksArray = Array.isArray(data.risks) ? data.risks : []
        setRisks(risksArray)
        calculateStats(risksArray)
      } else {
        console.error("Failed to fetch risks:", data.error)
        setRisks([])
        toast({
          title: "Warning",
          description: data.error || "Failed to fetch technology risks",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching risks:", error)
      setRisks([])
      toast({
        title: "Error",
        description: "Failed to fetch technology risks. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (risksArray: TechnologyRisk[]) => {
    const total = risksArray.length
    const high = risksArray.filter((r: TechnologyRisk) => r.risk_score >= 15).length
    const medium = risksArray.filter((r: TechnologyRisk) => r.risk_score >= 8 && r.risk_score < 15).length
    const low = risksArray.filter((r: TechnologyRisk) => r.risk_score < 8).length
    const open = risksArray.filter((r: TechnologyRisk) => r.status === "open").length
    const inProgress = risksArray.filter((r: TechnologyRisk) => r.status === "in-progress").length
    const mitigated = risksArray.filter((r: TechnologyRisk) => r.status === "mitigated").length

    // Calculate overdue risks
    const currentDate = new Date()
    const overdue = risksArray.filter((r: TechnologyRisk) => {
      if (!r.due_date) return false
      const dueDate = new Date(r.due_date)
      return dueDate < currentDate && r.status !== "mitigated" && r.status !== "closed"
    }).length

    // Calculate by category
    const categoryMap = new Map()
    risksArray.forEach((risk) => {
      const category = risk.technology_category
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    })

    const categoryColors = [
      "#3b82f6",
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#8b5cf6",
      "#f97316",
      "#06b6d4",
      "#84cc16",
      "#ec4899",
      "#6366f1",
    ]

    const byCategory = Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: categoryColors[index % categoryColors.length],
    }))

    // Calculate by treatment
    const treatmentMap = new Map()
    risksArray.forEach((risk) => {
      const treatment = risk.risk_treatment
      treatmentMap.set(treatment, (treatmentMap.get(treatment) || 0) + 1)
    })

    const byTreatment = Array.from(treatmentMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))

    // Generate trend data (mock data for demonstration)
    const trendData = [
      { month: "Jan", created: 12, resolved: 8 },
      { month: "Feb", created: 15, resolved: 10 },
      { month: "Mar", created: 18, resolved: 14 },
      { month: "Apr", created: 22, resolved: 16 },
      { month: "May", created: 20, resolved: 18 },
      { month: "Jun", created: 25, resolved: 20 },
    ]

    // Generate recent activity (mock data)
    const recentActivity = [
      { id: "1", action: "Created", risk: "Database Security Risk", date: "2024-01-15", user: "John Doe" },
      { id: "2", action: "Updated", risk: "Network Infrastructure Risk", date: "2024-01-14", user: "Jane Smith" },
      { id: "3", action: "Mitigated", risk: "Cloud Storage Risk", date: "2024-01-13", user: "Bob Johnson" },
      { id: "4", action: "Assigned", risk: "API Security Risk", date: "2024-01-12", user: "Alice Brown" },
      { id: "5", action: "Reviewed", risk: "Mobile App Risk", date: "2024-01-11", user: "Charlie Wilson" },
    ]

    setStats({
      total,
      high,
      medium,
      low,
      open,
      inProgress,
      mitigated,
      overdue,
      byCategory,
      byTreatment,
      trendData,
      recentActivity,
    })
  }

  const fetchAssets = async () => {
    try {
      setAssetsLoading(true)
      console.log("Fetching assets...")
      const response = await fetch("/api/assets")
      const data = await response.json()

      console.log("Assets response:", data)

      if (data.success) {
        if (Array.isArray(data.assets)) {
          setAssets(data.assets)
        } else if (Array.isArray(data)) {
          setAssets(data)
        } else {
          console.warn("Assets data is not in expected format:", data)
          setAssets([])
        }
      } else {
        console.error("Failed to fetch assets:", data.error)
        setAssets([])
      }
    } catch (error) {
      console.error("Error fetching assets:", error)
      setAssets([])
    } finally {
      setAssetsLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      console.log("Submitting form data:", formData)

      const url = editingRisk ? `/api/technology-risks/${editingRisk.id}` : "/api/technology-risks"
      const method = editingRisk ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()
      console.log("API response:", responseData)

      if (response.ok && responseData.success) {
        toast({
          title: "Success",
          description: `Technology risk ${editingRisk ? "updated" : "created"} successfully`,
        })
        setShowForm(false)
        setEditingRisk(null)
        fetchRisks()
      } else {
        const errorMessage = responseData.error || responseData.details || "Unknown error occurred"
        console.error("API error:", errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Error saving risk:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        title: "Error",
        description: `Failed to ${editingRisk ? "update" : "create"} technology risk: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this technology risk?")) return

    try {
      const response = await fetch(`/api/technology-risks/${id}`, {
        method: "DELETE",
      })

      const responseData = await response.json()

      if (response.ok && responseData.success) {
        toast({
          title: "Success",
          description: "Technology risk deleted successfully",
        })
        fetchRisks()
      } else {
        throw new Error(responseData.error || "Failed to delete risk")
      }
    } catch (error) {
      console.error("Error deleting risk:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        title: "Error",
        description: `Failed to delete technology risk: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (risk: TechnologyRisk) => {
    setEditingRisk(risk)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingRisk(null)
    setShowForm(true)
  }

  const handleEditControlAssessment = (risk: any) => {
    setEditingControlAssessment(risk)
  }

  const handleViewControlAssessment = (risk: any) => {
    setViewingControlAssessment(risk)
  }

  const handleDeleteControlAssessment = async (riskId: string) => {
    if (!confirm("Are you sure you want to delete this control assessment?")) return

    try {
      const response = await fetch(`/api/technology-risks/${riskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ control_assessment: null }),
      })

      if (response.ok) {
        await fetchRisks()
        toast.success("Control assessment deleted successfully")
      }
    } catch (error) {
      toast.error("Failed to delete control assessment")
    }
  }

  const handleEditRemediation = (risk: any) => {
    setEditingRemediation(risk)
  }

  const handleViewRemediation = (risk: any) => {
    setViewingRemediation(risk)
  }

  const handleDeleteRemediation = async (riskId: string) => {
    if (!confirm("Are you sure you want to delete this remediation plan?")) return

    try {
      const response = await fetch(`/api/technology-risks/${riskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_treatment: "accept",
          treatment_state: null,
          action_owner: null,
          treatment_end_date: null,
        }),
      })

      if (response.ok) {
        await fetchRisks()
        toast.success("Remediation plan deleted successfully")
      }
    } catch (error) {
      toast.error("Failed to delete remediation plan")
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setRiskLevelFilter("all")
    setCategoryFilter("all")
    setTreatmentFilter("all")
    setOwnerFilter("all")
    setDateRangeFilter("all")
  }

  // Pagination logic for Technology Risks tab
  const filteredRisks = risks.filter((risk) => {
    const matchesSearch =
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.technology_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.risk_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || risk.status === statusFilter
    const matchesRiskLevel = riskLevelFilter === "all" || risk.risk_level === riskLevelFilter
    const matchesCategory = categoryFilter === "all" || risk.technology_category === categoryFilter
    const matchesTreatment = treatmentFilter === "all" || risk.risk_treatment === treatmentFilter
    const matchesOwner = ownerFilter === "all" || risk.owner === ownerFilter

    let matchesDateRange = true
    if (dateRangeFilter !== "all") {
      const currentDate = new Date()
      const riskDate = new Date(risk.created_at)
      const daysDiff = Math.floor((currentDate.getTime() - riskDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (dateRangeFilter) {
        case "7days":
          matchesDateRange = daysDiff <= 7
          break
        case "30days":
          matchesDateRange = daysDiff <= 30
          break
        case "90days":
          matchesDateRange = daysDiff <= 90
          break
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRiskLevel &&
      matchesCategory &&
      matchesTreatment &&
      matchesOwner &&
      matchesDateRange
    )
  })

  const risksTotalPages = Math.ceil(filteredRisks.length / risksPageSize)
  const risksStartIndex = (risksCurrentPage - 1) * risksPageSize
  const risksEndIndex = risksStartIndex + risksPageSize
  const currentRisks = filteredRisks.slice(risksStartIndex, risksEndIndex)

  const handleRisksPageChange = (page: number) => {
    setRisksCurrentPage(page)
  }

  const handleRisksPageSizeChange = (newPageSize: string) => {
    setRisksPageSize(Number(newPageSize))
    setRisksCurrentPage(1)
  }

  // Pagination logic for Control Assessments tab
  const filteredControlAssessments = risks.filter((risk) => risk.control_assessment && risk.control_assessment.trim() !== "")
  const controlsTotalPages = Math.ceil(filteredControlAssessments.length / controlsPageSize)
  const controlsStartIndex = (controlsCurrentPage - 1) * controlsPageSize
  const controlsEndIndex = controlsStartIndex + controlsPageSize
  const currentControlAssessments = filteredControlAssessments.slice(controlsStartIndex, controlsEndIndex)

  const handleControlsPageChange = (page: number) => {
    setControlsCurrentPage(page)
  }

  const handleControlsPageSizeChange = (newPageSize: string) => {
    setControlsPageSize(Number(newPageSize))
    setControlsCurrentPage(1)
  }

  // Pagination logic for Risk Remediation tab
  const filteredRemediations = risks.filter((risk) => risk.risk_treatment && risk.risk_treatment !== "accept")
  const remediationTotalPages = Math.ceil(filteredRemediations.length / remediationPageSize)
  const remediationStartIndex = (remediationCurrentPage - 1) * remediationPageSize
  const remediationEndIndex = remediationStartIndex + remediationPageSize
  const currentRemediations = filteredRemediations.slice(remediationStartIndex, remediationEndIndex)

  const handleRemediationPageChange = (page: number) => {
    setRemediationCurrentPage(page)
  }

  const handleRemediationPageSizeChange = (newPageSize: string) => {
    setRemediationPageSize(Number(newPageSize))
    setRemediationCurrentPage(1)
  }

  // Generate pagination items helper function
  const generatePaginationItems = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
    const items = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(i)}
            // className={`h-8 w-8 p-0 font-medium transition-all duration-200 ${currentPage === i
            //   ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
            //   : "hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            //   }`}
          >
            {i}
          </Button>
        )
      }
    } else {
      items.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "ghost"}
          size="sm"
          onClick={() => onPageChange(1)}
          // className={`h-8 w-8 p-0 font-medium transition-all duration-200 ${currentPage === 1
          //   ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
          //   : "hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          //   }`}
        >
          1
        </Button>
      )

      if (currentPage > halfVisible + 2) {
        items.push(
          <span key="ellipsis-start" className="px-2 text-gray-500 dark:text-gray-400">
            ...
          </span>
        )
      }

      const startPage = Math.max(2, currentPage - halfVisible)
      const endPage = Math.min(totalPages - 1, currentPage + halfVisible)

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(i)}
            className={`h-8 w-8 p-0 font-medium transition-all duration-200 ${currentPage === i
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
          >
            {i}
          </Button>
        )
      }

      if (currentPage < totalPages - halfVisible - 1) {
        items.push(
          <span key="ellipsis-end" className="px-2 text-gray-500 dark:text-gray-400">
            ...
          </span>
        )
      }

      if (totalPages > 1) {
        items.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className={`h-8 w-8 p-0 font-medium transition-all duration-200 ${currentPage === totalPages
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
          >
            {totalPages}
          </Button>
        )
      }
    }

    return items
  }

  // Reset pagination when filters change
  useEffect(() => {
    setRisksCurrentPage(1)
  }, [searchTerm, statusFilter, riskLevelFilter, categoryFilter, treatmentFilter, ownerFilter, dateRangeFilter])

  const exportData = () => {
    const csvContent = [
      ["Risk ID", "Title", "Category", "Risk Level", "Status", "Owner", "Due Date"].join(","),
      ...filteredRisks.map((risk) =>
        [
          risk.risk_id,
          `"${risk.title}"`,
          risk.technology_category,
          risk.risk_level,
          risk.status,
          risk.owner,
          risk.due_date || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "technology-risks.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }



  // Get unique values for filter dropdowns
  const uniqueCategories = [...new Set(risks.map((r) => r.technology_category))]
  const uniqueOwners = [...new Set(risks.map((r) => r.owner))]

  // const getRiskLevelColor = (level: string) => {
  //   switch (level) {
  //     case "High":
  //       return "destructive"
  //     case "Medium":
  //       return "default"
  //     case "Low":
  //       return "secondary"
  //     default:
  //       return "secondary"
  //   }
  // }

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

  const getStatusColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "approved":
        return "text-green-500"
      case "pending":
        return "text-yellow-900"
      case "rejected":
        return "text-red-500"
      case "completed":
        return "text-green-900"
      case "in_progress":
      case "in-progress":
        return "text-purple-900"
      default:
        return "text-blue-500"
    }
  }

  const getTreatmentColor = (treatment: string) => {
    switch (treatment) {
      case "mitigate":
        return "text-purple-900"
      case "transfer":
        return "text-blue-500"
      case "avoid":
        return "text-red-500"
      case "accept":
        return "text-green-900"
      default:
        return "text-green-900"
    }
  }

  const getTreatmentStateColor = (state: string) => {
    switch (state) {
      case "planned":
        return "text-blue-500"
      case "in-progress":
        return "text-purple-900"
      case "completed":
        return "text-green-900"
      case "overdue":
        return "text-red-500"
      case "cancelled":
        return "text-orange-500"
      default:
        return "text-green-900"
    }
  }

  if (loading) {
    return (
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading technology risks...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold  animate-pulse flex items-center">
                <Cpu className="mr-3 h-8 w-8 text-blue-600" />
                Technology Risk Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Identify, assess, and manage technology-related risks across your organization
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowDashboard(!showDashboard)} >
                {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
              </Button>
              <Button onClick={exportData} >
                Export
              </Button>
              <TechnologyRiskChatbot onRiskCreated={fetchRisks} />
              <ActionButtons isTableAction={false} onAdd={handleAdd} btnAddText="Add Technology Risk"/>
              {/* <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Technology Risk
              </Button> */}
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        {showDashboard && (
          <div className="mb-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">Total Risks</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Technology risks</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.high}</div>
                  <p className="text-xs text-muted-foreground">Critical attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">Medium Risk</CardTitle>
                  <Target className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
                  <p className="text-xs text-muted-foreground">Monitor closely</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">Low Risk</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.low}</div>
                  <p className="text-xs text-muted-foreground">Acceptable level</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">Open</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats.open}</div>
                  <p className="text-xs text-muted-foreground">Need action</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">In Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                  <p className="text-xs text-muted-foreground">Being managed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">Mitigated</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.mitigated}</div>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold text-blue-600">Overdue</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.overdue}</div>
                  <p className="text-xs text-muted-foreground">Past due date</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk by Category Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risks by Technology Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.byCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Treatment Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Treatment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.byTreatment}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="created" stroke="#ef4444" name="Created" />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium">
                            {activity.action} - {activity.risk}
                          </p>
                          <p className="text-sm text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="risks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="risks">Technology Risks</TabsTrigger>
            <TabsTrigger value="controls">Control Assessments</TabsTrigger>
            <TabsTrigger value="remediation">Risk Remediation</TabsTrigger>
          </TabsList>

          <TabsContent value="risks" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter and search technology risks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search risks by title, description, category, owner, or risk ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  {/* Filter Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="mitigated">Mitigated</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Risk Level</label>
                      <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Risk Levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Risk Levels</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {uniqueCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Treatment</label>
                      <Select value={treatmentFilter} onValueChange={setTreatmentFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Treatments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Treatments</SelectItem>
                          <SelectItem value="mitigate">Mitigate</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                          <SelectItem value="avoid">Avoid</SelectItem>
                          <SelectItem value="accept">Accept</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Filter Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Owner</label>
                      <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Owners" />
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

                    <div>
                      <label className="text-sm font-medium mb-1 block">Date Range</label>
                      <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                        Clear All Filters
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(searchTerm ||
                    statusFilter !== "all" ||
                    riskLevelFilter !== "all" ||
                    categoryFilter !== "all" ||
                    treatmentFilter !== "all" ||
                    ownerFilter !== "all" ||
                    dateRangeFilter !== "all") && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <span className="text-sm font-medium">Active Filters:</span>
                        {searchTerm && <Badge variant="secondary">Search: {searchTerm}</Badge>}
                        {statusFilter !== "all" && <Badge variant="secondary">Status: {statusFilter}</Badge>}
                        {riskLevelFilter !== "all" && (
                          <Badge variant="secondary">Risk Level: {riskLevelFilter}</Badge>
                        )}
                        {categoryFilter !== "all" && <Badge variant="secondary">Category: {categoryFilter}</Badge>}
                        {treatmentFilter !== "all" && <Badge variant="secondary">Treatment: {treatmentFilter}</Badge>}
                        {ownerFilter !== "all" && <Badge variant="secondary">Owner: {ownerFilter}</Badge>}
                        {dateRangeFilter !== "all" && <Badge variant="secondary">Date: {dateRangeFilter}</Badge>}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Results Summary and Pagination Controls */}
            <div className="mb-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRisks.length} of {risks.length} technology risks
                </p>
                {filteredRisks.length !== risks.length && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Show All ({risks.length})
                  </Button>
                )}
              </div>


            </div>

            {/* Risks Table */}
            <Card>
              {/* Pagination Controls - Top */}
              {!loading && filteredRisks.length > 0 && (
                <div className="bg-transparent border border-purple-400 rounded-lg shadow-sm">
                  {/* Header Section */}
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technology Risks</h3>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total: <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredRisks.length}</span> risks
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Page: <span className="font-semibold text-purple-600 dark:text-purple-400">{risksCurrentPage}</span> of{' '}
                          <span className="font-semibold text-purple-600 dark:text-purple-400">{risksTotalPages}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls Section */}
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      {/* Left - Page Size Controls */}
                      <div className="flex items-center space-x-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</label>
                        <Select value={risksPageSize.toString()} onValueChange={handleRisksPageSizeChange}>
                          <SelectTrigger className="w-20 h-9 text-sm border-gray-300 dark:border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-500 dark:text-gray-400">per page</span>
                      </div>


                    </div>
                  </div>

                </div>
              )}
              <CardHeader>
                <CardTitle>Technology Risks</CardTitle>
                <CardDescription>View and manage all technology risks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="truncate">Risk ID</TableHead>
                      <TableHead className="truncate">Title</TableHead>
                      <TableHead className="truncate">Category</TableHead>
                      <TableHead className="truncate">Asset</TableHead>
                      <TableHead className="truncate">Inherent Risk</TableHead>
                      <TableHead className="truncate">Residual Risk</TableHead>
                      <TableHead className="truncate">Treatment</TableHead>
                      <TableHead className="truncate">Status</TableHead>
                      <TableHead className="truncate">Owner</TableHead>
                      <TableHead className="truncate text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRisks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          {loading
                            ? "Loading..."
                            : searchTerm ||
                              statusFilter !== "all" ||
                              riskLevelFilter !== "all" ||
                              categoryFilter !== "all" ||
                              treatmentFilter !== "all" ||
                              ownerFilter !== "all" ||
                              dateRangeFilter !== "all"
                              ? "No risks match the current filters"
                              : "No technology risks found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentRisks.map((risk) => (
                        <TableRow key={risk.id}>
                          <TableCell className="font-medium text-xs truncate">{risk.risk_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{risk.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {risk.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{risk.technology_category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{risk.asset_name || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-xs text-muted-foreground">{risk.risk_score}</span>
                              <Badge variant="outline" className={getRiskLevelColor(risk.risk_level)}>
                                {risk.risk_level}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-xs text-muted-foreground">{risk.residual_risk}</span>
                              <Badge
                                variant="outline"
                                className={getRiskLevelColor(
                                  risk.residual_risk >= 15 ? "High" : risk.residual_risk >= 8 ? "Medium" : "Low",
                                )}
                              >
                                {risk.residual_risk >= 15 ? "High" : risk.residual_risk >= 8 ? "Medium" : "Low"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 truncate">
                              <Badge variant="outline" className={getTreatmentColor(risk.risk_treatment)}>
                                {risk.risk_treatment}
                              </Badge>
                              <div>
                                <Badge
                                  variant="outline"
                                  className={`${getTreatmentStateColor(risk.treatment_state)} text-xs`}
                                >
                                  {risk.treatment_state}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="truncate">
                            <Badge variant="outline" className={getStatusColor(risk.status)}>
                              {risk.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{risk.owner}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewingRisk(risk)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(risk)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(risk.id.toString())}
                                className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination Controls - Bottom */}
                {!loading && risksTotalPages > 1 && (
                  <div className="mt-6 bg-transparent border border-purple-400 rounded-lg shadow-sm">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        {/* Left - Entry Information */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {filteredRisks.length > 0 ? (
                            <>
                              Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{risksStartIndex + 1}</span> to{' '}
                              <span className="font-semibold text-blue-600 dark:text-blue-400">{Math.min(risksEndIndex, filteredRisks.length)}</span> of{' '}
                              <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredRisks.length}</span> risks
                            </>
                          ) : (
                            "No risks found"
                          )}
                        </div>

                        {/* Right - Navigation Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRisksPageChange(risksCurrentPage - 1)}
                            disabled={risksCurrentPage === 1}
                          >
                            <PaginationPrevious className="h-4 w-4 mr-2" />

                          </Button>

                          <div>
                            {generatePaginationItems(risksCurrentPage, risksTotalPages, handleRisksPageChange)}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRisksPageChange(risksCurrentPage + 1)}
                            disabled={risksCurrentPage === risksTotalPages}
                          >

                            <PaginationNext className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-6">
            {/* Pagination Controls - Top for Control Assessments */}
            {!loading && filteredControlAssessments.length > 0 && (
              <div className="bg-transparent border border-purple-400 rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Control Assessments</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total: <span className="font-semibold text-green-600 dark:text-green-400">{filteredControlAssessments.length}</span> assessments
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Page: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{controlsCurrentPage}</span> of{' '}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{controlsTotalPages}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Section */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    {/* Left - Page Size Controls */}
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</label>
                      <Select value={controlsPageSize.toString()} onValueChange={handleControlsPageSizeChange}>
                        <SelectTrigger className="w-20 h-9 text-sm border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-500 dark:text-gray-400">per page</span>
                    </div>

                    {/* Right - Navigation Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleControlsPageChange(controlsCurrentPage - 1)}
                        disabled={controlsCurrentPage === 1}

                      >
                        <PaginationPrevious className="h-4 w-4 mr-2" />

                      </Button>

                      <div>
                        {generatePaginationItems(controlsCurrentPage, controlsTotalPages, handleControlsPageChange)}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleControlsPageChange(controlsCurrentPage + 1)}
                        disabled={controlsCurrentPage === controlsTotalPages}

                      >

                        <PaginationNext className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Control Assessments</CardTitle>
                <CardDescription>View and manage control assessments across all technology risks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Risk ID</TableHead>
                        <TableHead>Risk Title</TableHead>
                        <TableHead>Technology Category</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Assessment Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentControlAssessments.map((risk) => {
                        // Parse assessment to get status info
                        let assessmentStatus = "Basic Assessment"
                        let controlCount = 0
                        try {
                          const parsed = JSON.parse(risk.control_assessment)
                          if (Array.isArray(parsed)) {
                            controlCount = parsed.length
                            assessmentStatus = `${controlCount} Controls Defined`
                          }
                        } catch (error) {
                          // Plain text assessment
                          assessmentStatus = "Text Assessment"
                        }

                        return (
                          <TableRow key={risk.id}>
                            <TableCell className="font-medium">{risk.risk_id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{risk.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{risk.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{risk.technology_category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRiskLevelColor(risk.risk_level)}>{risk.risk_level}</Badge>
                            </TableCell>
                            <TableCell>{risk.owner}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">{assessmentStatus}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewControlAssessment(risk)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditControlAssessment(risk)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteControlAssessment(risk.risk_id)}
                                  className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {currentControlAssessments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No control assessments found.</p>
                      <p className="text-sm">
                        Control assessments will appear here once risks have detailed control evaluations.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination Controls - Bottom for Control Assessments */}
                {!loading && controlsTotalPages > 1 && (
                  <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        {/* Left - Entry Information */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {filteredControlAssessments.length > 0 ? (
                            <>
                              Showing <span className="font-semibold text-green-600 dark:text-green-400">{controlsStartIndex + 1}</span> to{' '}
                              <span className="font-semibold text-green-600 dark:text-green-400">{Math.min(controlsEndIndex, filteredControlAssessments.length)}</span> of{' '}
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{filteredControlAssessments.length}</span> assessments
                            </>
                          ) : (
                            "No assessments found"
                          )}
                        </div>

                        {/* Right - Navigation Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleControlsPageChange(controlsCurrentPage - 1)}
                            disabled={controlsCurrentPage === 1}
                          >
                            <PaginationPrevious className="h-4 w-4 mr-2" />

                          </Button>

                          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                            {generatePaginationItems(controlsCurrentPage, controlsTotalPages, handleControlsPageChange)}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleControlsPageChange(controlsCurrentPage + 1)}
                            disabled={controlsCurrentPage === controlsTotalPages}
                            className="h-9 px-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            Next
                            <PaginationNext className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remediation" className="space-y-6">
            {/* Pagination Controls - Top for Risk Remediation */}
            {!loading && filteredRemediations.length > 0 && (
              <div className="bg-transparent border border-purple-400 rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Remediation</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total: <span className="font-semibold text-orange-600 dark:text-orange-400">{filteredRemediations.length}</span> remediations
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Page: <span className="font-semibold text-red-600 dark:text-red-400">{remediationCurrentPage}</span> of{' '}
                        <span className="font-semibold text-red-600 dark:text-red-400">{remediationTotalPages}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Section */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    {/* Left - Page Size Controls */}
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</label>
                      <Select value={remediationPageSize.toString()} onValueChange={handleRemediationPageSizeChange}>
                        <SelectTrigger className="w-20 h-9 text-sm border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-500 dark:text-gray-400">per page</span>
                    </div>

                    {/* Right - Navigation Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemediationPageChange(remediationCurrentPage - 1)}
                        disabled={remediationCurrentPage === 1}
                      >
                        <PaginationPrevious className="h-4 w-4 mr-2" />

                      </Button>

                      <div>
                        {generatePaginationItems(remediationCurrentPage, remediationTotalPages, handleRemediationPageChange)}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemediationPageChange(remediationCurrentPage + 1)}
                        disabled={remediationCurrentPage === remediationTotalPages}
                      >

                        <PaginationNext className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Risk Remediation Tracking</CardTitle>
                <CardDescription>Track progress of risk treatment and remediation activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRemediations.map((risk) => (
                    <Card key={risk.id} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {risk.risk_id} - {risk.title}
                            </CardTitle>
                            <CardDescription>
                              {risk.technology_category} • Owner: {risk.owner} • Action Owner:{" "}
                              {risk.action_owner || "N/A"}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getTreatmentColor(risk.risk_treatment)}>{risk.risk_treatment}</Badge>
                            <Badge variant={getTreatmentStateColor(risk.treatment_state)}>
                              {risk.treatment_state}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => handleViewRemediation(risk)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditRemediation(risk)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRemediation(risk.risk_id)}
                              className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm">Current Risk Level</h4>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">{risk.residual_risk || risk.risk_score}</span>
                              <Badge
                                variant={getRiskLevelColor(
                                  (risk.residual_risk || risk.risk_score) >= 15
                                    ? "High"
                                    : (risk.residual_risk || risk.risk_score) >= 8
                                      ? "Medium"
                                      : "Low",
                                )}
                              >
                                {(risk.residual_risk || risk.risk_score) >= 15
                                  ? "High"
                                  : (risk.residual_risk || risk.risk_score) >= 8
                                    ? "Medium"
                                    : "Low"}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Treatment End Date</h4>
                            <p className="text-sm">
                              {risk.treatment_end_date
                                ? new Date(risk.treatment_end_date).toLocaleDateString()
                                : "Not set"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <h4 className="font-semibold text-sm mb-2">Current Controls</h4>
                            <p className="text-sm text-muted-foreground">
                              {risk.current_controls || "No current controls documented"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <h4 className="font-semibold text-sm mb-2">Recommended Controls</h4>
                            <p className="text-sm text-muted-foreground">
                              {risk.recommended_controls || "No recommended controls documented"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {currentRemediations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No active remediation activities found.</p>
                      <p className="text-sm">
                        Risks with treatment strategies other than "Accept" will appear here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination Controls - Bottom for Risk Remediation */}
                {!loading && remediationTotalPages > 1 && (
                  <div className="mt-6 bg-transparent border border-purple-400 rounded-lg shadow-sm">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        {/* Left - Entry Information */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {filteredRemediations.length > 0 ? (
                            <>
                              Showing <span className="font-semibold text-orange-600 dark:text-orange-400">{remediationStartIndex + 1}</span> to{' '}
                              <span className="font-semibold text-orange-600 dark:text-orange-400">{Math.min(remediationEndIndex, filteredRemediations.length)}</span> of{' '}
                              <span className="font-semibold text-red-600 dark:text-red-400">{filteredRemediations.length}</span> remediations
                            </>
                          ) : (
                            "No remediations found"
                          )}
                        </div>

                        {/* Right - Navigation Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"

                            onClick={() => handleRemediationPageChange(remediationCurrentPage - 1)}
                            disabled={remediationCurrentPage === 1}
                          >
                            <PaginationPrevious className="h-4 w-4 mr-2" />

                          </Button>

                          <div>
                            {generatePaginationItems(remediationCurrentPage, remediationTotalPages, handleRemediationPageChange)}
                          </div>

                          <Button
                            variant="outline"

                            onClick={() => handleRemediationPageChange(remediationCurrentPage + 1)}
                            disabled={remediationCurrentPage === remediationTotalPages}

                          >

                            <PaginationNext className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Risk Form Dialog */}
        <TechnologyRiskForm
          open={showForm}
          setOpen={setShowForm}
          onSubmit={handleSubmit}
          assets={assets}
          editingRisk={editingRisk}
        />

        {/* Risk View Dialog */}
        <Dialog open={!!viewingRisk} onOpenChange={() => setViewingRisk(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Technology Risk Details</DialogTitle>
              <DialogDescription>Detailed view of the technology risk assessment</DialogDescription>
            </DialogHeader>
            {viewingRisk && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Risk ID</h3>
                    <p>{viewingRisk.risk_id}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <Badge variant="outline" className={getStatusColor(viewingRisk.status)}>
                      {viewingRisk.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <h3 className="font-semibold">Title</h3>
                    <p>{viewingRisk.title}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="font-semibold">Description</h3>
                    <p>{viewingRisk.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Technology Category</h3>
                    <p>{viewingRisk.technology_category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Technology Type</h3>
                    <p>{viewingRisk.technology_type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Related Asset</h3>
                    <p>{viewingRisk.asset_name || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Risk Owner</h3>
                    <p>{viewingRisk.owner}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Inherent Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Likelihood:</span>
                          <span>{viewingRisk.likelihood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact:</span>
                          <span>{viewingRisk.impact}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Risk Score:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{viewingRisk.risk_score}</span>
                            <Badge variant="outline" className={getRiskLevelColor(viewingRisk.risk_level)}>
                              {viewingRisk.risk_level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Residual Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Likelihood:</span>
                          <span>{viewingRisk.residual_likelihood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact:</span>
                          <span>{viewingRisk.residual_impact}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Risk Score:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{viewingRisk.residual_risk}</span>
                            <Badge
                              variant="outline"
                              className={getRiskLevelColor(
                                viewingRisk.residual_risk >= 15
                                  ? "High"
                                  : viewingRisk.residual_risk >= 8
                                    ? "Medium"
                                    : "Low",
                              )}
                            >
                              {viewingRisk.residual_risk >= 15
                                ? "High"
                                : viewingRisk.residual_risk >= 8
                                  ? "Medium"
                                  : "Low"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Treatment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold">Treatment Strategy</h4>
                        <Badge variant="outline" className={getTreatmentColor(viewingRisk.risk_treatment)}>
                          {viewingRisk.risk_treatment}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold">Treatment State</h4>
                        <Badge variant="outline" className={getTreatmentStateColor(viewingRisk.treatment_state)}>
                          {viewingRisk.treatment_state}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold">Action Owner</h4>
                        <p>{viewingRisk.action_owner || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Treatment End Date</h4>
                        <p>
                          {viewingRisk.treatment_end_date
                            ? new Date(viewingRisk.treatment_end_date).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {viewingRisk.current_controls && (
                      <div>
                        <h4 className="font-semibold">Current Controls</h4>
                        <p className="text-sm text-muted-foreground">{viewingRisk.current_controls}</p>
                      </div>
                    )}

                    {viewingRisk.control_assessment && (
                      <div>
                        <h4 className="font-semibold mb-3">Control Assessment</h4>
                        <ControlAssessmentModule
                          riskId={viewingRisk.risk_id}
                          currentAssessment={viewingRisk.control_assessment}
                          onAssessmentUpdate={() => { }} // Read-only mode
                          readOnly={true}
                        />
                      </div>
                    )}

                    {viewingRisk.recommended_controls && (
                      <div>
                        <h4 className="font-semibold">Recommended Controls</h4>
                        <p className="text-sm text-muted-foreground">{viewingRisk.recommended_controls}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewingControlAssessment} onOpenChange={() => setViewingControlAssessment(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Control Assessment Details</DialogTitle>
              <DialogDescription>
                {viewingControlAssessment?.risk_id} - {viewingControlAssessment?.title}
              </DialogDescription>
            </DialogHeader>
            {viewingControlAssessment && (
              <div className="space-y-4">
                <ControlAssessmentModule
                  riskId={viewingControlAssessment.risk_id}
                  currentAssessment={viewingControlAssessment.control_assessment}
                  onAssessmentUpdate={() => { }}
                  readOnly={true}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingControlAssessment} onOpenChange={() => setEditingControlAssessment(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Control Assessment</DialogTitle>
              <DialogDescription>
                {editingControlAssessment?.risk_id} - {editingControlAssessment?.title}
              </DialogDescription>
            </DialogHeader>
            {editingControlAssessment && (
              <div className="space-y-4">
                <ControlAssessmentModule
                  riskId={editingControlAssessment.risk_id}
                  currentAssessment={editingControlAssessment.control_assessment}
                  onAssessmentUpdate={async (updatedAssessment) => {
                    try {
                      const response = await fetch(`/api/technology-risks/${editingControlAssessment.risk_id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ control_assessment: updatedAssessment }),
                      })

                      if (response.ok) {
                        await fetchRisks()
                        setEditingControlAssessment(null)
                        toast.success("Control assessment updated successfully")
                      }
                    } catch (error) {
                      toast.error("Failed to update control assessment")
                    }
                  }}
                  readOnly={false}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewingRemediation} onOpenChange={() => setViewingRemediation(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Remediation Plan Details</DialogTitle>
              <DialogDescription>
                {viewingRemediation?.risk_id} - {viewingRemediation?.title}
              </DialogDescription>
            </DialogHeader>
            {viewingRemediation && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Treatment Strategy</h4>
                    <Badge variant={getTreatmentColor(viewingRemediation.risk_treatment)}>
                      {viewingRemediation.risk_treatment}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Treatment State</h4>
                    <Badge variant={getTreatmentStateColor(viewingRemediation.treatment_state)}>
                      {viewingRemediation.treatment_state}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Action Owner</h4>
                    <p className="text-sm">{viewingRemediation.action_owner || "Not assigned"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Target End Date</h4>
                    <p className="text-sm">
                      {viewingRemediation.treatment_end_date
                        ? new Date(viewingRemediation.treatment_end_date).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Current Controls</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewingRemediation.current_controls || "No current controls documented"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Recommended Controls</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewingRemediation.recommended_controls || "No recommended controls documented"}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingRemediation} onOpenChange={() => setEditingRemediation(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Remediation Plan</DialogTitle>
              <DialogDescription>
                {editingRemediation?.risk_id} - {editingRemediation?.title}
              </DialogDescription>
            </DialogHeader>
            {editingRemediation && (
              <RemediationEditForm
                risk={editingRemediation}
                onSave={async (updatedData) => {
                  try {
                    const response = await fetch(`/api/technology-risks/${editingRemediation.risk_id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(updatedData),
                    })

                    if (response.ok) {
                      await fetchRisks()
                      setEditingRemediation(null)
                      toast.success("Remediation plan updated successfully")
                    }
                  } catch (error) {
                    toast.error("Failed to update remediation plan")
                  }
                }}
                onCancel={() => setEditingRemediation(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
