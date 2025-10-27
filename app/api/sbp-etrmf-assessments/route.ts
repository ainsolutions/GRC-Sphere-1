import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}, request) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        sa.*,
        o.name as organization_name
      FROM sbp_etrmf_assessments sa
      LEFT JOIN organizations o ON sa.organization_id = o.id
      ORDER BY sa.created_at DESC
    `

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching SBP ETRMF assessments:", error)
    return NextResponse.json({ error: "Failed to fetch SBP ETRMF assessments" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      assessment_name,
      organization_id,
      assessment_type,
      scope,
      assessment_methodology,
      assessor_name,
      assessor_organization,
    } = body

    if (!assessment_name) {
      return NextResponse.json(
        { error: "Assessment name is required" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO sbp_etrmf_assessments (
        assessment_name,
        organization_id,
        assessment_type,
        scope,
        assessment_methodology,
        assessor_name,
        assessor_organization,
        status
      ) VALUES (
        ${assessment_name},
        ${organization_id || 1},
        ${assessment_type || "Initial"},
        ${scope || ""},
        ${assessment_methodology || "Self-Assessment"},
        ${assessor_name || ""},
        ${assessor_organization || ""},
        'Draft'
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating SBP ETRMF assessment:", error)
    return NextResponse.json({ error: "Failed to create SBP ETRMF assessment" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      id,
      assessment_name,
      assessment_type,
      scope,
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
    } = body

    if (!id) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE sbp_etrmf_assessments 
      SET 
        assessment_name = ${assessment_name},
        assessment_type = ${assessment_type},
        scope = ${scope},
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
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating SBP ETRMF assessment:", error)
    return NextResponse.json({ error: "Failed to update SBP ETRMF assessment" }, { status: 500 })
  }
});


