import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const treatmentPlanId = searchParams.get("treatment_plan_id")
    const controlId = searchParams.get("control_id")

    let result

    if (treatmentPlanId) {
      result = await tenantDb`
        SELECT tt.*, tp.plan_id as treatment_plan_id_display, tc.control_title,
               ir.risk_id as iso_risk_id, ir.title as risk_title,
               CASE 
                 WHEN tt.due_date < CURRENT_DATE AND tt.resolution_date IS NULL 
                 THEN (CURRENT_DATE - tt.due_date)::INTEGER
                 ELSE 0
               END as aging_days
        FROM iso27001_treatment_tracking tt
        LEFT JOIN iso27001_treatment_plans tp ON tt.treatment_plan_id = tp.id
        LEFT JOIN iso27001_treatment_controls tc ON tt.control_id = tc.id
        LEFT JOIN iso27001_risks ir ON tp.iso27001_risk_id = ir.id
        WHERE tt.treatment_plan_id = ${Number(treatmentPlanId)}
        ORDER BY tt.created_at DESC
      ` as Record<string, any>[]
    } else if (controlId) {
      result = await tenantDb`
        SELECT tt.*, tp.plan_id as treatment_plan_id_display, tc.control_title,
               ir.risk_id as iso_risk_id, ir.title as risk_title,
               CASE 
                 WHEN tt.due_date < CURRENT_DATE AND tt.resolution_date IS NULL 
                 THEN (CURRENT_DATE - tt.due_date)::INTEGER
                 ELSE 0
               END as aging_days
        FROM iso27001_treatment_tracking tt
        LEFT JOIN iso27001_treatment_plans tp ON tt.treatment_plan_id = tp.id
        LEFT JOIN iso27001_treatment_controls tc ON tt.control_id = tc.id
        LEFT JOIN iso27001_risks ir ON tp.iso27001_risk_id = ir.id
        WHERE tt.control_id = ${Number(controlId)}
        ORDER BY tt.created_at DESC
      ` as Record<string, any>[]
    } else {
      result = await tenantDb`
        SELECT tt.*, tp.plan_id as treatment_plan_id_display, tc.control_title,
               ir.risk_id as iso_risk_id, ir.title as risk_title,
               CASE 
                 WHEN tt.due_date < CURRENT_DATE AND tt.resolution_date IS NULL 
                 THEN (CURRENT_DATE - tt.due_date)::INTEGER
                 ELSE 0
               END as aging_days
        FROM iso27001_treatment_tracking tt
        LEFT JOIN iso27001_treatment_plans tp ON tt.treatment_plan_id = tp.id
        LEFT JOIN iso27001_treatment_controls tc ON tt.control_id = tc.id
        LEFT JOIN iso27001_risks ir ON tp.iso27001_risk_id = ir.id
        ORDER BY tt.created_at DESC
        LIMIT 100
      ` as Record<string, any>[]
    }

    const serializedData = (Array.isArray(result) ? result : []).map((row) => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      tracking_date: row.tracking_date ? new Date(row.tracking_date).toISOString() : null,
      due_date: row.due_date ? new Date(row.due_date).toISOString() : null,
      resolution_date: row.resolution_date ? new Date(row.resolution_date).toISOString() : null,
      aging_days: Number(row.aging_days) || 0,
    }))

    return NextResponse.json(serializedData)
  } catch (error: any) {
    console.error("Error fetching treatment tracking:", error)
    return NextResponse.json({ error: "Failed to fetch treatment tracking", details: error.message }, { status: 500 })
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
      description,
      impact_assessment,
      action_required,
      responsible_party,
      due_date,
      created_by,
    } = body

    // Basic validation
    if (!treatment_plan_id || !tracking_type || !created_by) {
      return NextResponse.json(
        { error: "Missing required fields: treatment_plan_id, tracking_type, created_by" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO iso27001_treatment_tracking (
        treatment_plan_id, control_id, tracking_type, old_status, new_status,
        tracking_date, description, impact_assessment, action_required,
        responsible_party, due_date, created_by
      ) VALUES (
        ${Number(treatment_plan_id)}, ${control_id ? Number(control_id) : null}, ${tracking_type},
        ${old_status || null}, ${new_status || null}, CURRENT_TIMESTAMP, ${description || null},
        ${impact_assessment || null}, ${action_required || null}, ${responsible_party || null},
        ${due_date || null}, ${created_by}
      )
      RETURNING *
    ` as Record<string, any>[]

    const serializedResult = {
      ...result[0],
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      tracking_date: result[0].tracking_date ? new Date(result[0].tracking_date).toISOString() : null,
      due_date: result[0].due_date ? new Date(result[0].due_date).toISOString() : null,
      aging_days: 0,
    }

    return NextResponse.json(serializedResult, { status: 201 })
  } catch (error: any) {
    console.error("Error creating tracking entry:", error)
    return NextResponse.json({ error: "Failed to create tracking entry", details: error.message }, { status: 500 })
  }
});
