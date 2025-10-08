import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


// Input validation helper
function validateInput(value: any, fieldName: string): boolean {
  if (value === null || value === undefined || value === "") {
    return false
  }
  // Basic XSS prevention
  if (typeof value === "string" && value.includes("<script>")) {
    return false
  }
  // Specific field validations
  if (
    fieldName === "treatment_type" ||
    fieldName === "treatment_strategy" ||
    fieldName === "business_justification" ||
    fieldName === "owner" ||
    fieldName === "assigned_to" ||
    fieldName === "updated_by"
  ) {
    return typeof value === "string" && value.length <= 255
  }
  if (fieldName === "plan_status") {
    const validStatuses = ["draft", "approved", "in_progress", "completed", "on_hold"]
    return typeof value === "string" && validStatuses.includes(value.toLowerCase())
  }
  if (fieldName === "estimated_cost" || fieldName === "actual_cost") {
    const num = Number(value)
    return !isNaN(num) && num >= 0
  }
  if (fieldName === "expected_risk_reduction") {
    const num = Number(value)
    return !isNaN(num) && num >= 0 && num <= 100 // Assuming percentage
  }
  if (fieldName === "residual_likelihood" || fieldName === "residual_impact") {
    const num = Number(value)
    return !isNaN(num) && num >= 0 && num <= 5 // Assuming 0-5 scale
  }
  if (fieldName === "start_date" || fieldName === "target_completion_date" || fieldName === "actual_completion_date") {
    return !isNaN(Date.parse(value))
  }
  return true
}

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    const result = await tenantDb`
      SELECT tp.*, ir.title as risk_title, ir.risk_level as original_risk_level, ir.risk_score as original_risk_score,
             COALESCE(tc.total_controls, 0) as total_controls,
             COALESCE(tc.completed_controls, 0) as completed_controls,
             COALESCE(tc.overdue_controls, 0) as overdue_controls,
             COALESCE(tc.avg_effectiveness, 0) as avg_effectiveness,
             CASE 
               WHEN tp.target_completion_date < CURRENT_DATE AND tp.plan_status != 'completed' 
               THEN EXTRACT(DAY FROM CURRENT_DATE - tp.target_completion_date)::INTEGER
               ELSE 0
             END as plan_aging_days
      FROM iso27001_treatment_plans tp
      LEFT JOIN iso27001_risks ir ON tp.iso27001_risk_id = ir.id
      LEFT JOIN (
        SELECT treatment_plan_id,
               COUNT(*) as total_controls,
               COUNT(CASE WHEN implementation_status = 'completed' THEN 1 END) as completed_controls,
               COUNT(CASE WHEN aging_status = 'overdue' THEN 1 END) as overdue_controls,
               AVG(effectiveness_rating) as avg_effectiveness
        FROM iso27001_treatment_controls
        GROUP BY treatment_plan_id
      ) tc ON tp.id = tc.treatment_plan_id
      WHERE tp.id = ${Number(id)}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 })
    }

    const serializedData = {
      ...result[0],
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : null,
      start_date: result[0].start_date ? new Date(result[0].start_date).toISOString() : null,
      target_completion_date: result[0].target_completion_date
        ? new Date(result[0].target_completion_date).toISOString()
        : null,
      actual_completion_date: result[0].actual_completion_date
        ? new Date(result[0].actual_completion_date).toISOString()
        : null,
      estimated_cost: Number(result[0].estimated_cost) || 0,
      actual_cost: Number(result[0].actual_cost) || 0,
      expected_risk_reduction: Number(result[0].expected_risk_reduction) || 0,
      residual_likelihood: Number(result[0].residual_likelihood) || 0,
      residual_impact: Number(result[0].residual_impact) || 0,
      residual_risk_score: Number(result[0].residual_risk_score) || 0,
      original_risk_score: Number(result[0].original_risk_score) || 0,
      total_controls: Number(result[0].total_controls) || 0,
      completed_controls: Number(result[0].completed_controls) || 0,
      overdue_controls: Number(result[0].overdue_controls) || 0,
      avg_effectiveness: Number(result[0].avg_effectiveness) || 0,
      plan_aging_days: Number(result[0].plan_aging_days) || 0,
    }

    return NextResponse.json(serializedData)
  } catch (error: any) {
    console.error("Error fetching treatment plan:", error)
    return NextResponse.json({ error: "Failed to fetch treatment plan", details: error.message }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id
    const body = await request.json()

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    const {
      treatment_type,
      treatment_strategy,
      business_justification,
      estimated_cost,
      actual_cost,
      expected_risk_reduction,
      plan_status,
      owner,
      assigned_to,
      start_date,
      target_completion_date,
      actual_completion_date,
      residual_likelihood,
      residual_impact,
      updated_by,
    } = body

    // Validate inputs
    const fieldsToValidate = {
      treatment_type,
      treatment_strategy,
      business_justification,
      estimated_cost,
      actual_cost,
      expected_risk_reduction,
      plan_status,
      owner,
      assigned_to,
      start_date,
      target_completion_date,
      actual_completion_date,
      residual_likelihood,
      residual_impact,
      updated_by,
    }

    for (const [field, value] of Object.entries(fieldsToValidate)) {
      if (value !== undefined && value !== null && !validateInput(value, field)) {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 })
      }
    }

    // Calculate residual risk if likelihood and impact are provided
    let residualRiskScore = undefined
    let residualRiskLevel = undefined
    if (residual_likelihood !== undefined && residual_impact !== undefined) {
      residualRiskScore = Number(residual_likelihood) * Number(residual_impact)
      if (residualRiskScore >= 15) residualRiskLevel = "Critical"
      else if (residualRiskScore >= 10) residualRiskLevel = "High"
      else if (residualRiskScore >= 6) residualRiskLevel = "Medium"
      else residualRiskLevel = "Low"
    }

    // Build update query dynamically
    const updates = []
    const values = []
    let paramIndex = 1

    if (treatment_type !== undefined) {
      updates.push(`treatment_type = $${paramIndex++}`)
      values.push(treatment_type)
    }
    if (treatment_strategy !== undefined) {
      updates.push(`treatment_strategy = $${paramIndex++}`)
      values.push(treatment_strategy)
    }
    if (business_justification !== undefined) {
      updates.push(`business_justification = $${paramIndex++}`)
      values.push(business_justification)
    }
    if (estimated_cost !== undefined) {
      updates.push(`estimated_cost = $${paramIndex++}`)
      values.push(estimated_cost)
    }
    if (actual_cost !== undefined) {
      updates.push(`actual_cost = $${paramIndex++}`)
      values.push(actual_cost)
    }
    if (expected_risk_reduction !== undefined) {
      updates.push(`expected_risk_reduction = $${paramIndex++}`)
      values.push(expected_risk_reduction)
    }
    if (plan_status !== undefined) {
      updates.push(`plan_status = $${paramIndex++}`)
      values.push(plan_status)
    }
    if (owner !== undefined) {
      updates.push(`owner = $${paramIndex++}`)
      values.push(owner)
    }
    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramIndex++}`)
      values.push(assigned_to)
    }
    if (start_date !== undefined) {
      updates.push(`start_date = $${paramIndex++}`)
      values.push(start_date)
    }
    if (target_completion_date !== undefined) {
      updates.push(`target_completion_date = $${paramIndex++}`)
      values.push(target_completion_date)
    }
    if (actual_completion_date !== undefined) {
      updates.push(`actual_completion_date = $${paramIndex++}`)
      values.push(actual_completion_date)
    }
    if (residual_likelihood !== undefined) {
      updates.push(`residual_likelihood = $${paramIndex++}`)
      values.push(residual_likelihood)
    }
    if (residual_impact !== undefined) {
      updates.push(`residual_impact = $${paramIndex++}`)
      values.push(residual_impact)
    }
    if (residualRiskScore !== undefined) {
      updates.push(`residual_risk_score = $${paramIndex++}`)
      values.push(residualRiskScore)
    }
    if (residualRiskLevel !== undefined) {
      updates.push(`residual_risk_level = $${paramIndex++}`)
      values.push(residualRiskLevel)
    }
    if (updated_by !== undefined) {
      updates.push(`updated_by = $${paramIndex++}`)
      values.push(updated_by)
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(Number(id))

    if (updates.length === 1) {
      // Only updated_at was added
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE iso27001_treatment_plans 
      SET ${tenantDb.unsafe(updates.join(", "))}
      WHERE id = ${Number(id)}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 })
    }

    const serializedResult = {
      ...result[0],
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : null,
      start_date: result[0].start_date ? new Date(result[0].start_date).toISOString() : null,
      target_completion_date: result[0].target_completion_date
        ? new Date(result[0].target_completion_date).toISOString()
        : null,
      actual_completion_date: result[0].actual_completion_date
        ? new Date(result[0].actual_completion_date).toISOString()
        : null,
      estimated_cost: Number(result[0].estimated_cost) || 0,
      actual_cost: Number(result[0].actual_cost) || 0,
      expected_risk_reduction: Number(result[0].expected_risk_reduction) || 0,
      residual_likelihood: Number(result[0].residual_likelihood) || 0,
      residual_impact: Number(result[0].residual_impact) || 0,
      residual_risk_score: Number(result[0].residual_risk_score) || 0,
    }

    return NextResponse.json(serializedResult)
  } catch (error: any) {
    console.error("Error updating treatment plan:", error)
    return NextResponse.json({ error: "Failed to update treatment plan", details: error.message }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    // Check if plan exists and get related controls
    const existingPlan = await tenantDb`
      SELECT id FROM iso27001_treatment_plans WHERE id = ${Number(id)}
    `as Record<string, any>[]

    if (existingPlan.length === 0) {
      return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 })
    }

    // Delete related controls first (cascade delete)
    await tenantDb`
      DELETE FROM iso27001_treatment_controls WHERE treatment_plan_id = ${Number(id)}
    `

    // Delete tracking entries
    await tenantDb`
      DELETE FROM iso27001_treatment_tracking WHERE treatment_plan_id = ${Number(id)}
    `

    // Delete the treatment plan
    const result = await tenantDb`
      DELETE FROM iso27001_treatment_plans WHERE id = ${Number(id)}
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      message: "Treatment plan deleted successfully",
      deleted_plan: result[0],
    })
  } catch (error: any) {
    console.error("Error deleting treatment plan:", error)
    return NextResponse.json({ error: "Failed to delete treatment plan", details: error.message }, { status: 500 })
  }
});
