import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")

    let whereClause = "WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (assessmentId) {
      whereClause += ` AND assessment_id = $${paramIndex}`
      params.push(Number.parseInt(assessmentId))
      paramIndex++
    }

    // Get overall statistics
    const overallStats = await tenantDb
      `
      SELECT 
        COUNT(*) as total_actions,
        COUNT(CASE WHEN remediation_status = 'Open' THEN 1 END) as open_actions,
        COUNT(CASE WHEN remediation_status = 'In Progress' THEN 1 END) as in_progress_actions,
        COUNT(CASE WHEN remediation_status = 'Completed' THEN 1 END) as completed_actions,
        COUNT(CASE WHEN remediation_status = 'Closed' THEN 1 END) as closed_actions,
        COUNT(CASE WHEN remediation_status = 'Deferred' THEN 1 END) as deferred_actions,
        COUNT(CASE WHEN target_completion_date < CURRENT_DATE AND remediation_status NOT IN ('Completed', 'Closed') THEN 1 END) as overdue_actions,
        COUNT(CASE WHEN target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND remediation_status NOT IN ('Completed', 'Closed') THEN 1 END) as due_soon_actions,
        ROUND(AVG(progress_percentage), 2) as avg_progress,
        SUM(estimated_cost) as total_estimated_cost,
        SUM(actual_cost) as total_actual_cost
      FROM nesa_uae_remediation_actions 
      ${whereClause}
    ` as Record<string, any>[]

    // Get statistics by priority
    const priorityStats = await tenantDb
      `
      SELECT 
        remediation_priority,
        COUNT(*) as count,
        COUNT(CASE WHEN remediation_status = 'Completed' THEN 1 END) as completed_count,
        ROUND(AVG(progress_percentage), 2) as avg_progress
      FROM nesa_uae_remediation_actions 
      ${whereClause}
      GROUP BY remediation_priority
      ORDER BY 
        CASE remediation_priority 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
        END
    `

    // Get statistics by severity
    const severityStats = await tenantDb
      `
      SELECT 
        finding_severity,
        COUNT(*) as count,
        COUNT(CASE WHEN remediation_status = 'Completed' THEN 1 END) as completed_count,
        ROUND(AVG(progress_percentage), 2) as avg_progress
      FROM nesa_uae_remediation_actions 
      ${whereClause}
      GROUP BY finding_severity
      ORDER BY 
        CASE finding_severity 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
        END
    `

    // Get statistics by department
    const departmentStats = await tenantDb
      `
      SELECT 
        assigned_department,
        COUNT(*) as count,
        COUNT(CASE WHEN remediation_status = 'Completed' THEN 1 END) as completed_count,
        ROUND(AVG(progress_percentage), 2) as avg_progress
      FROM nesa_uae_remediation_actions 
      ${whereClause}
      AND assigned_department IS NOT NULL AND assigned_department != ''
      GROUP BY assigned_department
      ORDER BY count DESC
      LIMIT 10
    `

    // Get monthly completion trend
    const completionTrend = await tenantDb
      `
      SELECT 
        DATE_TRUNC('month', actual_completion_date) as month,
        COUNT(*) as completed_count
      FROM nesa_uae_remediation_actions 
      ${whereClause}
      AND actual_completion_date IS NOT NULL
      AND actual_completion_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', actual_completion_date)
      ORDER BY month
    `

    return NextResponse.json({
      overall: overallStats[0],
      by_priority: priorityStats,
      by_severity: severityStats,
      by_department: departmentStats,
      completion_trend: completionTrend,
    })
  } catch (error) {
    console.error("Error fetching remediation statistics:", error)
    return NextResponse.json({ error: "Failed to fetch remediation statistics" }, { status: 500 })
  }
});
