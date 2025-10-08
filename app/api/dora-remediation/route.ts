import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async ({tenantDb}: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")

    let query
    if (assessmentId) {
      query = tenantDb`
        SELECT *
        FROM dora_remediation
        WHERE assessment_id = ${assessmentId}
        ORDER BY created_at DESC
      `
    } else {
      query = tenantDb`
        SELECT *
        FROM dora_remediation
        ORDER BY created_at DESC
      `
    }

    const remediations = await query
    return NextResponse.json(remediations)
  } catch (error) {
    console.error("Error fetching DORA remediations:", error)
    return NextResponse.json({ error: "Failed to fetch DORA remediations" }, { status: 500 })
  }
});

export const POST = withContext(async ({tenantDb}: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const {
      assessment_id,
      finding_title,
      finding_description,
      control_reference,
      risk_level,
      remediation_action,
      responsible_party,
      target_date,
      status,
      progress_percentage,
      evidence_provided,
      verification_status,
      cost_estimate,
      notes,
    } = body

    if (!finding_title || !remediation_action) {
      return NextResponse.json({ error: "Finding title and remediation action are required" }, { status: 400 })
    }

    const result = await tenantDb`
      INSERT INTO dora_remediation (
        assessment_id,
        finding_title,
        finding_description,
        control_reference,
        risk_level,
        remediation_action,
        responsible_party,
        target_date,
        status,
        progress_percentage,
        evidence_provided,
        verification_status,
        cost_estimate,
        notes
      ) VALUES (
        ${assessment_id},
        ${finding_title},
        ${finding_description || ""},
        ${control_reference || ""},
        ${risk_level || "Medium"},
        ${remediation_action},
        ${responsible_party || ""},
        ${target_date || null},
        ${status || "Open"},
        ${progress_percentage || 0},
        ${evidence_provided || ""},
        ${verification_status || "Pending"},
        ${cost_estimate || 0},
        ${notes || ""}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating DORA remediation:", error)
    return NextResponse.json({ error: "Failed to create DORA remediation" }, { status: 500 })
  }
});
