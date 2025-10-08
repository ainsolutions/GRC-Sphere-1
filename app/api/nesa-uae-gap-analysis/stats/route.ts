import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get total count
    const totalResult = await tenantDb`
      SELECT COUNT(*) as total FROM nesa_uae_gap_analysis
    ` as Record<string, any>[]
    const total = Number.parseInt(totalResult[0].total)

    // Get status distribution
    const statusResult = await tenantDb`
      SELECT 
        status,
        COUNT(*) as count
      FROM nesa_uae_gap_analysis
      GROUP BY status
    ` as Record<string, any>[]

    // Get maturity distribution
    const maturityResult = await tenantDb`
      SELECT 
        initial_control_maturity,
        target_control_maturity,
        COUNT(*) as count
      FROM nesa_uae_gap_analysis
      GROUP BY initial_control_maturity, target_control_maturity
      ORDER BY initial_control_maturity, target_control_maturity
    ` as Record<string, any>[]

    // Get completion rate (closed vs total)
    const completionResult = await tenantDb`
      SELECT 
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as completed,
        COUNT(*) as total
      FROM nesa_uae_gap_analysis
    ` as Record<string, any>[]

    const completionRate = total > 0 ? Math.round((Number.parseInt(completionResult[0].completed) / total) * 100) : 0

    // Get recent activity
    const recentResult = await tenantDb`
      SELECT 
        control_name,
        control_reference,
        status,
        updated_at
      FROM nesa_uae_gap_analysis
      ORDER BY updated_at DESC
      LIMIT 5
    `

    // Get priority distribution (if priority field exists)
    const priorityResult = await tenantDb`
      SELECT 
        CASE 
          WHEN target_control_maturity - initial_control_maturity >= 3 THEN 'high'
          WHEN target_control_maturity - initial_control_maturity >= 2 THEN 'medium'
          ELSE 'low'
        END as priority,
        COUNT(*) as count
      FROM nesa_uae_gap_analysis
      GROUP BY 
        CASE 
          WHEN target_control_maturity - initial_control_maturity >= 3 THEN 'high'
          WHEN target_control_maturity - initial_control_maturity >= 2 THEN 'medium'
          ELSE 'low'
        END
    ` as Record<string, any>[]

    const stats = {
      total,
      completionRate,
      statusDistribution: statusResult.reduce((acc: any, row: any) => {
        acc[row.status] = Number.parseInt(row.count)
        return acc
      }, {}),
      maturityDistribution: maturityResult.map((row: any) => ({
        initial: Number.parseInt(row.initial_control_maturity),
        target: Number.parseInt(row.target_control_maturity),
        count: Number.parseInt(row.count),
      })),
      priorityDistribution: priorityResult.reduce((acc: any, row: any) => {
        acc[row.priority] = Number.parseInt(row.count)
        return acc
      }, {}),
      recentActivity: recentResult,
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("Error fetching gap analysis statistics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
});
