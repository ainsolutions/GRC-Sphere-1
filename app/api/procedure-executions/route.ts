import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const executions = await tenantDb`
      SELECT 
        pe.*,
        pr.title as procedure_title,
        pr.procedure_id as procedure_code,
        p.title as policy_title,
        p.policy_id as policy_code
      FROM procedure_executions pe
      LEFT JOIN procedures pr ON pe.procedure_id = pr.id
      LEFT JOIN policies p ON pr.policy_id = p.id
      ORDER BY pe.started_at DESC
    `

    return NextResponse.json(executions)
  } catch (error) {
    console.error("Error fetching procedure executions:", error)
    return NextResponse.json({ error: "Failed to fetch procedure executions" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { procedure_id, notes } = body

    // Generate execution ID
    const executionIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(execution_id FROM 5) AS INTEGER)), 0) + 1 as next_id
      FROM procedure_executions 
      WHERE execution_id LIKE 'EXEC%'
    ` as Record<string, number>[]
    const nextId = executionIdResult[0].next_id
    const executionId = `EXEC${String(nextId).padStart(4, "0")}`

    // Get procedure steps to initialize execution
    const procedure = await tenantDb`
      SELECT steps FROM procedures WHERE id = ${procedure_id}
    ` as Record<string, any>[]

    const steps = procedure[0]?.steps || []
    const stepsCompleted = steps.map((step: any, index: number) => ({
      ...step,
      id: index + 1,
      completed: false,
      timestamp: null,
      error: null,
    }))

    const result = await tenantDb`
      INSERT INTO procedure_executions (
        execution_id, procedure_id, executed_by, status, started_at, 
        steps_completed, notes, evidence_files
      ) VALUES (
        ${executionId}, ${procedure_id}, 1, 'in_progress', NOW(), 
        ${JSON.stringify(stepsCompleted)}, ${notes}, ${JSON.stringify([])}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating procedure execution:", error)
    return NextResponse.json({ error: "Failed to create procedure execution" }, { status: 500 })
  }
});
