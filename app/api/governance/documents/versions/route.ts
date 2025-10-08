import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext" 


export const GET = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "Document ID is required" },
        { status: 400 }
      )
    }

    // Get all versions for the document
    const versions = await tenantDb`
      SELECT
        v.id,
        v.version,
        v.title,
        v.status,
        v.version_notes,
        v.file_name,
        v.file_size,
        v.mime_type,
        v.created_at,
        v.created_by,
        v.reviewed_by,
        v.approved_by,
        v.reviewed_at,
        v.approved_at,
        -- Get approval status
        CASE
          WHEN v.status = 'approved' THEN 'approved'
          WHEN v.status = 'rejected' THEN 'rejected'
          WHEN EXISTS (
            SELECT 1 FROM governance_document_approvals
            WHERE version_id = v.id AND status = 'rejected'
          ) THEN 'rejected'
          WHEN EXISTS (
            SELECT 1 FROM governance_document_approvals
            WHERE version_id = v.id AND status = 'pending'
          ) THEN 'pending_approval'
          ELSE 'draft'
        END as approval_status,
        -- Count pending approvals
        (SELECT COUNT(*) FROM governance_document_approvals
         WHERE version_id = v.id AND status = 'pending') as pending_approvals
      FROM governance_document_versions v
      WHERE v.document_id = ${parseInt(documentId)}
      ORDER BY v.created_at DESC
    ` as Record<string, any>[]

    // Get approval details for each version
    const versionsWithApprovals = await Promise.all(
      versions.map(async (version: any) => {
        const approvals = await tenantDb`
          SELECT
            approver_role,
            approver_name,
            status,
            comments,
            approved_at,
            created_at
          FROM governance_document_approvals
          WHERE version_id = ${version.id}
          ORDER BY created_at
        `

        return {
          ...version,
          approvals: Array.isArray(approvals) ? approvals : [approvals]
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: versionsWithApprovals,
      count: versionsWithApprovals.length
    })
  } catch (error) {
    console.error("Error fetching document versions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch document versions" },
      { status: 500 }
    )
  }
});

