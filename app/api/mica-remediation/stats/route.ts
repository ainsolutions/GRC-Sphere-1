import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("mica_assessment_id")

    let stats, priorityDistribution, statusDistribution

    if (assessmentId) {
      const idNum = Number(assessmentId)

      // ✅ use tagged template with ${idNum}
      stats = await tenantDb`
        SELECT 
          COUNT(*) as total_plans,
          COUNT(CASE WHEN mica_status = 'Open' THEN 1 END) as open_count,
          COUNT(CASE WHEN mica_status = 'In Progress' THEN 1 END) as in_progress_count,
          COUNT(CASE WHEN mica_status = 'Completed' THEN 1 END) as completed_count,
          COUNT(CASE WHEN mica_status = 'On Hold' THEN 1 END) as on_hold_count,
          COUNT(CASE WHEN mica_status = 'Cancelled' THEN 1 END) as cancelled_count,
          COUNT(CASE WHEN mica_priority = 'Critical' THEN 1 END) as critical_count,
          COUNT(CASE WHEN mica_priority = 'High' THEN 1 END) as high_count,
          COUNT(CASE WHEN mica_priority = 'Medium' THEN 1 END) as medium_count,
          COUNT(CASE WHEN mica_priority = 'Low' THEN 1 END) as low_count,
          SUM(mica_estimated_cost) as total_estimated_cost,
          AVG(mica_estimated_cost) as avg_estimated_cost,
          COUNT(CASE WHEN mica_target_date < CURRENT_DATE AND mica_status != 'Completed' THEN 1 END) as overdue_count,
          COUNT(CASE WHEN mica_target_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as due_soon_count
        FROM mica_remediation_plans
        WHERE mica_assessment_id = ${idNum}
      ` as Record<string, any>[]

      priorityDistribution = await tenantDb`
        SELECT 
          mica_priority,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
        FROM mica_remediation_plans
        WHERE mica_assessment_id = ${idNum}
        GROUP BY mica_priority
        ORDER BY 
          CASE mica_priority 
            WHEN 'Critical' THEN 1 
            WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 
            WHEN 'Low' THEN 4 
          END
      `

      statusDistribution = await tenantDb`
        SELECT 
          mica_status,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
        FROM mica_remediation_plans
        WHERE mica_assessment_id = ${idNum}
        GROUP BY mica_status
        ORDER BY count DESC
      `
    } else {
      // No filter → no WHERE clause
      stats = await tenantDb`
        SELECT 
          COUNT(*) as total_plans,
          COUNT(CASE WHEN mica_status = 'Open' THEN 1 END) as open_count,
          COUNT(CASE WHEN mica_status = 'In Progress' THEN 1 END) as in_progress_count,
          COUNT(CASE WHEN mica_status = 'Completed' THEN 1 END) as completed_count,
          COUNT(CASE WHEN mica_status = 'On Hold' THEN 1 END) as on_hold_count,
          COUNT(CASE WHEN mica_status = 'Cancelled' THEN 1 END) as cancelled_count,
          COUNT(CASE WHEN mica_priority = 'Critical' THEN 1 END) as critical_count,
          COUNT(CASE WHEN mica_priority = 'High' THEN 1 END) as high_count,
          COUNT(CASE WHEN mica_priority = 'Medium' THEN 1 END) as medium_count,
          COUNT(CASE WHEN mica_priority = 'Low' THEN 1 END) as low_count,
          SUM(mica_estimated_cost) as total_estimated_cost,
          AVG(mica_estimated_cost) as avg_estimated_cost,
          COUNT(CASE WHEN mica_target_date < CURRENT_DATE AND mica_status != 'Completed' THEN 1 END) as overdue_count,
          COUNT(CASE WHEN mica_target_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as due_soon_count
        FROM mica_remediation_plans
      ` as Record <string, any>[]

      priorityDistribution = await tenantDb`
        SELECT 
          mica_priority,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
        FROM mica_remediation_plans
        GROUP BY mica_priority
        ORDER BY 
          CASE mica_priority 
            WHEN 'Critical' THEN 1 
            WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 
            WHEN 'Low' THEN 4 
          END
      `

      statusDistribution = await tenantDb`
        SELECT 
          mica_status,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
        FROM mica_remediation_plans
        GROUP BY mica_status
        ORDER BY count DESC
      `
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: stats[0],
        priorityDistribution,
        statusDistribution,
      },
    })
  } catch (error) {
    console.error("Error fetching MICA remediation stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch MICA remediation stats" }, { status: 500 })
  }
})
