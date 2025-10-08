import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    // Risk statistics
    const riskStatsQuery = `
      SELECT 
        COUNT(*) as total_risks,
        SUM(original_ale) as total_ale_before,
        AVG(original_ale) as avg_ale_before,
        COUNT(CASE WHEN original_ale > 500000 THEN 1 END) as risks_above_tolerance,
        COUNT(CASE WHEN EXISTS (SELECT 1 FROM risk_treatment_plans rtp WHERE rtp.risk_id = fr.id) THEN 1 END) as treated_risks
      FROM fair_risks fr
    `

    // Financial impact analysis
    const financialImpactQuery = `
      SELECT 
        SUM(fr.original_ale) as total_ale_before,
        SUM(fr.projected_ale) as total_ale_after,
        SUM(fr.original_ale - fr.projected_ale) as total_risk_reduction,
        SUM(rtp.cost_estimate) as total_cost_estimate,
        CASE 
          WHEN SUM(rtp.cost_estimate) > 0 THEN 
            ((SUM(fr.original_ale - fr.projected_ale) - SUM(rtp.cost_estimate)) / SUM(rtp.cost_estimate)) * 100
          ELSE 0
        END as roi
      FROM fair_risks fr
      LEFT JOIN risk_treatment_plans rtp ON fr.id = rtp.risk_id
      WHERE rtp.id IS NOT NULL
    `

    // Risk trends (last 12 months)
    const riskTrendsQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as risks_identified,
        SUM(original_ale) as total_ale,
        AVG(original_ale) as avg_ale
      FROM fair_risks
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `

    // Treatment progress trends
    const treatmentProgressQuery = `
      SELECT 
        DATE_TRUNC('month', rtc.created_at) as month,
        COUNT(CASE WHEN rtc.status = 'completed' THEN 1 END) as controls_completed,
        COUNT(CASE WHEN rtc.status IN ('in_progress', 'pending') THEN 1 END) as controls_started,
        COUNT(*) as total_changes
      FROM risk_treatment_controls rtc
      WHERE rtc.created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', rtc.created_at)
      ORDER BY month
    `

    // Risk distribution before/after treatment
    const riskDistributionQuery = `
      SELECT 
        CASE 
          WHEN fr.original_ale >= 1000000 THEN 'Critical'
          WHEN fr.original_ale >= 500000 THEN 'High'
          WHEN fr.original_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END as risk_level_before,
        CASE 
          WHEN fr.projected_ale >= 1000000 THEN 'Critical'
          WHEN fr.projected_ale >= 500000 THEN 'High'
          WHEN fr.projected_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END as risk_level_after,
        COUNT(*) as count,
        SUM(fr.original_ale) as total_ale_before,
        SUM(fr.projected_ale) as total_ale_after
      FROM fair_risks fr
      WHERE EXISTS (SELECT 1 FROM risk_treatment_plans rtp WHERE rtp.risk_id = fr.id)
      GROUP BY 
        CASE 
          WHEN fr.original_ale >= 1000000 THEN 'Critical'
          WHEN fr.original_ale >= 500000 THEN 'High'
          WHEN fr.original_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END,
        CASE 
          WHEN fr.projected_ale >= 1000000 THEN 'Critical'
          WHEN fr.projected_ale >= 500000 THEN 'High'
          WHEN fr.projected_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END
    `

    // Top risk reductions
    const topRiskReductionsQuery = `
      SELECT 
        fr.risk_id,
        fr.title,
        fr.original_ale,
        fr.projected_ale,
        (fr.original_ale - fr.projected_ale) as ale_reduction,
        rtp.expected_risk_reduction,
        rtp.cost_estimate,
        rtp.treatment_type
      FROM fair_risks fr
      JOIN risk_treatment_plans rtp ON fr.id = rtp.risk_id
      WHERE fr.original_ale > fr.projected_ale
      ORDER BY (fr.original_ale - fr.projected_ale) DESC
      LIMIT 10
    `

    // Treatment type effectiveness
    const treatmentTypeEffectivenessQuery = `
      SELECT 
        rtp.treatment_type,
        COUNT(*) as count,
        AVG(rtp.expected_risk_reduction) as avg_risk_reduction,
        SUM(rtp.cost_estimate) as total_cost,
        AVG(rtp.cost_estimate) as avg_cost,
        COUNT(CASE WHEN rtc.status = 'completed' THEN 1 END) as completed_controls,
        COUNT(rtc.id) as total_controls
      FROM risk_treatment_plans rtp
      LEFT JOIN risk_treatment_controls rtc ON rtp.id = rtc.treatment_plan_id
      GROUP BY rtp.treatment_type
      ORDER BY avg_risk_reduction DESC
    `

    // Control timeline (next 12 weeks)
    const controlTimelineQuery = `
      SELECT 
        DATE_TRUNC('week', rtc.due_date) as week,
        COUNT(CASE WHEN rtc.due_date <= NOW() + INTERVAL '7 days' THEN 1 END) as controls_due,
        COUNT(CASE WHEN rtc.status = 'completed' THEN 1 END) as controls_completed,
        COUNT(CASE WHEN rtc.due_date < NOW() AND rtc.status != 'completed' THEN 1 END) as controls_overdue
      FROM risk_treatment_controls rtc
      WHERE rtc.due_date >= NOW() - INTERVAL '4 weeks' 
        AND rtc.due_date <= NOW() + INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', rtc.due_date)
      ORDER BY week
    `

    // Execute all queries
    const [
      riskStats,
      financialImpact,
      riskTrends,
      treatmentProgress,
      riskDistribution,
      topRiskReductions,
      treatmentTypeEffectiveness,
      controlTimeline,
    ] = await Promise.all([
      tenantDb`${riskStatsQuery}`,
      tenantDb`${financialImpactQuery}`,
      tenantDb`${riskTrendsQuery}`,
      tenantDb`${treatmentProgressQuery}`,
      tenantDb`${riskDistributionQuery}`,
      tenantDb`${topRiskReductionsQuery}`,
      tenantDb`${treatmentTypeEffectivenessQuery}`,
      tenantDb`${controlTimelineQuery}`,
    ]) as any[]

    return NextResponse.json({
      risk_stats: riskStats[0] || {},
      financial_impact: financialImpact[0] || {},
      risk_trends: riskTrends,
      treatment_progress: treatmentProgress,
      risk_distribution: riskDistribution,
      top_risk_reductions: topRiskReductions,
      treatment_type_effectiveness: treatmentTypeEffectiveness,
      control_timeline: controlTimeline,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
});
