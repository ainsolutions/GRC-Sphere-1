import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid assessment ID" }, { status: 400 })
    }

    const result = await tenantDb`
      SELECT 
        id,
        assessment_name,
        description,
        assessment_date,
        assessor_name,
        department,
        status,
        created_at,
        updated_at
      FROM cyber_maturity_assessments
      WHERE id = ${id}
      LIMIT 1
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error: any) {
    console.error("Error fetching cyber maturity assessment:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})


export const PUT = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid assessment ID" }, { status: 400 })
    }

    const body = await request.json()
    const { assessment_name, description, assessment_date, assessor_name, department, status } = body

    const result = await tenantDb`
      UPDATE cyber_maturity_assessments
      SET 
        assessment_name = ${assessment_name},
        description = ${description},
        assessment_date = ${assessment_date},
        assessor_name = ${assessor_name},
        department = ${department},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Cyber maturity assessment updated successfully"
    })
  } catch (error: any) {
    console.error("Error updating cyber maturity assessment:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})


export const DELETE = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid assessment ID" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM cyber_maturity_assessments
      WHERE id = ${id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Cyber maturity assessment deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting cyber maturity assessment:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})