import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const result = await tenantDb`
      SELECT 
        id,
        assessment_id,
        assessment_name,
        description,
        assessment_type,
        scope,
        assessor_name,
        assessor_email,
        start_date,
        target_completion_date,
        status,
        created_at,
        updated_at
      FROM mica_assessments 
      ORDER BY created_at DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching MICA assessments:", error)
    return NextResponse.json({ error: "Failed to fetch MICA assessments" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      assessment_id,
      assessment_name,
      description,
      assessment_type = "self_assessment",
      scope = "",
      assessor_name = "",
      assessor_email = "",
      start_date,
      target_completion_date,
      status = "draft",
    } = body

    // Validate required fields
    if (!assessment_id || !assessment_name) {
      return NextResponse.json({ error: "Assessment ID and name are required" }, { status: 400 })
    }

    // Check if assessment_id already exists
    const existingAssessment = await tenantDb`
      SELECT id FROM mica_assessments WHERE assessment_id = ${assessment_id}
    ` as Record <string, any>[]

    if (existingAssessment.length > 0) {
      return NextResponse.json({ error: "Assessment ID already exists" }, { status: 409 })
    }

    const result = await tenantDb`
      INSERT INTO mica_assessments (
        assessment_id,
        assessment_name,
        description,
        assessment_type,
        scope,
        assessor_name,
        assessor_email,
        start_date,
        target_completion_date,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${assessment_id},
        ${assessment_name},
        ${description || ""},
        ${assessment_type},
        ${scope},
        ${assessor_name},
        ${assessor_email},
        ${start_date || null},
        ${target_completion_date || null},
        ${status},
        NOW(),
        NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating MICA assessment:", error)
    return NextResponse.json({ error: "Failed to create MICA assessment" }, { status: 500 })
  }
});
