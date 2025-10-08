import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb} ) => {
  try {
    const result = await tenantDb`
      SELECT 
        id,
        requirement_id,
        title,
        description,
        category,
        subcategory,
        control_type,
        implementation_guidance,
        evidence_requirements,
        maturity_levels,
        risk_level,
        compliance_status,
        last_assessment_date,
        next_assessment_date,
        created_at,
        updated_at
      FROM mica_requirements 
      ORDER BY requirement_id
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching MICA requirements:", error)
    return NextResponse.json({ error: "Failed to fetch MICA requirements" }, { status: 500 })
  }
});
