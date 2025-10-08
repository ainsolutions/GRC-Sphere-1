import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")

    let query
    if (assessmentId) {
      query = tenantDb`
        SELECT * FROM mas_remediation_tracking 
        WHERE assessment_id = ${assessmentId}
        ORDER BY created_at DESC
      `
    } else {
      query = tenantDb`
        SELECT * FROM mas_remediation_tracking 
        ORDER BY created_at DESC
      `
    }

    const remediationItems = await query
    return NextResponse.json(remediationItems)
  } catch (error) {
    console.error("Error fetching MAS remediation items:", error)
    return NextResponse.json({ error: "Failed to fetch MAS remediation items" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const data = await request.json()

    const result = await tenantDb`
      INSERT INTO mas_remediation_tracking (
        assessment_id, finding_id, title, description, domain, risk_level,
        priority, status, assigned_to, due_date, estimated_cost,
        remediation_plan, verification_status
      ) VALUES (
        ${data.assessment_id}, ${data.finding_id}, ${data.title}, 
        ${data.description}, ${data.domain}, ${data.risk_level},
        ${data.priority}, ${data.status}, ${data.assigned_to}, 
        ${data.due_date}, ${data.estimated_cost}, ${data.remediation_plan},
        ${data.verification_status}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating MAS remediation item:", error)
    return NextResponse.json({ error: "Failed to create MAS remediation item" }, { status: 500 })
  }
});
