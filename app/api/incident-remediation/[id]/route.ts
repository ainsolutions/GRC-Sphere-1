import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb } ,request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)

    const result = await tenantDb`
      SELECT 
        irt.*,
        i.incident_title,
        i.incident_type,
        i.severity as incident_severity,
        i.status as incident_status
      FROM incident_remediation_tracking irt
      LEFT JOIN incidents i ON irt.incident_id = i.incident_id
      WHERE irt.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Incident remediation not found" }, { status: 404 })
    }

    // Get updates for this remediation
    const updates = await tenantDb`
      SELECT *
      FROM incident_remediation_updates
      WHERE remediation_id = ${id}
      ORDER BY update_date DESC
    `

    // Get dependencies
    const dependencies = await tenantDb`
      SELECT 
        ird.*,
        irt.remediation_title as dependent_title,
        irt.status as dependent_status
      FROM incident_remediation_dependencies ird
      JOIN incident_remediation_tracking irt ON ird.dependent_remediation_id = irt.id
      WHERE ird.remediation_id = ${id}
    `

    return NextResponse.json({
      success: true,
      data: {
        remediation: result[0],
        updates,
        dependencies,
      },
    })
  } catch (error) {
    console.error("Error fetching incident remediation:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch incident remediation" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const {
      remediation_title,
      remediation_description,
      remediation_type,
      status,
      priority,
      assigned_to,
      assigned_email,
      responsible_department,
      responsible_manager,
      start_date,
      target_completion_date,
      actual_completion_date,
      progress_percentage,
      estimated_effort_hours,
      actual_effort_hours,
      estimated_cost,
      actual_cost,
      risk_before_remediation,
      risk_after_remediation,
      business_impact_assessment,
      verification_status,
      verification_date,
      verified_by,
      verification_method,
      verification_evidence,
      success_criteria,
      effectiveness_rating,
      lessons_learned,
      updated_by,
    } = body

    const result = await tenantDb`
      UPDATE incident_remediation_tracking
      SET 
        remediation_title = ${remediation_title},
        remediation_description = ${remediation_description},
        remediation_type = ${remediation_type},
        status = ${status},
        priority = ${priority},
        assigned_to = ${assigned_to},
        assigned_email = ${assigned_email},
        responsible_department = ${responsible_department},
        responsible_manager = ${responsible_manager},
        start_date = ${start_date || null},
        target_completion_date = ${target_completion_date || null},
        actual_completion_date = ${actual_completion_date || null},
        progress_percentage = ${progress_percentage || 0},
        estimated_effort_hours = ${estimated_effort_hours || null},
        actual_effort_hours = ${actual_effort_hours || null},
        estimated_cost = ${estimated_cost || null},
        actual_cost = ${actual_cost || null},
        risk_before_remediation = ${risk_before_remediation},
        risk_after_remediation = ${risk_after_remediation || null},
        business_impact_assessment = ${business_impact_assessment},
        verification_status = ${verification_status},
        verification_date = ${verification_date || null},
        verified_by = ${verified_by || null},
        verification_method = ${verification_method || null},
        verification_evidence = ${verification_evidence || null},
        success_criteria = ${success_criteria},
        effectiveness_rating = ${effectiveness_rating || null},
        lessons_learned = ${lessons_learned || null},
        updated_by = ${updated_by}
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Incident remediation not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Incident remediation updated successfully",
    })
  } catch (error) {
    console.error("Error updating incident remediation:", error)
    return NextResponse.json({ success: false, error: "Failed to update incident remediation" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)

    const result = await tenantDb`
      DELETE FROM incident_remediation_tracking
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Incident remediation not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Incident remediation deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting incident remediation:", error)
    return NextResponse.json({ success: false, error: "Failed to delete incident remediation" }, { status: 500 })
  }
});
