import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const requirements = await tenantDb`
      SELECT *
      FROM sbp_etrmf_requirements
      ORDER BY domain, control_id
    `

    return NextResponse.json(requirements)
  } catch (error) {
    console.error("Error fetching SBP ETRMF requirements:", error)
    return NextResponse.json({ error: "Failed to fetch SBP ETRMF requirements" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { domain, control_id, control_name, description, control_type, maturity_level, implementation_guidance } =
      body

    if (!domain || !control_id || !control_name || !description) {
      return NextResponse.json(
        { error: "Domain, control ID, control name, and description are required" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO sbp_etrmf_requirements (
        domain,
        control_id,
        control_name,
        description,
        control_type,
        maturity_level,
        implementation_guidance
      ) VALUES (
        ${domain},
        ${control_id},
        ${control_name},
        ${description},
        ${control_type || "Mandatory"},
        ${maturity_level || "Basic"},
        ${implementation_guidance || ""}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating SBP ETRMF requirement:", error)
    return NextResponse.json({ error: "Failed to create SBP ETRMF requirement" }, { status: 500 })
  }
});


