"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Play,
  Settings,
  Activity,
  History,
} from "lucide-react"
import { PolicyVersionHistory } from "./policy-version-history"
import StarBorder from "@/app/StarBorder"

interface Policy {
  id: number
  policy_id: string
  title: string
  description: string
  content: string
  status: string
  version: string
  category_name: string
  category_color: string
  effective_date: string
  next_review_date: string
  tags: string[]
  created_at: string
  updated_at: string
}

interface Procedure {
  id: number
  procedure_id: string
  title: string
  description: string
  policy_id: number
  policy_title: string
  policy_code: string
  category_name: string
  category_color: string
  steps: any[]
  roles_responsibilities: any
  status: string
  version: string
  execution_count: number
  completed_executions: number
  active_executions: number
  last_execution: string
  created_at: string
  updated_at: string
}

interface ProcedureExecution {
  id: number
  execution_id: string
  procedure_id: number
  procedure_title: string
  procedure_code: string
  policy_title: string
  executed_by: number
  status: string
  started_at: string
  completed_at: string
  duration_minutes: number
  steps_completed: any[]
  notes: string
  evidence_files: any[]
  created_at: string
}

interface PolicyCategory {
  id: number
  name: string
  description: string
  color: string
  policy_count: number
}

interface DashboardData {
  stats: {
    total_policies: number
    published_policies: number
    draft_policies: number
    under_review_policies: number
    overdue_reviews: number
  }
  categoryDistribution: PolicyCategory[]
  recentActivities: any[]
  upcomingReviews: any[]
  acknowledgmentStats: any[]
}

