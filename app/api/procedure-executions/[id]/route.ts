import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const execution = await tenantDb`
      SELECT 
        pe.*,
        pr.title as procedure_title,
        pr.procedure_id as procedure_code,
        p.title as policy_title,
        p.policy_id as policy_code
      FROM procedure_executions pe
      LEFT JOIN procedures pr ON pe.procedure_id = pr.id
      LEFT JOIN policies p ON pr.policy_id = p.id
      WHERE pe.id = ${params.id}
    ` as Record<string, any>[]

    if (execution.length === 0) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 })
    }

    return NextResponse.json(execution[0])
  } catch (error) {
    console.error("Error fetching procedure execution:", error)
    return NextResponse.json({ error: "Failed to fetch procedure execution" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const { status, steps_completed, notes, completed_at } = body

    // Calculate duration if completed
    let duration_minutes = null
    if (status === "completed" && completed_at) {
      const execution = await tenantDb`
        SELECT started_at FROM procedure_executions WHERE id = ${params.id}
      ` as Record<string, any>[]
      if (execution.length > 0) {
        const startTime = new Date(execution[0].started_at)
        const endTime = new Date(completed_at)
        duration_minutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
      }
    }

    const result = await tenantDb`
      UPDATE procedure_executions 
      SET 
        status = ${status},
        steps_completed = ${JSON.stringify(steps_completed)},
        notes = ${notes},
        completed_at = ${completed_at || null},
        duration_minutes = ${duration_minutes},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating procedure execution:", error)
    return NextResponse.json({ error: "Failed to update procedure execution" }, { status: 500 })
  }
});
