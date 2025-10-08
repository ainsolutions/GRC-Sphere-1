import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const PUT = withContext(async({ tenantDb, userId }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()

    // Get current values for tracking
    const current = await tenantDb`
      SELECT * FROM fair_risk_treatment_controls WHERE id = ${id}
    ` as Record<string, any>[]

    if (current.length === 0) {
      return NextResponse.json({ error: "Control not found" }, { status: 404 })
    }

    // Update the control
    const result = await tenantDb`
      UPDATE fair_risk_treatment_controls 
      SET 
        implementation_status = ${body.implementation_status || current[0].implementation_status},
        progress_percentage = ${body.progress_percentage || current[0].progress_percentage},
        completion_date = ${body.completion_date || current[0].completion_date},
        testing_status = ${body.testing_status || current[0].testing_status},
        testing_date = ${body.testing_date || current[0].testing_date},
        testing_notes = ${body.testing_notes || current[0].testing_notes},
        effectiveness_rating = ${body.effectiveness_rating || current[0].effectiveness_rating},
        implementation_notes = ${body.implementation_notes || current[0].implementation_notes},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    // Create tracking record if status changed
    if (body.implementation_status && body.implementation_status !== current[0].implementation_status) {
      await tenantDb`
        INSERT INTO fair_risk_treatment_tracking (
          treatment_plan_id, control_id, field_changed, old_value, new_value,
          changed_by, change_reason
        ) VALUES (
          ${current[0].treatment_plan_id}, ${id}, 'implementation_status',
          ${current[0].implementation_status}, ${body.implementation_status},
          ${body.changed_by || "System"}, ${body.change_reason || "Status updated via UI"}
        )
      `
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating treatment control:", error)
    return NextResponse.json({ error: "Failed to update treatment control" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    await tenantDb`
      DELETE FROM fair_risk_treatment_controls WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting treatment control:", error)
    return NextResponse.json({ error: "Failed to delete treatment control" }, { status: 500 })
  }
});