export const POST = withContext(async({tenantDb}: HttpSessionContext,request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      documentId,
      action,
      versionId,
      newVersion,
      versionNotes,
      approverName,
      approverRole,
      comments,
      userId
    } = body

    if (!documentId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: documentId, action" },
        { status: 400 }
      )
    }

    switch (action) {
      case 'create_version':
        if (!newVersion || !versionNotes) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: newVersion, versionNotes" },
            { status: 400 }
          )
        }

        // Get current document info
        const docResult = await tenantDb`
          SELECT * FROM governance_documents WHERE id = ${parseInt(documentId)}
        ` as Record <string, any>[]

        if (docResult.length === 0) {
          return NextResponse.json(
            { success: false, error: "Document not found" },
            { status: 404 }
          )
        }

        const doc = docResult[0]

        // Get latest version content
        const latestVersion = await tenantDb`
          SELECT * FROM governance_document_versions
          WHERE document_id = ${parseInt(documentId)} AND version = ${doc.current_version}
        ` as Record <string, any>[]

        if (latestVersion.length === 0) {
          return NextResponse.json(
            { success: false, error: "No existing version found" },
            { status: 404 }
          )
        }

        // Create new version
        const newVersionResult = await tenantDb`
          INSERT INTO governance_document_versions (
            document_id, version, title, content, file_path, file_name, file_size, mime_type,
            status, version_notes, created_by
          ) VALUES (
            ${parseInt(documentId)}, ${newVersion}, ${doc.title}, ${latestVersion[0].content},
            ${latestVersion[0].file_path}, ${latestVersion[0].file_name}, ${latestVersion[0].file_size},
            ${latestVersion[0].mime_type}, 'draft', ${versionNotes}, ${userId}
          ) RETURNING id
        ` as Record <string, any>[]

        // Update document current version
        await tenantDb`
          UPDATE governance_documents
          SET current_version = ${newVersion}, status = 'draft', updated_at = CURRENT_TIMESTAMP, updated_by = ${userId}
          WHERE id = ${parseInt(documentId)}
        `

        return NextResponse.json({
          success: true,
          data: { versionId: newVersionResult[0].id },
          message: "New version created successfully"
        })

      case 'submit_for_review':
        if (!versionId) {
          return NextResponse.json(
            { success: false, error: "Missing required field: versionId" },
            { status: 400 }
          )
        }

        // Update version status
        await tenantDb`
          UPDATE governance_document_versions
          SET status = 'under_review', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${parseInt(versionId)}
        `

        // Update document status
        await tenantDb`
          UPDATE governance_documents
          SET status = 'under_review', updated_at = CURRENT_TIMESTAMP, updated_by = ${userId}
          WHERE id = ${parseInt(documentId)}
        `

        // Create approval requests (you can customize this based on your approval workflow)
        const approvers = ['CISO', 'Legal', 'Compliance Officer'] // Example approvers
        for (const role of approvers) {
          await tenantDb`
            INSERT INTO governance_document_approvals (
              document_id, version_id, approver_role, status
            ) VALUES (
              ${parseInt(documentId)}, ${parseInt(versionId)}, ${role}, 'pending'
            )
          `
        }

        return NextResponse.json({
          success: true,
          message: "Document submitted for review"
        })

      case 'approve_version':
        if (!versionId || !approverName || !approverRole) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: versionId, approverName, approverRole" },
            { status: 400 }
          )
        }

        // Update approval status
        await tenantDb`
          UPDATE governance_document_approvals
          SET status = 'approved', approver_name = ${approverName}, comments = ${comments},
              approved_at = CURRENT_TIMESTAMP
          WHERE version_id = ${parseInt(versionId)} AND approver_role = ${approverRole}
        `

        // Check if all approvals are complete
        const pendingApprovals = await tenantDb`
          SELECT COUNT(*) as count FROM governance_document_approvals
          WHERE version_id = ${parseInt(versionId)} AND status = 'pending'
        ` as Record <string, any>[]

        if (pendingApprovals[0].count === 0) {
          // All approvals complete, update version and document status
          await tenantDb`
            UPDATE governance_document_versions
            SET status = 'approved', approved_by = ${approverName}, approved_at = CURRENT_TIMESTAMP
            WHERE id = ${parseInt(versionId)}
          `

          await tenantDb`
            UPDATE governance_documents
            SET status = 'approved', updated_at = CURRENT_TIMESTAMP, updated_by = ${userId}
            WHERE id = ${parseInt(documentId)}
          `
        }

        return NextResponse.json({
          success: true,
          message: "Version approved successfully"
        })

      case 'reject_version':
        if (!versionId || !approverName || !approverRole) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: versionId, approverName, approverRole" },
            { status: 400 }
          )
        }

        // Update approval status
        await tenantDb`
          UPDATE governance_document_approvals
          SET status = 'rejected', approver_name = ${approverName}, comments = ${comments},
              approved_at = CURRENT_TIMESTAMP
          WHERE version_id = ${parseInt(versionId)} AND approver_role = ${approverRole}
        `

        // Update version status to rejected
        await tenantDb`
          UPDATE governance_document_versions
          SET status = 'rejected'
          WHERE id = ${parseInt(versionId)}
        `

        // Update document status
        await tenantDb`
          UPDATE governance_documents
          SET status = 'rejected', updated_at = CURRENT_TIMESTAMP, updated_by = ${userId}
          WHERE id = ${parseInt(documentId)}
        `

        return NextResponse.json({
          success: true,
          message: "Version rejected"
        })

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error managing document version:", error)
    return NextResponse.json(
      { success: false, error: "Failed to manage document version" },
      { status: 500 }
    )
  }
});
