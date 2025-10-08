import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const fairRiskId = searchParams.get("fair_risk_id")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assigned_to")

    let query = `
      SELECT 
        rtp.id,
        rtp.plan_id,
        rtp.fair_risk_id,
        rtp.plan_title,
        rtp.plan_description,
        rtp.treatment_type,
        rtp.priority,
        rtp.estimated_cost,
        rtp.estimated_effort_hours,
        rtp.expected_risk_reduction,
        rtp.plan_status,
        rtp.assigned_to,
        rtp.start_date,
        rtp.target_completion_date,
        rtp.actual_completion_date,
        rtp.approval_required,
        rtp.approved_by,
        rtp.approved_date,
        rtp.created_by,
        rtp.created_at,
        rtp.updated_at,
        fr.risk_title as fair_risk_title,
        fr.risk_id as fair_risk_id_display,
        CASE 
          WHEN rtp.target_completion_date < CURRENT_DATE AND rtp.plan_status NOT IN ('completed', 'cancelled') 
          THEN CURRENT_DATE - rtp.target_completion_date 
          ELSE 0 
        END as days_overdue,
        (
          SELECT COUNT(*) 
          FROM risk_treatment_controls rtc 
          WHERE rtc.treatment_plan_id = rtp.id
        ) as total_controls,
        (
          SELECT COUNT(*) 
          FROM risk_treatment_controls rtc 
          WHERE rtc.treatment_plan_id = rtp.id 
          AND rtc.implementation_status = 'operational'
        ) as completed_controls
      FROM risk_treatment_plans rtp
      LEFT JOIN fair_risks fr ON rtp.fair_risk_id = fr.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (fairRiskId) {
      query += ` AND rtp.fair_risk_id = $${paramIndex}`
      params.push(fairRiskId)
      paramIndex++
    }

    if (status) {
      query += ` AND rtp.plan_status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (priority) {
      query += ` AND rtp.priority = $${paramIndex}`
      params.push(priority)
      paramIndex++
    }

    if (assignedTo) {
      query += ` AND rtp.assigned_to ILIKE $${paramIndex}`
      params.push(`%${assignedTo}%`)
      paramIndex++
    }

    query += ` ORDER BY rtp.priority DESC, rtp.target_completion_date ASC`

    const plans = await tenantDb`${tenantDb.unsafe(query)}`
    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching risk treatment plans:", error)
    return NextResponse.json({ error: "Failed to fetch risk treatment plans" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()

    const {
      fair_risk_id,
      plan_title,
      plan_description,
      treatment_type,
      priority,
      estimated_cost,
      estimated_effort_hours,
      expected_risk_reduction,
      plan_status,
      assigned_to,
      start_date,
      target_completion_date,
      approval_required,
      created_by,
    } = body

    const result = await tenantDb`
      INSERT INTO risk_treatment_plans (
        fair_risk_id, plan_title, plan_description, treatment_type, priority,
        estimated_cost, estimated_effort_hours, expected_risk_reduction,
        plan_status, assigned_to, start_date, target_completion_date,
        approval_required, created_by, created_at, updated_at
      ) VALUES (
        ${fair_risk_id}, ${plan_title}, ${plan_description}, ${treatment_type}, ${priority},
        ${estimated_cost}, ${estimated_effort_hours}, ${expected_risk_reduction},
        ${plan_status}, ${assigned_to}, ${start_date}, ${target_completion_date},
        ${approval_required}, ${created_by}, NOW(), NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating risk treatment plan:", error)
    return NextResponse.json({ error: "Failed to create risk treatment plan" }, { status: 500 })
  }
});
