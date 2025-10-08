import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get overall statistics
    const stats = await tenantDb`
      SELECT 
        COUNT(*) as total_plans,
        COUNT(CASE WHEN status = 'Planning' THEN 1 END) as planning_count,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN status = 'On Hold' THEN 1 END) as on_hold_count,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled_count,
        COUNT(CASE WHEN priority_level = 'Critical' THEN 1 END) as critical_count,
        COUNT(CASE WHEN priority_level = 'High' THEN 1 END) as high_count,
        COUNT(CASE WHEN priority_level = 'Medium' THEN 1 END) as medium_count,
        COUNT(CASE WHEN priority_level = 'Low' THEN 1 END) as low_count,
        AVG(progress_percentage) as avg_progress,
        SUM(estimated_cost) as total_investment,
        AVG(estimated_duration_days) as avg_duration
      FROM nist_csf_mitigation_plans
    ` as Record<string, number>[]

    // Get overdue plans
    const overduePlans = await tenantDb`
      SELECT COUNT(*) as overdue_count
      FROM nist_csf_mitigation_plans
      WHERE target_completion_date < CURRENT_DATE 
      AND status NOT IN ('Completed', 'Cancelled')
    ` as Record<string, number>[]

    // Get plans due soon (within 30 days)
    const dueSoonPlans = await tenantDb`
      SELECT COUNT(*) as due_soon_count
      FROM nist_csf_mitigation_plans
      WHERE target_completion_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      AND status NOT IN ('Completed', 'Cancelled')
    ` as Record<string, number>[]

    // Get monthly completion trend
    const monthlyTrend = await tenantDb`
      SELECT 
        DATE_TRUNC('month', actual_completion_date) as month,
        COUNT(*) as completed_count
      FROM nist_csf_mitigation_plans
      WHERE actual_completion_date IS NOT NULL
      AND actual_completion_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', actual_completion_date)
      ORDER BY month
    `

    return NextResponse.json({
      success: true,
      data: {
        overview: stats[0],
        overdue_count: overduePlans[0].overdue_count,
        due_soon_count: dueSoonPlans[0].due_soon_count,
        monthly_trend: monthlyTrend,
      },
    })
  } catch (error) {
    console.error("Error fetching NIST CSF mitigation plan statistics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch statistics",
      },
      { status: 500 },
    )
  }
});
