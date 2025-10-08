import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"



export const GET = withContext(async({ tenantDb }) => {
  try {
    const remediations = await tenantDb`
      SELECT 
        mr.*,
        COUNT(mri.id) as total_items,
        COUNT(CASE WHEN mri.status = 'completed' THEN 1 END) as completed_items,
        COUNT(CASE WHEN mri.status = 'in_progress' THEN 1 END) as in_progress_items,
        COUNT(CASE WHEN mri.status = 'not_started' THEN 1 END) as not_started_items,
        COUNT(CASE WHEN mri.status = 'overdue' THEN 1 END) as overdue_items,
        SUM(mri.estimated_cost) as total_estimated_cost,
        SUM(mri.actual_cost) as total_actual_cost
      FROM mica_remediation mr
      LEFT JOIN mica_remediation_items mri ON mr.id = mri.remediation_id
      GROUP BY mr.id
      ORDER BY mr.created_at DESC
    `

    return NextResponse.json(remediations)
  } catch (error) {
    console.error("Error fetching MICA remediations:", error)
    return NextResponse.json({ error: "Failed to fetch MICA remediations" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      plan_name,
      description,
      gap_analysis_id,
      owner_name,
      owner_email,
      target_completion_date,
      budget_allocated,
      priority_level,
    } = body

    const result = await tenantDb`
      INSERT INTO mica_remediation (
        plan_name,
        description,
        gap_analysis_id,
        owner_name,
        owner_email,
        target_completion_date,
        budget_allocated,
        priority_level,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${plan_name},
        ${description},
        ${gap_analysis_id},
        ${owner_name},
        ${owner_email},
        ${target_completion_date},
        ${budget_allocated},
        ${priority_level},
        'active',
        NOW(),
        NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating MICA remediation plan:", error)
    return NextResponse.json({ error: "Failed to create MICA remediation plan" }, { status: 500 })
  }
});
