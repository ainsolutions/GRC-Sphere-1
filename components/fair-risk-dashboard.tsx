"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  AlertTriangle,
  Target,
  Activity,
  BarChart3,
  PieChartIcon,
} from "lucide-react"
import { FairRiskHeatMap } from "./fair-risk-heatmap"

interface DashboardData {
  risk_stats: {
    total_risks: number
    total_ale_before: number
    avg_ale_before: number
    risks_above_tolerance: number
    treated_risks: number
  }
  financial_impact: {
    total_ale_before: number
    total_ale_after: number
    total_risk_reduction: number
    total_cost_estimate: number
    roi: number
  }
  risk_trends: Array<{
    month: string
    risks_identified: number
    total_ale: number
    avg_ale: number
  }>
  treatment_progress: Array<{
    month: string
    controls_completed: number
    controls_started: number
    total_changes: number
  }>
  risk_distribution: Array<{
    risk_level_before: string
    risk_level_after: string
    count: number
    total_ale_before: number
    total_ale_after: number
  }>
  top_risk_reductions: Array<{
    risk_id: string
    title: string
    original_ale: number
    projected_ale: number
    ale_reduction: number
    expected_risk_reduction: number
    cost_estimate: number
    treatment_type: string
  }>
  treatment_type_effectiveness: Array<{
    treatment_type: string
    count: number
    avg_risk_reduction: number
    total_cost: number
    avg_cost: number
    completed_controls: number
    total_controls: number
  }>
  control_timeline: Array<{
    week: string
    controls_due: number
    controls_completed: number
    controls_overdue: number
  }>
}

const COLORS = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
}

