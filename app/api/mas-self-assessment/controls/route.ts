import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }) => {
  try {
    const controls = await tenantDb`
      SELECT * FROM mas_self_assessment_controls 
      ORDER BY domain, control_id
    `
    return NextResponse.json(controls)
  } catch (error) {
    console.error("Error fetching MAS self-assessment controls:", error)
    return NextResponse.json({ error: "Failed to fetch MAS self-assessment controls" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const data = await request.json()

    const result = await tenantDb`
      UPDATE mas_self_assessment_controls 
      SET 
        implementation_status = COALESCE(${data.implementation_status}, implementation_status),
        maturity_level = COALESCE(${data.maturity_level}, maturity_level),
        evidence = COALESCE(${data.evidence}, evidence),
        gaps_identified = COALESCE(${data.gaps_identified}, gaps_identified),
        remediation_plan = COALESCE(${data.remediation_plan}, remediation_plan),
        responsible_party = COALESCE(${data.responsible_party}, responsible_party),
        target_completion_date = COALESCE(${data.target_completion_date}, target_completion_date),
        last_reviewed = COALESCE(${data.last_reviewed}, last_reviewed),
        reviewer_comments = COALESCE(${data.reviewer_comments}, reviewer_comments),
        updated_at = CURRENT_TIMESTAMP
      WHERE control_id = ${data.control_id}
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating MAS self-assessment control:", error)
    return NextResponse.json({ error: "Failed to update MAS self-assessment control" }, { status: 500 })
  }
});
