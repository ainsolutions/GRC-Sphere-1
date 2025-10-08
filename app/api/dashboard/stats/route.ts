import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    // --- Type definitions for each query result row ---
    type CountRow = { total_risks?: string; iso27001_risks?: string; fair_risks?: string; open_findings?: string };
    type AuditLogRow = { id: number; action: string; entity_type: string; timestamp: string; user_email: string };

    const [
      riskStatsRaw,
      iso27001RiskStatsRaw,
      fairRiskStatsRaw,
      findingStatsRaw,
      recentActivitiesRaw,
    ] = await Promise.all([
      tenantDb`SELECT COUNT(*) as total_risks FROM fair_risks`,
      tenantDb`SELECT COUNT(*) as iso27001_risks FROM iso27001_risks`,
      tenantDb`SELECT COUNT(*) as fair_risks FROM fair_risks`,
      tenantDb`SELECT COUNT(*) as open_findings FROM assessment_findings WHERE status IN ('Open', 'In Progress')`,
      tenantDb`
        SELECT 
          id,
          action,
          entity_type,
          timestamp,
          user_email
        FROM audit_logs 
        ORDER BY timestamp DESC 
        LIMIT 10
      `,
    ]);

    // ✅ Cast AFTER the awaits
    const riskStats = riskStatsRaw as CountRow[];
    const iso27001RiskStats = iso27001RiskStatsRaw as CountRow[];
    const fairRiskStats = fairRiskStatsRaw as CountRow[];
    const findingStats = findingStatsRaw as CountRow[];
    const recentActivities = recentActivitiesRaw as AuditLogRow[];

    const dashboardStats = {
      totalRisks:
        Number.parseInt(riskStats[0]?.total_risks || "0") +
        Number.parseInt(iso27001RiskStats[0]?.iso27001_risks || "0"),
      iso27001Risks: Number.parseInt(iso27001RiskStats[0]?.iso27001_risks || "0"),
      fairRisks: Number.parseInt(fairRiskStats[0]?.fair_risks || "0"),
      openFindings: Number.parseInt(findingStats[0]?.open_findings || "0"),
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        action: activity.action,
        entity_type: activity.entity_type,
        timestamp: activity.timestamp,
        user_email: activity.user_email,
      })),
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
      },
      { status: 500 },
    );
  }
});
