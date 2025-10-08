import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const gap = await tenantDb`
      SELECT 
        g.*,
        v.vendor_name,
        v.vendor_type,
        e.evaluation_name
      FROM third_party_gap_analysis g
      LEFT JOIN vendors v ON g.vendor_id = v.id
      LEFT JOIN third_party_risk_evaluations e ON g.evaluation_id = e.id
      WHERE g.id = ${id}
    ` as Record<string, any>[]

    if (gap.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Gap not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: gap[0],
    })
  } catch (error) {
    console.error("Error fetching gap:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gap",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()

    const result = await tenantDb`
      UPDATE third_party_gap_analysis 
      SET 
        gap_title = ${body.gap_title},
        gap_description = ${body.gap_description},
        gap_category = ${body.gap_category || "General"},
        gap_severity = ${body.gap_severity || "Medium"},
        current_state = ${body.current_state || "Not Implemented"},
        target_state = ${body.target_state || "Fully Implemented"},
        business_impact = ${body.business_impact || ""},
        priority_ranking = ${body.priority_ranking || 3},
        responsible_party = ${body.responsible_party || "Vendor"},
        target_completion_date = ${body.target_completion_date || null},
        estimated_cost = ${body.estimated_cost || 0},
        business_criticality = ${body.business_criticality || "Medium"},
        regulatory_impact = ${body.regulatory_impact || ""},
        remediation_status = ${body.remediation_status || "Identified"},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Gap not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Gap updated successfully",
    })
  } catch (error) {
    console.error("Error updating gap:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update gap",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const result = await tenantDb`
      DELETE FROM third_party_gap_analysis 
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Gap not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Gap deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting gap:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete gap",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
