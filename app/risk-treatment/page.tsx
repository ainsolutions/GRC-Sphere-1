"use client"

// import { Header } from "@/components/header"
// import { Sidebar } from "@/components/sidebar"
import { RiskTreatmentDashboard } from "@/components/risk-treatment-dashboard"

export default function RiskTreatmentPage() {
  return (
    <div className="min-h-screen aurora-bg">
      <div className="aurora-overlay"></div>
      <div className="flex aurora-content">
        {/* <Sidebar /> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <Header /> */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold  animate-pulse">Risk Treatment Management</h1>
              <p className="text-muted-foreground">
                Manage risk treatment plans, controls, and track remediation progress with aging analysis
              </p>
            </div>
            <RiskTreatmentDashboard />
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}
