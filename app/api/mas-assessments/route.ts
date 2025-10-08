import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }) => {
  try {
    const assessments = await tenantDb`
      SELECT * FROM mas_assessments 
      ORDER BY created_at DESC
    `
    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching MAS assessments:", error)
    return NextResponse.json({ error: "Failed to fetch MAS assessments" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const data = await request.json()

    const result = await tenantDb`
      INSERT INTO mas_assessments (
        assessment_id, entity_name, entity_type, license_type, assessment_type,
        assessment_date, assessor_name, status, overall_score, findings_count,
        high_risk_findings, medium_risk_findings, low_risk_findings,
        mas_notification_status
      ) VALUES (
        ${data.assessment_id}, ${data.entity_name}, ${data.entity_type}, 
        ${data.license_type}, ${data.assessment_type}, ${data.assessment_date},
        ${data.assessor_name}, ${data.status}, ${data.overall_score}, 
        ${data.findings_count}, ${data.high_risk_findings}, 
        ${data.medium_risk_findings}, ${data.low_risk_findings},
        ${data.mas_notification_status}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating MAS assessment:", error)
    return NextResponse.json({ error: "Failed to create MAS assessment" }, { status: 500 })
  }
});
