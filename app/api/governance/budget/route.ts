import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb}: HttpSessionContext, request) => {
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
    const fiscalYear = searchParams.get("fiscal_year")

    let whereConditions = []

    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`)
    }

    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`)
    }

    if (fiscalYear && fiscalYear !== "all") {
      whereConditions.push(`fiscal_year = '${fiscalYear}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ""

    const result = await tenantDb`
      SELECT 
        id,
        category,
        subcategory,
        description,
        fiscal_year,
        allocated_amount,
        spent_amount,
        committed_amount,
        remaining_amount,
        utilization_percentage,
        status,
        budget_owner,
        department,
        departmental_unit,
        cost_center,
        vendor,
        contract_reference,
        approval_date,
        approval_authority,
        notes,
        created_at,
        updated_at
      FROM governance_budget 
      ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result : [result],
      count: Array.isArray(result) ? result.length : 1
    })
  } catch (error) {
    console.error("Error fetching budget data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch budget data" },
      { status: 500 }
    )
  }
});

export const POST = withContext(async ({ tenantDb}: HttpSessionContext,request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const body = await request.json()
    
    const {
      category,
      subcategory,
      description,
      fiscal_year,
      allocated_amount,
      spent_amount = 0,
      committed_amount = 0,
      status = "on-track",
      budget_owner,
      department,
      departmental_unit,
      cost_center,
      vendor,
      contract_reference,
      approval_date,
      approval_authority,
      notes
    } = body

    // Validate required fields
    if (!category || !fiscal_year || !allocated_amount || !budget_owner) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      INSERT INTO governance_budget (
        category, subcategory, description, fiscal_year, allocated_amount,
        spent_amount, committed_amount, status, budget_owner, department,
        departmental_unit, cost_center, vendor, contract_reference, approval_date, 
        approval_authority, notes
      ) VALUES (
        ${category}, ${subcategory}, ${description}, ${fiscal_year}, ${allocated_amount},
        ${spent_amount}, ${committed_amount}, ${status}, ${budget_owner}, ${department},
        ${departmental_unit || null}, ${cost_center}, ${vendor}, ${contract_reference}, 
        ${approval_date}, ${approval_authority}, ${notes}
      ) RETURNING *
    `
    
    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result[0] : result,
      message: "Budget item created successfully"
    })
  } catch (error) {
    console.error("Error creating budget item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create budget item" },
      { status: 500 }
    )
  }
});
