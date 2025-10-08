import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }) => {
  try {
    const gapAnalyses = await tenantDb`
      SELECT * FROM mas_gap_analysis 
      ORDER BY priority_score DESC, created_at DESC
    `
    return NextResponse.json(gapAnalyses)
  } catch (error) {
    console.error("Error fetching MAS gap analyses:", error)
    return NextResponse.json({ error: "Failed to fetch MAS gap analyses" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const data = await request.json()

    const result = await tenantDb`
      INSERT INTO mas_gap_analysis (
        domain, requirement_id, requirement_title, current_state, target_state,
        gap_description, business_impact, priority_score, implementation_effort,
        estimated_cost, estimated_timeline, responsible_party, mitigation_strategy,
        risk_if_not_addressed, status
      ) VALUES (
        ${data.domain}, ${data.requirement_id}, ${data.requirement_title},
        ${data.current_state}, ${data.target_state}, ${data.gap_description},
        ${data.business_impact}, ${data.priority_score}, ${data.implementation_effort},
        ${data.estimated_cost}, ${data.estimated_timeline}, ${data.responsible_party},
        ${data.mitigation_strategy}, ${data.risk_if_not_addressed}, ${data.status}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating MAS gap analysis:", error)
    return NextResponse.json({ error: "Failed to create MAS gap analysis" }, { status: 500 })
  }
});
