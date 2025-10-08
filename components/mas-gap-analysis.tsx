"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react"

interface MASGapAnalysis {
  id: string
  domain: string
  requirement_id: string
  requirement_title: string
  current_state: string
  target_state: string
  gap_description: string
  business_impact: string
  priority_score: number
  implementation_effort: string
  estimated_cost: number
  estimated_timeline: string
  responsible_party: string
  mitigation_strategy: string
  risk_if_not_addressed: string
  status: string
  created_at: string
  updated_at: string
}

interface MASGapStats {
  total: number
  critical: number
  high: number
  medium: number
  low: number
  totalCost: number
  avgPriority: number
}

export function MASGapAnalysis() {
  const [gapAnalyses, setGapAnalyses] = useState<MASGapAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [domainFilter, setDomainFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedGap, setSelectedGap] = useState<MASGapAnalysis | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newGap, setNewGap] = useState({
    domain: "",
    requirement_id: "",
    requirement_title: "",
    current_state: "",
    target_state: "",
    gap_description: "",
    business_impact: "",
    priority_score: 5,
    implementation_effort: "",
    estimated_cost: 0,
    estimated_timeline: "",
    responsible_party: "",
    mitigation_strategy: "",
    risk_if_not_addressed: "",
  })

  const domains = [
    "Technology Risk Management",
    "Cyber Hygiene",
    "Outsourcing",
    "Business Continuity Management",
    "Data Governance",
    "Cloud Computing",
    "Operational Risk Management",
    "Third Party Risk Management",
    "Incident Management",
    "Access Management",
  ]

  const businessImpacts = [
    "Critical - Business operations severely affected",
    "High - Significant impact on business operations",
    "Medium - Moderate impact on business operations",
    "Low - Minimal impact on business operations",
  ]

  const implementationEfforts = [
    "Low - Less than 1 month",
    "Medium - 1-6 months",
    "High - 6-12 months",
    "Very High - More than 12 months",
  ]

  const statuses = ["Identified", "Under Review", "Approved for Remediation", "In Progress", "Completed", "Deferred"]

  useEffect(() => {
    fetchGapAnalyses()
  }, [])

  const fetchGapAnalyses = async () => {
    try {
      const response = await fetch("/api/mas-gap-analysis")
      if (response.ok) {
        const data = await response.json()
        setGapAnalyses(data)
      }
    } catch (error) {
      console.error("Error fetching MAS gap analyses:", error)
      toast({
        title: "Error",
        description: "Failed to fetch gap analyses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGap = async () => {
    try {
      const gapData = {
        ...newGap,
        status: "Identified",
      }

      const response = await fetch("/api/mas-gap-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gapData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Gap analysis created successfully",
        })
        setIsCreateDialogOpen(false)
        setNewGap({
          domain: "",
          requirement_id: "",
          requirement_title: "",
          current_state: "",
          target_state: "",
          gap_description: "",
          business_impact: "",
          priority_score: 5,
          implementation_effort: "",
          estimated_cost: 0,
          estimated_timeline: "",
          responsible_party: "",
          mitigation_strategy: "",
          risk_if_not_addressed: "",
        })
        fetchGapAnalyses()
      } else {
        throw new Error("Failed to create gap analysis")
      }
    } catch (error) {
      console.error("Error creating gap analysis:", error)
      toast({
        title: "Error",
        description: "Failed to create gap analysis",
        variant: "destructive",
      })
    }
  }

  const getPriorityBadge = (score: number) => {
    if (score >= 9) return <Badge className="bg-red-100 text-red-800">Critical ({score})</Badge>
    if (score >= 7) return <Badge className="bg-orange-100 text-orange-800">High ({score})</Badge>
    if (score >= 5) return <Badge className="bg-yellow-100 text-yellow-800">Medium ({score})</Badge>
    return <Badge className="bg-green-100 text-green-800">Low ({score})</Badge>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Identified: { color: "bg-blue-100 text-blue-800" },
      "Under Review": { color: "bg-yellow-100 text-yellow-800" },
      "Approved for Remediation": { color: "bg-purple-100 text-purple-800" },
      "In Progress": { color: "bg-orange-100 text-orange-800" },
      Completed: { color: "bg-green-100 text-green-800" },
      Deferred: { color: "bg-gray-100 text-gray-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Identified"]
    return <Badge className={config.color}>{status}</Badge>
  }

  const filteredGaps = gapAnalyses.filter((gap) => {
    const matchesSearch =
      gap.requirement_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gap.requirement_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gap.gap_description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = domainFilter === "all" || gap.domain === domainFilter
    const matchesPriority =
      priorityFilter === "all" ||
      (priorityFilter === "critical" && gap.priority_score >= 9) ||
      (priorityFilter === "high" && gap.priority_score >= 7 && gap.priority_score < 9) ||
      (priorityFilter === "medium" && gap.priority_score >= 5 && gap.priority_score < 7) ||
      (priorityFilter === "low" && gap.priority_score < 5)
    return matchesSearch && matchesDomain && matchesPriority
  })

  const getGapStats = (): MASGapStats => {
    const total = gapAnalyses.length
    const critical = gapAnalyses.filter((gap) => gap.priority_score >= 9).length
    const high = gapAnalyses.filter((gap) => gap.priority_score >= 7 && gap.priority_score < 9).length
    const medium = gapAnalyses.filter((gap) => gap.priority_score >= 5 && gap.priority_score < 7).length
    const low = gapAnalyses.filter((gap) => gap.priority_score < 5).length
    const totalCost = gapAnalyses.reduce((sum, gap) => sum + gap.estimated_cost, 0)
    const avgPriority = total > 0 ? gapAnalyses.reduce((sum, gap) => sum + gap.priority_score, 0) / total : 0

    return { total, critical, high, medium, low, totalCost, avgPriority }
  }

  const stats = getGapStats()

  if (loading) {
    return (
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Total Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Identified gaps</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-warning border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Priority 9-10</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-accent border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              High
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            <p className="text-xs text-muted-foreground">Priority 7-8</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-secondary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
              Medium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <p className="text-xs text-muted-foreground">Priority 5-6</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-accent border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Low
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.low}</div>
            <p className="text-xs text-muted-foreground">Priority 1-4</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">S${stats.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated remediation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                MAS Gap Analysis
              </CardTitle>
              <CardDescription>Identify and analyze compliance gaps against MAS requirements</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Gap Analysis
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Add Gap Analysis</DialogTitle>
                  <DialogDescription>Create a new gap analysis for MAS compliance requirements</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Select value={newGap.domain} onValueChange={(value) => setNewGap({ ...newGap, domain: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirement_id">Requirement ID</Label>
                    <Input
                      id="requirement_id"
                      value={newGap.requirement_id}
                      onChange={(e) => setNewGap({ ...newGap, requirement_id: e.target.value })}
                      placeholder="Enter requirement ID"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="requirement_title">Requirement Title</Label>
                    <Input
                      id="requirement_title"
                      value={newGap.requirement_title}
                      onChange={(e) => setNewGap({ ...newGap, requirement_title: e.target.value })}
                      placeholder="Enter requirement title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_state">Current State</Label>
                    <Textarea
                      id="current_state"
                      value={newGap.current_state}
                      onChange={(e) => setNewGap({ ...newGap, current_state: e.target.value })}
                      placeholder="Describe current state"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_state">Target State</Label>
                    <Textarea
                      id="target_state"
                      value={newGap.target_state}
                      onChange={(e) => setNewGap({ ...newGap, target_state: e.target.value })}
                      placeholder="Describe target state"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="gap_description">Gap Description</Label>
                    <Textarea
                      id="gap_description"
                      value={newGap.gap_description}
                      onChange={(e) => setNewGap({ ...newGap, gap_description: e.target.value })}
                      placeholder="Describe the identified gap"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_impact">Business Impact</Label>
                    <Select
                      value={newGap.business_impact}
                      onValueChange={(value) => setNewGap({ ...newGap, business_impact: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business impact" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessImpacts.map((impact) => (
                          <SelectItem key={impact} value={impact}>
                            {impact}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority_score">Priority Score (1-10)</Label>
                    <Input
                      id="priority_score"
                      type="number"
                      min="1"
                      max="10"
                      value={newGap.priority_score}
                      onChange={(e) => setNewGap({ ...newGap, priority_score: Number.parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="implementation_effort">Implementation Effort</Label>
                    <Select
                      value={newGap.implementation_effort}
                      onValueChange={(value) => setNewGap({ ...newGap, implementation_effort: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select implementation effort" />
                      </SelectTrigger>
                      <SelectContent>
                        {implementationEfforts.map((effort) => (
                          <SelectItem key={effort} value={effort}>
                            {effort}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_cost">Estimated Cost (SGD)</Label>
                    <Input
                      id="estimated_cost"
                      type="number"
                      value={newGap.estimated_cost}
                      onChange={(e) => setNewGap({ ...newGap, estimated_cost: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="Enter estimated cost"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_timeline">Estimated Timeline</Label>
                    <Input
                      id="estimated_timeline"
                      value={newGap.estimated_timeline}
                      onChange={(e) => setNewGap({ ...newGap, estimated_timeline: e.target.value })}
                      placeholder="e.g., 3-6 months"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible_party">Responsible Party</Label>
                    <Input
                      id="responsible_party"
                      value={newGap.responsible_party}
                      onChange={(e) => setNewGap({ ...newGap, responsible_party: e.target.value })}
                      placeholder="Enter responsible party"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="mitigation_strategy">Mitigation Strategy</Label>
                    <Textarea
                      id="mitigation_strategy"
                      value={newGap.mitigation_strategy}
                      onChange={(e) => setNewGap({ ...newGap, mitigation_strategy: e.target.value })}
                      placeholder="Describe mitigation strategy"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="risk_if_not_addressed">Risk if Not Addressed</Label>
                    <Textarea
                      id="risk_if_not_addressed"
                      value={newGap.risk_if_not_addressed}
                      onChange={(e) => setNewGap({ ...newGap, risk_if_not_addressed: e.target.value })}
                      placeholder="Describe risks if gap is not addressed"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGap}
                   
                  >
                    Create Gap Analysis
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gaps" className="space-y-4">
            <TabsList className="bg-black/50 backdrop-blur-sm">
              <TabsTrigger value="gaps">Gap Analyses</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="gaps" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search gap analyses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by domain" />
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
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical (9-10)</SelectItem>
                    <SelectItem value="high">High (7-8)</SelectItem>
                    <SelectItem value="medium">Medium (5-6)</SelectItem>
                    <SelectItem value="low">Low (1-4)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Gap Analyses Table */}
              <div className="border rounded-lg bg-black/50 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requirement</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Gap Description</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Business Impact</TableHead>
                      <TableHead>Cost (SGD)</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGaps.map((gap) => (
                      <TableRow key={gap.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{gap.requirement_id}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">{gap.requirement_title}</p>
                          </div>
                        </TableCell>
                        <TableCell>{gap.domain}</TableCell>
                        <TableCell>
                          <p className="text-sm truncate max-w-xs" title={gap.gap_description}>
                            {gap.gap_description}
                          </p>
                        </TableCell>
                        <TableCell>{getPriorityBadge(gap.priority_score)}</TableCell>
                        <TableCell>
                          <p className="text-xs truncate max-w-xs" title={gap.business_impact}>
                            {gap.business_impact}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">S${gap.estimated_cost.toLocaleString()}</p>
                        </TableCell>
                        <TableCell>{gap.estimated_timeline}</TableCell>
                        <TableCell>{getStatusBadge(gap.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedGap(gap)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Priority Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Critical (9-10)</span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={stats.total > 0 ? (stats.critical / stats.total) * 100 : 0}
                            className="w-20 h-2"
                          />
                          <span className="text-sm font-medium w-8">{stats.critical}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">High (7-8)</span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={stats.total > 0 ? (stats.high / stats.total) * 100 : 0}
                            className="w-20 h-2"
                          />
                          <span className="text-sm font-medium w-8">{stats.high}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medium (5-6)</span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}
                            className="w-20 h-2"
                          />
                          <span className="text-sm font-medium w-8">{stats.medium}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Low (1-4)</span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={stats.total > 0 ? (stats.low / stats.total) * 100 : 0}
                            className="w-20 h-2"
                          />
                          <span className="text-sm font-medium w-8">{stats.low}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Domain Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {domains.map((domain) => {
                        const count = gapAnalyses.filter((gap) => gap.domain === domain).length
                        const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                        return (
                          <div key={domain} className="flex items-center justify-between">
                            <span className="text-sm truncate max-w-xs" title={domain}>
                              {domain}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Gap Analysis Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Executive summary of all identified gaps and priorities
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Cost Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Financial impact analysis and budget planning</p>
                    <Button variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Implementation Roadmap</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Timeline and resource allocation for gap remediation
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Gap Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gap Analysis Details</DialogTitle>
            <DialogDescription>Detailed view of MAS compliance gap analysis</DialogDescription>
          </DialogHeader>
          {selectedGap && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Requirement ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.requirement_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Domain</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.domain}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Requirement Title</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.requirement_title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current State</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.current_state}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Target State</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.target_state}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Gap Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.gap_description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Business Impact</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.business_impact}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority Score</Label>
                  <div className="mt-1">{getPriorityBadge(selectedGap.priority_score)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Implementation Effort</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.implementation_effort}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estimated Cost</Label>
                  <p className="text-sm text-muted-foreground">S${selectedGap.estimated_cost.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estimated Timeline</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.estimated_timeline}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Responsible Party</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.responsible_party}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Mitigation Strategy</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.mitigation_strategy}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Risk if Not Addressed</Label>
                  <p className="text-sm text-muted-foreground">{selectedGap.risk_if_not_addressed}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedGap.status)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
