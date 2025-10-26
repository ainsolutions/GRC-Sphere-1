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
        reviewer,
        department,
        departmental_unit,
        assessment_methodology,
        compliance_framework,
        assessment_priority,
        completion_percentage,
        findings_count,
        high_risk_findings,
        medium_risk_findings,
        low_risk_findings,
        assets,
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

    // ✅ Validate required fields
    const required = ["assessment_name", "assessment_type", "compliance_framework"];
    for (const key of required) {
      if (!body[key] || body[key].toString().trim() === "") {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${key}` },
          { status: 400 }
        );
      }
    }

    // ✅ Generate unique ID in format AS-YYYY-TYPE-XXXXX
    let assessmentId = body.assessment_id
    if (!assessmentId) {
      const currentYear = new Date().getFullYear()
      
      // Truncate assessment type to 3-4 characters
      const typeAbbreviation = body.assessment_type
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 4) || 'ASMT'
      
      // Get the next sequential number for this year and type
      const assessmentIdResult = await tenantDb`
        SELECT COALESCE(MAX(CAST(SUBSTRING(assessment_id FROM LENGTH(assessment_id) - 4) AS INTEGER)), 0) + 1 as next_id
        FROM assessments 
        WHERE assessment_id LIKE ${`AS-${currentYear}-${typeAbbreviation}-%`}
      ` as Record<string, number>[]
      
      const nextId = assessmentIdResult[0]?.next_id || 1
      assessmentId = `AS-${currentYear}-${typeAbbreviation}-${nextId.toString().padStart(5, "0")}`
    }

    // ✅ Insert manually with explicit fields
    const inserted = await tenantDb`
      INSERT INTO assessments (
        assessment_id,
        assessment_name,
        assessment_type,
        assessment_scope,
        assessment_status,
        start_date,
        end_date,
        assigned_assessor,
        reviewer,
        department,
        departmental_unit,
        assessment_methodology,
        compliance_framework,
        assessment_priority,
        completion_percentage,
        findings_count,
        high_risk_findings,
        medium_risk_findings,
        low_risk_findings,
        assets
      )
      VALUES (
        ${assessmentId},
        ${body.assessment_name},
        ${body.assessment_type},
        ${body.assessment_scope || ""},
        ${body.assessment_status || "Planning"},
        ${body.start_date || null},
        ${body.end_date || null},
        ${body.assigned_assessor || "Unassigned"},
        ${body.reviewer || null},
        ${body.department || null},
        ${body.departmental_unit || null},
        ${body.assessment_methodology || ""},
        ${body.compliance_framework},
        ${body.assessment_priority || "Medium"},
        ${body.completion_percentage || 0},
        ${body.findings_count || 0},
        ${body.high_risk_findings || 0},
        ${body.medium_risk_findings || 0},
        ${body.low_risk_findings || 0},
        ${JSON.stringify(body.assets || [])}
      )
      RETURNING *
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, assessment: inserted[0] });
  } catch (error: any) {
    console.error("❌ Error creating assessment:", error);
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