"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Building2,
  FileText,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
  PieChart,
  Pie,
} from "recharts"

interface DashboardMetrics {
  vendors: {
    total: number
    active: number
    critical: number
    highRisk: number
    mediumRisk: number
    lowRisk: number
  }
  contracts: {
    total: number
    active: number
    expiringSoon: number
    totalValue: number
    averageValue: number
  }
  risks: {
    total: number
    high: number
    medium: number
    low: number
    mitigated: number
    open: number
  }
  gaps: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
    closed: number
  }
  remediations: {
    total: number
    completed: number
    inProgress: number
    overdue: number
    onTrack: number
  }
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"]

export function ThirdPartyDashboards() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/third-party-dashboards")
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading dashboard metrics...</span>
        </div>
      </div>
    )
  }

  const vendorRiskData = [
    { name: "Critical", value: metrics.vendors.critical, color: "#ef4444" },
    { name: "High", value: metrics.vendors.highRisk, color: "#f97316" },
    { name: "Medium", value: metrics.vendors.mediumRisk, color: "#eab308" },
    { name: "Low", value: metrics.vendors.lowRisk, color: "#22c55e" },
  ]

  const gapSeverityData = [
    { name: "Critical", value: metrics.gaps.critical, color: "#ef4444" },
    { name: "High", value: metrics.gaps.high, color: "#f97316" },
    { name: "Medium", value: metrics.gaps.medium, color: "#eab308" },
    { name: "Low", value: metrics.gaps.low, color: "#22c55e" },
  ]

  const remediationStatusData = [
    { name: "Completed", value: metrics.remediations.completed, color: "#22c55e" },
    { name: "In Progress", value: metrics.remediations.inProgress, color: "#3b82f6" },
    { name: "Overdue", value: metrics.remediations.overdue, color: "#ef4444" },
    { name: "On Track", value: metrics.remediations.onTrack, color: "#eab308" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Third Party Risk Dashboards</h2>
          <p className="text-muted-foreground">Comprehensive analytics and insights for vendor risk management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
          <Button onClick={fetchMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="gaps">Gaps</TabsTrigger>
          <TabsTrigger value="remediations">Remediations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.vendors.total}</div>
                <p className="text-xs text-muted-foreground">{metrics.vendors.active} active vendors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(metrics.contracts.totalValue / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">{metrics.contracts.total} active contracts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.risks.high + metrics.gaps.critical + metrics.gaps.high}
                </div>
                <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remediation Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((metrics.remediations.completed / metrics.remediations.total) * 100)}%
                </div>
                <Progress
                  value={(metrics.remediations.completed / metrics.remediations.total) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Risk Distribution</CardTitle>
                <CardDescription>Risk levels across all vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vendorRiskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vendorRiskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gap Analysis Overview</CardTitle>
                <CardDescription>Distribution of identified gaps by severity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gapSeverityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {gapSeverityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Vendor Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Vendors</span>
                  <Badge variant="secondary">{metrics.vendors.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Vendors</span>
                  <Badge variant="default">{metrics.vendors.active}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Critical Vendors</span>
                  <Badge variant="destructive">{metrics.vendors.critical}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>High Risk</span>
                  <Badge variant="destructive">{metrics.vendors.highRisk}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Medium Risk</span>
                  <Badge variant="secondary">{metrics.vendors.mediumRisk}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Low Risk</span>
                  <Badge variant="outline">{metrics.vendors.lowRisk}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Trend</CardTitle>
                <CardDescription>Vendor risk levels over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    data={[
                      { month: "Jan", high: 12, medium: 25, low: 45 },
                      { month: "Feb", high: 15, medium: 28, low: 42 },
                      { month: "Mar", high: 18, medium: 30, low: 40 },
                      { month: "Apr", high: 14, medium: 32, low: 38 },
                      { month: "May", high: 16, medium: 29, low: 41 },
                      {
                        month: "Jun",
                        high: metrics.vendors.highRisk,
                        medium: metrics.vendors.mediumRisk,
                        low: metrics.vendors.lowRisk,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" />
                    <Area type="monotone" dataKey="medium" stackId="1" stroke="#f97316" fill="#f97316" />
                    <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="#22c55e" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.contracts.total}</div>
                <p className="text-xs text-muted-foreground">{metrics.contracts.active} currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(metrics.contracts.totalValue / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${(metrics.contracts.averageValue / 1000).toFixed(0)}K
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{metrics.contracts.expiringSoon}</div>
                <p className="text-xs text-muted-foreground">Within next 90 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Historical renewal rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Status Overview</CardTitle>
                <CardDescription>Current status of identified risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    High Risk
                  </span>
                  <Badge variant="destructive">{metrics.risks.high}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Medium Risk
                  </span>
                  <Badge variant="secondary">{metrics.risks.medium}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Low Risk
                  </span>
                  <Badge variant="outline">{metrics.risks.low}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Mitigated
                  </span>
                  <Badge variant="default">{metrics.risks.mitigated}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Mitigation Progress</CardTitle>
                <CardDescription>Progress on risk treatment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Mitigated Risks</span>
                      <span>{Math.round((metrics.risks.mitigated / metrics.risks.total) * 100)}%</span>
                    </div>
                    <Progress value={(metrics.risks.mitigated / metrics.risks.total) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Open Risks</span>
                      <span>{Math.round((metrics.risks.open / metrics.risks.total) * 100)}%</span>
                    </div>
                    <Progress
                      value={(metrics.risks.open / metrics.risks.total) * 100}
                      className="[&>div]:bg-orange-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gap Analysis Summary</CardTitle>
                <CardDescription>Identified gaps by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gapSeverityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {gapSeverityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gap Closure Progress</CardTitle>
                <CardDescription>Progress on addressing identified gaps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Gaps</span>
                  <Badge variant="secondary">{metrics.gaps.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Closed Gaps</span>
                  <Badge variant="default">{metrics.gaps.closed}</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Closure Rate</span>
                    <span>{Math.round((metrics.gaps.closed / metrics.gaps.total) * 100)}%</span>
                  </div>
                  <Progress value={(metrics.gaps.closed / metrics.gaps.total) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="remediations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Remediation Status</CardTitle>
                <CardDescription>Current status of remediation activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={remediationStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {remediationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remediation Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Completed
                  </span>
                  <Badge variant="default">{metrics.remediations.completed}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    In Progress
                  </span>
                  <Badge variant="secondary">{metrics.remediations.inProgress}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Overdue
                  </span>
                  <Badge variant="destructive">{metrics.remediations.overdue}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    On Track
                  </span>
                  <Badge variant="outline">{metrics.remediations.onTrack}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
