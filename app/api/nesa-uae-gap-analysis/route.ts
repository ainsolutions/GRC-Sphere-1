import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}, request) => {
  try {
    const result = await tenantDb`
      SELECT 
        ga.*,
        nr.control_name,
        nr.control_reference,
        nr.sub_control_name,
        nr.sub_control_reference,
        nr.control_description,
        nr.sub_control_description,
        nr.priority,
        nr.implementation_guidance
      FROM nesa_uae_gap_analysis ga
      LEFT JOIN nesa_uae_requirements nr ON ga.nesa_control_id = nr.id
      ORDER BY ga.created_at DESC
    ` as Record<string, any>[]

    // Transform the data to include nested nesa_control object
    const transformedData = result.map((row: any) => ({
      id: row.id,
      nesa_control_id: row.nesa_control_id,
      existing_control: row.existing_control,
      control_owner: row.control_owner,
      political_procedure_control: row.political_procedure_control,
      initial_control_maturity: row.initial_control_maturity,
      gap_description: row.gap_description,
      financial_action: row.financial_action,
      target_control_maturity: row.target_control_maturity,
      action_owner: row.action_owner,
      reviewer: row.reviewer,
      status: row.status,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      nesa_control: {
        id: row.nesa_control_id,
        control_name: row.control_name,
        control_reference: row.control_reference,
        sub_control_name: row.sub_control_name,
        sub_control_reference: row.sub_control_reference,
        control_description: row.control_description,
        sub_control_description: row.sub_control_description,
        priority: row.priority,
        implementation_guidance: row.implementation_guidance,
      },
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching gap analysis entries:", error)
    return NextResponse.json({ error: "Failed to fetch gap analysis entries" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      nesa_control_id,
      existing_control,
      control_owner,
      political_procedure_control,
      initial_control_maturity,
      gap_description,
      financial_action,
      target_control_maturity,
      action_owner,
      reviewer,
      status,
      notes,
    } = body

    // Validate required fields
    if (!nesa_control_id || !initial_control_maturity || !target_control_maturity) {
      return NextResponse.json(
        { error: "Missing required fields: nesa_control_id, initial_control_maturity, target_control_maturity" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO nesa_uae_gap_analysis (
        nesa_control_id,
        existing_control,
        control_owner,
        political_procedure_control,
        initial_control_maturity,
        gap_description,
        financial_action,
        target_control_maturity,
        action_owner,
        reviewer,
        status,
        notes
      ) VALUES (
        ${nesa_control_id},
        ${existing_control || null},
        ${control_owner || null},
        ${political_procedure_control || null},
        ${initial_control_maturity},
        ${gap_description || null},
        ${financial_action || null},
        ${target_control_maturity},
        ${action_owner || null},
        ${reviewer || null},
        ${status || "Not Started"},
        ${notes || null}
      )
      RETURNING *
    ` as Record<string, any>[]

    // Log the creation for audit purposes
    try {
      await tenantDb`
        INSERT INTO audit_logs (
          table_name,
          operation,
          record_id,
          new_values,
          user_id,
          timestamp
        ) VALUES (
          'nesa_uae_gap_analysis',
          'INSERT',
          ${result[0].id},
          ${JSON.stringify(body)},
          'system',
          CURRENT_TIMESTAMP
        )
      `
    } catch (auditError) {
      console.warn("Failed to log audit entry:", auditError)
      // Continue execution even if audit logging fails
    }

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error creating gap analysis entry:", error)
    return NextResponse.json({ error: "Failed to create gap analysis entry" }, { status: 500 })
  }
});
