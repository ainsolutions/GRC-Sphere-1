import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params

    const attachment = await tenantDb`
      SELECT
        pa.*,
        p.title as policy_title,
        p.policy_id as policy_code,
        u.name as uploader_name
      FROM policy_attachments pa
      LEFT JOIN policies p ON pa.policy_id = p.id
      LEFT JOIN users u ON pa.uploaded_by = u.id
      WHERE pa.id = ${id}::INTEGER
    ` as Record<string, any>[]

    if (attachment.length === 0) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }

    return NextResponse.json(attachment[0])
  } catch (error) {
    console.error("Error fetching attachment:", error)
    return NextResponse.json({ error: "Failed to fetch attachment" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params

    // Get attachment info before deleting
    const attachment = await tenantDb`
      SELECT * FROM policy_attachments WHERE id = ${id}::INTEGER
    ` as Record<string, any>[]

    if (attachment.length === 0) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }

    // Delete the attachment record
    await tenantDb`
      DELETE FROM policy_attachments WHERE id = ${id}::INTEGER
    `

    // Log activity
    const activitiesTableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'policy_activities'
      )
    ` as Record<string, any>[]

    if (activitiesTableExists[0].exists) {
      await tenantDb`
        INSERT INTO policy_activities (policy_id, activity_type, description, user_id)
        VALUES (${attachment[0].policy_id}, 'file_deleted',
                'File deleted: ' || ${attachment[0].original_filename}, 1)
      `
    }

    // Note: In a real implementation, you'd also delete the physical file from storage

    return NextResponse.json({ success: true, message: "Attachment deleted successfully" })
  } catch (error) {
    console.error("Error deleting attachment:", error)
    return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 })
  }
});
