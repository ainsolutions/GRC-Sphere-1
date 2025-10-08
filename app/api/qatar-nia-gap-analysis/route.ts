import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const gapAnalysis = await tenantDb`
      SELECT *
      FROM qatar_nia_gap_analysis
      ORDER BY priority_score DESC, domain, control_id
    ` as Record<string, any>[]

    return NextResponse.json(gapAnalysis)
  } catch (error) {
    console.error("Error fetching Qatar NIA gap analysis:", error)
    return NextResponse.json({ error: "Failed to fetch Qatar NIA gap analysis" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      domain,
      control_id,
      control_name,
      current_status,
      target_status,
      gap_severity,
      business_impact,
      implementation_effort,
      estimated_cost,
      timeline_months,
      responsible_party,
      dependencies,
      risk_if_not_addressed,
      priority_score,
    } = body

    if (!domain || !control_id || !control_name) {
      return NextResponse.json({ error: "Domain, control ID, and control name are required" }, { status: 400 })
    }

    const result = await tenantDb`
      INSERT INTO qatar_nia_gap_analysis (
        domain,
        control_id,
        control_name,
        current_status,
        target_status,
        gap_severity,
        business_impact,
        implementation_effort,
        estimated_cost,
        timeline_months,
        responsible_party,
        dependencies,
        risk_if_not_addressed,
        priority_score
      ) VALUES (
        ${domain},
        ${control_id},
        ${control_name},
        ${current_status || "Not Implemented"},
        ${target_status || "Implemented"},
        ${gap_severity || "Medium"},
        ${business_impact || "Medium"},
        ${implementation_effort || "Medium"},
        ${estimated_cost || 0},
        ${timeline_months || 6},
        ${responsible_party || ""},
        ${dependencies || ""},
        ${risk_if_not_addressed || ""},
        ${priority_score || 5}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating Qatar NIA gap analysis:", error)
    return NextResponse.json({ error: "Failed to create Qatar NIA gap analysis" }, { status: 500 })
  }
});
