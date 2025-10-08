import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get overall treatment plan statistics
    const planStats = await tenantDb`
      SELECT 
        COUNT(*) as total_plans,
        COUNT(CASE WHEN plan_status = 'completed' THEN 1 END) as completed_plans,
        COUNT(CASE WHEN plan_status = 'in_progress' THEN 1 END) as in_progress_plans,
        COUNT(CASE WHEN plan_status = 'overdue' OR (target_completion_date < CURRENT_DATE AND plan_status NOT IN ('completed', 'cancelled')) THEN 1 END) as overdue_plans,
        AVG(expected_risk_reduction) as avg_risk_reduction,
        SUM(estimated_cost) as total_estimated_cost
      FROM risk_treatment_plans
    ` as Record<string, any>[]

    // Get control statistics
    const controlStats = await tenantDb`
      SELECT 
        COUNT(*) as total_controls,
        COUNT(CASE WHEN implementation_status = 'operational' THEN 1 END) as operational_controls,
        COUNT(CASE WHEN implementation_status = 'in_progress' THEN 1 END) as in_progress_controls,
        COUNT(CASE WHEN next_review_date < CURRENT_DATE THEN 1 END) as overdue_reviews,
        AVG(effectiveness_rating) as avg_effectiveness_rating,
        SUM(implementation_cost) as total_implementation_cost,
        SUM(maintenance_cost_annual) as total_maintenance_cost
      FROM risk_treatment_controls
    ` as Record<string, any>[]

    // Get aging analysis
    const agingAnalysis = await tenantDb`
      SELECT 
        tracking_type,
        COUNT(*) as count,
        AVG(aging_days) as avg_aging_days,
        MAX(aging_days) as max_aging_days
      FROM risk_treatment_tracking
      WHERE resolution_date IS NULL
      GROUP BY tracking_type
      ORDER BY avg_aging_days DESC
    `

    // Get treatment type distribution
    const treatmentTypeDistribution = await tenantDb`
      SELECT 
        treatment_type,
        COUNT(*) as count,
        AVG(expected_risk_reduction) as avg_risk_reduction,
        SUM(estimated_cost) as total_cost
      FROM risk_treatment_plans
      GROUP BY treatment_type
      ORDER BY count DESC
    `

    // Get priority distribution
    const priorityDistribution = await tenantDb`
      SELECT 
        priority,
        COUNT(*) as count,
        COUNT(CASE WHEN plan_status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN target_completion_date < CURRENT_DATE AND plan_status NOT IN ('completed', 'cancelled') THEN 1 END) as overdue
      FROM risk_treatment_plans
      GROUP BY priority
      ORDER BY 
        CASE priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END
    `

    // Get recent tracking activities
    const recentActivities = await tenantDb`
      SELECT 
        rtt.tracking_type,
        rtt.tracking_date,
        rtt.description,
        rtt.aging_days,
        rtp.plan_title,
        rtp.plan_id,
        rtc.control_title,
        rtc.control_id
      FROM risk_treatment_tracking rtt
      LEFT JOIN risk_treatment_plans rtp ON rtt.treatment_plan_id = rtp.id
      LEFT JOIN risk_treatment_controls rtc ON rtt.control_id = rtc.id
      ORDER BY rtt.tracking_date DESC, rtt.created_at DESC
      LIMIT 10
    `

    // Get overdue items
    const overdueItems = await tenantDb`
      SELECT 
        'treatment_plan' as item_type,
        rtp.plan_id as item_id,
        rtp.plan_title as title,
        rtp.target_completion_date as due_date,
        CURRENT_DATE - rtp.target_completion_date as days_overdue,
        rtp.assigned_to as responsible_party,
        rtp.priority
      FROM risk_treatment_plans rtp
      WHERE rtp.target_completion_date < CURRENT_DATE 
        AND rtp.plan_status NOT IN ('completed', 'cancelled')
      
      UNION ALL
      
      SELECT 
        'control_review' as item_type,
        rtc.control_id as item_id,
        rtc.control_title as title,
        rtc.next_review_date as due_date,
        CURRENT_DATE - rtc.next_review_date as days_overdue,
        rtc.assigned_owner as responsible_party,
        'medium' as priority
      FROM risk_treatment_controls rtc
      WHERE rtc.next_review_date < CURRENT_DATE
      
      ORDER BY days_overdue DESC
      LIMIT 20
    `

    const stats = {
      plan_stats: planStats[0],
      control_stats: controlStats[0],
      aging_analysis: agingAnalysis,
      treatment_type_distribution: treatmentTypeDistribution,
      priority_distribution: priorityDistribution,
      recent_activities: recentActivities,
      overdue_items: overdueItems,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching risk treatment tracking stats:", error)
    return NextResponse.json({ error: "Failed to fetch risk treatment tracking stats" }, { status: 500 })
  }
});
