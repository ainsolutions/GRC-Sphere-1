"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, BarChart3, Settings } from "lucide-react"
import { SphereAiRiskDashboard } from "@/components/sphere-ai-risk-dashboard"
import { SphereAiRiskRegister } from "@/components/sphere-ai-risk-register"
import { SphereAiRiskForm } from "@/components/sphere-ai-risk-form"
import { SphereAiRiskTreatmentPlan } from "@/components/sphere-ai-risk-treatment-plan"


export default function SphereAiRiskPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex-1 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-blue-400/30 shadow-lg shadow-blue-500/20">
            <Brain className="h-8 w-8 text-blue-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold  animate-pulse">
            Sphere AI Risk Management
          </h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Advanced AI-powered risk assessment and management platform for comprehensive security analysis
        </p>
      </div>

      <Card>
        <CardContent className="p-6 relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="register">
                <Shield className="h-4 w-4" />
                Risk Register
              </TabsTrigger>
              <TabsTrigger value="assessment">
                <Brain className="h-4 w-4" />
                AI Assessment
              </TabsTrigger>
              <TabsTrigger value="treatment">
                <Settings className="h-4 w-4" />
                Treatment Plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <SphereAiRiskDashboard />
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <SphereAiRiskRegister />
            </TabsContent>

            <TabsContent value="assessment" className="space-y-6">
              <SphereAiRiskForm />
            </TabsContent>

            <TabsContent value="treatment" className="space-y-6">
              <SphereAiRiskTreatmentPlan />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
