import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const selfAssessmentId = searchParams.get("self_assessment_id")

    if (!selfAssessmentId) {
      return NextResponse.json({ success: false, error: "Self assessment ID is required" }, { status: 400 })
    }

    const controls = await tenantDb`
      SELECT 
        msac.*,
        mr.mica_requirement_id,
        mr.mica_title,
        mr.mica_description,
        mr.mica_category,
        mr.mica_subcategory,
        mr.mica_control_type,
        mr.mica_priority
      FROM mica_self_assessment_controls msac
      JOIN mica_requirements mr ON msac.mica_requirement_id = mr.id
      WHERE msac.mica_self_assessment_id = ${Number.parseInt(selfAssessmentId)}
      ORDER BY mr.mica_requirement_id
    `

    return NextResponse.json({
      success: true,
      data: controls,
    })
  } catch (error) {
    console.error("Error fetching MICA self-assessment controls:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch MICA self-assessment controls" },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      self_assessment_id,
      requirement_id,
      maturity_level,
      implementation_status,
      evidence_description,
      control_effectiveness,
      improvement_opportunities,
      action_plan,
      responsible_owner,
      target_completion_date,
      comments,
    } = body

    const result = await tenantDb`
      INSERT INTO mica_self_assessment_controls (
        mica_self_assessment_id, mica_requirement_id, mica_maturity_level, mica_implementation_status,
        mica_evidence_description, mica_control_effectiveness, mica_improvement_opportunities,
        mica_action_plan, mica_responsible_owner, mica_target_completion_date, mica_comments
      ) VALUES (
        ${self_assessment_id}, ${requirement_id}, ${maturity_level}, ${implementation_status},
        ${evidence_description}, ${control_effectiveness}, ${improvement_opportunities},
        ${action_plan}, ${responsible_owner}, ${target_completion_date}, ${comments}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error creating MICA self-assessment control:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create MICA self-assessment control" },
      { status: 500 },
    )
  }
});
