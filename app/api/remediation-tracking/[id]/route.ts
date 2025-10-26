import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"



/**
 * PUT – update an existing remediation tracking record
 * Requires query param ?id=<number>
 */

export const PUT = withContext(async ({ tenantDb }, request, { params }) => {
  try {
    const id = parseInt(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid remediation ID" }, { status: 400 });
    }

    const body = await request.json();
    const { gap_id, remediation_plan, assigned_to, due_date, status, actual_completion_date, notes } = body;

    // ✅ Build update object safely
    const updateFields = {
      gap_id,
      remediation_plan,
      assigned_to,
      due_date,
      status,
      actual_completion_date,
      notes,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined or null keys
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    // ✅ Build dynamic SQL safely
    const fields = Object.keys(updateFields);
    const values = Object.values(updateFields);

    if (fields.length === 0) {
      return NextResponse.json({ success: false, error: "No fields provided for update" }, { status: 400 });
    }

    const setClause = fields.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const query = `
      UPDATE remediation_tracking
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;

    // ✅ Use query() for proper value placeholders
    const result = await tenantDb.query(query, [...values, id]);

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, error: "Remediation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Remediation updated successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("Error updating remediation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update remediation" },
      { status: 500 }
    );
  }
});

export const DELETE = withContext(async ({ tenantDb }, request, { params }) => {
  try {
    const id = parseInt(params.id);
    if (!id) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    const result = await tenantDb`DELETE FROM remediation_tracking WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Remediation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Remediation deleted successfully" });
  } catch (error) {
    console.error("Error deleting remediation:", error);
    return NextResponse.json({ success: false, error: "Failed to delete remediation" }, { status: 500 });
  }
});