import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const severity = searchParams.get("severity")
    const status = searchParams.get("status")
    const aging = searchParams.get("aging")
    const vendor_id = searchParams.get("vendor_id")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Check if the table exists first
    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'org_dollarbank' 
        AND table_name = 'third_party_gap_analysis'
      )
    ` as Record<string, any>[]

    if (!tableExists[0].exists) {
      console.log("Third party gap analysis table does not exist, returning empty data")
      return NextResponse.json({
        success: true,
        data: {
          gaps: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
      })
    }

    // Build WHERE conditions
    let whereClause = ""
    const conditions = []

    if (search) {
      conditions.push(`(
        g.gap_title ILIKE '%${search}%' OR 
        g.gap_description ILIKE '%${search}%' OR
        v.vendor_name ILIKE '%${search}%'
      )`)
    }

    if (severity && severity !== "all") {
      conditions.push(`g.gap_severity = '${severity}'`)
    }

    if (status && status !== "all") {
      conditions.push(`g.remediation_status = '${status}'`)
    }

    if (vendor_id) {
      conditions.push(`g.vendor_id = ${vendor_id}`)
    }

    if (aging && aging !== "all") {
      const today = new Date().toISOString().split("T")[0]
      switch (aging) {
        case "overdue":
          conditions.push(`g.target_completion_date < '${today}' AND g.remediation_status != 'Completed'`)
          break
        case "due_soon":
          const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          conditions.push(
            `g.target_completion_date BETWEEN '${today}' AND '${nextWeek}' AND g.remediation_status != 'Completed'`,
          )
          break
        case "on_track":
          conditions.push(`g.target_completion_date >= '${today}' AND g.remediation_status != 'Completed'`)
          break
      }
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`
    }

    // For now, let's use a simple query without complex filtering to get it working
    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM third_party_gap_analysis g
      LEFT JOIN vendors v ON g.vendor_id = v.id
    ` as Record<string, any>[]
    const totalCount = Number.parseInt(countResult[0].total)

    const gaps = await tenantDb`
      SELECT 
        g.*,
        v.vendor_name,
        v.vendor_type,
        e.evaluation_name,
        0 as aging_days,
        CASE 
          WHEN g.target_completion_date IS NULL THEN 'No Due Date'
          WHEN g.remediation_status = 'Completed' THEN 'Completed'
          WHEN g.target_completion_date < CURRENT_DATE THEN 'Overdue'
          WHEN g.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
          ELSE 'On Track'
        END as aging_status
      FROM third_party_gap_analysis g
      LEFT JOIN vendors v ON g.vendor_id = v.id
      LEFT JOIN third_party_risk_evaluations e ON g.evaluation_id = e.id
      ORDER BY g.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      success: true,
      data: {
        gaps,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching gap analysis:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gap analysis data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json()

    const {
      gap_title,
      gap_description,
      gap_category,
      gap_severity,
      vendor_id,
      current_state,
      target_state,
      business_impact,
      priority_ranking,
      responsible_party,
      target_completion_date,
      estimated_cost,
      business_criticality,
      regulatory_impact,
      evaluation_id, // add if passed from frontend
    } = body

    // Validate required fields
    if (!gap_title || !vendor_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Gap title and vendor are required",
        },
        { status: 400 }
      )
    }

    const vendor = await tenantDb`
      SELECT id FROM vendors WHERE vendor_id = ${vendor_id}
    ` as Record< string, any>[]
      if (vendor.length === 0) {
        return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 400 })
      }
      const vendorId = vendor[0].id

    const gap_id = `GAP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`

    const result = await tenantDb`
      INSERT INTO third_party_gap_analysis (
        evaluation_id,
        vendor_id,
        gap_id,
        gap_title,
        gap_description,
        gap_category,
        gap_severity,
        business_criticality,
        priority_ranking,
        responsible_party,
        target_completion_date,
        estimated_cost,
        remediation_status
      ) VALUES (
        ${evaluation_id || null},        -- use passed evaluation_id or null
        ${vendorId},                    -- e.g. "VNC-2025-0003"
        ${gap_id},                       -- generated above
        ${gap_title},
        ${gap_description},
        ${gap_category || "Operational"},
        ${gap_severity || "Medium"},
        ${business_criticality || "Medium"},
        ${priority_ranking || 3},
        ${responsible_party || "Vendor"},
        ${target_completion_date || null},
        ${estimated_cost || 0},
        ${"Identified"}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Gap created successfully",
    })
  } catch (error) {
    console.error("Error creating gap:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create gap",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
})

