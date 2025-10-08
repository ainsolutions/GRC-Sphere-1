import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"
import { getDatabase } from "@/lib/database"


export const GET = withContext(async({ tenantDb }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const tracking = await tenantDb`
      SELECT *
      FROM fair_risk_treatment_tracking
      WHERE control_id = ${id}
      ORDER BY changed_at DESC
    `

    return NextResponse.json(tracking)
  } catch (error) {
    console.error("Error fetching tracking records:", error)
    return NextResponse.json({ error: "Failed to fetch tracking records" }, { status: 500 })
  }
});
