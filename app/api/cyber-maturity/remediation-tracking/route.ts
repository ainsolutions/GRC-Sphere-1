import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getRemediationTracking, createRemediationTracking } from "@/lib/actions/cyber-maturity-actions"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const gapId = searchParams.get("gapId")

    const result = await getRemediationTracking(
      gapId ? parseInt(gapId) : undefined
    )

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
    console.error("Error fetching remediation tracking:", error)
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
    if (!body.gap_id || !body.remediation_plan || !body.assigned_to || !body.due_date) {
      return NextResponse.json(
        { success: false, error: "Gap ID, remediation plan, assigned to, and due date are required" },
        { status: 400 }
      )
    }

    const result = await createRemediationTracking({
      gap_id: body.gap_id,
      remediation_plan: body.remediation_plan,
      assigned_to: body.assigned_to,
      due_date: body.due_date,
      status: body.status || "not_started",
      notes: body.notes || ""
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
      message: "Remediation tracking created successfully"
    })
  } catch (error: any) {
    console.error("Error creating remediation tracking:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
