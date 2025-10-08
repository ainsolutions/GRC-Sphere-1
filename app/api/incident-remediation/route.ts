import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const department = searchParams.get("department")
    const verification = searchParams.get("verification")
    const incident_id = searchParams.get("incident_id")

    const offset = (page - 1) * limit

    const whereConditions = []

    if (search) {
      whereConditions.push(
        `(irt.remediation_title ILIKE '%${search}%' OR irt.remediation_description ILIKE '%${search}%' OR irt.remediation_id ILIKE '%${search}%')`,
      )
    }

    if (status && status !== "all") {
      whereConditions.push(`irt.status = '${status}'`)
    }

    if (priority && priority !== "all") {
      whereConditions.push(`irt.priority = '${priority}'`)
    }

    if (department && department !== "all") {
      whereConditions.push(`irt.responsible_department = '${department}'`)
    }

    if (verification && verification !== "all") {
      whereConditions.push(`irt.verification_status = '${verification}'`)
    }

    if (incident_id) {
      whereConditions.push(`i.incident_id = '${incident_id}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count
    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM incident_remediation_tracking irt
      LEFT JOIN incidents i ON irt.incident_id = i.incident_id
      ${tenantDb.unsafe(whereClause)}
    ` as Record<string, string>[]
    const total = Number.parseInt(countResult[0].total)

    // Get paginated data
    const remediations = await tenantDb`
      SELECT 
        irt.*,
        i.incident_id as incident_identifier,
        i.incident_title,
        i.incident_type,
        i.severity as incident_severity,
        CASE 
          WHEN irt.target_completion_date < CURRENT_DATE AND irt.status NOT IN ('Completed', 'Verified') 
          THEN true 
          ELSE false 
        END as is_overdue
      FROM incident_remediation_tracking irt
      LEFT JOIN incidents i ON irt.incident_id = i.incident_id
      ${tenantDb.unsafe(whereClause)}
      ORDER BY 
        CASE irt.priority 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
        END,
        irt.target_completion_date ASC NULLS LAST,
        irt.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      success: true,
      data: remediations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching incident remediations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch incident remediations" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const formData = await request.formData()

    const incident_id = formData.get("incident_id") as string
    const action_taken = formData.get("action_taken") as string
    const action_date = formData.get("action_date") as string
    const estimated_cost = formData.get("estimated_cost") as string
    const actual_cost = formData.get("actual_cost") as string
    const target_resolution_date = formData.get("target_resolution_date") as string
    const actual_resolution_date = formData.get("actual_resolution_date") as string
    const root_cause = formData.get("root_cause") as string
    const lessons_learned = formData.get("lessons_learned") as string
    const risk_id = formData.get("risk_id") as string
    const remediation_type = (formData.get("remediation_type") as string) || "Root Cause Fix"
    const evidence_file = formData.get("evidence_file") as File | null

    // Validate required fields
    if (!incident_id || !action_taken || !action_date) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: incident_id, action_taken, action_date" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO incident_remediation_tracking (
        incident_id, remediation_title, remediation_description, remediation_type,
        priority, assigned_to, responsible_department, start_date, target_completion_date,
        estimated_cost, risk_before_remediation, business_impact_assessment, success_criteria,
        created_by, status
      ) VALUES (
        ${incident_id}, 
        ${"Incident Remediation Action"}, 
        ${action_taken}, 
        ${remediation_type},
        ${"Medium"}, 
        ${"System"}, 
        ${"IT Security"}, 
        ${action_date}, 
        ${target_resolution_date || null},
        ${estimated_cost ? Number.parseFloat(estimated_cost) : null}, 
        ${"Medium"}, 
        ${root_cause || "Root cause analysis pending"}, 
        ${lessons_learned || "Success criteria to be defined"},
        ${"System"}, 
        ${"Open"}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Incident remediation created successfully",
    })
  } catch (error) {
    console.error("Error creating incident remediation:", error)
    return NextResponse.json({ success: false, error: "Failed to create incident remediation" }, { status: 500 })
  }
});
