"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  Target,
} from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

interface MICARemediation {
  id: string
  plan_name: string
  description: string
  gap_analysis_id: string
  owner_name: string
  owner_email: string
  target_completion_date: string
  budget_allocated: number
  budget_spent?: number
  priority_level: "critical" | "high" | "medium" | "low"
  status: "active" | "on_hold" | "completed" | "cancelled"
  total_items?: number
  completed_items?: number
  in_progress_items?: number
  not_started_items?: number
  overdue_items?: number
  total_estimated_cost?: number
  total_actual_cost?: number
  created_at: string
  updated_at: string
}

interface MICARemediationItem {
  id: string
  remediation_id: string
  item_title: string
  item_description: string
  gap_reference: string
  assigned_to: string
  estimated_cost: number
  actual_cost?: number
  estimated_effort_days: number
  actual_effort_days?: number
  start_date: string
  target_completion_date: string
  actual_completion_date?: string
  status: "not_started" | "in_progress" | "completed" | "overdue" | "blocked"
  completion_percentage: number
  deliverables: string[]
  dependencies: string[]
  risks_issues: string
  status_notes: string
}

export function MICARemediationTracker() {
  const [remediations, setRemediations] = useState<MICARemediation[]>([])
  const [remediationItems, setRemediationItems] = useState<MICARemediationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRemediation, setSelectedRemediation] = useState<MICARemediation | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [newRemediation, setNewRemediation] = useState({
    plan_name: "",
    description: "",
    gap_analysis_id: "",
    owner_name: "",
    owner_email: "",
    target_completion_date: "",
    budget_allocated: 0,
    priority_level: "medium" as const,
  })

  useEffect(() => {
    fetchRemediations()
  }, [])

  const fetchRemediations = async () => {
    try {
      const response = await fetch("/api/mica-remediation")
      if (response.ok) {
        const data = await response.json()
        setRemediations(data)
      }
    } catch (error) {
      console.error("Error fetching MICA remediations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch MICA remediation plans",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createRemediation = async () => {
    try {
      const response = await fetch("/api/mica-remediation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRemediation),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "MICA remediation plan created successfully",
        })
        setIsCreateDialogOpen(false)
        setNewRemediation({
          plan_name: "",
          description: "",
          gap_analysis_id: "",
          owner_name: "",
          owner_email: "",
          target_completion_date: "",
          budget_allocated: 0,
          priority_level: "medium",
        })
        fetchRemediations()
      } else {
        throw new Error("Failed to create remediation plan")
      }
    } catch (error) {
      console.error("Error creating remediation plan:", error)
      toast({
        title: "Error",
        description: "Failed to create MICA remediation plan",
        variant: "destructive",
      })
    }
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      critical: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      high: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
      medium: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      low: { color: "bg-blue-100 text-blue-800", icon: Clock },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-blue-100 text-blue-800", icon: Activity },
      on_hold: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const totalStats = {
    totalPlans: remediations.length,
    activePlans: remediations.filter((r) => r.status === "active").length,
    completedPlans: remediations.filter((r) => r.status === "completed").length,
    totalBudget: remediations.reduce((sum, r) => sum + r.budget_allocated, 0),
    totalSpent: remediations.reduce((sum, r) => sum + (r.budget_spent || 0), 0),
    totalItems: remediations.reduce((sum, r) => sum + (r.total_items || 0), 0),
    completedItems: remediations.reduce((sum, r) => sum + (r.completed_items || 0), 0),
    overdueItems: remediations.reduce((sum, r) => sum + (r.overdue_items || 0), 0),
  }

  const completionRate =
    totalStats.totalItems > 0 ? Math.round((totalStats.completedItems / totalStats.totalItems) * 100) : 0

  if (loading) {
    return (
      <Card className="gradient-card-primary border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MICA Remediation Tracker
          </h2>
          <p className="text-muted-foreground mt-1">Track and manage MICA compliance remediation activities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={()=>{}} btnAddText="New Remediation Plan"/>
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Remediation Plan
            </Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New MICA Remediation Plan</DialogTitle>
              <DialogDescription>
                Set up a new remediation plan to address identified compliance gaps.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan_name">Plan Name</Label>
                  <Input
                    id="plan_name"
                    value={newRemediation.plan_name}
                    onChange={(e) => setNewRemediation({ ...newRemediation, plan_name: e.target.value })}
                    placeholder="Q1 2024 MICA Remediation Plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority_level">Priority Level</Label>
                  <Select
                    value={newRemediation.priority_level}
                    onValueChange={(value: any) => setNewRemediation({ ...newRemediation, priority_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRemediation.description}
                  onChange={(e) => setNewRemediation({ ...newRemediation, description: e.target.value })}
                  placeholder="Comprehensive remediation plan to address critical MICA compliance gaps..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner_name">Plan Owner</Label>
                  <Input
                    id="owner_name"
                    value={newRemediation.owner_name}
                    onChange={(e) => setNewRemediation({ ...newRemediation, owner_name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner_email">Owner Email</Label>
                  <Input
                    id="owner_email"
                    type="email"
                    value={newRemediation.owner_email}
                    onChange={(e) => setNewRemediation({ ...newRemediation, owner_email: e.target.value })}
                    placeholder="john.smith@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_allocated">Budget Allocated ($)</Label>
                  <Input
                    id="budget_allocated"
                    type="number"
                    value={newRemediation.budget_allocated}
                    onChange={(e) =>
                      setNewRemediation({ ...newRemediation, budget_allocated: Number.parseInt(e.target.value) || 0 })
                    }
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_completion_date">Target Completion Date</Label>
                  <Input
                    id="target_completion_date"
                    type="date"
                    value={newRemediation.target_completion_date}
                    onChange={(e) => setNewRemediation({ ...newRemediation, target_completion_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createRemediation}>Create Remediation Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {totalStats.completedItems} of {totalStats.totalItems} items
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card-secondary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Active Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalStats.activePlans}</div>
            <p className="text-xs text-muted-foreground">{totalStats.completedPlans} completed</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-accent border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Budget Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {totalStats.totalBudget > 0 ? Math.round((totalStats.totalSpent / totalStats.totalBudget) * 100) : 0}%
            </div>
            <Progress
              value={totalStats.totalBudget > 0 ? (totalStats.totalSpent / totalStats.totalBudget) * 100 : 0}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              ${(totalStats.totalSpent / 1000).toFixed(0)}K of ${(totalStats.totalBudget / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card-warning border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Overdue Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalStats.overdueItems}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Budget
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="gradient-card-primary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Progress by Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["critical", "high", "medium", "low"].map((priority) => {
                    const priorityPlans = remediations.filter((r) => r.priority_level === priority)
                    const completedCount = priorityPlans.filter((r) => r.status === "completed").length
                    const percentage =
                      priorityPlans.length > 0 ? Math.round((completedCount / priorityPlans.length) * 100) : 0

                    return (
                      <div key={priority} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize font-medium">{priority} Priority</span>
                          <span>{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {completedCount} of {priorityPlans.length} plans completed
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card-secondary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {remediations.slice(0, 5).map((plan) => (
                    <div key={plan.id} className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{plan.plan_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {plan.status} • {new Date(plan.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getPriorityBadge(plan.priority_level)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card className="gradient-card-primary border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MICA Remediation Plans
              </CardTitle>
              <CardDescription>Manage and track your MICA compliance remediation plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Target Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remediations.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.plan_name}</TableCell>
                      <TableCell>{plan.owner_name}</TableCell>
                      <TableCell>{getPriorityBadge(plan.priority_level)}</TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={plan.total_items ? ((plan.completed_items || 0) / plan.total_items) * 100 : 0}
                            className="w-16 h-2"
                          />
                          <span className="text-sm">
                            {plan.total_items ? Math.round(((plan.completed_items || 0) / plan.total_items) * 100) : 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>${(plan.budget_allocated / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-muted-foreground">
                            ${((plan.budget_spent || 0) / 1000).toFixed(0)}K spent
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(plan.target_completion_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="gradient-card-primary border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Remediation Timeline
              </CardTitle>
              <CardDescription>Track remediation activities over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Timeline visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="gradient-card-primary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Budget Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Allocated</span>
                    <span className="text-lg font-bold">${(totalStats.totalBudget / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Spent</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${(totalStats.totalSpent / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Remaining</span>
                    <span className="text-lg font-bold text-green-600">
                      ${((totalStats.totalBudget - totalStats.totalSpent) / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Progress
                    value={totalStats.totalBudget > 0 ? (totalStats.totalSpent / totalStats.totalBudget) * 100 : 0}
                    className="mt-4"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card-secondary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">Cost analysis and forecasting coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
