import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""
    const category = searchParams.get("category") || ""

    const where: string[] = []
    if (search) {
      where.push(`(change_id ILIKE '%${search}%' OR title ILIKE '%${search}%' OR description ILIKE '%${search}%')`)
    }
    if (status) where.push(`status = '${status}'`)
    if (type) where.push(`change_type = '${type}'`)
    if (category) where.push(`change_category = '${category}'`)
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""

    const rows = await tenantDb`
      SELECT * FROM tech_change_requests ${tenantDb.unsafe(whereClause)} ORDER BY created_at DESC
    `
    return NextResponse.json({ success: true, data: rows })
  } catch (e) {
    console.error("Error listing change requests:", e)
    return NextResponse.json({ success: false, error: "Failed to list change requests" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      title,
      description,
      asset_id,
      change_type,
      change_category,
      risk_level,
      risk_analysis,
      impact_analysis,
      implementation_plan,
      rollback_plan,
      testing_plan,
      testing_results,
      post_implementation_review,
      document_links,
      initiator,
      reviewer,
      approver,
      planned_start_date,
      planned_end_date,
      actual_end_date
    } = body

    // derive asset details for denormalized fields
    let assetRow
    if (asset_id) {
      const assetRes = await tenantDb`SELECT id, asset_type, confidentiality_level, integrity_level, availability_level FROM assets WHERE id = ${asset_id}` as Record<string, any>[]
      assetRow = assetRes[0]
    }

    const result = await tenantDb`
      INSERT INTO tech_change_requests (
        title, description, asset_id, asset_type, cia_confidentiality, cia_integrity, cia_availability,
        change_type, change_category, risk_level, risk_analysis, impact_analysis, implementation_plan,
        rollback_plan, testing_plan, testing_results, post_implementation_review, document_links,
        initiator, reviewer, approver, planned_start_date, planned_end_date, actual_end_date,
        related_incident_id, related_risk_id, related_assessment_id, related_assessment_findings, security_remarks
      ) VALUES (
        ${title}, ${description}, ${asset_id || null}, ${assetRow?.asset_type || null}, ${assetRow?.confidentiality_level || null}, ${assetRow?.integrity_level || null}, ${assetRow?.availability_level || null},
        ${change_type}, ${change_category}, ${risk_level || null}, ${risk_analysis || null}, ${impact_analysis || null}, ${implementation_plan || null},
        ${rollback_plan || null}, ${testing_plan || null}, ${testing_results || null}, ${post_implementation_review || null}, ${document_links || null},
        ${initiator || null}, ${reviewer || null}, ${approver || null}, ${planned_start_date || null}, ${planned_end_date || null}, ${actual_end_date || null},
        ${body.related_incident_id || null}, ${body.related_risk_id || null}, ${body.related_assessment_id || null}, ${body.related_assessment_findings || null}, ${body.security_remarks || null}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({ success: true, data: result[0] })
  } catch (e) {
    console.error("Error creating change request:", e)
    return NextResponse.json({ success: false, error: "Failed to create change request" }, { status: 500 })
  }
});


