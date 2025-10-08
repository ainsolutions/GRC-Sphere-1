import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // For GET requests, we'll use default organization or get from session
    const organizationId = 1; // Default organization ID for now
    
    // Get assets by criticality for the user's organization
    const assetsByCriticality = (await tenantDb`
      SELECT
        criticality,
        COUNT(*) as count
      FROM information_assets
      WHERE status = true AND (organization_id = ${organizationId} OR organization_id IS NULL)
      GROUP BY criticality
      ORDER BY
        CASE criticality
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END
    `) as any[]

    // Get ISO 27001 risks by residual risk level with better risk calculation
    const iso27001RisksByLevel = (await tenantDb`
      SELECT
        CASE
          WHEN residual_risk >= 15 OR risk_level = 'Critical' THEN 'Critical'
          WHEN residual_risk >= 10 OR risk_level = 'High' THEN 'High'
          WHEN residual_risk >= 5 OR risk_level = 'Medium' THEN 'Medium'
          ELSE 'Low'
        END as risk_level,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_count
      FROM iso27001_risks
      WHERE organization_id = ${organizationId} OR organization_id IS NULL
      GROUP BY
        CASE
          WHEN residual_risk >= 15 OR risk_level = 'Critical' THEN 'Critical'
          WHEN residual_risk >= 10 OR risk_level = 'High' THEN 'High'
          WHEN residual_risk >= 5 OR risk_level = 'Medium' THEN 'Medium'
          ELSE 'Low'
        END
      ORDER BY
        CASE
          WHEN COUNT(CASE WHEN residual_risk >= 15 OR risk_level = 'Critical' THEN 1 END) > 0 THEN 1
          WHEN COUNT(CASE WHEN residual_risk >= 10 OR risk_level = 'High' THEN 1 END) > 0 THEN 2
          WHEN COUNT(CASE WHEN residual_risk >= 5 OR risk_level = 'Medium' THEN 1 END) > 0 THEN 3
          ELSE 4
        END
    `) as any[]

    // Get NIST risks with inherent vs residual comparison
    const nistRisks = (await tenantDb`
      SELECT
        CASE
          WHEN default_impact >= 4 OR risk_level = 'Critical' THEN 'Critical'
          WHEN default_impact >= 3 OR risk_level = 'High' THEN 'High'
          WHEN default_impact >= 2 OR risk_level = 'Medium' THEN 'Medium'
          ELSE 'Low'
        END as inherent_level,
        CASE
          WHEN residual_impact >= 4 OR residual_risk_level = 'Critical' THEN 'Critical'
          WHEN residual_impact >= 3 OR residual_risk_level = 'High' THEN 'High'
          WHEN residual_impact >= 2 OR residual_risk_level = 'Medium' THEN 'Medium'
          ELSE 'Low'
        END as residual_level,
        COUNT(*) as count
      FROM nist_csf_risk_templates
      WHERE is_active = true AND organization_id = ${organizationId}
      GROUP BY inherent_level, residual_level
      ORDER BY inherent_level, residual_level
    `) as any[]

    // Get comprehensive assessments status including overdue calculations
    const assessmentsStatus = (await tenantDb`
      SELECT
        assessment_status,
        COUNT(*) as count,
        COUNT(CASE WHEN end_date < CURRENT_DATE AND assessment_status NOT IN ('completed', 'closed') THEN 1 END) as overdue_count,
        COUNT(CASE WHEN assessment_status = 'open' THEN 1 END) as open_count,
        COUNT(CASE WHEN assessment_status = 'in_progress' THEN 1 END) as in_progress_count
      FROM assessments
      WHERE organization_id = ${organizationId} OR organization_id IS NULL
      GROUP BY assessment_status
      ORDER BY
        CASE assessment_status
          WHEN 'open' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'completed' THEN 3
          ELSE 4
        END
    `) as any[]

    // Get findings with severity breakdown and overdue tracking
    const findingsStatus = (await tenantDb`
      SELECT
        status,
        severity,
        COUNT(*) as count,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND status NOT IN ('closed', 'resolved') THEN 1 END) as overdue_count
      FROM assessment_findings
      WHERE severity IS NOT NULL AND organization_id = ${organizationId}
      GROUP BY status, severity
      ORDER BY
        CASE severity
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END,
        CASE status
          WHEN 'open' THEN 1
          WHEN 'in_progress' THEN 2
          ELSE 3
        END
    `) as any[]

    // Get NESA UAE compliance gaps
    const nesaGaps = (await tenantDb`
      SELECT
        status,
        COUNT(*) as count
      FROM nesa_uae_gap_analysis 
      GROUP BY status
      ORDER BY 
        CASE status 
          WHEN 'Not Started' THEN 1 
          WHEN 'In Progress' THEN 2 
          WHEN 'Under Review' THEN 3
          WHEN 'Completed' THEN 4
          ELSE 5
        END
    `) as any[]

    // Get comprehensive remediation tracking
    const remediations = (await tenantDb`
      SELECT 
        COUNT(*) as total_open,
        COUNT(CASE WHEN target_completion_date < CURRENT_DATE THEN 1 END) as overdue,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN priority = 'Critical' THEN 1 END) as critical_priority,
        COUNT(CASE WHEN priority = 'High' THEN 1 END) as high_priority,
        AVG(progress_percentage) as avg_progress
      FROM incident_remediation_tracking 
      WHERE status IN ('open', 'in_progress', 'pending')
    `) as any[]

    // Get vulnerabilities with comprehensive breakdown
    const vulnerabilities = (await tenantDb`
      SELECT
        severity,
        remediation_status,
        COUNT(*) as count,
        COUNT(CASE WHEN remediation_due_date < CURRENT_DATE AND remediation_status NOT IN ('completed', 'resolved') THEN 1 END) as overdue_count
      FROM vulnerabilities 
      WHERE severity IN ('Critical', 'High', 'Medium')
      GROUP BY severity, remediation_status
      ORDER BY
        CASE severity
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          ELSE 4
        END
    `) as any[]

    // Get incidents with detailed breakdown
    const incidents = (await tenantDb`
      SELECT
        COUNT(*) as total_open,
        COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_count,
        COUNT(CASE WHEN severity = 'High' THEN 1 END) as high_count,
        COUNT(CASE WHEN severity = 'Medium' THEN 1 END) as medium_count,
        COUNT(CASE WHEN status = 'Open' THEN 1 END) as open_count,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_count
      FROM incidents 
      WHERE status IN ('Open', 'In Progress', 'Acknowledged')
    `) as any[]

    // Get assets by risk correlation with enhanced analysis
    const assetsByRisk = (await tenantDb`
      SELECT
        ia.criticality,
        COUNT(DISTINCT ia.id) as asset_count,
        COUNT(DISTINCT CASE WHEN ia.status = true THEN ia.id END) as active_assets
      FROM information_assets ia
      WHERE ia.status = true
      GROUP BY ia.criticality
      ORDER BY
        CASE ia.criticality
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END
    `) as any[]

    const technologyRisks = (await tenantDb`
      SELECT
        risk_level,
        status,
        COUNT(*) as count
      FROM iso27001_risks 
      GROUP BY risk_level, status
      ORDER BY
        CASE risk_level
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END
    `) as any[]

    // Get compliance framework summary
    const complianceFrameworks = (await tenantDb`
      SELECT
        'ISO27001' as framework,
        COUNT(*) as total_controls,
        COUNT(CASE WHEN status = 'Open' THEN 1 END) as open_issues
      FROM iso27001_risks
      WHERE organization_id = ${organizationId} OR organization_id IS NULL
      UNION ALL
      SELECT
        'NESA UAE' as framework,
        COUNT(*) as total_controls,
        COUNT(CASE WHEN status = 'Not Started' THEN 1 END) as open_issues
      FROM nesa_uae_gap_analysis
      WHERE organization_id = ${organizationId} OR organization_id IS NULL
    `) as any[]

    return NextResponse.json({
      assetsByCriticality,
      iso27001RisksByLevel,
      nistRisks,
      assessmentsStatus,
      findingsStatus,
      nesaGaps,
      remediations: remediations[0] || {
        total_open: 0,
        overdue: 0,
        in_progress: 0,
        critical_priority: 0,
        high_priority: 0,
        avg_progress: 0,
      },
      vulnerabilities,
      incidents: incidents[0] || {
        total_open: 0,
        critical_count: 0,
        high_count: 0,
        medium_count: 0,
        overdue_count: 0,
        open_count: 0,
        in_progress_count: 0,
      },
      assetsByRisk,
      technologyRisks,
      complianceFrameworks,
      timestamp: new Date().toISOString(),
      summary: {
        totalAssets: assetsByCriticality.reduce((sum: number, item: any) => sum + Number.parseInt(item.count), 0),
        totalRisks: iso27001RisksByLevel.reduce((sum: number, item: any) => sum + Number.parseInt(item.count), 0),
        criticalItems: {
          assets: assetsByCriticality.find((item: any) => item.criticality === "Critical")?.count || 0,
          risks: iso27001RisksByLevel.find((item: any) => item.risk_level === "Critical")?.count || 0,
          vulnerabilities: vulnerabilities
            .filter((item: any) => item.severity === "Critical")
            .reduce((sum: number, item: any) => sum + Number.parseInt(item.count), 0),
          incidents: incidents[0]?.critical_count || 0,
        },
      },
    })
  } catch (error) {
    console.error("Dashboard metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
  }
});