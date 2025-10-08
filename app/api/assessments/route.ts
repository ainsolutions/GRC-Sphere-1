import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext( async ({tenantDb}) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        id,
        assessment_id,
        assessment_name,
        assessment_type,
        assessment_scope,
        assessment_status,
        start_date,
        end_date,
        assigned_assessor,
        assessment_methodology,
        compliance_framework,
        assessment_priority,
        completion_percentage,
        findings_count,
        high_risk_findings,
        medium_risk_findings,
        low_risk_findings,
        created_at,
        updated_at
      FROM assessments 
      ORDER BY created_at DESC
    `

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
});

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();

    // Generate Risk ID if not provided
    const riskId = body.risk_id || `SAR-${Date.now().toString().slice(-6)}`;

    // Required fields
    const requiredFields = [
      "title",
      "description",
      "category",
      "ai_risk_level",
      "ai_risk_score",
      "ai_confidence",
      "likelihood",
      "impact",
      "risk_owner"
    ];

    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === "string" && body[field].trim() === "")) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Insert into DB
    const [newRisk] = await tenantDb`
      INSERT INTO sphere_ai_risks (
        risk_id,
        title,
        description,
        category,
        ai_risk_level,
        ai_risk_score,
        ai_confidence,
        likelihood,
        impact,
        status,
        risk_owner
      )
      VALUES (
        ${riskId},
        ${body.title},
        ${body.description},
        ${body.category},
        ${body.ai_risk_level},
        ${Number(body.ai_risk_score) || 0},
        ${Number(body.ai_confidence) || 0},
        ${Number(body.likelihood) || 0},
        ${Number(body.impact) || 0},
        ${body.status || "Draft"},
        ${body.risk_owner}
      )
      RETURNING *
    ` as Record<string, any>[];

    return NextResponse.json({
      success: true,
      risk: newRisk,
    });
  } catch (error: any) {
    console.error("❌ Error creating sphere AI risk:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});



export const HEAD = withContext(async ({ tenantDb }) => {
  try {
    const assessments = await tenantDb`
      SELECT 
        a.*, 
        COALESCE(o.name, 'Unknown Organization') as organization_name,
        COALESCE(d.name, 'Unknown Department') as department_name
      FROM assessments a
      LEFT JOIN organizations o ON a.organization_id = o.id
      LEFT JOIN departments d ON a.department_id = d.id
      ORDER BY a.assessment_name
    `
    return NextResponse.json({ success: true, data: assessments })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
})