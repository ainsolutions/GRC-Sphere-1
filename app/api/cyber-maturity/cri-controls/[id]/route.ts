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
        { success: false, error: "Invalid CRI control ID" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      SELECT * FROM cri_controls WHERE id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "CRI control not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    })
  } catch (error: any) {
    console.error("Error fetching CRI control:", error)
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
        { success: false, error: "Invalid CRI control ID" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const result = await tenantDb`
      UPDATE cri_controls
      SET control_id = ${body.control_id},
          control_name = ${body.control_name},
          domain = ${body.domain},
          control_objective = ${body.control_objective},
          maturity_level_1 = ${body.maturity_level_1},
          maturity_level_2 = ${body.maturity_level_2},
          maturity_level_3 = ${body.maturity_level_3},
          maturity_level_4 = ${body.maturity_level_4},
          maturity_level_5 = ${body.maturity_level_5},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "CRI control not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "CRI control updated successfully"
    })
  } catch (error: any) {
    console.error("Error updating CRI control:", error)
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
        { success: false, error: "Invalid CRI control ID" },
        { status: 400 }
      )
    }

    await tenantDb`
      DELETE FROM cri_controls WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "CRI control deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting CRI control:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
