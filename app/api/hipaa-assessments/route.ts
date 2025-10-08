import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext( async ({ tenantDb }, request) => {
  try {
    const rows = await tenantDb `
      SELECT 
        id,
        assessment_name,
        entity_type,
        phi_types,
        assessment_type,
        status,
        risk_level,
        completion_percentage,
        created_at,
        target_date,
        assessor
      FROM hipaa_assessments 
      ORDER BY created_at DESC
    ` as Record<string, any>[]

    // Normalize to match frontend expectation
    const assessments = rows.map((row: any) => ({
      id: row.id,
      assessment_id: `HIPAA-${row.id}`, // or use your own ID pattern
      title: row.assessment_name,
      description: row.description,
      assessor: row.assessor,
      organization: row.organization,
      status: row.status,
      start_date: row.start_date,
      end_date: row.end_date,
      compliance_percentage: row.completion_percentage ?? 0,
      created_at: row.created_at,
      updated_at: row.created_at,
    }))

    return NextResponse.json({ assessments })
  } catch (error) {
    console.error("Failed to fetch HIPAA assessments:", error)
    return NextResponse.json({ error: "Failed to fetch HIPAA assessments" }, { status: 500 })
  }
});

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { title, description, assessor, organization, start_date, end_date } = body

    const result = await tenantDb`
      INSERT INTO hipaa_assessments (
        assessment_name,
        description,
        assessor,
        organization,
        start_date,
        end_date,
        status,
        completion_percentage
      )
      VALUES (
        ${title},
        ${description},
        ${assessor},
        ${organization},
        ${start_date},
        ${end_date || null},
        'Not Started',
        0
      )
      RETURNING *
    ` as Record<string, any>[]

    const row = result[0]

    // Normalize return
    const assessment = {
      id: row.id,
      assessment_id: `HIPAA-${row.id}`,
      title: row.assessment_name,
      description: row.description,
      assessor: row.assessor,
      organization: row.organization,
      status: row.status,
      start_date: row.start_date,
      end_date: row.end_date,
      compliance_percentage: row.completion_percentage ?? 0,
      created_at: row.created_at,
      updated_at: row.created_at,
    }

    return NextResponse.json({ assessment }, { status: 201 })
  } catch (error) {
    console.error("Failed to create HIPAA assessment:", error)
    return NextResponse.json({ error: "Failed to create HIPAA assessment" }, { status: 500 })
  }
})