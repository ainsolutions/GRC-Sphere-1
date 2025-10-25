import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch all SWIFT assessments
export const GET = withContext(async ({ tenantDb }) => {
  try {
    const assessments = await tenantDb`
      SELECT * FROM swift_assessment_summary
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: assessments });
  } catch (error) {
    console.error("Error fetching SWIFT assessments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SWIFT assessments" },
      { status: 500 }
    );
  }
});

// POST - Create new SWIFT assessment
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();

    if (!body.assessment_name || !body.swift_bic_code) {
      return NextResponse.json(
        { success: false, error: "Assessment name and SWIFT BIC code are required" },
        { status: 400 }
      );
    }

    // Generate assessment ID
    const currentYear = new Date().getFullYear();
    const assessmentIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(assessment_id FROM LENGTH(assessment_id) - 4) AS INTEGER)), 0) + 1 as next_id
      FROM swift_assessments 
      WHERE assessment_id LIKE ${`SWIFT-${currentYear}-%`}
    ` as Record<string, number>[];
    
    const nextId = assessmentIdResult[0]?.next_id || 1;
    const assessmentId = `SWIFT-${currentYear}-${nextId.toString().padStart(5, "0")}`;

    const result = await tenantDb`
      INSERT INTO swift_assessments (
        assessment_id,
        assessment_name,
        assessment_type,
        swift_community_version,
        scope,
        assessment_date,
        assessor_name,
        assessor_organization,
        assessor_email,
        reviewer_name,
        swift_bic_code,
        swift_environment,
        message_volume_category,
        status,
        assets
      )
      VALUES (
        ${assessmentId},
        ${body.assessment_name},
        ${body.assessment_type || 'Annual'},
        ${body.swift_community_version || 'CSP v2024'},
        ${body.scope || ''},
        ${body.assessment_date || null},
        ${body.assessor_name || ''},
        ${body.assessor_organization || ''},
        ${body.assessor_email || ''},
        ${body.reviewer_name || ''},
        ${body.swift_bic_code},
        ${body.swift_environment || 'Production'},
        ${body.message_volume_category || 'Medium'},
        ${body.status || 'Planning'},
        ${JSON.stringify(body.assets || [])}
      )
      RETURNING *
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error creating SWIFT assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create SWIFT assessment" },
      { status: 500 }
    );
  }
});

