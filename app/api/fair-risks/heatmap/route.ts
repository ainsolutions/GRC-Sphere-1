import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }: HttpSessionContext, req) => {
  try {
    // Heat map data - risk distribution by asset category and risk level
    const heatmapQuery = `
      SELECT 
        a.category as asset_category,
        CASE 
          WHEN fr.original_ale >= 1000000 THEN 'Critical'
          WHEN fr.original_ale >= 500000 THEN 'High'
          WHEN fr.original_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END as risk_level,
        COUNT(fr.id) as risk_count,
        SUM(fr.original_ale) as total_ale,
        AVG(fr.original_ale) as avg_ale,
        COUNT(CASE WHEN rtp.id IS NOT NULL THEN 1 END) as treated_risks,
        AVG(CASE WHEN rtp.expected_risk_reduction IS NOT NULL THEN rtp.expected_risk_reduction ELSE 0 END) as avg_risk_reduction
      FROM fair_risks fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      LEFT JOIN risk_treatment_plans rtp ON fr.id = rtp.risk_id
      WHERE a.category IS NOT NULL
      GROUP BY a.category, 
        CASE 
          WHEN fr.original_ale >= 1000000 THEN 'Critical'
          WHEN fr.original_ale >= 500000 THEN 'High'
          WHEN fr.original_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END
      ORDER BY a.category, 
        CASE 
          WHEN fr.original_ale >= 1000000 THEN 1
          WHEN fr.original_ale >= 500000 THEN 2
          WHEN fr.original_ale >= 100000 THEN 3
          ELSE 4
        END
    `

    // Category totals
    const categoryTotalsQuery = `
      SELECT 
        a.category as asset_category,
        COUNT(DISTINCT fr.id) as total_risks,
        SUM(fr.original_ale) as total_category_ale,
        COUNT(DISTINCT a.id) as total_assets
      FROM fair_risks fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      WHERE a.category IS NOT NULL
      GROUP BY a.category
      ORDER BY total_category_ale DESC
    `

    // Severity distribution
    const severityDistributionQuery = `
      SELECT 
        a.category as asset_category,
        CASE 
          WHEN fr.original_ale >= 1000000 THEN 'Critical'
          WHEN fr.original_ale >= 500000 THEN 'High'
          WHEN fr.original_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END as severity_level,
        COUNT(fr.id) as count,
        AVG(fr.original_ale) as avg_ale
      FROM fair_risks fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      WHERE a.category IS NOT NULL
      GROUP BY a.category, 
        CASE 
          WHEN fr.original_ale >= 1000000 THEN 'Critical'
          WHEN fr.original_ale >= 500000 THEN 'High'
          WHEN fr.original_ale >= 100000 THEN 'Medium'
          ELSE 'Low'
        END
      ORDER BY a.category, avg_ale DESC
    `

    // Treatment effectiveness by category
    const treatmentEffectivenessQuery = `
      SELECT 
        a.category as asset_category,
        COUNT(DISTINCT rtp.id) as treatment_plans,
        AVG(rtp.expected_risk_reduction) as avg_reduction,
        SUM(rtp.cost_estimate) as total_cost,
        COUNT(CASE WHEN rtp.status = 'approved' THEN 1 END) as approved_plans,
        COUNT(DISTINCT rtc.id) as total_controls,
        COUNT(CASE WHEN rtc.status = 'completed' THEN 1 END) as completed_controls
      FROM assets a
      LEFT JOIN fair_risks fr ON a.id = fr.asset_id
      LEFT JOIN risk_treatment_plans rtp ON fr.id = rtp.risk_id
      LEFT JOIN risk_treatment_controls rtc ON rtp.id = rtc.treatment_plan_id
      WHERE a.category IS NOT NULL
      GROUP BY a.category
      HAVING COUNT(DISTINCT rtp.id) > 0
      ORDER BY avg_reduction DESC NULLS LAST
    `

    // Risk trends by category (last 12 months)
    const riskTrendsQuery = `
      SELECT 
        a.category as asset_category,
        DATE_TRUNC('month', fr.created_at) as month,
        COUNT(fr.id) as new_risks,
        SUM(fr.original_ale) as monthly_ale
      FROM fair_risks fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      WHERE a.category IS NOT NULL 
        AND fr.created_at >= NOW() - INTERVAL '12 months'
      GROUP BY a.category, DATE_TRUNC('month', fr.created_at)
      ORDER BY a.category, month
    `

    // Risk intensity (risks per asset)
    const riskIntensityQuery = `
      SELECT 
        a.category as asset_category,
        CASE 
          WHEN COUNT(DISTINCT a.id) > 0 THEN CAST(COUNT(DISTINCT fr.id) AS FLOAT) / COUNT(DISTINCT a.id)
          ELSE 0
        END as risks_per_asset,
        COUNT(DISTINCT fr.id) as total_risks,
        COUNT(DISTINCT a.id) as total_assets,
        MAX(fr.original_ale) as max_ale,
        MIN(fr.original_ale) as min_ale
      FROM assets a
      LEFT JOIN fair_risks fr ON a.id = fr.asset_id
      WHERE a.category IS NOT NULL
      GROUP BY a.category
      ORDER BY risks_per_asset DESC
    `

    // Execute all queries
    const [heatmapData, categoryTotals, severityDistribution, treatmentEffectiveness, riskTrends, riskIntensity] =
      await Promise.all([
        tenantDb`${heatmapQuery}`,
        tenantDb`${categoryTotalsQuery}`,
        tenantDb`${severityDistributionQuery}`,
        tenantDb`${treatmentEffectivenessQuery}`,
        tenantDb`${riskTrendsQuery}`,
        tenantDb`${riskIntensityQuery}`,
      ])

    return NextResponse.json({
      heatmap_data: heatmapData,
      category_totals: categoryTotals,
      severity_distribution: severityDistribution,
      treatment_effectiveness: treatmentEffectiveness,
      risk_trends: riskTrends,
      risk_intensity: riskIntensity,
    })
  } catch (error) {
    console.error("Error fetching heat map data:", error)
    return NextResponse.json({ error: "Failed to fetch heat map data" }, { status: 500 })
  }
});
