import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getCRIControls, createCRIControl } from "@/lib/actions/cyber-maturity-actions"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const result = await getCRIControls()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length
    })
  } catch (error: any) {
    console.error("Error fetching CRI controls:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.control_id || !body.control_name || !body.domain || !body.control_objective) {
      return NextResponse.json(
        { success: false, error: "Control ID, name, domain, and objective are required" },
        { status: 400 }
      )
    }

    const result = await createCRIControl({
      control_id: body.control_id,
      control_name: body.control_name,
      domain: body.domain,
      control_objective: body.control_objective,
      maturity_level_1: body.maturity_level_1 || "",
      maturity_level_2: body.maturity_level_2 || "",
      maturity_level_3: body.maturity_level_3 || "",
      maturity_level_4: body.maturity_level_4 || "",
      maturity_level_5: body.maturity_level_5 || ""
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "CRI control created successfully"
    })
  } catch (error: any) {
    console.error("Error creating CRI control:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
