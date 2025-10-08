import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"
import { te } from "date-fns/locale";


export const GET = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

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

export const POST = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const {
      assessment_id,
      requirement_id,
      compliance_status,
      implementation_status,
      evidence_provided,
      gaps_identified,
      remediation_required,
      risk_rating,
      comments,
      assessor_notes,
      responsible_party,
      next_review_date,
      updated_by,
    } = body

    // Check if result already exists
    const existingResult = await tenantDb`
      SELECT id FROM hipaa_assessment_results 
      WHERE assessment_id = ${assessment_id} AND requirement_id = ${requirement_id}
    ` as Record<string, any>[]

    let result: unknown;
    if (existingResult.length > 0) {
      // Update existing result
      // Update existing result
      result = await tenantDb`
        UPDATE hipaa_assessment_results 
        SET 
          compliance_status = ${compliance_status},
          implementation_status = ${implementation_status},
          evidence_provided = ${evidence_provided},
          gaps_identified = ${gaps_identified},
          remediation_required = ${remediation_required},
          risk_rating = ${risk_rating},
          comments = ${comments},
          assessor_notes = ${assessor_notes},
          responsible_party = ${responsible_party},
          next_review_date = ${next_review_date ? new Date(next_review_date) : null},
          updated_at = NOW(),
          updated_by = ${updated_by}
        WHERE assessment_id = ${assessment_id} AND requirement_id = ${requirement_id}
        RETURNING *
      `
    } else {
      // Create new result
      result = await tenantDb`
        INSERT INTO hipaa_assessment_results (
          assessment_id,
          requirement_id,
          compliance_status,
          implementation_status,
          evidence_provided,
          gaps_identified,
          remediation_required,
          risk_rating,
          comments,
          assessor_notes,
          responsible_party,
          next_review_date,
          created_by,
          updated_by
        ) VALUES (
          ${assessment_id},
          ${requirement_id},
          ${compliance_status},
          ${implementation_status},
          ${evidence_provided},
          ${gaps_identified},
          ${remediation_required},
          ${risk_rating},
          ${comments},
          ${assessor_notes},
          ${responsible_party},
          ${next_review_date ? new Date(next_review_date) : null},
          ${updated_by},
          ${updated_by}
        )
        RETURNING *
      `
    }
    if (Array.isArray(result) && result.length > 0) {
      return NextResponse.json(result[0]);
    }

    return NextResponse.json(
      { error: "No rows returned from database operation" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error saving HIPAA assessment result:", error)
    return NextResponse.json(
      {
        error: "Failed to save HIPAA assessment result",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
