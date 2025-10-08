import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const plan = await tenantDb`
      SELECT 
        rtp.*,
        fr.risk_title as fair_risk_title,
        fr.risk_id as fair_risk_id_display,
        CASE 
          WHEN rtp.target_completion_date < CURRENT_DATE AND rtp.plan_status NOT IN ('completed', 'cancelled') 
          THEN CURRENT_DATE - rtp.target_completion_date 
          ELSE 0 
        END as days_overdue
      FROM risk_treatment_plans rtp
      LEFT JOIN fair_risks fr ON rtp.fair_risk_id = fr.id
      WHERE rtp.id = ${params.id}
    ` as Record<string, any>[]

    if (plan.length === 0) {
      return NextResponse.json({ error: "Risk treatment plan not found" }, { status: 404 })
    }

    return NextResponse.json(plan[0])
  } catch (error) {
    console.error("Error fetching risk treatment plan:", error)
    return NextResponse.json({ error: "Failed to fetch risk treatment plan" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()

    const {
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
      actual_completion_date,
      approval_required,
      approved_by,
      approved_date,
    } = body

    const result = await tenantDb`
      UPDATE risk_treatment_plans SET
        plan_title = ${plan_title},
        plan_description = ${plan_description},
        treatment_type = ${treatment_type},
        priority = ${priority},
        estimated_cost = ${estimated_cost},
        estimated_effort_hours = ${estimated_effort_hours},
        expected_risk_reduction = ${expected_risk_reduction},
        plan_status = ${plan_status},
        assigned_to = ${assigned_to},
        start_date = ${start_date},
        target_completion_date = ${target_completion_date},
        actual_completion_date = ${actual_completion_date},
        approval_required = ${approval_required},
        approved_by = ${approved_by},
        approved_date = ${approved_date},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk treatment plan not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating risk treatment plan:", error)
    return NextResponse.json({ error: "Failed to update risk treatment plan" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      DELETE FROM risk_treatment_plans 
      WHERE id = ${params.id}
      RETURNING plan_id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk treatment plan not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Risk treatment plan deleted successfully",
      deleted_plan_id: result[0].plan_id,
    })
  } catch (error) {
    console.error("Error deleting risk treatment plan:", error)
    return NextResponse.json({ error: "Failed to delete risk treatment plan" }, { status: 500 })
  }
});
