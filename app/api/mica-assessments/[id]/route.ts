import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid assessment ID format" }, { status: 400 })
    }

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
      WHERE id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching MICA assessment:", error)
    return NextResponse.json({ error: "Failed to fetch MICA assessment" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid assessment ID format" }, { status: 400 })
    }

    const {
      assessment_name,
      description,
      assessment_type,
      scope,
      assessor_name,
      assessor_email,
      start_date,
      target_completion_date,
      status,
    } = body

    // Validate required fields
    if (!assessment_name) {
      return NextResponse.json({ error: "Assessment name is required" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE mica_assessments 
      SET 
        assessment_name = ${assessment_name},
        description = ${description || ""},
        assessment_type = ${assessment_type || "self_assessment"},
        scope = ${scope || ""},
        assessor_name = ${assessor_name || ""},
        assessor_email = ${assessor_email || ""},
        start_date = ${start_date || null},
        target_completion_date = ${target_completion_date || null},
        status = ${status || "draft"},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating MICA assessment:", error)
    return NextResponse.json({ error: "Failed to update MICA assessment" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid assessment ID format" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM mica_assessments 
      WHERE id = ${id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Assessment deleted successfully" })
  } catch (error) {
    console.error("Error deleting MICA assessment:", error)
    return NextResponse.json({ error: "Failed to delete MICA assessment" }, { status: 500 })
  }
});
