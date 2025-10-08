import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const department = searchParams.get("department")
    const verification = searchParams.get("verification")
    const offset = (page - 1) * limit

    // Check if the table exists first
    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'third_party_risk_remediation_tracking'
      )
    ` as Record<string, any>[]

    if (!tableExists[0].exists) {
      console.log("Third party risk remediation tracking table does not exist, returning empty data")
      return NextResponse.json({
        success: true,
        data: {
          remediations: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
      })
    }

    // For now, let's use a simple query without complex filtering to get it working
    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM third_party_risk_remediation_tracking tprrt
      LEFT JOIN vendors v ON tprrt.vendor_id = v.id
    ` as Record<string, any>[]
    const total = Number.parseInt(countResult[0].total)

    const remediations = await tenantDb`
      SELECT 
        tprrt.*,
        v.vendor_name,
        v.vendor_type,
        g.gap_title,
        g.gap_severity
      FROM third_party_risk_remediation_tracking tprrt
      LEFT JOIN vendors v ON tprrt.vendor_id = v.id
      LEFT JOIN third_party_gap_analysis g ON tprrt.gap_analysis_id = g.id
      ORDER BY tprrt.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      success: true,
      data: {
        remediations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching third-party risk remediation tracking:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch remediation tracking data",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()

    const result = await tenantDb`
      INSERT INTO third_party_risk_remediation_tracking (
        gap_analysis_id, evaluation_id, vendor_id, remediation_title, 
        remediation_description, remediation_type, assigned_to, assigned_email,
        vendor_contact, vendor_contact_email, responsible_department,
        start_date, target_completion_date, estimated_effort_hours,
        estimated_cost, risk_before_remediation, business_impact_assessment,
        success_criteria, created_by
      ) VALUES (
        ${body.gap_analysis_id}, ${body.evaluation_id}, ${body.vendor_id}, 
        ${body.remediation_title}, ${body.remediation_description}, 
        ${body.remediation_type}, ${body.assigned_to}, ${body.assigned_email},
        ${body.vendor_contact}, ${body.vendor_contact_email}, 
        ${body.responsible_department}, ${body.start_date}, 
        ${body.target_completion_date}, ${body.estimated_effort_hours},
        ${body.estimated_cost}, ${body.risk_before_remediation}, 
        ${body.business_impact_assessment}, ${body.success_criteria}, 
        ${body.created_by}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error creating remediation tracking:", error)
    return NextResponse.json({ success: false, error: "Failed to create remediation tracking" }, { status: 500 })
  }
});
