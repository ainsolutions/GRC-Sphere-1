import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch gap remediations for a compliance assessment or control assessment
export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const complianceAssessmentId = searchParams.get("compliance_assessment_id");
    const controlAssessmentId = searchParams.get("control_assessment_id");

    let whereClause = "";
    let params: any[] = [];

    if (complianceAssessmentId) {
      whereClause = "WHERE compliance_assessment_id = $1";
      params = [complianceAssessmentId];
    } else if (controlAssessmentId) {
      whereClause = "WHERE control_assessment_id = $1";
      params = [controlAssessmentId];
    }

    const gaps = await tenantDb`
      SELECT * FROM compliance_gap_remediation
      ${tenantDb.unsafe(whereClause)}
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
    console.error("Error fetching gap remediations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gap remediations" },
      { status: 500 }
    );
  }
});

// POST - Create gap remediation
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();

    if (!body.compliance_assessment_id || !body.control_assessment_id || !body.gap_title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate gap ID
    const currentYear = new Date().getFullYear();
    const gapIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(gap_id FROM LENGTH(gap_id) - 4) AS INTEGER)), 0) + 1 as next_id
      FROM compliance_gap_remediation 
      WHERE gap_id LIKE ${`GAP-${currentYear}-%`}
    ` as Record<string, number>[];
    
    const nextId = gapIdResult[0]?.next_id || 1;
    const gapId = `GAP-${currentYear}-${nextId.toString().padStart(5, "0")}`;

    const result = await tenantDb`
      INSERT INTO compliance_gap_remediation (
        gap_id,
        compliance_assessment_id,
        control_assessment_id,
        gap_title,
        gap_description,
        control_reference,
        regulatory_reference,
        gap_category,
        gap_severity,
        risk_impact,
        current_state,
        target_state,
        remediation_action,
        remediation_plan,
        remediation_owner,
        remediation_department,
        assigned_to,
        remediation_status,
        priority,
        effort_estimate,
        cost_estimate,
        resources_required,
        implementation_timeline,
        start_date,
        due_date,
        progress_percentage,
        milestones,
        dependencies,
        tags,
        created_by
      )
      VALUES (
        ${gapId},
        ${body.compliance_assessment_id},
        ${body.control_assessment_id},
        ${body.gap_title},
        ${body.gap_description || ''},
        ${body.control_reference || ''},
        ${body.regulatory_reference || ''},
        ${body.gap_category || ''},
        ${body.gap_severity || 'Medium'},
        ${body.risk_impact || ''},
        ${body.current_state || ''},
        ${body.target_state || ''},
        ${body.remediation_action || ''},
        ${body.remediation_plan || ''},
        ${body.remediation_owner || ''},
        ${body.remediation_department || ''},
        ${body.assigned_to || ''},
        ${body.remediation_status || 'Open'},
        ${body.priority || 'Medium'},
        ${body.effort_estimate || ''},
        ${body.cost_estimate || null},
        ${body.resources_required || ''},
        ${body.implementation_timeline || ''},
        ${body.start_date || null},
        ${body.due_date || null},
        ${body.progress_percentage || 0},
        ${JSON.stringify(body.milestones || [])},
        ${body.dependencies || ''},
        ${JSON.stringify(body.tags || [])},
        ${body.created_by || null}
      )
      RETURNING *
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error creating gap remediation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create gap remediation" },
      { status: 500 }
    );
  }
});


