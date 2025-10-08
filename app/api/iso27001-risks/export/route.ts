import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

// Keep the full canonical column order here:
const HEADERS = [
  "id",
  "risk_id",
  "title",
  "description",
  "category",
  "likelihood",
  "impact",
  "risk_score",
  "risk_level",
  "status",
  "owner",
  "treatment_plan",
  "residual_risk",
  "last_reviewed",
  "next_review",
  "controls",
  "assets",
  "created_at",
  "updated_at",
  "residual_likelihood",
  "residual_impact",
  "control_assessment",
  "risk_treatment",
] as const

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    // Always export EVERYTHING — ignore any query params
    const rows = await tenantDb`
      SELECT
        id,
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
        created_at,
        updated_at,
        residual_likelihood,
        residual_impact,
        control_assessment,
        risk_treatment
      FROM iso27001_risks
      ORDER BY created_at DESC
    ` as Record<string, any>[]

    const escapeCell = (val: any) => {
      if (val === null || val === undefined) return ""
      const s = val instanceof Date ? val.toISOString() : String(val)
      const needsQuotes = /[",\n\r]/.test(s)
      const safe = s.replace(/"/g, '""')
      return needsQuotes ? `"${safe}"` : safe
    }

    const csv = [
      HEADERS.join(","), // header row
      ...rows.map((row: Record<string, any>) =>
        HEADERS.map((h) => escapeCell(row[h])).join(",")
      ),
    ].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="iso27001-risks-${new Date()
          .toISOString()
          .split("T")[0]}.csv"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (err: any) {
    console.error("Failed to export ISO27001 risks:", err)
    return NextResponse.json(
      { success: false, error: err?.message ?? "Failed to export ISO27001 risks" },
      { status: 500 }
    )
  }
})
