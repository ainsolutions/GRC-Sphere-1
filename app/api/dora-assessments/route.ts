import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        da.*,
        o.name as organization_name
      FROM dora_assessments da
      LEFT JOIN organizations o ON da.organization_id = o.id
      ORDER BY da.created_at DESC
    `

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching DORA assessments:", error)
    return NextResponse.json({ error: "Failed to fetch DORA assessments" }, { status: 500 })
  }
});

export const POST = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const {
      assessment_name,
      organization_id,
      assessment_type,
      scope,
      entity_type,
      entity_size,
      member_state,
      assessment_methodology,
      assessor_name,
      assessor_organization,
    } = body

    if (!assessment_name || !entity_type || !member_state) {
      return NextResponse.json(
        { error: "Assessment name, entity type, and member state are required" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO dora_assessments (
        assessment_name,
        organization_id,
        assessment_type,
        scope,
        entity_type,
        entity_size,
        member_state,
        assessment_methodology,
        assessor_name,
        assessor_organization,
        status
      ) VALUES (
        ${assessment_name},
        ${organization_id || 1},
        ${assessment_type || "Initial"},
        ${scope || ""},
        ${entity_type},
        ${entity_size || ""},
        ${member_state},
        ${assessment_methodology || "Self-Assessment"},
        ${assessor_name || ""},
        ${assessor_organization || ""},
        'Draft'
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating DORA assessment:", error)
    return NextResponse.json({ error: "Failed to create DORA assessment" }, { status: 500 })
  }
});

export const PUT = withContext(async ({ tenantDb }: HttpSessionContext, request: Request) => {
  try {
    const body = await request.json()
    const {
      id,
      assessment_name,
      assessment_type,
      scope,
      entity_type,
      entity_size,
      member_state,
      assessment_methodology,
      assessor_name,
      assessor_organization,
      status,
      overall_maturity_level,
      compliance_percentage,
      risk_rating,
      findings_summary,
      recommendations,
      next_assessment_date,
      authority_notification_status,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE dora_assessments 
      SET 
        assessment_name = ${assessment_name},
        assessment_type = ${assessment_type},
        scope = ${scope},
        entity_type = ${entity_type},
        entity_size = ${entity_size},
        member_state = ${member_state},
        assessment_methodology = ${assessment_methodology},
        assessor_name = ${assessor_name},
        assessor_organization = ${assessor_organization},
        status = ${status},
        overall_maturity_level = ${overall_maturity_level},
        compliance_percentage = ${compliance_percentage},
        risk_rating = ${risk_rating},
        findings_summary = ${findings_summary},
        recommendations = ${recommendations},
        next_assessment_date = ${next_assessment_date},
        authority_notification_status = ${authority_notification_status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating DORA assessment:", error)
    return NextResponse.json({ error: "Failed to update DORA assessment" }, { status: 500 })
  }
});

export const DELETE = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM dora_assessments 
      WHERE id = ${id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Assessment deleted successfully" })
  } catch (error) {
    console.error("Error deleting DORA assessment:", error)
    return NextResponse.json({ error: "Failed to delete DORA assessment" }, { status: 500 })
  }
});
