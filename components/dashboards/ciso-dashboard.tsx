"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Zap,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
  Users,
  Database,
  Network,
  Globe
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts"

interface CISODashboardProps {
  metrics: any
  onRefresh: () => void
  refreshing: boolean
}

const SECURITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  resolved: '#10b981',
  open: '#ef4444',
  inProgress: '#f97316',
  network: '#3b82f6',
  endpoint: '#8b5cf6',
  application: '#06b6d4',
  data: '#10b981'
}

export function CISODashboard({ metrics, onRefresh, refreshing }: CISODashboardProps) {
  // CISO-specific security metrics
  const securityMetrics = {
    threatDetectionRate: 94.2,
    incidentResponseTime: 12, // minutes
    complianceScore: 87,
    zeroDayCoverage: 78,
    securityAwarenessScore: 82,
    breachPreventionRate: 96.8
  }

  const threatData = [
    { category: 'Malware', count: 45, trend: '+12%' },
    { category: 'Phishing', count: 78, trend: '+8%' },
    { category: 'DDoS', count: 23, trend: '-15%' },
    { category: 'Ransomware', count: 12, trend: '+25%' },
    { category: 'Insider Threats', count: 8, trend: '+5%' }
  ]

  const incidentTrendData = [
    { month: 'Jan', incidents: 12, resolved: 11, escalated: 2 },
    { month: 'Feb', incidents: 18, resolved: 16, escalated: 3 },
    { month: 'Mar', incidents: 15, resolved: 14, escalated: 1 },
    { month: 'Apr', incidents: 22, resolved: 19, escalated: 4 },
    { month: 'May', incidents: 19, resolved: 17, escalated: 3 },
    { month: 'Jun', incidents: 16, resolved: 15, escalated: 2 }
  ]

  const securityPostureData = [
    { category: 'Network Security', score: 92, status: 'Excellent' },
    { category: 'Endpoint Protection', score: 88, status: 'Good' },
    { category: 'Data Protection', score: 85, status: 'Good' },
    { category: 'Access Control', score: 91, status: 'Excellent' },
    { category: 'Incident Response', score: 78, status: 'Needs Attention' },
    { category: 'Compliance', score: 87, status: 'Good' }
  ]

  const complianceFrameworkData = [
    { name: 'ISO 27001', compliance: 89, lastAudit: '2024-01-15', status: 'Compliant' },
    { name: 'NIST CSF', compliance: 92, lastAudit: '2024-02-01', status: 'Compliant' },
    { name: 'GDPR', compliance: 85, lastAudit: '2024-01-30', status: 'Compliant' },
    { name: 'PCI DSS', compliance: 78, lastAudit: '2024-03-01', status: 'At Risk' },
    { name: 'SOX', compliance: 91, lastAudit: '2024-02-15', status: 'Compliant' }
  ]

  return (
    <div className="space-y-8">
      {/* CISO Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Information Security Operations Center
            </h2>
            <p className="text-slate-300">Security threat landscape and compliance monitoring</p>
          </div>
        </div>
        <Button onClick={onRefresh} disabled={refreshing} className="glass-card text-cyan-300 hover:bg-white/20">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Core Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Threat Detection</CardTitle>
            <Eye className="h-4 w-4 text-green-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 animate-count-up">
              {securityMetrics.threatDetectionRate}%
            </div>
            <p className="text-xs text-green-600 mt-1">
              Detection accuracy
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
              {securityMetrics.incidentResponseTime}m
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Compliance Score</CardTitle>
            <FileText className="h-4 w-4 text-purple-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 animate-count-up">
              {securityMetrics.complianceScore}%
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Overall compliance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Breach Prevention</CardTitle>
            <Lock className="h-4 w-4 text-cyan-400 animate-pulse" />
          </CardHeader>
          <CardContent>
          <div className="text-3xl font-bold text-cyan-600 animate-count-up">
              {securityMetrics.breachPreventionRate}%
            </div>
            <p className="text-xs text-cyan-600 mt-1">
              Prevention rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Landscape & Incident Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="h-5 w-5 mr-2 animate-pulse" />
              Threat Landscape
            </CardTitle>
            <CardDescription>
              Current threat distribution and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="category"
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
                <Bar dataKey="count" fill="#ef4444" name="Threat Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Activity className="h-5 w-5 mr-2 animate-bounce" />
              Incident Response Trends
            </CardTitle>
            <CardDescription>
              Incident detection, resolution, and escalation patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={incidentTrendData}>
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
                <Area
                  type="monotone"
                  dataKey="incidents"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Incidents Detected"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Incidents Resolved"
                />
                <Area
                  type="monotone"
                  dataKey="escalated"
                  stackId="3"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.6}
                  name="Incidents Escalated"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Security Posture & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Shield className="h-5 w-5 mr-2 animate-pulse" />
              Security Posture Assessment
            </CardTitle>
            <CardDescription>
              Security control effectiveness across domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityPostureData.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        item.status === 'Excellent' ? 'text-green-400 border-green-500/50' :
                        item.status === 'Good' ? 'text-blue-400 border-blue-500/50' :
                        item.status === 'Needs Attention' ? 'text-red-400 border-red-500/50' :
                        'text-yellow-400 border-yellow-500/50'
                      }
                    >
                      {item.status}
                    </Badge>
                    <span className="text-sm text-slate-400">{item.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      item.score >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      item.score >= 80 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      item.score >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{
                      width: `${item.score}%`,
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
            <CardTitle>
              <FileText className="h-5 w-5 mr-2 animate-bounce" />
              Compliance Framework Status
            </CardTitle>
            <CardDescription>
              Regulatory compliance across frameworks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceFrameworkData.map((framework, index) => (
              <div key={framework.name} className="flex items-center justify-between p-3 bg-slate-800/100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    framework.status === 'Compliant' ? 'bg-green-500' :
                    framework.status === 'At Risk' ? 'bg-red-500' : 'bg-yellow-500'
                  } animate-pulse`}></div>
                  <div>
                    <div className="font-medium text-white">{framework.name}</div>
                    <div className="text-sm text-slate-400">Last audit: {framework.lastAudit}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{framework.compliance}%</div>
                  <Badge
                    variant="outline"
                    className={
                      framework.status === 'Compliant' ? 'text-green-400 border-green-500/50' :
                      'text-red-400 border-red-500/50'
                    }
                  >
                    {framework.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Operations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-800" />
              <div>
                <div className="text-2xl font-bold text-blue-300">
                  {securityMetrics.securityAwarenessScore}%
                </div>
                <div className="text-sm text-blue-600">Security Awareness</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-purple-800" />
              <div>
                <div className="text-2xl font-bold text-purple-300">
                  {securityMetrics.zeroDayCoverage}%
                </div>
                <div className="text-sm text-purple-600">Zero-day Coverage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-green-800" />
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {metrics?.vulnerabilities?.reduce((sum: number, item: any) => sum + item.count, 0) || 0}
                </div>
                <div className="text-sm text-green-600">Active Vulnerabilities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-red-800" />
              <div>
                <div className="text-2xl font-bold text-red-300">
                  {metrics?.incidents?.critical_count || 0}
                </div>
                <div className="text-sm text-red-600">Critical Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
