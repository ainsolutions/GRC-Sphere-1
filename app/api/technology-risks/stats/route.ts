import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const result = await tenantDb`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN (likelihood * impact) >= 15 THEN 1 END) as high,
        COUNT(CASE WHEN (likelihood * impact) >= 8 AND (likelihood * impact) < 15 THEN 1 END) as medium,
        COUNT(CASE WHEN (likelihood * impact) < 8 THEN 1 END) as low,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'mitigated' THEN 1 END) as mitigated,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed
      FROM technology_risks
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching technology risks stats:", error)
    return NextResponse.json({ error: "Failed to fetch technology risks stats" }, { status: 500 })
  }
});
