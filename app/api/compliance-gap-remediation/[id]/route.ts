import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// PUT - Update gap remediation
export const PUT = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();

    const result = await tenantDb`
      UPDATE compliance_gap_remediation SET
        gap_title = ${body.gap_title},
        gap_description = ${body.gap_description || ''},
        gap_severity = ${body.gap_severity},
        risk_impact = ${body.risk_impact || ''},
        current_state = ${body.current_state || ''},
        target_state = ${body.target_state || ''},
        remediation_action = ${body.remediation_action || ''},
        remediation_plan = ${body.remediation_plan || ''},
        remediation_owner = ${body.remediation_owner || ''},
        remediation_department = ${body.remediation_department || ''},
        assigned_to = ${body.assigned_to || ''},
        remediation_status = ${body.remediation_status},
        priority = ${body.priority || 'Medium'},
        effort_estimate = ${body.effort_estimate || ''},
        cost_estimate = ${body.cost_estimate || null},
        resources_required = ${body.resources_required || ''},
        implementation_timeline = ${body.implementation_timeline || ''},
        start_date = ${body.start_date || null},
        due_date = ${body.due_date || null},
        completion_date = ${body.completion_date || null},
        progress_percentage = ${body.progress_percentage || 0},
        milestones = ${JSON.stringify(body.milestones || [])},
        dependencies = ${body.dependencies || ''},
        implementation_notes = ${body.implementation_notes || ''},
        evidence_of_closure = ${body.evidence_of_closure || ''},
        verification_method = ${body.verification_method || ''},
        verified_by = ${body.verified_by || ''},
        verification_date = ${body.verification_date || null},
        follow_up_required = ${body.follow_up_required || false},
        follow_up_date = ${body.follow_up_date || null},
        recurrence_prevention = ${body.recurrence_prevention || ''},
        lessons_learned = ${body.lessons_learned || ''},
        tags = ${JSON.stringify(body.tags || [])},
        updated_by = ${body.updated_by || null},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Gap remediation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating gap remediation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update gap remediation" },
      { status: 500 }
    );
  }
});

// DELETE - Delete gap remediation
export const DELETE = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    await tenantDb`
      DELETE FROM compliance_gap_remediation WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true, message: "Gap remediation deleted successfully" });
  } catch (error) {
    console.error("Error deleting gap remediation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete gap remediation" },
      { status: 500 }
    );
  }
});


