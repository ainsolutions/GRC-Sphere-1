import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    // ---- Types for each query result row ----
    type CountRow = { count: string };
    type ActivityRow = { action: string; entity_type: string; user_email: string; timestamp: string };
    type RiskDistributionRow = { risk_level: string; count: string };
    type ComplianceRow = { status: string; count: string };
    type SeverityRow = { severity: string; count: string };

    // ---- Run all queries in parallel ----
    const [
      assetsRaw,
      iso27001RisksRaw,
      fairRisksRaw,
      findingsRaw,
      assessmentsRaw,
      threatsRaw,
      incidentsRaw,
    ] = await Promise.all([
      tenantDb`SELECT COUNT(*) as count FROM information_assets WHERE status = true`,
      tenantDb`SELECT COUNT(*) as count FROM iso27001_risks`,
      tenantDb`SELECT COUNT(*) as count FROM fair_risks`,
      tenantDb`SELECT COUNT(*) as count FROM assessment_findings`,
      tenantDb`SELECT COUNT(*) as count FROM assessments`,
      tenantDb`SELECT COUNT(*) as count FROM threats`,
      tenantDb`SELECT COUNT(*) as count FROM incidents`,
    ]);

    // ✅ Cast AFTER awaits
    const assetsResult = assetsRaw as CountRow[];
    const iso27001RisksResult = iso27001RisksRaw as CountRow[];
    const fairRisksResult = fairRisksRaw as CountRow[];
    const findingsResult = findingsRaw as CountRow[];
    const assessmentsResult = assessmentsRaw as CountRow[];
    const threatsResult = threatsRaw as CountRow[];
    const incidentsResult = incidentsRaw as CountRow[];

    const recentActivities = (await tenantDb`
      SELECT action, entity_type, user_email, timestamp
      FROM audit_logs 
      ORDER BY timestamp DESC 
      LIMIT 10
    `) as ActivityRow[];

    const riskDistribution = (await tenantDb`
      SELECT risk_level, COUNT(*) as count
      FROM iso27001_risks 
      GROUP BY risk_level
    `) as RiskDistributionRow[];

    const complianceStatus = (await tenantDb`
      SELECT assessment_status as status, COUNT(*) as count
      FROM assessments 
      GROUP BY assessment_status
    `) as ComplianceRow[];

    const findingsBySeverity = (await tenantDb`
      SELECT severity, COUNT(*) as count
      FROM assessment_findings 
      GROUP BY severity
    `) as SeverityRow[];

    // ---- Build response object with correct types ----
    const dashboardData = {
      totalAssets: Number.parseInt(assetsResult[0]?.count || "0"),
      totalRisks:
        Number.parseInt(iso27001RisksResult[0]?.count || "0") +
        Number.parseInt(fairRisksResult[0]?.count || "0"),
      totalFindings: Number.parseInt(findingsResult[0]?.count || "0"),
      totalAssessments: Number.parseInt(assessmentsResult[0]?.count || "0"),
      totalThreats: Number.parseInt(threatsResult[0]?.count || "0"),
      totalIncidents: Number.parseInt(incidentsResult[0]?.count || "0"),

      recentActivities: recentActivities.map((activity) => ({
        action: activity.action,
        entityType: activity.entity_type,
        user: activity.user_email,
        timestamp: activity.timestamp,
      })),

      riskDistribution: riskDistribution.map((risk) => ({
        level: risk.risk_level,
        count: Number.parseInt(risk.count),
      })),

      complianceStatus: complianceStatus.map((status) => ({
        status: status.status,
        count: Number.parseInt(status.count),
      })),

      findingsBySeverity: findingsBySeverity.map((finding) => ({
        severity: finding.severity,
        count: Number.parseInt(finding.count),
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API error:", error);

    // ---- Fallback data if database call fails ----
    const fallbackData = {
      totalAssets: 0,
      totalRisks: 0,
      totalFindings: 0,
      totalAssessments: 0,
      totalThreats: 0,
      totalIncidents: 0,
      recentActivities: [],
      riskDistribution: [
        { level: "Low", count: 0 },
        { level: "Medium", count: 0 },
        { level: "High", count: 0 },
        { level: "Critical", count: 0 },
      ],
      complianceStatus: [
        { status: "Compliant", count: 0 },
        { status: "Non-Compliant", count: 0 },
        { status: "In Progress", count: 0 },
      ],
      findingsBySeverity: [
        { severity: "Low", count: 0 },
        { severity: "Medium", count: 0 },
        { severity: "High", count: 0 },
        { severity: "Critical", count: 0 },
      ],
    };

    return NextResponse.json(fallbackData);
  }
});
