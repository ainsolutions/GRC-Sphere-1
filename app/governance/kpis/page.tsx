"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Target,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Calendar,
  Users,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Loader2,
} from "lucide-react"

// Interface for governance KPI data from API
interface GovernanceKPI {
  id: number
  name: string
  description: string
  target_value: string
  current_value: string
  unit: string
  category: string
  framework: string
  status: string
  trend: string
  measurement_frequency: string
  owner: string
  department: string
  calculation_method: string
  data_source: string
  last_updated: string
  next_review_date: string
  created_at: string
  updated_at: string
}

const categories = ["All", "Security", "Compliance", "Risk", "Governance", "Response", "Remediation", "Training"]
const frameworks = ["All", "ISO 27001", "NIST CSF", "COSO", "COBIT", "Internal"]
const statuses = ["All", "active", "inactive", "deprecated"]

export default function GovernanceKPIs() {
  const [kpis, setKpis] = useState<GovernanceKPI[]>([])
  const [filteredKpis, setFilteredKpis] = useState<GovernanceKPI[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedFramework, setSelectedFramework] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingKpi, setEditingKpi] = useState<GovernanceKPI | null>(null)
  const { toast } = useToast()

  // Fetch KPIs from API
  const fetchKPIs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "All") params.append("category", selectedCategory)
      if (selectedStatus !== "All") params.append("status", selectedStatus)
      if (selectedFramework !== "All") params.append("framework", selectedFramework)

      const response = await fetch(`/api/governance/kpis?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setKpis(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch KPIs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch KPIs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch KPIs on component mount and when filters change
  useEffect(() => {
    fetchKPIs()
  }, [selectedCategory, selectedFramework, selectedStatus])

  // Filter KPIs based on search (other filters are handled by API)
  useEffect(() => {
    let filtered = kpis.filter(kpi => {
      const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           kpi.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
    setFilteredKpis(filtered)
  }, [kpis, searchTerm])

  const handleCreateKpi = async (kpiData: any) => {
    try {
      const response = await fetch('/api/governance/kpis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kpiData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchKPIs() // Refresh the KPIs list
    setIsCreateDialogOpen(false)
    toast({
      title: "KPI Created",
      description: "New KPI has been successfully created.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create KPI",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating KPI:", error)
      toast({
        title: "Error",
        description: "Failed to create KPI",
        variant: "destructive",
      })
    }
  }

  const handleEditKpi = async (kpiData: any) => {
    if (!editingKpi) return

    try {
      const response = await fetch(`/api/governance/kpis/${editingKpi.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kpiData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchKPIs() // Refresh the KPIs list
    setIsEditDialogOpen(false)
    setEditingKpi(null)
    toast({
      title: "KPI Updated",
      description: "KPI has been successfully updated.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update KPI",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating KPI:", error)
      toast({
        title: "Error",
        description: "Failed to update KPI",
        variant: "destructive",
      })
    }
  }

  const handleDeleteKpi = async (id: number) => {
    try {
      const response = await fetch(`/api/governance/kpis/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchKPIs() // Refresh the KPIs list
    toast({
      title: "KPI Deleted",
      description: "KPI has been successfully deleted.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete KPI",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting KPI:", error)
      toast({
        title: "Error",
        description: "Failed to delete KPI",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "deprecated": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <ArrowUp className="h-4 w-4 text-green-500" />
      case "declining": return <ArrowDown className="h-4 w-4 text-red-500" />
      case "stable": return <Activity className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Key Performance Indicators
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor and track governance performance metrics
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Add KPI
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New KPI</DialogTitle>
                  <DialogDescription>
                    Add a new key performance indicator to track governance metrics.
                  </DialogDescription>
                </DialogHeader>
                <KPIForm onSubmit={handleCreateKpi} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search KPIs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchKPIs}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Performance Indicators ({filteredKpis.length})
                    </CardTitle>
            <CardDescription>
              Monitor and track governance performance metrics
                    </CardDescription>
              </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading KPIs...</span>
                  </div>
            ) : filteredKpis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No KPIs found. Try adjusting your filters or create a new KPI.
                  </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Target Value</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Framework</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKpis.map((kpi) => {
                      const currentValue = parseFloat(kpi.current_value)
                      const targetValue = parseFloat(kpi.target_value)
                      const progressPercentage = targetValue > 0 ? Math.round((currentValue / targetValue) * 100) : 0
                      
                      return (
                        <TableRow key={kpi.id}>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-semibold" title={kpi.name}>
                                {kpi.name}
                  </div>
                              <div className="text-sm text-gray-500 truncate" title={kpi.description}>
                                {kpi.description}
                </div>
                  </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{kpi.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-bold text-lg">
                                {kpi.current_value}
                  </div>
                </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-semibold">
                                {kpi.target_value}
                    </div>
                  </div>
                          </TableCell>
                          <TableCell className="text-sm">{kpi.unit}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(kpi.trend)}
                              <span className="text-sm capitalize">{kpi.trend}</span>
                </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(kpi.status)}>
                              {kpi.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{kpi.framework || 'N/A'}</TableCell>
                          <TableCell className="text-sm">{kpi.owner}</TableCell>
                          <TableCell className="text-sm">{kpi.department || 'N/A'}</TableCell>
                          <TableCell className="text-sm capitalize">{kpi.measurement_frequency}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(kpi.last_updated).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {kpi.next_review_date ? new Date(kpi.next_review_date).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                  <Button
                                variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingKpi(kpi)
                      setIsEditDialogOpen(true)
                    }}
                  >
                                <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                                variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKpi(kpi.id)}
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
            )}
              </CardContent>
            </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit KPI</DialogTitle>
              <DialogDescription>
                Update the key performance indicator details.
              </DialogDescription>
            </DialogHeader>
            <KPIForm 
              kpi={editingKpi || undefined} 
              onSubmit={handleEditKpi}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingKpi(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// KPI Form Component
function KPIForm({ kpi, onSubmit, onCancel }: { 
  kpi?: GovernanceKPI
  onSubmit: (data: any) => void
  onCancel?: () => void
}) {
  const [formData, setFormData] = useState({
    name: kpi?.name || "",
    description: kpi?.description || "",
    current_value: kpi?.current_value || "0",
    target_value: kpi?.target_value || "0",
    unit: kpi?.unit || "%",
    category: kpi?.category || "Security",
    framework: kpi?.framework || "ISO 27001",
    measurement_frequency: kpi?.measurement_frequency || "monthly",
    owner: kpi?.owner || "",
    department: kpi?.department || "",
    calculation_method: kpi?.calculation_method || "",
    data_source: kpi?.data_source || "",
    status: kpi?.status || "active",
    trend: kpi?.trend || "stable",
    next_review_date: kpi?.next_review_date || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">KPI Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="Risk">Risk</SelectItem>
              <SelectItem value="Governance">Governance</SelectItem>
              <SelectItem value="Response">Response</SelectItem>
              <SelectItem value="Remediation">Remediation</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="current_value">Current Value</Label>
          <Input
            id="current_value"
            value={formData.current_value}
            onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="target_value">Target Value</Label>
          <Input
            id="target_value"
            value={formData.target_value}
            onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="framework">Framework</Label>
          <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ISO 27001">ISO 27001</SelectItem>
              <SelectItem value="NIST CSF">NIST CSF</SelectItem>
              <SelectItem value="COSO">COSO</SelectItem>
              <SelectItem value="COBIT">COBIT</SelectItem>
              <SelectItem value="Internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="measurement_frequency">Measurement Frequency</Label>
          <Select value={formData.measurement_frequency} onValueChange={(value) => setFormData({ ...formData, measurement_frequency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="semi-annual">Semi-Annual</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="trend">Trend</Label>
          <Select value={formData.trend} onValueChange={(value) => setFormData({ ...formData, trend: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="improving">Improving</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="declining">Declining</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="calculation_method">Calculation Method</Label>
        <Textarea
          id="calculation_method"
          value={formData.calculation_method}
          onChange={(e) => setFormData({ ...formData, calculation_method: e.target.value })}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
      <div>
          <Label htmlFor="data_source">Data Source</Label>
        <Input
            id="data_source"
            value={formData.data_source}
            onChange={(e) => setFormData({ ...formData, data_source: e.target.value })}
          required
        />
        </div>
        <div>
          <Label htmlFor="next_review_date">Next Review Date</Label>
          <Input
            id="next_review_date"
            type="date"
            value={formData.next_review_date}
            onChange={(e) => setFormData({ ...formData, next_review_date: e.target.value })}
          />
        </div>
      </div>

      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {kpi ? "Update KPI" : "Create KPI"}
        </Button>
      </DialogFooter>
    </form>
  )
}

