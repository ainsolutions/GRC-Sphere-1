import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }) => {
  try {
    const [rules] = await tenantDb`
      SELECT 
        require_evidence_for_mitigated,
        require_evidence_for_accepted,
        updated_by,
        updated_at::text
      FROM iso27001_validation_rules 
      ORDER BY updated_at DESC 
      LIMIT 1
    ` as Record<string, any>[]

    // Return default rules if none exist
    if (!rules) {
      return NextResponse.json({
        require_evidence_for_mitigated: true,
        require_evidence_for_accepted: true,
      })
    }

    return NextResponse.json(rules)
  } catch (error: any) {
    console.error("Error fetching validation rules:", error)
    return NextResponse.json({ error: "Failed to fetch validation rules", details: error.message }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { require_evidence_for_mitigated, require_evidence_for_accepted, updated_by, user_role } = body

    // Check if user has admin role
    if (user_role !== "admin") {
      return NextResponse.json({ error: "Insufficient permissions. Admin role required." }, { status: 403 })
    }

    // Delete existing rules and insert new ones (simple approach)
    await tenantDb`DELETE FROM iso27001_validation_rules`

    const result = await tenantDb`
      INSERT INTO iso27001_validation_rules (
        require_evidence_for_mitigated,
        require_evidence_for_accepted,
        updated_by
      ) VALUES (
        ${require_evidence_for_mitigated},
        ${require_evidence_for_accepted},
        ${updated_by}
      )
      RETURNING 
        require_evidence_for_mitigated,
        require_evidence_for_accepted,
        updated_by,
        updated_at::text
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating validation rules:", error)
    return NextResponse.json({ error: "Failed to update validation rules", details: error.message }, { status: 500 })
  }
});
