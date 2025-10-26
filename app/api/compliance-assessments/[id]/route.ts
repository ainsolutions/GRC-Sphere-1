import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch single compliance assessment
export const GET = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      SELECT ca.*,
        COUNT(DISTINCT cca.id) as assessed_controls_count,
        COUNT(DISTINCT CASE WHEN cgr.remediation_status IN ('Open', 'In Progress') THEN cgr.id END) as open_gaps_count
      FROM compliance_assessments ca
      LEFT JOIN compliance_control_assessments cca ON ca.id = cca.compliance_assessment_id
      LEFT JOIN compliance_gap_remediation cgr ON ca.id = cgr.compliance_assessment_id
      WHERE ca.id = ${params.id}
      GROUP BY ca.id
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error fetching compliance assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch compliance assessment" },
      { status: 500 }
    );
  }
});

// PUT - Update compliance assessment
export const PUT = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();

    const result = await tenantDb`
      UPDATE compliance_assessments SET
        assessment_name = ${body.assessment_name},
        regulatory_framework = ${body.regulatory_framework},
        assessment_type = ${body.assessment_type},
        assessment_scope = ${body.assessment_scope || ''},
        assessment_objective = ${body.assessment_objective || ''},
        assessment_period_start = ${body.assessment_period_start || null},
        assessment_period_end = ${body.assessment_period_end || null},
        assessor_name = ${body.assessor_name || ''},
        assessor_organization = ${body.assessor_organization || ''},
        assessor_email = ${body.assessor_email || ''},
        reviewer_name = ${body.reviewer_name || ''},
        status = ${body.status},
        assets = ${JSON.stringify(body.assets || [])},
        overall_compliance_score = ${body.overall_compliance_score || null},
        compliance_summary = ${body.compliance_summary || ''},
        recommendations = ${body.recommendations || ''},
        next_assessment_date = ${body.next_assessment_date || null},
        updated_by = ${body.updated_by || null},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating compliance assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update compliance assessment" },
      { status: 500 }
    );
  }
});

// DELETE - Delete compliance assessment
export const DELETE = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    await tenantDb`
      DELETE FROM compliance_assessments WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true, message: "Assessment deleted successfully" });
  } catch (error) {
    console.error("Error deleting compliance assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete compliance assessment" },
      { status: 500 }
    );
  }
});


