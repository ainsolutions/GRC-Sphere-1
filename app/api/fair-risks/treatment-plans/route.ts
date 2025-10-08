import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb}: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "50"
    const offset = searchParams.get("offset") || "0"

    const limitNum = Number.parseInt(limit, 10)
    const offsetNum = Number.parseInt(offset, 10)

    // Get treatment plans
    const plans = await tenantDb`
      SELECT 
        id,
        fair_risk_id,
        risk_id,
        asset_name,
        threat_event,
        treatment_type,
        treatment_strategy,
        estimated_cost,
        expected_risk_reduction,
        approval_status,
        approved_by,
        approved_date,
        implementation_status,
        progress_percentage,
        start_date,
        target_completion_date,
        actual_completion_date,
        owner,
        assigned_to,
        controls_count,
        implemented_controls,
        created_at,
        updated_at
      FROM fair_risk_treatment_plans
      ORDER BY created_at DESC 
      LIMIT ${limitNum} 
      OFFSET ${offsetNum}
    ` as Record<string, any>[]

    // Get treatment stats
    const statsResult = await tenantDb`
      SELECT 
        COUNT(*) as total_plans,
        COUNT(CASE WHEN approval_status = 'approved' THEN 1 END) as approved_plans,
        COUNT(CASE WHEN approval_status = 'pending' THEN 1 END) as pending_approval,
        COUNT(CASE WHEN implementation_status = 'completed' THEN 1 END) as implemented_plans,
        COALESCE(SUM(estimated_cost), 0) as total_investment,
        COALESCE(AVG(expected_risk_reduction), 0) as average_risk_reduction
      FROM fair_risk_treatment_plans
    ` as Record<string, any>[]

    const stats = {
      total_plans: Number(statsResult[0]?.total_plans || 0),
      approved_plans: Number(statsResult[0]?.approved_plans || 0),
      pending_approval: Number(statsResult[0]?.pending_approval || 0),
      implemented_plans: Number(statsResult[0]?.implemented_plans || 0),
      total_investment: Number(statsResult[0]?.total_investment || 0),
      average_risk_reduction: Number(statsResult[0]?.average_risk_reduction || 0),
    }

    // Serialize the plans
    const serializedPlans = plans.map((plan: any) => ({
      ...plan,
      id: Number(plan.id),
      fair_risk_id: Number(plan.fair_risk_id),
      estimated_cost: Number(plan.estimated_cost) || 0,
      expected_risk_reduction: Number(plan.expected_risk_reduction) || 0,
      progress_percentage: Number(plan.progress_percentage) || 0,
      controls_count: Number(plan.controls_count) || 0,
      implemented_controls: Number(plan.implemented_controls) || 0,
      created_at: plan.created_at ? new Date(plan.created_at).toISOString() : null,
      updated_at: plan.updated_at ? new Date(plan.updated_at).toISOString() : null,
      approved_date: plan.approved_date ? new Date(plan.approved_date).toISOString() : null,
      start_date: plan.start_date ? new Date(plan.start_date).toISOString() : null,
      target_completion_date: plan.target_completion_date ? new Date(plan.target_completion_date).toISOString() : null,
      actual_completion_date: plan.actual_completion_date ? new Date(plan.actual_completion_date).toISOString() : null,
    }))

    return NextResponse.json({
      plans: serializedPlans,
      stats: stats,
    })
  } catch (error: any) {
    console.error("Error fetching treatment plans:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch treatment plans",
        details: error.message,
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb}: HttpSessionContext, request) => {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.fair_risk_id || !body.treatment_type || !body.owner) {
      return NextResponse.json(
        {
          error: "Missing required fields: fair_risk_id, treatment_type, owner",
        },
        { status: 400 },
      )
    }

    // Get risk information
    const riskResult = await tenantDb`
      SELECT risk_id, risk_title, asset_id 
      FROM fair_risks 
      WHERE id = ${body.fair_risk_id}
    ` as Record<string, any>[]

    if (riskResult.length === 0) {
      return NextResponse.json({ error: "FAIR risk not found" }, { status: 404 })
    }

    const risk = riskResult[0]

    const result = await tenantDb`
      INSERT INTO fair_risk_treatment_plans (
        fair_risk_id,
        risk_id,
        asset_name,
        threat_event,
        treatment_type,
        treatment_strategy,
        estimated_cost,
        expected_risk_reduction,
        approval_status,
        implementation_status,
        progress_percentage,
        start_date,
        target_completion_date,
        owner,
        assigned_to,
        controls_count,
        implemented_controls,
        created_at,
        updated_at
      ) VALUES (
        ${body.fair_risk_id},
        ${risk.risk_id},
        ${risk.asset_id || "Unknown Asset"},
        ${risk.risk_title || "Unknown Threat Event"},
        ${body.treatment_type},
        ${body.treatment_strategy || null},
        ${body.estimated_cost || 0},
        ${body.expected_risk_reduction || 0},
        ${body.approval_status || "pending"},
        ${body.implementation_status || "not_started"},
        ${body.progress_percentage || 0},
        ${body.start_date || null},
        ${body.target_completion_date || null},
        ${body.owner},
        ${body.assigned_to || null},
        ${body.controls_count || 0},
        ${body.implemented_controls || 0},
        NOW(),
        NOW()
      )
      RETURNING 
        id,
        fair_risk_id,
        risk_id,
        asset_name,
        threat_event,
        treatment_type,
        treatment_strategy,
        estimated_cost,
        expected_risk_reduction,
        approval_status,
        approved_by,
        approved_date,
        implementation_status,
        progress_percentage,
        start_date,
        target_completion_date,
        actual_completion_date,
        owner,
        assigned_to,
        controls_count,
        implemented_controls,
        created_at,
        updated_at
    ` as Record<string, any>[]

    // Serialize the response
    const serializedResult = {
      ...result[0],
      id: Number(result[0].id),
      fair_risk_id: Number(result[0].fair_risk_id),
      estimated_cost: Number(result[0].estimated_cost) || 0,
      expected_risk_reduction: Number(result[0].expected_risk_reduction) || 0,
      progress_percentage: Number(result[0].progress_percentage) || 0,
      controls_count: Number(result[0].controls_count) || 0,
      implemented_controls: Number(result[0].implemented_controls) || 0,
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : null,
      approved_date: result[0].approved_date ? new Date(result[0].approved_date).toISOString() : null,
      start_date: result[0].start_date ? new Date(result[0].start_date).toISOString() : null,
      target_completion_date: result[0].target_completion_date
        ? new Date(result[0].target_completion_date).toISOString()
        : null,
      actual_completion_date: result[0].actual_completion_date
        ? new Date(result[0].actual_completion_date).toISOString()
        : null,
    }

    return NextResponse.json(serializedResult, { status: 201 })
  } catch (error: any) {
    console.error("Error creating treatment plan:", error)
    return NextResponse.json(
      {
        error: "Failed to create treatment plan",
        details: error.message,
      },
      { status: 500 },
    )
  }
});
