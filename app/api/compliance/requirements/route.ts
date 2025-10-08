import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { withContext } from "@/lib/HttpContext";

const sql = getDatabase()

export const GET = withContext( async ({ tenantDb}, request: Request) => {
  try {
    const requirements = await tenantDb`
      SELECT 
        id,
        category,
        requirement_id,
        title,
        description,
        priority,
        status
      FROM hipaa_requirements 
      ORDER BY category, requirement_id
    `

    return NextResponse.json(requirements)
  } catch (error) {
    console.error("Failed to fetch compliance requirements:", error)
    return NextResponse.json({ error: "Failed to fetch compliance requirements" }, { status: 500 })
  }
})
