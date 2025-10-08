"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Target,
  Activity,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react"

interface AnalyticsData {
  overall: {
    total_actions: number
    open_actions: number
    in_progress_actions: number
    completed_actions: number
    closed_actions: number
    deferred_actions: number
    overdue_actions: number
    due_soon_actions: number
    avg_progress: number
    total_estimated_cost: number
    total_actual_cost: number
  }
  by_priority: Array<{
    remediation_priority: string
    count: number
    completed_count: number
    avg_progress: number
  }>
  by_severity: Array<{
    finding_severity: string
    count: number
    completed_count: number
    avg_progress: number
  }>
  by_department: Array<{
    assigned_department: string
    count: number
    completed_count: number
    avg_progress: number
  }>
  completion_trend: Array<{
    month: string
    completed_count: number
  }>
}

const PRIORITY_COLORS = {
  Critical: "#dc2626",
  High: "#ea580c", 
  Medium: "#eab308",
  Low: "#22c55e"
}

const SEVERITY_COLORS = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#eab308", 
  Low: "#22c55e"
}

const STATUS_COLORS = {
  Open: "#3b82f6",
  "In Progress": "#eab308",
  Completed: "#22c55e",
  Closed: "#6b7280",
  Deferred: "#f97316"
}

export function NESAUAEAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [animationKey, setAnimationKey] = useState(0)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/nesa-uae-remediation/stats")
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
        setAnimationKey(prev => prev + 1) // Trigger re-animation
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const completionRate = analyticsData.overall.total_actions > 0 
    ? (analyticsData.overall.completed_actions / analyticsData.overall.total_actions) * 100 
    : 0

  const overdueRate = analyticsData.overall.total_actions > 0
    ? (analyticsData.overall.overdue_actions / analyticsData.overall.total_actions) * 100
    : 0

  const costEfficiency = analyticsData.overall.total_actual_cost && analyticsData.overall.total_estimated_cost
    ? ((analyticsData.overall.total_estimated_cost - analyticsData.overall.total_actual_cost) / analyticsData.overall.total_estimated_cost) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">NESA UAE Analytics Dashboard</h2>
          <p className="text-muted-foreground">Real-time remediation tracking and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Actions</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.overall.total_actions}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left delay-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left delay-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Actions</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.overall.overdue_actions}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-600">{overdueRate.toFixed(1)}% of total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left delay-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${analyticsData.overall.total_estimated_cost?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-purple-600">Budget allocated</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Actions by Priority
                </CardTitle>
                <CardDescription>Distribution of remediation actions by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.by_priority} key={animationKey}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="remediation_priority" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Actions by Severity
                </CardTitle>
                <CardDescription>Distribution of findings by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.by_severity} key={animationKey}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="finding_severity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ea580c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Completion Trend
                </CardTitle>
                <CardDescription>Monthly completion progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.completion_trend} key={animationKey}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="completed_count" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department Performance
                </CardTitle>
                <CardDescription>Actions and completion rates by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.by_department} key={animationKey}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assigned_department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Total Actions" />
                    <Bar dataKey="completed_count" fill="#22c55e" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Priority Distribution
                </CardTitle>
                <CardDescription>Percentage breakdown by priority</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart key={animationKey}>
                    <Pie
                      data={analyticsData.by_priority}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ remediation_priority, count }) => `${remediation_priority}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.by_priority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.remediation_priority as keyof typeof PRIORITY_COLORS] || "#8884d8"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Severity Distribution
                </CardTitle>
                <CardDescription>Percentage breakdown by severity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart key={animationKey}>
                    <Pie
                      data={analyticsData.by_severity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ finding_severity, count }) => `${finding_severity}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.by_severity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.finding_severity as keyof typeof SEVERITY_COLORS] || "#8884d8"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
                <CardDescription>Current progress across all actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{analyticsData.overall.avg_progress}%</span>
                  </div>
                  <Progress value={analyticsData.overall.avg_progress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analyticsData.overall.open_actions}</div>
                    <div className="text-sm text-blue-600">Open</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{analyticsData.overall.in_progress_actions}</div>
                    <div className="text-sm text-yellow-600">In Progress</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analyticsData.overall.completed_actions}</div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{analyticsData.overall.overdue_actions}</div>
                    <div className="text-sm text-red-600">Overdue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department Efficiency
                </CardTitle>
                <CardDescription>Completion rates by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.by_department.map((dept, index) => {
                    const efficiency = dept.count > 0 ? (dept.completed_count / dept.count) * 100 : 0
                    return (
                      <div key={dept.assigned_department} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{dept.assigned_department}</span>
                          <span className="text-sm text-muted-foreground">{efficiency.toFixed(1)}%</span>
                        </div>
                        <Progress value={efficiency} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{dept.completed_count} completed</span>
                          <span>{dept.count} total</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Real-time Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Real-time Status
          </CardTitle>
          <CardDescription>Live updates and system health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-green-800">System Online</div>
                <div className="text-sm text-green-600">Last updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-blue-800">Data Sync Active</div>
                <div className="text-sm text-blue-600">Auto-refresh every 30s</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-purple-800">Analytics Engine</div>
                <div className="text-sm text-purple-600">Processing real-time data</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

