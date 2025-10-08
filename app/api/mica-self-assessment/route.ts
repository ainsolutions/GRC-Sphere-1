import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        msa.*,
        COUNT(msac.id) as total_controls,
        AVG(msac.maturity_level) as avg_maturity_level,
        COUNT(CASE WHEN msac.implementation_status = 'implemented' THEN 1 END) as implemented_count,
        COUNT(CASE WHEN msac.implementation_status = 'partially_implemented' THEN 1 END) as partially_implemented_count,
        COUNT(CASE WHEN msac.implementation_status = 'not_implemented' THEN 1 END) as not_implemented_count
      FROM mica_self_assessments msa
      LEFT JOIN mica_self_assessment_controls msac ON msa.id = msac.assessment_id
      GROUP BY msa.id
      ORDER BY msa.created_at DESC
    `

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching MICA self-assessments:", error)
    return NextResponse.json({ error: "Failed to fetch MICA self-assessments" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { assessment_name, description, assessment_period, business_unit, assessor_name, assessor_role } = body

    const result = await tenantDb`
      INSERT INTO mica_self_assessments (
        assessment_name,
        description,
        assessment_period,
        business_unit,
        assessor_name,
        assessor_role,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${assessment_name},
        ${description},
        ${assessment_period},
        ${business_unit},
        ${assessor_name},
        ${assessor_role},
        'draft',
        NOW(),
        NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating MICA self-assessment:", error)
    return NextResponse.json({ error: "Failed to create MICA self-assessment" }, { status: 500 })
  }
});
