import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) =>{
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { searchParams } = new URL(request.url)
    const framework = searchParams.get("framework")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const effectiveness = searchParams.get("effectiveness")

    let whereConditions = []

    if (framework && framework !== "all") {
      whereConditions.push(`framework = '${framework}'`)
    }

    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`)
    }

    if (status && status !== "all") {
      whereConditions.push(`implementation_status = '${status}'`)
    }

    if (effectiveness && effectiveness !== "all") {
      whereConditions.push(`effectiveness_rating = '${effectiveness}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ""

    const result = await tenantDb`
      SELECT
        id,
        name,
        description,
        control_id,
        framework,
        category,
        subcategory,
        control_type,
        implementation_status,
        effectiveness_rating,
        maturity_level,
        owner,
        department,
        responsible_party,
        implementation_date,
        last_assessment_date,
        next_assessment_date,
        assessment_frequency,
        test_results,
        evidence_location,
        related_risks,
        related_assets,
        dependencies,
        cost_estimate,
        maintenance_cost,
        automation_level,
        monitoring_frequency,
        reporting_frequency,
        compliance_requirements,
        applicable_regulations,
        control_measures,
        exceptions,
        remediation_plan,
        notes,
        created_at,
        updated_at,
        created_by,
        updated_by
      FROM governance_controls
      ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result : [result],
      count: Array.isArray(result) ? result.length : 1
    })
  } catch (error) {
    console.error("Error fetching controls:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch controls" },
      { status: 500 }
    )
  }
});

export const POST = withContext(async({tenantDb}: HttpSessionContext, request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const body = await request.json()

    const {
      name,
      description,
      control_id,
      framework,
      category,
      subcategory,
      control_type,
      implementation_status = "not_implemented",
      effectiveness_rating,
      maturity_level,
      owner,
      department,
      responsible_party,
      implementation_date,
      last_assessment_date,
      next_assessment_date,
      assessment_frequency = "annual",
      test_results = {},
      evidence_location,
      related_risks = [],
      related_assets = [],
      dependencies = [],
      cost_estimate,
      maintenance_cost,
      automation_level = "manual",
      monitoring_frequency,
      reporting_frequency,
      compliance_requirements = [],
      applicable_regulations = [],
      control_measures = [],
      exceptions,
      remediation_plan,
      notes,
      created_by
    } = body

    // Validate required fields
    if (!name || !control_id || !framework || !category || !owner) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      INSERT INTO governance_controls (
        name, description, control_id, framework, category, subcategory,
        control_type, implementation_status, effectiveness_rating, maturity_level,
        owner, department, responsible_party, implementation_date, last_assessment_date,
        next_assessment_date, assessment_frequency, test_results, evidence_location,
        related_risks, related_assets, dependencies, cost_estimate, maintenance_cost,
        automation_level, monitoring_frequency, reporting_frequency, compliance_requirements,
        applicable_regulations, control_measures, exceptions, remediation_plan, notes, created_by
      ) VALUES (
        ${name}, ${description}, ${control_id}, ${framework}, ${category}, ${subcategory},
        ${control_type}, ${implementation_status}, ${effectiveness_rating}, ${maturity_level},
        ${owner}, ${department}, ${responsible_party}, ${implementation_date}, ${last_assessment_date},
        ${next_assessment_date}, ${assessment_frequency}, ${JSON.stringify(test_results)}, ${evidence_location},
        ${JSON.stringify(related_risks)}, ${JSON.stringify(related_assets)}, ${JSON.stringify(dependencies)}, ${cost_estimate}, ${maintenance_cost},
        ${automation_level}, ${monitoring_frequency}, ${reporting_frequency}, ${JSON.stringify(compliance_requirements)},
        ${JSON.stringify(applicable_regulations)}, ${JSON.stringify(control_measures)}, ${exceptions}, ${remediation_plan}, ${notes}, ${created_by}
      ) RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result[0] : result,
      message: "Control created successfully"
    })
  } catch (error) {
    console.error("Error creating control:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create control" },
      { status: 500 }
    )
  }
});
