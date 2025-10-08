import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import crypto from "crypto"
import fs from "fs"
import path from "path"


// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'policies')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export const GET = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const versionId = searchParams.get("version_id")

    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'policy_attachments'
      )
    ` as Record<string, boolean>[]

    if (!tableExists[0].exists) {
      console.log("Policy attachments table does not exist, returning empty array")
      return NextResponse.json([])
    }

    let attachments
    if (versionId) {
      attachments = await tenantDb`
        SELECT
          pa.*,
          pv.version,
          pv.is_current
        FROM policy_attachments pa
        LEFT JOIN policy_versions pv ON pa.version_id = pv.id
        WHERE pa.policy_id = ${id}::INTEGER AND pa.version_id = ${versionId}::INTEGER
        ORDER BY pa.uploaded_at DESC
      `
    } else {
      attachments = await tenantDb`
        SELECT
          pa.*,
          pv.version,
          pv.is_current
        FROM policy_attachments pa
        LEFT JOIN policy_versions pv ON pa.version_id = pv.id
        WHERE pa.policy_id = ${id}::INTEGER
        ORDER BY pa.uploaded_at DESC
      `
    }

    return NextResponse.json(attachments)
  } catch (error) {
    console.error("Error fetching policy attachments:", error)
    return NextResponse.json([])
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> })  => {
  try {

    const { id } = await params
    

    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'policy_attachments'
      )
    ` as Record<string, boolean>[]

    if (!tableExists[0].exists) {
      return NextResponse.json(
        { error: "Policy attachments feature not available. Please run database migrations." },
        { status: 503 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const versionId = formData.get("version_id") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Generate file hash for deduplication
    const fileBuffer = await file.arrayBuffer()
    const fileHash = crypto.createHash("sha256").update(Buffer.from(fileBuffer)).digest("hex")

    // Check if file already exists
    const existingFile = await tenantDb`
      SELECT id FROM policy_attachments
      WHERE policy_id = ${id}::INTEGER AND file_hash = ${fileHash}
    ` as Record<string, any>[]

    if (existingFile.length > 0) {
      return NextResponse.json({ error: "File already exists" }, { status: 409 })
    }

    // Save file locally
    const filename = `policy-${id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadsDir, filename)

    // Write file to disk
    fs.writeFileSync(filePath, Buffer.from(fileBuffer))

    // Create a URL path for accessing the file
    const fileUrl = `/api/files/${filename}`

    // Save to database
    const result = await tenantDb`
      INSERT INTO policy_attachments (
        policy_id, version_id, filename, original_filename,
        file_path, file_size, mime_type, file_hash, uploaded_by
      ) VALUES (
        ${id}::INTEGER, ${versionId ? Number.parseInt(versionId) : null},
        ${filename}, ${file.name}, ${fileUrl}, ${file.size},
        ${file.type || 'application/octet-stream'}, ${fileHash}, 1
      ) RETURNING *
    ` as Record<string, any>[]

    const activitiesTableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'policy_activities'
      )
    ` as Record<string, boolean>[]

    if (activitiesTableExists[0].exists) {
      // Log activity
      await tenantDb`
        INSERT INTO policy_activities (policy_id, version_id, activity_type, description, user_id)

        VALUES (${id}::INTEGER, ${versionId ? Number.parseInt(versionId) : null}, 

                'file_uploaded', 'File uploaded: ' || ${file.name}, 1)
      `
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error uploading policy attachment:", error)
    return NextResponse.json({ error: "Failed to upload attachment" }, { status: 500 })
  }
});
