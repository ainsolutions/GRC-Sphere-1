import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")
    const status = searchParams.get("status")
    const organizationId = searchParams.get("organization_id")
    const departmentId = searchParams.get("department_id")

    let whereConditions = []
    let params = []

    if (assessmentId) {
      whereConditions.push(`af.assessment_id = $${params.length + 1}`)
      params.push(Number.parseInt(assessmentId))
    }

    if (status && status !== "all") {
      whereConditions.push(`af.status = $${params.length + 1}`)
      params.push(status)
    }

    if (organizationId) {
      whereConditions.push(`af.organization_id = $${params.length + 1}`)
      params.push(Number.parseInt(organizationId))
    }

    if (departmentId) {
      whereConditions.push(`af.department_id = $${params.length + 1}`)
      params.push(Number.parseInt(departmentId))
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const findings = await tenantDb`
      SELECT 
        af.*,
        COALESCE(a.assessment_name, a.name, 'Unknown Assessment') as assessment_name,
        COALESCE(a.assessment_id, a.id::text, 'Unknown') as assessment_code,
        COALESCE(u.first_name || ' ' || u.last_name, 'Unknown User') as user_name,
        COALESCE(u.username, 'unknown') as username,
        COALESCE(d.name, 'Unknown Department') as department_name,
        COALESCE(o.name, 'Unknown Organization') as organization_name
      FROM assessment_findings af
      LEFT JOIN assessments a ON af.assessment_id = a.id
      LEFT JOIN users u ON af.user_id = u.id
      LEFT JOIN departments d ON af.department_id = d.id
      LEFT JOIN organizations o ON af.organization_id = o.id
      ORDER BY 
        CASE af.severity 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
          WHEN 'Informational' THEN 5 
        END,
        af.created_at DESC
    `

    return NextResponse.json({ success: true, data: findings })
  } catch (error) {
    console.error("Failed to get findings:", error)
    return NextResponse.json({ error: "Failed to fetch findings" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb}: HttpSessionContext, request) => {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.assessment_id || !body.finding_title || !body.finding_description || !body.severity) {
      return NextResponse.json(
        { error: "Missing required fields: assessment_id, finding_title, finding_description, severity" },
        { status: 400 }
      )
    }

    // Generate finding ID
    const currentYear = new Date().getFullYear()
    const findingIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(finding_id FROM 10) AS INTEGER)), 0) + 1 as next_id
      FROM assessment_findings 
      WHERE finding_id LIKE ${`FIND-${currentYear}-%`}
    ` as Record<string, number>[]
    const nextId = findingIdResult[0]?.next_id || 1
    const findingId = `FIND-${currentYear}-${nextId.toString().padStart(6, "0")}`

    // Check if assessment exists
    const assessment = await tenantDb`
      SELECT id, assessment_name, organization_id, department_id
      FROM assessments 
      WHERE id = ${body.assessment_id}
    ` as Record<string, any>[]

    if (assessment.length === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    let organizationId = assessment[0].organization_id
    let departmentId = assessment[0].department_id

    // If assessment doesn't have organization_id, get the first available organization
    if (!organizationId) {
      const organizations = await tenantDb`SELECT id FROM organizations WHERE status = 'active' LIMIT 1` as Record<string, any>[]
      if (organizations.length > 0) {
        organizationId = organizations[0].id
      } else {
        return NextResponse.json(
          { error: "No valid organization found. Please ensure at least one organization exists." },
          { status: 400 }
        )
      }
    }

    // If assessment doesn't have department_id, get the first available department for the organization
    if (!departmentId) {
      const departments = await tenantDb`
        SELECT id FROM departments 
        WHERE organization_id = ${organizationId} AND status = 'active' 
        LIMIT 1
      ` as Record<string, any>[]
      if (departments.length > 0) {
        departmentId = departments[0].id
      } else {
        return NextResponse.json(
          { error: "No valid department found for the organization. Please ensure at least one department exists." },
          { status: 400 }
        )
      }
    }

    const result = await tenantDb`
      INSERT INTO assessment_findings (
        finding_id, assessment_id, finding_title, finding_description, severity, 
        category, recommendation, status, user_id, department_id, 
        organization_id, assigned_to, due_date, created_at
      )
      VALUES (
        ${findingId},
        ${body.assessment_id}, 
        ${body.finding_title}, 
        ${body.finding_description}, 
        ${body.severity}, 
        ${body.category || null}, 
        ${body.recommendation || null}, 
        ${body.status || "Open"}, 
        ${body.user_id || null}, 
        ${departmentId}, 
        ${organizationId}, 
        ${body.assigned_to || null}, 
        ${body.due_date || null},
        CURRENT_TIMESTAMP
      )
      RETURNING *
    ` as Record <string, any>[]

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 })
  }  catch (error) {
  console.error("Failed to create finding:", error);

  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { error: `Failed to create finding: ${message}` },
    { status: 500 }
  );
}
})
