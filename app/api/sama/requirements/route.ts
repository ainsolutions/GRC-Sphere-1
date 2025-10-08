import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const requirements = await tenantDb`
      SELECT *
      FROM sama_requirements
      ORDER BY domain, control_id
    `

    return NextResponse.json(requirements)
  } catch (error) {
    console.error("Error fetching SAMA requirements:", error)
    return NextResponse.json({ error: "Failed to fetch SAMA requirements" }, { status: 500 })
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
      INSERT INTO sama_requirements (
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
    console.error("Error creating SAMA requirement:", error)
    return NextResponse.json({ error: "Failed to create SAMA requirement" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      id,
      domain,
      control_id,
      control_name,
      description,
      control_type,
      maturity_level,
      status,
      implementation_guidance,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Requirement ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE sama_requirements 
      SET 
        domain = ${domain},
        control_id = ${control_id},
        control_name = ${control_name},
        description = ${description},
        control_type = ${control_type},
        maturity_level = ${maturity_level},
        status = ${status},
        implementation_guidance = ${implementation_guidance},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Requirement not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating SAMA requirement:", error)
    return NextResponse.json({ error: "Failed to update SAMA requirement" }, { status: 500 })
  }
});
