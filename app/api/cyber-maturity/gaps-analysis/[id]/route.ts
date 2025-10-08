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
        { success: false, error: "Invalid gap analysis ID" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      SELECT ga.*, c.control_id, c.control_name, c.domain, cma.assessment_name
      FROM gaps_analysis ga
      JOIN cri_controls c ON ga.control_id = c.id
      JOIN cyber_maturity_assessments cma ON ga.assessment_id = cma.id
      WHERE ga.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Gap analysis not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    })
  } catch (error: any) {
    console.error("Error fetching gap analysis:", error)
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
        { success: false, error: "Invalid gap analysis ID" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const result = await tenantDb`
      UPDATE gaps_analysis
      SET gap_description = ${body.gap_description},
          severity = ${body.severity},
          priority = ${body.priority},
          estimated_effort = ${body.estimated_effort},
          recommended_actions = ${body.recommended_actions},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Gap analysis not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Gap analysis updated successfully"
    })
  } catch (error: any) {
    console.error("Error updating gap analysis:", error)
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
        { success: false, error: "Invalid gap analysis ID" },
        { status: 400 }
      )
    }

    await tenantDb`
      DELETE FROM gaps_analysis WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Gap analysis deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting gap analysis:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
