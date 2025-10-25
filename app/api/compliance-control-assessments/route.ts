import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch control assessments for a compliance assessment
export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const complianceAssessmentId = searchParams.get("compliance_assessment_id");

    if (!complianceAssessmentId) {
      return NextResponse.json(
        { success: false, error: "compliance_assessment_id is required" },
        { status: 400 }
      );
    }

    const controls = await tenantDb`
      SELECT * FROM compliance_control_assessments
      WHERE compliance_assessment_id = ${complianceAssessmentId}
      ORDER BY control_id ASC
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: controls });
  } catch (error) {
    console.error("Error fetching control assessments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch control assessments" },
      { status: 500 }
    );
  }
});

// POST - Create or bulk create control assessments
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();
    const controls = Array.isArray(body) ? body : [body];

    const results = [];

    for (const control of controls) {
      if (!control.compliance_assessment_id || !control.control_id || !control.control_name) {
        continue;
      }

      const result = await tenantDb`
        INSERT INTO compliance_control_assessments (
          compliance_assessment_id,
          control_id,
          control_name,
          control_description,
          control_category,
          control_domain,
          regulatory_reference,
          control_objective,
          implementation_status,
          compliance_level,
          evidence_collected,
          evidence_references,
          assessment_method,
          existing_controls,
          control_owner,
          assessor_notes,
          assessed_date,
          assessed_by,
          review_notes,
          reviewed_by,
          review_date
        )
        VALUES (
          ${control.compliance_assessment_id},
          ${control.control_id},
          ${control.control_name},
          ${control.control_description || ''},
          ${control.control_category || ''},
          ${control.control_domain || ''},
          ${control.regulatory_reference || ''},
          ${control.control_objective || ''},
          ${control.implementation_status || 'Not Assessed'},
          ${control.compliance_level || 'None'},
          ${control.evidence_collected || ''},
          ${JSON.stringify(control.evidence_references || [])},
          ${control.assessment_method || ''},
          ${control.existing_controls || ''},
          ${control.control_owner || ''},
          ${control.assessor_notes || ''},
          ${control.assessed_date || null},
          ${control.assessed_by || ''},
          ${control.review_notes || ''},
          ${control.reviewed_by || ''},
          ${control.review_date || null}
        )
        RETURNING *
      ` as Record<string, any>[];

      results.push(result[0]);
    }

    // Update parent assessment statistics
    if (results.length > 0 && controls[0].compliance_assessment_id) {
      await updateAssessmentStatistics(tenantDb, controls[0].compliance_assessment_id);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error creating control assessments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create control assessments" },
      { status: 500 }
    );
  }
});

// Helper function to update assessment statistics
async function updateAssessmentStatistics(tenantDb: any, assessmentId: number) {
  const stats = await tenantDb`
    SELECT 
      COUNT(*) as total_controls,
      COUNT(CASE WHEN implementation_status = 'Compliant' THEN 1 END) as compliant_controls,
      COUNT(CASE WHEN implementation_status = 'Non-Compliant' THEN 1 END) as non_compliant_controls,
      COUNT(CASE WHEN implementation_status = 'Partially Compliant' THEN 1 END) as partially_compliant_controls,
      COUNT(CASE WHEN implementation_status = 'Not Applicable' THEN 1 END) as not_applicable_controls,
      COUNT(CASE WHEN remediation_required = true THEN 1 END) as gap_count,
    FROM compliance_control_assessments
    WHERE compliance_assessment_id = ${assessmentId}
  ` as Record<string, any>[];

  if (stats.length > 0) {
    const s = stats[0];
    const totalControls = parseInt(s.total_controls) || 0;
    const compliantControls = parseInt(s.compliant_controls) || 0;
    const partiallyCompliant = parseInt(s.partially_compliant_controls) || 0;
    
    // Calculate compliance score (compliant + 0.5 * partially compliant)
    const complianceScore = totalControls > 0 
      ? ((compliantControls + (partiallyCompliant * 0.5)) / totalControls) * 100 
      : 0;

    await tenantDb`
      UPDATE compliance_assessments SET
        total_controls = ${totalControls},
        compliant_controls = ${compliantControls},
        non_compliant_controls = ${s.non_compliant_controls},
        partially_compliant_controls = ${s.partially_compliant_controls},
        not_applicable_controls = ${s.not_applicable_controls},
        gap_count = ${s.gap_count},
        overall_compliance_score = ${complianceScore.toFixed(2)},
        updated_at = NOW()
      WHERE id = ${assessmentId}
    `;
  }
}


