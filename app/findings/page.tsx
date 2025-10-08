"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { AlertTriangle, CheckCircle, Clock, Edit, Plus, Search, Trash2, XCircle, FileStack } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { deleteFinding, updateFindingStatus } from "@/lib/api/findings"
import { getAssessments } from "@/lib/actions/findings-actions"
import { FindingForm } from "@/components/finding-form"
import { BulkFindingsTableForm } from "@/components/bulk-findings-table-form"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FindingsImportExport } from "@/components/findings-import-export"
import { FindingsReportGenerator } from "@/components/findings-report-generator"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import StarBorder from "../StarBorder"

interface Finding {
  id: number
  finding_id: string
  assessment_id: number
  finding_title: string
  finding_description: string
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational"
  category: string
  recommendation: string
  status: "Open" | "In Progress" | "Resolved" | "Closed" | "Accepted Risk"
  user_id?: number
  department_id?: number
  organization_id?: number
  assigned_to?: string
  due_date?: string
  completed_date?: string
  created_at: string
  updated_at?: string
  assessment_name?: string
  assessment_code?: string
  user_name?: string
  username?: string
  department_name?: string
  organization_name?: string
}

// Utility function to safely format date
const formatDateString = (dateInput: any): string => {
  if (!dateInput) return new Date().toISOString()

  // If it's already a string, return it
  if (typeof dateInput === "string") return dateInput

  // If it's a Date object, convert to ISO string
  if (dateInput instanceof Date) return dateInput.toISOString()

  // Try to create a new Date from the input
  try {
    return new Date(dateInput).toISOString()
  } catch {
    return new Date().toISOString()
  }
}

// Utility function to safely get date part
const getDatePart = (dateInput: any): string => {
  const dateString = formatDateString(dateInput)
  return dateString.split("T")[0]
}

// Utility functions for aging and timeline calculations
const calculateAgingDays = (createdAt: any): number => {
  const created = new Date(formatDateString(createdAt))
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - created.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const calculateOverdueDays = (dueDate: any): number => {
  if (!dueDate) return 0
  const due = new Date(formatDateString(dueDate))
  const now = new Date()
  const diffTime = now.getTime() - due.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getTimelineStatus = (finding: Finding): { status: string; color: string; bgColor: string } => {
  if (finding.status === "Resolved" || finding.status === "Closed") {
    return { status: "Completed", color: "text-green-700", bgColor: "bg-green-100" }
  }

  if (!finding.due_date) {
    return { status: "No Due Date", color: "text-gray-700", bgColor: "bg-gray-100" }
  }

  const overdueDays = calculateOverdueDays(finding.due_date)

  if (overdueDays > 0) {
    return { status: "Overdue", color: "text-red-700", bgColor: "bg-red-100" }
  }

  const daysUntilDue = Math.abs(overdueDays)

  if (daysUntilDue <= 7) {
    return { status: "Due Soon", color: "text-orange-700", bgColor: "bg-orange-100" }
  }

  return { status: "On Track", color: "text-blue-700", bgColor: "bg-blue-100" }
}

const getAgingColor = (days: number): string => {
  if (days <= 30) return "text-green-600"
  if (days <= 60) return "text-yellow-600"
  if (days <= 90) return "text-orange-600"
  return "text-red-600"
}

const getAgingProgress = (days: number): number => {
  // Progress based on 120 days max
  return Math.min((days / 120) * 100, 100)
}

const getProgressColor = (days: number): string => {
  if (days <= 30) return "bg-green-500"
  if (days <= 60) return "bg-yellow-500"
  if (days <= 90) return "bg-orange-500"
  return "bg-red-500"
}

// Enhanced aging and timeline analytics
const generateTimelineData = (findings: Finding[]) => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split("T")[0]
  })

  return last30Days.map((date) => {
    const dayFindings = findings.filter((f) => getDatePart(f.created_at) === date)
    const resolvedFindings = findings.filter((f) => f.completed_date && getDatePart(f.completed_date) === date)
    const overdueFindings = findings.filter((f) => {
      if (!f.due_date) return false
      const overdueDays = calculateOverdueDays(f.due_date)
      return overdueDays > 0 && getDatePart(f.created_at) <= date
    })

    return {
      date,
      created: dayFindings.length,
      resolved: resolvedFindings.length,
      overdue: overdueFindings.length,
      formattedDate: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }
  })
}

