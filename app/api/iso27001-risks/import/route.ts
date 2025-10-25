import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const POST = withContext(async ({ tenantDb }, request: Request) => {
  try {
    const body = await request.json()
    const { csvData } = body

    if (!Array.isArray(csvData)) {
      return NextResponse.json({ success: false, error: "Invalid CSV data" }, { status: 400 })
    }

    let imported = 0
    const errors: string[] = []

    for (const row of csvData) {
      try {
        await tenantDb`
          INSERT INTO iso27001_risks (
            risk_id,
            title,
            description,
            category,
            likelihood,
            impact,
            risk_score,
            risk_level,
            status,
            owner,
            treatment_plan,
            residual_risk,
            last_reviewed,
            next_review,
            controls,
            assets,
            residual_likelihood,
            residual_impact,
            existing_controls,
            risk_treatment
          )
          VALUES (
            ${row.risk_id || null},
            ${row.title || null},
            ${row.description || null},
            ${row.category || null},
            ${row.likelihood || null},
            ${row.impact || null},
            ${row.risk_score || null},
            ${row.risk_level || null},
            ${row.status || null},
            ${row.owner || null},
            ${row.treatment_plan || null},
            ${row.residual_risk || null},
            ${row.last_reviewed || null},
            ${row.next_review || null},
            ${row.controls || "{}"},
            ${row.assets || "{}"},
            ${row.residual_likelihood || null},
            ${row.residual_impact || null},
            ${row.existing_controls || "{}"},
            ${row.risk_treatment || null}
          )
        `
        imported++
      } catch (err: any) {
        console.error("Error importing row:", err)
        errors.push(`Row failed: ${row.title || "Untitled"} (${err.message})`)
      }
    }

    return NextResponse.json({ success: true, imported, errors })
  } catch (err) {
    console.error("Import error:", err)
    return NextResponse.json({ success: false, error: "Failed to import risks" }, { status: 500 })
  }
})
