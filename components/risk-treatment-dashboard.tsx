"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Edit,
  Trash2,
  Shield,
  TrendingUp,
  Users,
  FileText,
  Activity,
  Target,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TreatmentPlan {
  id: string
  plan_id: string
  fair_risk_id: string
  fair_risk_title: string
  fair_risk_id_display: string
  plan_title: string
  plan_description: string
  treatment_type: string
  priority: string
  estimated_cost: number
  estimated_effort_hours: number
  expected_risk_reduction: number
  plan_status: string
  assigned_to: string
  start_date: string
  target_completion_date: string
  actual_completion_date: string
  approval_required: boolean
  approved_by: string
  approved_date: string
  days_overdue: number
  total_controls: number
  completed_controls: number
  created_at: string
  updated_at: string
}

interface TreatmentControl {
  id: string
  control_id: string
  treatment_plan_id: string
  treatment_plan_title: string
  treatment_plan_id_display: string
  control_title: string
  control_description: string
  control_type: string
  control_category: string
  implementation_status: string
  effectiveness_rating: number
  implementation_cost: number
  maintenance_cost_annual: number
  assigned_owner: string
  technical_contact: string
  implementation_date: string
  testing_date: string
  next_review_date: string
  automation_level: string
  compliance_frameworks: string[]
  evidence_location: string
  testing_procedure: string
  remediation_notes: string
  review_overdue_days: number
  created_at: string
  updated_at: string
}

interface TrackingEntry {
  id: string
  treatment_plan_id: string
  control_id: string
  treatment_plan_title: string
  treatment_plan_id_display: string
  control_title: string
  control_id_display: string
  tracking_type: string
  old_status: string
  new_status: string
  tracking_date: string
  description: string
  impact_assessment: string
  action_required: string
  responsible_party: string
  due_date: string
  resolution_date: string
  aging_days: number
  created_by: string
  created_at: string
}

interface TreatmentStats {
  plan_stats: {
    total_plans: number
    completed_plans: number
    in_progress_plans: number
    overdue_plans: number
    avg_risk_reduction: number
    total_estimated_cost: number
  }
  control_stats: {
    total_controls: number
    operational_controls: number
    in_progress_controls: number
    overdue_reviews: number
    avg_effectiveness_rating: number
    total_implementation_cost: number
    total_maintenance_cost: number
  }
  aging_analysis: Array<{
    tracking_type: string
    count: number
    avg_aging_days: number
    max_aging_days: number
  }>
  treatment_type_distribution: Array<{
    treatment_type: string
    count: number
    avg_risk_reduction: number
    total_cost: number
  }>
  priority_distribution: Array<{
    priority: string
    count: number
    completed: number
    overdue: number
  }>
  recent_activities: Array<{
    tracking_type: string
    tracking_date: string
    description: string
    aging_days: number
    plan_title: string
    plan_id: string
    control_title: string
    control_id: string
  }>
  overdue_items: Array<{
    item_type: string
    item_id: string
    title: string
    due_date: string
    days_overdue: number
    responsible_party: string
    priority: string
  }>
}