const generateAgingTrendsData = (findings: Finding[]) => {
  const last12Weeks = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (11 - i) * 7)
    const weekStart = new Date(date)
    const weekEnd = new Date(date)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return {
      weekStart: weekStart.toISOString().split("T")[0],
      weekEnd: weekEnd.toISOString().split("T")[0],
      label: `Week ${12 - i}`,
    }
  })

  return last12Weeks.map((week) => {
    const weekFindings = findings.filter((f) => {
      const createdDate = getDatePart(f.created_at)
      return createdDate >= week.weekStart && createdDate <= week.weekEnd
    })

    const resolvedFindings = findings.filter((f) => {
      if (!f.completed_date) return false
      const completedDate = getDatePart(f.completed_date)
      return completedDate >= week.weekStart && completedDate <= week.weekEnd
    })

    const avgAging =
      weekFindings.length > 0
        ? weekFindings.reduce((sum, f) => sum + calculateAgingDays(f.created_at), 0) / weekFindings.length
        : 0

    return {
      week: week.label,
      identified: weekFindings.length,
      resolved: resolvedFindings.length,
      avgAging: Math.round(avgAging),
    }
  })
}

const generateAgingDistributionData = (findings: Finding[]) => {
  const ranges = [
    { label: "0-7 days", min: 0, max: 7, color: "#10b981" },
    { label: "8-30 days", min: 8, max: 30, color: "#f59e0b" },
    { label: "31-60 days", min: 31, max: 60, color: "#ef4444" },
    { label: "61-90 days", min: 61, max: 90, color: "#8b5cf6" },
    { label: "90+ days", min: 91, max: Number.POSITIVE_INFINITY, color: "#dc2626" },
  ]

  return ranges.map((range) => {
    const count = findings.filter((f) => {
      const aging = calculateAgingDays(f.created_at)
      return aging >= range.min && aging <= range.max
    }).length

    return {
      range: range.label,
      count,
      color: range.color,
    }
  })
}

const getSeverityAgingData = (findings: Finding[]) => {
  const severities = ["Critical", "High", "Medium", "Low", "Informational"]

  return severities.map((severity) => {
    const severityFindings = findings.filter((f) => f.severity === severity)
    const avgAging =
      severityFindings.length > 0
        ? severityFindings.reduce((sum, f) => sum + calculateAgingDays(f.created_at), 0) / severityFindings.length
        : 0

    return {
      severity,
      avgAging: Math.round(avgAging),
      count: severityFindings.length,
      color:
        severity === "Critical"
          ? "#dc2626"
          : severity === "High"
            ? "#ea580c"
            : severity === "Medium"
              ? "#d97706"
              : severity === "Low"
                ? "#65a30d"
                : "#6366f1",
    }
  })
}

const getAgingBadge = (days: number) => {
  if (days <= 7) return { label: "New", color: "bg-green-100 text-green-800" }
  if (days <= 30) return { label: "Active", color: "bg-blue-100 text-blue-800" }
  if (days <= 60) return { label: "Aging", color: "bg-yellow-100 text-yellow-800" }
  return { label: "Critical", color: "bg-red-100 text-red-800" }
}

