import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"
import { readFile } from "fs/promises"
import { join } from "path"



export const GET = withContext(async({tenantDb}: HttpSessionContext,request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")
    const version = searchParams.get("version")
    const userId = searchParams.get("userId")

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "Document ID is required" },
        { status: 400 }
      )
    }

    // Get document and version info
    const result = await tenantDb`
      SELECT
        d.document_id,
        d.title,
        d.confidentiality_level,
        d.distribution_list,
        v.file_path,
        v.file_name,
        v.file_size,
        v.mime_type,
        v.id as version_id
      FROM governance_documents d
      LEFT JOIN governance_document_versions v ON d.id = v.document_id
      WHERE d.id = ${parseInt(documentId)}
      ${version ? tenantDb`AND v.version = ${version}` : tenantDb`AND v.version = d.current_version`}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Document or version not found" },
        { status: 404 }
      )
    }

    const doc = result[0]

    // Check access permissions
    if (doc.confidentiality_level === 'restricted' && userId) {
      const hasAccess = doc.distribution_list && doc.distribution_list.includes(userId)
      if (!hasAccess) {
        return NextResponse.json(
          { success: false, error: "Access denied" },
          { status: 403 }
        )
      }
    }

    // Read file from disk
    const fileBuffer = await readFile(doc.file_path)

    // Log access
    if (userId) {
      await tenantDb`
        INSERT INTO governance_document_access_logs (
          document_id, version_id, user_id, action
        ) VALUES (
          ${parseInt(documentId)}, ${doc.version_id}, ${userId}, 'downloaded'
        )
      `
    }

    // Return file with appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', doc.mime_type)
    headers.set('Content-Disposition', `attachment; filename="${doc.file_name}"`)
    headers.set('Content-Length', doc.file_size.toString())

    // Make a real ArrayBuffer, assert it is not a SharedArrayBuffer
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    ) as ArrayBuffer;   // <-- tell TS it's a normal ArrayBuffer

    // Uint8Array over that ArrayBuffer
    const uint8 = new Uint8Array(arrayBuffer);

    // Blob accepts Uint8Array when its buffer is typed as ArrayBuffer
    return new NextResponse(new Blob([uint8]), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json(
      { success: false, error: "Failed to download file" },
      { status: 500 }
    )
  }
});
