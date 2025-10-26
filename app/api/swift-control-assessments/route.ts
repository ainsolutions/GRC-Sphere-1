import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch control assessments
export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const swiftAssessmentId = searchParams.get("swift_assessment_id");

    if (!swiftAssessmentId) {
      return NextResponse.json(
        { success: false, error: "swift_assessment_id is required" },
        { status: 400 }
      );
    }

    const controls = await tenantDb`
      SELECT * FROM swift_control_assessments
      WHERE swift_assessment_id = ${swiftAssessmentId}
      ORDER BY control_id ASC
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: controls });
  } catch (error) {
    console.error("Error fetching SWIFT control assessments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch control assessments" },
      { status: 500 }
    );
  }
});

// POST - Create control assessment(s)
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();
    const controls = Array.isArray(body) ? body : [body];

    const results = [];

    for (const control of controls) {
      if (!control.swift_assessment_id || !control.control_id || !control.control_objective) {
        continue;
      }

      const result = await tenantDb`
        INSERT INTO swift_control_assessments (
          swift_assessment_id,
          control_id,
          control_objective,
          control_description,
          control_category,
          control_type,
          implementation_status,
          compliance_level,
          maturity_level,
          effectiveness_rating,
          evidence_collected,
          testing_method,
          gap_identified,
          gap_description,
          gap_severity,
          remediation_required,
          control_owner,
          assessed_by,
          assessed_date
        )
        VALUES (
          ${control.swift_assessment_id},
          ${control.control_id},
          ${control.control_objective},
          ${control.control_description || ''},
          ${control.control_category || 'Architecture Security'},
          ${control.control_type || 'Mandatory'},
          ${control.implementation_status || 'Not Assessed'},
          ${control.compliance_level || 'None'},
          ${control.maturity_level || 'Initial'},
          ${control.effectiveness_rating || 'Not Tested'},
          ${control.evidence_collected || ''},
          ${control.testing_method || 'Document Review'},
          ${control.gap_identified || false},
          ${control.gap_description || ''},
          ${control.gap_severity || 'Low'},
          ${control.remediation_required || false},
          ${control.control_owner || ''},
          ${control.assessed_by || ''},
          ${control.assessed_date || null}
        )
        RETURNING *
      ` as Record<string, any>[];

      results.push(result[0]);
    }

    // Update parent assessment statistics
    if (results.length > 0) {
      await updateAssessmentStats(tenantDb, controls[0].swift_assessment_id);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error creating SWIFT control assessments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create control assessments" },
      { status: 500 }
    );
  }
});

async function updateAssessmentStats(tenantDb: any, assessmentId: number) {
  const stats = await tenantDb`
    SELECT 
      COUNT(*) as total_controls,
      COUNT(CASE WHEN control_type = 'Mandatory' THEN 1 END) as mandatory_controls,
      COUNT(CASE WHEN control_type = 'Advisory' THEN 1 END) as advisory_controls,
      COUNT(CASE WHEN implementation_status = 'Compliant' THEN 1 END) as compliant_controls,
      COUNT(CASE WHEN implementation_status = 'Non-Compliant' THEN 1 END) as non_compliant_controls,
      COUNT(CASE WHEN implementation_status = 'Partially Compliant' THEN 1 END) as partially_compliant_controls,
      COUNT(CASE WHEN gap_identified = true THEN 1 END) as findings_count,
      COUNT(CASE WHEN gap_severity = 'Critical' THEN 1 END) as critical_findings,
      COUNT(CASE WHEN gap_severity = 'High' THEN 1 END) as high_findings
    FROM swift_control_assessments
    WHERE swift_assessment_id = ${assessmentId}
  ` as Record<string, any>[];

  if (stats.length > 0) {
    const s = stats[0];
    const totalControls = parseInt(s.total_controls) || 0;
    const compliantControls = parseInt(s.compliant_controls) || 0;
    const partiallyCompliant = parseInt(s.partially_compliant_controls) || 0;
    
    const complianceScore = totalControls > 0 
      ? ((compliantControls + (partiallyCompliant * 0.5)) / totalControls) * 100 
      : 0;

    await tenantDb`
      UPDATE swift_assessments SET
        total_controls = ${totalControls},
        mandatory_controls = ${s.mandatory_controls},
        advisory_controls = ${s.advisory_controls},
        compliant_controls = ${compliantControls},
        non_compliant_controls = ${s.non_compliant_controls},
        partially_compliant_controls = ${partiallyCompliant},
        findings_count = ${s.findings_count},
        critical_findings = ${s.critical_findings},
        high_findings = ${s.high_findings},
        overall_compliance_score = ${complianceScore.toFixed(2)},
        updated_at = NOW()
      WHERE id = ${assessmentId}
    `;
  }
}

