import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      SELECT 
        tprrt.*,
        v.name as vendor_name,
        v.type as vendor_type,
        ga.gap_title,
        ga.gap_description
      FROM third_party_risk_remediation_tracking tprrt
      LEFT JOIN vendors v ON tprrt.vendor_id = v.id
      LEFT JOIN third_party_gap_analysis ga ON tprrt.gap_analysis_id = ga.id
      WHERE tprrt.id = ${params.id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Remediation tracking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error fetching remediation tracking:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch remediation tracking" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()

    const result = await tenantDb`
      UPDATE third_party_risk_remediation_tracking 
      SET 
        remediation_title = ${body.remediation_title},
        remediation_description = ${body.remediation_description},
        remediation_type = ${body.remediation_type},
        assigned_to = ${body.assigned_to},
        assigned_email = ${body.assigned_email},
        vendor_contact = ${body.vendor_contact},
        vendor_contact_email = ${body.vendor_contact_email},
        responsible_department = ${body.responsible_department},
        start_date = ${body.start_date},
        target_completion_date = ${body.target_completion_date},
        actual_completion_date = ${body.actual_completion_date},
        progress_percentage = ${body.progress_percentage},
        status = ${body.status},
        estimated_effort_hours = ${body.estimated_effort_hours},
        actual_effort_hours = ${body.actual_effort_hours},
        estimated_cost = ${body.estimated_cost},
        actual_cost = ${body.actual_cost},
        risk_before_remediation = ${body.risk_before_remediation},
        risk_after_remediation = ${body.risk_after_remediation},
        business_impact_assessment = ${body.business_impact_assessment},
        success_criteria = ${body.success_criteria},
        verification_method = ${body.verification_method},
        verification_status = ${body.verification_status},
        verification_date = ${body.verification_date},
        verified_by = ${body.verified_by},
        verification_evidence = ${body.verification_evidence},
        closure_notes = ${body.closure_notes},
        last_update_date = CURRENT_DATE,
        updated_by = ${body.updated_by},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Remediation tracking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error updating remediation tracking:", error)
    return NextResponse.json({ success: false, error: "Failed to update remediation tracking" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      DELETE FROM third_party_risk_remediation_tracking 
      WHERE id = ${params.id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Remediation tracking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Remediation tracking deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting remediation tracking:", error)
    return NextResponse.json({ success: false, error: "Failed to delete remediation tracking" }, { status: 500 })
  }
});
