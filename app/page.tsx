"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { SystemStatus } from "@/components/system-status"
import ConversationChatbot from "@/components/conversation-chatbot"
import {
  Shield,
  Database,
  AlertTriangle,
  FileText,
  Activity,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/components/session-provider";

export default function HomePage() {
  
  const router = useRouter();
  const { sessionUser } = useSession();

  useEffect(() => {
    if (sessionUser) {
      // User is logged in, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not logged in, redirect to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading GRC Tech...</p>
      </div>
      <ConversationChatbot autoOpen={true} />
    </div>
  )
}

function Dashboard() {
  return (
    <div className="flex h-screen bg-aurora-bg">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-purple-50/50 via-cyan-50/50 to-blue-100/50 dark:from-black/50 dark:via-slate-900/30 dark:to-blue-950/50">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold  animate-pulse">
                  Cybersecurity Risk Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive view of your governance, risk, and compliance posture
                </p>
              </div>
              <SystemStatus />
            </div>

            {/* Key Metrics with Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-blue-300">Total Assets</CardTitle>
                  <Database className="h-4 w-4 text-purple-600 dark:text-blue-400 animate-bounce" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-800 dark:text-blue-200 animate-count-up">1,234</div>
                  <p className="text-xs text-purple-600 dark:text-blue-400">
                    <TrendingUp className="inline h-3 w-3 mr-1 animate-pulse" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in delay-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Active Risks</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-800 dark:text-cyan-200 animate-count-up">89</div>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400">23 high priority</p>
                </CardContent>
              </Card>

              <Card className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in delay-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Controls</CardTitle>
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin-slow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 animate-count-up">456</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">92% effective</p>
                </CardContent>
              </Card>

              <Card className="gradient-card transform hover:scale-105 transition-all duration-300 animate-fade-in delay-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-700 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-200 bg-clip-text text-transparent">
                    Compliance
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600 dark:text-blue-400 animate-bounce" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-700 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-200 bg-clip-text text-transparent animate-pulse">
                    87%
                  </div>
                  <p className="text-xs text-purple-600 dark:text-blue-400">Overall score</p>
                </CardContent>
              </Card>
            </div>

            {/* Security Framework Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gradient-card-primary transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-blue-300 flex items-center gap-2">
                    <Shield className="h-5 w-5 animate-spin-slow" />
                    NIST CSF 2.0 Status
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Cybersecurity Framework Implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Identify</span>
                      <span className="text-sm text-green-600 animate-pulse">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-progress"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Protect</span>
                      <span className="text-sm text-blue-600 animate-pulse">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-progress"
                        style={{ width: "88%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Detect</span>
                      <span className="text-sm text-yellow-600 animate-pulse">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full animate-progress"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Respond</span>
                      <span className="text-sm text-orange-600 animate-pulse">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full animate-progress"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Recover</span>
                      <span className="text-sm text-red-600 animate-pulse">58%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full animate-progress"
                        style={{ width: "58%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card-secondary transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
                    <Target className="h-5 w-5 animate-pulse" />
                    ISO 27001 Compliance
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">Information Security Management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 animate-count-up">114</div>
                      <div className="text-xs text-green-600">Controls Implemented</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 animate-count-up">12</div>
                      <div className="text-xs text-yellow-600">In Progress</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Compliance</span>
                      <span className="font-medium text-green-600 animate-pulse">90.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full animate-progress"
                        style={{ width: "90.5%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
                  <AlertTriangle className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">5 critical, 18 high</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
                  <Activity className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Avg resolution: 2.5h</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assessment Findings</CardTitle>
                  <FileText className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold ">156</div>
                  <p className="text-xs text-muted-foreground">89 open, 67 resolved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Control Effectiveness</CardTitle>
                  <CheckCircle className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">423 effective, 33 needs review</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions with Animation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gradient-card-primary transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription className="dark:text-slate-400">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/assets">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white transform hover:scale-105 transition-all duration-200">
                        <Database className="mr-2 h-4 w-4" />
                        Add Asset
                      </Button>
                    </Link>
                    <Link href="/risks">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-200">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Log Risk
                      </Button>
                    </Link>
                    <Link href="/incidents">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-400 dark:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white transform hover:scale-105 transition-all duration-200">
                        <Activity className="mr-2 h-4 w-4" />
                        Report Incident
                      </Button>
                    </Link>
                    <Link href="/assessments">
                      <Button className="w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-600 hover:from-purple-600 hover:via-cyan-600 hover:to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:via-blue-600 dark:hover:to-blue-800 text-white transform hover:scale-105 transition-all duration-200">
                        <FileText className="mr-2 h-4 w-4" />
                        New Assessment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription className="dark:text-slate-400">Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 animate-slide-in">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">New risk assessment completed</p>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">2 hours ago</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 border-purple-200 dark:from-blue-900/50 dark:to-cyan-900/50 dark:text-blue-300 dark:border-blue-700 animate-pulse">
                        High
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 animate-slide-in delay-100">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">Control effectiveness updated</p>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">4 hours ago</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-200 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-cyan-300 dark:border-blue-700 animate-pulse">
                        Medium
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 animate-slide-in delay-200">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-blue-300 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">Asset inventory updated</p>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">6 hours ago</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 dark:from-blue-900/50 dark:to-slate-800/50 dark:text-blue-300 dark:border-blue-700 animate-pulse">
                        Low
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 animate-slide-in delay-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-400 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">Security incident resolved</p>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">8 hours ago</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200 dark:from-green-900/50 dark:to-blue-800/50 dark:text-green-300 dark:border-green-700 animate-pulse">
                        Resolved
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Heat Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 animate-bounce" />
                  Risk Heat Map
                </CardTitle>
                <CardDescription>Current risk distribution across domains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }, (_, i) => {
                    const intensity = Math.random()
                    const colorClass =
                      intensity > 0.7 ? "bg-red-500" : intensity > 0.4 ? "bg-yellow-500" : "bg-green-500"
                    return (
                      <div
                        key={i}
                        className={`h-8 w-8 ${colorClass} rounded animate-pulse`}
                        style={{ animationDelay: `${i * 50}ms` }}
                      />
                    )
                  })}
                </div>
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    Low Risk
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    Medium Risk
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    High Risk
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
