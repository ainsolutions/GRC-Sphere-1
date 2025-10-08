import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getMaturityAssessments, createMaturityAssessment } from "@/lib/actions/cyber-maturity-actions"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessmentId")

    const result = await getMaturityAssessments(
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
      count: Array.isArray(result.data) ? result.data.length : 0
    })
  } catch (error: any) {
    console.error("Error fetching maturity assessments:", error)
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
    if (!body.assessment_id || !body.control_id || !body.current_maturity_level ||
        !body.target_maturity_level || !body.assessment_date) {
      return NextResponse.json(
        { success: false, error: "Assessment ID, control ID, maturity levels, and assessment date are required" },
        { status: 400 }
      )
    }

    const result = await createMaturityAssessment({
      assessment_id: body.assessment_id,
      control_id: body.control_id,
      current_maturity_level: body.current_maturity_level,
      target_maturity_level: body.target_maturity_level,
      assessment_date: body.assessment_date,
      assessor_comments: body.assessor_comments || "",
      evidence: body.evidence || ""
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
      message: "Maturity assessment created successfully"
    })
  } catch (error: any) {
    console.error("Error creating maturity assessment:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
