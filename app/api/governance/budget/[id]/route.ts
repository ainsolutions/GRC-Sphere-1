import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET  = withContext(async({tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { id } = params

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
      WHERE id = ${id}
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Budget item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resultArray[0]
    })
  } catch (error) {
    console.error("Error fetching budget item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch budget item" },
      { status: 500 }
    )
  }
});

export const PUT = withContext(async ({tenantDb}: HttpSessionContext,request,{ params }: { params: { id: string } }) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { id } = params
    const body = await request.json()

    const {
      category,
      subcategory,
      description,
      fiscal_year,
      allocated_amount,
      spent_amount,
      committed_amount,
      status,
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
      UPDATE governance_budget SET
        category = ${category},
        subcategory = ${subcategory},
        description = ${description},
        fiscal_year = ${fiscal_year},
        allocated_amount = ${allocated_amount},
        spent_amount = ${spent_amount},
        committed_amount = ${committed_amount},
        status = ${status},
        budget_owner = ${budget_owner},
        department = ${department},
        departmental_unit = ${departmental_unit || null},
        cost_center = ${cost_center},
        vendor = ${vendor},
        contract_reference = ${contract_reference},
        approval_date = ${approval_date},
        approval_authority = ${approval_authority},
        notes = ${notes},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Budget item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resultArray[0],
      message: "Budget item updated successfully"
    })
  } catch (error) {
    console.error("Error updating budget item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update budget item" },
      { status: 500 }
    )
  }
});

export const DELETE = withContext(async ({ tenantDb}: HttpSessionContext,request, { params }: { params: { id: string } })  =>{
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { id } = params

    const result = await tenantDb`
      DELETE FROM governance_budget
      WHERE id = ${id}
      RETURNING *
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Budget item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Budget item deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting budget item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete budget item" },
      { status: 500 }
    )
  }
});
