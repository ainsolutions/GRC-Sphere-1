import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const controls = await tenantDb`
      SELECT *
      FROM fair_risk_treatment_controls
      WHERE treatment_plan_id = ${id}
      ORDER BY created_at DESC
    `

    return NextResponse.json(controls)
  } catch (error) {
    console.error("Error fetching treatment controls:", error)
    return NextResponse.json({ error: "Failed to fetch treatment controls" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()

    const result = await tenantDb`
      INSERT INTO fair_risk_treatment_controls (
        treatment_plan_id, control_id, control_title, control_description,
        control_type, control_category, assigned_to, start_date, due_date,
        implementation_notes
      ) VALUES (
        ${id}, ${body.control_id}, ${body.control_title}, ${body.control_description},
        ${body.control_type}, ${body.control_category}, ${body.assigned_to}, 
        ${body.start_date}, ${body.due_date}, ${body.implementation_notes}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating treatment control:", error)
    return NextResponse.json({ error: "Failed to create treatment control" }, { status: 500 })
  }
});
