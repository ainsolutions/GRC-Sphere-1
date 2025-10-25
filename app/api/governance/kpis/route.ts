import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({tenantDb}: HttpSessionContext, request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const framework = searchParams.get("framework")

    let whereConditions = []
    
    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`)
    }

    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`)
    }

    if (framework && framework !== "all") {
      whereConditions.push(`framework = '${framework}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ""

    const result = await tenantDb`
      SELECT 
        id,
        name,
        description,
        target_value,
        current_value,
        unit,
        category,
        framework,
        status,
        trend,
        measurement_frequency,
        owner,
        department,
        departmental_unit,
        calculation_method,
        data_source,
        last_updated,
        next_review_date,
        created_at,
        updated_at
      FROM governance_kpis 
      ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result : [result],
      count: Array.isArray(result) ? result.length : 1
    })
  } catch (error) {
    console.error("Error fetching KPIs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch KPIs" },
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
      target_value,
      current_value,
      unit,
      category,
      framework,
      status = "active",
      trend = "stable",
      measurement_frequency = "monthly",
      owner,
      department,
      departmental_unit,
      calculation_method,
      data_source,
      next_review_date
    } = body

    // Validate required fields
    if (!name || !target_value || !current_value || !category || !owner) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      INSERT INTO governance_kpis (
        name, description, target_value, current_value, unit, category, 
        framework, status, trend, measurement_frequency, owner, department,
        departmental_unit, calculation_method, data_source, next_review_date
      ) VALUES (
        ${name}, ${description}, ${target_value}, ${current_value}, ${unit}, ${category}, 
        ${framework}, ${status}, ${trend}, ${measurement_frequency}, ${owner}, ${department},
        ${departmental_unit || null}, ${calculation_method}, ${data_source}, ${next_review_date}
      ) RETURNING *
    `
    
    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result[0] : result,
      message: "KPI created successfully"
    })
  } catch (error) {
    console.error("Error creating KPI:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create KPI" },
      { status: 500 }
    )
  }
});
