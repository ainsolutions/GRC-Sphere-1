import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }) => {
  try {
    const requirements = await tenantDb`
      SELECT * FROM mas_requirements 
      ORDER BY domain, requirement_id
    `
    return NextResponse.json(requirements)
  } catch (error) {
    console.error("Error fetching MAS requirements:", error)
    return NextResponse.json({ error: "Failed to fetch MAS requirements" }, { status: 500 })
  }
});
