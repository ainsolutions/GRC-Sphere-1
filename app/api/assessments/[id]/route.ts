import { withContext } from "@/lib/HttpContext"
import { type NextRequest, NextResponse } from "next/server"

export const GET = withContext( async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const assessment = (await tenantDb`
      SELECT * FROM assessments WHERE id = ${params.id} 
    `) as Record<string,any>[];

    if (assessment.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(assessment[0])
  } catch (error) {
    console.error("Error fetching assessment:", error)
    return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 })
  }
});

export const PUT = withContext( async ({ tenantDb },request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()

    const assessment = (await tenantDb`
      UPDATE assessments SET
        assessment_name = ${body.assessment_name},
        assessment_type = ${body.assessment_type},
        assessment_scope = ${body.assessment_scope},
        assessment_status = ${body.assessment_status},
        start_date = ${body.start_date},
        end_date = ${body.end_date},
        assigned_assessor = ${body.assigned_assessor},
        assessment_methodology = ${body.assessment_methodology},
        compliance_framework = ${body.compliance_framework},
        assessment_priority = ${body.assessment_priority},
        completion_percentage = ${body.completion_percentage},
        findings_count = ${body.findings_count || 0},
        high_risk_findings = ${body.high_risk_findings || 0},
        medium_risk_findings = ${body.medium_risk_findings || 0},
        low_risk_findings = ${body.low_risk_findings || 0},
        assets = ${JSON.stringify(body.assets || [])},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `) as Record<string,any>[];

    if (assessment.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(assessment[0])
  } catch (error) {
    console.error("Error updating assessment:", error)
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 })
  }
});

export const DELETE = withContext( async ({ tenantDb },request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      DELETE FROM assessments WHERE id = ${params.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting assessment:", error)
    return NextResponse.json({ error: "Failed to delete assessment" }, { status: 500 })
  }
});