import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext";

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string; evidenceId: string } }) => {
  try {
    const { id: planId, evidenceId } = params

    // Verify evidence belongs to the plan
    const evidence = await tenantDb`
      SELECT id, file_name FROM nist_mitigation_plan_evidence
      WHERE id = ${evidenceId} AND plan_id = ${planId} AND is_active = true
    ` as Record<string, any>[]

    if (evidence.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Evidence not found",
        },
        { status: 404 },
      )
    }

    // Soft delete the evidence
    await tenantDb`
      UPDATE nist_mitigation_plan_evidence
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${evidenceId}
    `

    return NextResponse.json({
      success: true,
      data: {
        message: "Evidence deleted successfully",
        deleted_evidence: evidence[0],
      },
    })
  } catch (error) {
    console.error("Error deleting evidence:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete evidence",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string; evidenceId: string } }) => {
  try {
    const { id: planId, evidenceId } = params
    const body = await request.json()
    const { description } = body

    // Verify evidence belongs to the plan
    const existingEvidence = await tenantDb`
      SELECT id FROM nist_mitigation_plan_evidence
      WHERE id = ${evidenceId} AND plan_id = ${planId} AND is_active = true
    ` as Record<string, any>[]

    if (existingEvidence.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Evidence not found",
        },
        { status: 404 },
      )
    }

    // Update evidence description
    const updatedEvidence = await tenantDb`
      UPDATE nist_mitigation_plan_evidence
      SET description = ${description || ""}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${evidenceId}
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: updatedEvidence[0],
    })
  } catch (error) {
    console.error("Error updating evidence:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update evidence",
      },
      { status: 500 },
    )
  }
});
