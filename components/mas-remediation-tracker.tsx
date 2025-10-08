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
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
} from "lucide-react"
import OwnerSelectInput from "@/components/owner-search-input"

interface MASRemediationItem {
  id: string
  assessment_id?: string
  finding_id: string
  title: string
  description: string
  domain: string
  risk_level: string
  priority: string
  status: string
  assigned_to: string
  due_date: string
  completion_date?: string
  estimated_cost: number
  actual_cost?: number
  remediation_plan: string
  verification_status: string
  verification_evidence?: string
  created_at: string
  updated_at: string
}

interface MASRemediationStats {
  total: number
  completed: number
  inProgress: number
  overdue: number
  totalCost: number
  avgCompletionTime: number
}

export function MASRemediationTracker({ assessmentId }: { assessmentId?: string }) {
  const [remediationItems, setRemediationItems] = useState<MASRemediationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MASRemediationItem | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newItem, setNewItem] = useState({
    finding_id: "",
    title: "",
    description: "",
    domain: "",
    risk_level: "",
    priority: "",
    assigned_to: "",
    due_date: "",
    estimated_cost: 0,
    remediation_plan: "",
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

  const riskLevels = ["High", "Medium", "Low"]
  const priorities = ["Critical", "High", "Medium", "Low"]
  const statuses = ["Open", "In Progress", "Under Review", "Completed", "Verified", "Closed"]

  useEffect(() => {
    fetchRemediationItems()
  }, [assessmentId])

  const fetchRemediationItems = async () => {
    try {
      const url = assessmentId ? `/api/mas-remediation?assessment_id=${assessmentId}` : "/api/mas-remediation"

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRemediationItems(data)
      }
    } catch (error) {
      console.error("Error fetching MAS remediation items:", error)
      toast({
        title: "Error",
        description: "Failed to fetch remediation items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateItem = async () => {
    try {
      const itemData = {
        ...newItem,
        assessment_id: assessmentId,
        status: "Open",
        verification_status: "Pending",
      }

      const response = await fetch("/api/mas-remediation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Remediation item created successfully",
        })
        setIsCreateDialogOpen(false)
        setNewItem({
          finding_id: "",
          title: "",
          description: "",
          domain: "",
          risk_level: "",
          priority: "",
          assigned_to: "",
          due_date: "",
          estimated_cost: 0,
          remediation_plan: "",
        })
        fetchRemediationItems()
      } else {
        throw new Error("Failed to create remediation item")
      }
    } catch (error) {
      console.error("Error creating remediation item:", error)
      toast({
        title: "Error",
        description: "Failed to create remediation item",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Open: { color: "bg-red-100 text-red-800", label: "Open" },
      "In Progress": { color: "bg-blue-100 text-blue-800", label: "In Progress" },
      "Under Review": { color: "bg-yellow-100 text-yellow-800", label: "Under Review" },
      Completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      Verified: { color: "bg-green-100 text-green-800", label: "Verified" },
      Closed: { color: "bg-gray-100 text-gray-800", label: "Closed" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Open"]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      Critical: { color: "bg-red-100 text-red-800", label: "Critical" },
      High: { color: "bg-orange-100 text-orange-800", label: "High" },
      Medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      Low: { color: "bg-green-100 text-green-800", label: "Low" },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig["Medium"]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Completed" || status === "Verified" || status === "Closed") return false
    return new Date(dueDate) < new Date()
  }

  const filteredItems = remediationItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.finding_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getRemediationStats = (): MASRemediationStats => {
    const total = remediationItems.length
    const completed = remediationItems.filter((item) =>
      ["Completed", "Verified", "Closed"].includes(item.status),
    ).length
    const inProgress = remediationItems.filter((item) => ["In Progress", "Under Review"].includes(item.status)).length
    const overdue = remediationItems.filter((item) => isOverdue(item.due_date, item.status)).length
    const totalCost = remediationItems.reduce((sum, item) => sum + (item.actual_cost || item.estimated_cost), 0)
    const avgCompletionTime = 0 // Calculate based on completion dates

    return { total, completed, inProgress, overdue, totalCost, avgCompletionTime }
  }

  const stats = getRemediationStats()

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Remediation items</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-secondary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card-accent border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active remediation</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-warning border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-accent border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">S${stats.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated + actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                MAS Remediation Tracking
              </CardTitle>
              <CardDescription>Track and manage remediation actions for MAS compliance findings</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Remediation Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Remediation Item</DialogTitle>
                  <DialogDescription>Create a new remediation item for MAS compliance findings</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finding_id">Finding ID</Label>
                    <Input
                      id="finding_id"
                      value={newItem.finding_id}
                      onChange={(e) => setNewItem({ ...newItem, finding_id: e.target.value })}
                      placeholder="Enter finding ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Select value={newItem.domain} onValueChange={(value) => setNewItem({ ...newItem, domain: value })}>
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
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      placeholder="Enter remediation title"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Enter detailed description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="risk_level">Risk Level</Label>
                    <Select
                      value={newItem.risk_level}
                      onValueChange={(value) => setNewItem({ ...newItem, risk_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        {riskLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newItem.priority}
                      onValueChange={(value) => setNewItem({ ...newItem, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Assigned To</Label>
                    <OwnerSelectInput formData={newItem} setFormData={setNewItem} fieldName="assigned_to"/>
                    {/* <Input
                      id="assigned_to"
                      value={newItem.assigned_to}
                      onChange={(e) => setNewItem({ ...newItem, assigned_to: e.target.value })}
                      placeholder="Enter assignee name"
                    /> */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newItem.due_date}
                      onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_cost">Estimated Cost (SGD)</Label>
                    <Input
                      id="estimated_cost"
                      type="number"
                      value={newItem.estimated_cost}
                      onChange={(e) =>
                        setNewItem({ ...newItem, estimated_cost: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Enter estimated cost"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="remediation_plan">Remediation Plan</Label>
                    <Textarea
                      id="remediation_plan"
                      value={newItem.remediation_plan}
                      onChange={(e) => setNewItem({ ...newItem, remediation_plan: e.target.value })}
                      placeholder="Enter remediation plan details"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateItem}
                    
                  >
                    Create Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="items" className="space-y-4">
            <TabsList className="bg-black/50 backdrop-blur-sm">
              <TabsTrigger value="items">Remediation Items</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search remediation items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Remediation Items Table */}
              <div className="border rounded-lg bg-black/50 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Finding ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Cost (SGD)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className={isOverdue(item.due_date, item.status) ? "bg-red-50/10" : ""}>
                        <TableCell className="font-medium">{item.finding_id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.domain}</TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(item.status)}
                            {isOverdue(item.due_date, item.status) && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.assigned_to}</TableCell>
                        <TableCell>
                          <div className={isOverdue(item.due_date, item.status) ? "text-red-600 font-medium" : ""}>
                            {new Date(item.due_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              S${(item.actual_cost || item.estimated_cost).toLocaleString()}
                            </p>
                            {item.actual_cost && (
                              <p className="text-xs text-muted-foreground">
                                Est: S${item.estimated_cost.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item)
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
                      <span>Status Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {statuses.map((status) => {
                        const count = remediationItems.filter((item) => item.status === status).length
                        const percentage = remediationItems.length > 0 ? (count / remediationItems.length) * 100 : 0
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-sm">{status}</span>
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

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Priority Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {priorities.map((priority) => {
                        const count = remediationItems.filter((item) => item.priority === priority).length
                        const percentage = remediationItems.length > 0 ? (count / remediationItems.length) * 100 : 0
                        return (
                          <div key={priority} className="flex items-center justify-between">
                            <span className="text-sm">{priority}</span>
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
                      <span>Remediation Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Executive summary of all remediation activities
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Progress Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Detailed progress tracking and timeline analysis
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Cost Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Financial impact and cost breakdown analysis</p>
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

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Remediation Item Details</DialogTitle>
            <DialogDescription>Detailed view of MAS remediation item</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Finding ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.finding_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Domain</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.domain}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.title}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Risk Level</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.risk_level}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedItem.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.assigned_to}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <p
                    className={`text-sm ${isOverdue(selectedItem.due_date, selectedItem.status) ? "text-red-600 font-medium" : "text-muted-foreground"}`}
                  >
                    {new Date(selectedItem.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estimated Cost</Label>
                  <p className="text-sm text-muted-foreground">S${selectedItem.estimated_cost.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Remediation Plan</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.remediation_plan}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Verification Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.verification_status}</p>
                </div>
                {selectedItem.completion_date && (
                  <div>
                    <Label className="text-sm font-medium">Completion Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedItem.completion_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
