import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}, request) => {
  try {
    // Get risk statistics
    const statsResult = await tenantDb`
      SELECT 
        COUNT(*) as total_risks,
        COUNT(CASE WHEN overall_risk_level = 'Critical' THEN 1 END) as critical_risks,
        COUNT(CASE WHEN overall_risk_level = 'High' THEN 1 END) as high_risks,
        COUNT(CASE WHEN overall_risk_level = 'Medium' THEN 1 END) as medium_risks,
        COUNT(CASE WHEN overall_risk_level = 'Low' THEN 1 END) as low_risks,
        COUNT(CASE WHEN next_review_date < CURRENT_DATE THEN 1 END) as overdue_reviews,
        AVG(overall_risk_score) as avg_risk_score
      FROM third_party_risk_evaluations
      WHERE evaluation_status = 'Completed'
    ` as Record<string, any>[]

    const stats = {
      total_risks: Number(statsResult[0].total_risks) || 0,
      critical_risks: Number(statsResult[0].critical_risks) || 0,
      high_risks: Number(statsResult[0].high_risks) || 0,
      medium_risks: Number(statsResult[0].medium_risks) || 0,
      low_risks: Number(statsResult[0].low_risks) || 0,
      overdue_reviews: Number(statsResult[0].overdue_reviews) || 0,
      avg_risk_score: Number(statsResult[0].avg_risk_score) || 0,
    }

    return NextResponse.json({
      success: true,
      data: { stats },
    })
  } catch (error) {
    console.error("Error fetching risk statistics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch risk statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