export function FairRiskDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/fair-risks/dashboard")
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
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
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const formatWeek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getRiskLevelColor = (level: string) => {
    return COLORS[level as keyof typeof COLORS] || COLORS.primary
  }

  const calculateRiskReductionPercentage = () => {
    if (!data?.financial_impact) return 0
    const { total_ale_before, total_risk_reduction } = data.financial_impact
    return total_ale_before > 0 ? (total_risk_reduction / total_ale_before) * 100 : 0
  }

  const prepareRiskDistributionData = () => {
    if (!data?.risk_distribution) return []

    const beforeData = data.risk_distribution.reduce((acc: any, item) => {
      acc[item.risk_level_before] = (acc[item.risk_level_before] || 0) + item.count
      return acc
    }, {})

    const afterData = data.risk_distribution.reduce((acc: any, item) => {
      acc[item.risk_level_after] = (acc[item.risk_level_after] || 0) + item.count
      return acc
    }, {})

    return ["Critical", "High", "Medium", "Low"].map((level) => ({
      level,
      before: beforeData[level] || 0,
      after: afterData[level] || 0,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading FAIR Risk Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">No dashboard data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risk Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.financial_impact.total_risk_reduction)}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculateRiskReductionPercentage().toFixed(1)}% reduction in ALE
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(data.financial_impact.total_cost_estimate)}
            </div>
            <p className="text-xs text-muted-foreground">ROI: {data.financial_impact.roi.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risks Treated</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.risk_stats.treated_risks}</div>
            <p className="text-xs text-muted-foreground">of {data.risk_stats.total_risks} total risks</p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risks Above Tolerance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.risk_stats.risks_above_tolerance}</div>
            <p className="text-xs text-muted-foreground">
              {((data.risk_stats.risks_above_tolerance / data.risk_stats.total_risks) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
          <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Analysis</TabsTrigger>
          <TabsTrigger value="controls">Control Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Risk Distribution Before/After */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Risk Distribution Impact
                </CardTitle>
                <CardDescription>Risk levels before and after treatment implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareRiskDistributionData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="before" fill={COLORS.danger} name="Before Treatment" />
                    <Bar dataKey="after" fill={COLORS.success} name="After Treatment" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Impact */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Impact Analysis
                </CardTitle>
                <CardDescription>Cost-benefit analysis of risk treatment investments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ALE Before Treatment</span>
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(data.financial_impact.total_ale_before)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ALE After Treatment</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(data.financial_impact.total_ale_after)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Treatment Cost</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(data.financial_impact.total_cost_estimate)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Net Benefit</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(
                          data.financial_impact.total_risk_reduction - data.financial_impact.total_cost_estimate,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ROI</span>
                    <span className="font-medium">{data.financial_impact.roi.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(data.financial_impact.roi, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Top Risk Reductions */}
            <Card className="gradient-card md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Risk Reductions
                </CardTitle>
                <CardDescription>Risks with the highest ALE reduction from treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.top_risk_reductions.slice(0, 5).map((risk, index) => (
                    <div
                      key={risk.risk_id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <span className="font-medium">{risk.title}</span>
                          <Badge variant="outline" className="capitalize">
                            {risk.treatment_type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Risk ID: {risk.risk_id} • {risk.expected_risk_reduction}% reduction
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{formatCurrency(risk.ale_reduction)}</div>
                        <div className="text-xs text-muted-foreground">Cost: {formatCurrency(risk.cost_estimate)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <FairRiskHeatMap />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            {/* Risk Identification Trends */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Risk Identification Trends
                </CardTitle>
                <CardDescription>Monthly risk identification and ALE trends over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.risk_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickFormatter={formatDate} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      labelFormatter={(value) => formatDate(value)}
                      formatter={(value: any, name: string) => [
                        name === "total_ale" ? formatCurrency(value) : value,
                        name === "total_ale"
                          ? "Total ALE"
                          : name === "risks_identified"
                            ? "Risks Identified"
                            : "Avg ALE",
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="risks_identified" fill={COLORS.primary} name="Risks Identified" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="total_ale"
                      stroke={COLORS.danger}
                      strokeWidth={2}
                      name="Total ALE"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Treatment Progress Trends */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Treatment Progress Trends
                </CardTitle>
                <CardDescription>Monthly progress of control implementation and completion</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={data.treatment_progress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => formatDate(value)} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="controls_completed"
                      stackId="1"
                      stroke={COLORS.success}
                      fill={COLORS.success}
                      name="Controls Completed"
                    />
                    <Area
                      type="monotone"
                      dataKey="controls_started"
                      stackId="1"
                      stroke={COLORS.warning}
                      fill={COLORS.warning}
                      name="Controls Started"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treatment" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Treatment Type Effectiveness */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Treatment Type Effectiveness
                </CardTitle>
                <CardDescription>Effectiveness comparison across different treatment strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.treatment_type_effectiveness}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ treatment_type, avg_risk_reduction }) =>
                        `${treatment_type}: ${avg_risk_reduction.toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="avg_risk_reduction"
                    >
                      {data.treatment_type_effectiveness.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, "Avg Risk Reduction"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Treatment Type Statistics */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Treatment Statistics
                </CardTitle>
                <CardDescription>Detailed statistics for each treatment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.treatment_type_effectiveness.map((treatment, index) => (
                    <div key={treatment.treatment_type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: Object.values(COLORS)[index % Object.values(COLORS).length] }}
                          ></div>
                          <span className="font-medium capitalize">{treatment.treatment_type}</span>
                        </div>
                        <Badge variant="outline">{treatment.count} plans</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Avg Risk Reduction:</span>
                          <span className="font-medium ml-2">{treatment.avg_risk_reduction.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Cost:</span>
                          <span className="font-medium ml-2">{formatCurrency(treatment.avg_cost)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(treatment.completed_controls / treatment.total_controls) * 100}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {treatment.completed_controls}/{treatment.total_controls} controls
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Control Implementation Timeline
              </CardTitle>
              <CardDescription>Weekly view of control due dates, completions, and overdue items</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.control_timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tickFormatter={formatWeek} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Week of ${formatWeek(value)}`}
                    formatter={(value: any, name: string) => [
                      value,
                      name === "controls_due"
                        ? "Controls Due"
                        : name === "controls_completed"
                          ? "Controls Completed"
                          : "Controls Overdue",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="controls_due"
                    stackId="1"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    name="Controls Due"
                  />
                  <Area
                    type="monotone"
                    dataKey="controls_completed"
                    stackId="2"
                    stroke={COLORS.success}
                    fill={COLORS.success}
                    name="Controls Completed"
                  />
                  <Area
                    type="monotone"
                    dataKey="controls_overdue"
                    stackId="3"
                    stroke={COLORS.danger}
                    fill={COLORS.danger}
                    name="Controls Overdue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
