"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Target,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Eye,
  RefreshCw,
  Brain,
  Network,
  Lock,
  Database,
  Globe,
  Cpu,
  BarChart3,
  PieChart,
  LineChart,
  Gauge
} from "lucide-react"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  LineChart as RechartsLineChart, 
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts"

interface NISTCSFDashboardProps {
  onRefresh?: () => void
  refreshing?: boolean
}

const NIST_COLORS = {
  identify: '#3b82f6',
  protect: '#10b981', 
  detect: '#f59e0b',
  respond: '#ef4444',
  recover: '#8b5cf6',
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  planning: '#6b7280',
  inProgress: '#3b82f6',
  completed: '#10b981',
  onHold: '#f59e0b'
}

export function NISTCSFDashboard({ onRefresh, refreshing = false }: NISTCSFDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/nist-csf/dashboard")
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Error fetching NIST CSF dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const data = dashboardData || {}

  // Risk distribution by function
  const riskByFunction = data.riskByFunction || []
  const riskByLevel = data.riskByLevel || []
  const mitigationStatus = data.mitigationStatus || []
  const investmentData = data.investmentData || []
  const maturityProgress = data.maturityProgress || []
  const threatLandscape = data.threatLandscape || []
  const complianceMetrics = data.complianceMetrics || {}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
              NIST CSF Cyber Hub
            </h2>
            <p>Advanced risk analytics and mitigation orchestration</p>
          </div>
        </div>
        <Button onClick={onRefresh || fetchDashboardData} disabled={refreshing} className="glass-card text-cyan-300 hover:bg-white/20">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Framework Coverage</CardTitle>
            <Shield className="h-4 w-4 text-blue-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-300 animate-count-up">
              {complianceMetrics.frameworkCoverage || 87}%
            </div>
            <p className="text-xs text-blue-400 mt-1">
              NIST CSF Implementation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Active Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-300 animate-count-up">
              {data.totalRisks || 0}
            </div>
            <p className="text-xs text-red-400 mt-1">
              Risk identified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Mitigation Progress</CardTitle>
            <Target className="h-4 w-4 text-green-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-300 animate-count-up">
              {data.mitigationProgress || 73}%
            </div>
            <p className="text-xs text-green-400 mt-1">
              Plans in execution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Investment ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-300 animate-count-up">
              ${(data.totalInvestment || 0) / 1000000}M
            </div>
            <p className="text-xs text-purple-400 mt-1">
              Total security investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Framework Functions Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <BarChart3 className="h-5 w-5 mr-2 animate-bounce" />
              Risk Distribution by Function
            </CardTitle>
            <CardDescription className="text-gray-400">
              NIST CSF function risk concentration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskByFunction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="function_code" 
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="risk_count" fill="#3b82f6" name="Risk Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <PieChart className="h-5 w-5 mr-2 animate-pulse" />
              Risk Severity Matrix
            </CardTitle>
            <CardDescription className="text-gray-400">
              Risk level distribution across framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={riskByLevel}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {riskByLevel.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={NIST_COLORS[entry.level.toLowerCase() as keyof typeof NIST_COLORS] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Mitigation Status & Investment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-purple-600">
              <Activity className="h-5 w-5 mr-2 animate-pulse" />
              Mitigation Status Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current mitigation plan execution status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mitigationStatus.map((status: any, index: number) => (
              <div key={status.status} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{status.status}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        status.status === 'Completed' ? 'text-green-600 border-green-500/50' :
                        status.status === 'In Progress' ? 'text-blue-600 border-blue-500/50' :
                        status.status === 'Planning' ? 'text-yellow-600 border-yellow-500/50' :
                        'text-red-400 border-red-500/50'
                      }
                    >
                      {status.count}
                    </Badge>
                    <span className="text-sm">{status.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      status.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      status.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      status.status === 'Planning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    className="transition-all duration-1000"
                    style={{
                      width: `${status.percentage}%`,
                      animationDelay: `${index * 200}ms`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cyan-600">
              <TrendingUp className="h-5 w-5 mr-2 animate-bounce" />
              Investment vs Risk Reduction
            </CardTitle>
            <CardDescription className="text-gray-400">
              Security investment effectiveness analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="function" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="investment"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Investment ($M)"
                />
                <Area
                  type="monotone"
                  dataKey="risk_reduction"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Risk Reduction %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maturity Assessment & Threat Landscape */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Gauge className="h-5 w-5 mr-2 animate-pulse" />
              Framework Maturity Assessment
            </CardTitle>
            <CardDescription className="text-gray-400">
              NIST CSF implementation maturity by function
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {maturityProgress.map((maturity: any, index: number) => (
              <div key={maturity.function} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{maturity.function}</span>
                  <span>{maturity.score}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      maturity.score >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      maturity.score >= 70 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      maturity.score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    className="transition-all duration-1000"
                    style={{
                      width: `${maturity.score}%`,
                      animationDelay: `${index * 150}ms`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Eye className="h-5 w-5 mr-2 animate-bounce" />
              Threat Landscape Analysis
            </CardTitle>
            <CardDescription>
              Emerging threats and attack vectors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={threatLandscape}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Threat Count"
                />
                <Line
                  type="monotone"
                  dataKey="mitigations"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Mitigations"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

     </div>
  )
}
