import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get total risks count
    const totalRisks = await tenantDb`
      SELECT COUNT(*) as count FROM sphere_ai_risks
    ` as Record<string, any>[]

    // Get risks by level
    const risksByLevel = await tenantDb`
      SELECT 
        ai_risk_level,
        COUNT(*) as count
      FROM sphere_ai_risks 
      GROUP BY ai_risk_level
      ORDER BY 
        CASE ai_risk_level
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END
    ` as Record<string, any>[]

    // Get risks by category
    const risksByCategory = await tenantDb`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(ai_risk_score) as avg_score
      FROM sphere_ai_risks 
      GROUP BY category
      ORDER BY count DESC
    ` as Record<string, any>[]

    // Get risks by status
    const risksByStatus = await tenantDb`
      SELECT 
        status,
        COUNT(*) as count
      FROM sphere_ai_risks 
      GROUP BY status
    ` as Record<string, any>[]

    // Get recent risks (last 30 days)
    const recentRisks = await tenantDb`
      SELECT 
        id,
        title,
        ai_risk_level,
        ai_risk_score,
        created_at
      FROM sphere_ai_risks 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 10
    ` as Record<string, any>[]

    // Get average AI confidence
    const avgConfidence = await tenantDb`
      SELECT AVG(ai_confidence) as avg_confidence
      FROM sphere_ai_risks
    ` as Record<string, any>[]

    // Get top risk categories by score
    const topRiskCategories = await tenantDb`
      SELECT 
        category,
        AVG(ai_risk_score) as avg_score,
        COUNT(*) as count
      FROM sphere_ai_risks 
      GROUP BY category
      ORDER BY avg_score DESC
      LIMIT 5
    ` as Record<string, any>[]

    // Get risk trends (monthly)
    const riskTrends = await tenantDb`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count,
        AVG(ai_risk_score) as avg_score
      FROM sphere_ai_risks 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    ` as Record<string, any>[]

    // Calculate individual risk level counts
    const criticalCount = risksByLevel.find((r) => r.ai_risk_level === "Critical")?.count || 0
    const highCount = risksByLevel.find((r) => r.ai_risk_level === "High")?.count || 0
    const mediumCount = risksByLevel.find((r) => r.ai_risk_level === "Medium")?.count || 0
    const lowCount = risksByLevel.find((r) => r.ai_risk_level === "Low")?.count || 0

    return NextResponse.json({
      totalRisks: Number.parseInt(totalRisks[0].count),
      criticalRisks: Number.parseInt(criticalCount.toString()),
      highRisks: Number.parseInt(highCount.toString()),
      mediumRisks: Number.parseInt(mediumCount.toString()),
      lowRisks: Number.parseInt(lowCount.toString()),
      averageConfidence: Math.round(Number.parseFloat(avgConfidence[0].avg_confidence || "0")),
      risksByLevel: risksByLevel.map((r) => ({
        level: r.ai_risk_level,
        count: Number.parseInt(r.count),
      })),
      risksByCategory: risksByCategory.map((r) => ({
        category: r.category,
        count: Number.parseInt(r.count),
        avgScore: Number.parseFloat(r.avg_score).toFixed(1),
      })),
      risksByStatus: risksByStatus.map((r) => ({
        status: r.status,
        count: Number.parseInt(r.count),
      })),
      topRiskCategories: topRiskCategories.map((r) => ({
        category: r.category,
        avgScore: Number.parseFloat(r.avg_score).toFixed(1),
        count: Number.parseInt(r.count),
      })),
      riskTrends: riskTrends.map((r) => ({
        month: r.month,
        count: Number.parseInt(r.count),
        avgScore: Number.parseFloat(r.avg_score).toFixed(1),
      })),
      recentRisks: recentRisks.map((r) => ({
        id: r.id,
        title: r.title,
        ai_risk_level: r.ai_risk_level,
        ai_risk_score: Number.parseFloat(r.ai_risk_score),
        created_at: r.created_at,
      })),
    })
  } catch (error) {
    console.error("Error fetching sphere AI risk stats:", error)
    return NextResponse.json({ error: "Failed to fetch risk statistics" }, { status: 500 })
  }
});
