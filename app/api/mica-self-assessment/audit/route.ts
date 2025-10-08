import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const auditLogs = await tenantDb`
      SELECT 
        id,
        assessment_id,
        control_id,
        action_type,
        field_changed,
        old_value,
        new_value,
        changed_by,
        change_reason,
        timestamp
      FROM mica_self_assessment_audit_log 
      WHERE assessment_id = ${assessmentId}
      ORDER BY timestamp DESC
      LIMIT 100
    `

    return NextResponse.json(auditLogs)
  } catch (error) {
    console.error("Failed to fetch MICA self assessment audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { assessment_id, control_id, action_type, field_changed, old_value, new_value, changed_by, change_reason } =
      body

    const result = await tenantDb`
      INSERT INTO mica_self_assessment_audit_log (
        assessment_id,
        control_id,
        action_type,
        field_changed,
        old_value,
        new_value,
        changed_by,
        change_reason,
        timestamp
      ) VALUES (
        ${assessment_id},
        ${control_id},
        ${action_type},
        ${field_changed},
        ${old_value || ""},
        ${new_value || ""},
        ${changed_by || "System"},
        ${change_reason || ""},
        NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to create MICA self assessment audit log:", error)
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 })
  }
});
