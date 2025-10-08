import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"


export const POST = withContext(async({tenantDb}: HttpSessionContext,request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentId = formData.get("documentId") as string
    const version = formData.get("version") as string
    const uploadedBy = formData.get("uploadedBy") as string
    const versionNotes = formData.get("versionNotes") as string || "File uploaded"

    if (!file || !documentId || !version) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: file, documentId, version" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/rtf'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "File type not allowed. Allowed types: PDF, DOC, DOCX, TXT, MD, RTF" },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'documents')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, continue
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${randomUUID()}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Get document info
    const documentResult = await tenantDb`
      SELECT id FROM governance_documents WHERE id = ${parseInt(documentId)}
    ` as Record <string, any>[]

    if (documentResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      )
    }

    const doc = documentResult[0]

    // Update document with file information
    await tenantDb`
      UPDATE governance_documents
      SET file_path = ${filePath},
          file_name = ${file.name},
          file_size = ${file.size},
          mime_type = ${file.type},
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ${uploadedBy}
      WHERE id = ${doc.id}
    `

    return NextResponse.json({
      success: true,
      data: {
        documentId: documentId,
        version: version,
        fileName: file.name,
        fileSize: file.size,
        filePath: filePath,
        mimeType: file.type
      },
      message: "File uploaded successfully"
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    )
  }
});
