import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb },
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid remediation tracking ID" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      SELECT rt.*, ga.gap_description, ga.severity, c.control_id, c.control_name
      FROM remediation_tracking rt
      JOIN gaps_analysis ga ON rt.gap_id = ga.id
      JOIN cri_controls c ON ga.control_id = c.id
      WHERE rt.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Remediation tracking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    })
  } catch (error: any) {
    console.error("Error fetching remediation tracking:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});

export const PUT = withContext(async({ tenantDb },
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid remediation tracking ID" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const result = await tenantDb`
      UPDATE remediation_tracking
      SET remediation_plan = ${body.remediation_plan},
          assigned_to = ${body.assigned_to},
          due_date = ${body.due_date},
          status = ${body.status},
          actual_completion_date = ${body.actual_completion_date},
          notes = ${body.notes},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Remediation tracking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Remediation tracking updated successfully"
    })
  } catch (error: any) {
    console.error("Error updating remediation tracking:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});

export const DELETE = withContext(async({ tenantDb },
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid remediation tracking ID" },
        { status: 400 }
      )
    }

    await tenantDb`
      DELETE FROM remediation_tracking WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Remediation tracking deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting remediation tracking:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
