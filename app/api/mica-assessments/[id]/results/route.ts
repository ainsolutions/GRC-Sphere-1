import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const assessmentId = Number.parseInt(params.id)

    const results = await tenantDb`
      SELECT 
        mar.*,
        mr.mica_requirement_id as req_id,
        mr.mica_title,
        mr.mica_description,
        mr.mica_category,
        mr.mica_subcategory,
        mr.mica_control_type,
        mr.mica_priority
      FROM mica_assessment_results mar
      JOIN mica_requirements mr ON mar.mica_requirement_id = mr.id
      WHERE mar.mica_assessment_id = ${assessmentId}
      ORDER BY mr.mica_requirement_id
    `

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("Error fetching MICA assessment results:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch MICA assessment results" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const assessmentId = Number.parseInt(params.id)
    const body = await request.json()
    const {
      requirement_id,
      compliance_status,
      implementation_score,
      evidence_provided,
      gaps_identified,
      remediation_plan,
      target_completion_date,
      responsible_party,
      comments,
      assessor_notes,
    } = body

    const result = await tenantDb`
      INSERT INTO mica_assessment_results (
        mica_assessment_id, mica_requirement_id, mica_compliance_status, mica_implementation_score,
        mica_evidence_provided, mica_gaps_identified, mica_remediation_plan, mica_target_completion_date,
        mica_responsible_party, mica_comments, mica_assessor_notes
      ) VALUES (
        ${assessmentId}, ${requirement_id}, ${compliance_status}, ${implementation_score},
        ${evidence_provided}, ${gaps_identified}, ${remediation_plan}, ${target_completion_date},
        ${responsible_party}, ${comments}, ${assessor_notes}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error creating MICA assessment result:", error)
    return NextResponse.json({ success: false, error: "Failed to create MICA assessment result" }, { status: 500 })
  }
});
