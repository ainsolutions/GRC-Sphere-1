"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Target,
  Users,
  Calendar,
  Zap,
} from "lucide-react"

interface Incident {
  id: number
  incident_id: string
  incident_title: string
  incident_type: string
  severity: "Critical" | "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  reported_by: string
  assigned_to: string
  reported_date: string
  detected_date?: string
  created_at: string
  updated_at: string
}

interface IncidentDashboardProps {
  incidents: Incident[]
}

export function IncidentDashboard({ incidents }: IncidentDashboardProps) {
  const [animatedValues, setAnimatedValues] = useState({
    totalIncidents: 0,
    openIncidents: 0,
    criticalIncidents: 0,
    resolvedIncidents: 0,
    avgResolutionTime: 0,
  })

  // Calculate statistics
  const stats = {
    total: incidents.length,
    open: incidents.filter((i) => i.status === "Open").length,
    inProgress: incidents.filter((i) => i.status === "In Progress").length,
    resolved: incidents.filter((i) => i.status === "Resolved").length,
    closed: incidents.filter((i) => i.status === "Closed").length,
    critical: incidents.filter((i) => i.severity === "Critical").length,
    high: incidents.filter((i) => i.severity === "High").length,
    medium: incidents.filter((i) => i.severity === "Medium").length,
    low: incidents.filter((i) => i.severity === "Low").length,
  }

  // Calculate average resolution time
  const calculateAvgResolutionTime = () => {
    const resolvedIncidents = incidents.filter((i) => i.status === "Resolved" || i.status === "Closed")
    if (resolvedIncidents.length === 0) return 0

    const totalTime = resolvedIncidents.reduce((acc, incident) => {
      const reported = new Date(incident.reported_date).getTime()
      const updated = new Date(incident.updated_at).getTime()
      const days = (updated - reported) / (1000 * 60 * 60 * 24)
      return acc + days
    }, 0)

    return Math.round((totalTime / resolvedIncidents.length) * 10) / 10
  }

  // Animate numbers
  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setAnimatedValues({
        totalIncidents: Math.round(stats.total * easeOut),
        openIncidents: Math.round(stats.open * easeOut),
        criticalIncidents: Math.round(stats.critical * easeOut),
        resolvedIncidents: Math.round(stats.resolved * easeOut),
        avgResolutionTime: calculateAvgResolutionTime() * easeOut,
      })

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [incidents])

  const getIncidentTypeDistribution = () => {
    const distribution: Record<string, number> = {}
    incidents.forEach((incident) => {
      distribution[incident.incident_type] = (distribution[incident.incident_type] || 0) + 1
    })
    return Object.entries(distribution)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const getRecentIncidents = () => {
    return incidents
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-red-600"
      case "In Progress":
        return "text-blue-600"
      case "Resolved":
        return "text-green-600"
      case "Closed":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-blue-500 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-count-up">{animatedValues.totalIncidents}</div>
            <p className="text-xs text-muted-foreground mt-1">All reported incidents</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 animate-fade-in delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-count-up">{animatedValues.openIncidents}</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 animate-fade-in delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-count-up">{animatedValues.criticalIncidents}</div>
            <p className="text-xs text-muted-foreground mt-1">High priority incidents</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 animate-fade-in delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-count-up">{animatedValues.resolvedIncidents}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 animate-fade-in delay-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold animate-count-up">{animatedValues.avgResolutionTime.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Days to resolve</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution & Severity Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Incident Status Distribution
            </CardTitle>
            <CardDescription>Breakdown of incidents by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Open</span>
                  <span className="text-sm font-bold text-red-600">{stats.open}</span>
                </div>
                <Progress value={(stats.open / stats.total) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">In Progress</span>
                  <span className="text-sm font-bold text-blue-600">{stats.inProgress}</span>
                </div>
                <Progress value={(stats.inProgress / stats.total) * 100} className="h-2 bg-blue-100" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Resolved</span>
                  <span className="text-sm font-bold text-green-600">{stats.resolved}</span>
                </div>
                <Progress value={(stats.resolved / stats.total) * 100} className="h-2 bg-green-100" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Closed</span>
                  <span className="text-sm font-bold text-gray-600">{stats.closed}</span>
                </div>
                <Progress value={(stats.closed / stats.total) * 100} className="h-2 bg-gray-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Severity Breakdown
            </CardTitle>
            <CardDescription>Incidents by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Critical</span>
                  </div>
                  <span className="text-sm font-bold">{stats.critical}</span>
                </div>
                <Progress value={(stats.critical / stats.total) * 100} className="h-2 bg-red-100" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <span className="text-sm font-bold">{stats.high}</span>
                </div>
                <Progress value={(stats.high / stats.total) * 100} className="h-2 bg-orange-100" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <span className="text-sm font-bold">{stats.medium}</span>
                </div>
                <Progress value={(stats.medium / stats.total) * 100} className="h-2 bg-yellow-100" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Low</span>
                  </div>
                  <span className="text-sm font-bold">{stats.low}</span>
                </div>
                <Progress value={(stats.low / stats.total) * 100} className="h-2 bg-green-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incident Type Distribution & Recent Incidents */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Incident Types
            </CardTitle>
            <CardDescription>Most common incident types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getIncidentTypeDistribution().map((item, index) => (
                <div key={index} className="animate-fade-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.type}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                  <Progress value={(item.count / stats.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Incidents
            </CardTitle>
            <CardDescription>Latest reported incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getRecentIncidents().map((incident, index) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fade-in"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">{incident.incident_title}</span>
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(incident.severity)}`}></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(incident.reported_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(incident.status)}>
                    {incident.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Indicators */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.resolved + stats.closed} of {stats.total} incidents resolved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              Active Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.open + stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">Incidents currently being handled</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              Response Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {animatedValues.avgResolutionTime.toFixed(1)} days
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average time to resolution</p>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

