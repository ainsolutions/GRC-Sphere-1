"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, TrendingUp, AlertTriangle, CheckCircle, Activity, Target, Zap } from "lucide-react"
import { SphereAiRiskForm } from "@/components/sphere-ai-risk-form"
import { SphereAiRiskRegister } from "@/components/sphere-ai-risk-register"
import { SphereAiRiskTreatmentPlan } from "@/components/sphere-ai-risk-treatment-plan"
import { SphereAiRiskDashboard } from "@/components/sphere-ai-risk-dashboard"
import { SphereAiControlAssessments } from "@/components/sphere-ai-control-assessments"


export default function RisksPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen aurora-bg">
      <div className="aurora-overlay"></div>
      <div className="flex aurora-content">
        {/* <Sidebar /> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <Header /> */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="h-8 w-8 text-blue-600" />
                  Sphere AI Risk Management
                </h1>
                <p className="text-gray-600 mt-2">AI-powered cyber risk management and assessment platform</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Risks</p>
                      <p className="text-2xl font-bold text-gray-900">247</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12 this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Critical Risks</p>
                      <p className="text-2xl font-bold text-red-600">23</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-500">Requires immediate attention</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Treatment Plans</p>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <Activity className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">89% completion rate</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                      <p className="text-2xl font-bold text-blue-600">89%</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-500">Average prediction accuracy</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200 bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Brain className="h-6 w-6 text-blue-600" />
                  AI-Powered Risk Management
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive cyber risk management with intelligent analysis, predictions, and automated
                  recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5 bg-gray-100">
                    <TabsTrigger
                      value="dashboard"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger
                      value="new-risk"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      New Risk
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Risk Register
                    </TabsTrigger>
                    <TabsTrigger
                      value="treatment"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Treatment Plans
                    </TabsTrigger>
                    <TabsTrigger
                      value="assessments"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Control Assessments
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="space-y-4">
                    <SphereAiRiskDashboard />
                  </TabsContent>

                  <TabsContent value="new-risk" className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Brain className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Create New AI Risk Assessment</h3>
                          <p className="text-sm text-gray-600">
                            Leverage AI-powered analysis to identify, assess, and prioritize cyber risks
                          </p>
                        </div>
                      </div>
                    </div>
                    <SphereAiRiskForm />
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <SphereAiRiskRegister />
                  </TabsContent>

                  <TabsContent value="treatment" className="space-y-4">
                    <SphereAiRiskTreatmentPlan />
                  </TabsContent>

                  <TabsContent value="assessments" className="space-y-4">
                    <SphereAiControlAssessments />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          </main>
        </div>
      </div>
    </div>
  )
}