export function RiskTreatmentDashboard() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([])
  const [treatmentControls, setTreatmentControls] = useState<TreatmentControl[]>([])
  const [trackingEntries, setTrackingEntries] = useState<TrackingEntry[]>([])
  const [stats, setStats] = useState<TreatmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchTreatmentPlans(), fetchTreatmentControls(), fetchTrackingEntries(), fetchStats()])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load treatment data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTreatmentPlans = async () => {
    const response = await fetch("/api/risk-treatment-plans")
    if (response.ok) {
      const data = await response.json()
      setTreatmentPlans(data)
    }
  }

  const fetchTreatmentControls = async () => {
    const response = await fetch("/api/risk-treatment-controls")
    if (response.ok) {
      const data = await response.json()
      setTreatmentControls(data)
    }
  }

  const fetchTrackingEntries = async () => {
    const response = await fetch("/api/risk-treatment-tracking")
    if (response.ok) {
      const data = await response.json()
      setTrackingEntries(data)
    }
  }

  const fetchStats = async () => {
    const response = await fetch("/api/risk-treatment-tracking/stats")
    if (response.ok) {
      const data = await response.json()
      setStats(data)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "operational":
        return "bg-green-500"
      case "in_progress":
      case "implemented":
        return "bg-blue-500"
      case "planned":
      case "draft":
        return "bg-gray-500"
      case "overdue":
      case "failed":
        return "bg-red-500"
      case "on_hold":
      case "deferred":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTreatmentTypeIcon = (type: string) => {
    switch (type) {
      case "mitigate":
        return <Shield className="h-4 w-4" />
      case "transfer":
        return <Users className="h-4 w-4" />
      case "accept":
        return <CheckCircle className="h-4 w-4" />
      case "avoid":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredPlans = treatmentPlans.filter((plan) => {
    const matchesSearch =
      plan.plan_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.fair_risk_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || plan.plan_status === statusFilter
    const matchesPriority = priorityFilter === "all" || plan.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading Treatment Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Plans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.plan_stats.total_plans || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.plan_stats.completed_plans || 0} completed, {stats?.plan_stats.overdue_plans || 0} overdue
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.control_stats.operational_controls || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {stats?.control_stats.total_controls || 0} total controls
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.plan_stats.total_estimated_cost || 0)}</div>
            <p className="text-xs text-muted-foreground">Total estimated cost</p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats?.plan_stats.avg_risk_reduction || 0)}%</div>
            <p className="text-xs text-muted-foreground">Average expected reduction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overdue Items */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Overdue Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stats?.overdue_items.slice(0, 10).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded-md"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.item_type === "treatment_plan" ? "Treatment Plan" : "Control Review"} •
                          {item.responsible_party}
                        </p>
                      </div>
                      <Badge className="bg-red-500 text-white">{item.days_overdue}d overdue</Badge>
                    </div>
                  ))}
                  {(!stats?.overdue_items || stats.overdue_items.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">No overdue items</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stats?.recent_activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 border-l-2 border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.plan_title || activity.control_title} • {formatDate(activity.tracking_date)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.tracking_type}
                      </Badge>
                    </div>
                  ))}
                  {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">No recent activities</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Treatment Type Distribution */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Treatment Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.treatment_type_distribution.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTreatmentTypeIcon(type.treatment_type)}
                        <span className="capitalize">{type.treatment_type}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{type.count}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(type.avg_risk_reduction)}% avg reduction
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.priority_distribution.map((priority, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority.priority)}`}></div>
                          <span className="capitalize">{priority.priority}</span>
                        </div>
                        <span className="font-medium">{priority.count}</span>
                      </div>
                      <Progress value={(priority.completed / priority.count) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{priority.completed} completed</span>
                        <span>{priority.overdue} overdue</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search treatment plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Treatment Plans Table */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Treatment Plans</CardTitle>
              <CardDescription>Manage risk treatment plans and track their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>FAIR Risk</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono text-sm">{plan.plan_id}</TableCell>
                      <TableCell className="font-medium">{plan.plan_title}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{plan.fair_risk_title}</span>
                          <span className="text-xs text-muted-foreground">{plan.fair_risk_id_display}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTreatmentTypeIcon(plan.treatment_type)}
                          <span className="capitalize">{plan.treatment_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(plan.priority)} text-white`}>{plan.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(plan.plan_status)} text-white`}>
                          {plan.plan_status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(plan.completed_controls / plan.total_controls) * 100}
                            className="w-16 h-2"
                          />
                          <span className="text-xs">
                            {plan.completed_controls}/{plan.total_controls}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(plan.target_completion_date)}</span>
                          {plan.days_overdue > 0 && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              {plan.days_overdue}d overdue
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{plan.assigned_to}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Treatment Controls</CardTitle>
              <CardDescription>
                Individual controls within treatment plans and their implementation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Treatment Plan</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Effectiveness</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Next Review</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treatmentControls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-mono text-sm">{control.control_id}</TableCell>
                      <TableCell className="font-medium">{control.control_title}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{control.treatment_plan_title}</span>
                          <span className="text-xs text-muted-foreground">{control.treatment_plan_id_display}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{control.control_type}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(control.implementation_status)} text-white`}>
                          {control.implementation_status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={control.effectiveness_rating * 20} className="w-16 h-2" />
                          <span className="text-xs">{control.effectiveness_rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{control.assigned_owner}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(control.next_review_date)}</span>
                          {control.review_overdue_days > 0 && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              {control.review_overdue_days}d overdue
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Treatment Tracking</CardTitle>
              <CardDescription>
                Historical tracking of treatment plan and control changes with aging analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status Change</TableHead>
                    <TableHead>Aging</TableHead>
                    <TableHead>Responsible</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trackingEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.tracking_date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {entry.tracking_type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.treatment_plan_title || entry.control_title}</span>
                          <span className="text-xs text-muted-foreground">
                            {entry.treatment_plan_id_display || entry.control_id_display}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                      <TableCell>
                        {entry.old_status && entry.new_status && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {entry.old_status}
                            </Badge>
                            <span>→</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.new_status}
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.aging_days > 30 ? "destructive" : entry.aging_days > 7 ? "secondary" : "default"
                          }
                        >
                          {entry.aging_days}d
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{entry.responsible_party}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
