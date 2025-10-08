import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext" 
import { te } from "date-fns/locale"


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
    fieldName === "control_title" ||
    fieldName === "control_description" ||
    fieldName === "assigned_owner" ||
    fieldName === "technical_contact" ||
    fieldName === "evidence_location" ||
    fieldName === "testing_procedure" ||
    fieldName === "remediation_notes"
  ) {
    return typeof value === "string" && value.length <= 1000
  }
  if (fieldName === "control_type") {
    const validTypes = ["preventive", "detective", "corrective", "compensating"]
    return typeof value === "string" && validTypes.includes(value.toLowerCase())
  }
  if (fieldName === "implementation_status") {
    const validStatuses = ["not_started", "in_progress", "completed", "on_hold"]
    return typeof value === "string" && validStatuses.includes(value.toLowerCase())
  }
  if (fieldName === "automation_level") {
    const validLevels = ["manual", "semi_automated", "fully_automated"]
    return typeof value === "string" && validLevels.includes(value.toLowerCase())
  }
  if (fieldName === "effectiveness_rating") {
    const num = Number(value)
    return !isNaN(num) && num >= 0 && num <= 5
  }
  if (fieldName === "implementation_cost") {
    const num = Number(value)
    return !isNaN(num) && num >= 0
  }
  if (
    fieldName === "due_date" ||
    fieldName === "implementation_date" ||
    fieldName === "testing_date" ||
    fieldName === "next_review_date" ||
    fieldName === "completion_date"
  ) {
    return !isNaN(Date.parse(value))
  }
  return true
}

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const owner = searchParams.get("owner")
    const treatmentPlanId = searchParams.get("treatment_plan_id")

    // Validate inputs
    if (
      (status && !validateInput(status, "implementation_status")) ||
      (owner && !validateInput(owner, "assigned_owner")) ||
      (treatmentPlanId && isNaN(Number(treatmentPlanId)))
    ) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    let result

    if (treatmentPlanId) {
      result = await tenantDb`
        SELECT tc.*, tp.plan_id as treatment_plan_id_display, tp.treatment_type, 
               ir.risk_id as iso_risk_id, ir.title as risk_title,
               CASE 
                 WHEN tc.due_date < CURRENT_DATE AND tc.implementation_status != 'completed' 
                 THEN (CURRENT_DATE - tc.due_date)::INTEGER
                 ELSE 0
               END as aging_days,
               CASE 
                 WHEN tc.due_date < CURRENT_DATE AND tc.implementation_status != 'completed' THEN 'overdue'
                 WHEN tc.due_date <= (CURRENT_DATE + 7) AND tc.implementation_status != 'completed' THEN 'due_soon'
                 WHEN tc.implementation_status = 'completed' THEN 'completed'
                 ELSE 'on_track'
               END as aging_status
        FROM iso27001_treatment_controls tc
        LEFT JOIN iso27001_treatment_plans tp ON tc.treatment_plan_id = tp.id
        LEFT JOIN iso27001_risks ir ON tp.iso27001_risk_id = ir.id
        WHERE tc.treatment_plan_id = ${Number(treatmentPlanId)}
        ORDER BY tc.created_at DESC
      ` as Record<string, any>[]
    } else {
      // Build dynamic query based on filters
      const whereConditions = []
      const queryParams = []

      if (status && status !== "all") {
        whereConditions.push(`tc.implementation_status = $${queryParams.length + 1}`)
        queryParams.push(status)
      }
      if (owner && owner !== "all") {
        whereConditions.push(`tc.assigned_owner ILIKE $${queryParams.length + 1}`)
        queryParams.push(`%${owner}%`)
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

      result = await tenantDb`
        SELECT tc.*, tp.plan_id as treatment_plan_id_display, tp.treatment_type, 
               ir.risk_id as iso_risk_id, ir.title as risk_title,
               CASE 
                 WHEN tc.due_date < CURRENT_DATE AND tc.implementation_status != 'completed' 
                 THEN (CURRENT_DATE - tc.due_date)::INTEGER
                 ELSE 0
               END as aging_days,
               CASE 
                 WHEN tc.due_date < CURRENT_DATE AND tc.implementation_status != 'completed' THEN 'overdue'
                 WHEN tc.due_date <= (CURRENT_DATE + 7) AND tc.implementation_status != 'completed' THEN 'due_soon'
                 WHEN tc.implementation_status = 'completed' THEN 'completed'
                 ELSE 'on_track'
               END as aging_status
        FROM iso27001_treatment_controls tc
        LEFT JOIN iso27001_treatment_plans tp ON tc.treatment_plan_id = tp.id
        LEFT JOIN iso27001_risks ir ON tp.iso27001_risk_id = ir.id
        ${tenantDb.unsafe(whereClause)}
        ORDER BY tc.created_at DESC
      ` as Record<string, any>[]
    }

    const serializedData = (Array.isArray(result) ? result : []).map((row) => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
      implementation_date: row.implementation_date ? new Date(row.implementation_date).toISOString() : null,
      testing_date: row.testing_date ? new Date(row.testing_date).toISOString() : null,
      next_review_date: row.next_review_date ? new Date(row.next_review_date).toISOString() : null,
      due_date: row.due_date ? new Date(row.due_date).toISOString() : null,
      completion_date: row.completion_date ? new Date(row.completion_date).toISOString() : null,
      effectiveness_rating: Number(row.effectiveness_rating) || 0,
      implementation_cost: Number(row.implementation_cost) || 0,
      aging_days: Number(row.aging_days) || 0,
      compliance_frameworks: Array.isArray(row.compliance_frameworks) ? row.compliance_frameworks : [],
    }))

    return NextResponse.json(serializedData)
  } catch (error: any) {
    console.error("Error fetching treatment controls:", error)
    return NextResponse.json({ error: "Failed to fetch treatment controls", details: error.message }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      treatment_plan_id,
      control_title,
      control_description,
      control_type,
      control_category,
      assigned_owner,
      technical_contact,
      due_date,
      automation_level,
      compliance_frameworks,
      evidence_location,
      testing_procedure,
    } = body

    // Validate required fields
    const requiredFields = {
      treatment_plan_id,
      control_title,
      control_description,
      control_type,
      assigned_owner,
      due_date,
    }
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!validateInput(value, field)) {
        return NextResponse.json({ error: `Invalid or missing ${field}` }, { status: 400 })
      }
    }

    // Validate treatment plan exists
    const planExists = await tenantDb`
      SELECT id FROM iso27001_treatment_plans WHERE id = ${Number(treatment_plan_id)}
    ` as Record<string, any>[]
    if (planExists.length === 0) {
      return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 })
    }

    // Generate control ID
    const controlIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(control_id FROM 5) AS INTEGER)), 0) + 1 as next_id
      FROM iso27001_treatment_controls
      WHERE control_id LIKE 'TC-%'
    ` as Record<string, any>[]
    const nextId = controlIdResult[0]?.next_id || 1
    const controlId = `TC-${String(nextId).padStart(4, "0")}`

    // Insert control
    const result = await tenantDb`
      INSERT INTO iso27001_treatment_controls (
        control_id, treatment_plan_id, control_title, control_description, control_type,
        control_category, implementation_status, assigned_owner, technical_contact,
        due_date, automation_level, compliance_frameworks, evidence_location, testing_procedure
      ) VALUES (
        ${controlId}, ${Number(treatment_plan_id)}, ${control_title}, ${control_description}, ${control_type},
        ${control_category || null}, 'not_started', ${assigned_owner}, ${technical_contact || null},
        ${due_date}, ${automation_level || "manual"}, ${JSON.stringify(compliance_frameworks || ["ISO 27001"])},
        ${evidence_location || null}, ${testing_procedure || null}
      )
      RETURNING *
    ` as Record<string, any>[]

    const serializedResult = {
      ...result[0],
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : null,
      due_date: result[0].due_date ? new Date(result[0].due_date).toISOString() : null,
      effectiveness_rating: Number(result[0].effectiveness_rating) || 0,
      implementation_cost: Number(result[0].implementation_cost) || 0,
      compliance_frameworks: Array.isArray(result[0].compliance_frameworks) ? result[0].compliance_frameworks : [],
    }

    return NextResponse.json(serializedResult, { status: 201 })
  } catch (error: any) {
    console.error("Error creating treatment control:", error)
    return NextResponse.json({ error: "Failed to create treatment control", details: error.message }, { status: 500 })
  }
});
