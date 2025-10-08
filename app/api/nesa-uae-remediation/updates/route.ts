import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const remediationActionId = searchParams.get("remediation_action_id")

    if (!remediationActionId) {
      return NextResponse.json({ error: "Remediation action ID is required" }, { status: 400 })
    }

    const updates = await tenantDb`
      SELECT 
        ru.*,
        ra.finding_title,
        ra.finding_id
      FROM nesa_uae_remediation_updates ru
      LEFT JOIN nesa_uae_remediation_actions ra ON ru.remediation_action_id = ra.id
      WHERE ru.remediation_action_id = ${Number.parseInt(remediationActionId)}
      ORDER BY ru.update_date DESC
    `

    return NextResponse.json(updates)
  } catch (error) {
    console.error("Error fetching remediation updates:", error)
    return NextResponse.json({ error: "Failed to fetch remediation updates" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      remediation_action_id,
      update_type,
      update_description,
      previous_status,
      new_status,
      previous_progress,
      new_progress,
      update_by,
      attachments,
    } = body

    if (!remediation_action_id || !update_type || !update_description || !update_by) {
      return NextResponse.json(
        { error: "Remediation action ID, update type, description, and update by are required" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO nesa_uae_remediation_updates (
        remediation_action_id,
        update_type,
        update_description,
        previous_status,
        new_status,
        previous_progress,
        new_progress,
        update_by,
        attachments
      ) VALUES (
        ${remediation_action_id},
        ${update_type},
        ${update_description},
        ${previous_status || null},
        ${new_status || null},
        ${previous_progress || null},
        ${new_progress || null},
        ${update_by},
        ${attachments || null}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating remediation update:", error)
    return NextResponse.json({ error: "Failed to create remediation update" }, { status: 500 })
  }
});
