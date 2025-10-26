import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch SWIFT gap remediations
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

    const gaps = await tenantDb`
      SELECT * FROM swift_gap_remediation
      WHERE swift_assessment_id = ${swiftAssessmentId}
      ORDER BY 
        CASE gap_severity 
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
        END,
        created_at DESC
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: gaps });
  } catch (error) {
    console.error("Error fetching SWIFT gaps:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gaps" },
      { status: 500 }
    );
  }
});

// POST - Create SWIFT gap remediation
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();

    if (!body.swift_assessment_id || !body.swift_control_id || !body.gap_title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate gap ID
    const currentYear = new Date().getFullYear();
    const gapIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(gap_id FROM LENGTH(gap_id) - 4) AS INTEGER)), 0) + 1 as next_id
      FROM swift_gap_remediation 
      WHERE gap_id LIKE ${`SWIFT-GAP-${currentYear}-%`}
    ` as Record<string, number>[];
    
    const nextId = gapIdResult[0]?.next_id || 1;
    const gapId = `SWIFT-GAP-${currentYear}-${nextId.toString().padStart(5, "0")}`;

    const result = await tenantDb`
      INSERT INTO swift_gap_remediation (
        gap_id,
        swift_assessment_id,
        swift_control_id,
        gap_title,
        gap_description,
        gap_severity,
        remediation_action,
        remediation_owner,
        remediation_department,
        assigned_to,
        remediation_status,
        priority,
        due_date,
        progress_percentage
      )
      VALUES (
        ${gapId},
        ${body.swift_assessment_id},
        ${body.swift_control_id},
        ${body.gap_title},
        ${body.gap_description || ''},
        ${body.gap_severity || 'Medium'},
        ${body.remediation_action || ''},
        ${body.remediation_owner || ''},
        ${body.remediation_department || ''},
        ${body.assigned_to || ''},
        ${body.remediation_status || 'Open'},
        ${body.priority || 'Medium'},
        ${body.due_date || null},
        ${body.progress_percentage || 0}
      )
      RETURNING *
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error creating SWIFT gap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create gap" },
      { status: 500 }
    );
  }
});

