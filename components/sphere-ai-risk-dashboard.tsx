"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Shield, AlertTriangle, Target, Activity, BarChart3, PieChart, Clock } from "lucide-react"
import { toast } from "sonner"

interface DashboardStats {
  totalRisks: number
  criticalRisks: number
  highRisks: number
  mediumRisks: number
  lowRisks: number
  averageConfidence: number
  risksByCategory: { category: string; count: number }[]
  risksByStatus: { status: string; count: number }[]
  recentRisks: Array<{
    id: number
    title: string
    ai_risk_level: string
    ai_risk_score: number
    created_at: string
  }>
}

export function SphereAiRiskDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/sphere-ai-risks/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats")
      }
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      toast.error("Failed to load dashboard data")
      // Set mock data for demo purposes
      setStats({
        totalRisks: 156,
        criticalRisks: 12,
        highRisks: 34,
        mediumRisks: 67,
        lowRisks: 43,
        averageConfidence: 87,
        risksByCategory: [
          { category: "Infrastructure Security", count: 45 },
          { category: "Data Security", count: 38 },
          { category: "Application Security", count: 29 },
          { category: "Third-party Risk", count: 25 },
          { category: "Compliance", count: 19 },
        ],
        risksByStatus: [
          { status: "Under Review", count: 45 },
          { status: "Approved", count: 67 },
          { status: "Mitigated", count: 32 },
          { status: "Draft", count: 12 },
        ],
        recentRisks: [
          {
            id: 1,
            title: "Cloud Infrastructure Vulnerability",
            ai_risk_level: "High",
            ai_risk_score: 8.2,
            created_at: "2024-01-15T10:30:00Z",
          },
          {
            id: 2,
            title: "Data Encryption Weakness",
            ai_risk_level: "Critical",
            ai_risk_score: 9.1,
            created_at: "2024-01-14T15:45:00Z",
          },
          {
            id: 3,
            title: "Third-party API Security",
            ai_risk_level: "Medium",
            ai_risk_score: 6.5,
            created_at: "2024-01-13T09:20:00Z",
          },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500/20 text-red-300 border-red-400/30"
      case "High":
        return "bg-orange-500/20 text-orange-300 border-orange-400/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
      case "Low":
        return "bg-green-500/20 text-green-300 border-green-400/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-400/30"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Brain className="h-8 w-8 animate-pulse text-blue-400" />
        <span className="ml-2 text-slate-300">Loading dashboard...</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-slate-300">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">Total Risks</CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{stats.totalRisks}</div>
            <p className="text-xs ">AI-assessed risks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{stats.criticalRisks}</div>
            <p className="text-xs ">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{stats.averageConfidence}%</div>
            <p className="text-xs ">Average assessment confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">Risk Coverage</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">94%</div>
            <p className="text-xs ">Assets under assessment</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Risk Level Distribution
          </CardTitle>
          <CardDescription className="text-slate-300">Breakdown of risks by severity level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <span className=" font-semibold">{stats.criticalRisks}</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(stats.criticalRisks / stats.totalRisks) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="">High</span>
              </div>
              <div className="flex items-center gap-2">
                <span className=" font-semibold">{stats.highRisks}</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(stats.highRisks / stats.totalRisks) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className=" font-semibold">{stats.mediumRisks}</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(stats.mediumRisks / stats.totalRisks) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <span className=" font-semibold">{stats.lowRisks}</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(stats.lowRisks / stats.totalRisks) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">
            Risk Categories
          </TabsTrigger>
          <TabsTrigger value="status">
            Status Overview
          </TabsTrigger>
          <TabsTrigger value="recent">
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 ">
                <PieChart className="h-5 w-5 text-blue-400" />
                Risks by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.risksByCategory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-600 dark:text-gray-50 rounded-lg backdrop-blur-sm"
                  >
                    <span className="">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className=" font-semibold">{item.count}</span>
                      <Badge variant="outline" className="bg-blue-500/20 text-green-500 border-blue-400/30">
                        {((item.count / stats.totalRisks) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 ">
                <Activity className="h-5 w-5 text-blue-400" />
                Risk Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.risksByStatus.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-100 dark:bg-gray-600 dark:text-gray-50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className=" text-sm">{item.status}</span>
                      <span className=" font-bold text-lg">{item.count}</span>
                    </div>
                    <Progress value={(item.count / stats.totalRisks) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 ">
                <Clock className="h-5 w-5 text-blue-400" />
                Recent Risk Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(stats.recentRisks) && stats.recentRisks.length > 0 ? (
                  stats.recentRisks.map((risk) => (
                    <div
                      key={risk.id}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg backdrop-blur-sm"
                    >
                      <div className="flex-1">
                        <h4 className=" font-medium">{risk.title}</h4>
                        <p className=" text-sm">{formatDate(risk.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 font-semibold">{risk.ai_risk_score}</span>
                        <Badge className={getRiskLevelColor(risk.ai_risk_level)}>{risk.ai_risk_level}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="">No recent risk assessments found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
