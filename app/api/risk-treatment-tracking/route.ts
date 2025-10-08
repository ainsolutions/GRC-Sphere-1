import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const treatmentPlanId = searchParams.get("treatment_plan_id")
    const controlId = searchParams.get("control_id")
    const trackingType = searchParams.get("tracking_type")
    const limit = searchParams.get("limit") || "50"

    let query = `
      SELECT 
        rtt.*,
        rtp.plan_title as treatment_plan_title,
        rtp.plan_id as treatment_plan_id_display,
        rtc.control_title as control_title,
        rtc.control_id as control_id_display
      FROM risk_treatment_tracking rtt
      LEFT JOIN risk_treatment_plans rtp ON rtt.treatment_plan_id = rtp.id
      LEFT JOIN risk_treatment_controls rtc ON rtt.control_id = rtc.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (treatmentPlanId) {
      query += ` AND rtt.treatment_plan_id = $${paramIndex}`
      params.push(treatmentPlanId)
      paramIndex++
    }

    if (controlId) {
      query += ` AND rtt.control_id = $${paramIndex}`
      params.push(controlId)
      paramIndex++
    }

    if (trackingType) {
      query += ` AND rtt.tracking_type = $${paramIndex}`
      params.push(trackingType)
      paramIndex++
    }

    query += ` ORDER BY rtt.tracking_date DESC, rtt.created_at DESC LIMIT $${paramIndex}`
    params.push(limit)

    const tracking = await tenantDb`${tenantDb.unsafe(query)}`
    return NextResponse.json(tracking)
  } catch (error) {
    console.error("Error fetching risk treatment tracking:", error)
    return NextResponse.json({ error: "Failed to fetch risk treatment tracking" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()

    const {
      treatment_plan_id,
      control_id,
      tracking_type,
      old_status,
      new_status,
      tracking_date,
      description,
      impact_assessment,
      action_required,
      responsible_party,
      due_date,
      created_by,
    } = body

    const result = await tenantDb`
      INSERT INTO risk_treatment_tracking (
        treatment_plan_id, control_id, tracking_type, old_status, new_status,
        tracking_date, description, impact_assessment, action_required,
        responsible_party, due_date, created_by, created_at
      ) VALUES (
        ${treatment_plan_id}, ${control_id}, ${tracking_type}, ${old_status}, ${new_status},
        ${tracking_date}, ${description}, ${impact_assessment}, ${action_required},
        ${responsible_party}, ${due_date}, ${created_by}, NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating risk treatment tracking entry:", error)
    return NextResponse.json({ error: "Failed to create risk treatment tracking entry" }, { status: 500 })
  }
});
