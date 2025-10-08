import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}, request) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        id,
        assessment_name,
        organization_id,
        assessment_scope,
        assessment_period_start,
        assessment_period_end,
        assessor_name,
        assessor_title,
        assessor_email,
        status,
        overall_maturity_score,
        compliance_percentage,
        total_controls,
        implemented_controls,
        partially_implemented_controls,
        not_implemented_controls,
        not_applicable_controls,
        high_priority_gaps,
        medium_priority_gaps,
        low_priority_gaps,
        executive_summary,
        key_findings,
        recommendations,
        next_assessment_date,
        created_at,
        updated_at
      FROM nesa_uae_self_assessments 
      ORDER BY created_at DESC
    `

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Failed to fetch NESA UAE self assessments:", error)
    return NextResponse.json({ error: "Failed to fetch self assessments" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      assessment_name,
      organization_id,
      assessment_scope,
      assessment_period_start,
      assessment_period_end,
      assessor_name,
      assessor_title,
      assessor_email,
      status,
      created_by,
    } = body

    const result = await tenantDb`
      INSERT INTO nesa_uae_self_assessments (
        assessment_name,
        organization_id,
        assessment_scope,
        assessment_period_start,
        assessment_period_end,
        assessor_name,
        assessor_title,
        assessor_email,
        status,
        overall_maturity_score,
        compliance_percentage,
        total_controls,
        implemented_controls,
        partially_implemented_controls,
        not_implemented_controls,
        not_applicable_controls,
        high_priority_gaps,
        medium_priority_gaps,
        low_priority_gaps,
        created_by,
        created_at,
        updated_at
      ) VALUES (
        ${assessment_name},
        ${organization_id || 1},
        ${assessment_scope || ""},
        ${assessment_period_start || null},
        ${assessment_period_end || null},
        ${assessor_name || ""},
        ${assessor_title || ""},
        ${assessor_email || ""},
        ${status || "Draft"},
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        ${created_by || "System"},
        NOW(),
        NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to create NESA UAE self assessment:", error)
    return NextResponse.json({ error: "Failed to create self assessment" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      id,
      assessment_name,
      assessment_scope,
      assessment_period_start,
      assessment_period_end,
      assessor_name,
      assessor_title,
      assessor_email,
      status,
      executive_summary,
      key_findings,
      recommendations,
      next_assessment_date,
      updated_by,
    } = body

    const result = await tenantDb`
      UPDATE nesa_uae_self_assessments 
      SET 
        assessment_name = ${assessment_name},
        assessment_scope = ${assessment_scope},
        assessment_period_start = ${assessment_period_start},
        assessment_period_end = ${assessment_period_end},
        assessor_name = ${assessor_name},
        assessor_title = ${assessor_title},
        assessor_email = ${assessor_email},
        status = ${status},
        executive_summary = ${executive_summary},
        key_findings = ${key_findings},
        recommendations = ${recommendations},
        next_assessment_date = ${next_assessment_date},
        updated_by = ${updated_by || "System"},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string,any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Self assessment not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to update NESA UAE self assessment:", error)
    return NextResponse.json({ error: "Failed to update self assessment" }, { status: 500 })
  }
});
