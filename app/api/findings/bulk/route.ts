import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const POST = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const findingsData = body.findings || body

    if (!Array.isArray(findingsData) || findingsData.length === 0) {
      return NextResponse.json({ error: "Findings data must be a non-empty array" }, { status: 400 })
    }

    // Validate that all findings have the same assessment_id
    const assessmentIds = [...new Set(findingsData.map((f) => f.assessment_id))]
    if (assessmentIds.length !== 1) {
      return NextResponse.json({ error: "All findings must belong to the same assessment" }, { status: 400 })
    }

    const assessmentId = assessmentIds[0]

    // Validate required fields for all findings
    const invalidFindings = findingsData.filter(
      (data) => !data.assessment_id || !data.finding_title || !data.finding_description || !data.severity,
    )

    if (invalidFindings.length > 0) {
      return NextResponse.json({ error: `${invalidFindings.length} finding(s) are missing required fields` }, { status: 400 })
    }

    // Check if assessment exists
    const assessment = await tenantDb`
      SELECT id, assessment_name
      FROM assessments 
      WHERE id = ${assessmentId}
    ` as Record<string, any>[]

    if (assessment.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    
    // Create all findings in a single transaction
    const results = []
    const currentYear = new Date().getFullYear()
    
    // Truncate assessment name to 20 characters and format it
    const assessmentName = assessment[0].assessment_name || "UNKNOWN"
    const truncatedName = assessmentName
      .substring(0, 20)
      .trim()
      .replace(/\s+/g, "-")
      .toUpperCase()
    
    // Get the current max ID for this assessment pattern
    const findingIdPattern = `FIND-${currentYear}-${truncatedName}-%`
    const findingIdResult = await tenantDb`
      SELECT finding_id
      FROM assessment_findings 
      WHERE finding_id LIKE ${findingIdPattern}
      ORDER BY finding_id DESC
      LIMIT 1
    ` as Record <string, any>[]
    let nextId = 0
    if (findingIdResult.length > 0) {
      const lastId = findingIdResult[0].finding_id
      const parts = lastId.split('-')
      const idNumber = parts[parts.length - 1]
      nextId = Number.parseInt(idNumber) || 0
    }
    for (const data of findingsData) {
      // Generate finding ID or use provided finding_reference
      let findingId = data.finding_reference
      if (!findingId) {
        nextId += 1
        findingId = `FIND-${currentYear}-${truncatedName}-${nextId.toString().padStart(6, "0")}`
      }

      const result = await tenantDb`
        INSERT INTO assessment_findings (
          finding_id, assessment_id, finding_title, finding_description, severity, 
          category, recommendation, status, user_id, assigned_to, due_date, created_at
        )
        VALUES (
          ${findingId},
          ${data.assessment_id}, 
          ${data.finding_title}, 
          ${data.finding_description}, 
          ${data.severity}, 
          ${data.category || null}, 
          ${data.recommendation || null}, 
          ${data.status || "Open"}, 
          ${data.user_id || null}, 
          ${data.assigned_to || null}, 
          ${data.due_date || null},
          CURRENT_TIMESTAMP
        )
        RETURNING *
      ` as Record <string, any>[]
      results.push(result[0])
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Successfully created ${results.length} findings`,
    })
  } catch (error) {
  console.error("Failed to create finding:", error);

  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { error: `Failed to create bulk finding: ${message}` },
    { status: 500 }
  );
  }
});
