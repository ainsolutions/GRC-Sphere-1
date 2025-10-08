import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

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
      WHERE ga.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Gap analysis entry not found" }, { status: 404 })
    }

    const row = result[0]
    const transformedData = {
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
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching gap analysis entry:", error)
    return NextResponse.json({ error: "Failed to fetch gap analysis entry" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
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
      UPDATE nesa_uae_gap_analysis 
      SET 
        nesa_control_id = ${nesa_control_id},
        existing_control = ${existing_control || null},
        control_owner = ${control_owner || null},
        political_procedure_control = ${political_procedure_control || null},
        initial_control_maturity = ${initial_control_maturity},
        gap_description = ${gap_description || null},
        financial_action = ${financial_action || null},
        target_control_maturity = ${target_control_maturity},
        action_owner = ${action_owner || null},
        reviewer = ${reviewer || null},
        status = ${status || "Not Started"},
        notes = ${notes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Gap analysis entry not found" }, { status: 404 })
    }

    // Log the update for audit purposes
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
          'UPDATE',
          ${id},
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
    console.error("Error updating gap analysis entry:", error)
    return NextResponse.json({ error: "Failed to update gap analysis entry" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const result = await tenantDb`
      DELETE FROM nesa_uae_gap_analysis 
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Gap analysis entry not found" }, { status: 404 })
    }

    // Log the deletion for audit purposes
    try {
      await tenantDb`
        INSERT INTO audit_logs (
          table_name,
          operation,
          record_id,
          old_values,
          user_id,
          timestamp
        ) VALUES (
          'nesa_uae_gap_analysis',
          'DELETE',
          ${id},
          ${JSON.stringify(result[0])},
          'system',
          CURRENT_TIMESTAMP
        )
      `
    } catch (auditError) {
      console.warn("Failed to log audit entry:", auditError)
      // Continue execution even if audit logging fails
    }

    return NextResponse.json({ success: true, message: "Gap analysis entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting gap analysis entry:", error)
    return NextResponse.json({ error: "Failed to delete gap analysis entry" }, { status: 500 })
  }
});
