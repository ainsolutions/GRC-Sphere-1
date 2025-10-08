import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const planId = params.id
    const body = await request.json()
    const { status } = body

    // Validate status value
    const validStatuses = ["Planning", "In Progress", "Completed", "On Hold"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status value. Must be one of: Planning, In Progress, Completed, On Hold",
        },
        { status: 400 },
      )
    }

    // If status is being set to "Completed", check if evidence exists
    if (status === "Completed") {
      const evidenceCount = await tenantDb`
        SELECT COUNT(*) as count 
        FROM nist_mitigation_plan_evidence 
        WHERE plan_id = ${planId} AND is_active = true
      ` as Record<string, string>[]

      if (Number(evidenceCount[0].count) === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Evidence is required to mark a mitigation plan as completed. Please upload evidence first.",
            requiresEvidence: true,
          },
          { status: 400 },
        )
      }
    }

    // Update progress percentage based on status
    let progressPercentage = 0
    switch (status) {
      case "Planning":
        progressPercentage = 0
        break
      case "In Progress":
        progressPercentage = 50
        break
      case "Completed":
        progressPercentage = 100
        break
      case "On Hold":
        // Keep current progress
        const currentPlan = await tenantDb`
          SELECT progress_percentage FROM nist_csf_mitigation_plans WHERE id = ${planId}
        ` as Record<string, number>[]
        progressPercentage = currentPlan[0]?.progress_percentage || 0
        break
    }

    const updatedPlan = await tenantDb`
      UPDATE nist_csf_mitigation_plans 
      SET 
        status = ${status},
        progress_percentage = ${progressPercentage},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${planId}
      RETURNING *
    ` as Record<string, any>[]

    if (updatedPlan.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Mitigation plan not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedPlan[0],
      message: `Status updated to ${status} successfully`,
    })
  } catch (error) {
  console.error("Error updating mitigation plan status:", error)

  if (error instanceof Error && error.message.includes("check constraint")) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid status value. Please select a valid status.",
      },
      { status: 400 },
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: "Failed to update status",
    },
    { status: 500 },
  )
  }
});
