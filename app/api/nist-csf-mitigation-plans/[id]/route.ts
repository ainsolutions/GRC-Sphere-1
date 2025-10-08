import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const planId = params.id

    const plan = await tenantDb`
      SELECT 
        mp.id,
        mp.plan_id,
        mp.plan_name,
        mp.template_id,
        mp.mitigation_strategy,
        mp.status,
        mp.progress_percentage,
        mp.assigned_owner,
        mp.due_date,
        mp.investment_amount,
        mp.residual_risk_level,
        mp.priority,
        mp.notes,
        mp.created_at,
        mp.updated_at,
        mp.start_date,
        rt.template_name,
        rt.template_id as risk_template_id,
        rt.risk_level,
        rt.function_id,
        f.function_code,
        f.function_name
      FROM nist_csf_mitigation_plans mp
      LEFT JOIN nist_csf_risk_templates rt ON mp.template_id = rt.id
      LEFT JOIN nist_csf_functions f ON rt.function_id = f.id
      WHERE mp.id = ${planId}
    ` as Record<string, any>[]

    if (plan.length === 0) {
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
      data: plan[0],
    })
  } catch (error) {
    console.error("Error fetching NIST CSF mitigation plan:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mitigation plan",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const planId = params.id
    const body = await request.json()
    const {
      plan_name,
      template_id,
      mitigation_strategy,
      assigned_owner,
      due_date,
      investment_amount,
      priority,
      notes,
      status,
      progress_percentage,
      residual_risk_level,
      start_date
    } = body

    // Validate required fields
    if (!plan_name || !mitigation_strategy || !assigned_owner) {
      return NextResponse.json(
        {
          success: false,
          error: "Plan name, mitigation strategy, and action owner are required",
        },
        { status: 400 },
      )
    }

    // Validate that template_id exists if provided
    if (template_id) {
      const templateExists = await tenantDb`
        SELECT id FROM nist_csf_risk_templates WHERE id = ${template_id} AND is_active = true
      ` as Record<string, any>[]

      if (templateExists.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Selected risk template not found or inactive",
          },
          { status: 400 },
        )
      }
    }

    // Validate status value
    const validStatuses = ["Planning", "In Progress", "Completed", "On Hold"]
    const planStatus = validStatuses.includes(status) ? status : "Planning"

    // Validate priority value
    const validPriorities = ["Critical", "High", "Medium", "Low"]
    const planPriority = validPriorities.includes(priority) ? priority : "Medium"

    // Validate risk level
    const validRiskLevels = ["Critical", "High", "Medium", "Low", "Very Low"]
    const planRiskLevel = validRiskLevels.includes(residual_risk_level) ? residual_risk_level : "Medium"

    const updatedPlan = await tenantDb`
      UPDATE nist_csf_mitigation_plans 
      SET 
        plan_name = ${plan_name},
        template_id = ${template_id || null},
        mitigation_strategy = ${mitigation_strategy},
        status = ${planStatus},
        progress_percentage = ${progress_percentage || 0},
        assigned_owner = ${assigned_owner},
        due_date = ${due_date || null},
        investment_amount = ${investment_amount || 0},
        residual_risk_level = ${planRiskLevel},
        priority = ${planPriority},
        notes = ${notes || ""},
        updated_at = CURRENT_TIMESTAMP,
        start_date = ${start_date || null}
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
      message: "Mitigation plan updated successfully",
    })
  } catch (error) {
    console.error("Error updating NIST CSF mitigation plan:", error)

    // Check if it's a constraint violation
    if (error instanceof Error && error.message.includes("check constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status, priority, or risk level value. Please check your input.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update mitigation plan",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const planId = params.id

    // First, delete any associated evidence
    await tenantDb`
      DELETE FROM nist_mitigation_plan_evidence 
      WHERE plan_id = ${planId}
    `

    // Then delete the mitigation plan
    const deletedPlan = await tenantDb`
      DELETE FROM nist_csf_mitigation_plans 
      WHERE id = ${planId}
      RETURNING *
    ` as Record<string, any>[]

    if (deletedPlan.length === 0) {
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
      message: "Mitigation plan deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting NIST CSF mitigation plan:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete mitigation plan",
      },
      { status: 500 },
    )
  }
});
