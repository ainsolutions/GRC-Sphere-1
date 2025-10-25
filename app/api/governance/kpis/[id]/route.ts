import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext} from "@/lib/HttpContext"



export const GET = withContext(async({tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
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
      WHERE id = ${id}
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "KPI not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resultArray[0]
    })
  } catch (error) {
    console.error("Error fetching KPI:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch KPI" },
      { status: 500 }
    )
  }
});

export const PUT = withContext(async({tenantDb}: HttpSessionContext,request, { params }: { params: { id: string }}) => {
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
      UPDATE governance_kpis SET
        name = ${name},
        description = ${description},
        target_value = ${target_value},
        current_value = ${current_value},
        unit = ${unit},
        category = ${category},
        framework = ${framework},
        status = ${status},
        trend = ${trend},
        measurement_frequency = ${measurement_frequency},
        owner = ${owner},
        department = ${department},
        departmental_unit = ${departmental_unit || null},
        calculation_method = ${calculation_method},
        data_source = ${data_source},
        next_review_date = ${next_review_date},
        last_updated = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "KPI not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resultArray[0],
      message: "KPI updated successfully"
    })
  } catch (error) {
    console.error("Error updating KPI:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update KPI" },
      { status: 500 }
    )
  }
});

export const DELETE = withContext(async({tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { id } = params

    const result = await tenantDb`
      DELETE FROM governance_kpis
      WHERE id = ${id}
      RETURNING *
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "KPI not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "KPI deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting KPI:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete KPI" },
      { status: 500 }
    )
  }
});
