"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { AIAnalyticsDashboard } from "@/components/ai-analytics-dashboard"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  Users,
  Zap,
  Brain,
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [timeRange])

  const metrics = {
    riskTrend: timeRange === "7d" ? 5 : timeRange === "30d" ? -12 : -8,
    complianceScore: timeRange === "7d" ? 89 : timeRange === "30d" ? 87 : 91,
    incidentCount: timeRange === "7d" ? 3 : timeRange === "30d" ? 15 : 45,
    controlEffectiveness: timeRange === "7d" ? 94 : timeRange === "30d" ? 92 : 88,
  }

  return (
    <div className="min-h-screen aurora-bg">
      <div className="aurora-overlay"></div>
      <div className="flex aurora-content">
        {/* <Sidebar /> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <Header /> */}
          <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                  Security Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Advanced insights and AI-powered predictions for your security posture
                </p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in"
                key={`risk-${animationKey}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risk Trend</CardTitle>
                  {metrics.riskTrend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-500 animate-bounce" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500 animate-bounce" />
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold animate-count-up ${metrics.riskTrend > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {metrics.riskTrend > 0 ? "+" : ""}
                    {metrics.riskTrend}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.riskTrend > 0 ? "Risk increase" : "Risk reduction"} vs previous period
                  </p>
                </CardContent>
              </Card>

              <Card
                className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in delay-100"
                key={`compliance-${animationKey}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                  <Shield className="h-4 w-4 text-blue-500 animate-spin-slow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 animate-count-up">{metrics.complianceScore}%</div>
                  <p className="text-xs text-muted-foreground">Overall compliance rating</p>
                </CardContent>
              </Card>

              <Card
                className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in delay-200"
                key={`incidents-${animationKey}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600 animate-count-up">{metrics.incidentCount}</div>
                  <p className="text-xs text-muted-foreground">Incidents in selected period</p>
                </CardContent>
              </Card>

              <Card
                className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in delay-300"
                key={`effectiveness-${animationKey}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Control Effectiveness</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 animate-count-up">
                    {metrics.controlEffectiveness}%
                  </div>
                  <p className="text-xs text-muted-foreground">Controls operating effectively</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Analytics Section */}
            <Card className="gradient-card-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
                  AI-Powered Predictive Analytics
                </CardTitle>
                <CardDescription>Machine learning insights for remediation patterns and forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <AIAnalyticsDashboard />
              </CardContent>
            </Card>

            {/* Framework Compliance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gradient-card-primary transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 animate-pulse" />
                    NIST CSF Maturity Levels
                  </CardTitle>
                  <CardDescription>Current implementation status across NIST functions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Identify", level: "Managed", score: 95, color: "from-green-500 to-blue-500" },
                    { name: "Protect", level: "Managed", score: 88, color: "from-blue-500 to-cyan-500" },
                    { name: "Detect", level: "Defined", score: 72, color: "from-yellow-500 to-orange-500" },
                    { name: "Respond", level: "Developing", score: 65, color: "from-orange-500 to-red-500" },
                    { name: "Recover", level: "Initial", score: 58, color: "from-red-500 to-pink-500" },
                  ].map((item, index) => (
                    <div
                      key={item.name}
                      className="space-y-2 animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.level}</Badge>
                          <span className="text-sm font-bold">{item.score}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${item.color} h-2 rounded-full animate-progress`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gradient-card-secondary transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 animate-spin-slow" />
                    ISO 27001 Control Categories
                  </CardTitle>
                  <CardDescription>Implementation status by control domain</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Information Security Policies", implemented: 12, total: 12, percentage: 100 },
                    { name: "Access Control", implemented: 14, total: 15, percentage: 93 },
                    { name: "Cryptography", implemented: 8, total: 10, percentage: 80 },
                    { name: "Physical Security", implemented: 11, total: 14, percentage: 79 },
                    { name: "Operations Security", implemented: 13, total: 18, percentage: 72 },
                  ].map((item, index) => (
                    <div
                      key={item.name}
                      className="space-y-2 animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.implemented}/{item.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-progress"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Threat Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="gradient-card transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 animate-pulse" />
                    Active Threats
                  </CardTitle>
                  <CardDescription>Current threat landscape</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Phishing Campaigns", count: 23, severity: "High", color: "text-red-600" },
                    { name: "Malware Detections", count: 15, severity: "Medium", color: "text-yellow-600" },
                    { name: "Suspicious Network Activity", count: 8, severity: "Low", color: "text-blue-600" },
                    { name: "Failed Login Attempts", count: 156, severity: "Info", color: "text-gray-600" },
                  ].map((threat, index) => (
                    <div
                      key={threat.name}
                      className="flex items-center justify-between animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div>
                        <div className="font-medium">{threat.name}</div>
                        <div className="text-sm text-muted-foreground">{threat.severity} severity</div>
                      </div>
                      <div className={`text-xl font-bold ${threat.color} animate-pulse`}>{threat.count}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gradient-card transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 animate-bounce" />
                    Incident Response
                  </CardTitle>
                  <CardDescription>Response time metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg animate-pulse">
                    <div className="text-3xl font-bold text-green-600 animate-count-up">2.5h</div>
                    <div className="text-sm text-green-600">Average Response Time</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Detection to Response</span>
                      <span className="font-medium">15 min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response to Containment</span>
                      <span className="font-medium">1.2h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Containment to Resolution</span>
                      <span className="font-medium">1.3h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 animate-pulse" />
                    Security Training
                  </CardTitle>
                  <CardDescription>Employee awareness metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse">
                    <div className="text-3xl font-bold text-blue-600 animate-count-up">94%</div>
                    <div className="text-sm text-blue-600">Training Completion</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Phishing Simulation</span>
                      <span className="font-medium text-green-600">8% click rate</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Security Awareness</span>
                      <span className="font-medium text-blue-600">96% pass rate</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Incident Reporting</span>
                      <span className="font-medium text-purple-600">87% accuracy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Assessment Matrix */}
            <Card className="gradient-card transform hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 animate-bounce" />
                  Risk Assessment Matrix
                </CardTitle>
                <CardDescription>Risk distribution across likelihood and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  <div className="text-xs font-medium text-center">Impact →</div>
                  <div className="text-xs font-medium text-center">Very Low</div>
                  <div className="text-xs font-medium text-center">Low</div>
                  <div className="text-xs font-medium text-center">Medium</div>
                  <div className="text-xs font-medium text-center">High</div>
                </div>
                {["Very High", "High", "Medium", "Low", "Very Low"].map((likelihood, rowIndex) => (
                  <div key={likelihood} className="grid grid-cols-5 gap-2 mb-2">
                    <div className="text-xs font-medium flex items-center">
                      {rowIndex === 0 && <span className="transform -rotate-90 whitespace-nowrap">Likelihood</span>}
                      {rowIndex === 2 && likelihood}
                    </div>
                    {Array.from({ length: 4 }, (_, colIndex) => {
                      const riskLevel = (4 - rowIndex) * (colIndex + 1)
                      const colorClass =
                        riskLevel >= 12
                          ? "bg-red-500"
                          : riskLevel >= 8
                            ? "bg-orange-500"
                            : riskLevel >= 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      const count = Math.floor(Math.random() * 10) + 1
                      return (
                        <div
                          key={colIndex}
                          className={`h-12 ${colorClass} rounded flex items-center justify-center text-white font-bold animate-pulse`}
                          style={{ animationDelay: `${(rowIndex * 4 + colIndex) * 100}ms` }}
                        >
                          {count}
                        </div>
                      )
                    })}
                  </div>
                ))}
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    Low (1-3)
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    Medium (4-7)
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    High (8-11)
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    Critical (12-16)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}
