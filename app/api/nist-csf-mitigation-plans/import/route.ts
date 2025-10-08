import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

interface ImportPlanData {
  plan_name: string
  template_name?: string
  mitigation_strategy: string
  status?: string
  progress_percentage?: number
  assigned_owner: string
  due_date?: string
  investment_amount?: number
  residual_risk_level?: string
  priority?: string
  notes?: string
}

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { csvData } = body

    if (!csvData || !Array.isArray(csvData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid CSV data format",
        },
        { status: 400 },
      )
    }

    const results = []
    const errors = []

    // Get risk templates for mapping
    const templates = await tenantDb`SELECT id, template_name FROM nist_csf_risk_templates WHERE is_active = true` as Record<string, any>[]
    const templateMap = new Map(templates.map((t) => [t.template_name.toLowerCase(), t.id]))

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i] as ImportPlanData
      try {
        // Validate required fields
        if (!row.plan_name || !row.mitigation_strategy || !row.assigned_owner) {
          errors.push(`Row ${i + 1}: Missing required fields (plan_name, mitigation_strategy, assigned_owner)`)
          continue
        }

        // Map template name to ID (optional)
        let templateId = null
        if (row.template_name) {
          templateId = templateMap.get(row.template_name.toLowerCase())
          if (!templateId) {
            errors.push(`Row ${i + 1}: Template '${row.template_name}' not found`)
            continue
          }
        }

        // Validate status
        const validStatuses = ["Planning", "In Progress", "Completed", "On Hold"]
        const status = row.status && validStatuses.includes(row.status) ? row.status : "Planning"

        // Validate priority
        const validPriorities = ["Critical", "High", "Medium", "Low"]
        const priority = row.priority && validPriorities.includes(row.priority) ? row.priority : "Medium"

        // Validate progress percentage
        let progressPercentage = row.progress_percentage || 0
        if (progressPercentage < 0 || progressPercentage > 100) {
          progressPercentage = 0
        }

        // Validate investment amount
        const investmentAmount = row.investment_amount && row.investment_amount >= 0 ? row.investment_amount : 0

        // Validate residual risk level
        const validRiskLevels = ["Critical", "High", "Medium", "Low"]
        const residualRiskLevel =
          row.residual_risk_level && validRiskLevels.includes(row.residual_risk_level)
            ? row.residual_risk_level
            : "Medium"

        // Parse due date
        let dueDate = null
        if (row.due_date) {
          const parsedDate = new Date(row.due_date)
          if (!isNaN(parsedDate.getTime())) {
            dueDate = parsedDate.toISOString().split("T")[0]
          }
        }

        // Generate plan ID
        const planCount = await tenantDb`SELECT COUNT(*) as count FROM nist_csf_mitigation_plans` as Record<string, any>[]
        const planId = `NIST-MIT-${String(Number(planCount[0].count) + 1).padStart(4, "0")}`

        const result = await tenantDb`
          INSERT INTO nist_csf_mitigation_plans (
            plan_id,
            plan_name,
            template_id,
            mitigation_strategy,
            status,
            progress_percentage,
            assigned_owner,
            due_date,
            investment_amount,
            residual_risk_level,
            priority,
            notes
          ) VALUES (
            ${planId},
            ${row.plan_name},
            ${templateId},
            ${row.mitigation_strategy},
            ${status},
            ${progressPercentage},
            ${row.assigned_owner},
            ${dueDate},
            ${investmentAmount},
            ${residualRiskLevel},
            ${priority},
            ${row.notes || ""}
          ) RETURNING *
        ` as Record<string, any>[]

        results.push(result[0])
      } catch (error) {
        console.error(`Error importing row ${i + 1}:`, error)
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.length,
      errors: errors,
      data: results,
    })
  } catch (error) {
    console.error("Failed to import NIST CSF mitigation plans:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import mitigation plans",
        imported: 0,
        errors: [],
      },
      { status: 500 },
    )
  }
});
