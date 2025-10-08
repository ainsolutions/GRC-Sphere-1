import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"



export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const result = await tenantDb`
      SELECT 
        ga.*,
        mr.mica_control_name,
        mr.mica_control_id as control_reference,
        mr.mica_description as control_description,
        mr.mica_control_type,
        mr.imica_mplementation_guidance
      FROM mica_gap_analysis ga
      LEFT JOIN mica_requirements mr ON ga.mica_control_id = mr.id
      WHERE ga.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Gap analysis entry not found" }, { status: 404 })
    }

    const row = result[0]
    const transformedData = {
      id: row.id,
      mica_control_id: row.mica_control_id,
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
      mica_control: {
        id: row.mica_control_id,
        control_name: row.control_name,
        control_reference: row.control_reference,
        control_description: row.control_description,
        control_type: row.control_type,
        implementation_guidance: row.implementation_guidance,
      },
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching MICA gap analysis entry:", error)
    return NextResponse.json({ error: "Failed to fetch gap analysis entry" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()
    const {
      mica_control_id,
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
    if (!mica_control_id || !initial_control_maturity || !target_control_maturity) {
      return NextResponse.json(
        { error: "Missing required fields: mica_control_id, initial_control_maturity, target_control_maturity" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      UPDATE mica_gap_analysis 
      SET 
        mica_control_id = ${mica_control_id},
        mica_existing_control = ${existing_control || null},
        mica_control_owner = ${control_owner || null},
        mica_political_procedure_control = ${political_procedure_control || null},
        mica_initial_control_maturity = ${initial_control_maturity},
        mica_gap_description = ${gap_description || null},
        mica_financial_action = ${financial_action || null},
        mica_target_control_maturity = ${target_control_maturity},
        mica_action_owner = ${action_owner || null},
        mica_reviewer = ${reviewer || null},
        mica_status = ${status || "Not Started"},
        mica_notes = ${notes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record <string, any>[]

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
          'mica_gap_analysis',
          'UPDATE',
          ${id},
          ${JSON.stringify(body)},
          'system',
          CURRENT_TIMESTAMP
        )
      `
    } catch (auditError) {
      console.warn("Failed to log audit entry:", auditError)
    }

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("Error updating MICA gap analysis entry:", error)
    return NextResponse.json({ error: "Failed to update gap analysis entry" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const result = await tenantDb`
      DELETE FROM mica_gap_analysis 
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
          'mica_gap_analysis',
          'DELETE',
          ${id},
          ${JSON.stringify(result[0])},
          'system',
          CURRENT_TIMESTAMP
        )
      `
    } catch (auditError) {
      console.warn("Failed to log audit entry:", auditError)
    }

    return NextResponse.json({ success: true, message: "Gap analysis entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting MICA gap analysis entry:", error)
    return NextResponse.json({ error: "Failed to delete gap analysis entry" }, { status: 500 })
  }
});
