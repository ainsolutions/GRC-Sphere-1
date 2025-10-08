import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const technologyRiskId = params.id

    // Fetch control assessments with their items
    const assessments = await tenantDb`
      SELECT 
        tca.*,
        json_agg(
          json_build_object(
            'id', tcai.id,
            'control_id', tcai.control_id,
            'control_name', tcai.control_name,
            'control_description', tcai.control_description,
            'control_type', tcai.control_type,
            'control_category', tcai.control_category,
            'implementation_status', tcai.implementation_status,
            'effectiveness_rating', tcai.effectiveness_rating,
            'testing_status', tcai.testing_status,
            'testing_frequency', tcai.testing_frequency,
            'last_test_date', tcai.last_test_date,
            'next_test_date', tcai.next_test_date,
            'test_results', tcai.test_results,
            'evidence_location', tcai.evidence_location,
            'gaps_identified', tcai.gaps_identified,
            'recommendations', tcai.recommendations,
            'responsible_party', tcai.responsible_party,
            'implementation_date', tcai.implementation_date,
            'target_completion_date', tcai.target_completion_date,
            'compliance_frameworks', tcai.compliance_frameworks
          ) ORDER BY tcai.control_id
        ) as items
      FROM technology_control_assessments tca
      LEFT JOIN technology_control_assessment_items tcai ON tca.id = tcai.assessment_id
      WHERE tca.technology_risk_id = ${technologyRiskId}
      GROUP BY tca.id
      ORDER BY tca.assessment_date DESC
    `

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching control assessments:", error)
    return NextResponse.json({ error: "Failed to fetch control assessments" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const technologyRiskId = params.id
    const body = await request.json()

    const {
      assessment_name,
      assessment_date,
      assessor_name,
      assessor_email,
      status = "draft",
      notes,
      created_by,
    } = body

    // Generate assessment ID
    const assessmentId = `TCA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const result = await tenantDb`
      INSERT INTO technology_control_assessments (
        assessment_id, technology_risk_id, assessment_name, assessment_date,
        assessor_name, assessor_email, status, notes, created_by
      ) VALUES (
        ${assessmentId}, ${technologyRiskId}, ${assessment_name}, ${assessment_date},
        ${assessor_name}, ${assessor_email}, ${status}, ${notes}, ${created_by}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating control assessment:", error)
    return NextResponse.json({ error: "Failed to create control assessment" }, { status: 500 })
  }
});