export default function FindingsPage() {
  const [findings, setFindings] = useState<any[]>([])
  const [filteredFindings, setFilteredFindings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [severityFilter, setSeverityFilter] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [editingFinding, setEditingFinding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [assessmentFilter, setAssessmentFilter] = useState("")
  const [assessments, setAssessments] = useState<any[]>([])
  const [timelineFilter, setTimelineFilter] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [paginatedFindings, setPaginatedFindings] = useState<any[]>([])

  const fetchFindings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/findings")
      const result = await response.json()
      if (result.success) {
        setFindings(result.data)
        setFilteredFindings(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load findings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load findings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFindings()
  }, [])

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const result = await getAssessments()
        if (result.success) {
          setAssessments(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch assessments:", error)
      }
    }
    fetchAssessments()
  }, [])

  useEffect(() => {
    let filtered = findings

    if (searchTerm) {
      filtered = filtered.filter(
        (finding) =>
          finding.finding_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          finding.finding_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          finding.assessment_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((finding) => finding.status === statusFilter)
    }

    if (severityFilter && severityFilter !== "all") {
      filtered = filtered.filter((finding) => finding.severity === severityFilter)
    }

    if (assessmentFilter && assessmentFilter !== "all") {
      filtered = filtered.filter((finding) => finding.assessment_id?.toString() === assessmentFilter)
    }

    if (timelineFilter && timelineFilter !== "all") {
      filtered = filtered.filter((finding) => {
        const timeline = getTimelineStatus(finding)
        return timeline.status === timelineFilter
      })
    }

    setFilteredFindings(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [findings, searchTerm, statusFilter, severityFilter, assessmentFilter, timelineFilter])

  // Pagination logic
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    setPaginatedFindings(filteredFindings.slice(startIndex, endIndex))
  }, [filteredFindings, currentPage, pageSize])

  const totalPages = Math.ceil(filteredFindings.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, filteredFindings.length)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number.parseInt(newPageSize))
    setCurrentPage(1)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this finding?")) {
      const result = await deleteFinding(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Finding deleted successfully",
        })
        fetchFindings()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete finding",
          variant: "destructive",
        })
      }
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    const result = await updateFindingStatus(id, newStatus)
    if (result.success) {
      toast({
        title: "Success",
        description: "Finding status updated successfully",
      })
      fetchFindings()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update finding status",
        variant: "destructive",
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive"
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      case "Informational":
        return "default"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "destructive"
      case "In Progress":
        return "secondary"
      case "Resolved":
        return "default"
      case "Closed":
        return "outline"
      case "Accepted Risk":
        return "outline"
      default:
        return "default"
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
      case "Closed":
        return <CheckCircle className="h-4 w-4" />
      case "Accepted Risk":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const findingStats = {
    total: findings.length,
    open: findings.filter((f) => f.status === "Open").length,
    inProgress: findings.filter((f) => f.status === "In Progress").length,
    resolved: findings.filter((f) => f.status === "Resolved").length,
    critical: findings.filter((f) => f.severity === "Critical").length,
    high: findings.filter((f) => f.severity === "High").length,
  }

  // Enhanced Analytics
  const timelineData = generateTimelineData(findings)
  const agingTrendsData = generateAgingTrendsData(findings)
  const agingDistributionData = generateAgingDistributionData(findings)
  const severityAgingData = getSeverityAgingData(findings)

  const enhancedStats = {
    ...findingStats,
    avgAging:
      findings.length > 0
        ? Math.round(findings.reduce((sum, f) => sum + calculateAgingDays(f.created_at), 0) / findings.length)
        : 0,
    overdue: findings.filter((f) => f.due_date && calculateOverdueDays(f.due_date) > 0).length,
    criticalAging: findings.filter((f) => calculateAgingDays(f.created_at) > 90).length,
    resolutionRate:
      findings.length > 0
        ? Math.round(
          (findings.filter((f) => f.status === "Resolved" || f.status === "Closed").length / findings.length) * 100,
        )
        : 0,
  }

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(totalPages)
              }}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    return items
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Assessment Findings
          </h1>
          <p className="text-muted-foreground">Manage and track assessment findings and remediation</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileStack className="mr-2 h-4 w-4" />
                Add Findings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle> Add Findings</DialogTitle>
                <DialogDescription>
                  Add multiple findings to a single assessment using table format
                </DialogDescription>
              </DialogHeader>
              <BulkFindingsTableForm
                assessments={assessments}
                onSuccess={() => {
                  setIsBulkDialogOpen(false)
                  fetchFindings()
                }}
                onCancel={() => {
                  setIsBulkDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>

            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{editingFinding ? "Edit Finding" : "Create New Finding"}</DialogTitle>
                <DialogDescription>
                  {editingFinding ? "Update the finding details" : "Add a new assessment finding"}
                </DialogDescription>
              </DialogHeader>
              <FindingForm
                finding={editingFinding}
                assessmentId={editingFinding?.assessment_id || null}
                onSuccess={() => {
                  setIsDialogOpen(false)
                  setEditingFinding(null)
                  fetchFindings()
                  toast({
                    title: "Success",
                    description: `Finding ${editingFinding ? "updated" : "created"} successfully`,
                  })
                }}
                onCancel={() => {
                  setIsDialogOpen(false)
                  setEditingFinding(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Findings Summary Cards with Dashboard */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Total Findings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{findingStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Open</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{findingStats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{findingStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{findingStats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{findingStats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">High</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{findingStats.high}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="register" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="register">Findings Register</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          <TabsTrigger value="dashboard">Aging Dashboard</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
          <TabsTrigger value="trends">Aging Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Findings Register</CardTitle>
                  <CardDescription>Complete record of all assessment findings</CardDescription>
                </div>
                <FindingsImportExport
                  onImportComplete={fetchFindings}
                  currentFilters={{
                    searchTerm,
                    statusFilter,
                    severityFilter,
                    assessmentFilter,
                    timelineFilter,
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search findings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Accepted Risk">Accepted Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Informational">Informational</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assessmentFilter} onValueChange={setAssessmentFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assessments</SelectItem>
                    {assessments.map((assessment) => (
                      <SelectItem key={assessment.id} value={assessment.id.toString()}>
                        {assessment.assessment_name || assessment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={timelineFilter} onValueChange={setTimelineFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Timeline</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Due Soon">Due Soon</SelectItem>
                    <SelectItem value="On Track">On Track</SelectItem>
                    <SelectItem value="No Due Date">No Due Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pagination Controls - Top */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-[70px]">
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
                  <span className="text-sm text-muted-foreground">entries</span>
                </div>

                {/* Top Navigation Buttons */}
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) handlePageChange(currentPage - 1)
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="text-sm text-muted-foreground px-2">
                            Page {currentPage} of {totalPages}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages) handlePageChange(currentPage + 1)
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                <div className="text-sm">
                  {filteredFindings.length > 0 ? (
                    <>
                      Showing {startIndex} to {endIndex} of {filteredFindings.length} findings
                    </>
                  ) : (
                    "No findings found"
                  )}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading findings...</div>
              ) : (
                <>
                  <div className="border rounded-lg overflow-auto max-h-[600px]">
                    <Table className="relative">
                      <TableHeader className="sticky top-0 bg-transparent">
                        <TableRow>
                          <TableHead className="truncate">Finding ID</TableHead>
                          <TableHead className="truncate">Finding Title</TableHead>
                          <TableHead className="truncate">Assessment</TableHead>
                          <TableHead className="truncate">Severity</TableHead>
                          <TableHead className="truncate">Category</TableHead>
                          <TableHead className="truncate">Status</TableHead>
                          <TableHead className="truncate">Assigned To</TableHead>
                          <TableHead className="truncate">Due Date</TableHead>
                          <TableHead className="truncate">Aging Analytics</TableHead>
                          <TableHead className="truncate">Timeline</TableHead>
                          <TableHead className="truncate text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedFindings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                              No findings found matching your criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedFindings.map((finding) => {
                            const agingDays = calculateAgingDays(finding.created_at)
                            const timeline = getTimelineStatus(finding)
                            const overdueDays = finding.due_date ? calculateOverdueDays(finding.due_date) : 0
                            const agingBadge = getAgingBadge(agingDays)

                            return (
                              <TableRow key={finding.id}>
                                <TableCell className="font-medium text-xs truncate">{finding.finding_id}</TableCell>
                                <TableCell className="font-medium">{finding.finding_title}</TableCell>
                                <TableCell>{finding.assessment_name || "N/A"}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      finding.severity === "Critical"
                                        ? "text-red-600"
                                        : finding.severity === "High"
                                          ? "text-orange-600"
                                          : finding.severity === "Medium"
                                            ? "text-yellow-600"
                                            : finding.severity === "Low"
                                              ? "text-blue-600"
                                              : "text-purple-600"
                                    }
                                  >
                                    {finding.severity}
                                  </Badge>
                                </TableCell>
                                <TableCell>{finding.category || "N/A"}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(finding.status)}
                                    <Badge
                                      variant="outline"
                                      className={
                                        finding.status === "Open"
                                          ? "text-red-600"
                                          : finding.status === "In Progress"
                                            ? "text-yellow-600"
                                            : finding.status === "Resolved"
                                              ? "text-green-600"
                                              : finding.status === "Closed"
                                                ? "text-green-600"
                                                : "text-purple-600"
                                      }
                                    >
                                      {finding.status}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell>{finding.assigned_to || "Unassigned"}</TableCell>
                                <TableCell>
                                  {finding.due_date ? (
                                    <div className="flex flex-col">
                                      <span>
                                        {new Date(formatDateString(finding.due_date)).toLocaleDateString()}
                                      </span>
                                      {overdueDays > 0 && (
                                        <span className="text-red-600 text-xs font-medium">
                                          {overdueDays} days overdue
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    "No due date"
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col space-y-2 min-w-[120px]">
                                    <div className="flex items-center justify-between">
                                      <span
                                        className={`text-sm font-bold ${getAgingColor(agingDays)} min-w-[40px] text-right`}
                                      >
                                        {agingDays} days
                                      </span>
                                      <Badge variant="outline" className={`text-xs ${agingBadge.color}`}>{agingBadge.label}</Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(agingDays)}`}
                                        style={{ width: `${getAgingProgress(agingDays)}%` }}
                                      />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      TAT: {agingDays <= 30 ? "On Track" : agingDays <= 60 ? "At Risk" : "Overdue"}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="truncate">
                                  <Badge variant="outline" className={`${timeline.bgColor} ${timeline.color}`}>
                                    {timeline.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingFinding(finding)
                                        setIsDialogOpen(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(finding.id)}
                                      className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls - Bottom */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) handlePageChange(currentPage - 1)
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {generatePaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) handlePageChange(currentPage + 1)
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <FindingsReportGenerator findings={findings} />
        </TabsContent>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            {/* Enhanced Aging Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Aging</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{enhancedStats.avgAging} days</div>
                  <p className="text-xs text-muted-foreground">Across all findings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{enhancedStats.overdue}</div>
                  <p className="text-xs text-muted-foreground">Past due date</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Aging</CardTitle>
                  <XCircle className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{enhancedStats.criticalAging}</div>
                  <p className="text-xs text-muted-foreground">90+ days old</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{enhancedStats.resolutionRate}%</div>
                  <p className="text-xs text-muted-foreground">Resolved/Closed</p>
                </CardContent>
              </Card>
            </div>

            {/* Aging Distribution and Severity Analysis */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Aging Distribution</CardTitle>
                  <CardDescription>Findings by aging ranges</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={agingDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Severity Aging Analysis</CardTitle>
                  <CardDescription>Average aging days by severity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {severityAgingData.map((item) => (
                      <div key={item.severity} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.severity}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.avgAging} days avg ({item.count} findings)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((item.avgAging / 120) * 100, 100)}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Timeline Analysis</CardTitle>
              <CardDescription>Daily findings creation, resolution, and overdue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload
                        return `Date: ${new Date(data.date).toLocaleDateString()}`
                      }
                      return label
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Created"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Resolved"
                  />
                  <Area
                    type="monotone"
                    dataKey="overdue"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    name="Overdue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>12-Week Aging Trends</CardTitle>
              <CardDescription>Weekly findings identification and aging patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={agingTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="identified" fill="#8884d8" name="Identified" />
                  <Bar yAxisId="left" dataKey="resolved" fill="#82ca9d" name="Resolved" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgAging"
                    stroke="#ff7300"
                    strokeWidth={2}
                    name="Avg Aging (days)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
