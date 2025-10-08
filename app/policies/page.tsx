import { PolicyManagementDashboard } from "@/components/policy-management-dashboard"
import { PolicyVersionHistory } from "@/components/policy-version-history"
import { PolicyProcedureMapping } from "@/components/policy-procedure-mapping"
import { PolicyFileManagement } from "@/components/policy-file-management"

export default function PoliciesPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto p-6 space-y-8">
        <PolicyManagementDashboard />
        <PolicyProcedureMapping />
        <PolicyFileManagement />
        <PolicyVersionHistory />
      </div>
    </main>
  )
}
