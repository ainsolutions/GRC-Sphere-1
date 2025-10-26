import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch all compliance assessments
export const GET = withContext(async ({ tenantDb }) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        ca.*,
        COUNT(DISTINCT cca.id) as assessed_controls_count,
        COUNT(DISTINCT CASE WHEN cgr.remediation_status IN ('Open', 'In Progress') THEN cgr.id END) as open_gaps_count
      FROM compliance_assessments ca
      LEFT JOIN compliance_control_assessments cca ON ca.id = cca.compliance_assessment_id
      LEFT JOIN compliance_gap_remediation cgr ON ca.id = cgr.compliance_assessment_id
      GROUP BY ca.id
      ORDER BY ca.created_at DESC
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: assessments });
  } catch (error) {
    console.error("Error fetching compliance assessments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch compliance assessments" },
      { status: 500 }
    );
  }
});

// POST - Create new compliance assessment
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.assessment_name || !body.regulatory_framework) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: assessment_name, regulatory_framework" },
        { status: 400 }
      );
    }

    // Generate assessment ID
    const currentYear = new Date().getFullYear();
    const frameworkAbbr = body.regulatory_framework
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 6) || 'COMP';
    
    const assessmentIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(assessment_id FROM LENGTH(assessment_id) - 4) AS INTEGER)), 0) + 1 as next_id
      FROM compliance_assessments 
      WHERE assessment_id LIKE ${`CA-${currentYear}-${frameworkAbbr}-%`}
    ` as Record<string, number>[];
    
    const nextId = assessmentIdResult[0]?.next_id || 1;
    const assessmentId = `CA-${currentYear}-${frameworkAbbr}-${nextId.toString().padStart(5, "0")}`;

    const result = await tenantDb`
      INSERT INTO compliance_assessments (
        assessment_id,
        assessment_name,
        regulatory_framework,
        assessment_type,
        organization_id,
        department_id,
        assessment_scope,
        assessment_objective,
        assessment_period_start,
        assessment_period_end,
        assessor_name,
        assessor_organization,
        assessor_email,
        reviewer_name,
        status,
        assets,
        created_by
      )
      VALUES (
        ${assessmentId},
        ${body.assessment_name},
        ${body.regulatory_framework},
        ${body.assessment_type || 'Initial'},
        ${body.organization_id || null},
        ${body.department_id || null},
        ${body.assessment_scope || ''},
        ${body.assessment_objective || ''},
        ${body.assessment_period_start || null},
        ${body.assessment_period_end || null},
        ${body.assessor_name || ''},
        ${body.assessor_organization || ''},
        ${body.assessor_email || ''},
        ${body.reviewer_name || ''},
        ${body.status || 'Planning'},
        ${JSON.stringify(body.assets || [])},
        ${body.created_by || null}
      )
      RETURNING *
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error creating compliance assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create compliance assessment" },
      { status: 500 }
    );
  }
});


