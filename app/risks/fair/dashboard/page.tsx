"use client"
import { FairRiskDashboard } from "@/components/fair-risk-dashboard"

export default function FairRiskDashboardPage() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">FAIR Risk Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of risk treatment effectiveness and financial impact
          </p>
        </div>
        <FairRiskDashboard />
      </div>
    </main>
  )
}
