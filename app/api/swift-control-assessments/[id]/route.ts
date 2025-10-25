import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// PUT - Update SWIFT control assessment
export const PUT = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();

    const result = await tenantDb`
      UPDATE swift_control_assessments SET
        control_objective = ${body.control_objective},
        control_description = ${body.control_description || ''},
        implementation_status = ${body.implementation_status},
        compliance_level = ${body.compliance_level || 'None'},
        maturity_level = ${body.maturity_level || 'Initial'},
        effectiveness_rating = ${body.effectiveness_rating || 'Not Tested'},
        evidence_collected = ${body.evidence_collected || ''},
        gap_identified = ${body.gap_identified || false},
        gap_description = ${body.gap_description || ''},
        gap_severity = ${body.gap_severity || 'Low'},
        remediation_required = ${body.remediation_required || false},
        control_owner = ${body.control_owner || ''},
        assessed_by = ${body.assessed_by || ''},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Control not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating SWIFT control:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update control" },
      { status: 500 }
    );
  }
});

// DELETE - Delete SWIFT control assessment
export const DELETE = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    await tenantDb`
      DELETE FROM swift_control_assessments WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true, message: "Control deleted successfully" });
  } catch (error) {
    console.error("Error deleting SWIFT control:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete control" },
      { status: 500 }
    );
  }
});

