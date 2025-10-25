"use client"

import type React from "react"

import {
  AlertTriangle,
  Bug,
  Calendar,
  Clock,
  Edit,
  Plus,
  Search,
  Trash2,
  User,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Activity,
  Timer,
  Target,
  BarChart3,
  Download,
  Upload,
  MoreHorizontal,
  RefreshCw,
  Zap,
  Shield,
  Info,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import ConversationChatbot from "@/components/conversation-chatbot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Filter, X } from "lucide-react"
import {
  getVulnerabilities,
  deleteVulnerability,
  createVulnerability,
  updateVulnerability,
  updateEPSSScores,
  updateSingleEPSSScore,
} from "@/lib/actions/vulnerability-actions"
import { VulnerabilityForm } from "@/components/vulnerability-form"

import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { convertToCSV, downloadFile, parseCSV } from "@/lib/utils/export-utils"
import { getEPSSRiskLevel, formatEPSSScore, formatEPSSPercentile, isEPSSDataStale } from "@/lib/epss"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import OwnerSelectInput from "@/components/owner-search-input"
import StarBorder from "../StarBorder"

interface SortConfig {
  key: string
  direction: "asc" | "desc"
}

interface AgingMetrics {
  totalVulnerabilities: number
  avgAgingDays: number
  overdueCount: number
  criticalAging: number
  agingTrends: Array<{
    date: string
    newVulns: number
    resolved: number
    avgAging: number
  }>
  agingDistribution: Array<{
    range: string
    count: number
    percentage: number
  }>
  severityAging: Array<{
    severity: string
    avgDays: number
    count: number
    overdue: number
  }>
  timelineData: Array<{
    date: string
    created: number
    resolved: number
    inProgress: number
    overdue: number
  }>
}

const COLORS = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
}

interface FilterState {
  search: string
  status: string[]
  severity: string[]
  category: string[]
  assignedTo: string[]
  aging: string[]
  dueDate: string[]
  timeline: string[]
}

