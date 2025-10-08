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
    fieldName === "iso27001_risk_id" ||
    fieldName === "treatment_type" ||
    fieldName === "treatment_strategy" ||
    fieldName === "business_justification" ||
    fieldName === "owner" ||
    fieldName === "assigned_to" ||
    fieldName === "created_by"
  ) {
    return typeof value === "string" && value.length <= 255
  }
  if (fieldName === "status") {
    const validStatuses = ["draft", "in_progress", "completed", "on_hold"]
    return typeof value === "string" && validStatuses.includes(value.toLowerCase())
  }
  if (fieldName === "estimated_cost") {
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
  if (fieldName === "start_date" || fieldName === "target_completion_date") {
    return !isNaN(Date.parse(value))
  }
  return true
}

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const owner = searchParams.get("owner")

    // Validate inputs
    if ((status && !validateInput(status, "status")) || (owner && !validateInput(owner, "owner"))) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    let result

    if (status && status !== "all" && owner && owner !== "all") {
      result = await tenantDb`
        SELECT tp.*, ir.title as risk_title, ir.risk_level as original_risk_level, ir.risk_score as original_risk_score,
               COALESCE(tc.total_controls, 0) as total_controls,
               COALESCE(tc.completed_controls, 0) as completed_controls,
               COALESCE(tc.overdue_controls, 0) as overdue_controls,
               COALESCE(tc.avg_effectiveness, 0) as avg_effectiveness,
               CASE 
                 WHEN tp.target_completion_date < CURRENT_DATE AND tp.plan_status != 'completed' 
                 THEN (CURRENT_DATE - tp.target_completion_date)::INTEGER
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
        WHERE tp.plan_status = ${status} AND tp.owner ILIKE ${`%${owner}%`}
        ORDER BY tp.created_at DESC
      ` as Record<string, any>[]
    } else if (status && status !== "all") {
      result = await tenantDb`
        SELECT tp.*, ir.title as risk_title, ir.risk_level as original_risk_level, ir.risk_score as original_risk_score,
               COALESCE(tc.total_controls, 0) as total_controls,
               COALESCE(tc.completed_controls, 0) as completed_controls,
               COALESCE(tc.overdue_controls, 0) as overdue_controls,
               COALESCE(tc.avg_effectiveness, 0) as avg_effectiveness,
               CASE 
                 WHEN tp.target_completion_date < CURRENT_DATE AND tp.plan_status != 'completed' 
                 THEN (CURRENT_DATE - tp.target_completion_date)::INTEGER
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
        WHERE tp.plan_status = ${status}
        ORDER BY tp.created_at DESC
      ` as Record<string, any>[]
    } else if (owner && owner !== "all") {
      result = await tenantDb`
        SELECT tp.*, ir.title as risk_title, ir.risk_level as original_risk_level, ir.risk_score as original_risk_score,
               COALESCE(tc.total_controls, 0) as total_controls,
               COALESCE(tc.completed_controls, 0) as completed_controls,
               COALESCE(tc.overdue_controls, 0) as overdue_controls,
               COALESCE(tc.avg_effectiveness, 0) as avg_effectiveness,
               CASE 
                 WHEN tp.target_completion_date < CURRENT_DATE AND tp.plan_status != 'completed' 
                 THEN (CURRENT_DATE - tp.target_completion_date)::INTEGER
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
        WHERE tp.owner ILIKE ${`%${owner}%`}
        ORDER BY tp.created_at DESC
      ` as Record<string, any>[]
    } else {
      result = await tenantDb`
        SELECT tp.*, ir.title as risk_title, ir.risk_level as original_risk_level, ir.risk_score as original_risk_score,
               COALESCE(tc.total_controls, 0) as total_controls,
               COALESCE(tc.completed_controls, 0) as completed_controls,
               COALESCE(tc.overdue_controls, 0) as overdue_controls,
               COALESCE(tc.avg_effectiveness, 0) as avg_effectiveness,
               CASE 
                 WHEN tp.target_completion_date < CURRENT_DATE AND tp.plan_status != 'completed' 
                 THEN (CURRENT_DATE - tp.target_completion_date)::INTEGER
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
        ORDER BY tp.created_at DESC
      ` as Record<string, any>[]
    }

    const serializedData = (Array.isArray(result) ? result : []).map((row) => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
      start_date: row.start_date ? new Date(row.start_date).toISOString() : null,
      target_completion_date: row.target_completion_date ? new Date(row.target_completion_date).toISOString() : null,
      actual_completion_date: row.actual_completion_date ? new Date(row.actual_completion_date).toISOString() : null,
      estimated_cost: Number(row.estimated_cost) || 0,
      actual_cost: Number(row.actual_cost) || 0,
      expected_risk_reduction: Number(row.expected_risk_reduction) || 0,
      residual_likelihood: Number(row.residual_likelihood) || 0,
      residual_impact: Number(row.residual_impact) || 0,
      residual_risk_score: Number(row.residual_risk_score) || 0,
      original_risk_score: Number(row.original_risk_score) || 0,
      total_controls: Number(row.total_controls) || 0,
      completed_controls: Number(row.completed_controls) || 0,
      overdue_controls: Number(row.overdue_controls) || 0,
      avg_effectiveness: Number(row.avg_effectiveness) || 0,
      plan_aging_days: Number(row.plan_aging_days) || 0,
    }))

    return NextResponse.json(serializedData)
  } catch (error: any) {
    console.error("Error fetching treatment plans:", error)
    return NextResponse.json({ error: "Failed to fetch treatment plans", details: error.message }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      iso27001_risk_id,
      treatment_type,
      treatment_strategy,
      business_justification,
      estimated_cost,
      expected_risk_reduction,
      owner,
      assigned_to,
      start_date,
      target_completion_date,
      residual_likelihood,
      residual_impact,
      created_by,
      plan_status,
    } = body

    // Validate required fields
    const requiredFields = {
      iso27001_risk_id,
      treatment_type,
      treatment_strategy,
      owner,
      start_date,
      target_completion_date,
      created_by,
    }
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!validateInput(value, field)) {
        return NextResponse.json({ error: `Invalid or missing ${field}` }, { status: 400 })
      }
    }

    // Validate optional fields
    if (estimated_cost !== undefined && !validateInput(estimated_cost, "estimated_cost")) {
      return NextResponse.json({ error: "Invalid estimated cost" }, { status: 400 })
    }
    if (expected_risk_reduction !== undefined && !validateInput(expected_risk_reduction, "expected_risk_reduction")) {
      return NextResponse.json({ error: "Invalid expected risk reduction" }, { status: 400 })
    }
    if (residual_likelihood !== undefined && !validateInput(residual_likelihood, "residual_likelihood")) {
      return NextResponse.json({ error: "Invalid residual likelihood" }, { status: 400 })
    }
    if (residual_impact !== undefined && !validateInput(residual_impact, "residual_impact")) {
      return NextResponse.json({ error: "Invalid residual impact" }, { status: 400 })
    }

    // Generate plan ID
    const planIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(plan_id FROM 5) AS INTEGER)), 0) + 1 as next_id
      FROM iso27001_treatment_plans
      WHERE plan_id LIKE 'TP-%'
    ` as Record<string, any>[]
    const nextId = planIdResult[0]?.next_id || 1
    const planId = `TP-${String(nextId).padStart(4, "0")}`

    // Fetch risk context required by NOT NULL columns
    const riskRows = await tenantDb`
      SELECT id, risk_id, title, risk_level, risk_score
      FROM iso27001_risks
      WHERE id = ${Number(iso27001_risk_id)}
      LIMIT 1
    ` as Record<string, any>[]
    if (!riskRows || riskRows.length === 0) {
      return NextResponse.json({ error: "Risk not found for iso27001_risk_id" }, { status: 404 })
    }
    const risk = riskRows[0]

    // Insert plan (let DB compute any generated columns like residual_risk_score)
    const result = await tenantDb`
      INSERT INTO iso27001_treatment_plans (
        plan_id, iso27001_risk_id, iso_risk_id, risk_title, original_risk_level, original_risk_score,
        treatment_type, treatment_strategy, business_justification,
        estimated_cost, expected_risk_reduction, plan_status, owner, assigned_to,
        start_date, target_completion_date, residual_likelihood, residual_impact, created_by
      ) VALUES (
        ${planId}, ${iso27001_risk_id}, ${risk.risk_id}, ${risk.title}, ${risk.risk_level}, ${risk.risk_score},
        ${treatment_type}, ${treatment_strategy}, ${business_justification || null},
        ${estimated_cost || null}, ${expected_risk_reduction || null}, ${plan_status || 'draft'}, ${owner}, ${assigned_to || null},
        ${start_date}, ${target_completion_date}, ${residual_likelihood || null}, ${residual_impact || null}, ${created_by}
      )
      RETURNING *
    ` as Record<string, any>[]

    const serializedResult = {
      ...result[0],
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : null,
      start_date: result[0].start_date ? new Date(result[0].start_date).toISOString() : null,
      target_completion_date: result[0].target_completion_date
        ? new Date(result[0].target_completion_date).toISOString()
        : null,
      estimated_cost: Number(result[0].estimated_cost) || 0,
      expected_risk_reduction: Number(result[0].expected_risk_reduction) || 0,
      residual_likelihood: Number(result[0].residual_likelihood) || 0,
      residual_impact: Number(result[0].residual_impact) || 0,
      residual_risk_score: Number(result[0].residual_risk_score) || 0,
    }

    return NextResponse.json(serializedResult, { status: 201 })
  } catch (error: any) {
    console.error("Error creating treatment plan:", error)
    return NextResponse.json({ error: "Failed to create treatment plan", details: error.message }, { status: 500 })
  }
});
