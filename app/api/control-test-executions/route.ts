import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }: HttpSessionContext, request: NextRequest) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const controlId = searchParams.get("control_id")
    const testPlanId = searchParams.get("test_plan_id")

    let query
    if (controlId) {
      query = tenantDb`
        SELECT 
          cte.*,
          c.control_id as control_code,
          c.control_name,
          ctp.test_name as plan_name
        FROM control_test_executions cte
        LEFT JOIN controls c ON cte.control_id = c.id
        LEFT JOIN control_test_plans ctp ON cte.test_plan_id = ctp.id
        WHERE cte.control_id = ${controlId}
        ORDER BY cte.test_date DESC
      `
    } else if (testPlanId) {
      query = tenantDb`
        SELECT 
          cte.*,
          c.control_id as control_code,
          c.control_name,
          ctp.test_name as plan_name
        FROM control_test_executions cte
        LEFT JOIN controls c ON cte.control_id = c.id
        LEFT JOIN control_test_plans ctp ON cte.test_plan_id = ctp.id
        WHERE cte.test_plan_id = ${testPlanId}
        ORDER BY cte.test_date DESC
      `
    } else {
      query = tenantDb`
        SELECT 
          cte.*,
          c.control_id as control_code,
          c.control_name,
          ctp.test_name as plan_name
        FROM control_test_executions cte
        LEFT JOIN controls c ON cte.control_id = c.id
        LEFT JOIN control_test_plans ctp ON cte.test_plan_id = ctp.id
        ORDER BY cte.test_date DESC
        LIMIT 100
      `
    }

    const result = await query

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length
    })
  } catch (error) {
    console.error("Error fetching control test executions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch control test executions", data: [] },
      { status: 500 }
    )
  }
})

export const POST = withContext(async ({ tenantDb }: HttpSessionContext, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      control_id,
      test_plan_id,
      test_date,
      tester_name,
      tester_email,
      test_result,
      effectiveness_rating,
      test_notes,
      evidence_collected,
      issues_identified,
      recommendations,
      next_test_date
    } = body

    if (!control_id || !test_date || !tester_name || !test_result) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: control_id, test_date, tester_name, test_result" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      INSERT INTO control_test_executions (
        control_id,
        test_plan_id,
        test_date,
        tester_name,
        tester_email,
        test_result,
        effectiveness_rating,
        test_notes,
        evidence_collected,
        issues_identified,
        recommendations,
        next_test_date
      ) VALUES (
        ${control_id},
        ${test_plan_id || null},
        ${test_date},
        ${tester_name},
        ${tester_email || null},
        ${test_result},
        ${effectiveness_rating || null},
        ${test_notes || null},
        ${evidence_collected || null},
        ${issues_identified || null},
        ${recommendations || null},
        ${next_test_date || null}
      )
      RETURNING *
    `

    // Update control's last test date and result
    await tenantDb`
      UPDATE controls
      SET 
        last_test_date = ${test_date},
        last_test_result = ${test_result},
        test_status = ${test_result === 'Pass' ? 'Passed' : test_result === 'Fail' ? 'Failed' : 'Tested'}
      WHERE id = ${control_id}
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Test execution created successfully"
    })
  } catch (error) {
    console.error("Error creating test execution:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create test execution" },
      { status: 500 }
    )
  }
})

export const PUT = withContext(async ({ tenantDb }: HttpSessionContext, request: NextRequest) => {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Execution ID is required" },
        { status: 400 }
      )
    }

    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (updateData.test_date !== undefined) {
      fields.push(`test_date = $${paramIndex++}`)
      values.push(updateData.test_date)
    }
    if (updateData.tester_name !== undefined) {
      fields.push(`tester_name = $${paramIndex++}`)
      values.push(updateData.tester_name)
    }
    if (updateData.tester_email !== undefined) {
      fields.push(`tester_email = $${paramIndex++}`)
      values.push(updateData.tester_email)
    }
    if (updateData.test_result !== undefined) {
      fields.push(`test_result = $${paramIndex++}`)
      values.push(updateData.test_result)
    }
    if (updateData.effectiveness_rating !== undefined) {
      fields.push(`effectiveness_rating = $${paramIndex++}`)
      values.push(updateData.effectiveness_rating)
    }
    if (updateData.test_notes !== undefined) {
      fields.push(`test_notes = $${paramIndex++}`)
      values.push(updateData.test_notes)
    }
    if (updateData.evidence_collected !== undefined) {
      fields.push(`evidence_collected = $${paramIndex++}`)
      values.push(updateData.evidence_collected)
    }
    if (updateData.issues_identified !== undefined) {
      fields.push(`issues_identified = $${paramIndex++}`)
      values.push(updateData.issues_identified)
    }
    if (updateData.recommendations !== undefined) {
      fields.push(`recommendations = $${paramIndex++}`)
      values.push(updateData.recommendations)
    }
    if (updateData.next_test_date !== undefined) {
      fields.push(`next_test_date = $${paramIndex++}`)
      values.push(updateData.next_test_date)
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      )
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = `
      UPDATE control_test_executions
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await tenantDb.query(query, values)

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Execution not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    })
  } catch (error) {
    console.error("Error updating test execution:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update test execution" },
      { status: 500 }
    )
  }
})

export const DELETE = withContext(async ({ tenantDb }: HttpSessionContext, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Execution ID is required" },
        { status: 400 }
      )
    }

    const result = await tenantDb`
      DELETE FROM control_test_executions
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Execution not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Test execution deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting test execution:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete test execution" },
      { status: 500 }
    )
  }
})

