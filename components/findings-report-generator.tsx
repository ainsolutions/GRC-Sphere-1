"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { Download, FileText, Filter, X, AlertTriangle, CheckCircle, Clock } from "lucide-react"

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

interface FindingsReportGeneratorProps {
  findings: Finding[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

export function FindingsReportGenerator({ findings }: FindingsReportGeneratorProps) {
  const [filteredFindings, setFilteredFindings] = useState<Finding[]>(findings)
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [dateRangeFilter, setDateRangeFilter] = useState("all")
  const [assessmentFilter, setAssessmentFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update filtered findings when findings prop changes
  useEffect(() => {
    setFilteredFindings(findings)
  }, [findings])

  // Apply filters
  useEffect(() => {
    let filtered = findings

    if (severityFilter !== "all") {
      filtered = filtered.filter((f) => f.severity === severityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((f) => f.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((f) => f.category === categoryFilter)
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter((f) => f.assigned_to === assigneeFilter)
    }

    if (assessmentFilter !== "all") {
      filtered = filtered.filter((f) => f.assessment_name === assessmentFilter)
    }

    if (dateRangeFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateRangeFilter) {
        case "7days":
          filterDate.setDate(now.getDate() - 7)
          break
        case "30days":
          filterDate.setDate(now.getDate() - 30)
          break
        case "90days":
          filterDate.setDate(now.getDate() - 90)
          break
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      if (dateRangeFilter !== "all") {
        filtered = filtered.filter((f) => new Date(f.created_at) >= filterDate)
      }
    }

    setFilteredFindings(filtered)
  }, [findings, severityFilter, statusFilter, categoryFilter, assigneeFilter, dateRangeFilter, assessmentFilter])

  // Clear all filters
  const clearFilters = () => {
    setSeverityFilter("all")
    setStatusFilter("all")
    setCategoryFilter("all")
    setAssigneeFilter("all")
    setDateRangeFilter("all")
    setAssessmentFilter("all")
  }

  // Get unique values for filters
  const uniqueCategories = [...new Set(findings.map((f) => f.category).filter(Boolean))]
  const uniqueAssignees = [...new Set(findings.map((f) => f.assigned_to).filter(Boolean))]
  const uniqueAssessments = [...new Set(findings.map((f) => f.assessment_name).filter(Boolean))]

  // Generate chart data
  const severityData = [
    { name: "Critical", value: filteredFindings.filter((f) => f.severity === "Critical").length, color: "#DC2626" },
    { name: "High", value: filteredFindings.filter((f) => f.severity === "High").length, color: "#EA580C" },
    { name: "Medium", value: filteredFindings.filter((f) => f.severity === "Medium").length, color: "#D97706" },
    { name: "Low", value: filteredFindings.filter((f) => f.severity === "Low").length, color: "#65A30D" },
    {
      name: "Informational",
      value: filteredFindings.filter((f) => f.severity === "Informational").length,
      color: "#6366F1",
    },
  ].filter((item) => item.value > 0)

  const statusData = [
    { name: "Open", value: filteredFindings.filter((f) => f.status === "Open").length, color: "#DC2626" },
    {
      name: "In Progress",
      value: filteredFindings.filter((f) => f.status === "In Progress").length,
      color: "#D97706",
    },
    { name: "Resolved", value: filteredFindings.filter((f) => f.status === "Resolved").length, color: "#059669" },
    { name: "Closed", value: filteredFindings.filter((f) => f.status === "Closed").length, color: "#047857" },
    {
      name: "Accepted Risk",
      value: filteredFindings.filter((f) => f.status === "Accepted Risk").length,
      color: "#6B7280",
    },
  ].filter((item) => item.value > 0)

  const categoryData = uniqueCategories
    .map((category) => ({
      name: category,
      value: filteredFindings.filter((f) => f.category === category).length,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  const assessmentData = uniqueAssessments
    .map((assessment) => ({
      name: assessment,
      value: filteredFindings.filter((f) => f.assessment_name === assessment).length,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  // Monthly trends data
  const monthlyData = (() => {
    const months = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      const created = filteredFindings.filter((f) => {
        const createdDate = new Date(f.created_at)
        const createdKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}`
        return createdKey === monthKey
      }).length

      const resolved = filteredFindings.filter((f) => {
        if (!f.completed_date) return false
        const resolvedDate = new Date(f.completed_date)
        const resolvedKey = `${resolvedDate.getFullYear()}-${String(resolvedDate.getMonth() + 1).padStart(2, "0")}`
        return resolvedKey === monthKey
      }).length

      months.push({
        month: monthName,
        created,
        resolved,
      })
    }
    return months
  })()

  // Age analysis data
  const ageData = [
    {
      range: "0-7 days",
      count: filteredFindings.filter((f) => {
        const days = Math.ceil((Date.now() - new Date(f.created_at).getTime()) / (1000 * 60 * 60 * 24))
        return days <= 7
      }).length,
    },
    {
      range: "8-30 days",
      count: filteredFindings.filter((f) => {
        const days = Math.ceil((Date.now() - new Date(f.created_at).getTime()) / (1000 * 60 * 60 * 24))
        return days > 7 && days <= 30
      }).length,
    },
    {
      range: "31-90 days",
      count: filteredFindings.filter((f) => {
        const days = Math.ceil((Date.now() - new Date(f.created_at).getTime()) / (1000 * 60 * 60 * 24))
        return days > 30 && days <= 90
      }).length,
    },
    {
      range: "90+ days",
      count: filteredFindings.filter((f) => {
        const days = Math.ceil((Date.now() - new Date(f.created_at).getTime()) / (1000 * 60 * 60 * 24))
        return days > 90
      }).length,
    },
  ]

  // Assignee workload data
  const assigneeData = uniqueAssignees
    .map((assignee) => {
      const assigneeFindings = filteredFindings.filter((f) => f.assigned_to === assignee)
      return {
        name: assignee,
        open: assigneeFindings.filter((f) => f.status === "Open").length,
        inProgress: assigneeFindings.filter((f) => f.status === "In Progress").length,
        resolved: assigneeFindings.filter((f) => f.status === "Resolved" || f.status === "Closed").length,
        total: assigneeFindings.length,
      }
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  // Statistics
  const stats = {
    total: filteredFindings.length,
    critical: filteredFindings.filter((f) => f.severity === "Critical").length,
    high: filteredFindings.filter((f) => f.severity === "High").length,
    open: filteredFindings.filter((f) => f.status === "Open").length,
    resolved: filteredFindings.filter((f) => f.status === "Resolved" || f.status === "Closed").length,
    avgAge:
      filteredFindings.length > 0
        ? Math.round(
            filteredFindings.reduce((sum, f) => {
              const days = Math.ceil((Date.now() - new Date(f.created_at).getTime()) / (1000 * 60 * 60 * 24))
              return sum + days
            }, 0) / filteredFindings.length,
          )
        : 0,
    resolutionRate:
      filteredFindings.length > 0
        ? Math.round(
            (filteredFindings.filter((f) => f.status === "Resolved" || f.status === "Closed").length /
              filteredFindings.length) *
              100,
          )
        : 0,
  }

  // Export to CSV
  const exportToCSV = () => {
    setLoading(true)
    try {
      const headers = [
        "Finding ID",
        "Title",
        "Assessment",
        "Severity",
        "Category",
        "Status",
        "Assigned To",
        "Due Date",
        "Created Date",
        "Description",
        "Recommendation",
      ]

      const csvData = filteredFindings.map((finding) => [
        finding.finding_id || "",
        finding.finding_title || "",
        finding.assessment_name || "",
        finding.severity || "",
        finding.category || "",
        finding.status || "",
        finding.assigned_to || "",
        finding.due_date ? new Date(finding.due_date).toLocaleDateString() : "",
        new Date(finding.created_at).toLocaleDateString(),
        finding.finding_description || "",
        finding.recommendation || "",
      ])

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((field) => `"${field.toString().replace(/"/g, '""')}"`).join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `findings-report-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "Findings report exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export findings report",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Check if any filters are active
  const hasActiveFilters =
    severityFilter !== "all" ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    assigneeFilter !== "all" ||
    dateRangeFilter !== "all" ||
    assessmentFilter !== "all"

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {findings.length > 0
                ? `${Math.round((stats.total / findings.length) * 100)}% of all findings`
                : "No findings"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical & High</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical + stats.high}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round(((stats.critical + stats.high) / stats.total) * 100)}% of filtered`
                : "0%"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">{stats.resolved} resolved findings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Age</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.avgAge} days</div>
            <p className="text-xs text-muted-foreground">Since creation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Report Filters
              </CardTitle>
              <CardDescription>Filter findings data for detailed analysis</CardDescription>
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
              <Button onClick={exportToCSV} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Exporting..." : "Export CSV"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
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

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
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

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueAssignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={assessmentFilter} onValueChange={setAssessmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Assessment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assessments</SelectItem>
                {uniqueAssessments.map((assessment) => (
                  <SelectItem key={assessment} value={assessment}>
                    {assessment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium">Active Filters:</span>
              {severityFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Severity: {severityFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSeverityFilter("all")} />
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {categoryFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter("all")} />
                </Badge>
              )}
              {assigneeFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Assignee: {assigneeFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setAssigneeFilter("all")} />
                </Badge>
              )}
              {assessmentFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Assessment: {assessmentFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setAssessmentFilter("all")} />
                </Badge>
              )}
              {dateRangeFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {dateRangeFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDateRangeFilter("all")} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Findings by Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Findings by Severity</CardTitle>
            <CardDescription>Distribution of findings across severity levels</CardDescription>
          </CardHeader>
          <CardContent>
            {severityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available for current filters
              </div>
            )}
          </CardContent>
        </Card>

        {/* Findings by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Findings by Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available for current filters
              </div>
            )}
          </CardContent>
        </Card>

        {/* Findings by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Findings by Category</CardTitle>
            <CardDescription>Top security categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available for current filters
              </div>
            )}
          </CardContent>
        </Card>

        {/* Findings by Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Findings by Assessment</CardTitle>
            <CardDescription>Top assessments generating findings</CardDescription>
          </CardHeader>
          <CardContent>
            {assessmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assessmentData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available for current filters
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Findings creation vs resolution over time</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyData.some((d) => d.created > 0 || d.resolved > 0) ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#8884d8" name="Created" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              No trend data available for current filters
            </div>
          )}
        </CardContent>
      </Card>

      {/* Age Analysis and Assignee Workload */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Age Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Age Analysis</CardTitle>
            <CardDescription>Findings distribution by age ranges</CardDescription>
          </CardHeader>
          <CardContent>
            {ageData.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No age data available for current filters
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignee Workload */}
        <Card>
          <CardHeader>
            <CardTitle>Assignee Workload</CardTitle>
            <CardDescription>Findings distribution by assignee</CardDescription>
          </CardHeader>
          <CardContent>
            {assigneeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assigneeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="open" stackId="a" fill="#ef4444" name="Open" />
                  <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                  <Bar dataKey="resolved" stackId="a" fill="#10b981" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No assignee data available for current filters
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Findings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Findings</CardTitle>
          <CardDescription>Latest findings based on current filters (showing up to 20)</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFindings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Finding ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFindings
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 20)
                  .map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell className="font-mono text-sm">
                        <Badge variant="outline">{finding.finding_id}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{finding.finding_title}</TableCell>
                      <TableCell>{finding.assessment_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            finding.severity === "Critical"
                              ? "bg-red-600 text-white"
                              : finding.severity === "High"
                                ? "bg-orange-600 text-white"
                                : finding.severity === "Medium"
                                  ? "bg-yellow-600 text-white"
                                  : finding.severity === "Low"
                                    ? "bg-blue-600 text-white"
                                    : "bg-purple-600 text-white"
                          }
                        >
                          {finding.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            finding.status === "Open"
                              ? "bg-red-600 text-white"
                              : finding.status === "In Progress"
                                ? "bg-yellow-600 text-white"
                                : finding.status === "Resolved"
                                  ? "bg-green-600 text-white"
                                  : finding.status === "Closed"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-600 text-white"
                          }
                        >
                          {finding.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{finding.assigned_to || "Unassigned"}</TableCell>
                      <TableCell>{new Date(finding.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No findings found matching your current filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
