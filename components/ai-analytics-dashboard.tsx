"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "recharts"
import { Brain, TrendingUp, AlertTriangle, Shield, Target, Activity, Zap, RefreshCw } from "lucide-react"

// Mock data for AI predictions
const mockPredictionData = {
  riskTrends: [
    { month: "Jan", predicted: 65, actual: 62, confidence: 85 },
    { month: "Feb", predicted: 59, actual: 58, confidence: 88 },
    { month: "Mar", predicted: 72, actual: 70, confidence: 82 },
    { month: "Apr", predicted: 68, actual: 71, confidence: 79 },
    { month: "May", predicted: 75, actual: null, confidence: 84 },
    { month: "Jun", predicted: 71, actual: null, confidence: 81 },
  ],
  threatPredictions: [
    { type: "Phishing", likelihood: 85, impact: "High", trend: "increasing" },
    { type: "Malware", likelihood: 72, impact: "Medium", trend: "stable" },
    { type: "Insider Threat", likelihood: 45, impact: "High", trend: "decreasing" },
    { type: "DDoS", likelihood: 38, impact: "Medium", trend: "stable" },
  ],
  remediationPatterns: [
    { category: "Access Control", avgTime: 2.5, successRate: 94, priority: "High" },
    { category: "Network Security", avgTime: 4.2, successRate: 87, priority: "Medium" },
    { category: "Data Protection", avgTime: 3.1, successRate: 91, priority: "High" },
    { category: "Incident Response", avgTime: 1.8, successRate: 96, priority: "Critical" },
  ],
  complianceForecasting: [
    { framework: "ISO 27001", current: 87, predicted: 92, target: 95 },
    { framework: "NIST CSF", current: 82, predicted: 89, target: 90 },
    { framework: "SOC 2", current: 91, predicted: 94, target: 95 },
    { framework: "GDPR", current: 78, predicted: 85, target: 90 },
  ],
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AIAnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [predictions, setPredictions] = useState(mockPredictionData)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshPredictions = async () => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would call your AI API
      // For now, we'll just update the timestamp and add some variation to the data
      const updatedData = {
        ...mockPredictionData,
        riskTrends: mockPredictionData.riskTrends.map((item) => ({
          ...item,
          predicted: item.predicted + Math.floor(Math.random() * 10 - 5),
          confidence: Math.max(70, Math.min(95, item.confidence + Math.floor(Math.random() * 10 - 5))),
        })),
      }

      setPredictions(updatedData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to refresh predictions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold">AI Predictive Analytics</h2>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</p>
          </div>
        </div>
        <Button variant="accent" onClick={refreshPredictions} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Updating..." : "Refresh Predictions"}
        </Button>
      </div>

      <Tabs defaultValue="risk-trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="risk-trends">Risk Trends</TabsTrigger>
          <TabsTrigger value="threat-intel">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="remediation">Remediation Patterns</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="risk-trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Risk Score Predictions
              </CardTitle>
              <CardDescription>AI-powered forecasting of risk trends with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictions.riskTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} name="Actual Risk Score" />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Risk Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {predictions.riskTrends.slice(-3).map((item, index) => (
                  <div key={item.month} className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{item.month}</div>
                    <div className="text-2xl font-bold text-blue-600">{item.predicted}</div>
                    <div className="text-sm text-muted-foreground">{item.confidence}% confidence</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threat-intel" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Threat Likelihood Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.threatPredictions.map((threat, index) => (
                  <div key={threat.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{threat.type}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={threat.impact === "High" ? "destructive" : "secondary"}>{threat.impact}</Badge>
                        <span className="text-sm font-bold">{threat.likelihood}%</span>
                      </div>
                    </div>
                    <Progress value={threat.likelihood} className="h-2" />
                    <div className="text-xs text-muted-foreground">Trend: {threat.trend}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={predictions.threatPredictions}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, likelihood }) => `${type}: ${likelihood}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="likelihood"
                      >
                        {predictions.threatPredictions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Remediation Pattern Analysis
              </CardTitle>
              <CardDescription>AI insights into remediation effectiveness and time patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictions.remediationPatterns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgTime" fill="#8884d8" name="Avg Time (days)" />
                    <Bar yAxisId="right" dataKey="successRate" fill="#82ca9d" name="Success Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {predictions.remediationPatterns.map((pattern, index) => (
                  <div key={pattern.category} className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-sm">{pattern.category}</div>
                    <div className="text-lg font-bold text-green-600">{pattern.successRate}%</div>
                    <div className="text-xs text-muted-foreground">{pattern.avgTime} days avg</div>
                    <Badge variant={pattern.priority === "Critical" ? "destructive" : "outline"} className="mt-1">
                      {pattern.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Score Forecasting
              </CardTitle>
              <CardDescription>
                Predicted compliance scores based on current trends and planned improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {predictions.complianceForecasting.map((framework, index) => (
                  <div key={framework.framework} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{framework.framework}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          Current: <strong>{framework.current}%</strong>
                        </span>
                        <span>
                          Predicted: <strong className="text-blue-600">{framework.predicted}%</strong>
                        </span>
                        <span>
                          Target: <strong className="text-green-600">{framework.target}%</strong>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current Progress</span>
                        <span>{framework.current}%</span>
                      </div>
                      <Progress value={framework.current} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Predicted Progress</span>
                        <span>{framework.predicted}%</span>
                      </div>
                      <Progress value={framework.predicted} className="h-2 opacity-60" />
                      <div className="flex justify-between text-xs">
                        <span>Gap to Target</span>
                        <span
                          className={framework.predicted >= framework.target ? "text-green-600" : "text-orange-600"}
                        >
                          {framework.target - framework.predicted}% remaining
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights Summary */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-sm">Risk Trend</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Risk scores are predicted to increase by 8% next quarter due to emerging threats in cloud
                infrastructure.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-sm">Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Incident response times can be reduced by 23% by implementing automated playbooks for common scenarios.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-semibold text-sm">Priority Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Focus on access control improvements to achieve ISO 27001 compliance target by Q3.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
