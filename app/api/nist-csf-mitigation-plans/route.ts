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
    const templateId = searchParams.get("templateId")
    const offset = (page - 1) * limit

    const whereConditions = ["1=1"]

    if (search) {
      whereConditions.push(`(mp.plan_name ILIKE '%${search}%' OR mp.mitigation_strategy ILIKE '%${search}%')`)
    }

    if (status && status !== "all") {
      whereConditions.push(`mp.status = '${status}'`)
    }

    if (priority && priority !== "all") {
      whereConditions.push(`mp.priority = '${priority}'`)
    }

    if (templateId && templateId !== "all") {
      whereConditions.push(`mp.template_id = ${templateId}`)
    }

    const whereClause = whereConditions.join(" AND ")

    // Get total count
    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM nist_csf_mitigation_plans mp
      LEFT JOIN nist_csf_risk_templates rt ON mp.template_id = rt.id
      WHERE ${tenantDb.unsafe(whereClause)}
    ` as Record<string, string>[]

    // Get paginated results with template information
    const plans = await tenantDb`
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
      WHERE ${tenantDb.unsafe(whereClause)}
      ORDER BY mp.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const total = Number.parseInt(countResult[0].total)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        plans,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching NIST CSF mitigation plans:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mitigation plans",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { plan_name, template_id, mitigation_strategy, assigned_owner, due_date, investment_amount, priority, notes, start_date } =
      body

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
      ` as Record<string, number>[]

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

    // Generate plan ID
    const planCount = await tenantDb`SELECT COUNT(*) as count FROM nist_csf_mitigation_plans` as Record<string, string>[]
    const planId = `NIST-MIT-${String(Number(planCount[0].count) + 1).padStart(4, "0")}`

    // Validate status value
    const validStatuses = ["Planning", "In Progress", "Completed", "On Hold"]
    const status = "Planning" // Default status for new plans

    // Validate priority value
    const validPriorities = ["Critical", "High", "Medium", "Low"]
    const planPriority = validPriorities.includes(priority) ? priority : "Medium"

    const plan = await tenantDb`
      INSERT INTO nist_csf_mitigation_plans (
        plan_id,
        plan_name,
        template_id,
        mitigation_strategy,
        status,
        progress_percentage,
        assigned_owner,
        due_date,
        investment_amount,
        residual_risk_level,
        priority,
        notes,
        start_date
      ) VALUES (
        ${planId},
        ${plan_name},
        ${template_id || null},
        ${mitigation_strategy},
        ${status},
        0,
        ${assigned_owner},
        ${due_date || null},
        ${investment_amount || 0},
        'Medium',
        ${planPriority},
        ${notes || ""},
        ${start_date || null}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: plan[0],
      message: "Mitigation plan created successfully",
    })
  } catch (error) {
    console.error("Error creating NIST CSF mitigation plan:", error)

    // Check if it's a constraint violation
    if (error instanceof Error && error.message.includes("check constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status or priority value. Please check your input.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create mitigation plan",
      },
      { status: 500 },
    )
  }
});
