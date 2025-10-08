import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const templateId = searchParams.get("templateId")

    let plans

    // Build query based on filters
    const whereConditions = ["1=1"]

    if (search) {
      whereConditions.push(`(mp.plan_name ILIKE '%${search}%' OR mp.mitigation_strategy ILIKE '%${search}%')`)
    }

    if (status && status !== "all") {
      whereConditions.push(`mp.status = '${status}'`)
    }

    if (priority && priority !== "all") {
      whereConditions.push(`mp.priority = '${priority}'`)
    }

    if (templateId && templateId !== "all") {
      whereConditions.push(`mp.template_id = ${templateId}`)
    }

    const whereClause = whereConditions.join(" AND ")

    if (format === "template") {
      // Return template with sample data
      const template = [
        {
          plan_name: "Sample Mitigation Plan",
          template_name: "Sample Risk Template",
          mitigation_strategy: "Implement comprehensive security controls and monitoring",
          status: "Planning",
          progress_percentage: 0,
          assigned_owner: "Security Team Lead",
          due_date: "2024-12-31",
          investment_amount: 50000,
          residual_risk_level: "Medium",
          priority: "High",
          notes: "Initial planning phase with stakeholder review",
        },
      ]

      return NextResponse.json({
        success: true,
        data: template,
      })
    }

    plans = await tenantDb`
      SELECT 
        mp.id,
        mp.plan_id,
        mp.plan_name,
        mp.template_id,
        mp.mitigation_strategy,
        mp.status,
        mp.progress_percentage,
        mp.assigned_owner,
        mp.due_date,
        mp.investment_amount,
        mp.residual_risk_level,
        mp.priority,
        mp.notes,
        mp.created_at,
        mp.updated_at,
        rt.template_name,
        rt.template_id as risk_template_id,
        rt.risk_level,
        f.function_code,
        f.function_name
      FROM nist_csf_mitigation_plans mp
      LEFT JOIN nist_csf_risk_templates rt ON mp.template_id = rt.id
      LEFT JOIN nist_csf_functions f ON rt.function_id = f.id
      WHERE ${tenantDb.unsafe(whereClause)}
      ORDER BY mp.created_at DESC
    ` as Record<string, any>[]

    // Format data for export
    const exportData = plans.map((plan) => ({
      plan_id: plan.plan_id,
      plan_name: plan.plan_name,
      template_name: plan.template_name || "",
      risk_template_id: plan.risk_template_id || "",
      function_code: plan.function_code || "",
      function_name: plan.function_name || "",
      mitigation_strategy: plan.mitigation_strategy,
      status: plan.status,
      progress_percentage: plan.progress_percentage,
      assigned_owner: plan.assigned_owner,
      due_date: plan.due_date ? new Date(plan.due_date).toISOString().split("T")[0] : "",
      investment_amount: plan.investment_amount,
      residual_risk_level: plan.residual_risk_level,
      priority: plan.priority,
      notes: plan.notes || "",
      created_at: plan.created_at,
      updated_at: plan.updated_at,
    }))

    return NextResponse.json({
      success: true,
      data: exportData,
    })
  } catch (error) {
    console.error("Failed to export NIST CSF mitigation plans:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export mitigation plans",
        data: [],
      },
      { status: 500 },
    )
  }
});
