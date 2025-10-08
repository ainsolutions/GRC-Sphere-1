import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}) => {
  try {
    const currentYear = new Date().getFullYear()

    // Get the count of assessments created this year
    const result = await tenantDb`
      SELECT COUNT(*) as count
      FROM mica_assessments 
      WHERE assessment_id LIKE ${"MICA-AS-" + currentYear + "-%"}
    ` as Record<string, any>[]

    const count = Number.parseInt(result[0].count) + 1
    const sequentialNumber = count.toString().padStart(2, "0")
    const assessmentId = `MICA-AS-${currentYear}-${sequentialNumber}`

    return NextResponse.json({ assessment_id: assessmentId })
  } catch (error) {
    console.error("Error generating assessment ID:", error)
    return NextResponse.json({ error: "Failed to generate assessment ID" }, { status: 500 })
  }
});
