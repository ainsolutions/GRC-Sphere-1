import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""

    const risks = await tenantDb`
      SELECT id, risk_id, title, description, status, risk_score
      FROM iso27001_risks
      WHERE title ILIKE ${"%" + q + "%"}
         OR risk_id ILIKE ${"%" + q + "%"}
      LIMIT 10
    `

    return NextResponse.json({ success: true, data: risks })
  } catch (error: any) {
    console.error("Error searching risks:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})
