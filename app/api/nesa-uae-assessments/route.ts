import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}, request) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        na.*,
        o.name as organization_name
      FROM nesa_uae_assessments na
      LEFT JOIN organizations o ON na.organization_id = o.id
      ORDER BY na.created_at DESC
    `

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching NESA UAE assessments:", error)
    return NextResponse.json({ error: "Failed to fetch NESA UAE assessments" }, { status: 500 })
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
      critical_infrastructure_type,
      assessment_methodology,
      assessor_name,
      assessor_organization,
    } = body

    if (!assessment_name || !critical_infrastructure_type) {
      return NextResponse.json(
        { error: "Assessment name and critical infrastructure type are required" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO nesa_uae_assessments (
        assessment_name,
        organization_id,
        assessment_type,
        scope,
        critical_infrastructure_type,
        assessment_methodology,
        assessor_name,
        assessor_organization,
        status
      ) VALUES (
        ${assessment_name},
        ${organization_id || 1},
        ${assessment_type || "Initial"},
        ${scope || ""},
        ${critical_infrastructure_type},
        ${assessment_methodology || "Self-Assessment"},
        ${assessor_name || ""},
        ${assessor_organization || ""},
        'Draft'
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating NESA UAE assessment:", error)
    return NextResponse.json({ error: "Failed to create NESA UAE assessment" }, { status: 500 })
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
      critical_infrastructure_type,
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
      nesa_approval_status,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE nesa_uae_assessments 
      SET 
        assessment_name = ${assessment_name},
        assessment_type = ${assessment_type},
        scope = ${scope},
        critical_infrastructure_type = ${critical_infrastructure_type},
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
        nesa_approval_status = ${nesa_approval_status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating NESA UAE assessment:", error)
    return NextResponse.json({ error: "Failed to update NESA UAE assessment" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM nesa_uae_assessments 
      WHERE id = ${id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Assessment deleted successfully" })
  } catch (error) {
    console.error("Error deleting NESA UAE assessment:", error)
    return NextResponse.json({ error: "Failed to delete NESA UAE assessment" }, { status: 500 })
  }
});