export default function VulnerabilitiesPage() {
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    severity: [],
    category: [],
    assignedTo: [],
    aging: [],
    dueDate: [],
    timeline: [],
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVulnerability, setEditingVulnerability] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "created_at", direction: "desc" })

  // Aging metrics state
  const [agingMetrics, setAgingMetrics] = useState<AgingMetrics | null>(null)

  const { toast } = useToast()

  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [importing, setImporting] = useState(false)

  // Bulk operations state
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<Set<string>>(new Set())
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false)
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false)

  // Bulk edit form state
  const [bulkEditData, setBulkEditData] = useState({
    severity: "",
    category: "",
    assigned_to: "",
    priority: "",
    remediation_status: "",
    remediation_notes: "",
  })

  // EPSS state
  const [epssUpdating, setEpssUpdating] = useState(false)

  const filterOptions = {
    status: ["Open", "In Progress", "Resolved", "Accepted Risk", "False Positive"],
    severity: ["Critical", "High", "Medium", "Low", "Informational"],
    aging: ["0-7 days", "8-30 days", "31-60 days", "61-90 days", "90+ days"],
    dueDate: ["Overdue", "Due Today", "Due This Week", "Due This Month", "No Due Date"],
    timeline: ["Completed", "Overdue", "Due Soon", "On Track", "No Due Date"],
  }

  const fetchVulnerabilities = async () => {
    setLoading(true)
    try {
      const result = await getVulnerabilities({
        searchTerm: filters.search,
        statusFilter: filters.status.join(","),
        severityFilter: filters.severity.join(","),
        categoryFilter: filters.category.join(","),
        assignedToFilter: filters.assignedTo.join(","),
        agingFilter: filters.aging.join(","),
        dueDateFilter: filters.dueDate.join(","),
        timelineFilter: filters.timeline.join(","),
        sortBy: sortConfig.key,
        sortDirection: sortConfig.direction,
        page: currentPage,
        limit: itemsPerPage,
      })

      if (result.success) {
        setVulnerabilities(result.data)
        setTotalItems(result.total || 0)
        calculateAgingMetrics(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load vulnerabilities",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vulnerabilities",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateAgingMetrics = (vulns: any[]) => {
    const now = new Date()
    const agingData = vulns.map((v) => {
      const created = new Date(v.created_at)
      const completed = v.remediation_completed_date ? new Date(v.remediation_completed_date) : null
      const reference = completed || now
      const agingDays = Math.floor((reference.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      const dueDate = v.remediation_due_date ? new Date(v.remediation_due_date) : null
      const isOverdue = dueDate && !completed && now > dueDate

      return {
        ...v,
        agingDays,
        isOverdue: !!isOverdue,
        overdueDays: isOverdue ? Math.floor((now.getTime() - dueDate!.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      }
    })

    const totalVulns = agingData.length
    const avgAging = totalVulns > 0 ? agingData.reduce((sum, v) => sum + v.agingDays, 0) / totalVulns : 0
    const overdueCount = agingData.filter((v) => v.isOverdue).length
    const criticalAging = agingData.filter((v) => v.agingDays > 90).length

    // Generate aging distribution
    const agingRanges = [
      { range: "0-7 days", min: 0, max: 7 },
      { range: "8-30 days", min: 8, max: 30 },
      { range: "31-60 days", min: 31, max: 60 },
      { range: "61-90 days", min: 61, max: 90 },
      { range: "90+ days", min: 91, max: Number.POSITIVE_INFINITY },
    ]

    const agingDistribution = agingRanges.map((range) => {
      const count = agingData.filter((v) => v.agingDays >= range.min && v.agingDays <= range.max).length
      return {
        range: range.range,
        count,
        percentage: totalVulns > 0 ? (count / totalVulns) * 100 : 0,
      }
    })

    // Generate severity aging
    const severities = ["Critical", "High", "Medium", "Low", "Informational"]
    const severityAging = severities
      .map((severity) => {
        const severityVulns = agingData.filter((v) => v.severity === severity)
        const avgDays =
          severityVulns.length > 0 ? severityVulns.reduce((sum, v) => sum + v.agingDays, 0) / severityVulns.length : 0
        const overdue = severityVulns.filter((v) => v.isOverdue).length

        return {
          severity,
          avgDays,
          count: severityVulns.length,
          overdue,
        }
      })
      .filter((s) => s.count > 0)

    // Generate timeline data (last 30 days)
    const timelineData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const created = agingData.filter((v) => new Date(v.created_at).toISOString().split("T")[0] === dateStr).length

      const resolved = agingData.filter(
        (v) =>
          v.remediation_completed_date &&
          new Date(v.remediation_completed_date).toISOString().split("T")[0] === dateStr,
      ).length

      const inProgress = agingData.filter(
        (v) => v.remediation_status === "In Progress" && new Date(v.created_at) <= date,
      ).length

      const overdue = agingData.filter(
        (v) => v.remediation_due_date && new Date(v.remediation_due_date) < date && !v.remediation_completed_date,
      ).length

      timelineData.push({
        date: dateStr,
        created,
        resolved,
        inProgress,
        overdue,
      })
    }

    // Generate aging trends (last 12 weeks)
    const agingTrends = []
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - i * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekVulns = agingData.filter((v) => {
        const created = new Date(v.created_at)
        return created >= weekStart && created <= weekEnd
      })

      const resolvedInWeek = agingData.filter((v) => {
        if (!v.remediation_completed_date) return false
        const completed = new Date(v.remediation_completed_date)
        return completed >= weekStart && completed <= weekEnd
      })

      const avgAging = weekVulns.length > 0 ? weekVulns.reduce((sum, v) => sum + v.agingDays, 0) / weekVulns.length : 0

      agingTrends.push({
        date: weekStart.toISOString().split("T")[0],
        newVulns: weekVulns.length,
        resolved: resolvedInWeek.length,
        avgAging,
      })
    }

    setAgingMetrics({
      totalVulnerabilities: totalVulns,
      avgAgingDays: avgAging,
      overdueCount,
      criticalAging,
      agingTrends,
      agingDistribution,
      severityAging,
      timelineData,
    })
  }

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [filters, sortConfig])

  useEffect(() => {
    fetchVulnerabilities()
  }, [currentPage, filters, sortConfig])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vulnerability?")) {
      const result = await deleteVulnerability(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Vulnerability deleted successfully",
        })

        // Check if we need to go to previous page after deletion
        const newTotal = totalItems - 1
        const maxPage = Math.ceil(newTotal / itemsPerPage)
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage)
        } else {
          fetchVulnerabilities()
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete vulnerability",
          variant: "destructive",
        })
      }
    }
  }

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-gradient-to-r from-red-600 to-pink-600 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-600 to-red-600 text-white"
      case "Medium":
        return "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
      case "Low":
        return "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
      case "Informational":
        return "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-gradient-to-r from-red-600 to-pink-600 text-white"
      case "In Progress":
        return "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
      case "Resolved":
        return "bg-gradient-to-r from-green-600 to-blue-600 text-white"
      case "Accepted Risk":
        return "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
      case "False Positive":
        return "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      case "Accepted Risk":
        return <XCircle className="h-4 w-4" />
      case "False Positive":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const calculateAgingDays = (createdAt: string, completedDate?: string) => {
    const created = new Date(createdAt)
    const reference = completedDate ? new Date(completedDate) : new Date()
    return Math.floor((reference.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateOverdueDays = (dueDate?: string, completedDate?: string) => {
    if (completedDate || !dueDate) return 0
    const due = new Date(dueDate)
    const today = new Date()
    if (due >= today) return 0
    return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getTimelineStatus = (dueDate?: string, completedDate?: string) => {
    if (completedDate) return "Completed"
    if (!dueDate) return "No Due Date"

    const due = new Date(dueDate)
    const today = new Date()
    const daysUntilDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilDue < 0) return "Overdue"
    if (daysUntilDue <= 7) return "Due Soon"
    return "On Track"
  }

  const getTimelineColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600"
      case "Overdue":
        return "text-red-600"
      case "Due Soon":
        return "text-yellow-600"
      case "On Track":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getAgingProgressColor = (days: number) => {
    if (days <= 7) return "bg-green-500"
    if (days <= 30) return "bg-yellow-500"
    if (days <= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  const getAgingProgressValue = (days: number, tatDays?: number) => {
    if (!tatDays) return Math.min((days / 90) * 100, 100) // Default 90 days max
    return Math.min((days / tatDays) * 100, 100)
  }

  const vulnerabilityStats = {
    total: totalItems,
    open: vulnerabilities.filter((v) => v.remediation_status === "Open").length,
    inProgress: vulnerabilities.filter((v) => v.remediation_status === "In Progress").length,
    resolved: vulnerabilities.filter((v) => v.remediation_status === "Resolved").length,
    critical: vulnerabilities.filter((v) => v.severity === "Critical").length,
    high: vulnerabilities.filter((v) => v.severity === "High").length,
    overdue: vulnerabilities.filter((v) => {
      const overdue = calculateOverdueDays(v.remediation_due_date, v.remediation_completed_date)
      return overdue > 0
    }).length,
  }

  const categories = [...new Set(vulnerabilities.map((v) => v.category).filter(Boolean))]

  // Pagination calculations
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleExport = () => {
    if (vulnerabilities.length === 0) {
      toast({
        title: "No Data",
        description: "No vulnerabilities to export",
        variant: "destructive",
      })
      return
    }

    const exportData = vulnerabilities.map((vuln) => ({
      name: vuln.name,
      description: vuln.description || "",
      category: vuln.category || "",
      severity: vuln.severity,
      cvss_score: vuln.cvss_score || "",
      cve_id: vuln.cve_id || "",
      affected_systems: vuln.affected_systems || "",
      remediation_status: vuln.remediation_status,
      remediation_notes: vuln.remediation_notes || "",
      assigned_to: vuln.assigned_to || "",
      priority: vuln.priority || 3,
      tat_days: vuln.tat_days || "",
      remediation_due_date: vuln.remediation_due_date
        ? new Date(vuln.remediation_due_date).toISOString().split("T")[0]
        : "",
      tags: Array.isArray(vuln.tags) ? vuln.tags.join("; ") : "",
      external_references: Array.isArray(vuln.external_references) ? vuln.external_references.join("; ") : "",
      created_at: new Date(vuln.created_at).toISOString().split("T")[0],
    }))

    const csv = convertToCSV(exportData)
    const timestamp = new Date().toISOString().split("T")[0]
    downloadFile(csv, `vulnerabilities_export_${timestamp}.csv`, "text/csv")

    toast({
      title: "Export Successful",
      description: `Exported ${exportData.length} vulnerabilities`,
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      })
      return
    }

    setImportFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string
        const parsedData = parseCSV(csvText)

        if (parsedData.length === 0) {
          toast({
            title: "Empty File",
            description: "The CSV file appears to be empty",
            variant: "destructive",
          })
          return
        }

        // Validate required columns
        const requiredColumns = ["name", "severity"]
        const columns = Object.keys(parsedData[0])
        const missingColumns = requiredColumns.filter((col) => !columns.includes(col))

        if (missingColumns.length > 0) {
          toast({
            title: "Missing Columns",
            description: `Required columns missing: ${missingColumns.join(", ")}`,
            variant: "destructive",
          })
          return
        }

        setImportPreview(parsedData.slice(0, 5)) // Show first 5 rows for preview
      } catch (error) {
        toast({
          title: "Parse Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!importFile) return

    setImporting(true)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const csvText = e.target?.result as string
          const parsedData = parseCSV(csvText)

          let successCount = 0
          let errorCount = 0

          for (const row of parsedData) {
            try {
              const vulnerabilityData = {
                name: row.name,
                description: row.description || "",
                category: row.category || null,
                severity: row.severity,
                cvss_score: row.cvss_score ? Number.parseFloat(row.cvss_score) : null,
                cve_id: row.cve_id || null,
                affected_systems: row.affected_systems || null,
                remediation_status: row.remediation_status || "Open",
                remediation_notes: row.remediation_notes || "",
                assigned_to: row.assigned_to || null,
                priority: row.priority ? Number.parseInt(row.priority) : 3,
                tat_days: row.tat_days ? Number.parseInt(row.tat_days) : null,
                tags: row.tags
                  ? row.tags
                    .split(";")
                    .map((t: string) => t.trim())
                    .filter(Boolean)
                  : [],
                external_references: row.external_references
                  ? row.external_references
                    .split(";")
                    .map((r: string) => r.trim())
                    .filter(Boolean)
                  : [],
              }

              const result = await createVulnerability(vulnerabilityData)
              if (result.success) {
                successCount++
              } else {
                errorCount++
              }
            } catch (error) {
              errorCount++
            }
          }

          toast({
            title: "Import Complete",
            description: `Successfully imported ${successCount} vulnerabilities. ${errorCount} errors.`,
          })

          if (successCount > 0) {
            fetchVulnerabilities()
          }

          setImportDialogOpen(false)
          setImportFile(null)
          setImportPreview([])
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Failed to process import file",
            variant: "destructive",
          })
        } finally {
          setImporting(false)
        }
      }
      reader.readAsText(importFile)
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to read import file",
        variant: "destructive",
      })
      setImporting(false)
    }
  }

  // Bulk operations handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(vulnerabilities.map((v) => v.id))
      setSelectedVulnerabilities(allIds)
    } else {
      setSelectedVulnerabilities(new Set())
    }
  }

  const handleSelectVulnerability = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedVulnerabilities)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedVulnerabilities(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedVulnerabilities.size === 0) return

    setBulkOperationLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const id of selectedVulnerabilities) {
        try {
          const result = await deleteVulnerability(id)
          if (result.success) {
            successCount++
          } else {
            errorCount++
          }
        } catch (error) {
          errorCount++
        }
      }

      toast({
        title: "Bulk Delete Complete",
        description: `Successfully deleted ${successCount} vulnerabilities. ${errorCount} errors.`,
      })

      if (successCount > 0) {
        setSelectedVulnerabilities(new Set())
        fetchVulnerabilities()
      }
    } catch (error) {
      toast({
        title: "Bulk Delete Error",
        description: "Failed to delete vulnerabilities",
        variant: "destructive",
      })
    } finally {
      setBulkOperationLoading(false)
      setBulkDeleteDialogOpen(false)
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedVulnerabilities.size === 0) return

    setBulkOperationLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const id of selectedVulnerabilities) {
        try {
          const vulnerability = vulnerabilities.find((v) => v.id === id)
          if (vulnerability) {
            const updateData = {
              ...vulnerability,
              remediation_status: newStatus,
              remediation_completed_date: newStatus === "Resolved" ? new Date().toISOString() : null,
            }
            const result = await updateVulnerability(id, updateData)
            if (result.success) {
              successCount++
            } else {
              errorCount++
            }
          }
        } catch (error) {
          errorCount++
        }
      }

      toast({
        title: "Bulk Status Update Complete",
        description: `Successfully updated ${successCount} vulnerabilities to ${newStatus}. ${errorCount} errors.`,
      })

      if (successCount > 0) {
        setSelectedVulnerabilities(new Set())
        fetchVulnerabilities()
      }
    } catch (error) {
      toast({
        title: "Bulk Status Update Error",
        description: "Failed to update vulnerability statuses",
        variant: "destructive",
      })
    } finally {
      setBulkOperationLoading(false)
      setBulkStatusDialogOpen(false)
    }
  }

  const handleBulkEdit = async () => {
    if (selectedVulnerabilities.size === 0) return

    setBulkOperationLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const id of selectedVulnerabilities) {
        try {
          const vulnerability = vulnerabilities.find((v) => v.id === id)
          if (vulnerability) {
            const updateData = { ...vulnerability }

            // Only update fields that have values in bulkEditData
            if (bulkEditData.severity) updateData.severity = bulkEditData.severity
            if (bulkEditData.category) updateData.category = bulkEditData.category
            if (bulkEditData.assigned_to) updateData.assigned_to = bulkEditData.assigned_to
            if (bulkEditData.priority) updateData.priority = Number.parseInt(bulkEditData.priority)
            if (bulkEditData.remediation_status) {
              updateData.remediation_status = bulkEditData.remediation_status
              if (bulkEditData.remediation_status === "Resolved") {
                updateData.remediation_completed_date = new Date().toISOString()
              }
            }
            if (bulkEditData.remediation_notes) updateData.remediation_notes = bulkEditData.remediation_notes

            const result = await updateVulnerability(id, updateData)
            if (result.success) {
              successCount++
            } else {
              errorCount++
            }
          }
        } catch (error) {
          errorCount++
        }
      }

      toast({
        title: "Bulk Edit Complete",
        description: `Successfully updated ${successCount} vulnerabilities. ${errorCount} errors.`,
      })

      if (successCount > 0) {
        setSelectedVulnerabilities(new Set())
        setBulkEditData({
          severity: "",
          category: "",
          assigned_to: "",
          priority: "",
          remediation_status: "",
          remediation_notes: "",
        })
        fetchVulnerabilities()
      }
    } catch (error) {
      toast({
        title: "Bulk Edit Error",
        description: "Failed to update vulnerabilities",
        variant: "destructive",
      })
    } finally {
      setBulkOperationLoading(false)
      setBulkEditDialogOpen(false)
    }
  }

  // EPSS handlers
  const handleEPSSUpdate = async (forceRefresh: boolean = false) => {
    setEpssUpdating(true)
    try {
      const result = await updateEPSSScores(forceRefresh)
      if (result.success) {
        toast({
          title: "EPSS Update Complete",
          description: result.data.message,
        })
        fetchVulnerabilities() // Refresh the data
      } else {
        toast({
          title: "EPSS Update Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "EPSS Update Error",
        description: "Failed to update EPSS scores",
        variant: "destructive",
      })
    } finally {
      setEpssUpdating(false)
    }
  }

  // AI-Calculated EPSS handlers
  const [aiEpssUpdating, setAiEpssUpdating] = useState(false)

  const handleAIEPSSUpdate = async (vulnerabilityId?: number) => {
    setAiEpssUpdating(true)
    try {
      if (vulnerabilityId) {
        // Single vulnerability calculation
        const response = await fetch('/api/vulnerabilities/epss/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vulnerability_id: vulnerabilityId }),
        })
        const result = await response.json()
        
        if (result.success) {
          toast({
            title: "AI EPSS Score Calculated",
            description: `EPSS Score: ${(result.epss_score * 100).toFixed(2)}% | Risk Factors Analyzed`,
          })
          fetchVulnerabilities()
        } else {
          toast({
            title: "AI EPSS Calculation Failed",
            description: result.error || "Failed to calculate EPSS score",
            variant: "destructive",
          })
        }
      } else {
        // Batch calculation for all open vulnerabilities
        const openVulns = vulnerabilities.filter(
          v => v.remediation_status === 'Open' || v.remediation_status === 'In Progress'
        )
        
        if (openVulns.length === 0) {
          toast({
            title: "No Vulnerabilities",
            description: "No open vulnerabilities to calculate EPSS scores for",
          })
          return
        }

        const vulnerability_ids = openVulns.map(v => v.id)
        const response = await fetch('/api/vulnerabilities/epss/calculate', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vulnerability_ids }),
        })
        const result = await response.json()
        
        if (result.success) {
          toast({
            title: "AI EPSS Batch Calculation Complete",
            description: `Processed ${result.total} vulnerabilities: ${result.successful} successful, ${result.failed} failed`,
          })
          fetchVulnerabilities()
        } else {
          toast({
            title: "Batch EPSS Calculation Failed",
            description: result.error || "Failed to calculate EPSS scores",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "AI EPSS Calculation Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setAiEpssUpdating(false)
    }
  }

  const handleSingleEPSSUpdate = async (cveId: string, forceRefresh: boolean = false) => {
    try {
      const result = await updateSingleEPSSScore(cveId, forceRefresh)
      if (result.success) {
        toast({
          title: "EPSS Score Updated",
          description: `Updated EPSS score for ${cveId}`,
        })
        fetchVulnerabilities() // Refresh the data
      } else {
        toast({
          title: "EPSS Update Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "EPSS Update Error",
        description: "Failed to update EPSS score",
        variant: "destructive",
      })
    }
  }

  const getEPSSStatusColor = (epssScore: number | null) => {
    if (!epssScore) return "text-gray-500"
    if (epssScore >= 0.9) return "text-red-600"
    if (epssScore >= 0.7) return "text-orange-600"
    if (epssScore >= 0.5) return "text-yellow-600"
    if (epssScore >= 0.3) return "text-blue-600"
    return "text-green-600"
  }

  const isAllSelected = vulnerabilities.length > 0 && selectedVulnerabilities.size === vulnerabilities.length
  const isIndeterminate = selectedVulnerabilities.size > 0 && selectedVulnerabilities.size < vulnerabilities.length

  const MultiSelectFilter = ({
    title,
    options,
    selected,
    onSelectionChange,
    placeholder = "Select options...",
  }: {
    title: string
    options: string[]
    selected: string[]
    onSelectionChange: (values: string[]) => void
    placeholder?: string
  }) => {
    const [open, setOpen] = useState(false)

    const handleSelect = (value: string) => {
      const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
      onSelectionChange(newSelected)
    }

    const clearSelection = () => {
      onSelectionChange([])
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selected.length === 0 ? placeholder : selected.length === 1 ? selected[0] : `${selected.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {selected.length > 0 && (
                  <CommandItem onSelect={clearSelection} className="text-red-600">
                    <X className="mr-2 h-4 w-4" />
                    Clear all
                  </CommandItem>
                )}
                {options.map((option) => (
                  <CommandItem key={option} onSelect={() => handleSelect(option)}>
                    <Check className={cn("mr-2 h-4 w-4", selected.includes(option) ? "opacity-100" : "opacity-0")} />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  const getUniqueAssignedUsers = () => {
    const users = vulnerabilities
      .map((v) => v.assigned_to)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
    return users
  }

  const getUniqueCategories = () => {
    const cats = vulnerabilities
      .map((v) => v.category)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
    return cats
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: [],
      severity: [],
      category: [],
      assignedTo: [],
      aging: [],
      dueDate: [],
      timeline: [],
    })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + filter.length
      }
      return count + (filter ? 1 : 0)
    }, 0)
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold  animate-pulse">
                Vulnerability Register
              </h1>
              <p className="text-blue-600/80">
                Comprehensive vulnerability tracking with aging analytics and timeline monitoring
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                  New Vulnerability
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingVulnerability ? "Edit Vulnerability" : "Create New Vulnerability"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingVulnerability
                      ? "Update the vulnerability details and remediation information"
                      : "Add a new vulnerability to the register with TAT tracking"}
                  </DialogDescription>
                </DialogHeader>
                <VulnerabilityForm
                  vulnerability={editingVulnerability}
                  onSuccess={() => {
                    setIsDialogOpen(false)
                    setEditingVulnerability(null)
                    fetchVulnerabilities()
                  }}
                  onCancel={() => {
                    setIsDialogOpen(false)
                    setEditingVulnerability(null)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFilterCount()} active
                    </Badge>
                  )}
                </CardTitle>
                {getActiveFilterCount() > 0 && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vulnerabilities..."
                      value={filters.search}
                      onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <MultiSelectFilter
                    title="Status"
                    options={filterOptions.status}
                    selected={filters.status}
                    onSelectionChange={(values) => setFilters((prev) => ({ ...prev, status: values }))}
                    placeholder="Select status..."
                  />
                </div>

                {/* Severity Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Severity</Label>
                  <MultiSelectFilter
                    title="Severity"
                    options={filterOptions.severity}
                    selected={filters.severity}
                    onSelectionChange={(values) => setFilters((prev) => ({ ...prev, severity: values }))}
                    placeholder="Select severity..."
                  />
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <MultiSelectFilter
                    title="Category"
                    options={getUniqueCategories()}
                    selected={filters.category}
                    onSelectionChange={(values) => setFilters((prev) => ({ ...prev, category: values }))}
                    placeholder="Select category..."
                  />
                </div>

                {/* Assigned To Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <MultiSelectFilter
                    title="Assigned To"
                    options={getUniqueAssignedUsers()}
                    selected={filters.assignedTo}
                    onSelectionChange={(values) => setFilters((prev) => ({ ...prev, assignedTo: values }))}
                    placeholder="Select assignee..."
                  />
                </div>

                {/* Aging Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Aging</Label>
                  <MultiSelectFilter
                    title="Aging"
                    options={filterOptions.aging}
                    selected={filters.aging}
                    onSelectionChange={(values) => setFilters((prev) => ({ ...prev, aging: values }))}
                    placeholder="Select aging range..."
                  />
                </div>

                {/* Due Date Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Due Dates</Label>
                  <MultiSelectFilter
                    title="Due Dates"
                    options={filterOptions.dueDate}
                    selected={filters.dueDate}
                    onSelectionChange={(values) => setFilters((prev) => ({ ...prev, dueDate: values }))}
                    placeholder="Select due date..."
                  />
                </div>

                {/* Timeline Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Timeline</Label>
                  <MultiSelectFilter
                    title="Timeline"
                    options={filterOptions.timeline}
                    selected={filters.timeline}
                    onSelectionChange={(values) => setFilters((prev) => ({ ...prev, timeline: values }))}
                    placeholder="Select timeline..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Aging Dashboard</TabsTrigger>
              <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
              <TabsTrigger value="trends">Aging Trends</TabsTrigger>
              <TabsTrigger value="register">Vulnerability Register</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Aging Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Average Aging</CardTitle>
                    <Timer className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {agingMetrics?.avgAgingDays.toFixed(1) || 0} days
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across {agingMetrics?.totalVulnerabilities || 0} vulnerabilities
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Overdue Items</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{agingMetrics?.overdueCount || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {agingMetrics?.totalVulnerabilities
                        ? ((agingMetrics.overdueCount / agingMetrics.totalVulnerabilities) * 100).toFixed(1)
                        : 0}
                      % of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Critical Aging</CardTitle>
                    <Target className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{agingMetrics?.criticalAging || 0}</div>
                    <p className="text-xs text-muted-foreground">Items aging 90+ days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">Total Items</CardTitle>
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {agingMetrics?.totalVulnerabilities || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Active vulnerabilities</p>
                  </CardContent>
                </Card>
              </div>

              {/* Aging Distribution and Severity Analysis */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Aging Distribution
                    </CardTitle>
                    <CardDescription>Distribution of vulnerabilities by aging ranges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={agingMetrics?.agingDistribution || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill={COLORS.primary} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Severity Aging Analysis
                    </CardTitle>
                    <CardDescription>Average aging days by severity level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={agingMetrics?.severityAging || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="severity" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgDays" fill={COLORS.warning} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Severity Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Severity Aging Breakdown</CardTitle>
                  <CardDescription>Detailed aging metrics by vulnerability severity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agingMetrics?.severityAging.map((severity, index) => (
                      <div key={severity.severity} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(severity.severity)}>{severity.severity}</Badge>
                            <span className="text-sm text-muted-foreground">{severity.count} vulnerabilities</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">Avg: {severity.avgDays.toFixed(1)} days</div>
                            {severity.overdue > 0 && (
                              <div className="text-xs text-red-600">{severity.overdue} overdue</div>
                            )}
                          </div>
                        </div>
                        <Progress value={Math.min((severity.avgDays / 90) * 100, 100)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    30-Day Timeline Analysis
                  </CardTitle>
                  <CardDescription>Daily vulnerability creation, resolution, and aging trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={agingMetrics?.timelineData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip labelFormatter={(value) => formatDate(value)} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="created"
                        stackId="1"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        name="Created"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stackId="2"
                        stroke={COLORS.success}
                        fill={COLORS.success}
                        name="Resolved"
                      />
                      <Area
                        type="monotone"
                        dataKey="overdue"
                        stackId="3"
                        stroke={COLORS.danger}
                        fill={COLORS.danger}
                        name="Overdue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    12-Week Aging Trends
                  </CardTitle>
                  <CardDescription>Weekly vulnerability identification and aging patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={agingMetrics?.agingTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip labelFormatter={(value) => formatDate(value)} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="newVulns" fill={COLORS.primary} name="New Vulnerabilities" />
                      <Bar yAxisId="left" dataKey="resolved" fill={COLORS.success} name="Resolved" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgAging"
                        stroke={COLORS.warning}
                        strokeWidth={3}
                        name="Avg Aging (days)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              {/* Vulnerability Summary Cards */}
              <div className="grid gap-4 md:grid-cols-7">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Total</CardTitle>
                    <Bug className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{vulnerabilityStats.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Open</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{vulnerabilityStats.open}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">In Progress</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{vulnerabilityStats.inProgress}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Resolved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{vulnerabilityStats.resolved}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Critical</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-800">{vulnerabilityStats.critical}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">High</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{vulnerabilityStats.high}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Overdue</CardTitle>
                    <Calendar className="h-4 w-4 text-red-700" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-700">{vulnerabilityStats.overdue}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Vulnerability Register</CardTitle>
                  <CardDescription>
                    Complete vulnerability tracking with enhanced aging analytics and timeline monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      {selectedVulnerabilities.size > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground">
                            {selectedVulnerabilities.size} selected
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4 mr-2" />
                                Bulk Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setBulkEditDialogOpen(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Bulk Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleBulkStatusUpdate("Open")}>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Mark as Open
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleBulkStatusUpdate("In Progress")}>
                                <Clock className="h-4 w-4 mr-2" />
                                Mark as In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleBulkStatusUpdate("Resolved")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleBulkStatusUpdate("Accepted Risk")}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Mark as Accepted Risk
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setBulkDeleteDialogOpen(true)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                            <Upload className="h-4 w-4" />
                            Import CSV
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Import Vulnerabilities</DialogTitle>
                            <DialogDescription>
                              Upload a CSV file to import vulnerabilities. Required columns: name, severity
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Input type="file" accept=".csv" onChange={handleFileSelect} className="mb-2" />
                              <p className="text-sm text-muted-foreground">
                                CSV should include columns: name, severity, description, category, cvss_score,
                                cve_id, affected_systems, remediation_status, assigned_to, priority, tat_days, tags
                                (semicolon-separated), external_references (semicolon-separated)
                              </p>
                            </div>

                            {importPreview.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Preview (first 5 rows):</h4>
                                <div className="border rounded-lg overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        {Object.keys(importPreview[0]).map((key) => (
                                          <TableHead key={key} className="text-xs">
                                            {key}
                                          </TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {importPreview.map((row, index) => (
                                        <TableRow key={index}>
                                          {Object.values(row).map((value: any, cellIndex) => (
                                            <TableCell key={cellIndex} className="text-xs">
                                              {String(value).substring(0, 50)}
                                              {String(value).length > 50 ? "..." : ""}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setImportDialogOpen(false)
                                  setImportFile(null)
                                  setImportPreview([])
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleImport}
                                disabled={!importFile || importing}
                                className="gradient-bg text-white"
                              >
                                {importing ? "Importing..." : "Import Vulnerabilities"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-transparent"
                        disabled={vulnerabilities.length === 0}
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleEPSSUpdate(false)}
                        className="flex items-center gap-2 bg-transparent"
                        disabled={epssUpdating}
                      >
                        <RefreshCw className={`h-4 w-4 ${epssUpdating ? 'animate-spin' : ''}`} />
                        {epssUpdating ? 'Updating EPSS...' : 'Update EPSS Scores'}
                      </Button>

                      <Button
                        variant="default"
                        onClick={() => handleAIEPSSUpdate()}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={aiEpssUpdating}
                      >
                        <Zap className={`h-4 w-4 ${aiEpssUpdating ? 'animate-pulse' : ''}`} />
                        {aiEpssUpdating ? 'Calculating AI EPSS...' : 'Calculate AI EPSS Scores'}
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">Loading vulnerabilities...</div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={isAllSelected}
                                  onCheckedChange={handleSelectAll}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isIndeterminate
                                  }}
                                />
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("name")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  Vulnerability
                                  {getSortIcon("name")}
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("severity")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  Severity
                                  {getSortIcon("severity")}
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("category")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  Category
                                  {getSortIcon("category")}
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("remediation_status")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  Status
                                  {getSortIcon("remediation_status")}
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("assigned_to")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  Assigned To
                                  {getSortIcon("assigned_to")}
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("remediation_due_date")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  Due Date
                                  {getSortIcon("remediation_due_date")}
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("created_at")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  Aging Analytics
                                  {getSortIcon("created_at")}
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort("epss_score")}
                                  className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                  EPSS Score
                                  {getSortIcon("epss_score")}
                                </Button>
                              </TableHead>
                              <TableHead>Timeline</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vulnerabilities.map((vulnerability) => {
                              const agingDays = calculateAgingDays(
                                vulnerability.created_at,
                                vulnerability.remediation_completed_date,
                              )
                              const overdueDays = calculateOverdueDays(
                                vulnerability.remediation_due_date,
                                vulnerability.remediation_completed_date,
                              )
                              const timelineStatus = getTimelineStatus(
                                vulnerability.remediation_due_date,
                                vulnerability.remediation_completed_date,
                              )

                              return (
                                <TableRow key={vulnerability.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedVulnerabilities.has(vulnerability.id)}
                                      onCheckedChange={(checked) =>
                                        handleSelectVulnerability(vulnerability.id, checked as boolean)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{vulnerability.name}</div>
                                      {vulnerability.cve_id && (
                                        <div className="text-sm text-muted-foreground">{vulnerability.cve_id}</div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getSeverityColor(vulnerability.severity)}>
                                      {vulnerability.severity}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{vulnerability.category || "N/A"}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      {getStatusIcon(vulnerability.remediation_status)}
                                      <Badge className={getStatusColor(vulnerability.remediation_status)}>
                                        {vulnerability.remediation_status}
                                      </Badge>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span>{vulnerability.assigned_to || "Unassigned"}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {vulnerability.remediation_due_date ? (
                                      <div className="text-sm">
                                        {new Date(vulnerability.remediation_due_date).toLocaleDateString()}
                                        {overdueDays > 0 && (
                                          <div className="text-red-600 font-medium">{overdueDays} days overdue</div>
                                        )}
                                      </div>
                                    ) : (
                                      "No due date"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-2 min-w-[120px]">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold">{agingDays} days</span>
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${agingDays <= 7
                                              ? "text-green-600 border-green-600"
                                              : agingDays <= 30
                                                ? "text-yellow-600 border-yellow-600"
                                                : agingDays <= 60
                                                  ? "text-orange-600 border-orange-600"
                                                  : "text-red-600 border-red-600"
                                            }`}
                                        >
                                          {agingDays <= 7
                                            ? "New"
                                            : agingDays <= 30
                                              ? "Active"
                                              : agingDays <= 60
                                                ? "Aging"
                                                : "Critical"}
                                        </Badge>
                                      </div>
                                      <div className="space-y-1">
                                        <Progress
                                          value={getAgingProgressValue(agingDays, vulnerability.tat_days)}
                                          className="h-2"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                          <span>0</span>
                                          <span>{vulnerability.tat_days || 90}d</span>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-2 min-w-[120px]">
                                      {vulnerability.epss_score ? (
                                        <>
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                              <Zap className="h-3 w-3 text-yellow-500" />
                                              <span className={`text-sm font-bold ${getEPSSStatusColor(vulnerability.epss_score)}`}>
                                                {formatEPSSScore(vulnerability.epss_score)}
                                              </span>
                                            </div>
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${getEPSSStatusColor(vulnerability.epss_score)} border-current`}
                                            >
                                              {getEPSSRiskLevel(vulnerability.epss_score)}
                                            </Badge>
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {formatEPSSPercentile(vulnerability.epss_percentile)}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {vulnerability.epss_last_updated
                                              ? `Updated ${new Date(vulnerability.epss_last_updated).toLocaleDateString()}`
                                              : 'Never updated'
                                            }
                                          </div>
                                        </>
                                      ) : (
                                        <div className="flex flex-col items-center gap-1">
                                          <div className="flex items-center gap-1 text-muted-foreground">
                                            <Zap className="h-3 w-3" />
                                            <span className="text-xs">Not calculated</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                            Use ⚡ in Actions
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className={`text-sm font-medium ${getTimelineColor(timelineStatus)}`}>
                                      {timelineStatus}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setEditingVulnerability(vulnerability)
                                          setIsDialogOpen(true)
                                        }}
                                        title="Edit vulnerability"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAIEPSSUpdate(vulnerability.id)}
                                        title="Calculate AI EPSS Score"
                                        disabled={aiEpssUpdating}
                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                      >
                                        <Zap className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(vulnerability.id)}
                                        title="Delete vulnerability"
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
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Showing {startItem} to {endItem} of {totalItems} vulnerabilities
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                              {getPageNumbers().map((page, index) => (
                                <div key={index}>
                                  {page === "..." ? (
                                    <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                                  ) : (
                                    <Button
                                      variant={currentPage === page ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setCurrentPage(page as number)}
                                      className={currentPage === page ? "gradient-bg text-white" : ""}
                                    >
                                      {page}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bulk Edit Dialog */}
          <Dialog open={bulkEditDialogOpen} onOpenChange={setBulkEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Edit Vulnerabilities</DialogTitle>
                <DialogDescription>
                  Edit {selectedVulnerabilities.size} selected vulnerabilities. Only fields with values will be
                  updated.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulk-severity">Severity</Label>
                    <Select
                      value={bulkEditData.severity}
                      onValueChange={(value) => setBulkEditData((prev) => ({ ...prev, severity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Informational">Informational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulk-category">Category</Label>
                    <Input
                      id="bulk-category"
                      value={bulkEditData.category}
                      onChange={(e) => setBulkEditData((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Enter category"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulk-assigned-to">Assigned To</Label>
                    <OwnerSelectInput formData={bulkEditData} setFormData={setBulkEditData} fieldName="assigned_to" />
                    {/* <Input
                          id="bulk-assigned-to"
                          value={bulkEditData.assigned_to}
                          onChange={(e) => setBulkEditData((prev) => ({ ...prev, assigned_to: e.target.value }))}
                          placeholder="Enter assignee"
                        /> */}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulk-priority">Priority</Label>
                    <Select
                      value={bulkEditData.priority}
                      onValueChange={(value) => setBulkEditData((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Highest</SelectItem>
                        <SelectItem value="2">2 - High</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - Low</SelectItem>
                        <SelectItem value="5">5 - Lowest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bulk-status">Remediation Status</Label>
                    <Select
                      value={bulkEditData.remediation_status}
                      onValueChange={(value) => setBulkEditData((prev) => ({ ...prev, remediation_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Accepted Risk">Accepted Risk</SelectItem>
                        <SelectItem value="False Positive">False Positive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bulk-notes">Remediation Notes</Label>
                    <Textarea
                      id="bulk-notes"
                      value={bulkEditData.remediation_notes}
                      onChange={(e) => setBulkEditData((prev) => ({ ...prev, remediation_notes: e.target.value }))}
                      placeholder="Enter remediation notes"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBulkEditDialogOpen(false)
                      setBulkEditData({
                        severity: "",
                        category: "",
                        assigned_to: "",
                        priority: "",
                        remediation_status: "",
                        remediation_notes: "",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkEdit}
                    disabled={bulkOperationLoading}
                    className="gradient-bg text-white"
                  >
                    {bulkOperationLoading ? "Updating..." : "Update Vulnerabilities"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bulk Delete Confirmation Dialog */}
          <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Bulk Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {selectedVulnerabilities.size} selected vulnerabilities? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleBulkDelete} disabled={bulkOperationLoading}>
                  {bulkOperationLoading ? "Deleting..." : "Delete Vulnerabilities"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ConversationChatbot autoOpen={true} />
    </main>
  )
}
