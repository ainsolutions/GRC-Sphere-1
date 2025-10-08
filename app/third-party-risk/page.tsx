"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractManagement } from "@/components/contract-management"
import { VendorManagement } from "@/components/vendor-management"
import { ThirdPartyRiskAssessmentWizard } from "@/components/third-party-risk-assessment-wizard"
import { VendorRiskRegister } from "@/components/vendor-risk-register"
import { ThirdPartyGapRegister } from "@/components/third-party-gap-register"
import { ThirdPartyRemediationTracking } from "@/components/third-party-remediation-tracking"
import { ThirdPartyDashboards } from "@/components/third-party-dashboards"

import { Building2, FileText, Shield, AlertTriangle, Target, TrendingUp, BarChart3 } from "lucide-react"

export default function ThirdPartyRiskPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold ">
          Third Party Risk Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage vendors, contracts, and conduct risk assessments for third-party relationships
        </p>
      </div>

      <Tabs defaultValue="dashboards" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboards" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <h3>Dashboards</h3>
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <h3>Vendor Management</h3>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h3>Contract Management</h3>
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h3>Risk Assessments</h3>
          </TabsTrigger>
          <TabsTrigger value="vendor-risks" className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            <h3>Vendor Risk Register</h3>
          </TabsTrigger>
          <TabsTrigger value="gap-register" className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            <h3>Gap Register</h3>
          </TabsTrigger>
          <TabsTrigger value="remediation" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <h3>Remediation Tracking</h3>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-6 mt-6">
          <ThirdPartyDashboards />
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6 mt-6">
          <VendorManagement />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6 mt-6">
          <ContractManagement />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6 mt-6">
          <ThirdPartyRiskAssessmentWizard />
        </TabsContent>

        <TabsContent value="vendor-risks" className="space-y-6 mt-6">
          <VendorRiskRegister />
        </TabsContent>

        <TabsContent value="gap-register" className="space-y-6 mt-6">
          <ThirdPartyGapRegister />
        </TabsContent>

        <TabsContent value="remediation" className="space-y-6 mt-6">
          <ThirdPartyRemediationTracking />
        </TabsContent>
      </Tabs>
    </main>
  )
}
