import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// PUT - Update SWIFT gap remediation
export const PUT = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();

    const result = await tenantDb`
      UPDATE swift_gap_remediation SET
        gap_title = ${body.gap_title},
        gap_description = ${body.gap_description || ''},
        gap_severity = ${body.gap_severity},
        remediation_action = ${body.remediation_action || ''},
        remediation_owner = ${body.remediation_owner || ''},
        remediation_department = ${body.remediation_department || ''},
        assigned_to = ${body.assigned_to || ''},
        remediation_status = ${body.remediation_status},
        priority = ${body.priority || 'Medium'},
        due_date = ${body.due_date || null},
        progress_percentage = ${body.progress_percentage || 0},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Gap not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating SWIFT gap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update gap" },
      { status: 500 }
    );
  }
});

// DELETE - Delete SWIFT gap remediation
export const DELETE = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    await tenantDb`
      DELETE FROM swift_gap_remediation WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true, message: "Gap deleted successfully" });
  } catch (error) {
    console.error("Error deleting SWIFT gap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete gap" },
      { status: 500 }
    );
  }
});

