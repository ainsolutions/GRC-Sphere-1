import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const policyId = searchParams.get("policy_id")
    const versionId = searchParams.get("version_id")

    const attachments = await tenantDb`
      SELECT
        pa.*,
        p.title as policy_title,
        p.policy_id as policy_code,
        u.name as uploader_name
      FROM policy_attachments pa
      LEFT JOIN policies p ON pa.policy_id = p.id
      LEFT JOIN users u ON pa.uploaded_by = u.id
      ${policyId ? tenantDb`WHERE pa.policy_id = ${policyId}` : tenantDb``}
      ${versionId ? tenantDb`${policyId ? tenantDb`AND` : tenantDb`WHERE`} pa.version_id = ${versionId}` : tenantDb``}
      ORDER BY pa.uploaded_at DESC
    `

    return NextResponse.json(attachments)
  } catch (error) {
    console.error("Error fetching policy attachments:", error)
    return NextResponse.json({ error: "Failed to fetch attachments" }, { status: 500 })
  }
});


export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const policyId = formData.get("policy_id") as string
    const versionId = formData.get("version_id") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!policyId) {
      return NextResponse.json({ error: "Policy ID is required" }, { status: 400 })
    }

    // Generate file hash for deduplication
    const fileBuffer = await file.arrayBuffer()
    const fileHash = require("crypto").createHash("sha256").update(Buffer.from(fileBuffer)).digest("hex")

    // Check if file already exists
    const existingFile = await tenantDb`
      SELECT id FROM policy_attachments
      WHERE policy_id = ${policyId}::INTEGER AND file_hash = ${fileHash}
    ` as Record<string, any>[]

    if (existingFile.length > 0) {
      return NextResponse.json({ error: "File already exists" }, { status: 409 })
    }

    // For now, we'll simulate file upload to a local path
    // In production, you'd upload to a cloud storage service
    const filename = `policy-${policyId}-${Date.now()}-${file.name}`
    const filePath = `/uploads/policies/${filename}`

    // Save to database
    const result = await tenantDb`
      INSERT INTO policy_attachments (
        policy_id, version_id, filename, original_filename,
        file_path, file_size, mime_type, file_hash, uploaded_by
      ) VALUES (
        ${policyId}::INTEGER, ${versionId ? Number.parseInt(versionId) : null},
        ${filename}, ${file.name}, ${filePath}, ${file.size},
        ${file.type}, ${fileHash}, 1
      ) RETURNING *
    ` as Record<string, any>[]

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
        INSERT INTO policy_activities (policy_id, version_id, activity_type, description, user_id)
        VALUES (${policyId}::INTEGER, ${versionId ? Number.parseInt(versionId) : null},
                'file_uploaded', 'File uploaded: ' || ${file.name}, 1)
      `
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error uploading policy attachment:", error)
    return NextResponse.json({ error: "Failed to upload attachment" }, { status: 500 })
  }
});
