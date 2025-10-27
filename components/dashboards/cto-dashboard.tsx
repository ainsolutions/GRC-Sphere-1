"use client"

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Cpu,
  Server,
  Zap,
  Database,
  Cloud,
  Network,
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  RefreshCw,
  Settings,
  HardDrive,
  Wifi,
  Code
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts"
import useSWR from "swr"

interface CTODashboardProps {
  metrics: any
  onRefresh: () => void
  refreshing: boolean
}

const TECH_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  infrastructure: '#3b82f6',
  applications: '#8b5cf6',
  network: '#06b6d4',
  data: '#10b981'
}

export function CTODashboard({ metrics, onRefresh, refreshing }: CTODashboardProps) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())

  // Data: Vulnerabilities
  const { data: vulnStatsResp } = useSWR(`/api/vulnerabilities/getVulnerabilityStats`, fetcher)
  const vulnStats = vulnStatsResp?.data || {}

  const vulnerabilityStatusData = [
    { name: 'Open', count: Number(vulnStats.open || 0) },
    { name: 'In Progress', count: Number(vulnStats.in_progress || 0) },
    { name: 'Resolved', count: Number(vulnStats.resolved || 0) },
  ]
  const vulnerabilitySeverityData = [
    { name: 'Critical', count: Number(vulnStats.critical || 0), color: '#ef4444' },
    { name: 'High', count: Number(vulnStats.high || 0), color: '#f97316' },
    { name: 'Medium', count: Number(vulnStats.medium || 0), color: '#eab308' },
    { name: 'Low', count: Number(vulnStats.low || 0), color: '#22c55e' },
  ]

  // Data: Incident Remediation
  const { data: incidentStatsResp } = useSWR(`/api/incident-remediation/stats`, fetcher)
  const incidentStats = incidentStatsResp?.data || {}
  const incidentStatusData = (incidentStats.statusStats || []).map((s: any) => ({ name: s.status, count: Number(s.count || 0) }))
  const incidentPriorityData = (incidentStats.priorityStats || []).map((p: any) => ({ name: p.priority, count: Number(p.count || 0) }))

  // Data: Technology Risks
  const { data: techRisksResp } = useSWR(`/api/technology-risks?limit=200`, fetcher)
  const techRisks = Array.isArray(techRisksResp?.risks) ? techRisksResp.risks : []
  const techRiskStatusMap: Record<string, number> = {}
  const techRiskLevelMap: Record<string, number> = {}
  const techTreatmentStateMap: Record<string, number> = {}
  techRisks.forEach((r: any) => {
    const status = (r.status || 'open') as string
    const level = (r.risk_level || 'Low') as string
    const treatment = (r.treatment_state || 'planned') as string
    techRiskStatusMap[status] = (techRiskStatusMap[status] || 0) + 1
    techRiskLevelMap[level] = (techRiskLevelMap[level] || 0) + 1
    techTreatmentStateMap[treatment] = (techTreatmentStateMap[treatment] || 0) + 1
  })
  const techRiskStatusData = Object.entries(techRiskStatusMap).map(([name, count]) => ({ name, count }))
  const techRiskLevelData = Object.entries(techRiskLevelMap).map(([name, count]) => ({ name, count }))
  const techTreatmentStateData = Object.entries(techTreatmentStateMap).map(([name, count]) => ({ name, count }))

  // Data: Controls Implementation
  const { data: controlsResp } = useSWR(`/api/governance/controls`, fetcher)
  const controls = Array.isArray(controlsResp?.data) ? controlsResp.data : []
  const controlImplStatusMap: Record<string, number> = {}
  controls.forEach((c: any) => {
    const s = (c.implementation_status || 'not_implemented') as string
    controlImplStatusMap[s] = (controlImplStatusMap[s] || 0) + 1
  })
  const controlImplStatusData = Object.entries(controlImplStatusMap).map(([name, count]) => ({ name, count }))


  const infrastructureData = [
    { name: 'Servers', utilized: 85, total: 100, color: TECH_COLORS.infrastructure },
    { name: 'Storage', utilized: 72, total: 100, color: TECH_COLORS.data },
    { name: 'Network', utilized: 68, total: 100, color: TECH_COLORS.network },
    { name: 'Applications', utilized: 91, total: 100, color: TECH_COLORS.applications }
  ]

  const systemPerformanceData = [
    { time: '00:00', cpu: 45, memory: 62, network: 23 },
    { time: '04:00', cpu: 38, memory: 58, network: 18 },
    { time: '08:00', cpu: 72, memory: 78, network: 45 },
    { time: '12:00', cpu: 89, memory: 85, network: 67 },
    { time: '16:00', cpu: 76, memory: 82, network: 52 },
    { time: '20:00', cpu: 54, memory: 68, network: 34 }
  ]

  const techProjectsData = [
    { name: 'Cloud Migration', progress: 85, risk: 'Medium', status: 'On Track' },
    { name: 'DevOps Pipeline', progress: 92, risk: 'Low', status: 'Ahead' },
    { name: 'Security Automation', progress: 67, risk: 'High', status: 'At Risk' },
    { name: 'Data Lake', progress: 43, risk: 'Medium', status: 'Delayed' },
    { name: 'AI/ML Platform', progress: 78, risk: 'Low', status: 'On Track' }
  ]

  // Derived fallback for vulnerability severity (if API not loaded yet)
  const vulnerabilityData = vulnerabilitySeverityData.some(v => v.count > 0)
    ? vulnerabilitySeverityData.map(v => ({ category: v.name, count: v.count, severity: v.name }))
    : [
        { category: 'Critical', count: 0, severity: 'Critical' },
        { category: 'High', count: 0, severity: 'High' },
        { category: 'Medium', count: 0, severity: 'Medium' },
        { category: 'Low', count: 0, severity: 'Low' }
      ]

  return (
    <div className="space-y-8">
      {/* CTO Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
            <Cpu className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Technology Operations Dashboard
            </h2>
            <p className="text-slate-300">Infrastructure performance and technology innovation metrics</p>
          </div>
        </div>
        <Button onClick={onRefresh} disabled={refreshing} className="glass-card text-cyan-300 hover:bg-white/20">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Core Technology Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>System Uptime</CardTitle>
            <Server className="h-4 w-4 text-green-700 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 animate-count-up">
              {techMetrics.systemUptime}%
            </div>
            <p className="text-xs text-green-700 mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Response Time</CardTitle>
            <Zap className="h-4 w-4 text-blue-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 animate-count-up">
              {techMetrics.averageResponseTime}ms
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Average API response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Infrastructure Load</CardTitle>
            <HardDrive className="h-4 w-4 text-purple-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 animate-count-up">
              {techMetrics.infrastructureUtilization}%
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Current utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Cloud Migration</CardTitle>
            <Cloud className="h-4 w-4 text-cyan-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600 animate-count-up">
              {techMetrics.cloudMigrationProgress}%
            </div>
            <p className="text-xs text-cyan-600 mt-1">
              Migration progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Infrastructure Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
          <CardHeader>
            <CardTitle>
              <Server className="h-5 w-5 mr-2 animate-bounce" />
              Infrastructure Utilization
            </CardTitle>
            <CardDescription>
              Resource usage across technology stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {infrastructureData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="text-slate-400">{item.utilized}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
                      style={{
                        width: `${item.utilized}%`,
                        animationDelay: `${index * 200}ms`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Activity className="h-5 w-5 mr-2 animate-pulse" />
              System Performance
            </CardTitle>
            <CardDescription>
              Real-time system metrics (24h view)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={systemPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" tick={{ fill: "#9ca3af", fontSize: 12 }} />
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
                  dataKey="cpu"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="CPU %"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Memory %"
                />
                <Area
                  type="monotone"
                  dataKey="network"
                  stackId="3"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Network %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Technology Projects & Vulnerabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Code className="h-5 w-5 mr-2 animate-pulse" />
              Technology Projects
            </CardTitle>
            <CardDescription>
              Key technology initiatives and their progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {techProjectsData.map((project, index) => (
              <div key={project.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">{project.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        project.risk === 'Low' ? 'text-green-400 border-green-500/50' :
                        project.risk === 'Medium' ? 'text-yellow-400 border-yellow-500/50' :
                        'text-red-400 border-red-500/50'
                      }
                    >
                      {project.risk} Risk
                    </Badge>
                    <span className="text-sm text-slate-400">{project.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      project.status === 'Ahead' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      project.status === 'On Track' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      project.status === 'At Risk' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      'bg-gradient-to-r from-yellow-500 to-yellow-600'
                    }`}
                    style={{
                      width: `${project.progress}%`,
                      animationDelay: `${index * 150}ms`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Status: {project.status}</span>
                  <span>Target: Q4 2024</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Shield className="h-5 w-5 mr-2 animate-pulse" />
              Vulnerability Landscape
            </CardTitle>
            <CardDescription>
              Security vulnerabilities by severity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vulnerabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#ef4444" name="Vulnerabilities" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-300">
              <div>Overdue: <span className="text-red-400 font-semibold">{Number(vulnStats.overdue || 0)}</span></div>
              <div>Total: <span className="text-slate-200 font-semibold">{Number(vulnStats.total || 0)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remediation Patterns: Vulnerabilities and Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="h-5 w-5 mr-2" />
              Vulnerability Remediation
            </CardTitle>
            <CardDescription>
              Status distribution and remediation progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={vulnerabilityStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "6px", color: "#fff" }} />
                <Bar dataKey="count" fill="#3b82f6" name="Items" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Activity className="h-5 w-5 mr-2" />
              Incident Remediation
            </CardTitle>
            <CardDescription>
              Status and priority distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "6px", color: "#fff" }} />
                    <Bar dataKey="count" fill="#10b981" name="Status" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentPriorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "6px", color: "#fff" }} />
                    <Bar dataKey="count" fill="#f59e0b" name="Priority" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Health Overview */
      }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {techMetrics.apiAvailability}%
                </div>
                <div className="text-sm text-green-600">API Availability</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-300">
                  {techMetrics.dataCenterCapacity}%
                </div>
                <div className="text-sm text-blue-600">DC Capacity Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-300">
                  {metrics?.assetsByCriticality?.reduce((sum: number, item: any) => sum + item.count, 0) || 0}
                </div>
                <div className="text-sm text-purple-600">Active Systems</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-red-300">
                  {metrics?.vulnerabilities?.reduce((sum: number, item: any) => sum + item.count, 0) || 0}
                </div>
                <div className="text-sm text-red-600">Critical Vulns</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Risks and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Shield className="h-5 w-5 mr-2" />
              Technology Risks Status
            </CardTitle>
            <CardDescription>
              Distribution by risk level and treatment state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techRiskLevelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "6px", color: "#fff" }} />
                    <Bar dataKey="count" fill="#ef4444" name="Risk Level" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techTreatmentStateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "6px", color: "#fff" }} />
                    <Bar dataKey="count" fill="#3b82f6" name="Treatment" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-300">
              Total Risks: <span className="font-semibold">{techRisks.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Settings className="h-5 w-5 mr-2" />
              Controls Implementation Status
            </CardTitle>
            <CardDescription>
              Distribution by implementation status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={controlImplStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "6px", color: "#fff" }} />
                <Bar dataKey="count" fill="#8b5cf6" name="Controls" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-slate-300">
              Total Controls: <span className="font-semibold">{controls.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
