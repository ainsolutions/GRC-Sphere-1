"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThreatForm } from "@/components/threat-form"
// import { Sidebar } from "@/components/sidebar"
import {
  Plus,
  Search,
  AlertTriangle,
  Shield,
  Activity,
  Zap,
  Eye,
  Filter,
  X,
  Download,
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Brain,
  TrendingDown
} from "lucide-react"
import { deleteThreat } from "@/lib/actions/threat-actions"
import { Label } from "@/components/ui/label"
// import { Header } from "@/components/header"
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
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import StarBorder from "@/app/StarBorder"

interface Threat {
  id: string
  threat_id: string
  name: string
  description: string
  category: string
  source: string
  threat_level: string
  status: string
  indicators_of_compromise: string[]
  mitigation_strategies: string[]
  threat_references: string[]
  associated_risks?: Array<{
    id: string
    title: string
    description: string
    category: string
    source: string
    risk_level?: string
    status?: string
    table: string
    uniqueId: string
  }>
  threat_analysis?: string
  impact_analysis?: string
  risk_analysis?: string
  created_at: string
  updated_at: string
}

interface FilterState {
  status: string
  threatLevel: string
  category: string
  source: string
  dateRange: string
}

export default function ThreatsPage() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [filteredThreats, setFilteredThreats] = useState<Threat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingThreat, setEditingThreat] = useState<Threat | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewingThreat, setViewingThreat] = useState<Threat | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    threatLevel: "",
    category: "",
    source: "",
    dateRange: "",
  })

  useEffect(() => {
  async function loadThreats() {
    try {
      setLoading(true);                       // start
      const res = await fetch("/api/threats");
      if (!res.ok) throw new Error("Failed to load threats");
      const result = await res.json();
      setThreats(result.data || []);
    } catch (err) {
      console.error("Error loading threats:", err);
    } finally {
      setLoading(false);                      // stop
    }
  }
  loadThreats();
}, []);



  // Set mounted flag to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (Array.isArray(threats)) {
      const filtered = threats.filter((threat) => {
        const matchesSearch =
          (threat.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (threat.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (threat.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (threat.source || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (threat.threat_id || "").toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = !filters.status || (threat.status || "").toLowerCase() === filters.status.toLowerCase()
        const matchesThreatLevel =
          !filters.threatLevel || (threat.threat_level || "").toLowerCase() === filters.threatLevel.toLowerCase()
        const matchesCategory =
          !filters.category || (threat.category || "").toLowerCase() === filters.category.toLowerCase()
        const matchesSource = !filters.source || (threat.source || "").toLowerCase() === filters.source.toLowerCase()

        let matchesDateRange = true
        if (filters.dateRange && threat.created_at) {
          try {
            const threatDate = new Date(threat.created_at)
            const now = new Date()
            const daysAgo = Number.parseInt(filters.dateRange)
            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
            matchesDateRange = threatDate >= cutoffDate
          } catch (error) {
            console.error("Error parsing date:", error)
            matchesDateRange = true
          }
        }

        return (
          matchesSearch && matchesStatus && matchesThreatLevel && matchesCategory && matchesSource && matchesDateRange
        )
      })
      setFilteredThreats(filtered)
    }
  }, [searchTerm, threats, filters])

  const handleEdit = (threat: Threat) => {
    setEditingThreat(threat)
    setIsDialogOpen(true)
  }

  const handleView = (threat: Threat) => {
    setViewingThreat(threat)
    setIsViewDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      const result = await deleteThreat(deleteId)
      if (result.success) {
        loadThreats()
        setDeleteId(null)
      }
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingThreat(null)
    loadThreats()
  }

  const clearFilters = () => {
    setFilters({
      status: "",
      threatLevel: "",
      category: "",
      source: "",
      dateRange: "",
    })
    setSearchTerm("")
  }

  const exportToCSV = () => {
    const headers = ["Threat ID", "Name", "Category", "Source", "Threat Level", "Status", "Description", "Created Date"]
    const csvContent = [
      headers.join(","),
      ...filteredThreats.map((threat) =>
        [
          threat.threat_id || "",
          `"${(threat.name || "").replace(/"/g, '""')}"`,
          threat.category || "",
          threat.source || "",
          threat.threat_level || "",
          threat.status || "",
          `"${(threat.description || "").replace(/"/g, '""')}"`,
          threat.created_at ? new Date(threat.created_at).toLocaleDateString() : "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `threats-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getThreatLevelBadge = (level: string) => {
    if (!level) return <Badge variant="outline">Unknown</Badge>

    const variants: Record<string, "text-blue-900" | "text-yellow-600" | "text-red-500" | "text-purple-900"> = {
      critical: "text-red-500",
      high: "text-red-500",
      medium: "text-yellow-600",
      low: "text-purple-900",
    }
    return <Badge variant="outline" className={variants[level.toLowerCase()] || "text-blue-900"}>{level}</Badge>
  }

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>

    const variants: Record<string, "text-blue-500" | "text-yellow-900" | "text-red-500" | "text-green-900"> = {
      active: "text-red-500",
      monitoring: "text-yellow-900",
      mitigated: "text-blue-500",
      resolved: "text-green-900",
    }
    return <Badge variant="outline" className={variants[status.toLowerCase()] || "default"}>{status}</Badge>
  }

  // Dashboard calculations
  const metrics = {
    total: Array.isArray(threats) ? threats.length : 0,
    critical: Array.isArray(threats)
      ? threats.filter((t) => (t.threat_level || "").toLowerCase() === "critical").length
      : 0,
    high: Array.isArray(threats) ? threats.filter((t) => (t.threat_level || "").toLowerCase() === "high").length : 0,
    medium: Array.isArray(threats)
      ? threats.filter((t) => (t.threat_level || "").toLowerCase() === "medium").length
      : 0,
    low: Array.isArray(threats) ? threats.filter((t) => (t.threat_level || "").toLowerCase() === "low").length : 0,
    active: Array.isArray(threats) ? threats.filter((t) => (t.status || "").toLowerCase() === "active").length : 0,
    monitoring: Array.isArray(threats)
      ? threats.filter((t) => (t.status || "").toLowerCase() === "monitoring").length
      : 0,
    mitigated: Array.isArray(threats)
      ? threats.filter((t) => (t.status || "").toLowerCase() === "mitigated").length
      : 0,
    resolved: Array.isArray(threats) ? threats.filter((t) => (t.status || "").toLowerCase() === "resolved").length : 0,
  }

  // Chart data
  const categoryData = Array.isArray(threats)
    ? Object.entries(
        threats.reduce(
          (acc, threat) => {
            const category = threat.category || "Uncategorized"
            acc[category] = (acc[category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      ).map(([name, value]) => ({ name, value }))
    : []

  const threatLevelData = [
    { name: "Critical", value: metrics.critical, color: "#ef4444" },
    { name: "High", value: metrics.high, color: "#f97316" },
    { name: "Medium", value: metrics.medium, color: "#eab308" },
    { name: "Low", value: metrics.low, color: "#22c55e" },
  ].filter((item) => item.value > 0)

  const statusData = [
    { name: "Active", value: metrics.active },
    { name: "Monitoring", value: metrics.monitoring },
    { name: "Mitigated", value: metrics.mitigated },
    { name: "Resolved", value: metrics.resolved },
  ].filter((item) => item.value > 0)

  // Trend data (last 7 days) - Fixed date handling
  const trendData = Array.isArray(threats)
    ? Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const dateStr = date.toISOString().split("T")[0]
        const count = threats.filter((threat) => {
          if (!threat.created_at) return false
          try {
            const threatDateStr = new Date(threat.created_at).toISOString().split("T")[0]
            return threatDateStr === dateStr
          } catch (error) {
            console.error("Error parsing threat date:", error)
            return false
          }
        }).length
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          threats: count,
        }
      })
    : []

  // Get unique values for filters
  const uniqueCategories = Array.from(new Set(threats.map((t) => t.category).filter(Boolean)))
  const uniqueSources = Array.from(new Set(threats.map((t) => t.source).filter(Boolean)))

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== "") || searchTerm !== ""

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  // Prevent hydration issues by showing loading state until component is mounted
  if (!mounted) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-white">Initializing...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold  animate-pulse">
                    Threat Register
                  </h1>
                  <p className="text-slate-400">Manage and track security threats across your organization</p>
                </div>
                <Button
                  onClick={() => setShowDashboard(!showDashboard)}
                >
                  {showDashboard ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                  {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
                </Button>
              </div>
            </div>

            {/* Dashboard Section */}
            {showDashboard && (
              <div className="space-y-6">
                {/* Metrics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-bold">Total Threats</CardTitle>
                      <Shield className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{metrics.total}</div>
                      <p className="text-xs text-slate-400">All identified threats</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-bold">Critical Threats</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-400">{metrics.critical}</div>
                      <p className="text-xs text-slate-400">Require immediate attention</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-bold">High Priority</CardTitle>
                      <Zap className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-400">{metrics.high}</div>
                      <p className="text-xs text-slate-400">High priority threats</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-lg font-bold">Active Threats</CardTitle>
                      <Activity className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-400">{metrics.active}</div>
                      <p className="text-xs text-slate-400">Currently active</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Threat Level Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Threat Level Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={threatLevelData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {threatLevelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "6px",
                              color: "#fff",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Category Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={categoryData.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "6px",
                              color: "#fff",
                            }}
                          />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Threat Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        7-Day Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                          <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "6px",
                              color: "#fff",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="threats"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ fill: "#8b5cf6" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Status Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{metrics.active}</div>
                        <div className="text-sm text-slate-400">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{metrics.monitoring}</div>
                        <div className="text-sm text-slate-400">Monitoring</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{metrics.mitigated}</div>
                        <div className="text-sm text-slate-400">Mitigated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{metrics.resolved}</div>
                        <div className="text-sm text-slate-400">Resolved</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search threats by name, description, category, source, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-500">Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="mitigated">Mitigated</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Threat Level</Label>
                    <Select
                      value={filters.threatLevel}
                      onValueChange={(value) => setFilters({ ...filters, threatLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Source</Label>
                    <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Sources</SelectItem>
                        {uniqueSources.map((source) => (
                          <SelectItem key={source} value={source.toLowerCase()}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Date Range</Label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Actions</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportToCSV}
                        
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-600">
                    <span className="text-sm text-slate-400">Active filters:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        Search: {searchTerm}
                      </Badge>
                    )}
                    {filters.status && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        Status: {filters.status}
                      </Badge>
                    )}
                    {filters.threatLevel && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        Level: {filters.threatLevel}
                      </Badge>
                    )}
                    {filters.category && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        Category: {filters.category}
                      </Badge>
                    )}
                    {filters.source && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        Source: {filters.source}
                      </Badge>
                    )}
                    {filters.dateRange && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        Date: Last {filters.dateRange} days
                      </Badge>
                    )}
                  </div>
                )}

                {/* Results Counter */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-slate-400">
                    Showing {filteredThreats.length} of {threats.length} threats
                  </span>
                  {mounted && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>   Add Threat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingThreat ? "Edit Threat" : "Add New Threat"}
                          </DialogTitle>
                        </DialogHeader>
                        <ThreatForm threat={editingThreat} onClose={handleDialogClose} />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Threats Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Threat Register</CardTitle>
                <CardDescription>Manage and track security threats</CardDescription>
              </CardHeader>
              <CardContent>
                {Array.isArray(filteredThreats) && filteredThreats.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="truncate">Threat ID</TableHead>
                        <TableHead className="truncate">Name</TableHead>
                        <TableHead className="truncate">Category</TableHead>
                        <TableHead className="truncate">Source</TableHead>
                        <TableHead className="truncate">Threat Level</TableHead>
                        <TableHead className="truncate">Status</TableHead>
                        <TableHead className="truncate text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredThreats.map((threat, index) => (
                        <TableRow key={`${threat.id ?? 'noid'}-${threat.threat_id ?? 'nothreat'}-${index}`}>
                          <TableCell className="font-medium text-xs truncate">
                            {threat.threat_id || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{threat.name || "Unnamed Threat"}</div>
                              <div className="text-sm truncate max-w-xs">
                                {threat.description || "No description"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{threat.category || "Uncategorized"}</TableCell>
                          <TableCell>{threat.source || "Unknown"}</TableCell>
                          <TableCell>{getThreatLevelBadge(threat.threat_level)}</TableCell>
                          <TableCell>{getStatusBadge(threat.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(threat)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(threat)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteId(threat.id)}
                                    className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Threat</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-300">
                                      Are you sure you want to delete this threat? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-800 border-slate-600 text-slate-300">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteConfirm}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {hasActiveFilters ? "No threats match your filters" : "No threats found"}
                    </h3>
                    <p className="text-slate-400">
                      {hasActiveFilters
                        ? "Try adjusting your search criteria or clearing filters."
                        : "Get started by adding your first threat."}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="mt-4 border-slate-600 text-slate-300 bg-transparent"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* View Threat Dialog */}
      {mounted && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Threat Details</DialogTitle>
          </DialogHeader>
          {viewingThreat && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-500">Threat ID</Label>
                      <p className="font-mono">{viewingThreat.threat_id || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">Name</Label>
                      <p>{viewingThreat.name || "Unnamed Threat"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Description</Label>
                    <p>{viewingThreat.description || "No description available"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Classification */}
              <Card>
                <CardHeader>
                  <CardTitle>Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-500">Category</Label>
                      <p className="capitalize">{viewingThreat.category || "Uncategorized"}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">Source</Label>
                      <p className="capitalize">{viewingThreat.source || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-500">Threat Level</Label>
                      <div className="mt-1">{getThreatLevelBadge(viewingThreat.threat_level)}</div>
                    </div>
                    <div>
                      <Label className="text-slate-500">Status</Label>
                      <div className="mt-1">{getStatusBadge(viewingThreat.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Threat Intelligence */}
              <Card>
                <CardHeader>
                  <CardTitle>Threat Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-500">Indicators of Compromise</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(viewingThreat.indicators_of_compromise) &&
                      viewingThreat.indicators_of_compromise.length > 0 ? (
                        viewingThreat.indicators_of_compromise.map((ioc, index) => (
                          <Badge key={`view-ioc-${index}`} variant="secondary">
                            {ioc}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm">No indicators of compromise recorded</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Mitigation Strategies</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(viewingThreat.mitigation_strategies) &&
                      viewingThreat.mitigation_strategies.length > 0 ? (
                        viewingThreat.mitigation_strategies.map((strategy, index) => (
                          <Badge key={`view-strategy-${index}`} variant="secondary">
                            {strategy}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm">No mitigation strategies recorded</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500">References</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(viewingThreat.threat_references) && viewingThreat.threat_references.length > 0 ? (
                        viewingThreat.threat_references.map((reference, index) => (
                          <Badge key={`view-reference-${index}`} variant="secondary">
                            {reference}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm">No references recorded</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Associated Risks */}
              <Card>
                <CardHeader>
                  <CardTitle>Associated Risks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-500">Linked Risks</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(viewingThreat.associated_risks) && viewingThreat.associated_risks.length > 0 ? (
                        viewingThreat.associated_risks.map((risk) => (
                          <Badge
                            key={risk.uniqueId}
                            variant="secondary"
                            className={`flex items-center gap-1 ${
                              risk.source === "ISO27001" ? "bg-blue-100 text-blue-800 border-blue-200" :
                              risk.source === "NIST CSF" ? "bg-purple-100 text-purple-800 border-purple-200" :
                              risk.source === "FAIR" ? "bg-green-100 text-green-800 border-green-200" :
                              risk.source === "Technology" ? "bg-orange-100 text-orange-800 border-orange-200" :
                              risk.source === "Sphere AI" ? "bg-pink-100 text-pink-800 border-pink-200" :
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            <span className="truncate max-w-32">{risk.title}</span>
                            <span className="text-xs opacity-75">({risk.source})</span>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm">No associated risks</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Analysis */}
              {viewingThreat.impact_analysis && (
                  <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-400" />
                      Impact Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/30">
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                          {viewingThreat.impact_analysis}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risk Analysis */}
              {viewingThreat.risk_analysis && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/30">
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                          {viewingThreat.risk_analysis}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Threat Analysis */}
              {viewingThreat.threat_analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      AI Threat Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border border-slate-300 rounded-lg p-4 bg-gray-50">
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-500 leading-relaxed">
                          {viewingThreat.threat_analysis}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}
