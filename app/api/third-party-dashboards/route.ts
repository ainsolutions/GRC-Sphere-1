import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get vendor metrics
    const vendorMetrics = await tenantDb`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE is_critical = true) as critical,
        COUNT(*) FILTER (WHERE risk_level = 'High') as high_risk,
        COUNT(*) FILTER (WHERE risk_level = 'Medium') as medium_risk,
        COUNT(*) FILTER (WHERE risk_level = 'Low') as low_risk
      FROM vendors
    ` as Record<string, any>[]

    // Get contract metrics
    const contractMetrics = await tenantDb`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE contract_status = 'active') as active,
        COUNT(*) FILTER (WHERE end_date <= CURRENT_DATE + INTERVAL '90 days' AND contract_status = 'active') as expiring_soon,
        COALESCE(SUM(contract_value), 0) as total_value,
        COALESCE(AVG(contract_value), 0) as average_value
      FROM contracts
    ` as Record<string, any>[]

    // Get risk metrics from third party risk evaluations
    const riskMetrics = await tenantDb`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE overall_risk_level = 'High') as high,
        COUNT(*) FILTER (WHERE overall_risk_level = 'Medium') as medium,
        COUNT(*) FILTER (WHERE overall_risk_level = 'Low') as low,
        COUNT(*) FILTER (WHERE evaluation_status = 'completed') as mitigated,
        COUNT(*) FILTER (WHERE evaluation_status IN ('in_progress', 'pending')) as open
      FROM third_party_risk_evaluations
    ` as Record<string, any>[]

    // Get gap analysis metrics
    const gapMetrics = await tenantDb`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE gap_severity = 'Critical') as critical,
        COUNT(*) FILTER (WHERE gap_severity = 'High') as high,
        COUNT(*) FILTER (WHERE gap_severity = 'Medium') as medium,
        COUNT(*) FILTER (WHERE gap_severity = 'Low') as low,
        COUNT(*) FILTER (WHERE remediation_status = 'closed') as closed
      FROM third_party_gap_analysis
    ` as Record<string, any>[]

    // Get remediation metrics
    const remediationMetrics = await tenantDb`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'overdue' OR target_completion_date < CURRENT_DATE) as overdue,
        COUNT(*) FILTER (WHERE status = 'on_track') as on_track
      FROM third_party_risk_remediation_tracking
    ` as Record<string, any>[]

    const metrics = {
      vendors: {
        total: Number(vendorMetrics[0]?.total || 0),
        active: Number(vendorMetrics[0]?.active || 0),
        critical: Number(vendorMetrics[0]?.critical || 0),
        highRisk: Number(vendorMetrics[0]?.high_risk || 0),
        mediumRisk: Number(vendorMetrics[0]?.medium_risk || 0),
        lowRisk: Number(vendorMetrics[0]?.low_risk || 0),
      },
      contracts: {
        total: Number(contractMetrics[0]?.total || 0),
        active: Number(contractMetrics[0]?.active || 0),
        expiringSoon: Number(contractMetrics[0]?.expiring_soon || 0),
        totalValue: Number(contractMetrics[0]?.total_value || 0),
        averageValue: Number(contractMetrics[0]?.average_value || 0),
      },
      risks: {
        total: Number(riskMetrics[0]?.total || 0),
        high: Number(riskMetrics[0]?.high || 0),
        medium: Number(riskMetrics[0]?.medium || 0),
        low: Number(riskMetrics[0]?.low || 0),
        mitigated: Number(riskMetrics[0]?.mitigated || 0),
        open: Number(riskMetrics[0]?.open || 0),
      },
      gaps: {
        total: Number(gapMetrics[0]?.total || 0),
        critical: Number(gapMetrics[0]?.critical || 0),
        high: Number(gapMetrics[0]?.high || 0),
        medium: Number(gapMetrics[0]?.medium || 0),
        low: Number(gapMetrics[0]?.low || 0),
        closed: Number(gapMetrics[0]?.closed || 0),
      },
      remediations: {
        total: Number(remediationMetrics[0]?.total || 0),
        completed: Number(remediationMetrics[0]?.completed || 0),
        inProgress: Number(remediationMetrics[0]?.in_progress || 0),
        overdue: Number(remediationMetrics[0]?.overdue || 0),
        onTrack: Number(remediationMetrics[0]?.on_track || 0),
      },
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching third party dashboard metrics:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
  }
});
