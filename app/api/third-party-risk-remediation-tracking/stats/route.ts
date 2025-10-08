import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Check if the table exists first
    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'third_party_risk_remediation_tracking'
      )
    ` as Record<string, any>[]

    if (!tableExists[0].exists) {
      console.log("Third party risk remediation tracking table does not exist, returning empty stats")
      return NextResponse.json({
        success: true,
        data: {
          stats: {
            total_items: 0,
            completed: 0,
            in_progress: 0,
            open: 0,
            on_hold: 0,
            overdue: 0,
            avg_progress: 0,
            total_estimated_cost: 0,
            total_actual_cost: 0,
          },
          overview: {
            total_items: 0,
            completed: 0,
            in_progress: 0,
            open: 0,
            on_hold: 0,
            overdue: 0,
            avg_progress: 0,
            total_estimated_cost: 0,
            total_actual_cost: 0,
          },
          departmentBreakdown: [],
          priorityBreakdown: [],
        },
      })
    }

    // Get overall statistics
    const stats = await tenantDb`
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'Open' THEN 1 END) as open,
        COUNT(CASE WHEN status = 'On Hold' THEN 1 END) as on_hold,
        COUNT(CASE WHEN target_completion_date < CURRENT_DATE AND status != 'Completed' THEN 1 END) as overdue,
        COALESCE(AVG(progress_percentage), 0) as avg_progress,
        COALESCE(SUM(estimated_cost), 0) as total_estimated_cost,
        COALESCE(SUM(actual_cost), 0) as total_actual_cost
      FROM third_party_risk_remediation_tracking
    ` as Record<string, any>[]

    // Get department breakdown
    const departmentStats = await tenantDb`
      SELECT 
        responsible_department,
        COUNT(*) as count,
        COALESCE(AVG(progress_percentage), 0) as avg_progress
      FROM third_party_risk_remediation_tracking
      WHERE responsible_department IS NOT NULL
      GROUP BY responsible_department
      ORDER BY count DESC
    `

    // Get priority breakdown
    const priorityStats = await tenantDb`
      SELECT 
        risk_before_remediation as priority,
        COUNT(*) as count
      FROM third_party_risk_remediation_tracking
      WHERE risk_before_remediation IS NOT NULL
      GROUP BY risk_before_remediation
      ORDER BY 
        CASE risk_before_remediation
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
        END
    `

    return NextResponse.json({
      success: true,
      data: {
        stats: stats[0],
        overview: stats[0],
        departmentBreakdown: departmentStats,
        priorityBreakdown: priorityStats,
      },
    })
  } catch (error) {
    console.error("Error fetching remediation tracking stats:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch statistics",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
});
