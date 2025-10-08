"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Building,
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw,
  FileText,
  Users,
  Lock,
  Network,
  Zap,
  Server,
  Filter,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NIS2GapAnalysis {
  id: number
  domain: string
  control_id: string
  control_name: string
  current_status: string
  target_status: string
  gap_severity: string
  business_impact: string
  implementation_effort: string
  estimated_cost: number
  timeline_months: number
  responsible_party: string
  dependencies: string
  risk_if_not_addressed: string
  priority_score: number
  created_at: string
  updated_at: string
}

export function NIS2GapAnalysis() {
  const [gapAnalysis, setGapAnalysis] = useState<NIS2GapAnalysis[]>([])
  const [filteredGaps, setFilteredGaps] = useState<NIS2GapAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [domainFilter, setDomainFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const domains = [
    "Risk Management",
    "Corporate Governance",
    "Cybersecurity Measures",
    "Network and Information Systems Security",
    "Incident Handling",
    "Business Continuity",
    "Supply Chain Security",
    "Security in Network and Information Systems Acquisition",
    "Policies on Vulnerability Disclosure",
    "Crisis Management",
  ]

  useEffect(() => {
    fetchGapAnalysis()
  }, [])

  useEffect(() => {
    filterGaps()
  }, [gapAnalysis, searchTerm, domainFilter, severityFilter, statusFilter])

  const fetchGapAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/nis2-gap-analysis")
      if (response.ok) {
        const data = await response.json()
        setGapAnalysis(data)
      }
    } catch (error) {
      console.error("Failed to fetch NIS2 gap analysis:", error)
      toast({
        title: "Error",
        description: "Failed to load NIS2 gap analysis",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterGaps = () => {
    let filtered = gapAnalysis

    if (searchTerm) {
      filtered = filtered.filter(
        (gap) =>
          gap.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gap.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gap.responsible_party.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (domainFilter !== "all") {
      filtered = filtered.filter((gap) => gap.domain === domainFilter)
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((gap) => gap.gap_severity === severityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((gap) => gap.current_status === statusFilter)
    }

    // Sort by priority score (highest first)
    filtered.sort((a, b) => b.priority_score - a.priority_score)

    setFilteredGaps(filtered)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Implemented":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Partially Implemented":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Not Implemented":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      case "Not Applicable":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Very High":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Risk Management":
        return <Shield className="h-4 w-4" />
      case "Corporate Governance":
        return <Building className="h-4 w-4" />
      case "Cybersecurity Measures":
        return <Lock className="h-4 w-4" />
      case "Network and Information Systems Security":
        return <Network className="h-4 w-4" />
      case "Incident Handling":
        return <AlertTriangle className="h-4 w-4" />
      case "Business Continuity":
        return <RefreshCw className="h-4 w-4" />
      case "Supply Chain Security":
        return <Users className="h-4 w-4" />
      case "Security in Network and Information Systems Acquisition":
        return <Server className="h-4 w-4" />
      case "Policies on Vulnerability Disclosure":
        return <FileText className="h-4 w-4" />
      case "Crisis Management":
        return <Zap className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getPriorityIcon = (score: number) => {
    if (score >= 8) return <AlertTriangle className="h-4 w-4 text-red-600" />
    if (score >= 6) return <AlertTriangle className="h-4 w-4 text-orange-600" />
    if (score >= 4) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  const criticalGaps = gapAnalysis.filter((g) => g.gap_severity === "Critical").length
  const highGaps = gapAnalysis.filter((g) => g.gap_severity === "High").length
  const totalCost = gapAnalysis.reduce((sum, g) => sum + g.estimated_cost, 0)
  const averageTimeline =
    gapAnalysis.length > 0
      ? Math.round(gapAnalysis.reduce((sum, g) => sum + g.timeline_months, 0) / gapAnalysis.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            NIS2 Gap Analysis
          </h2>
          <p className="text-muted-foreground">Identify and prioritize gaps in NIS2 security measures implementation</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchGapAnalysis}
          disabled={loading}
          className="border-green-200 hover:bg-green-50 bg-transparent"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Critical Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalGaps}</div>
            <p className="text-xs text-muted-foreground">Immediate attention required</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              High Priority Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highGaps}</div>
            <p className="text-xs text-muted-foreground">High priority items</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">EUR {totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated remediation cost</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Average Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageTimeline}</div>
            <p className="text-xs text-muted-foreground">Months to implement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="gradient-card-primary">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            NIS2 Security Measure Gaps
          </CardTitle>
          <CardDescription>Prioritized list of security measure implementation gaps</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by measure name, ID, or responsible party..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-green-200 focus:border-blue-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Current Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                  <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                  <SelectItem value="Implemented">Implemented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2">Loading gap analysis...</span>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-green-200/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-green-100/50 via-blue-100/50 to-purple-100/50">
                    <TableHead>Priority</TableHead>
                    <TableHead>Security Measure</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Gap Severity</TableHead>
                    <TableHead>Business Impact</TableHead>
                    <TableHead>Implementation Effort</TableHead>
                    <TableHead>Cost (EUR)</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Responsible Party</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGaps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No gaps found matching the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGaps.map((gap) => (
                      <TableRow
                        key={gap.id}
                        className="hover:bg-gradient-to-r hover:from-green-50/30 hover:via-blue-50/30 hover:to-purple-50/30"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(gap.priority_score)}
                            <span className="font-medium">{gap.priority_score}/10</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex items-center space-x-2">
                            {getDomainIcon(gap.domain)}
                            <div>
                              <Badge variant="outline" className="text-xs mb-1">
                                {gap.control_id}
                              </Badge>
                              <div className="font-medium text-sm">{gap.control_name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{gap.domain}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(gap.current_status)}>{gap.current_status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(gap.gap_severity)}>{gap.gap_severity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getImpactColor(gap.business_impact)}>{gap.business_impact}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getEffortColor(gap.implementation_effort)}>
                            {gap.implementation_effort}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{gap.estimated_cost.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{gap.timeline_months} months</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{gap.responsible_party || "Unassigned"}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Summary */}
      <Card className="gradient-card-secondary">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gap Analysis by Domain
          </CardTitle>
          <CardDescription>Summary of gaps across NIS2 security domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain) => {
              const domainGaps = gapAnalysis.filter((g) => g.domain === domain)
              const criticalCount = domainGaps.filter((g) => g.gap_severity === "Critical").length
              const highCount = domainGaps.filter((g) => g.gap_severity === "High").length
              const domainCost = domainGaps.reduce((sum, g) => sum + g.estimated_cost, 0)

              return (
                <Card key={domain} className="border-purple-200/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      {getDomainIcon(domain)}
                      <CardTitle className="text-sm">{domain}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Total Gaps:</span>
                      <span className="font-medium">{domainGaps.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-600">Critical:</span>
                      <span className="font-medium">{criticalCount}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-orange-600">High:</span>
                      <span className="font-medium">{highCount}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600">Investment:</span>
                      <span className="font-medium">EUR {domainCost.toLocaleString()}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs mt-2 bg-transparent"
                      onClick={() => setDomainFilter(domain)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
