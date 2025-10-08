import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get policy statistics
    const stats = await tenantDb`
      SELECT 
        COUNT(*) as total_policies,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published_policies,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_policies,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_policies,
        COUNT(CASE WHEN next_review_date < CURRENT_DATE THEN 1 END) as overdue_reviews
      FROM policies
    ` as Record<string, any>[]

    // Get category distribution
    const categoryDistribution = await tenantDb`
      SELECT 
        pc.id,
        pc.name,
        pc.description,
        pc.color,
        COUNT(p.id) as policy_count
      FROM policy_categories pc
      LEFT JOIN policies p ON pc.id = p.category_id
      GROUP BY pc.id, pc.name, pc.description, pc.color
      ORDER BY policy_count DESC
    ` as Record<string, any>[]

    // Get recent activities
    const recentActivities = await tenantDb`
      SELECT 
        p.id,
        p.policy_id,
        p.title,
        p.status,
        p.updated_at,
        pc.name as category_name,
        pc.color as category_color
      FROM policies p
      LEFT JOIN policy_categories pc ON p.category_id = pc.id
      ORDER BY p.updated_at DESC
      LIMIT 10
    ` as Record<string, any>[]

    // Get upcoming reviews
    const upcomingReviews = await tenantDb`
      SELECT 
        p.id,
        p.policy_id,
        p.title,
        p.next_review_date,
        pc.name as category_name,
        pc.color as category_color
      FROM policies p
      LEFT JOIN policy_categories pc ON p.category_id = pc.id
      WHERE p.next_review_date IS NOT NULL
      AND p.next_review_date >= CURRENT_DATE
      ORDER BY p.next_review_date ASC
      LIMIT 10
    `

    // Get acknowledgment stats (placeholder for now)
    const acknowledgmentStats: any[] = []

    return NextResponse.json({
      stats: stats[0],
      categoryDistribution,
      recentActivities,
      upcomingReviews,
      acknowledgmentStats,
    })
  } catch (error) {
    console.error("Error fetching policy dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
});
