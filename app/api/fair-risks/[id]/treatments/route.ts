import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const treatmentPlans = await tenantDb`
      SELECT 
        ftp.*,
        COUNT(ftc.id) as total_controls,
        COUNT(CASE WHEN ftc.implementation_status = 'completed' THEN 1 END) as completed_controls,
        COUNT(CASE WHEN ftc.aging_status = 'overdue' THEN 1 END) as overdue_controls,
        AVG(CASE WHEN ftc.progress_percentage IS NOT NULL THEN ftc.progress_percentage ELSE 0 END) as avg_progress
      FROM fair_risk_treatment_plans ftp
      LEFT JOIN fair_risk_treatment_controls ftc ON ftp.id = ftc.treatment_plan_id
      WHERE ftp.fair_risk_id = ${id}
      GROUP BY ftp.id
      ORDER BY ftp.created_at DESC
    `

    return NextResponse.json(treatmentPlans)
  } catch (error) {
    console.error("Error fetching treatment plans:", error)
    return NextResponse.json({ error: "Failed to fetch treatment plans" }, { status: 500 })
  }
});

export const POST = withContext(async ({ tenantDb }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()

    const result = await tenantDb`
      INSERT INTO fair_risk_treatment_plans (
        fair_risk_id, treatment_type, treatment_strategy, business_justification,
        cost_estimate, expected_risk_reduction
      ) VALUES (
        ${id}, ${body.treatment_type}, ${body.treatment_strategy}, ${body.business_justification},
        ${body.cost_estimate}, ${body.expected_risk_reduction}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating treatment plan:", error)
    return NextResponse.json({ error: "Failed to create treatment plan" }, { status: 500 })
  }
});
