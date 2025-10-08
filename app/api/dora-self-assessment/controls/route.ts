import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

const sql = getDatabase()

export const GET= withContext(async ({tenantDb}: HttpSessionContext, request) => {
  try {
    const controls = await tenantDb`
      SELECT *
      FROM dora_self_assessment_controls
      ORDER BY domain, control_id
    `

    return NextResponse.json(controls)
  } catch (error) {
    console.error("Error fetching DORA self-assessment controls:", error)
    return NextResponse.json({ error: "Failed to fetch DORA self-assessment controls" }, { status: 500 })
  }
});

export const PUT = withContext(async ({tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const {
      id,
      implementation_status,
      maturity_level,
      evidence,
      gaps_identified,
      remediation_plan,
      target_completion_date,
      responsible_party,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Control ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE dora_self_assessment_controls 
      SET 
        implementation_status = ${implementation_status},
        maturity_level = ${maturity_level},
        evidence = ${evidence},
        gaps_identified = ${gaps_identified},
        remediation_plan = ${remediation_plan},
        target_completion_date = ${target_completion_date},
        responsible_party = ${responsible_party},
        last_reviewed = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Control not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating DORA self-assessment control:", error)
    return NextResponse.json({ error: "Failed to update DORA self-assessment control" }, { status: 500 })
  }
});
