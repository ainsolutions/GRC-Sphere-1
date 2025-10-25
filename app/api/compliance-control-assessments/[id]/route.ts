import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// PUT - Update control assessment
export const PUT = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();

    const result = await tenantDb`
      UPDATE compliance_control_assessments SET
        control_name = ${body.control_name},
        control_description = ${body.control_description || ''},
        control_category = ${body.control_category || ''},
        control_domain = ${body.control_domain || ''},
        regulatory_reference = ${body.regulatory_reference || ''},
        control_objective = ${body.control_objective || ''},
        implementation_status = ${body.implementation_status},
        compliance_level = ${body.compliance_level || 'None'},
        evidence_collected = ${body.evidence_collected || ''},
        evidence_references = ${JSON.stringify(body.evidence_references || [])},
        assessment_method = ${body.assessment_method || ''},
        existing_controls = ${body.existing_controls || ''},
        control_owner = ${body.control_owner || ''},
        assessor_notes = ${body.assessor_notes || ''},
        assessed_date = ${body.assessed_date || null},
        assessed_by = ${body.assessed_by || ''},
        review_notes = ${body.review_notes || ''},
        reviewed_by = ${body.reviewed_by || ''},
        review_date = ${body.review_date || null},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Control assessment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating control assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update control assessment" },
      { status: 500 }
    );
  }
});

// DELETE - Delete control assessment
export const DELETE = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    await tenantDb`
      DELETE FROM compliance_control_assessments WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true, message: "Control assessment deleted successfully" });
  } catch (error) {
    console.error("Error deleting control assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete control assessment" },
      { status: 500 }
    );
  }
});


