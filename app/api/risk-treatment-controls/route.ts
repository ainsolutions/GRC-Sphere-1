import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const treatmentPlanId = searchParams.get("treatment_plan_id")
    const status = searchParams.get("status")
    const owner = searchParams.get("owner")
    const controlType = searchParams.get("control_type")

    let query = `
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
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (treatmentPlanId) {
      query += ` AND rtc.treatment_plan_id = $${paramIndex}`
      params.push(treatmentPlanId)
      paramIndex++
    }

    if (status) {
      query += ` AND rtc.implementation_status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (owner) {
      query += ` AND rtc.assigned_owner ILIKE $${paramIndex}`
      params.push(`%${owner}%`)
      paramIndex++
    }

    if (controlType) {
      query += ` AND rtc.control_type = $${paramIndex}`
      params.push(controlType)
      paramIndex++
    }

    query += ` ORDER BY rtc.next_review_date ASC, rtc.implementation_status ASC`

    const controls = await tenantDb`${tenantDb.unsafe(query)}`
    return NextResponse.json(controls)
  } catch (error) {
    console.error("Error fetching risk treatment controls:", error)
    return NextResponse.json({ error: "Failed to fetch risk treatment controls" }, { status: 500 })
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
    } = body

    const result = await tenantDb`
      INSERT INTO risk_treatment_controls (
        treatment_plan_id, control_title, control_description, control_type, control_category,
        implementation_status, effectiveness_rating, implementation_cost, maintenance_cost_annual,
        assigned_owner, technical_contact, implementation_date, testing_date, next_review_date,
        automation_level, compliance_frameworks, evidence_location, testing_procedure,
        created_at, updated_at
      ) VALUES (
        ${treatment_plan_id}, ${control_title}, ${control_description}, ${control_type}, ${control_category},
        ${implementation_status}, ${effectiveness_rating}, ${implementation_cost}, ${maintenance_cost_annual},
        ${assigned_owner}, ${technical_contact}, ${implementation_date}, ${testing_date}, ${next_review_date},
        ${automation_level}, ${compliance_frameworks}, ${evidence_location}, ${testing_procedure},
        NOW(), NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating risk treatment control:", error)
    return NextResponse.json({ error: "Failed to create risk treatment control" }, { status: 500 })
  }
});
