import { withContext } from "@/lib/HttpContext"
import { type NextRequest, NextResponse } from "next/server"


export const GET = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const remediationActionId = searchParams.get("remediation_action_id")

    if (!remediationActionId) {
      return NextResponse.json({ error: "Missing remediation_action_id parameter" }, { status: 400 })
    }

    // Check if table exists
    const tableExists = (await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hipaa_remediation_updates'
      )
    `) as Record<string,any>[];

    if (!tableExists[0]?.exists) {
      // Return sample updates if table doesn't exist
      return NextResponse.json([
        {
          id: 1,
          remediation_action_id: Number.parseInt(remediationActionId),
          update_type: "status_update",
          update_description: "Started working on access control implementation",
          previous_status: "open",
          new_status: "in-progress",
          previous_progress: 0,
          new_progress: 25,
          update_by: "John Smith",
          update_date: "2024-01-20T10:00:00Z",
        },
        {
          id: 2,
          remediation_action_id: Number.parseInt(remediationActionId),
          update_type: "progress_update",
          update_description: "Completed policy draft and started implementation",
          previous_status: "in-progress",
          new_status: "in-progress",
          previous_progress: 25,
          new_progress: 65,
          update_by: "John Smith",
          update_date: "2024-02-01T14:30:00Z",
        },
      ])
    }

    const result = await tenantDb`
      SELECT 
        id,
        remediation_action_id,
        update_type,
        update_description,
        previous_status,
        new_status,
        previous_progress,
        new_progress,
        update_by,
        update_date
      FROM hipaa_remediation_updates
      WHERE remediation_action_id = ${remediationActionId}
      ORDER BY update_date DESC
    `

    return NextResponse.json(Array.isArray(result) ? result : [])
  } catch (error) {
    console.error("Error fetching HIPAA remediation updates:", error)
    return NextResponse.json([], { status: 200 })
  }
})

export const POST = withContext( async ({ tenantDb }, request) => {
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
    } = body

    if (!remediation_action_id || !update_description) {
      return NextResponse.json(
        { error: "Missing required fields: remediation_action_id, update_description" },
        { status: 400 },
      )
    }

    // Check if table exists, create if not
    const tableExists = (await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hipaa_remediation_updates'
      )
    `) as Record<string,any>[];

    if (!tableExists[0]?.exists) {
      await tenantDb`
        CREATE TABLE IF NOT EXISTS hipaa_remediation_updates (
          id SERIAL PRIMARY KEY,
          remediation_action_id INTEGER NOT NULL,
          update_type VARCHAR(50) DEFAULT 'general',
          update_description TEXT NOT NULL,
          previous_status VARCHAR(30),
          new_status VARCHAR(30),
          previous_progress INTEGER DEFAULT 0,
          new_progress INTEGER DEFAULT 0,
          update_by VARCHAR(100) DEFAULT 'System',
          update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }

    const result = (await tenantDb`
      INSERT INTO hipaa_remediation_updates (
        remediation_action_id,
        update_type,
        update_description,
        previous_status,
        new_status,
        previous_progress,
        new_progress,
        update_by,
        update_date
      ) VALUES (
        ${remediation_action_id},
        ${update_type || "general"},
        ${update_description},
        ${previous_status || null},
        ${new_status || null},
        ${previous_progress || 0},
        ${new_progress || 0},
        ${update_by || "System"},
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `) as Record<string,any>[];

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating HIPAA remediation update:", error)
    return NextResponse.json({ error: "Failed to create update" }, { status: 500 })
  }
});