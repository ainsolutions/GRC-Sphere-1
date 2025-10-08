import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { Result } from "postcss";


export const GET = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")

    // Check if table exists
    const tableExists = (await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hipaa_remediation_actions'
      )
    `) as Record<string,any>[];

    if (!tableExists[0]?.exists) {
      // Return sample stats if table doesn't exist
      return NextResponse.json({
        overall: {
          total_actions: 2,
          open_actions: 1,
          in_progress_actions: 1,
          completed_actions: 0,
          closed_actions: 0,
          deferred_actions: 0,
          overdue_actions: 1,
          due_soon_actions: 0,
          avg_progress: 32.5,
          total_estimated_cost: 20000,
          total_actual_cost: 3200,
        },
        by_priority: [
          {
            remediation_priority: "critical",
            count: 1,
            completed_count: 0,
            avg_progress: 0,
          },
          {
            remediation_priority: "high",
            count: 1,
            completed_count: 0,
            avg_progress: 65,
          },
        ],
        by_severity: [
          {
            finding_severity: "critical",
            count: 1,
            completed_count: 0,
            avg_progress: 0,
          },
          {
            finding_severity: "high",
            count: 1,
            completed_count: 0,
            avg_progress: 65,
          },
        ],
        by_department: [
          {
            assigned_department: "IT Security",
            count: 1,
            completed_count: 0,
            avg_progress: 65,
          },
          {
            assigned_department: "Infrastructure",
            count: 1,
            completed_count: 0,
            avg_progress: 0,
          },
        ],
      })
    }

    // Build WHERE clause for assessment filter
    let whereClause = "WHERE 1=1"
    if (assessmentId) {
      whereClause += ` AND assessment_id = ${assessmentId}`
    }

    // Get overall statistics
    const overallStats = (await tenantDb`
      SELECT 
        COUNT(*) as total_actions,
        COUNT(CASE WHEN remediation_status = 'open' THEN 1 END) as open_actions,
        COUNT(CASE WHEN remediation_status = 'in-progress' THEN 1 END) as in_progress_actions,
        COUNT(CASE WHEN remediation_status = 'completed' THEN 1 END) as completed_actions,
        COUNT(CASE WHEN remediation_status = 'closed' THEN 1 END) as closed_actions,
        COUNT(CASE WHEN remediation_status = 'deferred' THEN 1 END) as deferred_actions,
        COUNT(CASE WHEN timeline_status = 'overdue' THEN 1 END) as overdue_actions,
        COUNT(CASE WHEN timeline_status = 'due-soon' THEN 1 END) as due_soon_actions,
        COALESCE(AVG(progress_percentage), 0) as avg_progress,
        COALESCE(SUM(estimated_cost), 0) as total_estimated_cost,
        COALESCE(SUM(actual_cost), 0) as total_actual_cost
      FROM hipaa_remediation_actions
      ${assessmentId ? tenantDb`WHERE assessment_id = ${assessmentId}` : tenantDb``}
    `) as Record<string,any>[];

    // Get statistics by priority
    const priorityStats = await tenantDb`
      SELECT 
        remediation_priority,
        COUNT(*) as count,
        COUNT(CASE WHEN remediation_status = 'completed' THEN 1 END) as completed_count,
        COALESCE(AVG(progress_percentage), 0) as avg_progress
      FROM hipaa_remediation_actions
      ${assessmentId ? tenantDb`WHERE assessment_id = ${assessmentId}` : tenantDb``}
      GROUP BY remediation_priority
      ORDER BY 
        CASE remediation_priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
          ELSE 5 
        END
    `

    // Get statistics by severity
    const severityStats = await tenantDb`
      SELECT 
        finding_severity,
        COUNT(*) as count,
        COUNT(CASE WHEN remediation_status = 'completed' THEN 1 END) as completed_count,
        COALESCE(AVG(progress_percentage), 0) as avg_progress
      FROM hipaa_remediation_actions
      ${assessmentId ? tenantDb`WHERE assessment_id = ${assessmentId}` : tenantDb``}
      GROUP BY finding_severity
      ORDER BY 
        CASE finding_severity 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
          ELSE 5 
        END
    `

    // Get statistics by department
    const departmentStats = await tenantDb`
      SELECT 
        assigned_department,
        COUNT(*) as count,
        COUNT(CASE WHEN remediation_status = 'completed' THEN 1 END) as completed_count,
        COALESCE(AVG(progress_percentage), 0) as avg_progress
      FROM hipaa_remediation_actions
      ${assessmentId ? tenantDb`WHERE assessment_id = ${assessmentId}` : tenantDb``}
      WHERE assigned_department IS NOT NULL AND assigned_department != ''
      GROUP BY assigned_department
      ORDER BY count DESC
    `

    return NextResponse.json({
      overall: overallStats[0] || {
        total_actions: 0,
        open_actions: 0,
        in_progress_actions: 0,
        completed_actions: 0,
        closed_actions: 0,
        deferred_actions: 0,
        overdue_actions: 0,
        due_soon_actions: 0,
        avg_progress: 0,
        total_estimated_cost: 0,
        total_actual_cost: 0,
      },
      by_priority: priorityStats || [],
      by_severity: severityStats || [],
      by_department: departmentStats || [],
    })
  } catch (error) {
    console.error("Error fetching HIPAA remediation stats:", error)
    return NextResponse.json(
      {
        overall: {
          total_actions: 0,
          open_actions: 0,
          in_progress_actions: 0,
          completed_actions: 0,
          closed_actions: 0,
          deferred_actions: 0,
          overdue_actions: 0,
          due_soon_actions: 0,
          avg_progress: 0,
          total_estimated_cost: 0,
          total_actual_cost: 0,
        },
        by_priority: [],
        by_severity: [],
        by_department: [],
      },
      { status: 200 },
    )
  }
});