import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const stats = await tenantDb`
      SELECT 
        COUNT(*) as total_gaps,
        COUNT(CASE WHEN remediation_status = 'Completed' THEN 1 END) as completed_gaps,
        COUNT(CASE WHEN remediation_status = 'In Progress' THEN 1 END) as in_progress_gaps,
        COUNT(CASE WHEN remediation_status = 'Identified' THEN 1 END) as identified_gaps,
        COUNT(CASE WHEN gap_severity = 'Critical' THEN 1 END) as critical_gaps,
        COUNT(CASE WHEN gap_severity = 'High' THEN 1 END) as high_gaps,
        COUNT(CASE WHEN gap_severity = 'Medium' THEN 1 END) as medium_gaps,
        COUNT(CASE WHEN gap_severity = 'Low' THEN 1 END) as low_gaps,
        COUNT(CASE WHEN target_completion_date < CURRENT_DATE AND remediation_status != 'Completed' THEN 1 END) as overdue_gaps,
        COUNT(CASE WHEN target_completion_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' AND remediation_status != 'Completed' THEN 1 END) as due_soon_gaps,
        COALESCE(SUM(estimated_cost), 0) as total_estimated_cost,
        COALESCE(SUM(actual_cost), 0) as total_actual_cost,
        COALESCE(AVG(priority_ranking), 0) as average_priority,
        COALESCE(AVG(
          CASE 
            WHEN target_completion_date IS NOT NULL AND target_completion_date < CURRENT_DATE AND remediation_status != 'Completed' 
            THEN CURRENT_DATE - target_completion_date
            ELSE 0
          END
        ), 0) as avg_aging_days
      FROM third_party_gap_analysis
    ` as Record<string, any>[]

    const vendorStats = await tenantDb`
      SELECT 
        v.vendor_name,
        COUNT(g.id) as gap_count,
        COUNT(CASE WHEN g.remediation_status = 'Completed' THEN 1 END) as completed_count
      FROM vendors v
      LEFT JOIN third_party_gap_analysis g ON v.id = g.vendor_id
      GROUP BY v.id, v.vendor_name
      HAVING COUNT(g.id) > 0
      ORDER BY gap_count DESC
      LIMIT 10
    `

    const totalGaps = Number.parseInt(stats[0].total_gaps)
    const completedGaps = Number.parseInt(stats[0].completed_gaps)
    const openGaps = totalGaps - completedGaps
    const totalBudgetAllocated = Number.parseFloat(stats[0].total_estimated_cost)
    const totalBudgetSpent = Number.parseFloat(stats[0].total_actual_cost)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          total_gaps: totalGaps,
          open_gaps: openGaps,
          closed_gaps: completedGaps,
          overdue_gaps: Number.parseInt(stats[0].overdue_gaps),
          critical_gaps: Number.parseInt(stats[0].critical_gaps),
          high_gaps: Number.parseInt(stats[0].high_gaps),
          medium_gaps: Number.parseInt(stats[0].medium_gaps),
          low_gaps: Number.parseInt(stats[0].low_gaps),
          avg_aging_days: Number.parseFloat(stats[0].avg_aging_days),
          total_budget_allocated: totalBudgetAllocated,
          total_budget_spent: totalBudgetSpent,
          budget_utilization_percentage: totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated) * 100 : 0,
          completion_rate: totalGaps > 0 ? Math.round((completedGaps / totalGaps) * 100) : 0,
        },
        vendor_stats: vendorStats,
      },
    })
  } catch (error) {
    console.error("Error fetching gap statistics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gap statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
