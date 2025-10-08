import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const assessmentId = params.id

    const results = await tenantDb`
      SELECT 
        har.*,
        hr.title as requirement_title,
        hr.category as section,
        hr.requirement_id as subsection
      FROM hipaa_assessment_results har
      JOIN hipaa_requirements hr ON har.requirement_id = hr.id
      WHERE har.assessment_id = ${assessmentId}
      ORDER BY hr.category, hr.requirement_id
    `

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching HIPAA assessment results:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch HIPAA assessment results",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
