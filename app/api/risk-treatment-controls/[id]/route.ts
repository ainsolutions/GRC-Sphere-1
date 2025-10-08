import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const control = await tenantDb`
      SELECT 
        rtc.*,
        rtp.plan_title as treatment_plan_title,
        rtp.plan_id as treatment_plan_id_display,
        CASE 
          WHEN rtc.next_review_date < CURRENT_DATE 
          THEN CURRENT_DATE - rtc.next_review_date 
          ELSE 0 
        END as review_overdue_days
      FROM risk_treatment_controls rtc
      LEFT JOIN risk_treatment_plans rtp ON rtc.treatment_plan_id = rtp.id
      WHERE rtc.id = ${params.id}
    ` as Record<string, any>[]

    if (control.length === 0) {
      return NextResponse.json({ error: "Risk treatment control not found" }, { status: 404 })
    }

    return NextResponse.json(control[0])
  } catch (error) {
    console.error("Error fetching risk treatment control:", error)
    return NextResponse.json({ error: "Failed to fetch risk treatment control" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()

    const {
      control_title,
      control_description,
      control_type,
      control_category,
      implementation_status,
      effectiveness_rating,
      implementation_cost,
      maintenance_cost_annual,
      assigned_owner,
      technical_contact,
      implementation_date,
      testing_date,
      next_review_date,
      automation_level,
      compliance_frameworks,
      evidence_location,
      testing_procedure,
      remediation_notes,
    } = body

    const result = await tenantDb`
      UPDATE risk_treatment_controls SET
        control_title = ${control_title},
        control_description = ${control_description},
        control_type = ${control_type},
        control_category = ${control_category},
        implementation_status = ${implementation_status},
        effectiveness_rating = ${effectiveness_rating},
        implementation_cost = ${implementation_cost},
        maintenance_cost_annual = ${maintenance_cost_annual},
        assigned_owner = ${assigned_owner},
        technical_contact = ${technical_contact},
        implementation_date = ${implementation_date},
        testing_date = ${testing_date},
        next_review_date = ${next_review_date},
        automation_level = ${automation_level},
        compliance_frameworks = ${compliance_frameworks},
        evidence_location = ${evidence_location},
        testing_procedure = ${testing_procedure},
        remediation_notes = ${remediation_notes},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk treatment control not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating risk treatment control:", error)
    return NextResponse.json({ error: "Failed to update risk treatment control" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      DELETE FROM risk_treatment_controls 
      WHERE id = ${params.id}
      RETURNING control_id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk treatment control not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Risk treatment control deleted successfully",
      deleted_control_id: result[0].control_id,
    })
  } catch (error) {
    console.error("Error deleting risk treatment control:", error)
    return NextResponse.json({ error: "Failed to delete risk treatment control" }, { status: 500 })
  }
});
