import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get overall statistics
    const statsResult = await tenantDb`
      SELECT * FROM incident_remediation_stats
    ` as Record<string, any>[]

    // Get department statistics
    const departmentStatsResult = await tenantDb`
      SELECT * FROM incident_remediation_department_stats
      ORDER BY total_remediations DESC
      LIMIT 10
    `

    // Get priority distribution
    const priorityStatsResult = await tenantDb`
      SELECT 
        priority,
        COUNT(*) as count,
        ROUND((COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM incident_remediation_tracking)::NUMERIC) * 100, 1) as percentage
      FROM incident_remediation_tracking
      GROUP BY priority
      ORDER BY 
        CASE priority 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
        END
    `

    // Get status distribution
    const statusStatsResult = await tenantDb`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND((COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM incident_remediation_tracking)::NUMERIC) * 100, 1) as percentage
      FROM incident_remediation_tracking
      GROUP BY status
      ORDER BY count DESC
    `

    // Get recent activity
    const recentActivityResult = await tenantDb`
      SELECT 
        iru.update_date,
        iru.update_type,
        iru.update_description,
        iru.updated_by,
        irt.remediation_title,
        irt.remediation_id,
        i.incident_title
      FROM incident_remediation_updates iru
      JOIN incident_remediation_tracking irt ON iru.remediation_id = irt.id
      LEFT JOIN incidents i ON irt.incident_id = i.incident_id
      ORDER BY iru.update_date DESC
      LIMIT 10
    `

    // Get overdue remediations
    const overdueResult = await tenantDb`
      SELECT 
        irt.remediation_id,
        irt.remediation_title,
        irt.target_completion_date,
        irt.assigned_to,
        irt.priority,
        irt.responsible_department,
        i.incident_title,
        CURRENT_DATE - irt.target_completion_date as days_overdue
      FROM incident_remediation_tracking irt
      LEFT JOIN incidents i ON irt.incident_id = i.incident_id
      WHERE irt.target_completion_date < CURRENT_DATE 
        AND irt.status NOT IN ('Completed', 'Verified')
      ORDER BY days_overdue DESC
      LIMIT 10
    `

    return NextResponse.json({
      success: true,
      data: {
        stats: statsResult[0] || {},
        departmentStats: departmentStatsResult,
        priorityStats: priorityStatsResult,
        statusStats: statusStatsResult,
        recentActivity: recentActivityResult,
        overdueRemediations: overdueResult,
      },
    })
  } catch (error) {
    console.error("Error fetching incident remediation stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch incident remediation statistics" },
      { status: 500 },
    )
  }
});