export function PolicyManagementDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [procedureExecutions, setProcedureExecutions] = useState<ProcedureExecution[]>([])
  const [categories, setCategories] = useState<PolicyCategory[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateProcedureDialogOpen, setIsCreateProcedureDialogOpen] = useState(false)
  const [isExecuteProcedureDialogOpen, setIsExecuteProcedureDialogOpen] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null)
  const [selectedExecution, setSelectedExecution] = useState<ProcedureExecution | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isViewProcedureDialogOpen, setIsViewProcedureDialogOpen] = useState(false)
  const [isViewExecutionDialogOpen, setIsViewExecutionDialogOpen] = useState(false)

  // Form state for creating new policy
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
    status: "draft",
    effective_date: "",
    review_date: "",
    next_review_date: "",
    tags: "",
  })

  // Form state for creating new procedure
  const [newProcedure, setNewProcedure] = useState({
    title: "",
    description: "",
    policy_id: "",
    steps: "",
    roles_responsibilities: "",
    status: "draft",
  })

  // Form state for executing procedure
  const [newExecution, setNewExecution] = useState({
    procedure_id: "",
    notes: "",
  })

  useEffect(() => {
    fetchPolicies()
    fetchProcedures()
    fetchProcedureExecutions()
    fetchCategories()
    fetchDashboardData()
  }, [statusFilter, categoryFilter, searchTerm])

  const fetchPolicies = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/policies?${params}`)
      if (!response.ok) throw new Error("Failed to fetch policies")

      const data = await response.json()
      // Ensure we always set an array
      setPolicies(Array.isArray(data.policies) ? data.policies : [])
    } catch (error) {
      console.error("Error fetching policies:", error)
      setPolicies([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const fetchProcedures = async () => {
    try {
      const response = await fetch("/api/procedures")
      if (!response.ok) throw new Error("Failed to fetch procedures")

      const data = await response.json()
      // Ensure we always set an array
      setProcedures(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching procedures:", error)
      setProcedures([]) // Set empty array on error
    }
  }

  const fetchProcedureExecutions = async () => {
    try {
      const response = await fetch("/api/procedure-executions")
      if (!response.ok) throw new Error("Failed to fetch procedure executions")

      const data = await response.json()
      // Ensure we always set an array
      setProcedureExecutions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching procedure executions:", error)
      setProcedureExecutions([]) // Set empty array on error
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/policy-categories")
      if (!response.ok) throw new Error("Failed to fetch categories")

      const data = await response.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/policy-dashboard")
      if (!response.ok) throw new Error("Failed to fetch dashboard data")

      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  const handleCreatePolicy = async () => {
    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPolicy,
          category_id: Number.parseInt(newPolicy.category_id),
          tags: newPolicy.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (!response.ok) throw new Error("Failed to create policy")

      setIsCreateDialogOpen(false)
      setNewPolicy({
        title: "",
        description: "",
        content: "",
        category_id: "",
        status: "draft",
        effective_date: "",
        review_date: "",
        next_review_date: "",
        tags: "",
      })
      fetchPolicies()
      fetchDashboardData()
    } catch (error) {
      console.error("Error creating policy:", error)
    }
  }

  const handleCreateProcedure = async () => {
    try {
      const steps = newProcedure.steps
        .split("\n")
        .map((step, index) => ({
          id: index + 1,
          title: step.trim(),
          description: "",
          required: true,
        }))
        .filter((step) => step.title)

      const response = await fetch("/api/procedures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProcedure,
          policy_id: Number.parseInt(newProcedure.policy_id),
          steps,
          roles_responsibilities: newProcedure.roles_responsibilities
            ? JSON.parse(newProcedure.roles_responsibilities)
            : {},
        }),
      })

      if (!response.ok) throw new Error("Failed to create procedure")

      setIsCreateProcedureDialogOpen(false)
      setNewProcedure({
        title: "",
        description: "",
        policy_id: "",
        steps: "",
        roles_responsibilities: "",
        status: "draft",
      })
      fetchProcedures()
    } catch (error) {
      console.error("Error creating procedure:", error)
    }
  }

  const handleExecuteProcedure = async () => {
    try {
      const response = await fetch("/api/procedure-executions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          procedure_id: Number.parseInt(newExecution.procedure_id),
          notes: newExecution.notes,
        }),
      })

      if (!response.ok) throw new Error("Failed to start procedure execution")

      setIsExecuteProcedureDialogOpen(false)
      setNewExecution({
        procedure_id: "",
        notes: "",
      })
      fetchProcedureExecutions()
    } catch (error) {
      console.error("Error starting procedure execution:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-500", label: "Draft" },
      under_review: { color: "bg-yellow-500", label: "Under Review" },
      approved: { color: "bg-blue-500", label: "Approved" },
      published: { color: "bg-green-500", label: "Published" },
      archived: { color: "bg-red-500", label: "Archived" },
      in_progress: { color: "bg-blue-500", label: "In Progress" },
      completed: { color: "bg-green-500", label: "Completed" },
      failed: { color: "bg-red-500", label: "Failed" },
      cancelled: { color: "bg-gray-500", label: "Cancelled" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  // Safe filtering with null checks
  const filteredPolicies = Array.isArray(policies)
    ? policies.filter(
        (policy) =>
          policy &&
          policy.title &&
          policy.description &&
          policy.policy_id &&
          (policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.policy_id.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : []

  const filteredProcedures = Array.isArray(procedures)
    ? procedures.filter(
        (procedure) =>
          procedure &&
          procedure.title &&
          procedure.description &&
          procedure.procedure_id &&
          (procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            procedure.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            procedure.procedure_id.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : []

  const filteredExecutions = Array.isArray(procedureExecutions)
    ? procedureExecutions.filter(
        (execution) =>
          execution &&
          execution.procedure_title &&
          execution.execution_id &&
          execution.policy_title &&
          (execution.procedure_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            execution.execution_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            execution.policy_title.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Policy Management</h1>
          <p className="text-gray-400 mt-1">Manage cybersecurity policies and procedures</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
                <DialogDescription>Create a new cybersecurity policy for your organization.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPolicy.title}
                    onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                    placeholder="Enter policy title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                    placeholder="Enter policy description"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newPolicy.category_id}
                    onValueChange={(value) => setNewPolicy({ ...newPolicy, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPolicy.content}
                    onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                    placeholder="Enter policy content (Markdown supported)"
                    rows={8}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newPolicy.tags}
                    onChange={(e) => setNewPolicy({ ...newPolicy, tags: e.target.value })}
                    placeholder="security, compliance, data-protection"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePolicy}>Create Policy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateProcedureDialogOpen} onOpenChange={setIsCreateProcedureDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsCreateProcedureDialogOpen(true)}>
                Create Procedure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Procedure</DialogTitle>
                <DialogDescription>Create a new procedure linked to a policy.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="proc-title">Title</Label>
                  <Input
                    id="proc-title"
                    value={newProcedure.title}
                    onChange={(e) => setNewProcedure({ ...newProcedure, title: e.target.value })}
                    placeholder="Enter procedure title"
                  />
                </div>
                <div>
                  <Label htmlFor="proc-description">Description</Label>
                  <Textarea
                    id="proc-description"
                    value={newProcedure.description}
                    onChange={(e) => setNewProcedure({ ...newProcedure, description: e.target.value })}
                    placeholder="Enter procedure description"
                  />
                </div>
                <div>
                  <Label htmlFor="proc-policy">Policy</Label>
                  <Select
                    value={newProcedure.policy_id}
                    onValueChange={(value) => setNewProcedure({ ...newProcedure, policy_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id.toString()}>
                          {policy.policy_id} - {policy.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="proc-steps">Steps (one per line)</Label>
                  <Textarea
                    id="proc-steps"
                    value={newProcedure.steps}
                    onChange={(e) => setNewProcedure({ ...newProcedure, steps: e.target.value })}
                    placeholder="Step 1: Initial assessment&#10;Step 2: Documentation review&#10;Step 3: Implementation"
                    rows={6}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateProcedureDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProcedure}>Create Procedure</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Policies</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.total_policies || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.published_policies || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Procedures</CardTitle>
              <Settings className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{procedures.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Active Executions</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {procedureExecutions.filter((e) => e.status === "in_progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Overdue Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.overdue_reviews || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">
            Policies
          </TabsTrigger>
          <TabsTrigger value="procedures">
            Procedures
          </TabsTrigger>
          <TabsTrigger value="executions">
            Executions
          </TabsTrigger>
          <TabsTrigger value="versions">
            Version History
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="categories">
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search policies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Policies Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Policies</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your organization's cybersecurity policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPolicies.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No policies found</p>
                  <p className="text-gray-500 text-sm">Create your first policy to get started</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="truncate">Policy ID</TableHead>
                      <TableHead className="truncate">Title</TableHead>
                      <TableHead className="truncate">Category</TableHead>
                      <TableHead className="truncate">Status</TableHead>
                      <TableHead className="truncate">Version</TableHead>
                      <TableHead className="truncate">Next Review</TableHead>
                      <TableHead className="truncate text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolicies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-mono">{policy.policy_id}</TableCell>
                        <TableCell>{policy.title}</TableCell>
                        <TableCell>
                          {policy.category_name && (
                            <Badge style={{ backgroundColor: policy.category_color }}>
                              {policy.category_name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(policy.status)}</TableCell>
                        <TableCell>{policy.version}</TableCell>
                        <TableCell>
                          {policy.next_review_date ? format(new Date(policy.next_review_date), "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 justify-between">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPolicy(policy)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm" 
                              className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          {/* Procedures Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Procedures</h2>
              <p className="text-gray-400">Manage operational procedures linked to policies</p>
            </div>
            <Dialog open={isExecuteProcedureDialogOpen} onOpenChange={setIsExecuteProcedureDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Play className="h-4 w-4 mr-2" />
                  Execute Procedure
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Execute Procedure</DialogTitle>
                  <DialogDescription>Start a new procedure execution.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="exec-procedure">Procedure</Label>
                    <Select
                      value={newExecution.procedure_id}
                      onValueChange={(value) => setNewExecution({ ...newExecution, procedure_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select procedure" />
                      </SelectTrigger>
                      <SelectContent>
                        {procedures
                          .filter((p) => p.status === "published" || p.status === "approved")
                          .map((procedure) => (
                            <SelectItem key={procedure.id} value={procedure.id.toString()}>
                              {procedure.procedure_id} - {procedure.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exec-notes">Notes</Label>
                    <Textarea
                      id="exec-notes"
                      value={newExecution.notes}
                      onChange={(e) => setNewExecution({ ...newExecution, notes: e.target.value })}
                      placeholder="Enter execution notes or context"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsExecuteProcedureDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExecuteProcedure}>Start Execution</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Procedures Table */}
          <Card>
            <CardContent className="pt-6">
              {filteredProcedures.length === 0 ? (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No procedures found</p>
                  <p className="text-gray-500 text-sm">Create your first procedure to get started</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="truncate">Procedure ID</TableHead>
                      <TableHead className="truncate">Title</TableHead>
                      <TableHead className="truncate">Policy</TableHead>
                      <TableHead className="truncate">Category</TableHead>
                      <TableHead className="truncate">Status</TableHead>
                      <TableHead className="truncate">Executions</TableHead>
                      <TableHead className="truncate">Success Rate</TableHead>
                      <TableHead className="truncate">Last Execution</TableHead>
                      <TableHead className="truncate text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProcedures.map((procedure) => (
                      <TableRow key={procedure.id}>
                        <TableCell className="font-mono">{procedure.procedure_id}</TableCell>
                        <TableCell>{procedure.title}</TableCell>
                        <TableCell>{procedure.policy_code}</TableCell>
                        <TableCell>
                          {procedure.category_name && (
                            <Badge style={{ backgroundColor: procedure.category_color }}>
                              {procedure.category_name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(procedure.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{procedure.execution_count || 0}</span>
                            {procedure.active_executions > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs">
                                {procedure.active_executions} active
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {procedure.execution_count > 0 ? (
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={(procedure.completed_executions / procedure.execution_count) * 100}
                                className="w-16 h-2"
                              />
                              <span className="text-xs">
                                {Math.round((procedure.completed_executions / procedure.execution_count) * 100)}%
                              </span>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          {procedure.last_execution
                            ? format(new Date(procedure.last_execution), "MMM dd, yyyy")
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedProcedure(procedure)
                                setIsViewProcedureDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setNewExecution({ ...newExecution, procedure_id: procedure.id.toString() })
                                setIsExecuteProcedureDialogOpen(true)
                              }}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          {/* Executions Header */}
          <div>
            <h2 className="text-2xl font-bold text-white">Procedure Executions</h2>
            <p className="text-gray-400">Track and monitor procedure execution history</p>
          </div>

          {/* Executions Table */}
          <Card>
            <CardContent className="pt-6">
              {filteredExecutions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No executions found</p>
                  <p className="text-gray-500 text-sm">Execute a procedure to see history here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="truncate">Execution ID</TableHead>
                      <TableHead className="truncate">Procedure</TableHead>
                      <TableHead className="truncate">Policy</TableHead>
                      <TableHead className="truncate">Status</TableHead>
                      <TableHead className="truncate">Started</TableHead>
                      <TableHead className="truncate">Duration</TableHead>
                      <TableHead className="truncate">Progress</TableHead>
                      <TableHead className="truncate text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExecutions.map((execution) => (
                      <TableRow key={execution.id}>
                        <TableCell className="font-mono">{execution.execution_id}</TableCell>
                        <TableCell>{execution.procedure_title}</TableCell>
                        <TableCell>{execution.policy_title}</TableCell>
                        <TableCell>{getStatusBadge(execution.status)}</TableCell>
                        <TableCell>
                          {format(new Date(execution.started_at), "MMM dd, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          {execution.duration_minutes ? `${execution.duration_minutes}m` : "N/A"}
                        </TableCell>
                        <TableCell>
                          {execution.steps_completed && execution.steps_completed.length > 0 ? (
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={
                                  (execution.steps_completed.filter((s: any) => s.completed).length /
                                    execution.steps_completed.length) *
                                  100
                                }
                                className="w-16 h-2"
                              />
                              <span className="text-xs">
                                {execution.steps_completed.filter((s: any) => s.completed).length}/
                                {execution.steps_completed.length}
                              </span>
                            </div>
                          ) : (
                            "0%"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedExecution(execution)
                                setIsViewExecutionDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Policy Version Management</h2>
            <p className="text-gray-400">Manage policy versions and file attachments</p>
          </div>

          {selectedPolicy ? (
            <PolicyVersionHistory
              policyId={selectedPolicy.id}
              onVersionChange={() => {
                fetchPolicies()
                fetchDashboardData()
              }}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a policy to view its version history</p>
                  <p className="text-gray-500 text-sm">Click on a policy from the Policies tab first</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          {dashboardData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Policy Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.categoryDistribution && dashboardData.categoryDistribution.length > 0 ? (
                      dashboardData.categoryDistribution.map((category) => (
                        <div key={category.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="secondary">{category.policy_count}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No categories found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.upcomingReviews && dashboardData.upcomingReviews.length > 0 ? (
                      dashboardData.upcomingReviews.map((review) => (
                        <div key={review.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{review.title}</div>
                            <div className="text-gray-400 text-sm">{review.policy_id}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white text-sm">
                              {format(new Date(review.next_review_date), "MMM dd, yyyy")}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {review.category_name}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No upcoming reviews</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Categories</CardTitle>
              <CardDescription className="text-gray-400">
                Manage policy categories and their organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No categories found</p>
                  <p className="text-gray-500 text-sm">Create categories to organize your policies</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{category.policy_count} policies</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Policy View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{selectedPolicy?.title}</span>
              <Badge className="ml-2">{selectedPolicy?.policy_id}</Badge>
            </DialogTitle>
            <DialogDescription>{selectedPolicy?.description}</DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPolicy.status)}</div>
                </div>
                <div>
                  <Label>Version</Label>
                  <div className="mt-1 text-white">{selectedPolicy.version}</div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="mt-1">
                    {selectedPolicy.category_name && (
                      <Badge style={{ backgroundColor: selectedPolicy.category_color }}>
                        {selectedPolicy.category_name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Next Review</Label>
                  <div className="mt-1 text-white">
                    {selectedPolicy.next_review_date
                      ? format(new Date(selectedPolicy.next_review_date), "MMM dd, yyyy")
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedPolicy.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Content</Label>
                <div className="mt-1 p-4 bg-slate-700 rounded-md">
                  <pre className="text-white text-sm whitespace-pre-wrap">{selectedPolicy.content}</pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Procedure View Dialog */}
      <Dialog open={isViewProcedureDialogOpen} onOpenChange={setIsViewProcedureDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{selectedProcedure?.title}</span>
              <Badge className="ml-2">{selectedProcedure?.procedure_id}</Badge>
            </DialogTitle>
            <DialogDescription>{selectedProcedure?.description}</DialogDescription>
          </DialogHeader>
          {selectedProcedure && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedProcedure.status)}</div>
                </div>
                <div>
                  <Label>Policy</Label>
                  <div className="mt-1 text-white">
                    {selectedProcedure.policy_code} - {selectedProcedure.policy_title}
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="mt-1">
                    {selectedProcedure.category_name && (
                      <Badge style={{ backgroundColor: selectedProcedure.category_color }}>
                        {selectedProcedure.category_name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Executions</Label>
                  <div className="mt-1 text-white">{selectedProcedure.execution_count} total</div>
                </div>
              </div>
              <div>
                <Label>Steps</Label>
                <div className="mt-1 space-y-2">
                  {selectedProcedure.steps?.map((step: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-md">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div className="text-white">{step.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Execution View Dialog */}
      <Dialog open={isViewExecutionDialogOpen} onOpenChange={setIsViewExecutionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{selectedExecution?.procedure_title}</span>
              <Badge className="ml-2">{selectedExecution?.execution_id}</Badge>
            </DialogTitle>
            <DialogDescription>
              Execution of {selectedExecution?.procedure_code} - Started{" "}
              {selectedExecution?.started_at
                ? format(new Date(selectedExecution.started_at), "MMM dd, yyyy HH:mm")
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedExecution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedExecution.status)}</div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <div className="mt-1 text-white">
                    {selectedExecution.duration_minutes
                      ? `${selectedExecution.duration_minutes} minutes`
                      : "In progress"}
                  </div>
                </div>
                <div>
                  <Label>Started</Label>
                  <div className="mt-1 text-white">
                    {format(new Date(selectedExecution.started_at), "MMM dd, yyyy HH:mm")}
                  </div>
                </div>
                <div>
                  <Label>Completed</Label>
                  <div className="mt-1 text-white">
                    {selectedExecution.completed_at
                      ? format(new Date(selectedExecution.completed_at), "MMM dd, yyyy HH:mm")
                      : "Not completed"}
                  </div>
                </div>
              </div>
              <div>
                <Label>Progress</Label>
                <div className="mt-1 space-y-2">
                  {selectedExecution.steps_completed?.map((step: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-md ${step.completed ? "bg-green-900/20 border border-green-700" : "bg-slate-700"}`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${step.completed ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}`}
                      >
                        {step.completed ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white">{step.title}</div>
                        {step.timestamp && (
                          <div className="text-gray-400 text-sm">
                            Completed: {format(new Date(step.timestamp), "MMM dd, yyyy HH:mm")}
                          </div>
                        )}
                        {step.error && <div className="text-red-400 text-sm">Error: {step.error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedExecution.notes && (
                <div>
                  <Label>Notes</Label>
                  <div className="mt-1 p-4 bg-slate-700 rounded-md">
                    <pre className="text-white text-sm whitespace-pre-wrap">{selectedExecution.notes}</pre>
                  </div>
                </div>
              )}
              {selectedExecution.evidence_files && selectedExecution.evidence_files.length > 0 && (
                <div>
                  <Label>Evidence Files</Label>
                  <div className="mt-1 space-y-2">
                    {selectedExecution.evidence_files.map((file: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-md">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <div className="flex-1">
                          <div className="text-white">{file.name}</div>
                          <div className="text-gray-400 text-sm">
                            Uploaded: {format(new Date(file.uploaded_at), "MMM dd, yyyy HH:mm")}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
