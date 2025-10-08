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
        { success: false, error: "Invalid maturity assessment ID" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      SELECT ma.*, c.control_id, c.control_name, c.domain, cma.assessment_name
      FROM maturity_assessments ma
      JOIN cri_controls c ON ma.control_id = c.id
      JOIN cyber_maturity_assessments cma ON ma.assessment_id = cma.id
      WHERE ma.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Maturity assessment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    })
  } catch (error: any) {
    console.error("Error fetching maturity assessment:", error)
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
        { success: false, error: "Invalid maturity assessment ID" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const result = await tenantDb`
      UPDATE maturity_assessments
      SET current_maturity_level = ${body.current_maturity_level},
          target_maturity_level = ${body.target_maturity_level},
          assessment_date = ${body.assessment_date},
          assessor_comments = ${body.assessor_comments},
          evidence = ${body.evidence},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Maturity assessment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Maturity assessment updated successfully"
    })
  } catch (error: any) {
    console.error("Error updating maturity assessment:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

export const DELETE = withContext(async({ tenantDb },
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid maturity assessment ID" },
        { status: 400 }
      )
    }

    await tenantDb`
      DELETE FROM maturity_assessments WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Maturity assessment deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting maturity assessment:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
