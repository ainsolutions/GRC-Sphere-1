import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const planId = params.id

    const evidence = await tenantDb`
      SELECT 
        id,
        evidence_id,
        plan_id,
        file_name,
        file_path,
        file_size,
        file_type,
        upload_date,
        uploaded_by,
        description,
        is_active,
        created_at,
        updated_at
      FROM nist_mitigation_plan_evidence
      WHERE plan_id = ${planId} AND is_active = true
      ORDER BY upload_date DESC
    `

    return NextResponse.json({
      success: true,
      data: evidence,
    })
  } catch (error) {
    console.error("Error fetching mitigation plan evidence:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch evidence",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const planId = params.id
    const body = await request.json()
    const { file_name, file_path, file_size, file_type, uploaded_by, description } = body

    // Generate evidence ID
    const evidenceIdResult = await tenantDb`SELECT generate_nist_evidence_id() as evidence_id` as Record<string, { evidence_id: string }>[]
    const evidenceId = evidenceIdResult[0].evidence_id

    const evidence = await tenantDb`
      INSERT INTO nist_mitigation_plan_evidence (
        evidence_id,
        plan_id,
        file_name,
        file_path,
        file_size,
        file_type,
        uploaded_by,
        description,
        is_active
      ) VALUES (
        ${evidenceId},
        ${planId},
        ${file_name},
        ${file_path},
        ${file_size || 0},
        ${file_type || "application/octet-stream"},
        ${uploaded_by || "Unknown User"},
        ${description || ""},
        true
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: evidence[0],
    })
  } catch (error) {
    console.error("Error uploading evidence:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload evidence",
      },
      { status: 500 },
    )
  }
});
