import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getGapsAnalysis, createGapAnalysis } from "@/lib/actions/cyber-maturity-actions"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessmentId")

    const result = await getGapsAnalysis(
      assessmentId ? parseInt(assessmentId) : undefined
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
    console.error("Error fetching gaps analysis:", error)
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
    if (!body.assessment_id || !body.control_id || !body.gap_description ||
        !body.severity || !body.priority) {
      return NextResponse.json(
        { success: false, error: "Assessment ID, control ID, gap description, severity, and priority are required" },
        { status: 400 }
      )
    }

    const result = await createGapAnalysis({
      assessment_id: body.assessment_id,
      control_id: body.control_id,
      gap_description: body.gap_description,
      severity: body.severity,
      priority: body.priority,
      estimated_effort: body.estimated_effort || "",
      recommended_actions: body.recommended_actions || ""
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
      message: "Gap analysis created successfully"
    })
  } catch (error: any) {
    console.error("Error creating gap analysis:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
