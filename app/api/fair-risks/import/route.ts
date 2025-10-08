import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


interface FairRiskImportData {
  risk_title: string
  risk_description?: string
  asset_id?: string
  threat_actor?: string
  threat_capability?: number
  threat_motivation?: number
  control_strength?: number
  vulnerability_score?: number
  loss_event_frequency_min?: number
  loss_event_frequency_most_likely?: number
  loss_event_frequency_max?: number
  primary_loss_min?: number
  primary_loss_most_likely?: number
  primary_loss_max?: number
  secondary_loss_min?: number
  secondary_loss_most_likely?: number
  secondary_loss_max?: number
  annual_loss_expectancy?: number
  risk_tolerance?: number
  treatment_plan?: string
  treatment_status?: string
  treatment_due_date?: string
}

export const POST = withContext(async( { tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const { data } = body

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Invalid data format. Expected array of FAIR risk objects." }, { status: 400 })
    }

    const results = []
    const errors = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as FairRiskImportData
      try {
        // Validate required fields
        if (!row.risk_title || typeof row.risk_title !== "string" || row.risk_title.trim().length === 0) {
          errors.push(`Row ${i + 1}: Risk title is required`)
          continue
        }

        // Validate numeric fields
        const numericFields = [
          "threat_capability",
          "threat_motivation",
          "control_strength",
          "vulnerability_score",
          "loss_event_frequency_min",
          "loss_event_frequency_most_likely",
          "loss_event_frequency_max",
          "primary_loss_min",
          "primary_loss_most_likely",
          "primary_loss_max",
          "secondary_loss_min",
          "secondary_loss_most_likely",
          "secondary_loss_max",
          "annual_loss_expectancy",
          "risk_tolerance",
        ]

        for (const field of numericFields) {
          if (row[field as keyof FairRiskImportData] !== undefined && row[field as keyof FairRiskImportData] !== null) {
            const value = Number(row[field as keyof FairRiskImportData])
            if (isNaN(value)) {
              errors.push(`Row ${i + 1}: ${field} must be a valid number`)
              continue
            }
            ;(row as any)[field] = value
          }
        }

        // Validate threat capability, motivation, control strength, vulnerability (1-10 scale)
        const scaleFields = ["threat_capability", "threat_motivation", "control_strength", "vulnerability_score"]
        for (const field of scaleFields) {
          const value = row[field as keyof FairRiskImportData] as number
          if (value !== undefined && value !== null && (value < 1 || value > 10)) {
            errors.push(`Row ${i + 1}: ${field} must be between 1 and 10`)
            continue
          }
        }

        // Validate treatment status
        const validStatuses = ["identified", "assessed", "treated", "monitored", "accepted"]
        if (row.treatment_status && !validStatuses.includes(row.treatment_status.toLowerCase())) {
          errors.push(`Row ${i + 1}: Invalid treatment status. Must be one of: ${validStatuses.join(", ")}`)
          continue
        }

        // Validate date format
        let asset_id: number | null = null;
        if (row.asset_id) {
          // by ID
          let rawAssetResult = await tenantDb`
            SELECT id FROM information_assets WHERE id = ${row.asset_id}
          `;
          // ✅ runtime check
          if (!Array.isArray(rawAssetResult)) throw new Error("Unexpected DB result");
          let assetResult = rawAssetResult as Record<string, any>[];

          if (assetResult.length === 0) {
            // by name
            const rawAlt = await tenantDb`
              SELECT id FROM information_assets WHERE asset_name = ${row.asset_id}
            `;
            // ✅ runtime check
            if (!Array.isArray(rawAlt)) throw new Error("Unexpected DB result");
            assetResult = rawAlt as Record<string, any>[];
          }

          if (assetResult.length > 0) {
            asset_id = assetResult[0].id;
          }
        }

        // Generate a unique risk ID
        const riskIdResult = await tenantDb`
          SELECT COALESCE(MAX(CAST(SUBSTRING(risk_id FROM 6) AS INTEGER)), 0) + 1 as next_id
          FROM fair_risks 
          WHERE risk_id LIKE 'FAIR-%'
        ` as Record<string, any>[]
        const nextId = riskIdResult[0]?.next_id || 1
        const riskId = `FAIR-${nextId.toString().padStart(4, "0")}`

        // Calculate ALE if not provided
        let annual_loss_expectancy = row.annual_loss_expectancy
        if (
          !annual_loss_expectancy &&
          row.loss_event_frequency_most_likely &&
          (row.primary_loss_most_likely || row.secondary_loss_most_likely)
        ) {
          const frequency = row.loss_event_frequency_most_likely || 0
          const primaryLoss = row.primary_loss_most_likely || 0
          const secondaryLoss = row.secondary_loss_most_likely || 0
          annual_loss_expectancy = frequency * (primaryLoss + secondaryLoss)
        }

        const result = await tenantDb`
          INSERT INTO fair_risks (
            risk_id,
            risk_title,
            risk_description,
            asset_id,
            threat_actor,
            threat_capability,
            threat_motivation,
            control_strength,
            vulnerability_score,
            loss_event_frequency_min,
            loss_event_frequency_most_likely,
            loss_event_frequency_max,
            primary_loss_min,
            primary_loss_most_likely,
            primary_loss_max,
            secondary_loss_min,
            secondary_loss_most_likely,
            secondary_loss_max,
            annual_loss_expectancy,
            risk_tolerance,
            treatment_plan,
            treatment_status,
            treatment_due_date,
            created_at,
            updated_at
          ) VALUES (
            ${riskId},
            ${row.risk_title.trim()},
            ${row.risk_description?.trim() || null},
            ${asset_id},
            ${row.threat_actor?.trim() || null},
            ${row.threat_capability || null},
            ${row.threat_motivation || null},
            ${row.control_strength || null},
            ${row.vulnerability_score || null},
            ${row.loss_event_frequency_min || null},
            ${row.loss_event_frequency_most_likely || null},
            ${row.loss_event_frequency_max || null},
            ${row.primary_loss_min || null},
            ${row.primary_loss_most_likely || null},
            ${row.primary_loss_max || null},
            ${row.secondary_loss_min || null},
            ${row.secondary_loss_most_likely || null},
            ${row.secondary_loss_max || null},
            ${annual_loss_expectancy || null},
            ${row.risk_tolerance || null},
            ${row.treatment_plan?.trim() || null},
            ${row.treatment_status?.toLowerCase() || "identified"},
            ${row.treatment_due_date || null},
            NOW(),
            NOW()
          )
          RETURNING *
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
    console.error("Failed to import FAIR risks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import FAIR risks",
        imported: 0,
        errors: [],
      },
      { status: 500 },
    )
  }
})
